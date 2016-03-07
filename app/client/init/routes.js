'use strict';

var app = require('./app');

function RouteResolver(route) {
    return {
        
    };
}

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
   
   $urlRouterProvider.otherwise("/");

   // The controllers all export the name of the controller,
   // so we just have require here to get that

   $stateProvider.state('main', {
      url: "/",
      templateUrl: "main.html",
      abstract: true
   })
   
   .state("main.home", {
      url: "",
      abstract: true, 
       views: {
          "header@main": {
            templateUrl: "partials/main/header.html"
         },
         "content@main": {
             templateUrl: "partials/main/main.html",
             controller: require('../components/controllers/main/main')
         },
         "footer@main": {
            templateUrl: "partials/main/footer.html"
         }          
       }               
   })
   .state("main.home.default", {
       resolve: RouteResolver("main.home.default"),
       url: "",
       views: {
         "content@main.home": {
            templateUrl: "partials/main/content.html",
            controller: require('../components/controllers/main/default'),
         },
      }      
   })
   
   .state("main.about", {
       url: "about",
       abstract: true,
       views: {
          "header@main": {
            templateUrl: "partials/main/header.html"
         },
         "content@main": {
             templateUrl: "partials/about/about.html",
             controller: require('../components/controllers/about/about')
         },
         "footer@main": {
            templateUrl: "partials/main/footer.html"
         }          
       } 
   })
   
   .state("main.about.default", {
       url: "",
       resolve: RouteResolver("main.about.default"),
       views: {
         "content@main.about": {
             templateUrl: "partials/about/content.html",
             controller: require('../components/controllers/about/default')
         },       
       }       
   })
}]);