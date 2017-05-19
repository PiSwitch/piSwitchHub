var fs = require('fs');
var jsonfile = require('jsonfile');
var exports = {};
module.exports = exports;

const CONFIG_FILE_PATH = __dirname  + '/../../masterServerConfig.json';

var masterServerConfig;

function load() {
    if(fs.existsSync(CONFIG_FILE_PATH)) {
        masterServerConfig = jsonfile.readFileSync(CONFIG_FILE_PATH);
    }
    else {
        masterServerConfig = {
            serverUrl: '',
            apiUrl: '',
            email: '',
            password: ''
        };
        exports.setConfig(masterServerConfig);
    }
}

exports.setConfig = function (config) {
    masterServerConfig = config;
    jsonfile.writeFileSync(CONFIG_FILE_PATH, masterServerConfig, {spaces: 2});
};

exports.get = function () {
    if(!masterServerConfig) {
        load();
    }

    return masterServerConfig;
};

exports.isSetup = function () {
    var config = exports.get();
    return config.serverUrl && config.apiUrl && config.email && config.password;
};