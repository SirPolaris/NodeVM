var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Sub Document referenced in vm.js
 */

var Application = new Schema({
    display_name: {type: String},
    group: {type: String},
    type: {type: String},
    version: {type: String},
    location_in_repo: {type: String},
    install_string: {type: String},
    uninstall_string: {type: String},
    compatibility: {
        os_type: [
            {type: String}
        ],
        sql_type: [
            {type: String}
        ],
    }

});

module.exports = mongoose.model('Application', Application);