var mongoose = require('mongoose');

//tokens.[i].type is either 'access' or 'refresh'
//TODO make mongoose validate this

var UserSchema = new mongoose.Schema({
    uid:   String,
    tokens: [{ type: String, token: String }]
});

mongoose.model('User', UserSchema);

module.exports = mongoose;