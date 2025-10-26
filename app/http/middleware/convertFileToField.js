const middleware = require('./middleware');
module.exports = new class convertFileToField extends middleware {
    handle(req, res, next){
        if(!req.file)
            req.body.images = undefined;
            // console.log('file is nottt');
        else
            // console.log('file:>>>' , req.file)
            req.body.images = req.file.filename;

        next();
    }
}