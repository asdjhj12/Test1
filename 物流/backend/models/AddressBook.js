// models/AddressBook.js
const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // 关联用户 ID
  name: { type: String, required: true }, // 联系人姓名
  phone: { type: String, required: true }, // 联系电话
  city: { type: String, required: true }, // 城市
  address: { type: String, required: true }, // 详细地址
  company: { type: String, required: false }, // 公司名称（可选）
  createdAt: { type: Date, default: Date.now } // 创建时间
});

const Address = mongoose.model('Address', addressSchema);

module.exports = Address;