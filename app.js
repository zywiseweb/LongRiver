
/**
 * 依赖模块
 */

var express = require('express');
var http = require('http');
var path = require('path');
var flash = require('connect-flash');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;//认证策略
var async = require('async');//流程控制

var init = require('./system_modules/dao/initdb');
var role = require('./system_modules/role/role');
var userManager = require('./system_modules/user/user');
var taskManager = require('./system_modules/task/task');
var util = require('./system_modules/util');

//*************************************
/**
 * 认证部分
 */
//session 设置

passport.serializeUser(function(user, done) {
    done(null, user.username);
});

passport.deserializeUser(function(username, done) {
    userManager.findUser({username: username}, function(err, user) {
        done(err, user);
    });
});

/**
 * 用户认证
 * @param {type} param
 */
passport.use(new LocalStrategy(function(username, password, done) {
    userManager.findUser({'username': username}, function(err, user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, {message: username + '这个用户不存在。'});
        }
        user.comparePassword(password, function(err, isMatch) {
            if (err)
                return done(err);
            if (isMatch) {
                return done(null, user);
            } else {
                return done(null, false, {message: '密码错误。'});
            }
        });

    });
}));

/**
 * 判断用户是否登陆
 * @param {type} req
 * @param {type} res
 * @param {type} next
 * @returns {unresolved}
 */
function ensureAuthenticated(req, res, next) {
    console.info("判断登陆");
    if (req.isAuthenticated()) {//判断登陆
        if (req.path === '/') {//首页
            role.getHome(req.session.user.role.roleId, function(err, homeRoute) {
                if (err) {
                    console.info(err.message);
                    return res.redirect('/norole');
                } else {
                    return res.redirect(homeRoute);
                }

            });
        } else {
            role.authRole({"roleid": req.session.user.role.roleId, "route": req.path}, //判断权限
            function(err, role) {
                if (err) {
                    console.info("权限：鉴权错误");
                    return res.redirect('/err500');
                }
                if (role) {
                    console.info("权限：有权访问。");
                    req.session.role = role;
                    return next();
                } else {
                    console.info("权限：无权访问。");
                    return res.redirect('/norole');
                }
            });
        }

    } else {
        console.info("认证：需要登陆。");
        return res.redirect('/login');
    }

}
//*************************************
var app = express();


app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon(path.join(__dirname, '/public/images/favicon.ico')));
app.use(flash());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('hx'));
app.use(express.session({secret: 'hx'}));
//认证
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' === app.get('env')) {
    app.use(express.errorHandler());
}
//路由

app.get('/', ensureAuthenticated);


app.get('/login', function(req, res) {
    if (req.isAuthenticated()) {
        res.redirect('/');
    }
    res.render('login', {message: '欢迎'});
});

app.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            console.info("认证失败");
            return  res.render('login', {
                message: info.message});
        }
        req.logIn(user, function(err) {
            if (err) {
                return next(err);
            }
            console.info("认证成功");
            req.session.user = user;
            //重定向到权限首页
            return res.redirect('/');

            //  return res.redirect('/home');
        });
    })(req, res, next);
});

app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

app.get('/init',
        function(req, res) {
            res.render('init/initdb', {
                message: req.flash('message').toString()}
            );
        }
);
app.post('/init',
        function(req, res) {
            init.initDB(req.body.password, function(err, message) {
                //  console.info('1' + message);
                res.render('init/initdb', {'message': message});
            });
        }
);
//
//
//**************模块路由***************

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
//---------------------------
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
                        columns: 'id name username role.roleName department.departmentName',
                        num: page,
                        limit: 10
                    }, callback);
        }
    ]
            , function(err, results) {
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
        }
    ]
            , function(err, results) {
                if (err) {
                    res.redirect('/err');
                } else {
                    res.render('system/userAdd', {user: req.session.user, menu: results[0]});
                }

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

app.get('/role', ensureAuthenticated, function(req, res) {
    async.parallel([
        function(callback) {
            role.getMenu(req.path, req.session.role, callback);
        }
    ]
            , function(err, results) {
                res.render('system/role', {user: req.session.user, menu: results[0]});
            });

});

app.get('/department', ensureAuthenticated, function(req, res) {
    async.parallel([
        function(callback) {
            role.getMenu(req.path, req.session.role, callback);
        }
    ]
            , function(err, results) {
                res.render('system/department', {user: req.session.user, menu: results[0]});
            });

});

app.get('/newscommmit', ensureAuthenticated, function(req, res) {
    async.parallel([
        function(callback) {
            role.getMenu(req.path, req.session.role, callback);
        }
    ]
            , function(err, results) {
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
                        search: query,
                        columns: 'task_id name task sub_count sub_schedule_count task_type task_status',
                        num: page,
                        limit: 10
                    }, callback);
        }
    ]
            , function(err, results) {
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

app.get('/newssupportNew', ensureAuthenticated, function(req, res) {
    async.parallel([
        function(callback) {
            role.getMenu(req.path, req.session.role, callback);
        }
    ], function(err, results) {
        res.render('spread/news/supportNew', {user: req.session.user, menu: results[0]});
    });

});
app.post('/newssupportNew', ensureAuthenticated, function(req, res) {
    var speed = req.body.speed;
    var count = req.body.sub_count;
    var task = req.body.task;
    var name = req.body.taskname;
    var url = req.body.url;
    var task_type = req.body.task_type;

    var min=30;
    var max =60;
    if (speed === 1) {
        
        min = 15;
        max = 30;
    } else if (speed === 2) {
        min = 30;
        max = 60;
    }
    console.info(task + " " + name + " " + url + " " + speed + " " + count+ " "+ max + " "+min);
    var newTask = {
        task_id: new Date().getTime(),
        task_type: task_type,
        task: task,
        name: name,
        username: req.session.user.username,
        user_displayname: req.session.user.name,
        task_tag: {map: {url: url}},
        schedule_min: min,
        schedule_max: max,
        need_schedule_times: 1,
        sub_count: count,
        sub_schedule_count: 0,
        task_status: 0,
        creat_time: util.getCurrentTime
    };

    console.info(newTask);

    taskManager.saveTask(newTask, function(err) {
        if (err) {
            res.send(err);
        } else {
            res.send('1');
        }
    });
    /*
     async.parallel([
     function(callback) {
     role.getMenu(req.path, req.session.role, callback);
     }
     ]
     , function(err, results) {
     res.render('spread/news/supportNew', {user: req.session.user, menu: results[0]});
     });
     */

});


//-- ----
app.get('/sinasearch', ensureAuthenticated, function(req, res) {
    async.parallel([
        function(callback) {
            role.getMenu(req.path, req.session.role, callback);
        }
    ]
            , function(err, results) {
                res.render('account/sina/search', {user: req.session.user, menu: results[0]});
            });

});

app.get('/sinaloadin', ensureAuthenticated, function(req, res) {
    async.parallel([
        function(callback) {
            role.getMenu(req.path, req.session.role, callback);
        }
    ]
            , function(err, results) {
                res.render('account/sina/loadin', {user: req.session.user, menu: results[0]});
            });

});



//----------------------------
app.get('/norole', function(req, res) {
    res.render('norole');
});
app.get('/err', function(req, res) {
    res.render('err');
});
//404
app.get('*', function(req, res) {
    res.render('404');
});

//启动服务器

http.createServer(app).listen(app.get('port'), function() {
    console.log('系统启动:' + app.get('port'));
});
