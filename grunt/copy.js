module.exports = {
    build: {
        files: [
            // includes files within path
            {expand: true, cwd: '', src: ['./src/**/*.js'], dest: './build/js', filter: 'isFile', flatten: true},
            {expand: true, cwd: '', src: ['./src/**/*.css'], dest: './build/css', filter: 'isFile', flatten: true}
        ]
    },
    replaced: {
        files: [
            // includes files within path
            {expand: true, cwd: '', src: ['./build/js/signinx.js'], dest: './public/js', filter: 'isFile', flatten: true},
        ]
    }
}