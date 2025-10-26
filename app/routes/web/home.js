const express = require('express');
const router = express.Router();
//controllers:
const homeController = require('app/http/controllers/homeController.js');
const courseController = require('app/http/controllers/courseController.js');
const userController = require('app/http/controllers/userController.js');

//validators:
const commentValidator = require('app/http/validators/commentValidator.js');

//Middlewares:
const redirectIfNotAuthenticated = require('app/http/middleware/redirectIfNotAuthenticated.js');
//for lectur 51 : AJAX ::
const convertFileToFiled = require('app/http/middleware/convertFileToField');

//helpers:
//for lectur 51 : AJAX :
const upload = require('app/helpers/uploadImages.js');
router.get('/', homeController.index);

router.get('/about-me', homeController.about);
router.get('/courses',courseController.index );
router.get('/download/:episode', courseController.download);
router.get('/courses/:course', courseController.single );
router.post('/comment',redirectIfNotAuthenticated.handle,
    commentValidator.handle(), homeController.comment);
router.get('/logout', (req,res)=>{
    req.logout();
    res.clearCookie('remember_token');
    res.redirect('/');
})

//for lecture 60 : ایمیل فعالسازی حساب کاربری:
router.get('/user/activation/:code',userController.activation)

//for payment: lecture 41(of mains):
router.post('/courses/payment',redirectIfNotAuthenticated.handle,
    courseController.payment);
router.get('/courses/payment/checker', courseController.checker);//این get بودددد!!! قبلا post گزاشته بود!!!

//USER Routes:
router.get('/user/panel', userController.index);
router.get('/user/panel/history', userController.history);
router.get('/user/panel/messaging', userController.showMessaging);//NEW MESSAGING
router.post('/user/panel/chatroom', userController.chatRoom);//NEW CHAT-ROOM
// router.get('/user/panel/chatroom', userController.showChatRoom);//NEEEEEWWWWWWW CHAT-TOOM


router.get('/user/panel/vip', userController.vip);
router.put('/user/panel/vip/:id/avatar',upload.single('images'),
    convertFileToFiled.handle, userController.setAvtrPicture);//NEWWW   AVATAR USERRRRR

router.post('/user/panel/vip/payment', userController.vipPayment);
router.get('/user/panel/vip/payment/check', userController.vipPaymentCheck);

//for SiteMap (lecture 50(Hesam)& 44(mine):
router.get('/sitemap.xml',homeController.sitemap);
//for RSS (lecture 50(Hesam)& 44(mine):
router.get('/feed/courses', homeController.feedCourses);
router.get('/feed/episodes', homeController.feedEpisodes);


router.get('/ajaxupload',
    (req, res,
     next)=> res.render('home/ajaxupload.ejs'));
router.post('/ajaxupload',upload.single('photo'),
    convertFileToFiled.handle, (req, res, next)=>{
    try{
        res.json({...req.body, ...req.file});
    } catch(error){
        next(error);
    }
});
module.exports = router;