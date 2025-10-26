const mypassport = require('passport');
const controller = require('app/http/controllers/controller');
// const {validationResult} = require('express-validator/check');

module.exports = new class registerController extends controller {
    showRegisterationForm(req,res){
        const title='صفحه ثبت نام';
        res.render('home/auth/register.ejs', {
        showRecaptcha : this.myrecaptcha.render(),
        title
        });
    }

    async registerProcess(req,res,next){
       await this.recaptchaValidation(req,res);
          let result = await this.validationData(req)
            if (result) return (this.register(req,res,next));
             this.back(req,res);
    }


    register(req,res,next){
        mypassport.authenticate('local.register', {
            successRedirect:'/' ,
            failureRedirect:'/auth/register' ,
            failureFlash: true
        })(req,res,next)
    }
}