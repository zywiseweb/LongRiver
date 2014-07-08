var config = require('./dbconfig');
var mongoose = require('mongoose');
var autoinc    = require('mongoose-id-autoinc');

module.exports = mongoose;

mongoose.connect(config.host, config.dbname);

//数据库连接
var db = mongoose.connection;
autoinc.init(db);
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
    console.log('已经连接到数据库');
});


