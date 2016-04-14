var express = require('express');
var router = express.Router();

var Promise = require('../lib/promise');
var Responder = require('../lib/responder');

var User = require('../models/user');

var Q = require('q');

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
.put(function(request, result) {
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
            // !!! This could either be a BadRequestError
            // !!! or a Mongoose error.
            
            if (error.name && 'BadRequestError' === error.name) {
                Responder.withErrorObject(result, 400, error);
            } else {
                Responder.withMongooseError(result, 400, error);
            }
        } else {
            newUser.sendAuthenticationEmail(function(error, u) {
                if (error) {
                    Responder.withErrorObject(result, 400, error);
                } else {
                    Responder(result, 201, u.unregisteredInformationObject());
                }
            });
            
        }
    });
})
.delete(function(request, result) {
    Responder.methodNotAllowed(result);
});

router.route('/verify')
.get(function(request, result) {
    //request.query.authToken;
    // Redirect to the home page so we run the front-end
    // code, which will look for the email_verified param
    // and redirect accordingly.
    
    //result.redirect('/?email_verified=true');
})
.put(function(request, result) {
    Responder.methodNotAllowed(result);
})
.post(function(request, result) {
    Responder.methodNotAllowed(result);
})
.delete(function(request, result) {
    Responder.methodNotAllowed(result);
});

router.route('/resend_email')
.get(function(request, result) {
    //request.query.emailToken
})
.put(function(request, result) {
    Responder.methodNotAllowed(result);
})
.post(function(request, result) {
    Responder.methodNotAllowed(result);
})
.delete(function(request, result) {
    Responder.methodNotAllowed(result);
});

router.route('/:userId')
.get(function(request, result) {
    Responder.methodNotAllowed(result);
})
.post(function(request, result) {
    Responder.methodNotAllowed(result);
})
.put(function(request, result) {
    Responder.methodNotAllowed(result);
})
.delete(function(request, result) {
    Responder.methodNotAllowed(result);
});

module.exports = router;
