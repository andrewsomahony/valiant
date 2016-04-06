var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var passportLocalMongooseEmail = require('passport-local-mongoose-email');

var User = new Schema({
    first_name: {
        type: String, 
        default: ""
    },
    last_name: {
        type: String,
        default: ""
    },
    profile_picture_url: {
        type: String,
        default: ""
    },
    access_type: {
        type: String,
        default: "public"
    },
    questions: {
        type: Array,
        default: []
    },
    facebook_id: {
        type: String,
        default: ""
    }
});

User.plugin(passportLocalMongooseEmail, {
    usernameField: 'email'
});

module.exports = mongoose.model('User', User);