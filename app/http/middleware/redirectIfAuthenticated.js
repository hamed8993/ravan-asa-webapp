
//دو ماژول user و middleware رو ری کیوآر نکرده ام. لازم نیستن اینجا آخه!
module.exports = new class redirectIfAuthenticated {
    handle(req,res,next){
        if(req.isAuthenticated())
            return (res.redirect('/'));
        next();
    }
}