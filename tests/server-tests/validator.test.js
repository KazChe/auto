var async = require('async');
var ahSearchValidator = require('../../lib/helpers/validation/account_holder_search');
var should = require('should');
var props = require('properties-parser').read('./config/messages/messages.properties');


var invalidEmail = 'aj.quisk.co'
var validEmail = 'aj@quisk.co'
var validFname = 'kaz'
var invalidFname = '<script>alert("xss bff")</script>'
var validPhone = '1234567890';
var invalidPhone = '1234567U90';
var invalidPhone_with_spaces = '12 3456 6790';
var phone_empty = '';
var email_empty = '';
var fname_empty = '';
var lname_empty = '';

describe('ah search input validator', function () {
    it('should return false for invalid email ' + invalidEmail, function (done) {
        ahSearchValidator.validateEmail(invalidEmail).should.be.false;
        done();
    })
    it('should return true for valid email ' + validEmail, function (done) {
        ahSearchValidator.validateEmail(validEmail).should.be.true;
        done();
    })
    it('should return false for invalid fname ' + invalidFname, function (done) {
        ahSearchValidator.validateFLname(invalidFname, 'fname').should.be.false;
        done();
    })
    it('should return false for valid fname ' + validFname, function (done) {
        ahSearchValidator.validateFLname(validFname, 'fname').should.be.true;
        done();
    })
    it('should return false for valid phone ' + validPhone, function (done) {
        ahSearchValidator.validatePhone(validPhone).should.be.true;
        done()
    });
    it('should return false for invalid phone (alphanumeric)' + invalidPhone, function (done) {
        ahSearchValidator.validatePhone(invalidPhone).should.be.false;
        done();
    })
    it('should return true for invalid phone (with spaces)' + invalidPhone_with_spaces, function (done) {
        ahSearchValidator.validatePhone(invalidPhone_with_spaces).should.be.true;
        done();
    })
    it('should return "Mobile Number is invalid" for invalid phone ' + invalidPhone, function (done) {
        ahSearchValidator.validatePhone(invalidPhone);
        should.equal(ahSearchValidator.getResult(), props.phone);
        done()
    })
})

