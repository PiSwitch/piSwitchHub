var fs = require('fs');
var jsonfile = require('jsonfile');
var request = require('request');

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

exports.testConnection = function(serverUrl, apiUrl, email, password, callback) {
    var version = require('../../package.json').version;

    if(serverUrl[serverUrl.length - 1] != '/') {
        serverUrl += '/';
    }
    if(apiUrl[apiUrl.length - 1] != '/') {
        apiUrl += '/';
    }

    var formData = {
        form: {
            email: email,
            password: password,
            version: version
        }
    };

    var errors = [];

    //TODO: Also test the websocket url

    request.post(apiUrl + 'test_setup', formData, function (error, httpResponse, body) {
        if (error) {
            errors.push({'apiUrl': 'Could not connect to the Portal Api. Please check if the Url is correct and try again later'});
        }
        else {
            try {
                body = JSON.parse(body);
            } catch (ex) {
                errors.push({'apiUrl': 'The Portal API Url is incorrect.'});
            }

            if(!body.isCompatible) {
                errors.push({'apiUrl': 'Your hub version is not supported. You are using version ' + version + '. ' +
                    'The portal is using version ' + body.portalVersion + ' and only supports versions between ' + body.supportedVersions.minVersion + ' and ' + body.supportedVersions.maxVersion + '.'});
            }
            if(!body.credentialCorrect) {
                errors.push({'password': 'Your username or password is incorrect.'});
            }
        }

        return callback(errors, !errors.length);
    });
};