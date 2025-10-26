const middleware = require('app/http/middleware/middleware.js');
module.exports = new class redirectIfNotAdmin extends middleware {
    handle(req, res, next){
        if(req.isAuthenticated() && req.user.admin) return next()
        return res.redirect('/');
    }
}