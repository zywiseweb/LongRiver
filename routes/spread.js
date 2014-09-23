
var async = require('async'); //流程控制

var role = require('../system_modules/role/role');
var taskManager = require('../system_modules/task/task');
exports.route = function(app, ensureAuthenticated) {


    app.get('/newscommmit', ensureAuthenticated, function(req, res) {
        async.parallel([
            function(callback) {
                role.getMenu(req.path, req.session.role, callback);
            }
        ], function(err, results) {
            res.render('spread/news/commit', {user: req.session.user, menu: results[0]});
        });
    });
    app.get('/newssupport', ensureAuthenticated, function(req, res) {


        var page = req.query.p ? parseInt(req.query.p) : 1;
        var query = req.query.n ? {name: req.query.n} : null;

        async.parallel([
            function(callback) {
                role.getMenu(req.path, req.session.role, callback);
            },
            function(callback) {
                taskManager.findPagination(
                    {
                        search: {},
                        task: ['304'],
                        columns: 'task_id name task sub_count sub_schedule_count create_time task_status',
                        num: page,
                        limit: 10
                    }, callback);
            }
        ], function(err, results) {
            if (err) {
                res.redirect('/err');
            } else {
                // console.info(results[1]);
                res.render('spread/news/support', {user: req.session.user, menu: results[0], task: results[1]});
            }

        });
    });
    app.get('/newssupportdetail', ensureAuthenticated, function(req, res) {
        var id = req.query.id;
        taskManager.findSubTask(id, function(err, resunlt) {
            if (err) {
                res.redirect('/err');
            } else {
                res.render('spread/news/supportDetail', {detail: resunlt});
            }
        });
    });
//新建支持任务
    app.post('/newssupportNew', ensureAuthenticated, function(req, res) {
        taskManager.addNewsSupportTask(req, function(err) {
            if (err) {
                res.send(err);
            } else {
                res.send('1');
            }
        });
    });
    //选择创建任务页面
    app.get('/newtask', ensureAuthenticated, function(req, res) {
        async.parallel([
            function(callback) {
                role.getMenu(req.path, req.session.role, callback);
            },
            function(callback) {
                role.getSubRoleByRoute(req.path, req.session.role , 2 ,callback);
            }
        ], function(err, results) {
            res.render('spread/newtask', {user: req.session.user, menu: results[0],list:results[1]});
        });
    });
    //网易新闻支持
    app.get('/t304', ensureAuthenticated, function(req, res) {
        async.parallel([
            function(callback) {
                role.getMenu(req.path, req.session.role, callback);
            }
        ], function(err, results) {
            res.render('spread/t304', {user: req.session.user, menu: results[0]});
        });
    });
    //搜狐新闻支持
    app.get('/t404', ensureAuthenticated, function(req, res) {
        async.parallel([
            function(callback) {
                role.getMenu(req.path, req.session.role, callback);
            }
        ], function(err, results) {
            res.render('spread/t404', {user: req.session.user, menu: results[0]});
        });
    });
    //新浪新闻支持
    app.get('/t207', ensureAuthenticated, function(req, res) {
        async.parallel([
            function(callback) {
                role.getMenu(req.path, req.session.role, callback);
            }
        ], function(err, results) {
            res.render('spread/t207', {user: req.session.user, menu: results[0]});
        });
    });
    //凤凰新闻支持
    app.get('/t502', ensureAuthenticated, function(req, res) {
        async.parallel([
            function(callback) {
                role.getMenu(req.path, req.session.role, callback);
            }
        ], function(err, results) {
            res.render('spread/t502', {user: req.session.user, menu: results[0]});
        });
    });
    //网易新闻评论zy
    app.get('/t303', ensureAuthenticated, function(req, res) {
        async.parallel([
            function(callback) {
                role.getMenu(req.path, req.session.role, callback);
            }
        ], function(err, results) {
            res.render('spread/t303', {user: req.session.user, menu: results[0]});
        });
    });
    //新浪新闻评论
    app.get('/t206', ensureAuthenticated, function(req, res) {
        async.parallel([
            function(callback) {
                role.getMenu(req.path, req.session.role, callback);
            }
        ], function(err, results) {
            res.render('spread/t206', {user: req.session.user, menu: results[0]});
        });
    });
    //搜狐新闻评论
    app.get('/t403', ensureAuthenticated, function(req, res) {
        async.parallel([
            function(callback) {
                role.getMenu(req.path, req.session.role, callback);
            }
        ], function(err, results) {
            res.render('spread/t403', {user: req.session.user, menu: results[0]});
        });
    });
    //凤凰新闻评论
    app.get('/t501', ensureAuthenticated, function(req, res) {
        async.parallel([
            function(callback) {
                role.getMenu(req.path, req.session.role, callback);
            }
        ], function(err, results) {
            res.render('spread/t501', {user: req.session.user, menu: results[0]});
        });
    });
    //新浪微博评论
    app.get('/t202', ensureAuthenticated, function(req, res) {
        async.parallel([
            function(callback) {
                role.getMenu(req.path, req.session.role, callback);
            }
        ], function(err, results) {
            res.render('spread/t202', {user: req.session.user, menu: results[0]});
        });
    });
    //腾讯微博评论
    app.get('/t102', ensureAuthenticated, function(req, res) {
        async.parallel([
            function(callback) {
                role.getMenu(req.path, req.session.role, callback);
            }
        ], function(err, results) {
            res.render('spread/t102', {user: req.session.user, menu: results[0]});
        });
    });
    //新浪微博转发203
    app.get('/t203', ensureAuthenticated, function(req, res) {
        async.parallel([
            function(callback) {
                role.getMenu(req.path, req.session.role, callback);
            }
        ], function(err, results) {
            res.render('spread/t203', {user: req.session.user, menu: results[0]});
        });
    });
    //腾讯微博转发103
    app.get('/t103', ensureAuthenticated, function(req, res) {
        async.parallel([
            function(callback) {
                role.getMenu(req.path, req.session.role, callback);
            }
        ], function(err, results) {
            res.render('spread/t103', {user: req.session.user, menu: results[0]});
        });
    });
    //新浪微博直发
    app.get('/t201', ensureAuthenticated, function(req, res) {
        async.parallel([
            function(callback) {
                role.getMenu(req.path, req.session.role, callback);
            }
        ], function(err, results) {
            res.render('spread/t201', {user: req.session.user, menu: results[0]});
        });
    });
    //腾讯微博直发
    app.get('/t101', ensureAuthenticated, function(req, res) {
        async.parallel([
            function(callback) {
                role.getMenu(req.path, req.session.role, callback);
            }
        ], function(err, results) {
            res.render('spread/t101', {user: req.session.user, menu: results[0]});
        });
    });
    //网易论坛发帖任务
    app.get('/t301', ensureAuthenticated, function(req, res) {
        async.parallel([
            function(callback) {
                role.getMenu(req.path, req.session.role, callback);
            }
        ], function(err, results) {
            res.render('spread/t301', {user: req.session.user, menu: results[0]});
        });
    });
    app.get('/t401', ensureAuthenticated, function(req, res) {
        async.parallel([
            function(callback) {
                role.getMenu(req.path, req.session.role, callback);
            }
        ], function(err, results) {
            res.render('spread/t301', {user: req.session.user, menu: results[0]});
        });
    });
    app.get('/t601', ensureAuthenticated, function(req, res) {
        async.parallel([
            function(callback) {
                role.getMenu(req.path, req.session.role, callback);
            }
        ], function(err, results) {
            res.render('spread/t301', {user: req.session.user, menu: results[0]});
        });
    });
    app.get('/t701', ensureAuthenticated, function(req, res) {
        async.parallel([
            function(callback) {
                role.getMenu(req.path, req.session.role, callback);
            }
        ], function(err, results) {
            res.render('spread/t301', {user: req.session.user, menu: results[0]});
        });
    });
   //网易论坛顶贴任务
    app.get('/t302', ensureAuthenticated, function(req, res) {
        async.parallel([
            function(callback) {
                role.getMenu(req.path, req.session.role, callback);
            }
        ], function(err, results) {
            res.render('spread/t302', {user: req.session.user, menu: results[0]});
        });
    });
    app.get('/t402', ensureAuthenticated, function(req, res) {
        async.parallel([
            function(callback) {
                role.getMenu(req.path, req.session.role, callback);
            }
        ], function(err, results) {
            res.render('spread/t302', {user: req.session.user, menu: results[0]});
        });
    });
    app.get('/t602', ensureAuthenticated, function(req, res) {
        async.parallel([
            function(callback) {
                role.getMenu(req.path, req.session.role, callback);
            }
        ], function(err, results) {
            res.render('spread/t302', {user: req.session.user, menu: results[0]});
        });
    });
    app.get('/t702', ensureAuthenticated, function(req, res) {
        async.parallel([
            function(callback) {
                role.getMenu(req.path, req.session.role, callback);
            }
        ], function(err, results) {
            res.render('spread/t302', {user: req.session.user, menu: results[0]});
        });
    });

    //新建评论任务
    app.post('/newsCommentNew', ensureAuthenticated, function(req, res) {
        taskManager.addNewsCommentTask(req, function(err) {
            if (err) {
                res.send(err);
            } else {
                res.send('1');
            }
        });
    });

    //通用任务
    app.get('/httprequest', ensureAuthenticated, function(req, res) {
        async.parallel([
            function(callback) {
                role.getMenu(req.path, req.session.role, callback);
            }
        ], function(err, results) {
            res.render('spread/httprequest', {user: req.session.user, menu: results[0]});
        });
    });
    //分页显示任务信息
    app.get('/mytask', ensureAuthenticated, function(req, res) {

        var page = req.query.p ? parseInt(req.query.p) : 1;
        var query = req.query.n ? {name: req.query.n} : null;

        async.parallel([
            function(callback) {
                role.getMenu(req.path, req.session.role, callback);
            },
            function(callback) {
                taskManager.findPagination(
                    {
                        search: {},
                        columns: 'task_id name task_type_name platformName sub_count sub_schedule_count create_time task_status',
                        num: page,
                        limit: 10,
                        status:[0,1,2,3]
                    }, callback);
            }
        ], function(err, results) {
            if (err) {
                res.redirect('/err');
            } else {
                // console.info(results[1]);
                res.render('spread/mytask', {user: req.session.user, menu: results[0], task: results[1]});
            }

        });

    });


};