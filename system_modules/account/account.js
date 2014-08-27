var mongoose = require('../database/mongodb');
var Schema = mongoose.Schema;
var async = require('async'); //流程控制

var accountSchema = new Schema({
    username: {type: String, required: true}, //用户名
    password: {type: String, required: true}, //密码
    displayName: {type: String}, //昵称
    platformID: {type: Number}, //账号名称
    platformName: {type: String}, //账号名称
    task: {type: String}, //账号名称
    area: {type: String}, //试用地区
    ip: {type: String}, //试用ip
    lastUsedTime: {type: String}, //最后试用时间
    createTime: {type: String}, //最后试用时间
    enable: {type: Number}//是否可用，1可用，0不可用
});

var accountManager = mongoose.model('Account', accountSchema);


/**
 * 分页查询
 * @param {type} params
 * @param {type} callback
 * @returns {undefined}
 */
exports.findPagination = function(params, callbackFunction) {
    console.info(params);
    var q = {};//
    if (params.search.key) {
        var reg = new RegExp(params.search.key);//模糊查询参数
        q.$or = [{username: reg}, {displayName: reg}];
    }
    ;

    if (params.search.type) {
        if (params.search.type !== '全部') {
            q.platformName = params.search.type;
        }
    }
    if (params.search.status === '1') {
        q.enable = 1;
    } else if (params.search.status === '2') {
        q.enable = 0;
    } 
            console.info(q);


    var col = params.columns;//字段

    var pageNumber = params.num || 1;//页数
    var resultsPerPage = params.limit || 10;//每页行数

    var skipFrom = (pageNumber * resultsPerPage) - resultsPerPage;//其实也

    console.info('q:' + q + ' col:' + col + ' pageNumber:' + pageNumber + ' skipFrom:' + skipFrom);


    async.parallel([
        function(callback) {
            var query = accountManager.find(q, col).sort('-createTime').skip(skipFrom).limit(resultsPerPage);
            query.exec(function(err, results) {
                if (err) {
                    callback(err, null);
                } else {
                    callback(null, results);
                }
            });

        },
        function(callback) {
            accountManager.count(q, function(err, count) {
                if (err) {
                    callback(err, null);
                } else {
                    var pageCount = Math.ceil(count / resultsPerPage);
                    callback(null, pageCount);
                }
            });

        },
        function(callback) {
            accountManager.distinct('platformName', {enable: 1}, function(err, result) {
                if (err) {
                    callback(err, null);
                } else {
                    callback(null, result);
                }
            });

        }
    ], function(err, results) {
        if (err) {
            callbackFunction(err, null);
        } else {
            var re = {pageCount: results[1], results: results[0], currentPage: pageNumber, platform: results[2]};
            callbackFunction(err, re);
        }
    });
};
