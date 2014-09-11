
var async = require('async'); //流程控制

var role = require('../system_modules/role/role');
var accountManager = require('../system_modules/account/account');


exports.route = function(app, ensureAuthenticated) {
    app.get('/accountsearch', ensureAuthenticated, function(req, res) {

        var page = req.query.p ? parseInt(req.query.p) : 1;
        var key = req.query.key ? req.query.key : null;
        var type = req.query.type ? req.query.type : null;
        var status = req.query.status ? req.query.status : null;
        var query = {key: key, type: type, status: status};

        async.parallel([
            function(callback) {
                role.getMenu(req.path, req.session.role, callback);
            },
            function(callback) {
                accountManager.findPagination(
                        {
                            search: query,
                            columns: 'id username password createTime displayName platformName enable',
                            num: page,
                            limit: 10
                        }, callback);
            }
        ], function(err, results) {
            if (err) {
                res.redirect('/err');
            } else {
                //  console.info(results[1]);
                res.render('account/search', {user: req.session.user, menu: results[0], accounts: results[1], key: key, platform: type, status: status});
            }
        });
    });


    app.get('/sinaloadin', ensureAuthenticated, function(req, res) {
        async.parallel([
            function(callback) {
                role.getMenu(req.path, req.session.role, callback);
            }
        ], function(err, results) {
            res.render('account/sina/loadin', {user: req.session.user, menu: results[0]});
        });
    });
};