
var mongoose = require('../database/mongodb');

var Schema = mongoose.Schema;
/**
 * 部门模型
 * @type Schema
 */
var departmentSchema = new Schema({
    name: {type: String, required: true, default: '未命名部门'},
    id: {type: Number, required: true, unique: true},
    sub: []
});

var departmentManager = mongoose.model('Department', departmentSchema);


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

