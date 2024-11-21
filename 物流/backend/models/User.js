// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
 username: {
   type: String,
   required: true,
   unique: true,
   minlength: 3,
   maxlength: 30
 },
 password: {
   type: String,
   required: true,
   minlength: 6
 },

});



// 分别为 'users' 和 'users2' 集合定义模型
const User = mongoose.model('User', userSchema, 'users');
const User2 = mongoose.model('User', userSchema, 'users2');

module.exports = { User, User2 };