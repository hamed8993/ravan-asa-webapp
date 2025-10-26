const validator = require('./validator.js');
const {check} = require('express-validator/check');
const Role = require('app/models/role.js');
module.exports = new class roleValidator extends validator {
        handle(){
            return [
              check('name')
                  .isLength( { min: 3 })
                  .withMessage('فیلد عنوان نمیتواند کمتر از 3 کرکتر باشد.')
                .custom(async (value, {req})=>{
                    if(req.query._method === 'put'){
                        let role = await Role.findById(req.params.id);
                        if(role.name == value ) return;
                     }
                        let role = await Role.findOne({name : value});
                       if(role) throw new Error('چنین سطح دسترسی با این عنوان، در سایت موجود است.');
                       }),
              check('label')
                  .not().isEmpty()
                  .withMessage('فیلد توضیح باید انتخاب شود.'),
                check('permissions')
                    .not().isEmpty()
                    .withMessage('فیلد اجازه ی دسترسی باید انتخاب شود.')
            ]
        }
}