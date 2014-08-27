var mongoose = require('../database/mongodb');
var scheduleManager = require('../schedule/schedule');
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
var clientSchema = new Schema({
    ip: {type: String},
    port: {type: String},
    version: {type: String},
    areaName: {type: String},
    online: {type: Boolean,required: true,default:false},
    isRegisted: {type: Boolean,required: true,default:false},
    onlineTime: {type: String},
    onlineofftime: {type: String}
    
},{collection: "clients"});


//****************定义实体控制*******************
var clientManager = mongoose.model('clients', clientSchema);

//*******************暴露接口*******************


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

    var query = clientManager.find(q, col).sort([['_id', -1]]).skip(skipFrom).limit(resultsPerPage);
    query.exec(function(err, results) {

        if (err) {
            callback(err, null);
        } else {
            clientManager.count(q, function(err, count) {
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

