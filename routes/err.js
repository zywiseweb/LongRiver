


exports.route = function(app) {
    /**
     * 权限不足
     */
    app.get('/norole', function(req, res) {
        res.render('norole');
    });
    /**
     * 错误异常
     */
    app.get('/err', function(req, res) {
        res.render('err');
    });
//404
    app.get('*', function(req, res) {
        res.render('404');
    });
};