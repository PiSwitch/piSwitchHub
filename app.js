var config = require('./config.json');
var path = require('path');
var app = require('express')();
var flash = require('connect-flash');
var morgan = require('morgan');
var bodyParser   = require('body-parser');
var expressValidator = require('express-validator');
var secret = require('./app/lib/secret');
var session = require('express-session');
var http = require('http').Server(app);
var socketClient = require('./app/websocket/socketClient')();
var setupMiddleware = require('./app/middlewares/setupMiddleware');
var homeRoutes = require('./app/routes/home')();
var setup = require('./app/routes/setup')();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressValidator());
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(session({
    secret: secret.get('sessionSecret').toString(),
    resave: false,
    saveUninitialized: false
}));
app.use(flash());

// Route stuff
app.use('/setup', setup);
app.use(setupMiddleware.mustBeSetup);
app.use('/', homeRoutes);

http.listen(config.port, config.hostname, function(){
    var hostname = config.hostname ? config.hostname : '*';
    console.info('listening on ' + hostname + ':' + http.address().port);
    socketClient.connect(function(error) {
        if(error) {
            console.log('Could not connect to socket server: ' + error);
            return;
        }
        console.info('Connected to socket server.');
    });
});

