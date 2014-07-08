var mongoose = require('../database/mongodb');
var autoinc = require('mongoose-id-autoinc');
var Schema = mongoose.Schema;
var structure = require('../dao/structure');
/**
 * 权限模型
 * @type Schema
 */
var roleSchema = new Schema({
    id: {type: Number, unique: true},
    text: {type: String, required: true, unique: true}, //用户名
    createUser: {type: String},
    createTime: {type: Date, default: Date.now}, //创建时间
    homeRoute: {type: String}, //首页路由
    access: {}//角色权限,方具体的权限内容
});
var roleManager = mongoose.model('Role', roleSchema);

roleSchema.plugin(autoinc.plugin, {
    model: 'Role',
    field: 'id',
    start: 2,
    step: 1
});

/**
 * 
 * @param {type} where
 * @param {type} callback
 * @returns {undefined}
 */
exports.findRole = function(where, callback) {
    roleManager.findOne(where, callback);
};

exports.updateRole = function(where, set, callback) {
    roleManager.update({text: '超级管理员'}, {$set: {id: 1}}, callback);
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
            callback(null, '权限: ' + role.text + " 已经保存.");
            console.log('权限: ' + role.text + " 已经保存.");
        }
    });
};
exports.authRole = function(roleParam, callback) {
    var roleRoute = roleParam.route;
    this.findRole({"id": roleParam.id}, function(err, role) {
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
 * 
 * @param {type} roleID
 * @param {type} callback
 * @returns {undefined}
 */
exports.getRoleList = function(callback) {
    roleManager.find({}, "id text", function(err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result);
        }
    });
}
/**
 * 获取权限首页，获得用户所在角色的默认首页。后继计划可以设置首页
 * @param {type} role
 * @param {type} callback
 * @returns {undefined}
 */

exports.getHome = function(roleID, callback) {
    console.info("get home  id is " + roleID);
    if (!roleID) {
        return  callback({message: 'roleid is null'}, null);
    }
    roleManager.findOne({id: roleID}, function(err, role) {
        if (err) {
            return callback({message: 'Get role err'}, null);
        }
        if (role) {
            console.info("get role,");
            if (role.homeRoute) {
                callback(null, role.homeRoute);
            } else {
                console.info(" role do net have home");
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
                                return callback(null, access[i].route); //返回首个系统路由
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
 *      text:名称，
 *      route:路由
 *      current:是否当前
 *  }
 * ],
 * current:[
 * {
 *      text:名称，
 *      route:路由
 *      current:是否当前
 *      sub:[{
 *          text:名称，
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
    for (var i = 0; i < access.length; i++) {//系统级
        var system = {
            text: access[i].text,
            route: access[i].route,
            current: false
        };
        if (!getCurrent) {
            if (chickRole(route, access[i])) {
                getCurrent = true;
                system.current = true;
                var sub = access[i].sub;
                if (sub && sub.length > 0) {
                    for (var j = 0; j < sub.length; j++) {//模块纪
                        var m = {
                            text: sub[j].text,
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
                                    text: sub[j].sub[k].text,
                                    route: sub[j].sub[k].route,
                                    current: false
                                };
                                if (chickRole(route, sub[j].sub[k])) {
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
exports.findPagination = function(params, callback) {
    var q = params.search || {}; //查询调价
    var col = params.columns; //字段
    var pageNumber = params.num || 1; //页数
    var resultsPerPage = params.limit || 10; //每页行数
    var skipFrom = (pageNumber * resultsPerPage) - resultsPerPage; //其实也

    console.info('q:' + q + ' col:' + col + ' pageNumber:' + pageNumber + ' skipFrom:' + skipFrom);
    var query = roleManager.find(q, col).sort('-createTime').skip(skipFrom).limit(resultsPerPage);
    query.exec(function(err, results) {
        if (err) {
            callback(err, null);
        } else {
            roleManager.count(q, function(err, count) {
                if (err) {
                    callback(err, null);
                } else {
                    var pageCount = Math.ceil(count / resultsPerPage);
                    callback(null, {'pageCount': pageCount, 'results': results, currentPage: pageNumber});
                }
            });
        }
    });
};
/**
 * 获取 权限树
 * @param {type} access
 * @returns {exports.gatRoleTree.tree|ObjectId.gatRoleTree.tree|module.exportsStrategy.gatRoleTree.tree|Document.gatRoleTree.tree|Array|Mongoose.gatRoleTree.tree|Model.gatRoleTree.tree|module.exports@new;Passport.gatRoleTree.tree|Binary.gatRoleTree.tree}
 */
exports.gatRoleTree = function(access) {
    var tree = [];
    for (var i = 0; i < access.length; i++) {
        var s = {
            text: access[i].text,
            id: access[i].id,
            children: []
        };
        getChilren(s, access[i]);
        tree.push(s);
    }
    return tree;
};
function getChilren(treeNode, role) {
    if (role.sub && role.sub.length > 0) {
        for (var i = 0; i < role.sub.length; i++) {
            var s = {
                text: role.sub[i].text,
                id: role.sub[i].id,
                /*   state: {
                 opened: false,
                 selected: false
                 },*/
                children: []
            };
            getChilren(s, role.sub[i]);
            treeNode.children.push(s);
        }
    }

}
;
/**
 * 保存新权限
 * @param {type} name 权限名
 * @param {type} access 选择的权限id list
 * @param {type} user 创建权限的用户
 * @param {type} callback 回调
 * @returns {undefined}
 */
exports.newRole = function(name, access, user, callback) {

    //  console.info(name + " " + access + ' ' + id + ' ' + ' ' + user);
    var ids = [];
    for (var i = 0; i < access.length; i++) {
        ids.push(parseInt(access[i]));
    }
    var newrole = {
        text: name,
        createUser: user,
        access: []
    };
    var newAccess = [];

    for (var i = 0; i < structure.length; i++) {
        var leaf = getLeaf(structure[i], ids);
        if (leaf) {
            newAccess.push(leaf);
        }
    }

    newrole.access = newAccess;
    //   console.info(newrole);
    this.saveRole(newrole, callback);
};
/**
 *  编辑权限
 * @param {type} name 名称
 * @param {type} access 权限
 * @param {type} id id
 * @param {type} callback
 * @returns {undefined}
 */
exports.editRole = function(name, access, id, user, callback) {

    var ids = [];
    for (var i = 0; i < access.length; i++) {
        ids.push(parseInt(access[i]));
    }

    var newAccess = [];
    for (var i = 0; i < structure.length; i++) {
        var leaf = getLeaf(structure[i], ids);
        if (leaf) {
            newAccess.push(leaf);
        }
    }
    console.info(id + " " + name + " " + newAccess);
    roleManager.update({id: id}, {$set: {text: name, access: newAccess}}, function(err) {
        if (err) {
            // console.info(err);
            callback(err);
        } else {
            // console.info('200');
            callback(null);
        }
    });

};
exports.deleteRole = function(id, callback) {
    if (id === '1' || id === 1) {
        callback('err');
    } else {
        console.info('删除' + id);
        roleManager.remove({id: id}, callback);
    }
};
/**
 * 根据id 判断叶子
 * @param {type} access
 * @param {type} ids
 * @returns {chickAccess.subAccess}
 */
function getLeaf(access, ids) {
    var subAccess = {
        id: access.id,
        text: access.text,
        route: access.route,
        sub: []
    };

    if (access.sub && access.sub.length > 0) {
        var temp = [];
        for (var i = 0; i < access.sub.length; i++) {
            var sub = getLeaf(access.sub[i], ids);
            if (sub) {
                temp.push(sub);
            }
        }
        if (temp.length === 0) {
            return null;
        } else {
            subAccess.sub = temp;
            return subAccess;
        }
    } else {//叶子
        if (ids.indexOf(access.id) > -1) {
            return subAccess;
        } else {
            return null;
        }
    }
}
;
/*
 exports.getNotSelected = function(all,selected) {
 var al = getIds(all);
 var sel = getIds(selected);
 var desel = [];
 for(var i=0;i<al.length;i++){
 if(sel.indexOf(al[i])<0){
 desel.push(al[i]);  
 }
 }
 return desel;
 };*/
/**
 * 用户确认自权限是否可用
 * @param {type} access
 * @returns {undefined}
 */
/*
 function chickAccess(access, ids) {
 if (access.sub && access.sub.length > 0) {
 var temp = [];
 for (var i = 0; i < access.sub.length; i++) {
 if (ids.indexOf(access.sub[i].id) > -1) {
 var subAccess = {
 id: access.sub[i].id,
 text: access.sub[i].text,
 route: access.sub[i].route,
 sub: []
 };
 temp.push(subAccess);
 subAccess.sub = chickAccess(access.sub[i], ids);
 }
 }
 //  console.info(temp);
 return temp;
 } else {
 return [];
 }
 }
 ;
 */

/**
 * 
 * @param {type} role
 * @returns {Array}
 */
exports.getLeafID = function(role) {
    console.info('==>' + role);
    var ids = [];
    for (var i = 0; i < role.access.length; i++) {
        getLeafID(role.access[i], ids);
    }

    return ids;
};
/**
 * 递归方法 获取权限ID
 * 获得权限树叶子点
 */
function getLeafID(node, list) {
    if (node.sub && node.sub.length > 0) {
        for (var i = 0; i < node.sub.length; i++) {
            getLeafID(node.sub[i], list);
        }
    } else {
        list.push(node.id);
    }
}
;


