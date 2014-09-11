
var async = require('async'); //流程控制

var role = require('../system_modules/role/role');

exports.route = function(app, ensureAuthenticated) {
    app.get('/role', ensureAuthenticated, function(req, res) {
        var page = req.query.p ? parseInt(req.query.p) : 1;
        var query = req.query.n ? {name: req.query.n} : null;
        async.parallel([
            function(callback) {
                role.getMenu(req.path, req.session.role, callback);
            },
            function(callback) {
                role.findPagination(
                        {
                            search: query,
                            columns: 'id text createTime createUser',
                            num: page,
                            limit: 10
                        }, callback);
            }
        ], function(err, results) {
            if (err) {
                res.redirect('/err');
            } else {
                res.render('system/role', {user: req.session.user, menu: results[0], role: results[1]});
            }
        });
    });
    app.get('/roleDelete', ensureAuthenticated, function(req, res) {

        var id = req.query.id ? req.query.id : null;
        if (id) {
            role.deleteRole(id, function(err, callback) {
                res.redirect('/role');
            });
        } else {
            res.redirect('/role');
        }
    });
    app.get('/roleAdd', ensureAuthenticated, function(req, res) {

        async.parallel([
            function(callback) {
                role.getMenu(req.path, req.session.role, callback);
            }
        ], function(err, results) {
            if (err) {
                res.redirect('/err');
            } else {
                res.render('system/roleAdd', {user: req.session.user, menu: results[0], access: role.gatRoleTree(req.session.role.access)});
            }
        });
    });
    /**
     * 编辑权限
     */
    app.get('/roleEdit', ensureAuthenticated, function(req, res) {
        var id = req.query.id ? req.query.id : 1;
        async.parallel([
            function(callback) {
                role.getMenu(req.path, req.session.role, callback);
            },
            function(callback) {
                role.findRole({id: id}, callback);
            }
        ], function(err, results) {
            if (err) {
                res.redirect('/err');
            } else {

                if (results[1]) {
                    console.info('-->' + results[1].access);
                    var leaf = role.getLeafID(results[1]);
                    console.info(leaf);
                    res.render('system/roleEdit', {user: req.session.user, menu: results[0], access: role.gatRoleTree(req.session.role.access), selected: leaf, role: results[1]});
                } else {
                    res.redirect('/role');
                }
            }
        });
    });
    /**
     * 保存新权限
     */
    app.post('/roleAdd', ensureAuthenticated, function(req, res) {
        var name = req.body.name;
        var access = req.body.access;
        console.info("==>" + access);
        role.newRole(name, access, req.session.user.name, function(err) {
            if (err) {
                res.send('出错了');
            } else {
                res.send("200");
            }
        });
    });
    app.post('/roleEdit', ensureAuthenticated, function(req, res) {
        var name = req.body.name;
        var access = req.body.access;
        var id = req.body.id ? req.body.id : null;
        console.info("==>" + access);
        role.editRole(name, access, id, req.session.user.name, function(err) {
            if (err) {
                res.send('出错了');
            } else {
                res.send("200");
            }
        });
    });
};