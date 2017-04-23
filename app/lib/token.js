var request = require('request');
var masterServer = require('../models/masterServer');
var exports = {};
module.exports = exports;

var token = '';

exports.get = function() {
    return token;
};

exports.refresh = function(callback) {
    var serverData = masterServer.get();

    var formData = {
        form: {
            email: serverData.email,
            password: serverData.password
        }
    };
    request.post(serverData.apiUrl + 'authenticate', formData, function (error, httpResponse, body) {
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
};
