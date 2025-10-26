const controller = require('app/http/controllers/controller');
const mypassport = require('passport');
const ActivationCode = require('app/models/activationCode.js');
const uniqueString = require('unique-string');
const mail = require('app/helpers/mail');

// const {validationResult} = require("express-validator/check");
module.exports = new class loginController extends controller {
    showLoginForm(req,res) {
        res.render('home/auth/login.ejs', {
            showRecaptcha: this.myrecaptcha.render(),
            title : 'صفحه ی ورود'
            }
        );
    }
  async  loginProcess(req,res, next){
       await this.recaptchaValidation(req,res)
            let result = await this.validationData(req);
                if(result) return (this.login(req,res,next));
                this.back(req,res);
            }
   async login(req, res,next){//modified newwwwww:
            mypassport.authenticate('local.login',async(error,user)=>{
                if(!user) return (res.redirect('/auth/login'));
// for active user lecture 60:
                if(! user.active) {
                let activateCode = await ActivationCode.find({ user : user.id})
                    .gt('expire', new Date()).sort({ createdAt : 1})
                    .populate('user').limit(1).exec();

                if(activateCode.length){
                    this.alertAndBack(req, res, {
                        title : 'توجه کنید',
                        message : 'لینک فعالسازی اکانت، به ایمیلتان ارسال شده. برای ارسال مجدد، لطفا 10 دقیقه صبر کنید!',
                        button : 'متوجه شدم.'
                    });
                    return
                } else {
                    let newActiveCode = new ActivationCode({
                        user: user.id,
                        code: uniqueString(),
                        expire: Date.now() + 1000 * 60 * 10
                    });
                    await newActiveCode.save();
// send active email:
                    let mailOptions = {
                        from: '"مجله آموزشی راکت 👻" <foo@example.com>', // sender address
                        to: `${user.email}`, // list of receivers
                        subject: "فعالسازی اکانت کاربری ✔", // Subject line
                        text: "Hello world?", // plain text body
                        html: `
           <h2> فعالسازی اکانت کاربری راکت:</h2>
           <p>برا فعال شدن حساب کاربری خود، لطفا روی لینک زیر کلیک نمایید:</p>
           <a href="${config.siteurl}/user/activation/${newActiveCode.code}">
           فعال کن!</a>`,
                    };
                    mail.sendMail(mailOptions, (error, info) => {
                        if (error) return console.log(error);
                        this.alert(req, {
                            title: 'دقت نمایید:',
                            message: 'ایمیل حاوی لینک فعالسازی، به ایمیلتان ارسال شد!',
                            type: 'success',
                            button : 'متوجه شدم.'
                        });
                        res.redirect('/');
                    });
                    return
                }
                }
// end active user!
                req.login(user, error =>{
                   if(req.body.remember){// if RMRMBER-BUTTON:CHECKED->"ON" - ELSE: UNDEFINED.
                        user.setRememberToken(res);
                    }
                    return ( res.redirect('/') );
                });
            } )(req,res,next)
    }
}