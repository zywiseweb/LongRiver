var async = require('async');//流程控制
var net = require('net');
var config = require('./config');

exports.gatOnlineClient = function(callback) {
    var command = "{\"content\":10, \"type\": 106}\r\n";
    this.sendCommand(command ,callback);
};

/**
 * 发送指令
 * @param {type} command 指令内容
 * @param {type} callback 回掉函数
 * @returns {undefined}
 */
exports.sendCommand=function(command,callback){
    var sockrt = net.createConnection(config.port, config.host, function() { //'connect' listener
        console.log('client connected');
        console.info('send:'+command);
        sockrt.write(command);
    });
    sockrt.on('data', function(data) {
        console.log('data:' + data.toString());
        callback(null, data.toString());
        sockrt.end();
        return;
    });
    sockrt.on('end', function() {
        console.log('sockrt disconnected');
        return;
    });
    sockrt.on('error', function() {
        callback('socket error');
      
        return;
    });
}