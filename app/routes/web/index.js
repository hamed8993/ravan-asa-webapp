const express= require('express');
const router= express.Router();

//Middle ware:
const redirectIfAuthenticated = require("app/http/middleware/redirectIfAuthenticated.js");
const redirectIfNotAdmin = require("app/http/middleware/redirectIfNotAdmin.js");
const errorHandler = require("app/http/middleware/errorHandler.js");

//Admin Router:
const adminRouter = require('app/routes/web/admin.js');
router.use('/admin',redirectIfNotAdmin.handle, adminRouter);

//Home Router:
const homeRouter = require('app/routes/web/home.js');
router.use('/',homeRouter);

//Auth Router:
const authRouter = require('app/routes/web/auth.js');
router.use('/auth',redirectIfAuthenticated.handle ,authRouter);

//Error Handling:
router.all('*',errorHandler.error404);
router.use(errorHandler.handler);

module.exports = router;