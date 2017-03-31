var config = require('./config.json');
var app = require('express')();
var http = require('http').Server(app);
var socketClient = require('./app/websocket/socketClient')();
var homeRoutes = require('./app/routes/home')();

app.use('/', homeRoutes);

http.listen(config.port, config.hostname, function(){
    var hostname = config.hostname ? config.hostname : '*';
    console.info('listening on ' + hostname + ':' + http.address().port);
    socketClient.refreshToken();
});

