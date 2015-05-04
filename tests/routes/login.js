var request = require('supertest')
    , express = require('express')
    , superagent  = require('superagent');

//var app = express();
var app = require('../../app')

//app.get('/login', function(req, res){
//    res.status(200).send({ name: 'tobi' });
//});

describe('GET login page', function(){
    it('respond with json', function(done){
        request(app)
            .get('/ap/adminportal')
            .expect('Content-Type', /text\/html/)
            .expect(200, done);
    })
})

describe('POST login', function(){
    it('respond with json', function(done){
        request(app)
            .post('/ap/welcome')
            .expect('Content-Type', /text\/html/)
            .expect(200)
            .end(function(err, response){
                should.not.exist(err);
                parse(response);
                done();
            })
    })
})
