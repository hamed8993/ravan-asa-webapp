const {check} = require('express-validator/check');
const validator = require('./validator.js');

module.exports = new class registerValidator extends validator {
        handle(){
            return [
              check('name')
                  .isLength( { min: 5 })
                  .withMessage('نام نمیتواند کمتر از 4 کرکتر باشد.'),
              check('email')
                  .isEmail()
                  .withMessage('ایمیل معتبر نیست.'),
              check('password')
                  .isLength( { min: 8 })
                  .withMessage('پسورد نمیتواند کمتر از 8 کرکتر باشد.')
            ]
        }
}