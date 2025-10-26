const controller = require('app/http/controllers/controller');
const mypassport = require('passport');
const PasswordReset = require('app/models/password-reset');// برا نوشتن کارکردsendResetLink که اولش res.json('reset');  بود.
const User = require('app/models/user.js');// برا نوشتن کارکردsendResetLink که اولش res.json('reset');  بود.
const uniqueString = require('unique-string');// برا نوشتن کارکردsendResetLink که اولش res.json('reset');  بود.
module.exports = new class resetPasswordController extends controller {
    showResetPassword(req,res) {
        res.render('home/auth/passwords/reset.ejs', {
                showRecaptcha: this.myrecaptcha.render(),
                title : 'بازیابی رمز عبور',
            token : req.params.token
            }
        );
    }
    async resetPasswordProcess(req,res, next){
        await this.recaptchaValidation(req,res);
        let result = await this.validationData(req);
        if(result){
            return this.resetPassword(req,res);
        }
        this.back(req,res);
    }
    async resetPassword(req,res){
        let field = await PasswordReset.findOne({
            $and : [ { email : req.body.email }, { token : req.body.token } ]});
        if(! field) {
            req.flash('errors' , 'اطلاعات وارد شده صحیح نیست لطفا دقت کنید');
            return this.back(req,res);
        }
        if(field.use) {
            req.flash('errors' , 'از این لینک برای بازیابی پسورد قبلا استفاده شده است');
            return this.back(req, res);
        }
        let user = await User.findOne({ email : field.email });
        user.$set({ password : user.hashPassword(req.body.password) });
        await user.save();
        if(! user) {
            req.flas('errors' , 'اپدیت شدن انجام نشد');
            return this.back();
        }
        await field.update({ use : true});
        this.alert(req, {
            title : 'وضعیت بازیابی رمز عبور',
            message : 'رمز شما با موفقیت به رمز جدید تغییر یافت.',
            type : 'success',
            button : 'متوجه شدم.'
        });
        return  res.redirect('/auth/login');
    }
}