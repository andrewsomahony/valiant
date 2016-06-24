'use strict';

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

var NotificationSchema = require(__base + 'db/schemas/notification/notification');

var PictureSchema = require(__base + 'db/schemas/picture/picture');

var QuestionModel = require(__base + 'db/models/question/question');
var WorkoutModel = require(__base + 'db/models/workout/workout');

var UserSchema = new Schema({
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
    profile_picture: PictureSchema,
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
        type: [{
                 type: Schema.Types.ObjectId, 
                 ref: 'Question' 
              }],
        default: []
    },
    workouts: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Workout'
        }],
        default: []
    },
    notifications: {
        type: [NotificationSchema],
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

UserSchema.plugin(userMethods);

var userOptions = {
    usernameField: 'email',
    userEmailUnverifiedError: UserLoginService.emailUnverifiedErrorString,
    incorrectPasswordError: UserLoginService.incorrectPasswordErrorString,
    incorrectUsernameError: UserLoginService.incorrectUsernameErrorString    
};

UserSchema.plugin(passportLocalMongooseEmail, userOptions);

// We extend the passportLocalMongooseEmail strategy because
// it doesn't return the user object if the e-mail is unverified,
// which I think is incorrect behavior.

UserSchema.plugin(extendedPassportLocalMongooseEmail, userOptions);

UserSchema.plugin(userEmailAuthentication, userOptions);
UserSchema.plugin(userPendingEmailAuthentication, userOptions);
UserSchema.plugin(userResetPassword, userOptions);
UserSchema.plugin(userChangePassword, userOptions);

UserSchema.plugin(patchPlugin);

module.exports = UserSchema;