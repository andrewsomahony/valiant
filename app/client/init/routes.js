'use strict';

var app = require('./app');

function RouteResolver(state) {
    return {
        // For some reason we have to use $stateParams here
        // instead of our StateService, as our StateService $state
        // object has the old params, not the new ones.
        
        resolvedState: ['services.data_resolver', '$stateParams',
                        function(DataResolverService, $stateParams) {
                            console.log(state);
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
       url: "?email_verified&error&reset_password_token",
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
       url: "/?verification_success&verification_error&reset_password_success&requires_login",
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
       resolve: RouteResolver("main.page.login.unverified"),
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
   
   .state("main.page.login.forgot_password", {
       url: "/forgot_password",
       resolve: RouteResolver("main.page.login.forgot_password"),
       views: {
           "nav_bar@main.page": {
               templateUrl: "partials/main/nav_bar.html"
           },
           "content@main.page.login": {
               templateUrl: "partials/main/login/forgot_password.html",
               controller: require("controllers/main/login/forgot_password")
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
   
   .state("main.page.reset_password", {
       url: "reset_password",
       abstract: true,
       views: {
           "content@main": {
               templateUrl: "partials/main/reset_password/reset_password.html",
               controller: require("controllers/main/reset_password/reset_password")
           }
       }  
   })
   
   .state("main.page.reset_password.default", {
       url: "/?token",
       resolve: RouteResolver("main.page.reset_password.default"),
       views: {
           "nav_bar@main.page": {
               templateUrl: "partials/main/nav_bar.html"
           },
           "content@main.page.reset_password": {
               templateUrl: "partials/main/reset_password/content.html",
               controller: require("controllers/main/reset_password/default")
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
     url: "/",
     resolve: RouteResolver("main.page.user.default"),
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