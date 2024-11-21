const express = require('express');
const Express = require('../models/expressModel');  // 引入快递单模型
const { User } = require('../models/User');  // 引入用户模型
const router = express.Router();

// 生成唯一的5位数快递单号
const generateTrackingNumber = async () => {
  let trackingNumber;
  let exists = true;

  // 保证生成的快递单号在数据库中唯一
  while (exists) {
    trackingNumber = Math.floor(10000 + Math.random() * 90000);  // 生成5位随机数
    const existingTrackingNumber = await Express.findOne({
      tracking_number: trackingNumber
    });
    exists = existingTrackingNumber !== null;  // 如果已存在，继续生成
  }

  return trackingNumber.toString();
};

// 获取用户所有快递信息
router.get('/expresses', async (req, res) => {
  const { username } = req.query;  // 从查询参数中获取 username

  try {
    // 根据用户名查找用户
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    // 查找该用户相关的快递单
    const expresses = await Express.find({ userId: user._id });  // 查找该用户的所有快递单
    res.json(expresses);  // 返回结果
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 获取所有快递信息
router.get('/expresses/getAll', async (req, res) => {
  try {
    // 查找数据库中的所有快递单
    const expresses = await Express.find();

    if (expresses.length === 0) {
      return res.status(404).json({ message: '没有找到任何快递信息' });
    }

    // 返回所有快递单数据
    res.json(expresses);
  } catch (err) {
    console.error('获取所有快递信息失败:', err);
    res.status(500).json({ message: '服务器错误', error: err.message });
  }
});




// 提交快递单：根据用户名添加快递单
router.post('/expresses', async (req, res) => {
  const { formData, username } = req.body;  // 从请求体中获取表单数据和 username

  try {
    // 根据用户名查找用户
    const user = await User.findOne({ username });  // 这里根据 username 查找用户

    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    // 生成一个唯一的快递单号
    const trackingNumber = await generateTrackingNumber();

    // 创建新的快递单
    const newExpress = new Express({
      sender: formData.sender,
      recipient: formData.recipient,
      shippingMethod: formData.shippingMethod,
      userId: user._id,  // 关联用户 ID
      tracking_number: trackingNumber  // 保存生成的快递单号
    });

    // 保存快递单数据
    await newExpress.save();

    res.status(200).json({ message: '快递单提交成功', trackingNumber });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: '服务器内部错误', error: error.message });
  }
});

// 编辑快递信息
router.put('/expresses/:trackingNumber', async (req, res) => {
  const { formData } = req.body;  // 获取表单数据
  const { trackingNumber } = req.params;  // 获取 URL 参数中的 trackingNumber

  try {
    // 查找要更新的快递单，根据 tracking_number 查找
    const express = await Express.findOne({ tracking_number: trackingNumber });

    if (!express) {
      return res.status(404).json({ message: '快递信息未找到' });
    }

    // 更新快递信息
    express.sender.name = formData.sender.name || express.sender.name;
    express.sender.city = formData.sender.city || express.sender.city;
    express.recipient.name = formData.recipient.name || express.recipient.name;
    express.recipient.city = formData.recipient.city || express.recipient.city;
    express.signTime = formData.signTime || express.signTime;

    // 保存更新的快递单
    await express.save();
    res.json(express);  // 返回更新后的快递单
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

// 删除快递信息
router.delete('/expresses/:tracking_number', async (req, res) => {
  try {
    const expressTrackingNumber = req.params.tracking_number;

    // 直接查找并删除
    const result = await Express.findOneAndDelete({ tracking_number: expressTrackingNumber });

    if (!result) {
      return res.status(404).json({ message: '快递信息未找到' });
    }

    res.json({ message: '快递信息已删除' });
  } catch (err) {
    console.error('删除错误:', err);
    res.status(500).json({ message: err.message });
  }
});

// 签收快递：更新快递的 isSigned 状态为 1
router.put('/expresses/sign/:trackingNumber', async (req, res) => {
  const { trackingNumber } = req.params;

  try {
    // 查找要签收的快递单
    const express = await Express.findOne({ tracking_number: trackingNumber });

    if (!express) {
      return res.status(404).json({ message: '快递单未找到' });
    }

    // 更新快递单的签收状态
    express.isSigned = 1;  // 更新为已签收
    express.signTime = new Date();  // 更新签收时间

    // 保存更新后的快递单
    await express.save();

    // 返回签收后的快递单信息
    res.json(express);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '签收失败，请重试' });
  }
});

module.exports = router;
