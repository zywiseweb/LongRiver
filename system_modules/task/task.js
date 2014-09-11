var mongoose = require('../database/mongodb');
var scheduleManager = require('../schedule/schedule');
var robotManager = require('../resource/robot');
var docManager = require('../doc/doc');
var async = require('async');//流程控制
var Schema = mongoose.Schema;
var util = require('../util');

//此类用户存储管理数据模型

//****************定义模型*******************
//数据模型
/**
 * 任务模型
 * @type Schema
 */
var taskSchema = new Schema({
    username: {type: String},
    user_displayname: {type: String},
    foregroundID: {type: Number},
    name: {type: String},
    task_id: {type: Number, required: true, default: new Date().getTime()},
    task: {type: String, required: true},
    sub_count: {type: Number, required: true},
    sub_schedule_count: {type: Number},
    schedule_min: {type: Number},
    schedule_max: {type: Number},
    schedule: {},
    task_tag: {},
    task_status: {type: Number},
    create_time: {type: String},
    task_type: {type: Number, required: true, default: 901},
    task_type_name: {type: String},
    need_schedule_times: {type: Number}, //重复测试
    platformName: {type: String} //平台名称
},
{collection: "task"});
var subTaskSchema = new Schema({
    task_id: {type: Number},
    sub_id: {type: Number},
    status: {type: Number},
    task: {type: Number},
    account: {},
    doc: {type: String},
    tag: {},
    code: 0,
    time: {type: String},
    ip: {type: String}
}, {
    collection: "subTask"
}
);

//****************定义实体控制*******************
var TaskManager = mongoose.model('task', taskSchema);
var SubTaskManager = mongoose.model('subTask', subTaskSchema);

//*******************暴露接口*******************

exports.findTask = function(where, callback) {
    TaskManager.findOne(where, callback);
};
exports.findSubTask = function(id, callback) {
    SubTaskManager.find({task_id: id}, 'sub_id time status ip', callback);
};
/**
 * 保存用户
 * @param {type} newUser
 * @param {type} callback
 * @returns {undefined}
 */
exports.saveTask = function(task, callback) {
    if (!task) {
        callback('task is null');
    }
    saveTask(task, callback);
};

/*
 
 var str = JSON.stringify(task);
 console.info(str + "--");
 var d = "{\"content\":" + str + ",\"type\": 101}\r\n";
 
 scheduleManager.sendCommand(d, function(err) {
 if (err) {
 callback(err);
 } else {
 callback(null);
 }
 });
 */

function saveTask(task, callback) {
    console.info(JSON.stringify(task) + "----------");
    async.parallel([
        function(callback) {//保持数据
            var newTask = new TaskManager(task);
            newTask.save(function(err) {
                if (err) {
                    callback(err, '保存错误');
                    console.log(err);
                } else {
                    console.log("保存成功");
                    callback(null, '保存成功');
                }
            });
        }
        ,
        function(callback) {//发送数据
            var str = JSON.stringify(task);
            console.info(str + "--");
            var d = "{\"content\":" + str + ",\"type\": 101}\r\n";

            scheduleManager.sendCommand(d, function(err) {
                if (err) {
                    console.info("发送执行出错");
                } else {
                    console.info("指令已经发送");
                }
                callback(null);
            });
        }
    ], function(err, results) {
        if (err) {
            callback(err);
        } else {
            callback(null);
        }

    });

}
;
/**
 * 分页查询
 * @param {type} params
 * @param {type} callback
 * @returns {undefined}
 */
