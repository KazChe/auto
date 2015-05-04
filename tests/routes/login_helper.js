var superagent = require('superagent');
var agent = superagent.agent();
var theAccount = {
    "username": "newmobiamdin@quisk.co",
    "password": "Password1"
};

exports.login = function (request, done) {
    request
        .post('/ap/welcome')
        .send(theAccount)
        .end(function (err, res) {
            if (err) {
                throw err;
            }
            agent.saveCookies(res);
            done(agent);
        });
};
