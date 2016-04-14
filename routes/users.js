var express = require('express');
var router = express.Router();

var Promise = require('../lib/promise');
var Responder = require('../lib/responder');

var User = require('../models/user');

var Q = require('q');

/*
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
    },
    is_connected_to_facebook: {
        type: Boolean,
        default: false
    }
*/

router.route('/')
.get(function(request, result) {
    console.log(request.user);
    User.find(function(error, documents) {
        if (error) {
            Responder.withMongooseError(result, 400, error);
        } else {
            Responder(result, 200, documents);
        }
    });
})
.post(function(request, result) {
    var usersArray = request.body.users;
    
    Q.all(usersArray.map(function(u) {
        return Promise(function(resolve, reject, notify) {
            var user = new User({
                email: u.email,
                first_name: u.first_name,
                last_name: u.last_name,
                profile_picture_url: u.profile_picture_url,
                questions: [],
                facebook_id: u.facebook_id,
                is_connected_to_facebook: u.is_connected_to_facebook
            });
            
            user.save(function(error, document) {
                if (error) {
                    reject(error);
                } else {
                    resolve(document);
                }
            })        
        });
    }))
    .then(function(documents) {
        Responder(result, 201, documents);
    })
    .catch(function(error) {
        Responder.withMongooseError(result, 400, error);
    });
})
.delete(function(request, result) {
    Responder.methodNotAllowed(result);
});

router.route('/register')
.get(function(request, result) {
    Responder.methodNotAllowed(result);
})
.post(function(request, result) {
    var u = request.body.user;
    
    var user = new User({
        email: u.email,
        first_name: u.first_name,
        last_name: u.last_name,
        profile_picture_url: u.profile_picture_url,
        questions: [],
        facebook_id: u.facebook_id,
        is_connected_to_facebook: u.is_connected_to_facebook
    });
    
    User.register(user, u.password, function(error, newUser) {
        if (error) {
            Responder.withError(result, 400, error.message);
        } else {
            Responder(result, 201, newUser);
        }
    });
})
.delete(function(request, result) {
    Responder.methodNotAllowed(result);
});

router.route('/:userId')
.get(function(request, result) {
    Responder.methodNotAllowed(result);
})
.put(function(request, result) {
    Responder.methodNotAllowed(result);
})
.delete(function(request, result) {
    Responder.methodNotAllowed(result);
})

module.exports = router;
