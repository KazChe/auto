module.exports = {
    files: ['./public/**/*.js', './public/**/*.css'],
    options: {
        livereload: true,
        port: 666,
        end: false
    },
    tasks: ['concat', 'uglify', 'cssmin', 'execute']
}