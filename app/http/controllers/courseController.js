const controller = require('app/http/controllers/controller.js');
const Course = require('app/models/course.js');
const Episode = require('app/models/episode.js');
const Category = require('app/models/category.js');
const Payment = require('app/models/payment.js');// newwwwwww
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const axios = require('axios').default;
const superagent = require('superagent');

class courseController extends controller {
    async index(req, res){
        // return res.json(req.query);
        let query = {};
        let { search, type, category } = req.query;
        if(search)
            query.title = new RegExp(search, 'gi');
        if (type &&  type !== 'all')
            query.type = type ;

        if (category && category !== 'all'){
            category = await Category.findOne({slug : category})
            // console.log(category);
            if(category)
                query.categories = { $in : [ category.id ]};
        }

        let courses = Course.find({...query});
        if(req.query.order)
            courses.sort({ createdAt : -1 });
        let categories = await Category.find({});
        courses = await courses.exec();
        res.render('home/courses.ejs', {courses, categories});
    }
    async payment(req, res, next){
        try{
          this.isMongoId(req.body.course);
           let course = await Course.findById(req.body.course);
            if(!course){
                return this.alertAndBack(req,res,{
                    title: '!!دقت کنید!!',
                    message : 'چنین دوره ای یافت نشد!',
                    type : 'error',
                    // button : 'خیلی خوب!'
                });
            }
            if(await req.user.checkLearning(course)){
               return this.alertAndBack(req,res,{
                    title: '!!دقت کنید!!',
                    message : 'شما قبلا در این دوره ثبت نام کرده اید!',
                    type : 'error',
                    button : 'خیلی خوب!'
                });
            }
            if(course.type !== 'cash'){
                return this.alertAndBack(req,res,{
                    title: '!!دقت کنید!!',
                    message : 'این دوره قابل خریداری نیست(مخصوص اعضای ویژه یا رایگان است!',
                    type : 'error'
                });
            }
       // پروسه ی خرید......
            axios.post('https://sandbox.zarinpal.com/pg/rest/WebGate/PaymentRequest.json',{
                MerchantID : 'j83cc9564f59f411e64889a4005056a205be',
                Amount : course.price,
                CallbackURL : 'http://localhost:3000/courses/payment/checker',
                Description : `بابت خرید دوره ی ${course.title}`,
                json: true,
                headers: {'Cache-Control': 'no-cache','content-type': 'application/json' },
            }).then(async data=>{
                // res.json(data.data);
                let payment = new Payment({
                    user      : req.user.id,
                    course    : course.id,
                    resnumber : data.data.Authority,
                    price     : course.price
                });
                await payment.save();
                res.redirect(`https://sandbox.zarinpal.com/pg/StartPay/${data.data.Authority}`);
            }).catch((err)=>{
                res.send(err.response.data);
            })
        }catch(error){
            next(error);
        }
    }
    async checker(req , res , next) {
        try {
            if(req.query.Status && req.query.Status !=='OK')
                return this.alertAndBack(req,res, {
                title: 'توجه:',
                message: 'پرداخت شما با شکست مواجه شد چون status !=OK یا اصلا status وجود ندارد!',
                button: 'متوجه شدم',
                type : 'error',
            });
            let paymentResult = await Payment.findOne({ resnumber : req.query.Authority})
                .populate('course').exec();
            if(!paymentResult.course)
                return this.alertAndBack(req,res, {
                    title: 'توجه:',
                    message: 'دوره ای که بابتش پرداخت کردید، وجود خارجی ندارد!! با پشتیبانی تماس حاصل فرمایید.',
                    button: 'متوجه شدم',
                    type : 'error',
                });
            //ارسال تصدیق پرداخل:
            axios.post('https://sandbox.zarinpal.com/pg/rest/WebGate/PaymentVerification.json',{
                MerchantID : 'j83cc9564f59f411e64889a4005056a205be',
                Amount : paymentResult.course.price,
                Authority : req.query.Authority,
                json: true,
                headers: {'Cache-Control': 'no-cache','content-type': 'application/json' },
            })
                .then( async data=>{// async async....
                if( data.data.Status == 100){
                    paymentResult.set({ payment : true});
                    req.user.learning.push(paymentResult.course.id);
                    await paymentResult.save();
                    //مشکل در سیو کردن   USER داشت که حل شد:
                    await req.user.save();
                   return this.alertAndBack(req,res,{//******!!!!!!!!******
                        title: 'باتشکر',
                        message: 'عملیات مدنظر با موفقیت انجام گرفت. ',
                        type: 'success' ,
                        button : 'باشه!'
                    })
                } else {
                    return this.alertAndBack(req,res, {
                        title: 'توجه:',
                        message: 'پرداخت شکست خورد! چون status!= 100 .',
                        button: 'متوجه شدم',
                        type : 'error',
                    });
                }
            }).catch((err)=>{
               next(err);
            })
        } catch (err) {
            next(err);
        }
    }
    async single(req, res){
        let course = await Course.findOneAndUpdate({slug : req.params.course},
             {$inc: { viewCount : 1}})
            .populate([
                { path: 'user' , select: 'name'},
                { path: 'episodes',options: { sort: {number: 1} } }
            ]).populate([{
                path : 'comments',
                match : {
                   parent : null , approved: true
                },populate : [
                    {
                        path : 'user', select : 'name'
                    },
                    {
                        path : 'comments', match: {approved: true}
                    ,
                       populate :{
                       path: 'user', select : 'name'
                       }
                    }
                ]
            }]);
// return console.log(req.user.checkLearning(course));
        let categories = await Category.find({ parent : null }).populate('childs').exec();

        // let canUserUse = await this.canUse(req, course);
        res.render('home/single-course.ejs', { course, categories});
    }
    async download(req,res,next){
        try{
            this.isMongoId(req.params.episode);
           let episode = await Episode.findById(req.params.episode);
           if(! episode) this.error('چنین فایلی برای این جلسه وجود ندارد.',404);
            if(! this.checkHash(req,episode)) this.error('اعتبار لینک دانلود به پایان رسیده است.');
           let filePath = path.resolve(`./public/${episode.videoUrl}`);
           if(!fs.existsSync(filePath)) this.error('چنین فایلی برا دانلود وجود ندارد',404);

           await episode.inc('downloadCount' , 1);

           return res.download(filePath);
        } catch(error){
            next(error);
        }
    }
    checkHash(req, episode){
        let timestamps = new Date().getTime();
        if(req.query.t < timestamps) return false;

        let hashedText = `Episode-Download-SecretKey-${episode.id}${req.query.t}`;
        return bcrypt.compareSync(hashedText, req.query.mac);
    }
}
module.exports = new courseController();