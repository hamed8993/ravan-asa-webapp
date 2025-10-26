const  ConnectRoles= require('connect-roles');
const  Permission = require('app/models/permission');
let gate = new ConnectRoles({
    failureHandler: function (req, res, action) {
        // optional function to customise code that runs when
        // user fails authorisation
        var accept = req.headers.accept || '';
        res.status(403);
        if (accept.indexOf('html')) {
            res.render('errors/403.ejs', {action: action});
        } else {
            res.json("Access Denied-You don\'t have permission to: "+ action);
        }
    }
});
//these 3 line is simlified form of later codes:
// gate.use('show-courses',(req)=>{
//     return true
// })
// later codes:
const persmission = async ()=>{
return await Permission.find({})
    .populate('roles').exec();
// console.log(persmission)
}
persmission()
    .then(persmissions=>{
        persmissions.forEach(persmission =>{
            let roles = persmission.roles.map(item => item._id);
            gate.use(persmission.name, (req)=>{
                return (req.isAuthenticated()) ? req.user.hasRole(roles)
                    : false;
            })
        } )
    });
module.exports = gate;
