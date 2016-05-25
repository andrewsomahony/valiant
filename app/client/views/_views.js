angular.module("valiant.views", []).run(["$templateCache", function($templateCache) {$templateCache.put("admin.html","<div class=\"container admin\">\n    <div class=\"row\">\n        <div ui-view=\"header\" class=\"header\"></div>\n    </div>\n    <div class=\"row\">\n        <div ui-view=\"content\" class=\"content\"></div>\n    </div>\n    <div class=\"row\">\n        <div ui-view=\"footer\" class=\"footer\"></div>\n    </div>\n</div>");
$templateCache.put("main.html","<div class=\"container-fluid main\">\n    <div class=\"row\">\n        <div class=\"top-bar col-xs-12 col-md-12 col-lg-12\" ui-view=\"top_bar\"></div>\n    </div>\n    \n    <div class=\"mobile-scroll\" style=\"height:100%;\">\n      <div class=\"mobile-container\">\n         <div class=\"row\">\n            <div ui-view=\"header\" class=\"header\"></div>\n         </div>    \n         \n         <div class=\"row\">\n            <div class=\"col-lg-12 col-md-12 col-sm-12 hidden-xs large-header-padding\" style=\"height: 64px;\"></div>\n            <div class=\"hidden-lg hidden-md hidden-sm col-xs-12 mobile-header-padding\" style=\"height: 16px;\"></div>\n         </div>\n         \n         <div class=\"main-content\">\n            <div class=\"row\">\n               <div class=\"mobile-ad-space hidden-lg hidden-md hidden-sm col-xs-12\">\n                  <img src=\"./images/temp_mobile_ad.png\" />\n               </div>\n            </div>\n            \n            <div class=\"row row-eq-height\" style=\"height: 100%;\">\n                  <!--<div class=\"content-padding col-md-1 col-lg-1 col-sm-1 hidden-xs\"></div>-->\n                  <div ui-view=\"content\" class=\"content col-md-9 col-lg-9 col-sm-9 col-xs-12\" style=\"min-height:100%;\"></div>\n                  <div ui-view=\"ad_space_right\" class=\"ad-space col-lg-3 col-sm-3 col-md-3 hidden-xs\" style=\"min-height:100%;\">\n                     <div class=\"ad-container\">\n                        <div class=\"ad\">\n                            <img src=\"./images/temp_ad1.jpg\" />\n                        </div>\n                        <div class=\"ad ad1\">\n                            <img src=\"./images/temp_ad2.png\" />\n                        </div>\n                     </div>\n                     <div class=\"copyright\">\n                        Andrew O\'Mahony (c) 2016\n                     </div>\n                  </div>\n            </div>\n         </div>\n      </div>\n    </div>\n</div>");
$templateCache.put("directives/facebook_button.html","<span class=\"facebook-button\" ng-if=\"facebookIsReady()\">\n    <button ng-if=\"!isLoggedIn() && !isLoggedIntoFacebook()\" ng-click=\"loginToFacebook()\">Login with Facebook</button>\n    <button ng-if=\"isLoggedIn() && !isLoggedIntoFacebook()\" ng-click=\"connectToFacebook()\">Connect to Facebook</button>\n    <button ng-if=\"isLoggedIn() && isLoggedIntoFacebook()\" ng-click=\"disconnectFromFacebook()\">Disconnect with Facebook</button>\n</span>");
$templateCache.put("directives/media_picker.html","<div class=\"media-picker\">\n   <div ng-if=\"isPicture()\">\n      <picture-media-picker></picture-media-picker>\n   </div>\n   <div ng-if=\"isVideo()\">\n      <video-media-picker></video-media-picker>\n   </div>\n   \n   <div ng-if=\"isYoutube()\">\n      <youtube-media-picker></youtube-media-picker>\n   </div>\n</div>");
$templateCache.put("directives/picture_media_picker.html","<div class=\"no-media\" \n     ng-if=\"!model.url\" \n     ng-style=\"getRootNoMediaDivStyle()\"\n     ng-click=\"activatePicturePicker()\">\n   <div class=\"icon-container\">\n      <span></span>\n      <i class=\"fa fa-picture-o fa-5x\"></i>\n   </div>   \n</div>\n\n<div class=\"has-media\" ng-if=\"model.url\" ng-style=\"getHasMediaDivStyle()\">\n   <div class=\"picture-container\">\n      <div class=\"picture-container-image\">\n         <img ng-src=\"{{model.url}}\" ng-style=\"getHasMediaImageStyle()\" />\n      </div> \n      <div class=\"picture-container-options\">\n         <div class=\"picture-container-option-description\">\n            <input class=\"form-control\" \n                   ng-model=\"model.description\"\n                   placeholder=\"Quick Description\" />\n         </div>\n         <div>\n            <span class=\"picture-container-option-left\">\n               <a ng-click=\"activatePicturePicker()\">Change</a>\n            </span>\n            <span class=\"picture-container-option-right\">\n               <a ng-click=\"deletePicture()\">Delete</a>\n            </span>\n         </div>\n      </div>\n   </div>\n\n</div>\n\n<file-reader\n   supports-multiple=\"false\"\n   accept=\"image/*\"\n   process-exif=\"true\"\n   is-active=\"picturePickerIsActive\"\n   on-files-added=\"onPictureSelectSuccess(files)\"\n   on-files-progress=\"onPictureSelectProgress(progress)\"\n   on-files-error=\"onPictureSelectError(error)\">\n</file-reader> ");
$templateCache.put("directives/profile_picture.html","<div class=\"profile-picture\" ng-style=\"getDivStyle()\">\n   <img ng-src=\"{{getUrl()}}\" ng-style=\"getImageStyle()\" />\n   \n   <div overlay></div>\n   <!--\n   <div style=\"background-color:#FFFFFF;opacity:0.7;right:0px;width:100%;height:100%;margin-right:0px;top:0;position:absolute;\"></div>\n   -->\n</div>");
$templateCache.put("directives/video_media_picker.html","<div class=\"no-media\" ng-if=\"!model.url\" ng-style=\"getRootNoMediaDivStyle()\">\n   <div class=\"icon-container\">\n      <span></span>\n      <i class=\"fa fa-video-camera fa-5x\"></i>\n   </div>   \n</div>");
$templateCache.put("directives/youtube_media_picker.html","<div class=\"no-media\" ng-if=\"!model.url\" ng-style=\"getRootNoMediaDivStyle()\">\n   <div class=\"icon-container\">\n      <span></span>\n      <i class=\"fa fa-youtube fa-5x\"></i>\n   </div>   \n</div>");
$templateCache.put("messages/registration.html","<span class=\"form-error\" ng-message=\"required\">Required</span>\n<span class=\"form-error\" ng-message=\"email\">Invalid format</span>\n<span class=\"form-error\" ng-message=\"emailInUse\">Already in use</span>\n<span class=\"form-error\" ng-message=\"required\">Required</span>\n<span class=\"form-error\" ng-message=\"minlength\">Not long enough</span>\n<span class=\"form-error\" ng-message=\"compareTo\">Passwords must match!</span>\n");
$templateCache.put("modals/partials/error_modal.html","<div class=\"error-modal\">\n    <span class=\"error-modal-message\" ng-bind=\"errorMessage\"></span>\n</div>");
$templateCache.put("partials/admin/footer.html","<span class=\"logout-link\"><a>Logout</a></span>");
$templateCache.put("partials/admin/header.html","<div>Valiant Athletics Admin Page</div>\n");
$templateCache.put("partials/main/header.html","<div class=\"col-md-7 col-xs-12\">\n<div><a ui-sref=\"main.page.home.default\">Valiant Athletics</a></div>\n</div>\n\n<div class=\"col-md-5 col-xs-12\">\n    <div class=\"nav-bar\" ui-view=\"nav_bar\"></div>\n</div>\n");
$templateCache.put("partials/main/nav_bar.html","<nav>\n    <a class=\"link\" ui-sref=\"main.page.about.default\">About</a>\n    <a class=\"link\" ui-sref=\"main.page.blog.default\">Blog</a>\n    <a class=\"link\" ui-sref=\"main.page.question.ask\">Coaching</a>\n    <a class=\"link\" ui-sref=\"main.page.contact.default\">Contact</a>\n</nav>");
$templateCache.put("partials/main/top_bar.html","<div class=\"social-links\"></div>\n\n<div class=\"user-details\">\n   <div class=\"login-info\">\n      <div ng-if=\"false === isLoggedIn()\">\n         <a class=\"login-button\" ui-sref=\"main.page.login.default\">\n            <span>Login</span>\n         </a>\n      </div>\n      \n      <div ng-if=\"true === isLoggedIn()\">\n         <a class=\"profile-name-and-picture\"\n            ui-sref=\"main.page.user.default({userId: getUserId()})\">\n            <span class=\"profile-picture-mini\">\n               <profile-picture user=\"getLoggedInUser()\" width=\"18px\"></profile-picture>\n            </span>\n            <span class=\"login-name\" ng-bind=\"getFirstName()\"></span>\n         </a>\n         <a class=\"login-button\" ng-click=\"logout()\">\n            <span>Logout</span>\n         </a>\n      </div>\n   </div>\n</div>");
$templateCache.put("partials/admin/home/content.html","<span class=\"admin-text\">This is the admin page!</span>");
$templateCache.put("partials/admin/home/home.html","<div class=\"home\">\n    <div ui-view=\"content\" class=\"content\"></div>\n</div>");
$templateCache.put("partials/main/about/about.html","<div class=\"about\">\n    <div ui-view=\"content\" class=\"sub-content\"></div>\n</div>");
$templateCache.put("partials/main/about/content.html","<span class=\"about-text\">This is about my love for my Beautiful <span ng-bind=\"name\"></span>.</span>\n\n<button ng-click=\"onTestRequestClick()\">Test HTTP</button>\n\n<div loading-progress \n   type=\"pie\" \n   color=\"black\" \n   width=\"50px\"\n   progress-object=\"testProgressModel\"\n   style=\"display: inline-block;\">\n</div>\n\n<div>\n<img src=\"./images/temp_image.jpg\" />\n</div>\n\n<div>\n<img src=\"./images/temp_image.jpg\" />\n</div>\n<div>\n<img src=\"./images/temp_image.jpg\" />\n</div>\n<div>\n<img src=\"./images/temp_image.jpg\" />\n</div>\n<div>\n<img src=\"./images/temp_image.jpg\" />\n</div>\n<div>\n<img src=\"./images/temp_image.jpg\" />\n</div>\n<div>\n<img src=\"./images/temp_image.jpg\" />\n</div>\n<div>\n<img src=\"./images/temp_image.jpg\" />\n</div>\n<div>\n<img src=\"./images/temp_image.jpg\" />\n</div>\n<div>\n<img src=\"./images/temp_image.jpg\" />\n</div>\n<div>\n<img src=\"./images/temp_image.jpg\" />\n</div>\n<div>\n<img src=\"./images/temp_image.jpg\" />\n</div>\n<div>\n<img src=\"./images/temp_image.jpg\" />\n</div>\n<div>\n<img src=\"./images/temp_image.jpg\" />\n</div>\n");
$templateCache.put("partials/main/home/content.html","<span class=\"home-text\">This is the main page!</span>");
$templateCache.put("partials/main/home/home.html","<div class=\"home\">\n    <div ui-view=\"content\" class=\"sub-content\"></div>\n</div>");
$templateCache.put("partials/main/login/content.html","<div class=\"col-lg-6 col-md-6 col-sm-6 col-xs-12\">\n   <div class=\"status-message\" \n         ng-if=\"statusMessage()\"\n         ng-bind=\"statusMessage()\"></div>\n   <div class=\"login-form\">\n      <form>\n            <div class=\"form-group\">\n            <label for=\"login_email\">E-Mail Address</label>\n            <input type=\"text\" class=\"form-control\" name=\"login_email\" autocomplete=\"none\" autocorrect=\"none\" autocapitalize=\"none\" ng-model=\"loginInformation.email\" />\n            </div>\n            \n            <div class=\"form-group\">  \n            <label for=\"login_password\">Password</label>\n            <input type=\"password\" class=\"form-control\" name=\"login_password\" autocomplete=\"none\" autocorrect=\"none\" autocapitalize=\"none\" ng-model=\"loginInformation.password\" />\n            </div>\n            \n            <div class=\"form-group\">\n            <button ng-click=\"login()\">Login</button>\n            </div>\n      </form>\n   </div>\n   <div class=\"login-links\">\n      <a ui-sref=\"main.page.login.forgot_password\">Forgot your password?</a>\n      <a ui-sref=\"main.page.register.default\">Create a new Account</a>\n   </div>\n</div>\n\n");
$templateCache.put("partials/main/login/forgot_password.html","<div class=\"col-lg-6 col-md-6 col-sm-6 col-xs-12\">\n   <form name=\"forgotPasswordForm\">\n      <div class=\"form-group\"\n         ng-class=\"{ \'has-error\': forgotPasswordForm.forgot_password_email.$touched && forgotPasswordForm.forgot_password_email.$invalid }\">\n         <label for=\"forgot_password_email\">\n            <span>E-Mail Address</span>\n         </label>\n         <input type=\"email\" \n               class=\"form-control\" \n               name=\"forgot_password_email\" \n               ng-model=\"formData.emailAddress\"\n               required />\n      </div>\n      \n      <div class=\"form-group\" ng-if=\"!isRequestingNewPassword\">\n         <button ng-disabled=\"forgotPasswordForm.$invalid\" ng-click=\"requestNewPassword()\">\n            Request New Password\n         </button>\n      </div>\n      \n      <div class=\"requesting-in-progress\" ng-if=\"isRequestingNewPassword\">\n         <span><div loading-progress type=\"spinner\"></div></span>\n         <span class=\"requesting-text\">Requesting new password...</span>\n      </div>\n   </form>\n   \n   <div ng-if=\"hasRequestedNewPassword\">\n      An e-mail has been sent to this e-mail address.  Please click the link within it to\n      get a new password.\n   </div>\n</div>");
$templateCache.put("partials/main/login/login.html","<div class=\"login\">\n   <div ui-view=\"content\" class=\"sub-content\"></div>\n</div>");
$templateCache.put("partials/main/login/unverified.html","<div class=\"row\" ng-if=\"null !== getCurrentUnverifiedUser()\">\n   <div class=\"col-lg-12 col-md-12 col-sm-12 col-xs-12\">\n      <p>\n         Hello <span ng-bind=\"getEmailAddress()\"></span>!\n      </p>\n      <p>\n         You just need to verify your account now.\n      </p>\n      <p>\n         We have sent a link to your e-mail address, all you need to do\n         is click it, and you\'re good to go!\n      </p>\n      <p>\n         Didn\'t get an e-mail?  Click <a ng-click=\"resendVerificationEmail()\">here</a> to resend it.  Make\n         sure to check your spam folder if it isn\'t in your main inbox.\n      </p>\n\n      <div ng-if=\"isSendingEmail\" class=\"resending-in-progress\">\n         <span>\n            <div loading-progress type=\"spinner\">\n            </div>\n         </span>\n         <span class=\"resending-text\">\n            Resending E-Mail...\n         </span>\n      </div>\n      \n      <p ng-if=\"hasSentEmail\">\n         E-Mail sent successfully!\n      </p>\n\n   </div>\n</div>\n\n<div class=\"row\" ng-if=\"null === getCurrentUnverifiedUser()\">\n   <div class=\"col-lg-12 col-md-12 col-sm-12 col-xs-12\" style=\"text-align:center;\">\n      <p>\n         It appears that you navigated here by accident.\n      </p>\n      <p>\n         Click <a ui-sref=\"main.page.home.default\">here</a> to go back to the homepage</a>\n      </p>\n   </div>\n</div>\n");
$templateCache.put("partials/main/question/ask.html","<div class=\"ask-content\">\n   <div class=\"ask-topic ask-group\">\n      <div class=\"ask-header\">\n         What\'s your question about?\n      </div>\n      <div class=\"ask-element\">\n         <label class=\"dropdown\">\n            <select ng-model=\"currentQuestion.topic\" \n                  ng-options=\"name for name in questionTopicOptions\">\n            </select>\n         </label>\n      </div>\n      <div class=\"ask-element ask-sub-header ask-or\">\n         or\n      </div>\n      <div>\n         <input type=\"text\" class=\"form-control\" placeholder=\"Tell me\" ng-model=\"currentQuestion.custom_topic\" />\n      </div>\n   </div>\n   \n   <div class=\"ask-question ask-group\">\n      <div class=\"ask-question-header ask-header\">\n         What\'s your question?\n      </div>\n      <div class=\"ask-sub-header ask-question-details\">\n         (Use as much detail as you like)\n      </div>\n      \n      <textarea class=\"form-control\"\n                ng-model=\"currentQuestion.text\"></textarea>\n   </div>\n   \n   <div class=\"ask-media ask-group\">\n      <div class=\"ask-header ask-media-header\">\n         Any photos or videos?\n      </div>\n      <div class=\"ask-sub-header\">\n         (If video upload fails, use the Youtube button below)\n      </div>\n      \n      <div class=\"media-picker-container-row\">\n        <div class=\"media-picker-container\" ng-repeat=\"videoModel in currentQuestion.videos\">\n            <media-picker \n                    type=\"video\" \n                    model=\"videoModel\"\n                    width=\"150px\"\n                    height=\"150px\">\n            </media-picker>\n        </div>\n        \n        <div class=\"media-picker-container\">\n            <media-picker \n                    type=\"youtube\" \n                    model=\"currentQuestion.youtube_video\"\n                    width=\"150px\"\n                    height=\"150px\">\n            </media-picker>\n        </div>\n      </div>\n      \n      <div class=\"media-picker-container-row\">\n        <div class=\"media-picker-container\" ng-repeat=\"pictureModel in currentQuestion.pictures\">\n            <media-picker \n                    type=\"picture\" \n                    model=\"pictureModel\"\n                    width=\"150px\"\n                    height=\"150px\">\n            </media-picker>\n        </div>\n      </div>\n   </div>  \n   \n   <div class=\"ask-submit\">\n      <button>Ask Question</button>\n   </div>\n</div>\n");
$templateCache.put("partials/main/question/content.html","This is the question view page!");
$templateCache.put("partials/main/question/question.html","<div class=\"question\">\n   <div ui-view=\"content\" class=\"sub-content\"></div>\n</div>");
$templateCache.put("partials/main/register/content.html","<div class=\"registration-form\">\n   <form name=\"registrationForm\">\n\n      <div class=\"col-lg-6 col-md-6 col-sm-6 col-xs-12\">\n         <div class=\"profile-picture-input\">\n            <div class=\"profile-picture-display\">\n               <div class=\"hidden-xs\">\n                  <profile-picture \n                        user=\"registrationUser\"\n                        width=\"80%\">\n                  </profile_picture>\n               </div>\n               <div class=\"hidden-lg hidden-md hidden-sm\">\n                  <profile-picture \n                        user=\"registrationUser\"\n                        width=\"70%\">\n                  </profile_picture>\n               </div> \n            </div>\n            \n            <div class=\"profile-picture-button\">\n               <a class=\"profile-picture-link change\" ng-click=\"selectProfilePicture()\">\n                  Change\n               </a>\n               \n               <a class=\"profile-picture-link reset\" ng-if=\"registrationUser.profile_picture_url\" ng-click=\"resetProfilePicture()\">\n                  Reset\n               </a>\n            \n               <file-reader \n                  supports-multiple=\"false\"\n                  accept=\"image/*\"\n                  process-exif=\"true\"\n                  is-active=\"profilePicturePickerIsActive\"\n                  on-files-added=\"onProfilePictureAdded(files)\"\n                  on-files-progress=\"onProfilePictureProgress(progress)\"\n                  on-files-error=\"onProfilePictureError(error)\">\n               </file-reader>\n            </div>\n         </div>\n      </div>\n\n      <div class=\"col-lg-6 col-md-6 col-sm-6 col-xs-12\">\n         <div class=\"form-group\"\n              ng-class=\"{ \'has-error\': registrationForm.registration_email.$touched && registrationForm.registration_email.$invalid }\">\n            <label for=\"registration_email\">\n               <span>E-Mail Address</span>\n               <span class=\"form-errors\" \n                     ng-messages=\"registrationForm.registration_email.$error\"\n                     ng-if=\"registrationForm.registration_email.$touched\">\n                  <span ng-messages-include=\"messages/registration.html\"></span>\n               </span>\n            </label>\n            <input type=\"email\" \n                   class=\"form-control\" \n                   name=\"registration_email\" \n                   ng-model=\"registrationUser.email\" \n                   ng-model-options=\"{updateOn: \'blur\'}\"\n                   email-in-use\n                   required />\n         </div>\n\n         <div class=\"form-group\"\n              ng-class=\"{ \'has-error\': registrationForm.registration_password.$touched && registrationForm.registration_password.$invalid }\">  \n            <label for=\"registration_password\">\n               <span>Password (6 characters or more)</span>\n               <span class=\"form-errors\" \n                     ng-messages=\"registrationForm.registration_password.$error\"\n                     ng-if=\"registrationForm.registration_password.$touched\">\n                  <span ng-messages-include=\"messages/registration.html\"></span>\n               </span>\n            </label>\n            <input type=\"password\" \n                   class=\"form-control\" \n                   name=\"registration_password\" \n                   ng-model=\"registrationUser.password\"\n                   ng-model-options=\"{updateOn: \'blur\'}\"\n                   minlength=\"6\"\n                   required />\n         </div>\n      \n         <div class=\"form-group\"\n              ng-class=\"{ \'has-error\': registrationForm.registration_password_repeat.$touched && registrationForm.registration_password_repeat.$invalid }\">\n            <label for=\"registration_password_repeat\">\n               <span>Repeat Password</span>\n               <span class=\"form-errors\" \n                     ng-messages=\"registrationForm.registration_password_repeat.$error\"\n                     ng-if=\"registrationForm.registration_password_repeat.$touched\">\n                  <span ng-messages-include=\"messages/registration.html\"></span>\n               </span>\n            </label>\n            <input type=\"password\" \n                  class=\"form-control\" \n                  name=\"registration_password_repeat\" \n                  ng-model=\"registrationUser.repeat_password\"\n                  ng-model-options=\"{updateOn: \'blur\'}\"\n                  compare-to=\"registrationUser.password\" />\n         </div>\n      \n         <div class=\"form-group\">  \n            <label for=\"registration_first_name\">\n               <span>First Name</span>\n               <span class=\"form-errors\" \n                     ng-messages=\"registrationForm.registration_first_name.$error\"\n                     ng-if=\"registrationForm.registration_first_name.$touched\">\n                  <span ng-messages-include=\"messages/registration.html\"></span>\n               </span>\n            </label>\n            <input type=\"text\" \n                  class=\"form-control\" \n                  name=\"registration_first_name\" \n                  ng-model=\"registrationUser.first_name\"\n                  ng-model-options=\"{updateOn: \'blur\'}\"\n                  required />\n         </div>\n      \n         <div class=\"form-group\"> \n            <label for=\"registration_last_name\">\n               <span>Last Name</span>\n               <span class=\"form-errors\" \n                     ng-messages=\"registrationForm.registration_last_name.$error\"\n                     ng-if=\"registrationForm.registration_last_name.$touched\">\n                  <span ng-messages-include=\"messages/registration.html\"></span>\n               </span>\n            </label>\n            <input type=\"text\" \n                  class=\"form-control\" \n                  name=\"registration_last_name\" \n                  ng-model=\"registrationUser.last_name\"\n                  ng-model-options=\"{updateOn: \'blur\'}\"\n                  required /> \n         </div>       \n            \n         <div class=\"form-group\">\n            <div class=\"fa-checkbox\">\n               <input type=\"checkbox\" class=\"fa-square-checkbox\" ng-model=\"registrationUser.is_visible_to_public\" />\n               <label>Visible to the public?</label>\n            </div>\n         </div>\n\n         <div class=\"form-group\">\n            <div class=\"fa-checkbox\">\n               <input type=\"checkbox\" class=\"fa-square-checkbox\" ng-model=\"registrationUser.is_visible_to_users\" />\n               <label>Visible to other users?</label>\n            </div>\n         </div>\n\n         <div class=\"sign-up form-group\" ng-if=\"!registrationInProgress\">\n            <button ng-disabled=\"registrationForm.$invalid\" ng-click=\"registerUser()\">Sign Up</button>\n         </div>\n         <div class=\"registering-in-progress\" ng-if=\"registrationInProgress\">\n            <div class=\"registering-text\" ng-bind=\"getRegistrationProgressMessage()\">\n            </div>\n            <div>\n               <div loading-progress type=\"bar\"\n                           progress-object=\"registrationProgress\"\n                           width=\"250px\"\n                           height=\"20px\"\n                           color=\"#333333\">\n               </div>\n            </div>\n         </div> \n\n      </div>     \n   </form>\n</div>");
$templateCache.put("partials/main/register/register.html","<div class=\"register\">\n   <div ui-view=\"content\" class=\"sub-content\"></div>\n</div>");
$templateCache.put("partials/main/register/success.html","<div class=\"row\" ng-if=\"null !== getCurrentUnverifiedUser()\">\n   <div class=\"col-lg-12 col-md-12 col-sm-12 col-xs-12\">\n      <p>\n         Hello <span ng-bind=\"getEmailAddress()\"></span>!\n      </p>\n      <p>\n         We have sent a link to your e-mail address, all you need to do\n         is click it, and you\'re good to go!\n      </p>\n      <p>\n         Didn\'t get an e-mail?  Click <a ng-click=\"resendVerificationEmail()\">here</a> to resend it.  Make\n         sure to check your spam folder if it isn\'t in your main inbox.\n      </p>\n      \n      <p ng-if=\"isSendingEmail\" class=\"resending-in-progress\">\n         <span>\n            <div loading-progress \n                 type=\"spinner\">\n            </div>\n         </span>\n         <span class=\"resending-text\">\n            Resending E-Mail...\n         </span>\n      </p>\n      \n      <p ng-if=\"hasSentEmail\">\n         E-Mail sent successfully!\n      </p>\n   </div>\n</div>\n\n<div class=\"row\" ng-if=\"null === getCurrentUnverifiedUser()\">\n   <div class=\"col-lg-12 col-md-12 col-sm-12 col-xs-12\" style=\"text-align:center;\">\n      <p>\n         It appears that you navigated here by accident.\n      </p>\n      <p>\n         Click <a ui-sref=\"main.page.home.default\">here</a> to go back to the homepage</a>\n      </p>\n   </div>\n</div>\n");
$templateCache.put("partials/main/reset_password/content.html","<div class=\"col-lg-6 col-md-6 col-sm-6 col-xs-12 reset-password-form\">\n   <form name=\"resetPasswordForm\">\n      <div class=\"form-group\"\n           ng-class=\"{ \'has-error\': resetPasswordForm.reset_password_password.$touched && resetPasswordForm.reset_password_repeat_password.$invalid }\">\n         <label for=\"reset_password_password\">\n            <span>New Password (6 characters or more)</span>\n            <span class=\"form-errors\" \n                  ng-messages=\"resetPasswordForm.reset_password_password.$error\"\n                  ng-if=\"resetPasswordForm.reset_password_password.$touched\">\n               <span ng-messages-include=\"messages/registration.html\"></span>\n            </span>\n         </label>\n         <input type=\"password\" \n                class=\"form-control\" \n                name=\"reset_password_password\" \n                ng-model=\"formData.password\"\n                ng-model-options=\"{updateOn: \'blur\'}\"\n                minlength=\"6\"\n                required />\n      </div>\n\n      <div class=\"form-group\"\n           ng-class=\"{ \'has-error\': resetPasswordForm.reset_password_repeat.$touched && resetPasswordForm.reset_password_repeat.$invalid }\">  \n         <label for=\"reset_password_repeat\">\n            <span>Repeat New Password</span>\n            <span class=\"form-errors\" \n                  ng-messages=\"resetPasswordForm.reset_password_repeat.$error\"\n                  ng-if=\"resetPasswordForm.reset_password_password.$touched\">\n               <span ng-messages-include=\"messages/registration.html\"></span>\n            </span>\n         </label>\n         <input type=\"password\" \n                class=\"form-control\" \n                name=\"reset_password_repeat\" \n                ng-model=\"formData.repeat_password\"\n                ng-model-options=\"{updateOn: \'keyup\'}\"\n                compare-to=\"formData.password\" />\n      </div>\n      \n      <div class=\"form-group\" ng-if=\"!resettingInProgress\">\n         <button ng-disabled=\"resetPasswordForm.$invalid\" ng-click=\"resetPassword()\">Set Password</button>\n      </div>\n      \n      <div class=\"resetting-in-progress\" ng-if=\"resettingInProgress\">\n         <span><div loading-progress type=\"spinner\"></div></span>\n         <span class=\"resetting-text\">Setting password...</span>\n      </div>\n   </form>\n</div>");
$templateCache.put("partials/main/reset_password/reset_password.html","<div class=\"reset-password\">\n   <div ui-view=\"content\" class=\"sub-content\"></div>\n</div>");
$templateCache.put("partials/main/user/content.html","<div ng-if=\"currentEditingUser\">\n   <div class=\"edit-container profile-picture-container\">\n      <div class=\"profile-picture-display\">\n         <span class=\"hidden-xs\">\n            <profile-picture user=\"currentEditingUser\" width=\"300px\"></profile-picture>\n         </span>\n         <span class=\"hidden-lg hidden-md hidden-sm\">\n            <profile-picture user=\"currentEditingUser\" width=\"150px\"></profile-picture>\n         </span>\n      </div>\n      <br />\n      <div class=\"profile-picture-change\" ng-if=\"isEditingProfile\">\n         <a class=\"change-profile-picture\" ng-click=\"changeProfilePicture()\">Change</a>\n         <a class=\"reset-profile-picture\" ng-click=\"resetProfilePicture()\">Reset</a>\n         <file-reader\n            supports-multiple=\"false\"\n            accept=\"image/*\"\n            process-exif=\"true\"\n            is-active=\"profilePicturePickerIsActive\"\n            on-files-added=\"onProfilePictureSelectSuccess(files)\"\n            on-files-progress=\"onProfilePictureSelectProgress(progress)\"\n            on-files-error=\"onProfilePictureSelectError(error)\">\n         </file-reader>      \n      </div>\n   </div>\n   \n   <div class=\"edit-container profile-name-container\" ng-if=\"!isChangingPassword && !isChangingEmail\">\n      <span ng-if=\"!isEditingProfile\" ng-bind=\"currentEditingUser.fullName()\"></span>\n      <div class=\"top-edit-control\" ng-if=\"isEditingProfile\">\n         <div>\n            <input type=\"text\"\n                  placeholder=\"First Name\"\n                  class=\"form-control profile-name-input\"\n                  ng-model=\"currentEditingUser.first_name\"\n                  ng-model-options=\"{updateOn: \'blur\'}\"\n                  required />\n         </div>\n         <div>\n            <input type=\"text\"\n                  placeholder=\"Last Name\"\n                  class=\"form-control profile-name-input\"\n                  ng-model=\"currentEditingUser.last_name\"\n                  ng-model-options=\"{updateOn: \'blur\'}\"\n                  required />\n         </div>\n      </div>\n   </div>\n   \n   <div class=\"edit-container profile-email-address-container\" ng-if=\"!isEditingProfile && !isChangingPassword\">\n      <div ng-if=\"!isChangingEmail\">\n         <span class=\"email-text\"\n               ng-bind=\"currentEditingUser.email\"></span>\n      </div>\n\n      <div ng-if=\"currentEditingUser.pending_email\">\n         <span class=\"pending-email-text\">\n            <span ng-bind=\"currentEditingUser.pending_email\"></span>\n            <a class=\"left\" ng-click=\"resendPendingEmailVerificationEmail()\">Resend</a>\n            <a class=\"right\" ng-click=\"cancelPendingEmailVerification()\">Cancel</a>\n         </span>\n      </div>     \n      \n      <div ng-if=\"isChangingEmail\">\n         <div ng-class=\"getEmailEditControlClass()\">\n            <input type=\"email\"\n                  placeholder=\"New E-Mail\"\n                  class=\"form-control profile-email-input\"\n                  ng-model=\"emailChangeData.email\"\n                  ng-model-options=\"{updateOn: \'blur\'}\"\n                  required />\n         </div>\n      </div>\n   </div>\n   \n   <div class=\"edit-container profile-password-container\" ng-if=\"isChangingPassword\">\n      <div class=\"top-edit-control\">\n         <div>\n            <input type=\"password\"\n                  placeholder=\"Old Password\"\n                  class=\"form-control profile-old-password-input\"\n                  ng-model=\"passwordChangeData.old_password\"\n                  ng-model-options=\"{updateOn: \'blur\'}\"\n                  required />\n         </div>\n         <div>\n            <input type=\"password\"\n                  placeholder=\"New Password\"\n                  class=\"form-control profile-new-password-input\"\n                  ng-model=\"passwordChangeData.new_password\"\n                  ng-model-options=\"{updateOn: \'blur\'}\"\n                  required />\n         </div>\n         <div>       \n            <input type=\"password\"\n                  placeholder=\"Repeat New Password\"\n                  class=\"form-control profile-repeat-new-password-input\"\n                  ng-model=\"passwordChangeData.new_password_repeat\"\n                  ng-model-options=\"{updateOn: \'blur\'}\"\n                  required />\n         </div>         \n      </div>\n   </div>\n   \n   <div class=\"edit-container profile-options-container\">\n      <span ng-if=\"canChangeUser() && !isEditingProfile && !isChangingPassword && !isChangingEmail\">\n         <a ng-click=\"activateEditingProfile()\">Edit Profile</a>\n         &nbsp;|&nbsp;\n         <a ng-click=\"activateChangePassword()\">Change Password</a>\n         &nbsp;|&nbsp;\n         <a ng-click=\"activateChangeEmail()\">Change E-Mail</a>\n      </span>\n      \n      <span ng-if=\"isEditingProfile && !isSaving\">\n         <a class=\"save-cancel-left save-changes\" ng-click=\"saveProfile()\">Save</a>\n         <a class=\"save-cancel-right cancel-edit\" ng-click=\"cancelEditing()\">Back</a>\n      </span>\n      \n      <span ng-if=\"isChangingPassword && !isSaving\">\n         <a class=\"save-cancel-left save-password\" ng-click=\"changePassword()\">Change</a>\n         <a class=\"save-cancel-right cancel-change-password\" ng-click=\"cancelChangePassword()\">Back</a>\n      </span>\n      \n      <span ng-if=\"isChangingEmail && !isSaving\">\n         <a class=\"save-cancel-left save-email\" ng-click=\"changeEmail()\">Change</a>\n         <a class=\"save-cancel-right cancel-change-email\" ng-click=\"cancelChangeEmail()\">Back</a>\n      </span>\n      \n      <div ng-if=\"isSaving\" class=\"saving-message\">\n         <span ng-bind=\"getSavingUserMessage()\"></span>\n      </div>\n      \n      <div ng-if=\"postSavingMessage\" class=\"post-saving-message\">\n         <span ng-bind=\"postSavingMessage\"></span>\n      </div>\n   </div>\n</div>\n\n<div ng-if=\"!currentEditingUser\">\n   <span ng-bind=\"getStaticErrorMessage()\"></span>\n</div>");
$templateCache.put("partials/main/user/user.html","<div class=\"user\">\n   <div ui-view=\"content\" class=\"sub-content\"></div>\n</div>");}]);