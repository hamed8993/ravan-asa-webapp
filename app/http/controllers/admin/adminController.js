// const controller = require('app/http/controllers/controller.js');
class adminController  {
    index(req,res){
     res.render('admin/index.ejs');
    }

    //for CKEditor:
    uploadImage(req,res){
        let image = req.file;
        res.json({
            'uploaded' : 1,
            'fileName' : image.originalname,
            'url' : `${image.destination}/${image.filename}`.substring(8)
        })
    }
}
module.exports = new adminController();