
var async = require('async'); //流程控制
var mobileManager = require('../system_modules/mobile/mobile');
var logManager = require('../system_modules/log/logger');


exports.route = function(app, ensureAuthenticated) {
    app.post('/MM', function(req, res) {
        var imei = req.body.IMEI;
        mobileManager.findOneTaskToMobile(function(re) {
            //  logManager.saveLog('mobile',imei+'查询任务:'+re.toString());
            res.send(re);
        });
    });

    app.get('/MM', function(req, res) {
        var imei = req.query.IMEI;
        mobileManager.findOneTaskToMobile(function(re) {
            logManager.saveLog('mobile', imei + '查询任务:' + re.toString());
            //  console.info(re);
            res.send(re);
        });
    });
    app.post('/MR', function(req, res) {
        var imei = req.body.IMEI;
        var count = req.body.COUNT;
        var id = req.body.ID;

        async.parallel([
            function(callback) {
                mobileManager.updateTaskFromMobile(id, count, callback);
            }
        ], function(err, results) {
            res.send('');
        });


    });

    app.get('/mobilesupport', ensureAuthenticated, function(req, res) {

        var page = req.query.p ? parseInt(req.query.p) : 1;
        var query = req.query.n ? {name: req.query.n} : null;
        async.parallel([
            function(callback) {
                role.getMenu(req.path, req.session.role, callback);
            },
            function(callback) {
                mobileManager.findPaginationForMobileTask(
                        {
                            search: query,
                            columns: 'id name user_displayname  count support_count task_status create_time',
                            num: page,
                            limit: 10
                        }, callback);
            }
        ], function(err, results) {
            if (err) {
                res.redirect('/err');
            } else {
                res.render('mobile/mtasklist', {user: req.session.user, menu: results[0], task: results[1]});
            }
        });
    });
    app.get('/mslist', ensureAuthenticated, function(req, res) {
        async.parallel([
            function(callback) {
                role.getMenu(req.path, req.session.role, callback);
            }
        ], function(err, results) {
            res.render('mobile/taskNew', {user: req.session.user, menu: results[0]});
        });
    });


    app.post('/mslist', ensureAuthenticated, function(req, res) {
        mobileManager.addNewsTask(req, function(err) {
            if (err) {
                res.send(err);
            } else {
                res.send('1');
            }
        });
    });
};