const controller = require('app/http/controllers/controller.js');
const Comment = require('app/models/comment.js');

module.exports = new class commentController extends controller {
    async index(req,res,next){
        try {
            let page = req.query.page || 1 ;
            let comments = await Comment.paginate({approved : true},
                {page:page ,sort: {createdAt: -1}, limit : 20,
                    populate: [
                        {
                    path: 'user',
                    select: 'name'
                    },
                        'course',
                        {
                            path: 'episode',
                            populate : [
                                {
                                   path: 'course' ,
                                   select: 'slug'
                                }
                            ]
                        }
                    ]
                });
          // return res.json(comments);
            res.render('admin/comments/index.ejs', {title: 'کامنت ها', comments});
        } catch(error){
            next(error);
        }
    }
    async destroy(req,res,next){
            try {
                this.isMongoId(req.params.id);
                let comment = await Comment.findById(req.params.id);
                if(!comment)this.error('چنین کامنتی وجود ندارد.',404);
                comment.remove();
                return this.back(req,res);
            } catch(error){
                next(error);
            }
    }
    async approved(req,res,next){
        try {
            let page = req.query.page || 1 ;
            let comments = await Comment.paginate({approved : false},
                {page:page ,sort: {createdAt: -1}, limit : 20,
                    populate: [
                        {
                            path: 'user',
                            select: 'name'
                        },
                        'course',
                        {
                            path: 'episode',
                            populate : [
                                {
                                    path: 'course' ,
                                    select: 'slug'
                                }
                            ]
                        }
                    ]
                });
            // return res.json(comments);
            res.render('admin/comments/approved.ejs', {title: 'کامنت های تایید نشده', comments});
        } catch(error){
            next(error);
        }
    }
    async update(req,res,next){
            try{
                this.isMongoId(req.params.id);
                let comment = await Comment.findById(req.params.id).populate('belongTo').exec();
                if(!comment)this.error('چنین کامنتی وجود ندارد.',404);
                await comment.belongTo.inc('commentCount');

                comment.approved = true;
                await comment.save();

                return this.back(req,res);
            } catch (error){
                next(error);
            }
        }
}