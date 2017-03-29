var config = require('./config.json');
var app = require('express')();
var http = require('http').Server(app);
var ioServer = require('socket.io')(http);
var ioClient = require('socket.io-client')(config.masterServerUrl, { autoConnect: false });
var mysql = require('mysql');
var request = require('request');
var pool = mysql.createPool(config.mysql);

var webRoot = __dirname + '/www/';

app.get('/', function(req, res){
    res.sendFile(webRoot + 'index.html');
});
app.get('/test_sql', function(req, res){
    pool.query('SELECT * FROM `test` ', function (error, results, fields) {
        if (error) throw error;
        res.send(results);
    });
});

var token = '';

ioClient.on('connect', function(){
    console.log('Connected!');
    ioClient.emit('authenticate', {token: token});
});
ioClient.on('event', function(data){
    console.log('Event! - ' . data);
});
ioClient.on('disconnect', function(){
    console.log('Disconnected!');
    refreshToken();
});

ioClient.on('chat message', function (msg) {
    console.log(msg);
    ioServer.emit('chat message', msg);
});

ioClient.on('bad token', function (msg) {
    console.log('Bad token! Refreshing...');
    token = '';
});

refreshToken();

ioServer.on('connection', function(socket){
    console.log('a user connected');

    socket.on('chat message', function(msg){
        ioClient.emit('chat message', msg);
    });
});

http.listen(config.port, config.hostname, function(){
    var hostname = config.hostname ? config.hostname : '*';
    console.log('listening on ' + hostname + ':' + http.address().port);
});

function refreshToken() {
    console.info('Refreshing token...');
    if(token) {
        ioClient.open();
        return;
    }

    var options = {
        host: config.apiUrl,
        path: '/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new'
    };

    //TODO: Save the user email and password somewhere instead of hardcoding in the config file
    var formData = {form: {
        email: config.email,
        password: config.password
    }};
    request.post(config.apiUrl + 'authenticate', formData, function(err, httpResponse, body) {
        if(err) {
            throw err;
        }
        body = JSON.parse(body);
        if(body.success && body.token) {
            token = body.token;
            ioClient.open();
        }
    });
}