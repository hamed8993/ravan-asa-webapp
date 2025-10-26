const validator = require('./validator');
const { check } = require('express-validator/check');

module.exports = new class forgotPasswordValidator extends validator {
    handle() {
            return [
                  check('email').
                        isEmail()
                            .withMessage('فیلد ایمیل معتر نیست')
            ]
    }
}
