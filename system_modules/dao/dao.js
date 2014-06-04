var config = require('./dbconfig');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 11;
var Schema = mongoose.Schema;

mongoose.connect(config.host, config.dbname);
//数据库连接
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
    console.log('Connected to DB');
});

//****************定义模型*******************
//数据模型
/**
 * 用户模型
 * @type Schema
 */
var userSchema = new Schema({
    username: {type: String, required: true, unique: true}, //用户名
    password: {type: String, required: true}, //密码
    name: {type: String, required: true}, //显示名称
    role: {//角色,
        roleId: {type: Number, required: true, default: 0}, //默认：0 游客权限，1.超级管理员 所有权限
        roleName: {type: String, required: true, default: '游客'}//

    },
    createTime: {type: Date, default: Date.now}, //创建时间
    department: {
        departmentId: {type: Number, required: true, default: 0},
        departmentName: {type: String, required: true, default: '旅游团'}
    }

});

/**
 * 保存加密中间件
 * @param {type} param1
 * @param {type} param2
 */
userSchema.pre('save', function(next) {
    var user = this;

    if (!user.isModified('password'))
        return next();

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err)
            return next(err);

        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err)
                return next(err);
            user.password = hash;
            next();
        });
    });
});

/**
 * 密码认证
 * @param {type} candidatePassword
 * @param {type} cb
 * @returns {undefined}
 */
userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err)
            return cb(err);
        cb(null, isMatch);
    });
};
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
/**
 * 部门模型
 * @type Schema
 */
var departmentSchema = new Schema({
    name: {type: String, required: true, default: '未命名部门'},
    id: {type: Number, required: true, unique: true},
    sub: []
});
//****************定义实体控制*******************
var userManager = mongoose.model('User', userSchema);
var roleManager = mongoose.model('Role', roleSchema);
var departmentManager = mongoose.model('Department', departmentSchema);



//*******************暴露接口*******************
/**
 * 查询用户
 * @param {type} username 用户名
 * @param {type} callback 回调函数
 * @returns {undefined}
 */
exports.findUser = function(where, callback) {
    userManager.findOne(where, callback);
};
/**
 * 保存用户
 * @param {type} newUser
 * @param {type} callback
 * @returns {undefined}
 */
exports.saveUser = function(newUser, callback) {
    var user = new userManager(newUser);
    user.save(function(err) {
        if (err) {
            callback(err, '保存用户数据错误');
            console.log(err);
        } else {
            callback(null, '用户: ' + user.username + " 已经保存.");
            console.log('用户: ' + user.username + " 已经保存.");
        }
    });

};
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
/**
 * 查找 部门
 * @param {type} where
 * @param {type} callback
 * @returns {undefined}
 */
exports.findDepartment = function(where, callback) {
    departmentManager.findOne(where, callback);
};

exports.saveDepartment = function(department, callback) {
    var newdepartment = new departmentManager(department);

    newdepartment.save(function(err) {
        if (err) {
            callback(err, '保存部门数据错误');
            console.log(err);
        } else {
            callback(null, "部门已经保存");
            console.log("部门已经保存");
        }
    });

};


