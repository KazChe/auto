
var jsonwebtoken = require('jsonwebtoken');
var validator = require('validator');
var props = require('properties-parser').read('./config/messages/messages.properties');

module.exports = {
    inputsToValidate: 4,
    results : {},
    _trim: function(item) {return item.trim();},
    validateEmail: function(item) {
        var _email = this._trim(item);
        if(validator.isLength(_email,1)) { // TODO: in far far future we can make length configurable
            _email = validator.escape(_email);
            return this.results.email = validator.isEmail(_email);
        } else {
            this.results.email = 'empty_input';
        }
    },
    validatePhone: function(item) {
        var _phone = item.replace(/ /g,'');
        if(validator.isLength(_phone, 1)) { // TODO: in far far future we can make this configurable
            return this.results.phone = validator.isNumeric(_phone);
            //return this.results.error = validator.isNumeric(_phone);
        } else {
            this.results.phone = 'empty_input'
        }
    },
    validateFLname: function(item, qualifier) {
        var _name = this._trim(item);
        if(validator.isLength(_name, 1)) {
            _name = validator.escape(_name)
            return this.results[qualifier] = validator.isAlpha(_name);
        } else {
            this.results[qualifier] = 'empty_input'
        }
    },
    validateEntityIds: function(item, res) {
        var _fiNameSubmitted = this._trim(item);
        //TODO: decode token
        var profileEntityIds = jsonwebtoken.decode(res._headers.token).fullprofile.entityIds;
        var entityNames = profileEntityIds.map(function(a){ return a.entityName });
        var entityNameFoundInProfile = false;
        function logArrayElements(element, index, array) {
            if(_fiNameSubmitted == element || _fiNameSubmitted == 'All Financial Institutions') {
                entityNameFoundInProfile = true;
                return;
            }
            return entityNameFoundInProfile;
        }
        entityNames.forEach(logArrayElements);
        return this.results.entityId = entityNameFoundInProfile;
    },
    getResult: function() {
        var keys = Object.keys( this.results );
        var errorArray = [];
        if(keys.length == 0) { // valid input(s) were provided so this is a valid.
            return errorArray;
        }
        var empty_inputs = 0;
        for( var i = 0; i < keys.length; i++ ) {
            if(this.results[ keys[ i ] ] == 'empty_input' || this.results[ keys[ i ] ] == false) {
                ++empty_inputs;
            }
            if(! this.results[ keys[ i ] ]) {
                //errorArray.push('<div class="col-sm-3 alert alert-danger" style="text-align: center;">'+props[keys[i]]+'</div>');
                errorArray.push(props[keys[i]]);
            }
        }
        if(empty_inputs == this.inputsToValidate) { // if all inputs were empty, populate error array with appropriate message and return to caller.
            errorArray.push(props.empty_search);
            this.results = {}; // empty out internal results object before returning
            return errorArray;
        } else if(errorArray.length > 0) { // if there were any validation failures this array would be populated
            this.results = {};
            return errorArray;
        }
        this.results = {};
        return errorArray; // valid input(s) so send back an empty error array to caller.
    }
}
