const controller = require('app/http/controllers/controller.js');
const Category = require('app/models/category.js');
module.exports = new class categoryController extends controller {
    async index(req,res,next){
       try {
            let page = req.query.page || 1 ;
            let categories = await Category.paginate({},
                {page:page ,sort: {createdAt: -1}, limit : 2, populate : 'parent'});
            res.render('admin/categories/index.ejs', {title: 'دسته ها', categories});
        } catch(error){
            next(error);
        }
    }
    async create(req,res){
        let categories = await Category.find({ parent : null });
        res.render('admin/categories/create.ejs', { categories });
    }
    async store(req,res, next){
       try{
           let status = await this.validationData(req);
           if(! status ) return this.back(req, res);
            let {name , parent } = req.body ;
           let newCategory = new Category({
               name ,
               slug : this.slug(name),
               parent : parent !== 'none' ? parent : null
           });
           await newCategory.save();
           return res.redirect('/admin/categories');
       } catch(error){
           next(error);
       }
    }
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
    async destroy(req, res, next){
       try {
           this.isMongoId(req.params.id);
           let category = await Category.findById(req.params.id).populate('childs').exec();
           if(!category) this.error('چنین دسته ای وجود ندارد.',404);
           category.childs.forEach(category => category.remove());
            category.remove();
           return res.redirect('/admin/categories')
       } catch(error){
           next(error);
       }
    }
}