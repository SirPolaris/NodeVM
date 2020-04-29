/**
 * Simple Logger Mockup.
 * Replace with a lib or roll our own.
 */

var logger = {
    log: function(output) {
        console.log(Date.now() +': ' + output);      
    }
}

module.exports = logger;