exports.findPagination = function(params, callback) {
    var q = params.search || {}; //查询调价
    var col = params.columns || {}; //字段
    // var task = params.task; //字段

    var pageNumber = params.num || 1; //页数
    var resultsPerPage = params.limit || 10; //每页行数

    var skipFrom = (pageNumber * resultsPerPage) - resultsPerPage; //其实也



    // console.info('q:' + q + ' col:' + col + ' pageNumber:' + pageNumber + ' skipFrom:' + skipFrom);
    var query = TaskManager.find(q, col)//{task:{$in:['303']}}
            //  .where('task').in(task)
            .sort([['_id', -1]])
            .skip(skipFrom)
            .limit(resultsPerPage);
    if (params.task) {//查询类型条件
        query.where('task').in(params.task);
    }
    if (params.status) {
        query.where('task_status').in(params.status);
    }

    query.exec(function(err, results) {

        if (err) {
            callback(err, null);
        } else {
            TaskManager.count(q, function(err, count) {
                if (err) {
                    callback(err, null);
                } else {

                    var pageCount = Math.ceil(count / resultsPerPage);
                    callback(null, {'pageCount': pageCount, 'results': results, currentPage: pageNumber});
                }
            });
        }
    });
};
/**
 * 新建 新闻 支持任务
 * @param {type} req
 * @param {type} callback
 * @returns {undefined}
 */
exports.addNewsSupportTask = function(req, addTaskCallback) {
    var newTask;
    var task = req.body.task;
    var speed = req.body.speed;
    var count = req.body.sub_count;
    var name = req.body.taskname;
    var task_type = req.body.task_type;

    console.info("--" + task + " " + name + " " + speed + " " + count);

    if (task === '304') {//网易新闻支持
        console.info("网易新闻支持");
        var url = req.body.url;
        var min = 20;
        var max = 25;

        newTask = {
            task_id: new Date().getTime(),
            task_type: task_type,
            task: task,
            name: name,
            username: req.session.user.username,
            user_displayname: req.session.user.name,
            task_tag: {comment_url: url},
            schedule_min: min,
            schedule_max: max,
            need_schedule_times: 1,
            sub_count: count,
            sub_schedule_count: 0,
            task_status: 0,
            foregroundID: 1,
            platformName: '网易',
            task_type_name: '新闻支持',
            create_time: util.getCurrentTime()
        };

        console.info(newTask);

    }
    if (task === '404') {//搜狐新闻支持
        console.info("搜狐新闻支持");
        var url = req.body.url;
        var comment_url = req.body.comment_url;

        var min = 3;
        var max = 5;

        console.info(task + " " + name + " " + url + " " + speed + " " + count + " " + max + " " + min);
        newTask = {
            task_id: new Date().getTime(),
            task_type: task_type,
            task: task,
            name: name,
            username: req.session.user.username,
            user_displayname: req.session.user.name,
            task_tag: {
                url: url,
                comment_url: comment_url
            },
            schedule_min: min,
            schedule_max: max,
            need_schedule_times: 1,
            sub_count: count,
            sub_schedule_count: 0,
            task_status: 0,
            foregroundID: 1,
            create_time: util.getCurrentTime(),
            task_type_name: '新闻支持',
            platformName: '搜狐'
        };
    }
    if (task === '207') {//新浪新闻支持
        console.info("新浪新闻支持");
        var url = req.body.url;
        var content = req.body.comment_content;

        var min = 3;
        var max = 5;

        console.info(task + " " + name + " " + url + " " + speed + " " + count + " " + max + " " + min);
        newTask = {
            task_id: new Date().getTime(),
            task_type: task_type,
            task: task,
            name: name,
            username: req.session.user.username,
            user_displayname: req.session.user.name,
            task_tag: {
                url: url,
                comment_content: content
            },
            schedule_min: min,
            schedule_max: max,
            need_schedule_times: 1,
            sub_count: count,
            sub_schedule_count: 0,
            task_status: 0,
            foregroundID: 1,
            create_time: util.getCurrentTime(),
            task_type_name: '新闻支持',
            platformName: '新浪'
        };
    }
    if (task === '502') {//凤凰新闻支持
        console.info("凤凰新闻支持");
        var url = req.body.url;
        var content = req.body.comment_content;

        var min = 3;
        var max = 5;

        //    console.info(task + " " + name + " " + url + " " + speed + " " + count + " " + max + " " + min);
        newTask = {
            task_id: new Date().getTime(),
            task_type: task_type,
            task: task,
            name: name,
            username: req.session.user.username,
            user_displayname: req.session.user.name,
            task_tag: {
                url: url,
                comment_content: content
            },
            schedule_min: min,
            schedule_max: max,
            need_schedule_times: 1,
            sub_count: count,
            sub_schedule_count: 0,
            task_status: 0,
            foregroundID: 1,
            create_time: util.getCurrentTime(),
            task_type_name: '新闻支持',
            platformName: '凤凰'
        };
    }
    //  console.info(newTask);
    this.saveTask(newTask, function(err) {
        if (err) {
            addTaskCallback(err);
        } else {
            addTaskCallback(null);
        }
    });
};



