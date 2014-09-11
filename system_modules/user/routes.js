
var path = require('path');
var flash = require('connect-flash');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy; //认证策略
var async = require('async'); //流程控制

var init = require('../system_modules/dao/initdb');
var role = require('../system_modules/role/role');
var userManager = require('../system_modules/user/user');
var taskManager = require('../system_modules/task/task');
var clientManager = require('../system_modules/client/client');
var departmentManager = require('../system_modules/department/department');
var util = require('../system_modules/util');
var scheduleManager = require('../system_modules/schedule/schedule');
var accountManager = require('../system_modules/account/account');
var mobileManager = require('../system_modules/mobile/mobile');
var logManager = require('../system_modules/log/logger');


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


exports.route = function(app) {
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
};