var config = require('./config.json');
var path = require('path');
var app = require('express')();
var flash = require('connect-flash');
var morgan = require('morgan');
var bodyParser   = require('body-parser');
var http = require('http').Server(app);
var socketClient = require('./app/websocket/socketClient')();
var homeRoutes = require('./app/routes/home')();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(flash());

// Route stuff
app.use('/', homeRoutes);

http.listen(config.port, config.hostname, function(){
    var hostname = config.hostname ? config.hostname : '*';
    console.info('listening on ' + hostname + ':' + http.address().port);
    socketClient.refreshToken();
});

