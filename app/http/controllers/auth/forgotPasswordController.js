const controller = require('app/http/controllers/controller');
const PasswordReset = require('app/models/password-reset');// برا نوشتن کارکردsendResetLink که اولش res.json('reset');  بود.
const User = require('app/models/user.js');// برا نوشتن کارکردsendResetLink که اولش res.json('reset');  بود.
const uniqueString = require('unique-string');// برا نوشتن کارکردsendResetLink که اولش res.json('reset');  بود.
const mail = require('app/helpers/mail.js');

module.exports = new class forgotPasswordController extends controller {
    showForgotPassword(req,res) {
        res.render('home/auth/passwords/email.ejs', {
            showRecaptcha: this.myrecaptcha.render(),
            title : 'فراموشی رمز عبور' });
    }
   async sendPasswordResetLink(req,res, next){
       await this.recaptchaValidation(req,res);
       let result = await this.validationData(req);
          if(result) return this.sendResetLink(req, res, next);
             this.back(req,res);
    }
   async sendResetLink(req,res, next){
       let user = await User.findOne({email: req.body.email});
       if(!user) {
           req.flash('errors', 'چنین کاربری وجود ندارد');
           return( this.back(req,res));
       }
       const newPasswordReset = new PasswordReset({
           email : req.body.email,
           token: uniqueString()
       });
      await newPasswordReset.save();
       let mailOptions = {
           from: '"مجله آموزشی راکت 👻" <foo@example.com>', // sender address
           to: `${newPasswordReset.email}`, // list of receivers
           subject: "ریست کردن پسورد ✔", // Subject line
           text: "Hello world?", // plain text body
           html: `
           <h2> ریست کردن پسورد:</h2>
           <p>برا ریست کردن پسورد، روی لینک زیر کلیک نمایید:</p>
           <a href="${config.siteurl}/auth/password/reset/${newPasswordReset.token}">
           ریست کن!</a>
           `, // html body
       };
       mail.sendMail(mailOptions,(error, info)=>{
        if(error) return console.log(error);
        console.log('message>>>', info.messageId);
        this.alert(req, {
            title : 'دقت نمایید:',
            message : 'ایمیل حاوی پسورد به ایمیلتان ارسال شد!',
            type : 'success'
        });
         res.redirect('/');
       });
       this.alert(req, {
           title: 'وضعیت ارسال لینک',
           message: 'پیامی حاوی لینک پسورد به ایمیلتان ارسال شد.',
           type: 'success',
           button: 'بسیار خب.'
       });
       return res.redirect('/');
   }
}