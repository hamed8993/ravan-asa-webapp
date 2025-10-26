const {check} = require('express-validator/check');
const validator = require('./validator.js');
module.exports = new class episodeValidator extends validator {
        handle(){
            return [
              check('title')
                  .isLength( { min: 5 })
                  .withMessage('فیلد عنوان نمیتواند کمتر از 5 کرکتر باشد.'),
              check('type')
                  .not().isEmpty()
                  .withMessage('فیلد نوع دوره باید انتخاب شود.'),
              check('course')
                 .not().isEmpty()
                 .withMessage('فیلد دوره ی مربوطه نمیتواند خالی باشد.'),
              check('body')
                  .isLength( { min: 10 })
                  .withMessage('متن نمیتواند کمتر از 10 کرکتر باشد.'),
                check('videoUrl')
                    .not().isEmpty()
                    .withMessage('لینک دانلود نمیتواند خالی بماند.'),
                check('number')
                    .not().isEmpty()
                    .withMessage('شماره جلسه نمیتواند خالی بماند.'),
            ]
        }
}