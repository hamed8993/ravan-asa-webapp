const {check} = require('express-validator/check');
const validator = require('./validator.js');

module.exports = new class loginValidator extends validator {
    handle(){
        return [
            check('email')
                .isEmail()
                .withMessage('ایمیل معتبر نیست.'),
            check('password')
                .isLength( { min: 8 })
                .withMessage('پسورد نمیتواند کمتر از 8 کرکتر باشد.')
        ]
    }
}