const Course = require('app/models/course.js');
const Comment = require('app/models/comment.js');
const controller = require('app/http/controllers/api/controller.js');
const Episode = require('app/models/episode.js');
const passport = require('passport');//newwwwwwwwww

class courseController extends controller{
    async courses(req, res, next){
        try {
            let page = req.query.page || 1;
            let courses = await Course.paginate({},
                {page, sort: {createdAt: 1}, limit: 12,
                    populate : [{ path: 'categories'}, { path: 'user'}]});
            res.status(200).json({
                data : this.filterCoursesData(courses),//newww
                status : 'sucess'
            });
        } catch (error) {
          this.failed(error.message, res);
        }
    }
    filterCoursesData(courses){
      return  {
            ...courses,
            docs: courses.docs.map(course => {
                return {
                    id: course.id ,
                    title : course.title,
                    slug : course.slug ,
                    body : course.body ,
                    image : course.thumb ,
                    price : course.price ,
                    createdAt: course.createdAt ,
                    categories : course.categories.map(cate =>{
                        return {
                            name : cate.name ,
                            slug : cate.slug
                        }
                    }),
                    user : {
                        id : course.user.id ,
                        name : course.user.name
                }
            }
            })
        }
    }
    async singleCourse(req, res){
        try{
            let course = await Course.findByIdAndUpdate(req.params.course ,
                {$inc: { viewCount : 1}})
                .populate([
                    { path: 'user' , select: 'name'},
                    { path: 'episodes',options: { sort: {number: 1} } },
                    { path: 'categories' , select: 'name slug'}
                ]);
            if(!course) return this.failed('چنین دوره ای یافت نشد',
                res, 404);
            passport.authenticate('jwt', { session : false},
                (error, user, info)=>{
                    res.json({
                        data : this.filterCourseData(course, user),//newwwwwwwwwwww
                        status : 'success'
                    })
                })(req,res)

        } catch(error){
            this.failed(error.message, res);
        }
    }

     filterCourseData(course, user){
            return {
                id: course.id ,
                title : course.title,
                slug : course.slug ,
                body : course.body ,
                image : course.thumb ,
                episodes :course.episodes.map(episode =>{
                    return {
                        time : episode.time,
                        downloadCount : episode.downloadCount,
                        viewCount : episode.viewCount,
                        commentCount : episode.commentCount,
                        id : episode.id,
                        title : episode.title,
                        body : episode.body,
                        type : episode.type,
                        number : episode.number,
                        createdAt : episode.createdAt,
                        DOWNLOAD : episode.download(!!user, user)
                    }
                }) ,
                price : course.price ,
                createdAt: course.createdAt ,
                categories : course.categories.map(cate =>{
                    return {
                        name : cate.name ,
                        slug : cate.slug
                    }
                }),
                user : {
                    id : course.user.id ,
                    name : course.user.name
                }
            }
    }

    async commentForSingleCourse(req, res){
        try{
            let comments = await Comment.find({course :req.params.course,
                parent : null, approved : true })
                .populate([
                    {
                        path : 'user', select : 'name'
                    },
                    {
                        path : 'comments', match: {approved: true}
                        ,
                        populate :{
                            path: 'user', select : 'name'
                        }
                    }
                ]);
            return res.json(comments);
        } catch(error){
            this.failed(error.message, res)
        }
    }
}
module.exports = new courseController();