var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    name:String,
    email:String,
    password:String,
    role:String,
    isActive:Boolean
})

// login user is collection name
// define collection name & design of collection
mongoose.model('LoginUser',UserSchema);
module.exports = mongoose.model('LoginUser')