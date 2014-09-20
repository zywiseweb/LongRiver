var request = require('request');
var cheerio = require('cheerio');
var async = require('async');//流程控制

// 常量 新浪cookie
var s = '_2AkMjR3iPf8NjqwJRmPkWzm3gaYh-wgHEiebDAHzsJxJjHmMN7ERUGpXeKYNdporcfQJI7RFSY83c';
var sp = '0033WrSXqPxfM72-Ws9jqgMF55z29P9D9WF2l-DFYCIsLz4fJ-gUFH.9';

var htmlRegex = ".*<script>FM.view\\((\\{\"ns\":\"pl.content.weiboDetail.index\".*\\})\\)</script>.*";
/**
 * 采集腾讯微博
 * @param {type} url
 * @param {type} callback
 * @returns {undefined}
 */
exports.QQWeibo = function (url, callback) {
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var $ = cheerio.load(body.toString());
            var name = $('.userName').text();
            var content = $('.userName+.msgCnt').text();
            var reply = $('.replyBox+.replyBox .msgCnt ').text();
            var qqweibo = {
                username: name,
                content: content,
                reply: reply
            };
            callback(null, qqweibo);
            $ = null;
        } else {
            callback("获取失败", null);
        }
    });
};


exports.sinaWeibo = function (url, callback) {
    var putinCookie = "http://login.sina.com.cn/visitor/visitor?a=crossdomain&cb=return_back&s="
            + s
            + "&sp=" + sp
            + "&from=weibo&_rand=" + Math.random();
    request(putinCookie,
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.info(body.toString());
                    var options = {
                        url: 'http://weibo.com/2836657120/BnRN0q9iw?mod=weibotime',
                        headers: {
                            'Cookie': "SUB=" + s + "; SUBP=" + sp
                        }
                    };

                    request(options, function (error, response, body) {
                        if (!error && response.statusCode == 200) {
                            var jsonStr = body.toString().match(htmlRegex)
                            var json = JSON.parse(jsonStr[1]);
                            var html = json.html;
                            var $ = cheerio.load(html);
                            var name = $('.WB_detail .WB_text').attr('nick-name');
                            var content = $('.WB_detail .WB_text em').text();
                            var sinaweibo = {
                                username: name,
                                content: content,
                                reply: ''
                            };
                            callback(null, sinaweibo);
                            $ = null;
                        }else{
                            callback("获取数据失败", null);
                        }

                    });
                }else{
                    callback("注入cookie失败", null);
                }
            });
};