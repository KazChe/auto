var assert = require('assert'),
    Browser = require('zombie'),
    should = require('should'),
    browser = new Browser(),
    app = require('../../app'),
    server;

before(function(done) {
    server = app.listen(3000, done);
    console.log('starting own app')
});
after(function(done) {
    server.close(done);
});
    describe('Login Page', function() {
        it('should load the login page', function(done) {
            browser.visit("http://localhost:3000/ap/adminportal", function() {
                assert.ok(browser.success, 'page loaded');
                done();
            });
        });

        it('Title should be Admin Portal', function(done) {
            var title = browser.evaluate("document.title");
            title.should.equal('Admin Portal')
            done();
        });

        it('Successful login should return a token in response header', function(done) {
            browser.fill("email", "newmobiadmin@quisk.co").fill("password", "Password1").pressButton("Login", browser.waitForServer(function(window) {
                console.log('title:: ', browser.evaluate("document.title"))
                done();
            }));

            });
    });
