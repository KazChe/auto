module.exports = function(grunt, options) {
    config = require("../config/" + options.env() + "");
    console.log('#### Manipulating CSS/JS source code for ' + options.env() + ' environment. ####')
    return {
        'signinx': {
            src: ['./build/js/signinx.js'],
            actions: [
                {
                    name: 'kaz',
                    search: '<!--kaz-->[\\\s\\\S]*?<!--endkaz-->',
                    replace: config.modalConfig.productionJS,
                    flags: 'g'
                },
                {
                    name: 'signinCSS',
                    search: '<!--signinCSS-->',
                    replace: config.modalConfig.singinCSS,
                    flags: 'g'
                },
                {
                    name: 'quiskLogo',
                    search: '<!--quiskLogo-->',
                    replace: config.modalConfig.quiskLogo,
                    flags: 'g'
                }
            ]
        },
        'formSubmit': {
            src: ['./build/js/formSubmit.js'],
            actions: [
                {
                    name: 'vtURL',
                    search: 'vtURL',
                    replace: config.modalConfig.vtURL,
                    flags: 'g'
                },
                {
                    name: 'authURL',
                    search: 'authURL',
                    replace: config.modalConfig.authURL,
                    flags: 'g'
                }
                ]
        }
    }
}