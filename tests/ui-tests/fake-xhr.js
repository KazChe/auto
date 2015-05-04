sinon = require('sinon');
var jsdom = require('mocha-jsdom');
var expect = require('chai').expect;

describe('fake servers', function () {
    var $;
    jsdom();
    jsdom.defaultDocumentFeatures = {
        FetchExternalResources   : ['../../public/components/dust/dust-full.js'],
        ProcessExternalResources : ['../../public/components/dust/dust-full.js'],
        MutationEvents           : false,
        QuerySelector            : false
    };
    beforeEach(function () {
        $ = require('jquery');
        // Set up a fake server (calls `sinon.useFakeXMLHttpRequest()`)
        this.server = sinon.fakeServer.create();
    });

    afterEach(function () {
        // Create a spy to record server responses.
        var spy = sinon.spy();
        // Request with jQuery
        $.get('/foo/bar/baz').always(spy);
        // MAKE SURE YOU CALL `server.respond()`!
        this.server.respond();
        // Make assertions, onces again, everything is synchronous.
        expect(spy).to.be.calledOnce;
        //expect(spy).to.be.calledWith('FooBarBaz!');
        // Restore native functionality.
        this.server.restore();
    });

    it('should fake server responses (basic response)', function () {
        this.server.respondWith('FooBarBaz!');
    });
})
