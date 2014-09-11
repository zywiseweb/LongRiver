
var async = require('async'); //流程控制

var role = require('../system_modules/role/role');
var robotsManager = require('../system_modules/resource/robot');


exports.route = function(app, ensureAuthenticated) {
    app.get('/resource', ensureAuthenticated, function(req, res) {
        async.parallel([
            function(callback) {
                role.getMenu(req.path, req.session.role, callback);
            }

        ], function(err, results) {
                    console.info(results[0].toString());
                    res.render('resource/resource', {user: req.session.user, menu: results[0]});
                });
    });
    app.get('/robots', ensureAuthenticated, function(req, res) {
        var page = req.query.p ? parseInt(req.query.p) : 1;
        var query = req.query.n ? {name: req.query.n} : null;
        async.parallel([
            function(callback) {
                role.getMenu(req.path, req.session.role, callback);
            },
            function(callback) {
                robotsManager.findPagination({
                    search: query,
                    columns: 'name robot_url robot_file create_time enable',
                    num: page,
                    limit: 10
                }, callback);
            }
        ], function(err, results) {
            res.render('resource/robots', {user: req.session.user, menu: results[0], robots: results[1]});
        });
    });
    app.get('/uploadRobots', ensureAuthenticated, function(req, res) {
        async.parallel([
            function(callback) {
                role.getMenu(req.path, req.session.role, callback);
            }
        ], function(err, results) {
            res.render('resource/uploadRobots', {user: req.session.user, menu: results[0]});
        });
    });

};