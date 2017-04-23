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
            serverUrl: 'http://example.org:3000/',
            apiUrl: 'http://example.org:3000/api/',
            email: 'UserEmail@example.org',
            password: 'PasswordPlainText'
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