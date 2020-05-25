var mongoose = require('mongoose');
var mongoose = require('Application');
var Schema = mongoose.Schema;

/**
 * This is the embodiment of a VM
 * 
 * reference: https://zellwk.com/blog/mongoose-population/
 * For information on how to pull back the sub document data referenced in app
 */

var VM = new Schema({
    display_name: {type: String},
    owner: {type: String, unique: true, required: true},
    created: {type: Date, default: Date.now},
    os_type: {type: String},
    sql_type: {type: String},
    apps : [{ type: Schema.Types.ObjectId, ref: 'Application' }]

});

module.exports = mongoose.model('VM', VM);