
/**
 * 依赖模块
 */

var express = require('express');
var http = require('http');
var path = require('path');
var flash = require('connect-flash');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy; //认证策略
var async = require('async'); //流程控制

var init = require('./system_modules/dao/initdb');
var role = require('./system_modules/role/role');
var userManager = require('./system_modules/user/user');
var taskManager = require('./system_modules/task/task');
var departmentManager = require('./system_modules/department/department');
var util = require('./system_modules/util');
var scheduleManager = require('./system_modules/schedule/schedule');
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
    console.info("判断登陆:" + req.path);
    if (req.isAuthenticated()) {//判断登陆
        if (req.path === '/') {//首页
            //首先判断用户设定首页
            var home = req.session.user.homeRoute;
            if (home && home !== '/') {
                console.log("use homeroute");
                return res.redirect(home);
            }
            home = req.session.user.role.homeRoute;
            if (home && home !== '/') {
                console.log("role homeroute");
                return res.redirect(home);
            }
            //再次判断角色首页
            role.getHome(req.session.user.role.id, function(err, homeRoute) {
                if (err) {
                    console.info('err ' + err.message);
                    return res.redirect('/norole');
                } else {
                    return res.redirect(homeRoute);
                }

            });
        } else {
            role.authRole({"id": req.session.user.role.id, "route": req.path}, //判断权限
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
                        columns: 'id name username role.text department.text',
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
app.get('/department', ensureAuthenticated, function(req, res) {
    async.parallel([
        function(callback) {
            role.getMenu(req.path, req.session.role, callback);
        },
        function(callback) {
            departmentManager.findDepartment({}, callback);
        }
    ], function(err, results) {
        res.render('system/department', {user: req.session.user, menu: results[0], department: results[1]});
    });
});
app.post('/departmentSave', ensureAuthenticated, function(req, res) {
    var department = req.body.department;
    departmentManager.updateDepartment(department, function(err) {
        if (err) {
            res.send(err);
        } else {
            res.send('200');
        }
    });
    return;
});
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
                        search: query,
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
    taskManager.addNewsSupportTask(req, function(err) {
        if (err) {
            res.send(err);
        } else {
            res.send('1');
        }
    });
});
//--------------schedule---------------------
app.get('/scheduleClient', ensureAuthenticated, function(req, res) {

    async.parallel([
        function(callback) {
            role.getMenu(req.path, req.session.role, callback);
        }, function(callback) {
            scheduleManager.gatOnlineClient(callback);
        }
    ], function(err, results) {
        if (err) {
            res.redirect('/scheduleErr');
        } else {
            console.info(results[1]);
            var clients = JSON.parse(results[1]);
            res.render('schedule/scheduleClient', {user: req.session.user, menu: results[0], clients: clients});
        }

    });
});
app.get('/scheduleErr', function(req, res) {
    async.parallel([
        function(callback) {
            role.getMenu(req.path, req.session.role, callback);
        }
    ], function(err, results) {
        if (err) {
            res.redirect('/err');
        } else {
            res.render('schedule/timeout', {user: req.session.user, menu: results[0]});
        }
    });
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
    ], function(err, results) {
        res.render('account/sina/loadin', {user: req.session.user, menu: results[0]});
    });
});
//------------长河监控--------------

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
