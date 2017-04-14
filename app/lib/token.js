var request = require('request');
var config = require('../../config.json');

var token = '';
var exports = {};

exports.get = function() {
    return token;
}

exports.refresh = function(callback) {
    //TODO: Save the user email and password somewhere instead of hardcoding in the config file
    var formData = {
        form: {
            email: config.email,
            password: config.password
        }
    };

    request.post(config.apiUrl + 'authenticate', formData, function (error, httpResponse, body) {
        if (error) {
            return callback(error);
        }
        body = JSON.parse(body);
        if (body.success && body.token) {
            token = body.token;
            return callback();
        } else {
            console.error('Could not authenticate');
            return callback('bad credentials');
        }
    });
}

module.exports = exports;