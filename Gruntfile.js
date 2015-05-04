module.exports = function(grunt) {

    // measures1 the time each task takes
    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);
    var path = require('path')
    // load grunt config - under grunt folder
    require('load-grunt-config')(grunt, {
        init: true, //auto grunt.initConfig
        data: { //data passed into config.  Can use with <%= test %>
            test: false,
            env: function(){
                var _env = grunt.option('env')
                if(_env) {
                    return _env;
                } else {
                    _env = grunt.config.set('env', 'localhost')
                    return _env;
                }

            }
        }
    });
};