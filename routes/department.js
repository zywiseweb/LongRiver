
var async = require('async'); //流程控制

var role = require('../system_modules/role/role');
var departmentManager = require('../system_modules/department/department');

exports.route = function(app, ensureAuthenticated) {
    
app.get('/department', ensureAuthenticated, function(req, res) {
    async.parallel([
        function(callback) {
            role.getMenu(req.path, req.session.role, callback);
        },
        function(callback) {
            departmentManager.findDepartment({}, callback);
        }
    ], function(err, results) {
        res.render('system/department', {user: req.session.user, menu: results[0], department: results[1]});
    });
});
app.post('/departmentSave', ensureAuthenticated, function(req, res) {
    var department = req.body.department;
    departmentManager.updateDepartment(department, function(err) {
        if (err) {
            res.send(err);
        } else {
            res.send('200');
        }
    });
    return;
});
};