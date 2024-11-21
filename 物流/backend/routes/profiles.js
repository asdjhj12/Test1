// routes/profiles.js
const express = require('express');
const router = express.Router();
const Profile = require('../models/UserProfile');
const User = require('../models/User');

// 获取个人资料
router.get('/', async (req, res) => {
  const { username } = req.query; // 从查询参数中获取 username
  try {
    const user = await User.findOne({ username }); // 根据用户名查找用户
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }
    const profiles = await Profile.find({ userId: user._id }); // 查找该用户的个人资料
    res.json(profiles);
  } catch (error) {
    console.error('获取个人资料失败:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
});

// 创建或更新个人资料
router.post('/', async (req, res) => {
  const { username, profileData } = req.body; // 从请求体中获取 username 和 profileData
  try {
    const user = await User.findOne({ username }); // 根据用户名查找用户
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    const existingProfile = await Profile.findOne({ userId: user._id }); // 查找该用户的个人资料

    if (existingProfile) {
      // 更新现有个人资料
      const updatedProfile = await Profile.findByIdAndUpdate(existingProfile._id, profileData, { new: true });
      res.json(updatedProfile);
    } else {
      // 创建新的个人资料
      const newProfile = new Profile({
        ...profileData,
        userId: user._id
      });
      await newProfile.save();
      res.status(201).json(newProfile);
    }
  } catch (error) {
    console.error('创建或更新个人资料失败:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
});
// 更新个人资料
router.put('/:id', async (req, res) => {
  const profileId = req.params.id;
  const profileData = req.body;
  try {
    const updatedProfile = await Profile.findByIdAndUpdate(profileId, profileData, { new: true });
    res.json(updatedProfile);
  } catch (error) {
    console.error('更新个人资料失败:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
});
module.exports = router;