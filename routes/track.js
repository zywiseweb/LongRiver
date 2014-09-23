var async = require('async'); //流程控制
var role = require('../system_modules/role/role');
exports.route = function(app, ensureAuthenticated) {


    app.get('/track', ensureAuthenticated, function(req, res) {
        async.parallel([
            function(callback) {
                role.getMenu(req.path, req.session.role, callback);
            }
        ], function(err, results) {
            res.render('track/trackChart', {user: req.session.user, menu: results[0]});
        });
    });
    
    
    
};