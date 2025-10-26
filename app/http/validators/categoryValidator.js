const validator = require('./validator.js');
const {check} = require('express-validator/check');
const Category = require('app/models/category.js');

module.exports = new class categoryValidator extends validator {
        handle(){
            return [
              check('name')
                  .isLength( { min: 3 })
                  .withMessage('فیلد عنوان نمیتواند کمتر از 3 کرکتر باشد.')
                .custom(async (value, {req})=>{
                    if(req.query._method === 'put'){
                        let category = await Category.findById(req.params.id);
                        if(category.slug == value ) return;
                     }
                        let category = await Category.findOne({slug : this.slug(value)});
                       if(category) throw new Error('چنین دسته ای با این عنوان، در سایت موجود است.');
                       }),
              check('parent')
                  .not().isEmpty()
                  .withMessage('فیلد پدر دسته باید انتخاب شود.')
            ]
        }

        slug(title){
            return title.replace(/([^0-9۰-۹a-zآ-ی]|-)+/g , "-");
        }
}