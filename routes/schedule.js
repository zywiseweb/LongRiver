
var async = require('async'); //流程控制

var role = require('../system_modules/role/role');
var scheduleManager = require('../system_modules/schedule/schedule');
exports.route = function(app, ensureAuthenticated) {
  app.get('/scheduleClient', ensureAuthenticated, function(req, res) {

    async.parallel([
        function(callback) {
            role.getMenu(req.path, req.session.role, callback);
        }, function(callback) {
            scheduleManager.gatOnlineClient(callback);
        }
    ], function(err, results) {
        if (err) {
            res.redirect('/scheduleErr');
        } else {
            console.info(results[1]);
            var clients = JSON.parse(results[1]);
            res.render('schedule/scheduleClient', {user: req.session.user, menu: results[0], clients: clients});
        }

    });
}); 
};