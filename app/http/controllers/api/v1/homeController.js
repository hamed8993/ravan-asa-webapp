const Course = require('app/models/course.js');
const Comment = require('app/models/comment.js');
const controller = require('app/http/controllers/api/controller.js');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const Payment = require("app/models/payment");

class homeController extends controller {
    async user(req, res) {
        let user = await req.user.populate({ path : 'roles',
            populate: [ {path: 'permissions'}]}).execPopulate();
        return res.json({
            data : this.filterUserData(user),/// newwwwwww
            status : 'success'
        });
    }
    async history(req,res, next){
        try{
            let page = req.query.page || 1 ;
            let payments = await Payment
                .paginate({user : req.user.id},
                    {page, sort: {createdAt : -1},
                        limit: 20, populate:[{path: 'course'},
                            {path: 'user',select: 'name email'}] });
            res.json({
                data : this.filterPaymentData(payments),
                status : 'success'
            })
        } catch (error){
            this.failed(error.message, res)
        }
    }

    filterPaymentData(payments){
        return {
            ...payments,
            docs : payments.docs.map(pay=>{
                    return {
                       payment: pay.payment,
                        restnumber: pay.restnumber,
                        price: pay.price,
                        user : {
                           name: pay.user.name,
                            email: pay.user.email
                        }
                    }
            })
        }
    }

    filterUserData(user) {
        return {
            id : user.id,
            admin : user.admin,
            name: user.name,
            email: user.email,
            createdAt : user.createdAt,
            vipTime: user.vipTime,
            vipType: user.vipType,
            roles : user.roles.map(role => {
                return{
                    name : role.name,
                    label : role.label,
                    permissions : role.permissions.map(per =>{
                        return {
                            name : per.name,
                            label : per.label
                        }
                    })
                }
            })
        }
    }
}
module.exports = new homeController();