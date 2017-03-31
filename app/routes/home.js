var path = require('path');
var express = require('express');
var db = require('../lib/sqlPool');

module.exports = function (app) {

    var homeRoutes = express.Router();

    homeRoutes.get('/', function(req, res){
        res.render('index')
    });
    homeRoutes.get('/test_sql', function(req, res){
        db.query('SELECT * FROM `test` ', function (error, results, fields) {
            if (error) throw error;
            res.send(results);
        });
    });

    return homeRoutes;
};
