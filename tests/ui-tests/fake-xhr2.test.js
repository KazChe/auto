var jsdom = require('mocha-jsdom');
var expect = require('chai').expect;

describe('mocha tests', function () {

    var $;
    jsdom();

    before(function () {
        $ = require('jquery');
    });

    it('works', function () {
        document.body.innerHTML = "<div>hola</div>";
        expect($("div").html()).eql("hola");
    });

});
