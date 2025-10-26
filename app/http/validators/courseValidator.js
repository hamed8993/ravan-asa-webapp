const {check} = require('express-validator/check');
const validator = require('./validator.js');
const Course = require('app/models/course.js');
const path = require('path');// newwwwwwwwwwwww

module.exports = new class courseValidator extends validator {
        handle(){
            return [
              check('title')
                  .isLength( { min: 5 })
                  .withMessage('فیلد عنوان نمیتواند کمتر از 5 کرکتر باشد.')
                .custom(async (value, {req})=>{
                    if(req.query._method === 'put'){
                        let course = await Course.findById(req.params.id);
                        if(course.title === value) return;
                    }
                        let course = await Course.findOne({slug : this.slug(value)});
                       if(course) throw new Error('چنین دوره ای با این عنوان، در سایت موجود است.');
                       }),
                check('images')
                    .custom(async (value,{req}) => {
                        if(req.query._method==='put' && value === undefined ) return;
                    if(!value) throw new Error('وارد کردن تصویر الزامیست.');
                        let fileExt = ['.png', '.jpg', '.jpeg', '.svg'];
                        if(! fileExt.includes(path.extname(value)))
                            throw new Error ('پسوند فایل وارد شده، تصویر نمی باشد. دقت فرمایید.')
                    }),
              check('type')
                  .not().isEmpty()
                  .withMessage('فیلد نوع دوره باید انتخاب شود.'),
              check('body')
                  .isLength( { min: 10 })
                  .withMessage('متن نمیتواند کمتر از 10 کرکتر باشد.'),
                check('price')
                    .not().isEmpty()
                    .withMessage('فیلد قیمت نمیتواند خالی بماند.'),
                check('tags')
                    .not().isEmpty()
                    .withMessage('فیلد تگ ها نمیتواند خالی بماند.'),
            ]
        }
    slug(title) {
        return title.replace(/([^0-9۰-۹a-zآ-ی]|-)+/g , "-");
    }
}