var request = require('request');
var cheerio = require('cheerio');
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
                username:name,
                content:content,
                reply:reply
            };
            callback(null,qqweibo);
            $ = null;
        } else {
            callback("获取失败",null);
        }
    });
};