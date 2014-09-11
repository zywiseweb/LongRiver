var role = require('../system_modules/role/role');

var system = require('./system');
var user = require('./user');
var role = require('./role');
var err = require('./role');
var department = require('./department');
var account = require('./account');
var spread = require('./spread');
var schedule = require('./schedule');
var mobile = require('./mobile');
var longRiver = require('./longRiver');
var resource = require('./resource');

exports.route = function(app,ensureAuthenticated) {

    /************通用部分**************/
    //系统路由
    system.route(app, ensureAuthenticated);
    //用户管理
    user.route(app, ensureAuthenticated);
    //权限管理
    role.route(app, ensureAuthenticated);
    //部门管理
    department.route(app, ensureAuthenticated);
    
    /*************业务部分*******************/
    //账号管理
    account.route(app, ensureAuthenticated);
    //引导管理
    spread.route(app, ensureAuthenticated);
    //调度管理
    schedule.route(app, ensureAuthenticated);
    //移动管理
    mobile.route(app, ensureAuthenticated);
    //长河监控
    longRiver.route(app, ensureAuthenticated);
    //资源系统
    resource.route(app, ensureAuthenticated);
    
    //错误处理
     err.route(app, ensureAuthenticated);



};