const controller = require('app/http/controllers/controller');
const Payment = require('app/models/payment');
const Course = require("app/models/course.js");
const {default: axios} = require("axios");
const ActivationCode = require('app/models/activationCode.js');
const User = require('app/models/user');
const fs = require("fs");
const Chat = require('app/models/chats/chat.js');
const ChatRoom = require("app/models/chats/chatroom.js");

class userController extends controller{
    async activation(req,res,next){
        try {
            let activationCode = await ActivationCode.findOne({ code : req.params.code})
                .populate('user').exec();
                if(! activationCode) {
                    this.alert(req, {
                        title: 'دقت!',
                        message : 'مع الاسف چنین لینک فعالسازی وجود ندارد!',
                        button : 'بسیار خب',
                        type : 'error'
                    });
                    return res.redirect('/');
                }
            if( activationCode.expire < new Date()) {
                this.alert(req, {
                    title: 'دقت!',
                    message : 'مهلت استفاده از این لینک به پایان رسیده است!',
                    button : 'بسیار خب',
                    type : 'error'
                });
                return res.redirect('/');
            }
            if(activationCode.used) {
                this.alert(req, {
                    title: 'دقت!',
                    message : 'این لینک قبلا مورد استفاده قرار گرفته است!',
                    button : 'بسیار خب',
                    type : 'error'
                });
                return res.redirect('/');
            }
            let user = activationCode.user;
            user.$set({ active : true});
            activationCode.$set({ used : true });
            await user.save();
            await activationCode.save();
            req.login(user, error =>{
                user.setRememberToken(res);
                this.alert(req, {
                    title: 'تبریک!',
                    message : 'اکانت کاربری شما با موفقیت فعال شد!',
                    button : 'باشه',
                    type : 'success'
                });
            });
            return ( res.redirect('/') );

        } catch(error){
           next(error) ;
        }
    }
    async index(req,res, next){
            try{
                res.render('home/panel/index.ejs',
                    { title : 'پنل کاربری'})
            } catch (error){
                 next(error)
            }
    }
    async history(req,res, next){
        try{
            let page = req.query.page || 1 ;
            let payments = await Payment
                .paginate({user : req.user.id},
                  {page, sort: {createdAt : -1},
                      limit: 5, populate:'course'});
                res.render('home/panel/history.ejs',
                    { title : 'فهرست تراکنش های کاربر', payments});
        } catch (error){
              next(error)
        }
    }
    async vip(req,res){
        res.render('home/panel/vip.ejs');
    }
    async vipPayment(req,res, next){
        try{
            // res.json(req.body.plan)
            let plan = req.body.plan,
                price = 0;
            switch (plan) {
                case '3' :
                    price = 30000;
                break;
                case '12' :
                    price = 120000;
                break;
                default:
                    price = 10000;
                break;
            }
           // پروسه ی خرید......
            axios.post('https://sandbox.zarinpal.com/pg/rest/WebGate/PaymentRequest.json',{
                MerchantID : 'j83cc9564f59f411e64889a4005056a205be',
                Amount : price,
                CallbackURL : 'http://localhost:3000/user/panel/vip/payment/check',
                Description : `بابت افزایش اعتبار ویژه`,
                json: true,
                headers: {'Cache-Control': 'no-cache','content-type': 'application/json' },
            }).then(async data=> {
                // res.json(data.data);
                let payment = new Payment({
                    user: req.user.id,
                    vip: true,
                    resnumber: data.data.Authority,
                    price: price
                });
                await payment.save();
                res.redirect(`https://sandbox.zarinpal.com/pg/StartPay/${data.data.Authority}`);
            })
            } catch(error) {
            next(error)
        }
    }
    async vipPaymentCheck(req,res, next){
        try{
            if(req.query.Status && req.query.Status !=='OK') {
                this.alert(req, {
                    title: 'توجه:',
                    message: 'پرداخت شما با شکست مواجه شد چون status !=OK یا اصلا status وجود ندارد!',
                    button: 'متوجه شدم',
                    type: 'error',
                });
                return res.redirect('/user/panel');
            }
            let paymentResult = await Payment.findOne({ resnumber : req.query.Authority});
            if(!paymentResult.vip) {
                this.alert(req, {
                    title: 'توجه:',
                    message: 'این تراکنش برای افزایش اعتبار ویژه نیست!! با پشتیبانی تماس حاصل فرمایید.',
                    button: 'متوجه شدم',
                    type: 'error',
                });
                return res.redirect('/user/panel');
            }
            //ارسال تصدیق پرداخل:
            axios.post('https://sandbox.zarinpal.com/pg/rest/WebGate/PaymentVerification.json',{
                MerchantID : 'j83cc9564f59f411e64889a4005056a205be',
                Amount : paymentResult.price,
                Authority : req.query.Authority,
                json: true,
                headers: {'Cache-Control': 'no-cache','content-type': 'application/json' },
            })
                .then( async data=>{// async async....
                    if( data.data.Status == 100){
                        paymentResult.set({ payment : true});
                        await paymentResult.save();
                        //ذخیره سازی vip :
                        let time = 0 , type ='';
                        switch (paymentResult.price){
                            case 10000:
                                time =1;
                                type = 'month'
                                break;
                            case 30000:
                                time =3;
                                type = '3month'
                                break;
                            case 120000:
                                time =12;
                                type = '12month'
                                break;
                        }
                        if(time == 0){
                            this.alert(req,{//******!!!!!!!!******
                                title: ' توجه ',
                                message: 'عملیات مدنظر با موفقیت انجام نگرفت. ',
                                type: 'error' ,
                                button : 'باشه!'
                            });
                            return res.redirect('/user/panel');
                        }

                        let vipTime = req.user.isVip() ? new Date(req.user.vipTime) : new Date();
                        vipTime.setMonth( vipTime.getMonth() + time);
                        req.user.set({ vipTime : vipTime , vipType : type});
                        await  req.user.save();
                        await paymentResult.save();

                        this.alert(req,{
                            title: 'باتشکر',
                            message: 'عملیات مدنظر با موفقیت انجام گرفت. ',
                            type: 'success' ,
                            button : 'باشه!'
                        });
                        return res.redirect('/user/panel');
                    } else {

                        this.alert(req, {
                            title: 'توجه:',
                            message: 'پرداخت شکست خورد! چون status!= 100 .',
                            button: 'متوجه شدم',
                            type : 'error',
                        });
                        return res.redirect('/user/panel');
                    }
                }).catch((err)=>{
                next(err);
            })

        } catch(error) {
            next(error)
        }
    }
    async setAvtrPicture(req,res){
        this.isMongoId(req.params.id);
        let imgPath = req.file.destination + '/' + req.file.filename;
        let user =await User.findByIdAndUpdate(req.params.id,
            {$set: {avatar: imgPath.substr(8)}});
        if(!user) return res.json('مشکلی پیش آمده. بعدا مجددا امتحان کنید.');
        return res.redirect(req.headers.referer);
    }
    async showMessaging(req,res){
          try{
                let users = await User.find({}).populate('roles').exec();
                // res.send(users[0].roles[0].label);
                res.render('home/panel/messaging.ejs',
                    { title : 'پیام رسانی', users}
                );
        } catch(error){
            next(error);
       }
    }
    async chatRoom(req,res,next){
        try{
            const p11 = req.user.id, p22 = req.body.chatBy_id,
                chatBy_id =req.body.chatBy_id, chatBy_name = req.body.chatBy_name,
                chatBy_avatar = req.body.chatBy_avatar;
            let haveRoom = await ChatRoom.findOne({$or: [{$and:[{p1:p11},{p2:p22}]},
                    {$and:[{p2:p11},{p1:p22}]}]});
            if(haveRoom){
                let  chats = await Chat.find({chatRoom:haveRoom.id }).sort({createdAt: 1});
                if(chats.length !== 0){
                    console.log('******Chats Archive Sent....');
                     res.render('home/panel/chat-room.ejs',{ req,chatBy_id,chatBy_name,
                         chatBy_avatar,haveRoom,chats})
                }else {
                   console.log('!!!!!!**NOT Any Chats Archive!....')
                    return res.render('home/panel/chat-room.ejs',{ req ,chatBy_id,chatBy_name,
                        chatBy_avatar,haveRoom, chats:[]});
                   }
            } else{
                console.log('not exist such ChatRoom!!! BUT CREATED...ENJOY!!!!')
            let newChatRoom = new ChatRoom({ p1: p11, p2:p22 });
            await newChatRoom.save();
                return res.render('home/panel/chat-room.ejs',{ req,chatBy_id,chatBy_name,
                    chatBy_avatar,haveRoom : newChatRoom, chats:[]})
            }
        } catch(error){
            next(error);
        }
    }

    showChatRoom(req,res){
        res.render('home/panel/chat-room.ejs',{ req ,chatBy_id,chatBy_name,chatBy_avatar,haveRoom, chats})
    }
}
module.exports = new userController();