var express = require('express');
var router = express.Router();

var Promise = require('../lib/promise');
var ValiantError = require('../lib/error');

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
    User.find(function(error, documents) {
        if (error) {
            result.status(404).json(error);
        } else {
            result.status(200).json(documents);
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
            
            User.register(user, u.password, function(error, document) {
                if (error) {
                    reject(error);
                } else {
                    resolve(document);
                }
            })            
        });
    }))
    .then(function(documents) {
        result.status(201).json(documents);
    })
    .catch(function(error) {
        result.status(400).json(ValiantError.fromMongooseError(error).toObject());
    });
});

router.route('/:userId')
.get(function(request, result) {
    
})
.put(function(request, result) {
    
})
.delete(function(request, result) {
    
})

module.exports = router;
