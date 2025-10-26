const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatRoomSchema = Schema({
    type : {type: String, default : 'private'},
    p1 : {type : Schema.Types.ObjectId , ref : 'User', required : true},
    p2 : {type : Schema.Types.ObjectId , ref : 'User', required : true}
},{timestamps : true});

module.exports = mongoose.model('ChatRoom',chatRoomSchema);