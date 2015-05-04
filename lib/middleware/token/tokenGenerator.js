
var cid   = require('node-uuid');
var jwt   = require('jsonwebtoken');
var props = require('properties-parser').read('./lib/middleware/token/config/jwttoken.properties');

module.exports = function(profile, callback) {
    var date = new Date();
    if(profile.value) {
        return callback(null, jwt.sign({user:profile.value.user.email, fullprofile:profile.value.user, jtuc: cid.v4(), date: date},
            props.jwtsecret, { expiresInMinutes: props.jwtexpirytime }, { algorithm: 'RS256'}));
    } else {
        return callback(null, jwt.sign({user:profile.user.email, fullprofile:profile.user, jtuc: cid.v4(), date: date},
            props.jwtsecret, { expiresInMinutes: props.jwtexpirytime }, { algorithm: 'RS256'}));
    }
}
