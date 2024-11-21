// models/UserProfile.js
const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // 关联用户 ID
  firstName: { type: String, required: true }, // 名
  lastName: { type: String, required: true }, // 姓
  phone: { type: String, required: true }, // 电话
  email: { type: String, required: true }, // 邮箱
  address: { type: String, required: true }, // 地址
  city: { type: String, required: true }, // 城市
  zipCode: { type: String, required: true }, // 邮编
  createdAt: { type: Date, default: Date.now } // 创建时间
});

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;