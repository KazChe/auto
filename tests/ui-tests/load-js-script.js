var jsdom = require('jsdom');

jsdom.defaultDocumentFeatures = {
    FetchExternalResources   : ['../../public/components/dust/dust-full.js'],
    ProcessExternalResources : ['../../public/components/dust/dust-full.js'],
    MutationEvents           : '2.0',
    QuerySelector            : false
};

var htmlDoc = '<html lang="en-US">' +
    'head>' +
    '<title>Test document</title>' +
    '<script>' +
    'var testVar = true;' +
    '</script>' +
    '<script src=\'http://code.jquery.com/jquery-latest.js\'></script>' +
    '<script>' +
    '</script>' +
    '</head>' +
    '<body id="mainPage">' +
    '</body>' +
    '</html>';

var document = jsdom.jsdom(htmlDoc);

var window = document.parentWindow;

var elementsArray = window.document.getElementsByTagName('script');

console.log(elementsArray.length);
console.log(jsdom.defaultDocumentFeatures.FetchExternalResources[0].render() );
window.addEventListener('load', function () {
    console.log(typeof window.$ == 'function');
    window.close();
});
