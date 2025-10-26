const validator = require('./validator.js');
const {check} = require('express-validator/check');
const Permission = require('app/models/permission.js');
module.exports = new class permissionValidator extends validator {
        handle(){
            return [
              check('name')
                  .isLength( { min: 3 })
                  .withMessage('فیلد عنوان نمیتواند کمتر از 3 کرکتر باشد.')
                .custom(async (value, {req})=>{
                    if(req.query._method === 'put'){
                        let permission = await Permission.findById(req.params.id);
                        if(permission.name == value ) return;
                     }
                        let permission = await Permission.findOne({name : value});
                       if(permission) throw new Error('چنین اجازه ای با این عنوان، در سایت موجود است.');
                       }),
              check('label')
                  .not().isEmpty()
                  .withMessage('فیلد توضیح باید انتخاب شود.')
            ]
        }
}