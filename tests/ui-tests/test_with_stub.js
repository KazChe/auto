var assert = require('assert'),
    Browser = require('zombie'),
    should = require('should'),
    browser = new Browser(),
    app = require('../../app'),
    sinon = require('sinon'),
    server;

before(function (done) {
    server = app.listen(3000, done);
    console.log('starting own app');
    this.xhr = sinon.useFakeXMLHttpRequest();
    var requests = this.requests = [];

    this.xhr.onCreate = function (xhr) {
        requests.push(xhr);
    }
});
after(function (done) {
    this.xhr.restore();
    server.close(done);
});

describe('api tests normally involving network calls', function () {
    it("should fetch comments from server", function () {
        var callback = sinon.spy();
        myLib.getCommentsFor("/some/article", callback);
        assertEquals(1, this.requests.length);

        this.requests[0].respond(200, {"Content-Type": "application/json"},
            '[{ "id": 12, "comment": "Hey there" }]');
        expect(callback.calledWith([{id: 12, comment: "Hey there"}])).to.be.true;
    });

});
