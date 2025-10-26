const {check} = require('express-validator/check');
const validator = require('./validator.js');
const Course = require('app/models/course.js');
const path = require('path');

module.exports = new class commentValidator extends validator {
        handle(){
            return [
              check('comment')
                  .isLength( { min: 20 })
                  .withMessage('متن نظر نمیتواند کمتر از 20 کرکتر باشد.')
            ]
        }
}