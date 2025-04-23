// 导入必要模块
const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

// 创建Express应用
const app = express();
const PORT = process.env.PORT || 3000;

// 使用中间件解析JSON请求体
app.use(bodyParser.json({ limit: '10mb' }));

// 确保log目录存在
const logDir = path.join(__dirname, 'log');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// 获取当前日期字符串，格式为YYYY-MM-DD
function getDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 接收日志的接口
app.post('/log', (req, res) => {
  try {
    // 获取请求体中的日志数据
    const logData = req.body;
    
    // 如果请求体为空，返回错误
    if (!logData) {
      return res.status(400).json({ error: '没有接收到日志数据' });
    }
    
    // 获取当前日期作为文件名
    const dateStr = getDateString();
    const logFilePath = path.join(logDir, `${dateStr}.log`);
    
    // 格式化日志内容
    let logContent = '';
    
    if (Array.isArray(logData.logs)) {
      // 如果是数组格式的日志
      logContent = logData.logs.join('\n');
    } else if (typeof logData === 'string') {
      // 如果是字符串格式的日志
      logContent = logData;
    } else {
      // 如果是其他格式，转为JSON字符串
      logContent = JSON.stringify(logData, null, 2);
    }
    
    // 添加时间戳和分隔线
    const timestamp = new Date().toISOString();
    const formattedLog = `\n===== 接收到新日志 ${timestamp} =====\n${logContent}\n`;
    
    // 将日志追加到文件
    fs.appendFile(logFilePath, formattedLog, (err) => {
      if (err) {
        console.error('写入日志文件失败:', err);
        return res.status(500).json({ error: '写入日志文件失败' });
      }
      
      console.log(`日志已保存到 ${logFilePath}`);
      res.status(200).json({ message: '日志接收成功' });
    });
  } catch (error) {
    console.error('处理日志请求时出错:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});


// 启动服务器
app.listen(PORT, () => {
  console.log(`日志服务器已启动，监听端口 ${PORT}`);
});
