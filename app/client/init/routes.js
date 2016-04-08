'use strict';

var app = require('./app');

function RouteResolver(state) {
    return {
        resolvedState: ['services.data_resolver', '$stateParams',
                        function(DataResolverService, $stateParams) {
                            return DataResolverService(state, $stateParams);
                        }]
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
   
   .state("main.page", {
       url: "",
       abstract: true,
       views: {
          "top_bar@main": {
              templateUrl: "partials/main/top_bar.html",
              controller: require('controllers/main/top_bar')
          },
          "header@main": {
            templateUrl: "partials/main/header.html"
         },
       }
   })
   
   .state("main.page.home", {
      url: "",
      abstract: true, 
       views: {
         "content@main": {
             templateUrl: "partials/main/home/home.html",
             controller: require('controllers/main/home/home')
         }
       }               
   })
   .state("main.page.home.default", {
       resolve: RouteResolver("main.page.home.default"),
       url: "",
       views: {
         "nav_bar@main.page": {
             templateUrl: "partials/main/nav_bar.html"
         },
         "content@main.page.home": {
            templateUrl: "partials/main/home/content.html",
            controller: require('controllers/main/home/default'),
         },
      }      
   })
   
   .state("main.page.about", {
       url: "about",
       abstract: true,
       views: {
         "content@main": {
             templateUrl: "partials/main/about/about.html",
             controller: require('controllers/main/about/about')
         }    
       } 
   })
   
   .state("main.page.about.default", {
       url: "",
       resolve: RouteResolver("main.page.about.default"),
       views: {
         "nav_bar@main.page": {
             templateUrl: "partials/main/nav_bar.html"
         },           
         "content@main.page.about": {
             templateUrl: "partials/main/about/content.html",
             controller: require('controllers/main/about/default')
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