const multer = require('multer');
const mkdirp = require('mkdirp');
const fs = require('fs');
const User = require('app/models/user.js');
const Course = require('app/models/course.js');

const getDirImage = ()=>{
    let year = new Date().getFullYear() ;
    let month = new Date().getMonth() +1 ;
    let day = new Date().getDay() ;
    return `./public/uploads/images/${year}/${month}/${day}`;
}
let imageDir = '';
const ImageStorage = multer.diskStorage({
    destination: async (req,file, cb)=>{//مربوط به مکان ذخیره سازی
      let course_name = '', user_name='';
      if(req.headers.referer.substr(22,4)=='user'){
          let user =await User.findById(req.params.id);
          user_name =await user.name;
           imageDir =await    getDirImage().replace('images',
               `images/users/${user_name}`);
      }else if(req.headers.referer.substr(22,5)=='admin'){
              if(req.query._method == 'put'){
                  let course = await Course.findById(req.params.id);
                  course_name =await course.slug
              }else {
                  course_name =await req.body.title;
              }
          imageDir =await  getDirImage().replace('images',
              `images/courses/${course_name}`);
      }
        mkdirp(imageDir,(error)=> cb(null, imageDir));
        },
    filename : (req,file, cb)=> {
        let filePath = imageDir + '/' + file.originalname;
        if(!fs.existsSync(filePath))
            cb(null, file.originalname);
        else
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const uploadImage = multer({
             storage : ImageStorage,
             limits : { fileSize : 1024 * 1024 * 10}// max 10 Mega Byte.
});
module.exports = uploadImage;
