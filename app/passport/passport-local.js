const mypassport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require('app/models/user');

mypassport.serializeUser(function(user, done){
    // console.log('serializeUser-user.id:>>>>', user.id);
    done(null, user.id)
})
mypassport.deserializeUser(function(id, done){
    // console.log('deserializeUser-id:>>>>', id+1);
    User.findById(id
        , function (error, user){
        done(error, user);
    })
})

//: تعریف استراتژی برا رجیستر localStrategy
mypassport.use('local.register', new localStrategy({
    usernameField: 'email' ,
    passwordField: 'password',
    passReqToCallback: true
}, (req,email, password, done) => {
    User.findOne({ 'email' : email } ,(error, user)=>{
        if(error) return done(error);
        if(user) return done(null, false, req.flash('errors', 'چنین کاربری قبلا ثبت نام کرده است.'))
        const newUser = new User({
            name: req.body.name ,
            email
        });
        // console.log('password::::',password);
        // console.log('typeof::::',typeof(password));
        newUser.$set({ password : newUser.hashPassword(password)});
        newUser.save(error=>{
        if(error) return done(error, false ,req.flash('errors', 'خطا! مشکلی در ذخیره سازی در دیتابیس رخ داده.  مجددا سعی کنید.'))
   done(null, newUser);
    })// end: newUser.save.
    });// end: User.findOne.
    }//end: (req,email, passwords, done) =>.
)//end: new localStrategy.
);//end: mypassport.use.

//: تعریف استراتژی برا لاگین localStrategy
mypassport.use('local.login', new localStrategy({
            usernameField: 'email' ,
            passwordField: 'password',
            passReqToCallback: true
        }, (req,email, password, done) => {
            //console.log(`email: ${ email } \n passwords: ${ passwords }`);
            User.findOne({ 'email' : email } ,(error, user)=>{
                if(error) return done(error);
                if(!user || !user.comparePassword(password) )
                 return done(null, false, req.flash('errors', 'چنین کاربری یافت نشد.'))
            done(null, user);
            });// end: User.findOne.
        }//end: (req,email, passwords, done) =>.
    )//end: new localStrategy.
);//end: mypassport.use.