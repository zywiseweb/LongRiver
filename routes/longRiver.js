
var async = require('async'); //流程控制

var role = require('../system_modules/role/role');

exports.route = function(app, ensureAuthenticated) {
    app.get('/lrstatus', ensureAuthenticated, function(req, res) {
        async.parallel([
            function(callback) {
                role.getMenu(req.path, req.session.role, callback);
            }
        ], function(err, results) {
            res.render('longriver/lrstatus', {user: req.session.user, menu: results[0]});
        });
    });
    app.get('/lrsinaAccount', ensureAuthenticated, function(req, res) {

        async.parallel([
            function(callback) {
                role.getMenu(req.path, req.session.role, callback);
            }
        ], function(err, results) {
            res.render('longriver/lrsinaAccount', {user: req.session.user, menu: results[0]});
        });
    });
    app.get('/lrsinaAccount24', ensureAuthenticated, function(req, res) {

        async.parallel([
            function(callback) {
                role.getMenu(req.path, req.session.role, callback);
            }
        ], function(err, results) {
            res.render('longriver/lrsinaAccount24', {user: req.session.user, menu: results[0]});
        });
    });
    app.get('/lrmiss', ensureAuthenticated, function(req, res) {

        async.parallel([
            function(callback) {
                role.getMenu(req.path, req.session.role, callback);
            }
        ], function(err, results) {
            res.render('longriver/lrmiss', {user: req.session.user, menu: results[0]});
        });
    });
    app.get('/lrmiss30', ensureAuthenticated, function(req, res) {

        async.parallel([
            function(callback) {
                role.getMenu(req.path, req.session.role, callback);
            }
        ], function(err, results) {
            res.render('longriver/lrmiss30', {user: req.session.user, menu: results[0]});
        });
    });
    app.get('/lrmiss7', ensureAuthenticated, function(req, res) {

        async.parallel([
            function(callback) {
                role.getMenu(req.path, req.session.role, callback);
            }
        ], function(err, results) {
            res.render('longriver/lrmiss7', {user: req.session.user, menu: results[0]});
        });
    });
    app.get('/lrmissOne', ensureAuthenticated, function(req, res) {

        async.parallel([
            function(callback) {
                role.getMenu(req.path, req.session.role, callback);
            }
        ], function(err, results) {
            res.render('longriver/lrmissOne', {user: req.session.user, menu: results[0]});
        });
    });
    app.get('/lrlog', ensureAuthenticated, function(req, res) {

        async.parallel([
            function(callback) {
                role.getMenu(req.path, req.session.role, callback);
            }
        ], function(err, results) {
            res.render('longriver/lrlog', {user: req.session.user, menu: results[0]});
        });
    });

   




};