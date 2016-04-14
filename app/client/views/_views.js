angular.module("valiant.views", []).run(["$templateCache", function($templateCache) {$templateCache.put("admin.html","<div class=\"container admin\">\n    <div class=\"row\">\n        <div ui-view=\"header\" class=\"header\"></div>\n    </div>\n    <div class=\"row\">\n        <div ui-view=\"content\" class=\"content\"></div>\n    </div>\n    <div class=\"row\">\n        <div ui-view=\"footer\" class=\"footer\"></div>\n    </div>\n</div>");
$templateCache.put("main.html","<div class=\"container-fluid main\">\n    <div class=\"row\">\n        <div class=\"top-bar col-xs-12 col-md-12 col-lg-12\" ui-view=\"top_bar\"></div>\n    </div>\n    \n    <div class=\"mobile-scroll\" style=\"height:100%;\">\n      <div class=\"mobile-container\">\n         <div class=\"row\">\n            <div ui-view=\"header\" class=\"header\"></div>\n         </div>    \n         \n         <div class=\"row\">\n            <div class=\"col-lg-12 col-md-12 col-sm-12 hidden-xs large-header-padding\" style=\"height: 64px;\"></div>\n            <div class=\"hidden-lg hidden-md hidden-sm col-xs-12 mobile-header-padding\" style=\"height: 16px;\"></div>\n         </div>\n         \n         <div class=\"main-content\">\n            <div class=\"row\">\n               <div class=\"mobile-ad-space hidden-lg hidden-md hidden-sm col-xs-12\" style=\"text-align: center;padding-bottom:16px;\">\n                  <img src=\"./images/temp_mobile_ad.png\" />\n               </div>\n            </div>\n            \n            <div class=\"row row-eq-height\" style=\"height: 100%;\">\n                  <div class=\"content-padding col-md-1 col-lg-1 col-sm-1 hidden-xs\"></div>\n                  <div ui-view=\"content\" class=\"content col-md-9 col-lg-9 col-sm-9 col-xs-12\" style=\"min-height:100%;\"></div>\n                  <div ui-view=\"ad_space_right\" class=\"ad-space col-lg-2 col-sm-2 col-md-2 hidden-xs\" style=\"min-height:100%;\">\n                     <div class=\"ad\">\n                        <img src=\"./images/temp_ad.png\" />\n                     </div>\n                     <div class=\"copyright\">\n                        Andrew O\'Mahony (c) 2016\n                     </div>\n                  </div>\n            </div>\n         </div>\n      </div>\n    </div>\n</div>");
$templateCache.put("directives/facebook_button.html","<span class=\"facebook-button\" ng-if=\"facebookIsReady()\">\n    <button ng-if=\"!isLoggedIn() && !isLoggedIntoFacebook()\" ng-click=\"loginToFacebook()\">Login with Facebook</button>\n    <button ng-if=\"isLoggedIn() && !isLoggedIntoFacebook()\" ng-click=\"connectToFacebook()\">Connect to Facebook</button>\n    <button ng-if=\"isLoggedIn() && isLoggedIntoFacebook()\" ng-click=\"disconnectFromFacebook()\">Disconnect with Facebook</button>\n</span>");
$templateCache.put("modals/partials/error_modal.html","<div class=\"error-modal\">\n    <span class=\"error-modal-message\" ng-bind=errorMessage></span>\n</div>");
$templateCache.put("partials/admin/footer.html","<span class=\"logout-link\"><a>Logout</a></span>");
$templateCache.put("partials/admin/header.html","<div>Valiant Athletics Admin Page</div>\n");
$templateCache.put("partials/main/header.html","<div class=\"col-md-7 col-xs-12\">\n<div><a ui-sref=\"main.page.home.default\">Valiant Athletics</a></div>\n</div>\n\n<div class=\"col-md-5 col-xs-12\">\n    <div class=\"nav-bar\" ui-view=\"nav_bar\"></div>\n</div>\n");
$templateCache.put("partials/main/nav_bar.html","<nav>\n    <a class=\"link\" ui-sref=\"main.page.about.default\">About</a>\n    <a class=\"link\" ui-sref=\"main.page.blog.default\">Blog</a>\n    <a class=\"link\" ui-sref=\"main.page.coaching.default\">Coaching</a>\n    <a class=\"link\" ui-sref=\"main.page.contact.default\">Contact</a>\n</nav>");
$templateCache.put("partials/main/top_bar.html","<div class=\"social-links\"></div>\n\n<div class=\"user-details\">\n   <div class=\"login-buttons\" ng-if=\"false === isLoggedIn()\">\n      <a class=\"login-button\" ui-sref=\"main.page.login.default\">Login</a>\n      <a class=\"login-button\" ui-sref=\"main.page.register.default\">Register</a>\n   </div>\n</div>");
$templateCache.put("partials/admin/home/content.html","<span class=\"admin-text\">This is the admin page!</span>");
$templateCache.put("partials/admin/home/home.html","<div class=\"home\">\n    <div ui-view=\"content\" class=\"content\"></div>\n</div>");
$templateCache.put("partials/main/about/about.html","<div class=\"about\">\n    <div ui-view=\"content\" class=\"sub-content\"></div>\n</div>");
$templateCache.put("partials/main/about/content.html","<span class=\"about-text\">This is about my love for my Beautiful <span ng-bind=\"name\"></span>.</span>\n\n<button ng-click=\"onTestRequestClick()\">Test HTTP</button>\n\n<facebook-button></facebook-button>\n\n<div>\n<img src=\"./images/temp_image.jpg\" />\n</div>\n\n<div>\n<img src=\"./images/temp_image.jpg\" />\n</div>\n<div>\n<img src=\"./images/temp_image.jpg\" />\n</div>\n<div>\n<img src=\"./images/temp_image.jpg\" />\n</div>\n<div>\n<img src=\"./images/temp_image.jpg\" />\n</div>\n<div>\n<img src=\"./images/temp_image.jpg\" />\n</div>\n<div>\n<img src=\"./images/temp_image.jpg\" />\n</div>\n<div>\n<img src=\"./images/temp_image.jpg\" />\n</div>\n<div>\n<img src=\"./images/temp_image.jpg\" />\n</div>\n<div>\n<img src=\"./images/temp_image.jpg\" />\n</div>\n<div>\n<img src=\"./images/temp_image.jpg\" />\n</div>\n<div>\n<img src=\"./images/temp_image.jpg\" />\n</div>\n<div>\n<img src=\"./images/temp_image.jpg\" />\n</div>\n<div>\n<img src=\"./images/temp_image.jpg\" />\n</div>\n");
$templateCache.put("partials/main/home/content.html","<span class=\"home-text\">This is the main page!</span>");
$templateCache.put("partials/main/home/home.html","<div class=\"home\">\n    <div ui-view=\"content\" class=\"sub-content\"></div>\n</div>");
$templateCache.put("partials/main/login/content.html","<div class=\"col-lg-6 col-md-6 col-sm-6 col-xs-12\">\n   <form>\n      <div class=\"form-group\">\n         <label for=\"login_email\">E-Mail Address</label>\n         <input type=\"text\" class=\"form-control\" name=\"login_email\" autocomplete=\"none\" autocorrect=\"none\" autocapitalize=\"none\" ng-model=\"loginInformation.email\" />\n      </div>\n      \n      <div class=\"form-group\">  \n         <label for=\"login_password\">Password</label>\n         <input type=\"password\" class=\"form-control\" name=\"login_password\" autocomplete=\"none\" autocorrect=\"none\" autocapitalize=\"none\" ng-model=\"loginInformation.password\" />\n      </div>\n      \n      <div class=\"form-group\">\n         <button ng-click=\"login()\">Login</button>\n      </div>\n   </form>\n</div>\n\n");
$templateCache.put("partials/main/login/login.html","<div class=\"login\">\n   <div ui-view=\"content\" class=\"sub-content\"></div>\n</div>");
$templateCache.put("partials/main/login/unverified.html","<div class=\"row\" ng-if=\"null !== getCurrentUnverifiedUser()\">\n   <div class=\"col-lg-12 col-md-12 col-sm-12 col-xs-12\">\n      <p>\n         Hello <span ng-bind=\"getEmailAddress()\"></span>!\n      </p>\n      <p>\n         It appears you haven\'t verified your account.\n      </p>\n      <p>\n         We sent a link to your e-mail address, all you need to do\n         is click it.\n      </p>\n      <p>\n         Didn\'t get an e-mail?  Click <a>here</a> to resend it.  Make\n         sure to check your spam folder if it isn\'t in your main inbox.\n      </p>\n   </div>\n</div>\n\n<div class=\"row\" ng-if=\"null === getCurrentUnverifiedUser()\">\n   <div class=\"col-lg-12 col-md-12 col-sm-12 col-xs-12\" style=\"text-align:center;\">\n      <p>\n         It appears that you navigated here by accident.\n      </p>\n      <p>\n         Click <a ui-sref=\"main.page.home.default\">here</a> to go back to the homepage</a>\n      </p>\n   </div>\n</div>\n");
$templateCache.put("partials/main/register/content.html","<div class=\"col-lg-6 col-md-6 col-sm-6 col-xs-12\">\n   <form>\n      <div class=\"form-group\">\n         <label for=\"registration_email\">E-Mail Address</label>\n         <input type=\"text\" class=\"form-control\" name=\"registration_email\" ng-model=\"registrationInformation.email\" />\n      </div>\n      \n      <div class=\"form-group\">  \n         <label for=\"registration_password\">Password</label>\n         <input type=\"password\" class=\"form-control\" name=\"registration_password\" ng-model=\"registrationInformation.password\" />\n      </div>\n      \n      <div class=\"form-group\">\n         <label for=\"registration_password_repeat\">Repeat Password</label>\n         <input type=\"password\" class=\"form-control\" name=\"registration_password_repeat\" ng-model=\"registrationInformation.repeat_password\" />\n      </div>\n      \n      <div class=\"form-group\">  \n         <label for=\"registration_first_name\">First Name</label>\n         <input type=\"text\" class=\"form-control\" name=\"registration_first_name\" ng-model=\"registrationInformation.first_name\" />\n      </div>\n      \n      <div class=\"form-group\"> \n         <label for=\"registration_last_name\">Last Name</label>\n         <input type=\"text\" class=\"form-control\" name=\"registration_last_name\" ng-model=\"registrationInformation.last_name\" /> \n      </div>\n      \n      <div class=\"form-group\">\n         <button ng-click=\"registerUser()\">Sign Up</button>\n      </div>\n   </form>\n</div>");
$templateCache.put("partials/main/register/register.html","<div class=\"register\">\n   <div ui-view=\"content\" class=\"sub-content\"></div>\n</div>");
$templateCache.put("partials/main/register/success.html","<div class=\"row\" ng-if=\"null !== getCurrentUnverifiedUser()\">\n   <div class=\"col-lg-12 col-md-12 col-sm-12 col-xs-12\">\n      <p>\n         Hello <span ng-bind=\"getEmailAddress()\"></span>!\n      </p>\n      <p>\n         We have sent a link to your e-mail address, all you need to do\n         is click it, and you\'re good to go!\n      </p>\n      <p>\n         Didn\'t get an e-mail?  Click <a>here</a> to resend it.  Make\n         sure to check your spam folder if it isn\'t in your main inbox.\n      </p>\n   </div>\n</div>\n\n<div class=\"row\" ng-if=\"null === getCurrentUnverifiedUser()\">\n   <div class=\"col-lg-12 col-md-12 col-sm-12 col-xs-12\" style=\"text-align:center;\">\n      <p>\n         It appears that you navigated here by accident.\n      </p>\n      <p>\n         Click <a ui-sref=\"main.page.home.default\">here</a> to go back to the homepage</a>\n      </p>\n   </div>\n</div>\n");}]);