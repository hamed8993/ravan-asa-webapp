const User = require('app/models/user.js');
const middleware = require('./middleware');
module.exports = new class rememberLogin extends middleware {
    handle(req, res, next){
        if(!req.isAuthenticated()){
            // console.log('signedCookies>>>>',req.signedCookies);
            const rememberToken = req.signedCookies.remember_token;
            if(rememberToken) return this.userFind(rememberToken , req , next);
        }
        next();
    }
userFind(rememberToken , req, next ){
        User.findOne({ rememberToken })
            .then(user =>{
                if(user){
                    req.logIn(user, error =>{
                        if(error) next(error);
                        next();
                    })
                }else{
                    next();
                }
            })
            .catch(error => next(error));
}

}