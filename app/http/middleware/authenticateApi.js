const passport = require('passport');

module.exports = new class authenticateApi {
    handle(req,res,next){
        passport.authenticate('jwt', { session : false},
            (error, user, info)=>{
            if(error || !user )
                return res.status(401).json({
                    data : info.message || 'اجازه ی دسترسی ندارید',
                    status : 'error'
                });
            req.user = user;
                next()
        })(req,res, next)
    }
}