(function() {
   var DomUtils = {
      // Lifted from:
      // http://stackoverflow.com/questions/18071046/smooth-scroll-to-specific-div-on-click
      smoothScroll: function(element, isInstant, extraHeight) {
         // The extra height is height we know we're gonna have in the child div.
         // This is for animating elements.

         extraHeight = extraHeight || 0;

         var MIN_PIXELS_PER_STEP = 16;
         var MAX_SCROLL_STEPS = 30;
         var target = element;
         var scrollContainer = target;
         do {
            scrollContainer = scrollContainer.parentNode;
            if (!scrollContainer) return;
            // If this container doesn't scroll,
            // modifying it won't work, and its scrollTop
            // value will stay at 0.
            
            scrollContainer.scrollTop += 1;
         } while (scrollContainer.scrollTop == 0);

         var targetY = 0;
         do {
            if (target == scrollContainer) break;
            targetY += target.offsetTop;
         } while (target = target.offsetParent);

         if (isInstant) {
            scrollContainer.scrollTop = targetY;
            return;
         } 

         var pixelsPerStep = Math.max(MIN_PIXELS_PER_STEP,
                                       (targetY - scrollContainer.scrollTop) / MAX_SCROLL_STEPS);
         
         var maxScrollHeight = scrollContainer.scrollHeight + extraHeight;

         var originalTargetY = targetY;
         var stepFunc = function() {
            var maxScrollY = maxScrollHeight - scrollContainer.clientHeight;

            targetY = Math.min(originalTargetY, maxScrollY);

            var prevScrollTop = scrollContainer.scrollTop;
            scrollContainer.scrollTop  =
                  Math.min(targetY, pixelsPerStep + scrollContainer.scrollTop);

            if (scrollContainer.scrollTop >= targetY) {
                  return;
            }

            window.requestAnimationFrame(stepFunc);
         };

         window.requestAnimationFrame(stepFunc);
      },

      findElementByClassName: function(className) {
         var nodeList = document.querySelectorAll(className);

         if (!nodeList.length) {
            return null;
         } else {
            return nodeList[0];
         }
      }
   };

   if ('undefined' !== typeof module && module.exports) {
      module.exports = DomUtils;
   } else {
      window['dom_utils'] = DomUtils;
   }

})();