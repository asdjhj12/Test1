const mongoose = require('mongoose');

// 创建一个寄件单表单数据的 Schema
const expressSchema = new mongoose.Schema({
  sender: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    company: { type: String, required: false },
  },
  recipient: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    company: { type: String, required: false },
  },
  shippingMethod: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // 引用用户的 ID
  tracking_number: { type: String, required: true, unique: true },  // 快递单号，确保唯一
  isSigned: { type: Number, required: true, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

// 创建模型
const Express = mongoose.model('Express', expressSchema);

module.exports = Express;
