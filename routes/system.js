
var path = require('path');
var flash = require('connect-flash');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy; //认证策略
var async = require('async'); //流程控制

var init = require('../system_modules/dao/initdb');
var user = require('./user');



exports.route = function(app,ensureAuthenticated) {
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