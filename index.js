auto.waitFor();
auto.setMode("fast");
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
        console.log("准备上传日志...");
        try {
            if(this.logs.length == 0) {
                console.log("没有日志需要上传");
                return;
            }
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
                console.log("日志上传成功！状态码: " + response.statusCode);
                // 清空已上传的日志
                this.logs = [];
            } else {
                console.log("日志上传失败！状态码: " + response.statusCode);
                console.log("响应内容: " + response.body.string());
            }
        } catch (e) {
            console.log("日志上传出错: " + e);
        }
    }
};
const TaskSign = '去签到';
const TaskAnswer = '去答题';
const TaskView1 = '去完成';
const TaskView2 = '去浏览';
const TaskCollect = '去领取';
const TaskWalk = '去逛逛';
let taskTypes = [TaskSign, TaskAnswer,TaskCollect];
logCollector.log("开始运行");
setScreenMetrics(device.width,device.height);
logCollector.log("分辨率: " + device.width + "x" + device.height);

app.launchApp("淘宝");
randomSleep() 
try {
    let bbnc = desc('芭芭农场').findOne(3000);  
    if (bbnc) {
        let bounds = bbnc.bounds();
        var x = bounds.centerX();
        var y = bounds.centerY();
        click(x, y);
    } else {
        logCollector.log("未找到芭芭农场任务");
    }
    randomSleep() 
    clickCollectButton();
    randomSleep();
    for (let i = 0; i < taskTypes.length; i++) {
        doTask(taskTypes[i]);
    }
} catch (e) {
    logCollector.log("芭芭农场任务出错: " + e);
}
// 上传收集的日志
logCollector.uploadLogs();

// 随机休眠
function randomSleep() {
    sleep(random(1000, 2000));
}

// 逛一逛
function walkTask(taskBotton) {
    logCollector.log("向上滑动");
    swipe(parseInt(device.width * 1/3) + random(10,100), parseInt(device.height * 4/7)+ random(10,100), parseInt(device.width*2/3) + random(50,200), parseInt(device.height* 1/4) + random(100,300), 1000);
    randomSleep();
    clickBotton(taskBotton);
    logCollector.log("跳转逛一逛页面");
    sleep(3000);
    logCollector.log("返回");
    back(); 
    randomSleep();
    back();
    logCollector.log("返回集肥料页面");
    clickCollectButton();
    randomSleep();
}
// 点击按钮
function clickBotton(taskBotton) {
    // 打印按钮详细信息
    logCollector.log("点击按钮: " + taskBotton.text());
    let b = taskBotton.bounds();
    logCollector.log("按钮位置: ["  + b.left + ", " + b.top + ", " + b.right + ", " + b.bottom + "]");
    logCollector.log("按钮类型: " + taskBotton.className());
    logCollector.log("按钮描述: " + taskBotton.desc());
    if(taskBotton.className() == "android.widget.Button") {
        taskBotton.click();
    } else {
        let bounds = taskBotton.bounds();
        var x = bounds.centerX();
        var y = bounds.centerY();
        click(x, y);
    }
}

// 答题
function answerTask(taskBotton, answer) {
    clickBotton(taskBotton);
    randomSleep();
    let answerBotton = textContains(answer).findOne(1000);
    if (answerBotton) {
        clickBotton(answerBotton);
        randomSleep();
        let nextBotton = textContains('领取奖励').findOne(2000);
        if (nextBotton) {
            clickBotton(nextBotton);
            // 回到集肥料的页面继续做其它任务
            randomSleep();
            clickCollectButton();
            randomSleep();
            return true;
        } else {
            logCollector.log("未找到领取奖励按钮"); 
            closebtn = text('关闭').findOne(2000);
            if (closebtn) {
                clickBotton(closebtn);
                randomSleep();
                clickCollectButton();
                randomSleep();
                taskAnswerBotton = className("android.widget.Button").textContains(TaskAnswer).findOne(2000);
                if (taskAnswerBotton) {
                    answerTask(taskAnswerBotton, 'B.');
                }
            } else {
                logCollector.log("未找到关闭按钮");
                return false;
            }
        }
    } else {
        logCollector.log("未找到答题按钮");
        return false;
    }
}

// 点击集肥料
function clickCollectButton() {
    let cbtn = text('集肥料').findOne(2000);
    if (cbtn) {
        clickBotton(cbtn);
    } else {
        logCollector.log("未找到集肥料");
    }
}

