const middleware = require('./middleware.js');
//دو ماژول user و middleware رو ری کیوآر نکرده ام. لازم نیستن اینجا آخه!
module.exports = new class activeUser extends middleware {
    handle(req, res, next) {
        if (req.isAuthenticated()) {
            if(req.user.active) return next();
             this.alert(req, {
                 title : 'توجه:',
                 message : 'اکانت شما فعال نیست. برای فعال سازی، از فورم لاگین اقدام نمایید.',
                 type : 'error',
                 button : 'بسیار خب'
             });
             req.logout();
             res.clearCookie('remember_token');
             res.redirect('/');
        } else {
            next();
        }
    }
}