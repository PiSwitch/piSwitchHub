var mysql = require('mysql');
var fs = require('fs');
var jsonfile = require('jsonfile');
var exports = {};
module.exports = exports;

const CONFIG_FILE_PATH = __dirname  + '/../../sqlConfig.json';

var pool;
var sqlConfig;

function loadConfig() {
    if(fs.existsSync(CONFIG_FILE_PATH)) {
        sqlConfig = jsonfile.readFileSync(CONFIG_FILE_PATH);
    }
    else {
        sqlConfig = {
            connectionLimit: 10,
            host: '',
            user: '',
            password: '',
            database: ''
        };
        exports.setConfig(sqlConfig);
    }
}

exports.getPool = function () {
    if(!pool) {
        pool = mysql.createPool(exports.getConfig());
    }
    return pool;
};

exports.setConfig = function (config) {
    sqlConfig = config;
    jsonfile.writeFileSync(CONFIG_FILE_PATH, sqlConfig, {spaces: 2});

    if(pool) {
        pool.end();
        pool = null;
    }
};

exports.getConfig = function () {
    if(!sqlConfig) {
        loadConfig();
    }

    return sqlConfig;
};

exports.isSetup = function () {
    var config = exports.getConfig();
    return config.host && config.user && config.password && config.database;
};