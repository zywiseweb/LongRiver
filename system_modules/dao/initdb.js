
var async = require('async');
var userManager = require('../user/user');
var roleManager = require('../role/role');
var departmentManager = require('../department/department');

var structure = require('../dao/structure');
//初始化数据库
var initkey = '123';
//初始化超级管理员
/**
 * 导出端口 初始化 数据库结构
 * @param {type} password 初始化密码，只有密码输入正确才可以
 * @param {type} callback
 * @returns {undefined}
 */
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
/**
 * 初始化 管理员账号
 * @param {type} callback 回调函数
 * @returns {undefined}
 */
function initAdmin(callback) {
    console.info('init admin.');
    userManager.findUser({'username': 'admin'}, function(err, user) {
        if (err) {
            callback(err, '用户查询操作出现错误');
        }
        if (!user) {
            console.info('添加超级管理员');
            //初始化数据
            var newUser = {
                username: 'admin',//登陆名
                password: 'admin',//密码
                name: '超级管理员',//用户名
                homeRoute:'/user',
                role: {
                    roleId: 1,
                    roleName: '超级管理员'
                },
                department: {
                    departmentId: 1,
                    departmentName: '系统管理员'
                }
            };
            userManager.saveUser(newUser, callback);
        } else {
            callback(null, '超级管理员用户已经存在');
            console.info('超级管理员用户已经存在');
        }
    });
}
/**
 * 初始化权限
 * @param {type} callback
 * @returns {undefined}
 */
function inirRole(callback) {
    console.info('init admin role.');
    roleManager.findRole({'id': 1}, function(err, role) {
        if (err) {
            callback(err, '权限查询操作出现错误');
        }
        if (!role) {
            console.info('添加超级管理员权限');
            var adminRole = {
                id: 1,//权限ID
                name: '超级管理员',//权限名称
                homeRoute:'/user',//权限默认首页
                access: structure //认证结构
            };
            roleManager.saveRole(adminRole, callback);
        } else {
            callback(null, '超级管理员权限已经存在');
            console.info('超级管理员权限已经存在');
        }
    });

}

/**
 * 初始化 部门
 * @param {type} callback
 * @returns {undefined}
 */
function initDepartment(callback) {
    console.info('init admin department.');
    callback(null, "ok");

    departmentManager.findDepartment({'id': 0}, function(err, role) {
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
            departmentManager.saveDepartment(department, callback);
        } else {
            callback(null, '部门信息已经存在');
            console.info('部门信息已经存在');
        }
    });
}


