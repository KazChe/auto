var jsonwebtoken = require('jsonwebtoken');
//var props = require('properties-parser').read('./lib/middleware/token/config/jwttoken.properties');
var props = require('properties-parser').read('./config/jwttoken.properties');

module.exports = function validation(socket, next, req, res) {
    var token = socket.handshake.query.token;
    jsonwebtoken.verify(token, props.jwtsecret, function (err, data) {
        if (err) {
            console.log(err.name);
            next(new Error(err.name));
            //next();
            // TODO: in caseof this error client MUST 1)remove saved token from its 'local' storage. Otherwise websokcet keeps sending the old one.
            // TODO 2) client-side logik to redirect to login page.
        } else {
            next();
        }
    });
}


