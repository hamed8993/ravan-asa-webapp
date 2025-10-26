const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const courseSchema = Schema({
    user : { type : Schema.Types.ObjectId , ref : 'User'},
    categories : [{ type : Schema.Types.ObjectId , ref : 'Category' }],
    title : { type : String , required : true },
    slug : { type : String , required : true },// for SEO
    type : { type : String , required : true },
    body : { type : String , required : true },
    images : { type : Object , required : true },//جمعه، چون میخواد یدونه عکسو با سایزای مختلف ذخیره کنه.
    thumb : { type : String , required : true },
    price : { type : String , required : true },
    tags : { type : String , required : true },
    time : { type : String , default : "00:00:00" },
    viewCount : { type : Number , default : 0 },
    commentCount : { type : Number , default : 0 },
}, { timestamps: true , toJSON : {virtuals : true} });

courseSchema.plugin(mongoosePaginate);

courseSchema.methods.typeToPersian = function() {
    switch (this.type) {
        case 'vip' :
            return 'اعضای ویژه'
        break;
        case 'cash' :
            return 'نقدی'
            break;
        default :
            return 'رایگان'
        break;
    }
}

courseSchema.methods.path = function() {
    return `/courses/${this.slug}`;
};
courseSchema.virtual('episodes',{
           ref: 'Episode',
           localField : '_id',
           foreignField : 'course'
});
courseSchema.virtual('comments',{
    ref: 'Comment',
    localField : '_id',
    foreignField : 'course'
});

courseSchema.methods.inc = async function(field, num=1){
    this[field] += num;
    await this.save();
}

module.exports = mongoose.model('Course', courseSchema);