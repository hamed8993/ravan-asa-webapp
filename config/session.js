const mongoose = require("mongoose");
const mysession = require("express-session");
const MongoStore   = require('connect-mongo')(mysession);
module.exports = {// برا بخش ایجاد فرم اینپوت ها در رجیستر + ارزیابی با ریکپچا.
    name : 'rocket-sess.name',
    secret: process.env.SESSION_SECRET_KEY,
    resave: true,
    saveUninitialized: true,
    cookie:{ expires: new Date(Date.now() + 1000*60*6)},
    store: new MongoStore({mongooseConnection: mongoose.connection})
}