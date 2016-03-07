angular.module("valiant.views", []).run(["$templateCache", function($templateCache) {$templateCache.put("main.html","<div class=\"main\">\n    <div ui-view=\"header\"></div>\n    <div ui-view=\"content\"></div>\n    <div ui-view=\"footer\"></div>\n</div>");
$templateCache.put("partials/about/about.html","<div ui-view=\"content\" class=\"about\"></div>");
$templateCache.put("partials/about/content.html","This is about my love for my Beautiful <span ng-bind=\"name\"></span>.");
$templateCache.put("partials/main/content.html","This is the main page!");
$templateCache.put("partials/main/footer.html","This is the footer!");
$templateCache.put("partials/main/header.html","<div>Valiant Athletics</div>\n<a ui-sref=\"main.home.default\">Home</a>\n<a ui-sref=\"main.about.default\">About</a>\n");
$templateCache.put("partials/main/main.html","<div ui-view=\"content\" class=\"main\"></div>");}]);