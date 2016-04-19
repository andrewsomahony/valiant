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
       url: "?email_verified&error",
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
   
   .state("main.page.login", {
       url: "login",
       abstract: true,
       views: {
           "content@main": {
               templateUrl: "partials/main/login/login.html",
               controller: require("controllers/main/login/login")
           }
       }
   })
   
   .state("main.page.login.default", {
       url: "/?verification_success",
       resolve: RouteResolver("main.page.login.default"),
       views: {
           "nav_bar@main.page": {
               templateUrl: "partials/main/nav_bar.html"     
           },
           "content@main.page.login": {
               templateUrl: "partials/main/login/content.html",
               controller: require("controllers/main/login/default")
           }
       }
   })
   
   .state("main.page.login.unverified", {
       url: "/unverified",
       views: {
           "nav_bar@main.page": {
               templateUrl: "partials/main/nav_bar.html"     
           },
           "content@main.page.login": {
               templateUrl: "partials/main/login/unverified.html",
               controller: require("controllers/main/login/unverified")
           }           
       }
   })
   
   .state("main.page.register", {
       url: "register",
       abstract: true,
       views: {
           "content@main": {
               templateUrl: "partials/main/register/register.html",
               controller: require("controllers/main/register/register")
           }
       }
   })
   
   .state("main.page.register.default", {
       url: "/",
       resolve: RouteResolver("main.page.register.default"),
       views: {
           "nav_bar@main.page": {
               templateUrl: "partials/main/nav_bar.html"
           },
           "content@main.page.register": {
               templateUrl: "partials/main/register/content.html",
               controller: require("controllers/main/register/default")
           }
       }
   })
   .state("main.page.register.success", {
       url: "/success",
       views: {
           "nav_bar@main.page": {
               templateUrl: "partials/main/nav_bar.html"
           },
           "content@main.page.register": {
               templateUrl: "partials/main/register/success.html",
               controller: require("controllers/main/register/success")
           }           
       }
   })
   
   .state("main.page.user", {
       url: ":userId",
       abstract: true,
       views: {
           "content@main": {
               templateUrl: "partials/main/user/user.html",
               controller: require("controllers/main/user/user")
           }
       }
   })
   .state("main.page.user.default", {
     url: "",
     views: {
         "nav_bar@main.page": {
             templateUrl: "partials/main/nav_bar.html"
         },
         "content@main.page.user": {
             templateUrl: "partials/main/user/content.html",
             controller: require("controllers/main/user/default")
         }
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