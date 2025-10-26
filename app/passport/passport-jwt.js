const mypassport = require('passport');
const passportJWT = require('passport-jwt');
const User = require('app/models/user');

const ExtractJWT = passportJWT.ExtractJwt;
const JWTStrategy = passportJWT.Strategy;

mypassport.use('jwt',new JWTStrategy({
    jwtFromRequest : ExtractJWT.fromExtractors([
        ExtractJWT.fromUrlQueryParameter('api_token')
    ]),
    secretOrKey : config.jwt.secret_key
}, async (jwtPayload, done)=>{
    try {
        let user = await User.findById(jwtPayload.id);
        if(user) done(null, user)
        else done(null, false, { message : 'شما اجازه دسترسی ندارید.'})
    } catch(error){
        done(null, false, { message : error.message})
    }
}) );