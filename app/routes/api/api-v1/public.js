const express= require('express');
const router= express.Router();
const CourseController =
    require('app/http/controllers/api/v1/courseController.js');
router.get('/courses/:course',
    CourseController.singleCourse);
router.get('/courses', CourseController.courses);

router.get('/courses/:courses/comment',
    CourseController.commentForSingleCourse);

//for section 56 , jwt :
const AuthController =
    require('app/http/controllers/api/v1/authController.js');
const loginValidator = require('app/http/validators/loginValidator');
router.post('/login',loginValidator.handle(), AuthController.login);


module.exports = router;