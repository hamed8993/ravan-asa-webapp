const nodemailer = require('nodemailer');

//send Email:
let transporter = nodemailer.createTransport({
    host : 'smtp.mailtrap.io',
    port : 2525,
    secure : false,
    auth : {
        user : '508d93efad6d2e' ,
        pass : 'c269399547ec1d'
    }
});

module.exports = transporter;