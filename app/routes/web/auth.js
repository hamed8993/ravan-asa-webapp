 const express = require("express");
const router = express.Router();
 const passport = require('passport');
 //controllers:
 const loginController = require("app/http/controllers/auth/loginController.js");
const registerController = require("app/http/controllers/auth/registerController");
const forgotPasswordController = require('app/http/controllers/auth/forgotPasswordController.js');
const resetPasswordController = require('app/http/controllers/auth/resetPasswordController.js');
//validators:
const registerValidator = require("app/http/validators/registerValidator");
const loginValidator = require("app/http/validators/loginValidator");
const forgotPasswordValidator  = require('app/http/validators/forgotPasswordValidator');
const resetPasswordValidator = require('app/http/validators/resetPasswordValidator');

router.get('/register', registerController.showRegisterationForm);
router.post('/register', registerValidator.handle(), registerController.registerProcess);

router.get('/login', loginController.showLoginForm);
router.post('/login', loginValidator.handle(), loginController.loginProcess);

//routers for GOOGLE API :
 router.get('/google', passport.authenticate('google',
     { scope : [ 'profile' , 'email']}));
 router.get('/google/callback',
                passport.authenticate('google',
                    { successRedirect: '/', failureRedirect: '/register'}) );

//routes for forget passwords:
 router.get('/password/reset', forgotPasswordController.showForgotPassword);
 router.post('/password/email', forgotPasswordValidator.handle(),
     forgotPasswordController.sendPasswordResetLink);

router.get('/password/reset/:token',
    resetPasswordController.showResetPassword);
router.post('/password/reset',resetPasswordValidator.handle(),
    resetPasswordController.resetPasswordProcess);

module.exports = router;