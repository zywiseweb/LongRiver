
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
        async.series([inirRole(callback), initDepartment(callback), initAdmin(callback)], function(err, message) {
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
                username: 'admin', //登陆名
                password: 'admin', //密码
                name: '超级管理员', //用户名
                homeRoute: '/person',
                role: {
                    id: 1,
                    text: '超级管理员'
                },
                department: {
                    id: 1,
                    text: '系统管理'
                }
            };
            console.info(newUser);
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
    roleManager.findRole({text: '超级管理员'}, function(err, role) {
        if (err) {
            callback(err, '权限查询操作出现错误');
        }
        if (!role) {
            console.info('添加超级管理员权限');
            var adminRole = {
                id: 1, //权限ID
                text: '超级管理员', //权限名称
                createUser: '系统',
                homeRoute: '/person', //权限默认首页
                access: structure //认证结构
            };
            console.info(adminRole);
            roleManager.saveRole(adminRole, function(err) {
                if (!err) {
                    roleManager.updateRole({text: '超级管理员'}, {$set: {id: 1}}, function(err) {
                        if (err) {
                            console.info('更新 id 出错');
                        } else {
                            console.info('初始化管理员 ID');
                        }
                    });

                }
            });

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
                id: 100,
                text: '系统部门',
                'children': [
                    {
                        id: 1,
                        text: '系统管理'
                    }, {
                        id: 2,
                        text: '系统用户'

                    }, {
                        id: 3,
                        text: '试用用户'

                    }
                ]
            };
            console.info(department);
            departmentManager.saveDepartment(department, callback);
        } else {
            callback(null, '部门信息已经存在');
            console.info('部门信息已经存在');
        }
    });
}


