const database = require('./database');
const layout = require('./layout');
const service = require('./service');
const session = require('./session');

module.exports = {
    port : process.env.PORT || 9000,
    database,
    layout,
    service,
    session,
    cookie_secret_ket : process.env.COOKIE_SECRET_KEY,
    debug : true,
    siteurl : process.env.WEBSITE_URL,
    jwt : {
        secret_key : '@aSfHgK(*&^%fd$#R$Y^&^%$#42dfv@'
    }
}