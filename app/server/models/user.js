var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var passportLocalMongooseEmail = require('passport-local-mongoose-email');

var User = new Schema({
    email: {
        type: String,
        required: true
    },
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
    notifications: {
        type: Array,
        default: []
    },
    facebook_id: {
        type: String,
        default: ""
    },
    is_connected_to_facebook: {
        type: Boolean,
        default: false
    }
},
{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

User.plugin(passportLocalMongooseEmail, {
    usernameField: 'email'
});

module.exports = mongoose.model('User', User);