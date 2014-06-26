var mongoose = require('../database/mongodb');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 11;
var Schema = mongoose.Schema;



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

//****************定义实体控制*******************
var userManager = mongoose.model('User', userSchema);

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
 * 分页查询
 * @param {type} params
 * @param {type} callback
 * @returns {undefined}
 */
exports.findPagination = function(params, callback) {
    var q = params.search || {};//查询调价
    var col = params.columns;//字段

    var pageNumber = params.num || 1;//页数
    var resultsPerPage = params.limit || 10;//每页行数

    var skipFrom = (pageNumber * resultsPerPage) - resultsPerPage;//其实也

    console.info('q:' + q + ' col:' + col + ' pageNumber:' + pageNumber + ' skipFrom:' + skipFrom);

    var query = userManager.find(q, col).sort('-createTime').skip(skipFrom).limit(resultsPerPage);

    query.exec(function(err, results) {
        if (err) {
            callback(err, null);
        } else {
            userManager.count(q, function(err, count) {
                if (err) {
                    callback(err, null);
                } else {
                    console.info('--->'+results.toString());
                    var pageCount = Math.ceil(count / resultsPerPage);
                    callback(null, {'pageCount': pageCount, 'results': results, currentPage: pageNumber});
                }
            });
        }
    });


};


