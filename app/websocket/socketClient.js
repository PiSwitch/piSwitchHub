var request = require('request');
var io = require('socket.io-client');
var config = require('../../config.json');

module.exports = function (app) {

    var client = io(config.masterServerUrl, { autoConnect: false });
    var token = '';

    client.on('connect', function () {
        console.info('Connected!');
        client.emit('authenticate', {token: token});
    });
    client.on('disconnect', function () {
        console.info('Disconnected!');
        refreshToken();
    });

    client.on('bad token', function (msg) {
        console.warn('Bad token! Refreshing...');
        token = '';
    });

    this.getIo = function () {
        return client;
    };

    this.refreshToken = function() {
        console.info('Refreshing token...');
        if (token) {
            client.open();
            return;
        }

        var options = {
            host: config.apiUrl,
            path: '/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new'
        };

        //TODO: Save the user email and password somewhere instead of hardcoding in the config file
        var formData = {
            form: {
                email: config.email,
                password: config.password
            }
        };

        //TODO: Move the token logic in its own module
        request.post(config.apiUrl + 'authenticate', formData, function (err, httpResponse, body) {
            if (err) {
                throw err;
            }
            body = JSON.parse(body);
            if (body.success && body.token) {
                token = body.token;
                client.open();
            } else {
                console.error('Could not authenticate');
            }
        });
    };

    return this;
};