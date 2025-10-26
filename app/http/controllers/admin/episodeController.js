const controller = require('app/http/controllers/controller.js');
const Course = require('app/models/course.js');
const Episode = require('app/models/episode.js');
module.exports = new class episodeController extends controller {
    async index(req,res,next){
        // return res.json(await this.updateCourseTime('6298f20bcdeb6d0b5428ee24') );
        try {
            let page = req.query.page || 1 ;
            let episodes = await Episode.paginate({},
                {page:page ,sort: {createdAt: -1}, limit : 2});
            res.render('admin/episodes/index.ejs', {title: 'ویدیوها', episodes});
        } catch(error){
            next(error);
        }
    }
    async create(req,res){
        let courses = await Course.find({});//ای سینک بهش افزوده شد + یافتن کورس....
        res.render('admin/episodes/create.ejs', { courses });// ارسال کورس ها افزوده شد.....
    }
    async store(req,res, next){
       try{
           let status = await this.validationData(req);
           if(! status ) return this.back(req, res);
           let newEpisode = new Episode({ ...req.body });
           await newEpisode.save();
           //update course Time...
           this.updateCourseTime(req.body.course);
           return res.redirect('/admin/episodes');
       } catch(error){
           next(error);
       }
    }
    async edit(req,res, next){
      try {
          this.isMongoId(req.params.id);
          let episode =await Episode.findById(req.params.id);
          let courses =await Course.find({});
          if(! episode) this.error('چنین ویدیو ای وجود ندارد.',404);
          return res.render('admin/episodes/edit.ejs', { episode, courses });
      } catch(error){
          next(error);
      }
    }
    async update(req,res,next){
       try {
           let status = await this.validationData(req);
           if(! status ) return this.back(req, res);
          let episode = await Episode.findByIdAndUpdate(req.params.id ,
              {$set : {...req.body }});
          //آپدیت کردن تایم کورس
           //pre course time update:
            this.updateCourseTime(episode.course);
            //new course time update:
           this.updateCourseTime(req.body.course);
           return res.redirect('/admin/episodes');
       } catch(error){
           next(error);
       }
    }
    async destroy(req, res, next){
       try {
           this.isMongoId(req.params.id);
           let episode = await Episode.findById(req.params.id);
           if(!episode) this.error('چنین ویدیوای وجود ندارد.',404);
            let courseId = episode.course;
           //آپدیت کردن تایم کورس
            episode.remove();
            this.updateCourseTime(courseId);
           return res.redirect('/admin/episodes')
       } catch(error){
           next(error);
       }
    }
    async updateCourseTime(courseId){
        let course = await Course.findById(courseId).populate('episodes').exec();
        course.set({ time: this.getTime(course.episodes) });
        await course.save();
        // return episodes;
    }
}