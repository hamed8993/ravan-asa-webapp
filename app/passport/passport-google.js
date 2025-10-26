const mypassport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
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

//: تعریف استراتژی برا رجیستر googleStrategy
mypassport.use( new googleStrategy({
            clientID: config.service.google.client_key ,
            clientSecret: config.service.google.secret_key,
            callbackURL: config.service.google.callback_url
        },
    (token, refreshToken, profile, done) => {
                 // for(propery in profile){
                 //    console.log(`${propery} ==>> ${profile[propery]}`);
                 //};
        // profile.emails.forEach(e=>console.log('email arrays itme:',e) );
            User.findOne({ email: profile.emails[0].value } ,(error, user)=>{
                if(error) return done(error);
                if(user) return done(null, user);
                const newUser = new User({
                    name: profile.displayName ,
                    email: profile.emails[0].value ,
                    password : profile.id
                });// end: const newUser = new User.
                newUser.save(error=>{
                    if(error) throw error ;
                    done(null, newUser);
                })// end: newUser.save.
            });// end: User.findOne.
        }//end: (req,email, passwords, done) =>.
    )//end: new googleStrategy.
);//end: mypassport.use.
