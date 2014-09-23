
var async = require('async'); //流程控制

var role = require('../system_modules/role/role');
var userManager = require('../system_modules/user/user');
var util = require('../system_modules/util');
var departmentManager = require('../system_modules/department/department');

exports.route = function(app, ensureAuthenticated) {
    app.get('/person', ensureAuthenticated, function(req, res) {
        async.parallel([
            function(callback) {
                role.getMenu(req.path, req.session.role, callback);
            }

        ]
                , function(err, results) {
                    console.info(results[0].toString());
                    res.render('person/main', {user: req.session.user, menu: results[0]});
                });
    });
    app.get('/system', ensureAuthenticated, function(req, res) {
        async.parallel([
            function(callback) {
                role.getMenu(req.path, req.session.role, callback);
            }
        ]
                , function(err, results) {
                    res.render('system/user', {user: req.session.user, menu: results[0]});
                });
    });

    app.get('/user', ensureAuthenticated, function(req, res) {
        var page = req.query.p ? parseInt(req.query.p) : 1;
        var query = req.query.n ? {name: req.query.n} : null;
        async.parallel([
            function(callback) {
                role.getMenu(req.path, req.session.role, callback);
            },
            function(callback) {
                userManager.findPagination(
                        {
                            search: query,
                            columns: 'id name username enable role.text department.text',
                            num: page,
                            limit: 10
                        }, callback);
            }
        ], function(err, results) {
            if (err) {
                res.redirect('/err');
            } else {
                res.render('system/user', {user: req.session.user, menu: results[0], users: results[1]});
            }
        });
    });
    app.get('/userAdd', ensureAuthenticated, function(req, res) {

        async.parallel([
            function(callback) {
                role.getMenu(req.path, req.session.role, callback);
            },
            function(callback) {
                role.getRoleList(callback);
            },
            function(callback) {
                departmentManager.getDepartmentList(req.session.user.department.id, callback);
            }
        ], function(err, results) {
            if (err) {
                res.redirect('/err');
            } else {
                res.render('system/userAdd', {user: req.session.user, menu: results[0], roleList: results[1], departmentList: results[2]});
            }
        });
    });
    app.post('/userAdd', ensureAuthenticated, function(req, res) {

        var name = req.body.name;
        var username = req.body.username;
        var password = req.body.password;
        var roleID = req.body.role;
        var departmentID = req.body.department;
        async.parallel([
            function(callback) {
                userManager.findUser({username: username}, callback);
            },
            function(callback) {
                role.findRole({id: roleID}, callback);
            },
            function(callback) {
                departmentManager.findDepartment({id: departmentID}, callback);
            }
        ], function(err, results) {
            if (err) {
                res.send(err);
            } else {
                if (results[0]) {//用户存在
                    res.send('此用户名已经被注册了');
                } else {
                    var role;
                    if (results[1]) {
                        role = {id: roleID, text: results[1].text};

                    } else {
                        role = {id: 0, text: '试用用户'};
                    }
                    var department;
                    if (results[2]) {
                        department = {id: departmentID, text: results[2].text};
                    } else {
                        department = {id: 3, text: '试用用户'};
                    }
                    var newUser = {
                        username: username, //登陆名
                        password: password, //密码
                        name: name, //用户名
                        homeRoute: '/',
                        role: role,
                        department: department
                    };
                    console.info(newUser);

                    userManager.saveUser(newUser, function(err) {
                        if (err) {
                            res.send('保存时好像出错了');
                        } else {
                            res.send('200');
                        }
                    });
                }
            }
        });
    });
    app.get('/userEdit', ensureAuthenticated, function(req, res) {

        async.parallel([
            function(callback) {
                role.getMenu(req.path, req.session.role, callback);
            }
        ]
                , function(err, results) {
                    if (err) {
                        res.redirect('/err');
                    } else {
                        res.render('system/userEdit', {user: req.session.user, menu: results[0]});
                    }
                });
    });
};