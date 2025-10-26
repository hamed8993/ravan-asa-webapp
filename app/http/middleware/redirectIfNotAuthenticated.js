const middleware = require('./middleware.js');

module.exports = new class redirectIfNotAuthenticated extends middleware {
    handle(req,res,next){
        if(req.isAuthenticated()) return next();
            return res.redirect('/auth/login');
    }
}