exports.addNewsCommentTask = function(req, addTaskCallback) {

    var newTask;
    var task = req.body.task;
    var url = req.body.url;
    var schedule = req.body.schedule;
    var count = req.body.sub_count;
    var name = req.body.taskname;
    var task_type = req.body.task_type;



    var task_id = new Date().getTime();
    var docContent = req.body.doc;
    var docContents = docContent.split(/\r?\n/);
    var docs = [];
    for (var i = 0; i < docContents.length; i++) {
        var content = docContents[i];
        if (content && content !== "") {
            var doc = {
                task_id: task_id,
                content: docContents[i]
            };
            docs.push(doc);
        }

    }
    async.waterfall([
        function(cb) {//保存语料
            docManager.save(docs, function(err, ids) {
                if (err) {
                    cb(err);
                } else {
                    cb(null, null);
                }
            });
        },
        function(n, cb) {//查询语料id
            docManager.getIDsByTaskID(task_id, function(err, re) {
                if (err) {
                    cb(err);
                } else {
                    cb(null, re);
                }
            });
        }, //组装对象
        function(n, cb) {
            var ids = [];
            for (var i = 0; i < n.length; i++) {
                ids.push(n[i]._id.toString());
            }

            newTask = {
                task_id: task_id,
                task_type: task_type,
                task: task,
                name: name,
                username: req.session.user.username,
                user_displayname: req.session.user.name,
                task_tag: {
                    exeurl: url,
                    doc: {
                        datas: ids.toString()
                    }
                    //,
                    //robot_url: "http://192.168.0.141/catRobot/cat.zip",
                    //robot_file: "Library:/netease163_news_com.robot"
                },
                schedule: schedule,
                // schedule_min: min,
                // schedule_max: max,
                need_schedule_times: 1,
                sub_count: count,
                sub_schedule_count: 0,
                task_status: 0,
                foregroundID: 1,
                create_time: util.getCurrentTime(),
                task_type_name: '新闻评论'
            };

            if (task === '303') {
                newTask.platformName = "网易";
            }

            var s = new Date(Date.parse(schedule[0].start_time.replace(/-/g, "/")));
            var e = new Date(Date.parse(schedule[0].end_time.replace(/-/g, "/")));
            var z = e.getTime() - s.getTime();
            var min = z / count / 1000;
            if (min < 10) {
                newTask.schedule_min = 10;
                newTask.schedule_max = 10;
            } else {
                newTask.schedule_min = min - min / 2;
                newTask.schedule_max = min + min / 2;
            }
            cb(null, newTask);
        },
        function(newTask, cb) {//添加机器人参数
            robotManager.findRoborByTask(task, function(err, robot) {
                if (err) {
                    cb(err, null);
                } else {
                    if (robot) {
                        newTask.task_tag.robot_url = robot.robot_url;
                        newTask.task_tag.robot_file = robot.robot_file;
                    }
                    cb(null, newTask);
                }
            });
        }
    ], function(err, result) {
        saveTask(result, function(err) {
            if (err) {
                addTaskCallback(err);
            } else {
                addTaskCallback(null);
            }
        });
    });
};