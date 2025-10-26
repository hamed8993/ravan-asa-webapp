const Course = require('app/models/course.js');
const Comment = require('app/models/comment.js');
const controller = require('app/http/controllers/api/controller.js');
const passport = require('passport');
const jwt = require('jsonwebtoken');

class authController extends controller{
    async login(req, res){
        try {
            if(! await this.validationData(req,res)) return;/// newwww
            passport.authenticate('local.login',{session: false},
                (error, user)=>{
                if(error) return this.failed(error.message,res);
                if(!user) return this.failed('چنین کاربری وجود ندارد!',res,404);
                req.login(user, {session : false }, (error)=>{
                    if(error) return this.failed(error.message, res);
                    //create token:
                    const token = jwt.sign({id : user.id},
                        config.jwt.secret_key , {
                        expiresIn: 60*15 // in Sec (not msec).
                        } );
                    return res.json({
                        data : { token },
                        status : 'success'
                    })
                })
                })(req, res);
        } catch (error) {
            return this.failed(error.message, res);
        }
    }
}
module.exports = new authController();