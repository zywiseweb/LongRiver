var mongoose = require('../database/mongodb');
var Schema = mongoose.Schema;

var accountSchema = new Schema({
    
    username: {type: String, required: true, unique: true}, //用户名
    password: {type: String},//密码
    displayname: {type: String}, //创建时间
    type:{type:Number},//账号类型
    area:{type:Number},//试用地区
    lastUsedTime:{type:String},//最后试用时间
    enable: {type:Number}//是否可用
});

var accountManager = mongoose.model('Account', accountSchema);