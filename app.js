
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
var clientManager = require('./system_modules/client/client');
var departmentManager = require('./system_modules/department/department');
var util = require('./system_modules/util');
var scheduleManager = require('./system_modules/schedule/schedule');
var accountManager = require('./system_modules/account/account');
var mobileManager = require('./system_modules/mobile/mobile');
var logManager = require('./system_modules/log/logger');
var routes = require("./routes/routes");

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
            if (req.session.path && req.session.path !== '/') {
                return res.redirect(req.session.path);
            }
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

            //日志
        }

    } else {
        console.info("认证：需要登陆。");
        req.session.path = req.path;
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

routes.route(app,ensureAuthenticated);


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



//------------长河监控--------------




//启动服务器

http.createServer(app).listen(app.get('port'), function() {
    console.log('系统启动:' + app.get('port'));
});
