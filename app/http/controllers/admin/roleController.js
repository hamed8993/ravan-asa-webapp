const controller = require('app/http/controllers/controller.js');
const Permission = require('app/models/permission.js');
const Role = require('app/models/role.js');
module.exports = new class permissionController extends controller {
    async index(req,res,next){
        try {
            let page = req.query.page || 1 ;
            let roles = await Role.paginate({},
                {page:page ,sort: {createdAt: -1}, limit : 10 });
            let permissions = await Permission.find({});
            res.render('admin/roles/index.ejs', {title: 'سطوح دسترسی', roles,permissions});
        } catch(error){
            next(error);
        }
    }
    async create(req,res){
        let permissions = await Permission.find({});
        res.render('admin/roles/create.ejs',{ permissions });
    }
    async store(req,res, next){
        try{
            let status = await this.validationData(req);
            if(! status ) return this.back(req, res);
            let {name , label, permissions } = req.body ;
            let newRole = new Role({
                name, label, permissions
            });
            await newRole.save();
            return res.redirect('/admin/users/roles');
        } catch(error){
            next(error);
        }
    }
    async edit(req,res, next){
        try {
            this.isMongoId(req.params.id);
            let role =await Role.findById(req.params.id);
            if(! role) this.error('یک چنین سطح دسترسی وجود ندارد.',404);
            let permissions = await Permission.find({});
            return res.render('admin/roles/edit.ejs', { role, permissions });
        } catch(error){
            next(error);
        }
    }
    async update(req,res,next){
        try {
            let status = await this.validationData(req);
            if(! status ) return this.back(req, res);
            let {name , label, permissions } = req.body;
            await Role.findByIdAndUpdate(req.params.id ,{
                $set : { name, label, permissions }
            });
            return res.redirect('/admin/users/roles');
        } catch(error){
            next(error);
        }
    }
    async destroy(req, res, next){
        try {
            this.isMongoId(req.params.id);
            // return res.json('ok');
            let role = await Role.findById(req.params.id);
            if(!role) this.error('یک چنین سطح دسترسی وجود ندارد.',404);
            role.remove();
            return res.redirect('/admin/users/roles')
        } catch(error){
            next(error);
        }
    }
}