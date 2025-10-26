const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');
const categorySchema = Schema({
    name : { type : String , required : true },
    slug : { type : String , required : true },
    parent : { type : Schema.Types.ObjectId ,
        ref : 'Category', default: null}
}, { timestamps: true , toJSON : {virtuals : true } });
categorySchema.plugin(mongoosePaginate);
categorySchema.virtual('childs',{
    ref : 'Category',
    localField : '_id',
    foreignField : 'parent'
});
//این ویرچوآل رو بعدا فهمیدم که بدون توضیحی گذاشته! منم گذاشتمش!
//: مال جلسه ی 45 حسام و 39 من هست:
categorySchema.virtual('courses' , {
    ref : 'Course',
    localField : '_id',
    foreignField : 'categories'
});

module.exports = mongoose.model('Category', categorySchema);