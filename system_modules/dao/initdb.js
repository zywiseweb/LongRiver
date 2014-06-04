
var async = require('async');
var db = require('../dao/dao');
var structure = require('../dao/structure');
//初始化数据库
var initkey = '123';
//初始化超级管理员
exports.initDB = function(password, callback) {
    console.info('init start.');
    if (password === initkey) {
        async.series([initAdmin(callback), inirRole(callback), initDepartment(callback)], function(err, message) {
            if (err) {
                callback(err, message);
            } else {
                callback(null, '初始化成功。');
            }
        });
    } else {
        callback(null, '初始化密码错误');
    }
};

function initAdmin(callback) {
    console.info('init admin.');
    db.findUser({'username': 'admin'}, function(err, user) {
        if (err) {
            callback(err, '用户查询操作出现错误');
        }
        if (!user) {
            console.info('添加超级管理员');
            //初始化数据
            var newUser = {
                username: 'admin',
                password: 'admin',
                name: '超级管理员',
                role: {
                    roleId: 1,
                    roleName: '超级管理员'
                },
                department: {
                    departmentId: 1,
                    departmentName: '系统管理员'
                }
            };
            db.saveUser(newUser, callback);
        } else {
            callback(null, '超级管理员用户已经存在');
            console.info('超级管理员用户已经存在');
        }
    });
}

function inirRole(callback) {
    console.info('init admin role.');
    db.findRole({'id': 1}, function(err, role) {
        if (err) {
            callback(err, '权限查询操作出现错误');
        }
        if (!role) {
            console.info('添加超级管理员权限');
            var adminRole = {
                id: 1,
                name: '超级管理员',
                homeRoute:'/user',
                access: structure
            };
            db.saveRole(adminRole, callback);
        } else {
            callback(null, '超级管理员权限已经存在');
            console.info('超级管理员权限已经存在');
        }
    });

}


function initDepartment(callback) {
    console.info('init admin department.');
    callback(null, "ok");

    db.findDepartment({'id': 0}, function(err, role) {
        if (err) {
            callback(err, '部门查询操作出现错误');
        }
        if (!role) {
            console.info('添加部门信息');
            var department = {
                id: 0,
                name: '系统',
                sub: [
                    {
                        id: 1,
                        name: '系统管理员',
                        sub: []

                    }
                ]
            };
            db.saveDepartment(department, callback);
        } else {
            callback(null, '部门信息已经存在');
            console.info('部门信息已经存在');
        }
    });
}


