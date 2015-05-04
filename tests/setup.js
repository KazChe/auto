// Export modules to global scope as necessary (only for testing)
if (typeof process !== 'undefined' && process.title === 'node') {
  console.log(' We are in node. Require modules.');
  expect = require('chai').expect;
  sinon = require('sinon');
  //num = require('..');
  isBrowser = false;
} else {
    console.log('// We are in the browser. Set up variables like above using served js files.');
  expect = require('chai').expect;
  isBrowser = true;
}
