var mysql = require('mysql');
var config = require('../../config.json');

var pool = mysql.createPool(config.mysql);

module.exports = pool;