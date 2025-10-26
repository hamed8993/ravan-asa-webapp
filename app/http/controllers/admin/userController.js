const controller = require('app/http/controllers/controller.js');
const User = require('app/models/user.js');
const Role = require('app/models/role.js');
const bcrypt = require("bcrypt");
module.exports = new class userController extends controller {
    async index(req,res,next){
       try {
            let page = req.query.page || 1 ;
            let users = await User.paginate({},
                {page:page ,sort: {createdAt: -1}, limit : 10});
            let allRoles = await Role.find({});
            // return res.json(allRoles)
            res.render('admin/users/index.ejs', {title: 'کاربران سایت', users, allRoles});
        } catch(error){
            next(error);
        }
    }
    async toggleadmin(req,res,next){
        try{
            this.isMongoId(req.params.id);
            let user = await User.findById(req.params.id);
            user.set({ admin : !user.admin});
            await user.save();
            return this.back(req,res);
        } catch(error){
            next(error);
        }
    }
    async addrole(req,res, next){
        try{
            this.isMongoId(req.params.id);
            let user = await User.findById(req.params.id);
            let roles = await Role.find({});
            if(!user) this.error('چنین کاربری وجود ندارد', 404);
            res.render('admin/users/addrole.ejs', { user, roles});
        } catch(error){
            next(error);
        }
    }
    async storeRoleForUser(req,res,next){
        try{
            this.isMongoId(req.params.id);
            // return res.json(req.body);
            let user = await User.findById(req.params.id);
            if(!user) this.error('چنین کاربری وجود ندارد', 404);
            user.set({ roles : req.body.roles });
            await user.save();
            res.redirect('/admin/users');
        }catch(error){
            next(error)
        }
    }
    async create(req,res){
        res.render('admin/users/create.ejs');
    }
    async store(req,res, next){
       try{
           let status = await this.validationData(req);
           if(! status ) return this.back(req, res);
            let {name ,email, password } = req.body ;

           let salt = bcrypt.genSaltSync(15);
           let hash = bcrypt.hashSync(password, salt);

           let newUser = new User({ name, email, password: hash });
           await newUser.save();
           this.alert(req,{
               title: 'تبریک!',
               message: 'کاربر جدید ایجاد شد.',
               button: 'باشه',
               type: 'success'
           });
           return res.redirect('/admin/users');
       } catch(error){
           next(error);
       }
    }
    //این دو تا رو دست نزد:
    async edit(req,res, next){
      try {
          this.isMongoId(req.params.id);
          let category =await Category.findById(req.params.id);
          let categories =await Category.find({ parent : null });
          if(! category) this.error('چنین دسته ای وجود ندارد.',404);
          return res.render('admin/categories/edit.ejs', { category, categories });
      } catch(error){
          next(error);
      }
    }
    async update(req,res,next){
       try {
           let status = await this.validationData(req);
           if(! status ) return this.back(req, res);
          let {name , parent } = req.body;
            await Category.findByIdAndUpdate(req.params.id ,{
                $set : {
                    name ,
                    slug : this.slug(name),
                    parent : parent !== 'none' ? parent : null
                }
            });
           return res.redirect('/admin/categories');
       } catch(error){
           next(error);
       }
    }
    // متد برا باتن قرمز "حذف" هم اوکی شد:
    async destroy(req, res, next){
       try {
           this.isMongoId(req.params.id);
           let user = await User.findById(req.params.id)
               .populate({path: 'courses', populate: ['episodes']}).exec();
           if(!user) this.error('چنین کاربری وجود ندارد.',404);
                user.courses.forEach(course =>{
                   course.episodes.forEach(episode => episode.remove());
                   course.remove();
           });
           user.remove();
           return res.redirect('/admin/users')// because of fetch, it don't works!
           // redirect action done in front end!
       } catch(error){
           next(error);
       }
    }
}