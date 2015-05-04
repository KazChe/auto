// module to run custom task which replaces references to css and js to point to production ready resources
module.exports = {

    execute: {
        target: {
            src: ['./grunt/replaceWithProductionJS.js']
        }
    }
}