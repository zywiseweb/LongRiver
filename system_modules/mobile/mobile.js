var mongoose = require('../database/mongodb');
var async = require('async');//流程控制
var Schema = mongoose.Schema;
var util = require('../util');
var request = require('request');

//此类用户存储管理数据模型

//****************定义模型*******************
//数据模型
/**
 * 手机任务模型
 * @type Schema
 */

var mobileTaskSchema = new Schema({
    username: {type: String},
    user_displayname: {type: String},
    name: {type: String},
    count: {type: Number, required: true},
    support_count: {type: Number},
    tag: {},
    exeTag: {},
    type: {type: String, required: true},
    task_status: {type: Number}, //0,等待，1.开始，2，停止
    create_time: {type: String}
}, {collection: "mobileTask"});
var mobileClientSchema = new Schema({
    imei: {type: String},
    name: {type: String},
    count: {type: Number},
    time: {type: Date},
    ip: {type: String}
}, {collection: "mobileClient"
}
);

var mobileTaskManager = mongoose.model('mobileTask', mobileTaskSchema);
var mobileClientManager = mongoose.model('mobileClient', mobileClientSchema);



/**
 * 任务显示分业
 * @param {type} params
 * @param {type} callback
 * @returns {undefined}
 */
exports.findPaginationForMobileTask = function(params, callback) {
    var q = params.search || {};//查询调价
    var col = params.columns;//字段

    var pageNumber = params.num || 1;//页数
    var resultsPerPage = params.limit || 10;//每页行数

    var skipFrom = (pageNumber * resultsPerPage) - resultsPerPage;//其实也

    console.info('q:' + q + ' col:' + col + ' pageNumber:' + pageNumber + ' skipFrom:' + skipFrom);

    var query = mobileTaskManager.find(q, col).sort('-create_time').skip(skipFrom).limit(resultsPerPage);

    query.exec(function(err, results) {
        if (err) {
            callback(err, null);
        } else {
            mobileTaskManager.count(q, function(err, count) {
                if (err) {
                    callback(err, null);
                } else {
                    console.info('--->' + results.toString());
                    var pageCount = Math.ceil(count / resultsPerPage);
                    callback(null, {'pageCount': pageCount, 'results': results, currentPage: pageNumber});
                }
            });
        }
    });
};

/**
 * 添加新任务
 **/
exports.addNewsTask = function(req, addTaskCallback) {
    var newTask;
    var task = req.body.task;
    var count = req.body.sub_count;
    var name = req.body.taskname;

    //  console.info("--" + task + " " + name + " " + count);

    if (task === '304') {//网易新闻支持
        console.info("网易新闻支持");
        var url = req.body.url;

        //  console.info(task + " " + name + " " + url + " " + " " + count);
        var time =
                newTask = {
                    task: task,
                    name: name,
                    username: req.session.user.username,
                    user_displayname: req.session.user.name,
                    tag: {
                        url: url

                    },
                    count: count,
                    support_count: 0,
                    task_status: 0,
                    type: task,
                    create_time: util.getCurrentTime()
                };
        //    console.info(newTask);

    }
    if (task === '404') {//搜狐新闻支持
        console.info("搜狐新闻支持");
        var url = req.body.url;
        var comment_url = req.body.comment_url;

        //    console.info(task + " " + name + " " + url + " " + comment_url);
        newTask = {
            task: task,
            name: name,
            username: req.session.user.username,
            user_displayname: req.session.user.name,
            tag: {
                url: url,
                comment_url: comment_url
            },
            count: count,
            support_count: 0,
            task_status: 0,
            type: task,
            create_time: util.getCurrentTime()
        };
    }
    console.info("===>" + newTask.toString());

    var t = new mobileTaskManager(newTask);
    t.save(function(err) {
        if (err) {
            addTaskCallback(err);
        } else {
            addTaskCallback(null);
            initTask(newTask);
        }
    });
};
/**
 * 查询一条开始的任务
 * @param {type} callback
 * @returns {undefined}
 */
exports.findOneTaskToMobile = function(callback) {
    console.info("findOneTaskToMobile");
    mobileTaskManager.findOne({task_status: 1}, function(err, re) {
        if (err) {
            callback('');
        } else {
            console.info(re);
            if (re) {
                var task = {
                    ID: re._id.toString(),
                    TYPE: re.type,
                    PARAMS: re.exeTag
                };
                task.COUNT = re.count - re.support_count > 10 ? 10 : re.count - re.support_count;
                callback(task);
            }else{
                callback(null)
            }
        }
    });
};

/**
 * 
 * @param {type} callback
 * @returns {undefined}
 */
exports.updateTaskFromMobile = function(id, count, callback) {
    mobileTaskManager.update({_id: id}, {$inc: {support_count: count}}, function(err) {
        if (err) {
            callback(err, '保存部门数据错误');
        } else {
            callback(null);
        }
    });
};
/**
 * 
 * 初始化任务参数，此函数将在添加任务后执行
 * 
 * */

function initTask(task) {
    console.info('初始化任务' + task.name + " " + task.task);
    var exeTag;
    if (task.task === '304') {//网易
        var m = task.tag.url.match(/(.*com)\/(.*)\/(.*)\/(.*).html.*/);
        var exeurl = m[1] + "/reply/upvote/" + m[2] + "/" + m[3] + "_" + m[4];
        var referer = m[1] + "/" + m[2] + "/" + m[3] + ".html";
        exeTag = {
            exeUrl: exeurl,
            Referer: referer
        };
        mobileTaskManager.update({name: task.name, create_time: task.create_time}, {exeTag: exeTag, task_status: 1}, function(err) {
            if (err) {
                console.info("更新失败");
            } else {
                console.info("更新成功");
            }
        });
    } else if (task.task === '404') {//搜狐
        var m = task.tag.url.match(/.*com\/.*\/.*\/([0-9]+)/);
        var m2 = task.tag.comment_url.match(/http:\/\/changyan.sohu.com\/c\/([0-9]+)\\?.*/);

        var url1 = "http://changyan.sohu.com/node/html?client_id=cyqemw6s1&topicsid=" + m[1];
        request({
            url: url1,
            method: 'GET'
        }, function(err, response, body) {
            if (!err && response.statusCode === 200) {
                var b = JSON.parse(body);
                var topic_id = b.listData.topic_id;
                var time = new Date().getTime();
                var support_url = "http://changyan.sohu.com/api/2/comment/action?callback=fn&action_type=1&client_id=cyqemw6s1&_=" + time + "&comment_id=" + m2[1] + "&topic_id=" + topic_id;
                console.info(support_url);

                exeTag = {
                    exeUrl: support_url
                };

                mobileTaskManager.update({name: task.name, create_time: task.create_time}, {exeTag: exeTag, task_status: 1}, function(err) {
                    if (err) {
                        console.info("更新失败");
                    } else {
                        console.info("更新成功");
                    }
                });
            } else {
                console.info(err);
                return;
            }

        });
    }
    //  console.info(exeTag);

}


