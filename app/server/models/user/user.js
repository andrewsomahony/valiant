var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var passportLocalMongooseEmail = require('passport-local-mongoose-email');
var extendedPassportLocalMongooseEmail = require('./plugins/authenticate');
var userEmailAuthentication = require('./plugins/email_auth');
var userResetPassword = require('./plugins/reset_password');
var userMethods = require('./plugins/methods');
var userPendingEmailAuthentication = require('./plugins/pending_email_auth');
var userChangePassword = require('./plugins/change_password');

var patchPlugin = require('mongoose-json-patch');

var UserLoginService = require(__base + 'lib/user_login');

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
    is_visible_to_public: {
        type: Boolean,
        default: true
    },
    is_visible_to_users: {
        type: Boolean,
        default: true
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

var userOptions = {
    usernameField: 'email',
    userEmailUnverifiedError: UserLoginService.emailUnverifiedErrorString,
    incorrectPasswordError: UserLoginService.incorrectPasswordErrorString,
    incorrectUsernameError: UserLoginService.incorrectUsernameErrorString    
};

User.plugin(passportLocalMongooseEmail, userOptions);

// We extend the passportLocalMongooseEmail strategy because
// it doesn't return the user object if the e-mail is unverified,
// which I think is incorrect behavior.

User.plugin(extendedPassportLocalMongooseEmail, userOptions);

User.plugin(userEmailAuthentication, userOptions);
User.plugin(userPendingEmailAuthentication, userOptions);
User.plugin(userResetPassword, userOptions);
User.plugin(userChangePassword, userOptions);

User.plugin(patchPlugin);

module.exports = mongoose.model('User', User);