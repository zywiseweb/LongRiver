var mongoose = require('../database/mongodb');
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
var robotSchema = new Schema({
    name: {type: String},
    task: {type: String, required: true},
    taskName: {type: String, required: true},
    robot_url:{type: String, required: true},//机器人压缩包路径
    robot_file:{type: String, required: true},
    create_time: {type: String,default:new Date().getTime()},
     platformName: {type: String}, //平台名称
     enable: {type: Number,default:1} //平台名称
},
{collection: "robots"});

var robotManager = mongoose.model('robots', robotSchema);

exports.findPagination = function(params, callback) {
    var q = params.search || {};//查询调价
    var col = params.columns;//字段

    var pageNumber = params.num || 1;//页数
    var resultsPerPage = params.limit || 10;//每页行数

    var skipFrom = (pageNumber * resultsPerPage) - resultsPerPage;//其实也
    var query = robotManager.find(q, col).sort('-createTime').skip(skipFrom).limit(resultsPerPage);

    query.exec(function(err, results) {
        if (err) {
            callback(err, null);
        } else {
            robotManager.count(q, function(err, count) {
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
 * 根据task查询 机器人信息
 * @param {type} task
 * @param {type} callback
 * @returns {undefined}
 */
exports.findRoborByTask = function(task, callback) {
    robotManager.findOne({task:task},callback);
};