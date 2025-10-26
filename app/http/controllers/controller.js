const autoBind = require('auto-bind');
const Recaptcha = require('express-recaptcha').Recaptcha;
const {validationResult} = require("express-validator/check");
const isMongoId = require('validator/lib/isMongoId');
const sprintf = require('sprintf-js').sprintf;

module.exports = class controller {
    constructor(){
        autoBind(this);
        this.recaptchaConfig();
    }
    recaptchaConfig(){
        this.myrecaptcha = new Recaptcha(
            config.service.recaptcha.client_key,
            config.service.recaptcha.secret_key,
            {...config.service.recaptcha.options }
        );
    };
    recaptchaValidation(req,res){
        return new Promise((resolve, reject)=>{
            this.myrecaptcha.verify(req,(err, data)=>{
                if(err){
                    req.flash('errors', 'فیلتر امنیتی روبات ریکپچا خاموشه. مجدد امتحان کنید.');
                    // console.log('****--url>>>>>>>>>>', req.url);
                    // console.log('****--originalUrl>>>>>>>>>>', req.originalUrl);
                    this.back(req,res);
                        } else resolve(true);
            })
        })
    }
    async validationData(req){
        const result = validationResult(req);
        if(!result.isEmpty()) {// true: ERROR NOT Exist.   /   false:ERROR Exist.
            const errors = result.array();
            if (errors.length == 0) return true;
            const messages = [];
            errors.forEach(er => messages.push(er.msg));
            req.flash('errors', messages);
            return false;
        }
        return true // -> result is NOT Exist
    }
    back(req,res) {
        req.flash('formData', req.body);
        return res.redirect(req.header('Referer') || '/');
    }
    isMongoId(paramId){
       if(! isMongoId(paramId)) this.error('آی دی وارد شده صحیح نیست.',404);
    }
    error(message,status = 500 ){
        let error = new Error(message);
        error.statusCode = status;
        throw error;
    }
    getTime(episodes){
        let second = 0;
        episodes.forEach(episode=>{
        let time = episode.time.split(':');
        if(time.length=== 2){
            second += parseInt(time[0])*60 ;
            second += parseInt(time[1]);
        } else if (time.length=== 3){
            second += parseInt(time[0])*3600 ;
            second += parseInt(time[1])*60;
            second += parseInt(time[2]);
        }
        });
        let minutes = Math.floor(second / 60 );
        let hours = Math.floor(minutes / 60 );
        minutes -= hours * 60 ;
        second = Math.floor(( (second / 60 )%1 )*60 );
        return sprintf('%02d:%02d:%02d',hours,minutes,second)
    }
    slug(title) {
        return title.replace(/([^0-9۰-۹a-zآ-ی]|-)+/g , "-");
    }
    alert(req, data){
        let title   = data.title || '',
            message = data.message || '',
            type    = data.type || 'info',
            button  = data.button || null,
            timer   = data.timer || 2000;
        req.flash('sweetalert', {title,message,type,button,timer});
    }
    alertAndBack(req,res,data){
        this.alert(req,data);
        this.back(req,res);
    }
}