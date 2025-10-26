const mymongoose = require('mongoose');
const Schema = mymongoose.Schema;
const bcrypt = require('bcrypt');
const uniqiueString = require('unique-string');//newwwwwwwwwwwww
const mongoosePaginate = require('mongoose-paginate');


const userSchema = Schema({
    name: { type: String , required: true},
    admin:  { type: Boolean , default: 0},
    active:  { type: Boolean , default: false},
    email:  { type: String , unique: true , required: true},
    password: { type: String , required: true},
    rememberToken: {type: String, default: null},
    learning : [{ type : Schema.Types.ObjectId, ref : 'Course'}],
    roles : [{ type : Schema.Types.ObjectId, ref : 'Role'}],
    vipTime: {type: Date, default: new Date().toISOString() },
    vipType: {type: String, default: 'month'},
    avatar : { type : String, default:'/projectImages/avatar-f.png' }
    },
    { timestamps : true,  toJSON : { virtuals : true }}
)
userSchema.plugin(mongoosePaginate);

//متد هش کردن پسورد، جانشین دو متد pre('save',...) , pre(findOneAndUpdate',...) :
userSchema.methods.hashPassword = function(pass) {
    let salt = bcrypt.genSaltSync(15);
    let hash = bcrypt.hashSync(pass, salt);
    return hash;
}

//for login:
userSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password , this.password);
}
userSchema.methods.hasRole = function(roles){
    let result = roles.filter(role =>{
        return this.roles.indexOf(role) !== -1
    });
    // console.log(result);
    return !! result.length;
}
userSchema.methods.setRememberToken = function(res) {// newwwwwwwwwwwww
    const token = uniqiueString();
    res.cookie('remember_token', token, {maxAge: 1000*60*60*24 , httpOnly: true, signed: true});
    this.update({rememberToken : token}, err =>{
        // console.log('token ERROR:>>>',err );
    });
    }
    userSchema.virtual('courses',{
        ref : 'Course',
        localField : '_id',
        foreignField : 'user'
    });


    userSchema.methods.isVip = function(){
        return new Date(this.vipTime) > new Date();
    }
    userSchema.methods.checkLearning = function(courseId){
        // console.log(this.learning.indexOf(course.id));
        return this.learning.indexOf(courseId) !==-1 ;
    }

module.exports = mymongoose.model('User', userSchema);