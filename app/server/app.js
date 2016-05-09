global.__base = __dirname + '/';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var hostnameMiddleware = require('./lib/hostname');
var ajaxMiddleware = require(__base + 'lib/ajax');

var Responder = require(__base + 'lib/responder');

var ejs = require('ejs');

var fs = require('fs');
var mime = require('mime');

var passport = require('passport');
var expressSession = require('express-session');

var indexRoute = require('./routes/index');
var loginRoute = require('./routes/login');
var logoutRoute = require('./routes/logout');
var verifyRoute = require('./routes/verify');
var userRoute = require('./routes/users');
var s3Route = require('./routes/s3');

var UserModel = require('./models/user/user');

var app = express();
var appConfig = require('./config/config');

var connectDb = require('./db/connect');
var connectSessionStore = require('./db/session');

var s3Init = require(__base + 'lib/s3');

var activeVariable = 'VALIANT_IS_ACTIVE';
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
        
    app.use(hostnameMiddleware());
    app.use(ajaxMiddleware());
    
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    
    app.use(expressSession({
                                secret: sessionSecret,
                                resave: true, 
                                saveUninitialized: true,
                                store: connectSessionStore()
                           }));
    
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(UserModel.createStrategy());

    passport.serializeUser(UserModel.serializeUser());
    passport.deserializeUser(UserModel.deserializeUser());

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
    
    app.use(['/login', '/logout', '/api'], function(request, result, next) {
        if (false === request.isAjax) {
            result.status(406).json({error: "API endpoints need to accept json output and be requested by AJAX"})            
        } else {
            next();
        } 
    });

    app.use('/', indexRoute);
    
    app.use('/redirect', function(request, result, next) {
        result.render('redirect');
    });
    
    app.use('/login', loginRoute);
    app.use('/logout', logoutRoute);
    
    app.use('/verify', verifyRoute);
    
    app.use('/api/users', userRoute);
    app.use('/api/s3', s3Route);
    
    app.use(function(request, result, next) {
       if (request.isAjax) {
           Responder.withErrorMessage(result, 404, "Route not found!");
       } else {
           result.status(404);
           result.render('error', {message: "Route not found!"});
       }
    });

    // Initialize s3
    
    s3Init();

    // Connect to our database

    connectDb();
}

module.exports = app;
