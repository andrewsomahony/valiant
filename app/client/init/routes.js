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
          "top_bar@main": {
              templateUrl: "partials/main/top_bar.html"
          },
          "header@main": {
            templateUrl: "partials/main/header.html"
         },
         "content@main": {
             templateUrl: "partials/main/home/home.html",
             controller: require('../components/controllers/main/home/home')
         },
         /*"footer@main": {
            templateUrl: "partials/main/footer.html"
         } */ 
       }               
   })
   .state("main.home.default", {
       resolve: RouteResolver("main.home.default"),
       url: "",
       views: {
         "nav_bar@main.home": {
             templateUrl: "partials/main/nav_bar.html"
         },
         "content@main.home": {
            templateUrl: "partials/main/home/content.html",
            controller: require('../components/controllers/main/home/default'),
         },
      }      
   })
   
   .state("main.about", {
       url: "about",
       abstract: true,
       views: {
          "top_bar@main": {
              templateUrl: "partials/main/top_bar.html"
          },           
          "header@main": {
            templateUrl: "partials/main/header.html"
         },
         "content@main": {
             templateUrl: "partials/main/about/about.html",
             controller: require('../components/controllers/main/about/about')
         },
         /*"footer@main": {
            templateUrl: "partials/main/footer.html"
         }*/      
       } 
   })
   
   .state("main.about.default", {
       url: "",
       resolve: RouteResolver("main.about.default"),
       views: {
         "nav_bar@main.about": {
             templateUrl: "partials/main/nav_bar.html"
         },           
         "content@main.about": {
             templateUrl: "partials/main/about/content.html",
             controller: require('../components/controllers/main/about/default')
         },       
       }       
   })
   
   $stateProvider.state("admin", {
       url: "/admin",
       abstract: true,
       templateUrl: "admin.html"
   })
   
   .state("admin.home", {
       url: "",
       abstract: true,
       views: {
           "header@admin": {
               templateUrl: "partials/admin/header.html"  
           },
           "content@admin": {
               templateUrl: "partials/admin/home/home.html"
           },
           "footer@admin": {
               templateUrl: "partials/admin/footer.html"
           }
       }
   })
   .state("admin.home.default", {
       url: "",
       resolve: RouteResolver("admin.home.default"),
       views: {
           "content@admin.home": {
               templateUrl: "partials/admin/home/content.html"
           }
       }
   })
}]);