const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config(); // 确保这一行存在

const authRoutes = require('./routes/auth');
const expressRoutes = require('./routes/expressRoutes'); // 用于管理快递信息的路由
const Address = require('./routes/addresses');
const profile = require('./routes/profiles');

const app = express();
// 中间件
app.use(cors());
app.use(express.json());

// 路由
app.use('/api', authRoutes);
app.use('/api',Address);
app.use('/api',profile);
app.use('/api', expressRoutes);  // 快递数据相关的路由
// 连接MongoDB
const uri = process.env.MONGO_URI; // 从环境变量中获取连接字符串

if (!uri) {
  console.error('MongoDB URI is not defined');
  process.exit(1); // 如果 URI 未定义，终止进程
}

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB 连接成功');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`服务器运行在端口 ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB 连接失败:', err);
  });