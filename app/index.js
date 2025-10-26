const express = require('express');
const app = express();
const mongoose = require('mongoose');
const ejs = require('ejs');
// const path = require('path'); // went to config/layout.js
const connectFlash = require('connect-flash');
const mysession = require('express-session');
// const MongoStore   = require('connect-mongo')(mysession); // went to config/session.js
// const expressValidator = require('express-validator');
const passport = require('passport');
const cookieParser = require('cookie-parser');//کوکی پارسر
const Helpers = require('app/helpers.js');//newwwwwwwww
const rememberLogin = require('app/http/middleware/rememberLogin.js');
const webPages = require("app/routes/web/index.js");
const methodOverride = require('method-override');
const gate = require('app/helpers/gate');
const apis = require("app/routes/api/index.js");
const activeUser = require('app/http/middleware/activeUser.js');
const helmet = require('helmet');
const csrf = require('csurf');
const csrfErrorHandler = require('app/http/middleware/csrfErrorHandler.js');
// const RateLimit = require('express-rate-limit');
// const apiLimiter = new RateLimit({
// windowMs : 1000*60*15, //(15 min)
//     max: 50,
//     message : 'درخواست های شما بیش از حد مجاز می باشد.' +
//         ' لطفا بعداز 15 دقیقه مجددا تلاش کنید.'
// });
module.exports = new class Application {
    constructor(){
        this.setExpress();
        this.setMongoConnection();
        this.setConfig();//نباید بعد از "ست روتر" باشه!
        this.setRouters();
    }
    setConfig(){
        require('app/passport/passport-local.js');
        require('app/passport/passport-google.js');
        require('app/passport/passport-jwt.js');

        // app.enable('trust proxy');
        // app.use(helmet());
        app.use(express.static(config.layout.public_dir));
        app.set('view engine', config.layout.view_engine);
        app.set('views',config.layout.view_dir);
        app.use(config.layout.ejs.expressLayouts);
        app.set('layout', config.layout.ejs.master);
        app.set('layout extractScripts', true);
        app.set('layout extractStyles', config.layout.ejs.extractStyles);
        app.use(mysession({...config.session}));
        app.use(cookieParser(config.cookie_secret_ket));
        app.use(express.json());// برا بخش ایجاد فرم اینپوت ها در رجیستر + ارزیابی با ریکپچا.
        app.use(express.urlencoded({extended: true}));// برا بخش ایجاد فرم اینپوت ها در رجیستر + ارزیابی با ریکپچا.
        // app.use(expressValidator());// برا بخش ایجاد فرم اینپوت ها در رجیستر + ارزیابی با ریکپچا.
        app.use(methodOverride('_method'));
        app.use(connectFlash());// برا بخش ایجاد فرم اینپوت ها در رجیستر + ارزیابی با ریکپچا.
        app.use(passport.initialize());
        app.use(passport.session());
        app.use(rememberLogin.handle);
        app.use(gate.middleware());
        app.use((req,res,next)=>{
            app.locals = new Helpers(req,res).getObjects();
            // console.log('app.localsapp.locals',app.locals);
            next();
        });
    }

    setMongoConnection(){
        mongoose.connect(config.database.url)
        .then(()=>{console.log('connected successfully to MongoDB...')})
        .catch((e)=>{console.log(`sorry! can't connect to MongoBD, - ERROR: ${e}`)});
    }

    setExpress(){
          app.listen(config.port, ()=>console.log(`listening on port of ${config.port}....`)  );
    }

   setRouters(){
        app.use(activeUser.handle);
       const apis     = require('app/routes/api/index.js');
       // app.use( apiLimiter, apis);
       app.use( apis);

       const webPages = require('app/routes/web/index.js');
       app.use(csrf({ cookie: true}),webPages);
       // app.use(webPages);
       app.use(csrfErrorHandler.handle);
   }
}




