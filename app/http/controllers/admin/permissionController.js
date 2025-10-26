const controller = require('app/http/controllers/controller.js');
const Permission = require('app/models/permission.js');
module.exports = new class permissionController extends controller {
    async index(req,res,next){
        try {
            let page = req.query.page || 1 ;
            let permissions = await Permission.paginate({},
                {page:page ,sort: {createdAt: -1}, limit : 10 });
            res.render('admin/permissions/index.ejs', {title: 'لیست اجازه دسترسی', permissions});
        } catch(error){
            next(error);
        }
    }
    async create(req,res){
        res.render('admin/permissions/create.ejs');
    }
    async store(req,res, next){
        try{
            let status = await this.validationData(req);
            if(! status ) return this.back(req, res);
            let {name , label } = req.body ;
            let newPermission = new Permission({
                name, label
            });
            await newPermission.save();
            return res.redirect('/admin/users/permissions');
        } catch(error){
            next(error);
        }
    }
    async edit(req,res, next){
        try {
            this.isMongoId(req.params.id);
            let permission =await Permission.findById(req.params.id);
            if(! permission) this.error('چنین اجازه ای وجود ندارد.',404);
            return res.render('admin/permissions/edit.ejs', { permission });
        } catch(error){
            next(error);
        }
    }
    async update(req,res,next){
        try {
            let status = await this.validationData(req);
            if(! status ) return this.back(req, res);
            let {name , label } = req.body;
            await Permission.findByIdAndUpdate(req.params.id ,{
                $set : { name, label }
            });
            return res.redirect('/admin/users/permissions');
        } catch(error){
            next(error);
        }
    }
    async destroy(req, res, next){
        try {
            this.isMongoId(req.params.id);
            // return res.json('ok');
            let permission = await Permission.findById(req.params.id).exec();
            if(!permission) this.error('چنین اجازه ای وجود ندارد.',404);
            permission.remove();
            return res.redirect('/admin/users/permissions')
        } catch(error){
            next(error);
        }
    }
}