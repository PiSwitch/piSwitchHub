var path = require('path');
var express = require('express');
var masterServer = require('../models/masterServer');
var setupMiddleware = require('../middlewares/setupMiddleware');
var sql = require('../lib/sqlPool');

module.exports = function (app) {

    var setupRoutes = express.Router();
    
    setupRoutes.get('/enjoy', function(req, res) {
        if(!masterServer.isSetup()) {
            return res.redirect('/setup/step_one');
        }
        if(!sql.isSetup()) {
            return res.redirect('/setup/step_two');
        }

        res.render('setup/enjoy')
    });

    setupRoutes.use(setupMiddleware.mustNotBeSetup);

    setupRoutes.get('/step_one', function(req, res) {
        if(masterServer.isSetup()) {
            return res.redirect('/setup/step_two');
        }

        res.render('setup/step_one', { errors: req.flash('formErrors') })
    });

    setupRoutes.post('/step_one', function (req, res) {
        req.checkBody('serverUrl', 'Invalid remote server').isURL();
        req.checkBody('apiUrl', 'Invalid remote api').isURL();
        req.checkBody('email', 'Invalid login email').isEmail();
        req.checkBody('password', 'Invalid password').notEmpty();

        req.sanitizeBody('serverUrl').trim();
        req.sanitizeBody('apiUrl').trim();
        req.sanitizeBody('email').trim();
        req.sanitizeBody('password').trim();

        req.sanitizeBody('email').escape();
        req.sanitizeBody('password').escape();

        var config = {
            serverUrl: req.body.serverUrl,
            apiUrl: req.body.apiUrl,
            email: req.body.email,
            password: req.body.password
        };

        var errors = req.validationErrors();
        if(errors) {
            return res.render('setup/step_one', {
                config: config,
                errors: errors
            });
        }

        masterServer.setConfig(config);
        res.redirect('/setup/step_two');
    });

    setupRoutes.get('/step_two', function(req, res) {
        if(!masterServer.isSetup()) {
            return res.redirect('/setup/step_one');
        }
        if(sql.isSetup()) {
            return res.redirect('/setup/enjoy');
        }

        res.render('setup/step_two')
    });

    setupRoutes.post('/step_two', function (req, res) {
        req.checkBody('host', 'Host is required').isURL();
        req.checkBody('user', 'User is required').notEmpty();
        req.checkBody('database', 'Database name is required').notEmpty();
        req.checkBody('connectionLimit', 'The max. simultaneous connections is required').notEmpty()
            .isInt().withMessage('The max. simultaneous connections must be an integer');

        req.sanitizeBody('host').trim();
        req.sanitizeBody('user').trim();
        req.sanitizeBody('password').trim();
        req.sanitizeBody('database').trim();
        req.sanitizeBody('connectionLimit').trim();

        req.sanitizeBody('user').escape();
        req.sanitizeBody('password').escape();
        req.sanitizeBody('database').escape();
        req.sanitizeBody('connectionLimit').escape();

        var config = {
            host: req.body.host,
            user: req.body.user,
            password: req.body.password,
            database: req.body.database,
            connectionLimit: req.body.connectionLimit
        };

        var errors = req.validationErrors();
        if(errors) {
            return res.render('setup/step_two', {
                config: config,
                errors: errors
            });
        }

        sql.setConfig(config);
        res.redirect('/setup/enjoy');
    });

    setupRoutes.post('/test_sql', function(req, res) {
        req.sanitizeBody('host').trim();
        req.sanitizeBody('user').trim();
        req.sanitizeBody('password').trim();
        req.sanitizeBody('database').trim();

        req.sanitizeBody('user').escape();
        req.sanitizeBody('password').escape();
        req.sanitizeBody('database').escape();


        sql.testConnection(req.body.host, req.body.user, req.body.password, req.body.host.database, function(error, success) {
            res.json({
                success: success,
                error: error
            });
        });
    });

    return setupRoutes;
};
