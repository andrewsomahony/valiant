var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var passportLocalMongooseEmail = require('passport-local-mongoose-email');

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

User.plugin(passportLocalMongooseEmail, {
    usernameField: 'email',
    userEmailUnverifiedError: UserLoginService.emailUnverifiedErrorString,
    incorrectPasswordError: UserLoginService.incorrectPasswordErrorString,
    incorrectUsernameError: UserLoginService.incorrectUsernameErrorString    
});

/*
    options.incorrectPasswordError = options.incorrectPasswordError || 'Incorrect password';
    options.incorrectUsernameError = options.incorrectUsernameError || 'Incorrect username';
    options.missingUsernameError = options.missingUsernameError || 'Field %s is not set';
    options.missingPasswordError = options.missingPasswordError || 'Password argument not set!';
    options.userEmailUnverifiedError = options.userEmailUnverifiedError || 'User did not verify email!';
    options.userExistsError = options.userExistsError || 'User already exists with name %s';
    options.noSaltValueStoredError = options.noSaltValueStoredError || 'Authentication not possible. No salt value stored in mongodb collection!';

*/ 

module.exports = mongoose.model('User', User);