const validator = require('./validator');
const { check } = require('express-validator/check');
module.exports = new class resetPasswordValidator extends validator {
    handle() {
            return [
                  check('email').
                        isEmail()
                            .withMessage('فیلد ایمیل معتر نیست.'),
                check('token')
                    .not().isEmpty()
                    .withMessage('فیلد توکن الزامیست.'),
                check('password')
                    .isLength({ min: 8})
                    .withMessage('فیلد پسور نمیتونه کمتر از 8 کرکتر باشه.')
            ]
    }
}
