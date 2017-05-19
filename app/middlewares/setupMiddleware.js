exports = {};
var masterServer = require('../models/masterServer');

//route middleware to make sure that the app has been setup
exports.mustBeSetup = function(req, res, next) {
    //TODO: Write condition to check if the setup was done
    if (!masterServer.isSetup() && false)
        return next();
    res.redirect('/setup/step_one')
};


module.exports = exports;