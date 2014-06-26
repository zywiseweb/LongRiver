var mongoose = require('../database/mongodb');

var Schema = mongoose.Schema;

/**
 * 权限模型
 * @type Schema
 */
var roleSchema = new Schema({
    id: {type: Number, required: true, unique: true},
    name: {type: String, required: true, unique: true}, //用户名
    createTime: {type: Date, default: Date.now}, //创建时间
    homeRoute: {type: String}, //首页路由
    access: {}//角色权限,方具体的权限内容
});

var roleManager = mongoose.model('Role', roleSchema);

/**
 * 
 * @param {type} where
 * @param {type} callback
 * @returns {undefined}
 */
exports.findRole = function(where, callback) {
    roleManager.findOne(where, callback);
};
/**
 * 保存权限
 * @param {type} role
 * @param {type} callback
 * @returns {undefined}
 */
exports.saveRole = function(role, callback) {
    var newRole = new roleManager(role);
    newRole.save(function(err) {
        if (err) {
            callback(err, '保存权限数据错误');
            console.log(err);
        } else {
            callback(null, '权限: ' + role.name + " 已经保存.");
            console.log('权限: ' + role.name + " 已经保存.");
        }
    });

};


exports.authRole = function(roleParam, callback) {
    var roleRoute = roleParam.route;
    this.findRole({"id": roleParam.roleid}, function(err, role) {
        if (err) {
            return callback(err);
        }
        if (role) {
            for (var i = 0; i < role.access.length; i++) {
                if (chickRole(roleRoute, role.access[i])) {
                    return callback(null, role);
                }
            }
            callback(null, null);
        } else {
            callback(null, null);
        }
    });
};
/**
 * 
 * @param {type} rutroutee
 * @param {type} access
 * @returns {Boolean}
 */
function chickRole(route, access) {
    if (route === access.route) {
        return true;
    }
    if (access.sub && access.sub.length > 0) {
        for (var i = 0; i < access.sub.length; i++) {
            if (chickRole(route, access.sub[i])) {
                return true;
            }
        }
        return false;
    }
    return false;
}
/**
 * 获取权限首页，获得用户所在角色的默认首页。后继计划可以设置首页
 * @param {type} role
 * @param {type} callback
 * @returns {undefined}
 */
exports.getHome = function(roleID, callback) {
    if (!roleID) {
        return  callback({message: 'roleid is null'}, null);
    }
    this.findRole({"id": roleID}, function(err, role) {
        if (err)
            return callback({message: 'Get role err'}, null);
        if (role) {
            if (role.homeRoute) {
                callback(null, role.homeRoute);
            } else {
                var access = role.access;
                if (access.length > 0) {//多个系统
                    for (var i = 0; i < access.length; i++) {
                        if (access[i].sub.length > 0) {//多个模块
                            var modules = access[i].sub;
                            for (var j = 0; j < modules.length; j++) {
                                if (modules[j].sub.length > 0) {//多个子模块
                                    var sub = modules[j].sub;
                                    for (var k = 0; k < sub.length; k++) {
                                        if (sub[k].route)
                                            return callback(null, sub[k].route);
                                    }
                                }
                                if (modules[j].route)
                                    return callback(null, modules[j].route);
                            }
                        } else {
                            if (access[i].route)
                                return callback(null, access[i].route);//返回首个系统路由
                        }
                    }
                    callback({messge: 'no role can use.'}, null);
                } else {
                    callback({messge: 'role is empty.'}, null);
                }
            }
        } else {
            callback({messge: 'No role for this id.'}, null);
        }
    });

};
/**
 * 生成菜单
 * @param {type} role
 * @param {type} route
 * @param {type} callback
 * @returns {undefined}
 * {systems:[
 *  {
 *      name:名称，
 *      route:路由
 *      current:是否当前
 *  }
 * ],
 * current:[
 * {
 *      name:名称，
 *      route:路由
 *      current:是否当前
 *      sub:[{
 *          name:名称，
 *          route:路由
 *          current:是否当前
 *      }
 *      ]
 * }
 * ]}
 */
exports.getMenu = function(route, role, callback) {
    var menu = {
        systems: [],
        current: []
    };
    var access = role.access;
    var getCurrent = false;
    var currentIndex = -1;
    for (var i = 0; i < access.length; i++) {
        var system = {
            name: access[i].name,
            route: access[i].route,
            current: false
        };
        if (!getCurrent) {
            if (chickRole(route, access[i])) {
                getCurrent = true;
                system.current = true;
                var sub = access[i].sub;

                if (sub && sub.length > 0) {
                    for (var j = 0; j < sub.length; j++) {
                        var m = {
                            name: sub[j].name,
                            route: sub[j].route,
                            current: false,
                            sub: []
                        };
                        if (m.route === route) {
                            m.current = true;
                        }
                        if (!system.route) {
                            system.route = sub[j].route;
                        }
                        if (sub[j].sub && sub[j].sub.length > 0) {
                            for (var k = 0; k < sub[j].sub.length; k++) {
                                var m2 = {
                                    name: sub[j].sub[k].name,
                                    route: sub[j].sub[k].route,
                                    current: false
                                };
                                if (m2.route === route) {
                                    m2.current = true;
                                    m.current = true;
                                }
                                m.sub.push(m2);
                                if (!system.route) {
                                    system.route = sub[j].sub[k].route;
                                }
                            }
                        }
                        menu.current.push(m);
                    }
                }
            }
        }
        menu.systems.push(system);
    }
    callback(null, menu);
};