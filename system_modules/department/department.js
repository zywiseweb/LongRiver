
var mongoose = require('../database/mongodb');

var Schema = mongoose.Schema;
/**
 * 部门模型
 * @type Schema
 */
var departmentSchema = new Schema({
    id: {type: String, required: false},
    text: {type: String, required: true, default: '未命名部门'},
    children: []
});

var departmentManager = mongoose.model('Department', departmentSchema);


/**
 * 查找 部门
 * @param {type} where
 * @param {type} callback
 * @returns {undefined}
 */
exports.findDepartment = function (id, callback) {
    departmentManager.findOne({id: '100'}, function (err, root) {
        if (err) {
            callback(err);
        } else {
            /* console.info(id);
             console.info(root);
             var d =getDepartmentByID(id,root);
             if(d){
             callback(null, {id:'0',text:'没有部门'});   
             }else{
             callback(null, d);   
             }*/

            callback(null, root);
        }
    });
};
/**
 * 通过id找到部门
 * @param {type} id
 * @param {type} parentDap
 * @returns {unresolved}
 */
function getDepartmentByID(id, parentDap) {
    // console.info(id +" ===="+ parentDap.id);
    if (id === parentDap.id) {
        return parentDap;
    } else {
        if (parentDap.children && parentDap.children.length > 0) {
            for (var i = 0; i < parentDap.children.length; i++) {
                return  getDepartmentByID(id, parentDap.children[i]);
            }
        }
    }


}

exports.saveDepartment = function (department, callback) {
    var newdepartment = new departmentManager(department);
    newdepartment.save(function (err) {
        if (err) {
            callback(err, '保存部门数据错误');
            console.log(err);
        } else {
            callback(null, "部门已经保存");
            console.log("部门已经保存");
        }
    });

};

exports.updateDepartment = function (department, callback) {
    var root = getdepartment(department[0]);
    departmentManager.update({id: '100'}, {$set: {children: root.children}}, function (err) {
        if (err) {
            callback(err, '保存部门数据错误');
        } else {
            callback(null);
        }
    });

};


function getdepartment(object) {
    var d = {
        id: object.id,
        text: object.text,
        info: object.info,
        children: []
    };
    if (object.children) {

        if (object.children.length > 0) {
            for (var i = 0; i < object.children.length; i++) {
                d.children.push(getdepartment(object.children[i]));

            }
        }
    }
    return d;
}
/**
 * 返回部门列表
 * @param {type} department
 * @param {type} callback
 * @returns {undefined}
 */

exports.getDepartmentList = function (id, callback) {
    departmentManager.find({id: 100}, function (err, result) {
        if (err) {
            callback(err);
        } else {
            var list = [];
            var base = result[0];
            for (var i = 0; i < base.children.length; i++) {
                var d = {
                    id: base.children[i].id,
                    text: base.children[i].text
                };
                list.push(d);
                getChildren(base.children[i], list);
            }
            callback(null, list);
        }
    });
};

function getChildren(dp, list) {

    if (dp.children && dp.children.length > 0) {
        for (var i = 0; i < dp.children.length; i++) {
            var d = {
                id: dp.children[i].id,
                text: dp.children[i].text
            };
            list.push(d);
            getChildren(dp.children[i], list);
        }
    }
}



