// routes/addresses.js
const express = require('express');
const router = express.Router();
const Address = require('../models/AddressBook');

// 获取当前用户的地址簿
router.get('/', async (req, res) => {
  const { username } = req.query;
  try {
    const user = await User.findOne({ username }); // 假设 User 模型已定义
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }
    const addresses = await Address.find({ userId: user._id });
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 添加新地址
router.post('/', async (req, res) => {
  const { username } = req.query;
  const addressData = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }
    const newAddress = new Address({
      ...addressData,
      userId: user._id
    });
    await newAddress.save();
    res.status(201).json(newAddress);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 更新地址信息
router.put('/:id', async (req, res) => {
  const { username } = req.query;
  const addressId = req.params.id;
  const addressData = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }
    const updatedAddress = await Address.findByIdAndUpdate(addressId, addressData, { new: true });
    res.json(updatedAddress);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 删除地址信息
router.delete('/:id', async (req, res) => {
  const { username } = req.query;
  const addressId = req.params.id;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }
    await Address.findByIdAndDelete(addressId);
    res.json({ message: '地址信息已删除' });
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

module.exports = router;