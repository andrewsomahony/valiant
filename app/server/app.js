var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var ejs = require('ejs');

var fs = require('fs');
var mime = require('mime');

var passport = require('passport');

var indexRoute = require('./routes/index');
var loginRoute = require('./routes/login');
var userRoute = require('./routes/users');

var UserModel = require('./models/user');

var app = express();
var appConfig = require('./config/config');

var connectDb = require('./db/connect');

var activeVariable = 'EL_THATIS_SATURN';
var appIsActive = true;

var sessionSecret = 'A_BIT_OFTHE OLD ULTRAVIOLENCE';

try {
    if (!eval(appConfig.secure(activeVariable))) {
        appIsActive = false;
    }
} catch (e) {
    appIsActive = false;
}

if (false === appIsActive) {
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');

    app.disable('view cache');
    
    app.use('/', function(request, result, next) {
        result.render('inactive');
    });
    
} else {
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');

    app.disable('view cache');

    // uncomment after placing your favicon in /public
    //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    
    app.use(express.session({secret: sessionSecret}));
    
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(User.createStrategy());

    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());

    // Static Assets

    app.use(['/*.js', '/*.css'], function(request, result, next) {
        if (request.acceptsEncodings(['gzip'])) {
            var compressedVersion = __dirname + '/public' + request.originalUrl + ".gz";
            try {
                fs.accessSync(compressedVersion, fs.R_OK);
                request.url += '.gz';
                
                result.header('Content-Encoding', 'gzip');
                result.header('Content-Type', mime.lookup(path.extname(request.originalUrl)));
            } catch(error) {
                
            }
        }
        
        result.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        result.header('Expires', '-1');
        result.header('Pragma', 'no-cache');
        
        next();
    });

    app.use(express.static(path.join(__dirname, 'public')));

    app.use('/', function(request, result, next) {
        result.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        result.header('Expires', '-1');
        result.header('Pragma', 'no-cache');
        next();
    })

    app.use('/', indexRoute);
    
    app.use('/login', loginRoute);
    
    app.use('/api', function(request, result, next) {
        if (!request.accepts('json') ||
            !request.xhr) {
            // Error
            result.status(406).json({error: "API endpoints need to accept json output and be requested by AJAX"})
        }
        else {
            next();
        }
    });
    
    app.use('/api/users', userRoute);

/*
    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message
        });
    });*/

    // Connect to our database

    connectDb();
}

module.exports = app;
