
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

var db = require('./system_modules/dao/dao');
var init = require('./system_modules/dao/initdb');
var role = require('./system_modules/role/role');

//*************************************
/**
 * 认证部分
 */
//session 设置

passport.serializeUser(function(user, done) {
    done(null, user.username);
});

passport.deserializeUser(function(username, done) {
    db.findUser({username: username}, function(err, user) {
        done(err, user);
    });
});

//认证策略
passport.use(new LocalStrategy(function(username, password, done) {
    db.findUser({'username': username}, function(err, user) {
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
        if(req.path==='/'){//首页
            role.getHome(req.session.user.role.roleId, function(err, homeRoute) {
                if (err) {
                    console.info(err.message);
                    return res.redirect('/norole');
                } else {
                    return res.redirect(homeRoute);
                }

            });
        }else{
        role.authRole({"roleid": req.session.user.role.roleId, "route": req.path}, //判断权限
        function(err, role) {
            if (err) {
                console.info("权限：鉴权错误");
                return res.redirect('/err500');
            }
            if (role) {
                console.info("权限：有权访问。");
                req.session.role=role;
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



    //   if

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
        function(callback){
            role.getMenu(req.path,req.session.role,callback);
        }
    ]
    ,function(err,results){
        console.info(results[0].toString());
        res.render('person/main', {user: req.session.user,menu:results[0]});
    });
});
//---------------------------
app.get('/user', ensureAuthenticated, function(req, res) {
    res.render('system/user', {user: req.session.user});
});

app.get('/role', ensureAuthenticated, function(req, res) {
    res.render('system/role', {user: req.session.user});
});

app.get('/dapartment', ensureAuthenticated, function(req, res) {
    res.render('system/dapartment', {user: req.session.user});
});


//----------------------------
app.get('/norole', function(req, res) {
    res.render('norole');
});
//404
app.get('*', function(req, res) {
    res.render('404');
});

//启动服务器

http.createServer(app).listen(app.get('port'), function() {
    console.log('系统启动:' + app.get('port'));
});
