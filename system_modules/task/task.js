var mongoose = require('../database/mongodb');
var async = require('async');//流程控制
var Schema = mongoose.Schema;
var net = require('net');
var util = require('../util');



//****************定义模型*******************
//数据模型
/**
 * 任务模型
 * @type Schema
 */
var taskSchema = new Schema({
    username: {type: String},
    user_displayname: {type: String},
    name: {type: String},
    task_id: {type: Number, required: true, default: new Date().getTime()},
    task: {type: Number, required: true},
    sub_count: {type: Number, required: true},
    sub_schedule_count: {type: Number},
    schedule_min: {type: Number},
    schedule_max: {type: Number},
    tag: {},
    task_status: {type: Number},
    creat_time: {type: String},
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
        },
        function(callback) {//发送数据

            var sockrt = net.createConnection(9002, '127.0.0.1', function() { //'connect' listener
                console.log('client connected');
                var d = "{\"content\":{\"id\":" + task.task_id
                        + ",\"task_schedule_max\":" + task.schedule_max
                        + ",\"task_schedule_min\":" + task.schedule_min
                        + ",\"task_count\":" + task.sub_count
                        + ",\"task\":" + task.task
                        + ",\"task_type\":" + task.task_type
                        + ",\"task_tag\":{ \"url\":\"" + task.task_tag.map.url + "\"}}"
                        + ", \"type\": 101}\r\n";
                sockrt.write(d);
            });
            sockrt.on('data', function(data) {
                console.log(data.toString());
                sockrt.end();
            });
            sockrt.on('end', function() {
                console.log('sockrt disconnected');
            });
            callback(null);
        }
    ], function(err, results) {
        if (err) {
            callback(err);
        } else {
            callback(null);
        }

    });
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

    var query = TaskManager.find(q, col).sort( [['_id', -1]]).skip(skipFrom).limit(resultsPerPage);
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


