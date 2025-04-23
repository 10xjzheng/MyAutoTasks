auto.waitFor();
setScreenMetrics(1267, 2400);

// 创建日志收集器
var logCollector = {
    logs: [],
    serverUrl: "http://10.11.73.4:3000/log", // 本地服务器地址
    
    // 添加日志
    log: function(message) {
        // 使用东八区时间（+8小时）
        let date = new Date(new Date().getTime() + 8 * 60 * 60 * 1000);
        let timestamp = date.toISOString().replace('T', ' ').replace(/\.\d+Z$/, '');
        let logEntry = timestamp + ": " + message;
        this.logs.push(logEntry);
        console.log(logEntry); // 同时在控制台显示，便于调试
    },
    
    // 上传日志到服务器
    uploadLogs: function() {
        this.log("准备上传日志...");
        
        try {
            // 准备要发送的日志数据
            let logData = {
                logs: this.logs
            };
            
            // 发送HTTP请求
            let response = http.post(this.serverUrl,logData, {
                contentType: "application/json"
                });
            
            // 检查响应
            if (response.statusCode >= 200 && response.statusCode < 300) {
                this.log("日志上传成功！状态码: " + response.statusCode);
                // 清空已上传的日志
                this.logs = [];
            } else {
                this.log("日志上传失败！状态码: " + response.statusCode);
                this.log("响应内容: " + response.body.string());
            }
        } catch (e) {
            this.log("日志上传出错: " + e);
        }
    }
};

// 启动应用并收集日志
logCollector.log("脚本开始执行");
logCollector.log("设置屏幕尺寸: 1267x2400");
sleep(2000);

logCollector.log("启动淘宝应用");
app.launchApp("淘宝");
sleep(2000);

try {
    logCollector.log("开始查找芭芭农场控件");
    let obj = desc('芭芭农场').findOne(10000);
    
    if (obj) {
        let bounds = obj.bounds();
        logCollector.log("找到芭芭农场控件: " + JSON.stringify(bounds));
        
        // 计算中心点坐标
        var x = bounds.centerX();
        var y = bounds.centerY();
        logCollector.log("中心坐标: " + x + ", " + y);
        
        // 点击控件
        click(x, y);
        logCollector.log("已点击芭芭农场控件");
    } else {
        logCollector.log("未找到芭芭农场控件");
    }
} catch (e) {
    logCollector.log("查找芭芭农场时出错: " + e);
}

sleep(3000);

// 收集所有控件信息
collectAllElementsInfo();

// 上传收集的日志
logCollector.uploadLogs();

// 收集当前页面所有控件的函数
function collectAllElementsInfo() {
    logCollector.log("===== 开始收集当前页面所有控件 =====");
    
    try {
        // 使用控件选择器获取所有控件
        var allElements = selector().find();
        logCollector.log("总共找到 " + allElements.length + " 个控件");
        
        // 遍历并记录每个控件的信息
        for(let i = 0; i < allElements.length && i < 50; i++) { // 限制为最多50个，防止日志过大
            let element = allElements[i];
            let elementInfo = "-------- 控件 " + i + " --------\n";
            
            // 记录基本属性
            if(element.text()) elementInfo += "文本: " + element.text() + "\n";
            if(element.desc()) elementInfo += "描述: " + element.desc() + "\n";
            if(element.id()) elementInfo += "ID: " + element.id() + "\n";
            if(element.className()) elementInfo += "类名: " + element.className() + "\n";
            
            // 记录位置信息
            try {
                let b = element.bounds();
                elementInfo += "位置: [" + b.left + ", " + b.top + ", " + b.right + ", " + b.bottom + "]\n";
                elementInfo += "中心点: (" + b.centerX() + ", " + b.centerY() + ")\n";
            } catch (e) {
                elementInfo += "获取位置出错: " + e + "\n";
            }
            
            // 记录是否可点击、是否可滚动等状态
            elementInfo += "可点击: " + element.clickable() + "\n";
            elementInfo += "可滚动: " + element.scrollable() + "\n";
            elementInfo += "是否选中: " + element.selected() + "\n";
            elementInfo += "是否可见: " + element.visibleToUser() + "\n";
            
            // 添加到日志收集器
            logCollector.log(elementInfo);
        }
    } catch (e) {
        logCollector.log("收集控件信息时出错: " + e);
    }
    
    logCollector.log("===== 结束收集当前页面所有控件 =====");
}