// 浏览任务
function viewTask() {
    clickBotton(taskBotton);
    randomSleep();
    logCollector.log("向上滑动");
    swipe(parseInt(device.width * 1/3) + random(10,100), parseInt(device.height * 3/7)+ random(10,100), parseInt(device.width*2/3) + random(50,200), parseInt(device.height* 1/4) + random(100,300), 1000);
    sleep(3000+random(1000,2000));
    logCollector.log("向下滑动");
    swipe(parseInt(parseInt(device.width*2/3) + random(50,200), parseInt(device.height* 1/4) + random(100,300),device.width * 1/3) + random(10,100), parseInt(device.height * 3/7)+ random(10,100), 1000);
    sleep(3000+random(1000,2000));
    swipe(parseInt(device.width * 1/3) + random(10,100), parseInt(device.height * 3/7)+ random(10,100), parseInt(device.width*2/3) + random(50,200), parseInt(device.height* 1/4) + random(100,300), 1000);
    sleep(3000+random(1000,2000));
    logCollector.log("向下滑动");
    swipe(parseInt(parseInt(device.width*2/3) + random(50,200), parseInt(device.height* 1/4) + random(100,300),device.width * 1/3) + random(10,100), parseInt(device.height * 3/7)+ random(10,100), 1000);
    sleep(3000+random(1000,2000));
    swipe(parseInt(device.width * 1/3) + random(10,100), parseInt(device.height * 3/7)+ random(10,100), parseInt(device.width*2/3) + random(50,200), parseInt(device.height* 1/4) + random(100,300), 1000);
    sleep(3000+random(1000,2000));
    logCollector.log("返回");
    back(); 
    logCollector.log("返回集肥料页面");
    clickCollectButton();
    randomSleep();
}

// 签到任务
function signTask(taskBotton) {
    clickBotton(taskBotton);
}

// 领肥料
function collectTask(taskBotton) {
    // 向上滑动
    logCollector.log("向上滑动");
    swipe(parseInt(device.width * 1/3) + random(10,100), parseInt(device.height * 6/7)+ random(10,100), parseInt(device.width*2/3) + random(50,200), parseInt(device.height* 1/7) + random(100,300), 2500);
    randomSleep();
    clickBotton(taskBotton);
}

// 获取任务
function getTasks(taskType) {
    let tasks = [];
    switch (taskType) {
        case TaskSign:
            // 签到任务
            taskSignBotton = className("android.widget.Button").textContains(TaskSign).findOne(2000);
            if (taskSignBotton) {
                tasks.push({'taskType':TaskSign,'taskBotton':taskSignBotton});
            }
            break;
        case TaskAnswer:
            // 答题任务
            taskAnswerBotton = className("android.widget.Button").textContains(TaskAnswer).findOne(2000);
            if (taskAnswerBotton) {
                tasks.push({'taskType':TaskAnswer,'taskBotton':taskAnswerBotton});
            }
            break;
        case TaskView1:
            // 浏览任务
            taskViewBotton = className("android.widget.Button").textContains(TaskView1).find();
            for (let i = 0; i < taskViewBotton.length; i++) {
                parentObj = taskViewBotton[i].parent();
                if (parentObj) {
                    textViewObj = parentObj.findOne(textContains('浏览15秒得'));
                    if (textViewObj) {
                        logCollector.log("浏览任务1: " + textViewObj.text());
                        tasks.push({'taskType':TaskView1,'taskBotton':taskViewBotton[i]});
                    }
                }
            }
            break;
        case TaskView2:
            // 浏览任务
            taskViewBotton = className("android.widget.Button").textContains(TaskView2).find();
            for (let i = 0; i < taskViewBotton.length; i++) {
                parentObj = taskViewBotton[i].parent();
                if (parentObj) {
                    textViewObj = parentObj.findOne(textContains('浏览15秒得'));
                    if (textViewObj) {
                        logCollector.log("浏览任务2: " + textViewObj.text());
                        tasks.push({'taskType':TaskView2,'taskBotton':taskViewBotton[i]});
                    }
                }
            }
            break;
        case TaskCollect:
            // 领肥料任务
            taskCollectBotton = className("android.widget.Button").textContains(TaskCollect).findOne(2000);
            if (taskCollectBotton) {
                tasks.push({'taskType':TaskCollect,'taskBotton':taskCollectBotton});
            }
            break;
        case TaskWalk:
            // 逛逛任务
            taskWalkBotton = className("android.widget.Button").textContains(TaskWalk).find();
            for (let i = 0; i < taskWalkBotton.length; i++) {
                parentObj = taskWalkBotton[i].parent();
                if (parentObj) {
                    textWalkObj = parentObj.findOne(textContains('逛逛得'));
                    if (textWalkObj) {
                        logCollector.log("逛逛任务: " + textWalkObj.text());
                        tasks.push({'taskType':TaskWalk,'taskBotton':taskWalkBotton[i]});
                    } 
                }
            }
            break;
    }
    return tasks;
}

// 执行任务
function doTask(taskType) {
    let tasks = getTasks(taskType);
    logCollector.log("任务类型: " + taskType + "，任务列表: " + JSON.stringify(tasks));
    for (let i = 0; i < tasks.length; i++) {
        logCollector.log("==========执行任务: " + tasks[i].taskType, " 序号：" + (i+1));
        switch (tasks[i].taskType) {
            case TaskSign:
                signTask(tasks[i].taskBotton);
                break;
            case TaskAnswer:
                answerTask(tasks[i].taskBotton, 'A.')
                break;
            case TaskView1:
                viewTask(tasks[i].taskBotton);
                break;
            case TaskView2:
                viewTask(tasks[i].taskBotton);
                break;
            case TaskCollect:
                collectTask(tasks[i].taskBotton);
                break;
            case TaskWalk:
                walkTask(tasks[i].taskBotton);
                break;
        }
        logCollector.log("==========完成任务: " + tasks[i].taskType);
        // 随机休眠1-2秒
        randomSleep();
    }
}    