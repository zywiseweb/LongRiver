

var gather = require('../system_modules/gather/gather');

exports.route = function (app) {

    app.get('/qqweibo', function (req, res) {
        if (req.query.url) {
            var url = req.query.url;
            gather.QQWeibo(url, function (err, re) {
                if (err) {

                } else {
                    res.send(re);
                }
            });
        } else {
            res.send({});
        }
    });
};