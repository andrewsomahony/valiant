angular.module("valiant.views", []).run(["$templateCache", function($templateCache) {$templateCache.put("admin.html","<div class=\"container admin\">\n    <div class=\"row\">\n        <div ui-view=\"header\" class=\"header\"></div>\n    </div>\n    <div class=\"row\">\n        <div ui-view=\"content\" class=\"content\"></div>\n    </div>\n    <div class=\"row\">\n        <div ui-view=\"footer\" class=\"footer\"></div>\n    </div>\n</div>");
$templateCache.put("main.html","<div class=\"container-fluid main\">\n    <div class=\"row\">\n        <div class=\"top-bar col-xs-12 col-md-12 col-lg-12\" ui-view=\"top_bar\"></div>\n    </div>\n    \n    <div class=\"row\">\n        <div ui-view=\"header\" class=\"header\"></div>\n    </div>    \n    \n    <div class=\"main-content\">\n        <div class=\"row row-eq-height\" style=\"height: 640px;\">\n            <div ui-view=\"content\" class=\"content col-md-10 col-xs-12\"></div>\n            <div ui-view=\"ad_space_right\" class=\"ad-space col-md-2 col-xs-12\">\n                <div class=\"ad\">\n                    <img src=\"./images/temp_ad.png\" />\n                </div>\n                <div class=\"copyright\">\n                    Andrew O\'Mahony (c) 2016\n                </div>\n            </div>\n        </div>\n    </div>\n</div>");
$templateCache.put("modals/partials/error_modal.html","<div class=\"error-modal\">\n    <span class=\"error-modal-message\" ng-bind=errorMessage></span>\n</div>");
$templateCache.put("partials/admin/footer.html","<span class=\"logout-link\"><a>Logout</a></span>");
$templateCache.put("partials/admin/header.html","<div>Valiant Athletics Admin Page</div>\n");
$templateCache.put("partials/main/header.html","<div class=\"col-md-7 col-xs-12\">\n<div><a ui-sref=\"main.page.home.default\">Valiant Athletics</a></div>\n</div>\n\n<div class=\"col-md-5 col-xs-12\">\n    <div class=\"nav-bar\" ui-view=\"nav_bar\"></div>\n</div>\n");
$templateCache.put("partials/main/nav_bar.html","<nav>\n    <a class=\"link\" ui-sref=\"main.page.about.default\">About</a>\n    <a class=\"link\" ui-sref=\"main.page.blog.default\">Blog</a>\n    <a class=\"link\" ui-sref=\"main.page.coaching.default\">Coaching</a>\n    <a class=\"link\" ui-sref=\"main.page.contact.default\">Contact</a>\n</nav>");
$templateCache.put("partials/main/top_bar.html","<div class=\"social-links\"></div>\n\n<div class=\"user-details\">\n    <div class=\"login-form\" ng-if=\"true === formVisible\">\n        <span>\n            <input type=\"text\" placeholder=\"username\" ng-model=\"loginDetails.username\" style=\"width: 200px;\" />\n        </span>\n        <span>\n            <input type=\"password\" placeholder=\"password\" ng-model=\"loginDetails.password\" style=\"width: 200px;\" />\n        </span>\n        <a href=\"#\" class=\"login-button\">Login</a>\n    </div>\n    <div class=\"login-buttons\" ng-if=\"false === formVisible\">\n        <a class=\"login-button\" ng-click=\"showForm()\">Login</a>\n        <a class=\"login-button\">Register</a>\n    </div>\n</div>");
$templateCache.put("partials/admin/home/content.html","<span class=\"admin-text\">This is the admin page!</span>");
$templateCache.put("partials/admin/home/home.html","<div class=\"home\">\n    <div ui-view=\"content\" class=\"content\"></div>\n</div>");
$templateCache.put("partials/main/about/about.html","<div class=\"about\">\n    <div ui-view=\"content\" class=\"content\"></div>\n</div>");
$templateCache.put("partials/main/about/content.html","<span class=\"about-text\">This is about my love for my Beautiful <span ng-bind=\"name\"></span>.</span>\n\n<button ng-click=\"onTestRequestClick()\">Test HTTP</button>\n\n<div>\n<img src=\"https://i.guim.co.uk/img/static/sys-images/Guardian/Pix/pictures/2015/8/6/1438891475168/Dan-Wallace-Swimming-Worl-009.jpg?w=460&q=85&auto=format&sharp=10&s=d6fe921a44c6ece625cbfaa99df633dc\" />\n</div>\n\n<div>\n<img src=\"https://i.guim.co.uk/img/static/sys-images/Guardian/Pix/pictures/2015/8/6/1438891475168/Dan-Wallace-Swimming-Worl-009.jpg?w=460&q=85&auto=format&sharp=10&s=d6fe921a44c6ece625cbfaa99df633dc\" />\n</div>\n<div>\n<img src=\"https://i.guim.co.uk/img/static/sys-images/Guardian/Pix/pictures/2015/8/6/1438891475168/Dan-Wallace-Swimming-Worl-009.jpg?w=460&q=85&auto=format&sharp=10&s=d6fe921a44c6ece625cbfaa99df633dc\" />\n</div>\n<div>\n<img src=\"https://i.guim.co.uk/img/static/sys-images/Guardian/Pix/pictures/2015/8/6/1438891475168/Dan-Wallace-Swimming-Worl-009.jpg?w=460&q=85&auto=format&sharp=10&s=d6fe921a44c6ece625cbfaa99df633dc\" />\n</div><div>\n<img src=\"https://i.guim.co.uk/img/static/sys-images/Guardian/Pix/pictures/2015/8/6/1438891475168/Dan-Wallace-Swimming-Worl-009.jpg?w=460&q=85&auto=format&sharp=10&s=d6fe921a44c6ece625cbfaa99df633dc\" />\n</div><div>\n<img src=\"https://i.guim.co.uk/img/static/sys-images/Guardian/Pix/pictures/2015/8/6/1438891475168/Dan-Wallace-Swimming-Worl-009.jpg?w=460&q=85&auto=format&sharp=10&s=d6fe921a44c6ece625cbfaa99df633dc\" />\n</div><div>\n<img src=\"https://i.guim.co.uk/img/static/sys-images/Guardian/Pix/pictures/2015/8/6/1438891475168/Dan-Wallace-Swimming-Worl-009.jpg?w=460&q=85&auto=format&sharp=10&s=d6fe921a44c6ece625cbfaa99df633dc\" />\n</div><div>\n<img src=\"https://i.guim.co.uk/img/static/sys-images/Guardian/Pix/pictures/2015/8/6/1438891475168/Dan-Wallace-Swimming-Worl-009.jpg?w=460&q=85&auto=format&sharp=10&s=d6fe921a44c6ece625cbfaa99df633dc\" />\n</div><div>\n<img src=\"https://i.guim.co.uk/img/static/sys-images/Guardian/Pix/pictures/2015/8/6/1438891475168/Dan-Wallace-Swimming-Worl-009.jpg?w=460&q=85&auto=format&sharp=10&s=d6fe921a44c6ece625cbfaa99df633dc\" />\n</div>");
$templateCache.put("partials/main/home/content.html","<span class=\"home-text\">This is the main page!</span>");
$templateCache.put("partials/main/home/home.html","<div class=\"home\">\n    <div ui-view=\"content\" class=\"content\"></div>\n</div>");}]);