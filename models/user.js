var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);
var passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
    first_name: {type: String},
    last_name: {type: String},
    username: {type: String, unique: true, required: true},
    password: {type: String},
    email: {type: String, lowercase: true, trim: true, unique: true},
    created: {type: Date, default: Date.now},
    location: {
       lat: {type: String},
       lon: {type: String},
       sdefID: {type: String},
       sdefName: {type: String}
    },
    legalSignOffs:{
       name: {type: String},
       date: {type: Date}
    }
});

Account.plugin(AutoIncrement, {inc_field: 'id'});
Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);

module.exports.getUserByUsername = function(username, callback){
    var query = {email: username};
    User.findOne(query, callback);
 }
 
 module.exports.getUserById = function(id, callback){   
    User.findById(id, callback);
 }
 
 module.exports.comparePassword = function(candidatePassword, callback){
    var query = {password: candidatePassword};
    User.findOne(query, callback);
 }