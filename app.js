

var app          = require('express')();
var server       = require('http').Server(app);
var unless       = require('express-unless');
var jwt          = require('express-jwt');// TODO: remove?
var sio          = require('socket.io')(server);
var jsonwebtoken = require('jsonwebtoken')
var router       = require('express').Router();
var socketTokenValidator = require('./lib/middleware/token/socketTokenValidation');
var httpTokenValidator   = require('./lib/middleware/token/httpTokenValidation');
var logger = require('./lib/config/logger/logger');
var config = require('./build_env_config');

var web_apps   = require('./lib/apps/');

app.use(require('express').static(__dirname + '/public', {redirect: false}));


// Middleware: Set for all response headers TODO: refactor to it own module
app.all('/*', function (req, res, next) {
    res.header("x-frame-options", "sameorigin");
    res.header("host", "ap.quisk.co");
    res.header("cache-control", "no-cache, no-store, must-revalidate");
    res.header("pragma", "no-cache");
    res.header("expires", 0);
    res.header("Content-Security-Policy", "default-src 'self'; script-src 'self' http://cdn.datatables.net; style-src 'unsafe-inline' *; font-src *; img-src *");
    next();
});

// TODO: enable  token check
httpTokenValidator.unless = unless;
app.use(httpTokenValidator.unless({path:['/adminportal','/login', '/favicon.ico','/ap/welcome']}));

app.use(function(req, res, next){
    if(req.jwtc) {
        if(req.jwtc == 0) {
            logger.info('jwtc value is valid ');
        } else {
            logger.info('jwtc is not valid');
            res.status(401);
        }
    }
    next();
})

app.use(function(req, res, next) {
    res.render('login/', {
        msg: req.msg
    });
});

// Middleware: UnauthorizedError handler
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError' || err.name === 'JsonWebTokenError') {// || err.msg === 'JsonWebTokenError' || req.msg=='TokenExpiredError') {
        logger.info('(app.js) I handled this', req.msg)
        res.redirect('/ap/adminportal');
        // TODO: in caseof UnauthorizedError error client MUST 1)remove saved token from its 'local' storage. Otherwise websokcet keeps sending the old one.
        // TODO: 2) client-side logik to redirect to login page.

    }
    next();
});

// mount app modules
app.use(web_apps);

// Starting both the http and websocket servers
//var socket = sio.listen(app.listen(3000));

server.listen(3009);
logger.info('listening on port 3009');

// websocket actions
socketTokenValidator.unless = unless;
//sio.use(socketTokenValidator);

sio.on('connection', function (socket, m) {
    logger.info('websocket server accepting socket connections ', socket.handshake.query);
    // TODO: websocket events to handled/delegated goes here
    socket.on('messagex', function(m) {
        logger.info(' >> Receive messagex from client: ', m.somekey);
    })
});

module.exports = app;
