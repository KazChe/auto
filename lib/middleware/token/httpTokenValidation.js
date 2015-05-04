
var jsonwebtoken = require('jsonwebtoken');
var unless = require('express-unless');
var cid    = require('node-uuid');
var props  = require('properties-parser').read('./config/jwttoken.properties');
var logger = require("../../config/logger/logger");

module.exports = function validation(req, res, next) {
    var token = (req.body && req.body.token) || (req.query && req.query.token) || req.headers.token || req.param('token');

    jsonwebtoken.verify(token, props.jwtsecret, function (err, data) {
        if (err) { // TODO: remove !
            logger.debug('(http token validator)',err);
            req.msg = err.name;
            next();
            //return handleLoginPageRedirect(req);
            // TODO: in caseof this error client MUST 1)remove saved token from its 'local' storage. Otherwise websokcet keeps sending the old one.
            // TODO 2) client-side logik to redirect to login page.
        } else {
            logger.debug('Token valid.');
            jsonwebtoken.decode(token, props.jwtsecret, function (err, data) {
                if(data.jwtc) {
                    // lookup jwtc form couchbase
                    // if valid
                         // lookup user profile data.user.email from couchbase and attach to req.user (to be used by route being called - menu etc
                         // call to tokengeneration module(data.user.email, callback)
                         // use the callbak to extract token - attach to res - line 34
                    logger.debug('generate new jwtc')
                    logger.debug('call token generation module pass the jwtc and receive a brand new token')
                    next();
                } else {
                    res.redirect('/ap/login')
                    next();
                    return;
                }
            });
            res.set('token', token)
            req.jwtc= 0;
            req.user = data.user;
            //logger.debug('passed token validation', req.jwtc)
            next();
        }
    });
    validation.unless = unless;
};


