var mongoose = require('../database/mongodb');
var Schema = mongoose.Schema;


var logSchema = new Schema({
    log: {type: String, required: true, unique: true}, //日志内容
    time: {type: Date, default: Date.now}, //日期
    user: {type: String} //用户
});

var logManager = mongoose.model('log', logSchema);

//保存日志
exports.saveLog = function(user,log) {
     
    var newlog = new logManager({log:log,user:user});
    newlog.save(function(err) {
        if (err) {
           // callback(err, '保存用户数据错误');
            console.log(err);
        } 
    });

};