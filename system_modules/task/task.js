var mongoose = require('../database/mongodb');
var scheduleManager = require('../schedule/schedule');
var async = require('async');//流程控制
var Schema = mongoose.Schema;
var net = require('net');
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
    task: {type: Number, required: true},
    sub_count: {type: Number, required: true},
    sub_schedule_count: {type: Number},
    schedule_min: {type: Number},
    schedule_max: {type: Number},
    tag: {},
    task_status: {type: Number},
    create_time: {type: String},
    task_type: {type: Number, required: true},
    need_schedule_times: {type: Number}
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
    //  console.info(task);

    //  async.parallel([
    /*   function(callback) {//保持数据
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
     },*/
    //    function(callback) {//发送数据
    var str = JSON.stringify(task);
    console.info(str + "--");
    var d = "{\"content\":"+str+",\"type\": 101}\r\n";

    scheduleManager.sendCommand(d, function(err) {
        if (err) {
            callback(err);
        } else {
            callback(null);
        }
    });
    /*    }
     ], function(err, results) {
     if (err) {
     callback(err);
     } else {
     callback(null);
     }
     });*/
};
/**
 * 分页查询
 * @param {type} params
 * @param {type} callback
 * @returns {undefined}
 */
exports.findPagination = function(params, callback) {
    var q = params.search || {}; //查询调价
    var col = params.columns; //字段

    var pageNumber = params.num || 1; //页数
    var resultsPerPage = params.limit || 10; //每页行数

    var skipFrom = (pageNumber * resultsPerPage) - resultsPerPage; //其实也

    //console.info('q:' + q + ' col:' + col + ' pageNumber:' + pageNumber + ' skipFrom:' + skipFrom);

    var query = TaskManager.find(q, col).sort([['_id', -1]]).skip(skipFrom).limit(resultsPerPage);
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
        var min = 30;
        var max = 60;
        if (speed === '1') {
            min = 15;
            max = 30;
        } else if (speed === '2') {
            min = 30;
            max = 60;
        }
        console.info(task + " " + name + " " + url + " " + speed + " " + count + " " + max + " " + min);
        var time = 
        newTask = {
            task_id: new Date().getTime(),
            task_type: task_type,
            task: task,
            name: name,
            username: req.session.user.username,
            user_displayname: req.session.user.name,
            task_tag: { url: url},
            schedule_min: min,
            schedule_max: max,
            need_schedule_times: 1,
            sub_count: count,
            sub_schedule_count: 0,
            task_status: 0,
            foregroundID:1,
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
        if (speed === '1') {
            min = 3;
            max = 5;
        } else if (speed === '2') {
            min = 5;
            max = 10;
        } else if (speed === '3') {
            min = 10;
            max = 20;
        } else if (speed === '4') {
            min = 20;
            max = 30;
        }
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
            foregroundID:1,
            create_time: util.getCurrentTime()
        };
    }
    console.info(newTask);
    this.saveTask(newTask, function(err) {
        if (err) {
            addTaskCallback(err);
        } else {
            addTaskCallback(null);
        }
    });

}


