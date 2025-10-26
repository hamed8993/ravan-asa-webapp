const controller = require('app/http/controllers/controller.js');
const Course = require('app/models/course.js');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const Category = require('app/models/category.js');

module.exports = new class courseController extends controller {
    async index(req,res,next){
        try {
            let page = req.query.page || 1 ;
            let courses = await Course.paginate({}, {page:page ,sort: {createdAt: -1}, limit : 20});
            // return res.json(courses);
            res.render('admin/courses/index.ejs', {title: 'دوره ها', courses});
        } catch(error){
            next(error);
        }
    }
    async create(req,res){ // از خودم درست کردم. لاین 20 و ارسال متغیر تعریف شده به ویوش:
        let categories = await Category.find({});
        res.render('admin/courses/create.ejs', { categories });
    }
    async store(req,res, error){
       try{
           let status = await this.validationData(req);
           if(! status ) {
               if (req.file)
                   // console.log('>>>>',req.file.path)
                   fs.unlinkSync(req.file.path);
               return this.back(req, res);
           }
           let images = this.imageResize(req.file);//****
           let {title, body, type, price, tags} = req.body;//*****
           let newCourse = new Course({
               user : req.user._id,
               title, slug : this.slug(title),
               body, type, price, tags, images, thumb: images[480]
           });
           await newCourse.save();
           return res.redirect('/admin/courses');
       } catch(error){
           next(error);
       }
    }

    async edit(req,res, next){
      try {
          this.isMongoId(req.params.id);
          let course =await Course.findById(req.params.id);
          if(! course) this.error('چنین دوره ای وجود ندارد.',404);
          // req.courseUserId = course.user;
          // if(!req.userCan('edit-courses')){
          //     this.error('شما مجوز دسترسی بدین دوره رو ندارید',403);
          // }
          let categories = await Category.find({});
          return res.render('admin/courses/edit.ejs', {course, categories});
      } catch(error){
          next(error);
      }
    }
    async update(req,res,next){
       try {
           let status = await this.validationData(req);
           if(! status ) {
               if (req.file)
                   fs.unlinkSync(req.file.path);
               return this.back(req, res);
           }
           // return res.json(req.body);
           let objForUpdate = {};
           objForUpdate.thumb = req.body.imagesThumb;
           if(req.file){objForUpdate.images = this.imageResize(req.file);
               objForUpdate.thumb = objForUpdate.images[480]; }
           delete req.body.images;
           objForUpdate.slug = this.slug(req.body.title);
           await Course.findByIdAndUpdate(req.params.id , {$set : {...req.body, ...objForUpdate}});
           return res.redirect('/admin/courses');
       } catch(error){
           next(error);
       }
    }
    async destroy(req, res, next){
       try {
           this.isMongoId(req.params.id);
           let course = await Course.findById(req.params.id);
           if(!course)this.error('چنین دوره ای وجود ندارد.',404);
// delete episodes
           //حذف اپیوزدا برا بعد. چون هنوز اپیزودی ایجاد نشده!
//delete images
           Object.values(course.images).forEach(image => fs.unlinkSync(`./public${image}`) );
// delete courses
           course.remove();
           res.redirect('/admin/courses')
       } catch(error){
           next(error);
       }
    }
    imageResize(image){
        const imageInfo = path.parse(image.path);
        let addresImages = {};
        addresImages['original'] = this.getUrlImage(`${image.destination}/${image.filename}`);
        const resize = size =>{
            let imageName = `${imageInfo.name}-${size}${imageInfo.ext}`;
            // console.log("imageName>>>",imageName);
            addresImages[size] = this.getUrlImage(`${image.destination}/${imageName}`);
            sharp(image.path)
                .resize(size,null)
                .toFile(`${image.destination}/${imageName}`);
        }
        [1080,720,480].map(resize);
        // console.log("addresImages>>>>",addresImages);
        return addresImages;

    }
    getUrlImage(dir){
            return dir.substring(8);
    }

}