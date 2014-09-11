var mongoose = require('../database/mongodb');
var Schema = mongoose.Schema;
/**
 * 语料模型
 * @type Schema
 * 
 */
var docSchema = new Schema({
    setid: {type: Number, default:0},
    content: {type: String, required: true}, 
    task_id: {type: Number},
    createTime: {type: Date, default: Date.now}, //创建时间
    enable: {type: Boolean ,default: true} //首页路由
        
});

var docManager = mongoose.model('documents', docSchema);
/**
 * 保存语料并 返回ID
 * @param {type} docs
 * @param {type} callback
 * @returns {undefined}
 */
exports.save = function(docs, callback) {
    docManager.create(docs,function(err, jellybean, snickers){
        if(err){
            callback(err,null);
        }else{
            callback(null,null);
        }
        
    });
};

exports.getIDsByTaskID = function(taskid, callback) {
    docManager.find({task_id:taskid},"_id",callback);
    
};