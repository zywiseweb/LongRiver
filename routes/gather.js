

var gather = require('../system_modules/gather/gather');

       
exports.route = function (app) {
/**
 * 采集 qq微博内容名称
 * @param {type} app
 * @returns {undefined}
 */ 
    app.get('/qqweibo', function (req, res) {
        if (req.query.url) {
            var url = req.query.url;
            gather.QQWeibo(url, function (err, re) {
                if (err) {
                    res.send(err);
                } else {
                    res.send(re);
                }
            });
        } else {
            res.send({});
        }
    });
    /**
     * 采集新浪
     */
    app.get('/sinaweibo', function (req, res) {
        if (req.query.url) {
            var url = req.query.url;
            gather.sinaWeibo(url, function (err, re) {
                if (err) {
                    res.send(err);
                } else {
                    res.send(re);
                }
            });
        } else {
            res.send({});
        }
    });
};