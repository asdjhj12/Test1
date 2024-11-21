const express = require('express');
const router = express.Router();
const { User, User2 } = require('../models/User'); // 引入两个模型
const jwt = require('jsonwebtoken');

// 注册路由
router.post('/register/users', async (req, res) => {
  const { username, password } = req.body;

  try {
    // 检查用户是否已存在
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ msg: '用户已存在' });
    }

    // 创建新用户（密码保持原样，不进行哈希处理）
    const newUser = new User({
      username,
      password // 密码保持原样
    });

    // 保存用户到数据库
    await newUser.save();

    // 生成JWT
    const token = jwt.sign({ userId: newUser._id }, 'your_jwt_secret', { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ msg: ' 输入密码至少得6位'});
  }
});


// 登录路由
router.post('/login/users', async (req, res) => {
  const { username, password } = req.body;

  try {
    // 查找用户
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ msg: '用户未注册' });
    }

    // 验证密码（因为密码未加密，这里直接比较）
    if (user.password !== password) {
      return res.status(400).json({ msg: '密码错误' });
    }

    // 生成JWT
    const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ msg: '服务器错误' });
  }
});


//----------------------------------------------------------
// 注册路由
router.post('/register/users2', async (req, res) => {
  const { username, password } = req.body;

  try {
    // 检查用户是否已存在
    const existingUser2 = await User2.findOne({ username });
    if (existingUser2) {
      return res.status(400).json({ msg: '用户已存在' });
    }

    // 创建新用户（密码保持原样，不进行哈希处理）
    const newUser2 = new User2({
      username,
      password // 密码保持原样
    });

    // 保存用户到数据库
    await newUser2.save();

    // 生成JWT
    const token = jwt.sign({ userId: newUser2._id }, 'your_jwt_secret', { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ msg: ' 输入密码至少得6位' });
  }
});


// 登录路由
router.post('/login/users2', async (req, res) => {
  const { username, password } = req.body;

  try {
    // 查找用户
    const user2 = await User2.findOne({ username });
    if (!user2) {
      return res.status(400).json({ msg: '用户未注册' });
    }

    // 验证密码（因为密码未加密，这里直接比较）
    if (user2.password !== password) {
      return res.status(400).json({ msg: '密码错误' });
    }

    // 生成JWT
    const token = jwt.sign({ userId: user2._id }, 'your_jwt_secret', { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ msg: '服务器错误' });
  }
});

module.exports = router;