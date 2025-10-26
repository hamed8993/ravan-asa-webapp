const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = Schema({
    chatRoom : {type : Schema.Types.ObjectId , ref : 'ChatRoom',
        required : true},
    user : {type : Schema.Types.ObjectId , ref : 'User',
        required : true},
    // chatRoom : {type : String , required : true},
    // user : {type : String ,  required : true},
    body : {type: String, default : ''},
    msgSeen : {type: Boolean, default : false},

},{timestamps : true});

module.exports = mongoose.model('Chats',chatSchema);