var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var passportLocalMongooseEmail = require('passport-local-mongoose-email');
var userEmailAuthentication = require('./plugins/user/email_auth');
var userMethods = require('./plugins/user/methods');

var UserLoginService = require('../lib/user_login');

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

User.plugin(userMethods);

User.plugin(passportLocalMongooseEmail, {
    usernameField: 'email',
    userEmailUnverifiedError: UserLoginService.emailUnverifiedErrorString,
    incorrectPasswordError: UserLoginService.incorrectPasswordErrorString,
    incorrectUsernameError: UserLoginService.incorrectUsernameErrorString    
});

User.plugin(userEmailAuthentication);

module.exports = mongoose.model('User', User);