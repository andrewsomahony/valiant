(function() {
   var DomUtils = {
      // Lifted from:
      // http://stackoverflow.com/questions/18071046/smooth-scroll-to-specific-div-on-click
      smoothScroll: function(element, isInstant, extraHeight, yOffset) {
         // The extra height is height we know we're gonna have in the child div.
         // This is for animating elements.

         extraHeight = extraHeight || 0;
         yOffset = yOffset || 0;

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

            targetY = Math.min(originalTargetY, maxScrollY) + yOffset;

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
      },

      cssDimensionStringIsPercent: function(dimensionString) {
         return -1 !== dimensionString.indexOf('%');
      },

      scaleCSSDimensionString: function(dimensionString, value, how) {
         var dimensionTypes = [
            '%',
            'px',
            'em',
            'ex',
            'cm',
            'mm',
            'in',
            'pt',
            'pc',
            'ch',
            'rem',
            'vw',
            'vh',
            'vmin',
            'vmax'
         ];
         var lowerCaseDimensionString = dimensionString.toLowerCase();
         var lowerCaseHowString = how.toLowerCase();

         var dimensionType = "";
         dimensionTypes.every(function(type) {
            if (-1 !== lowerCaseDimensionString.indexOf(type)) {
               dimensionType = type;
               return false;
            } else {
               return true;
            }
         });

         var dimensionInt = parseInt(dimensionString);
         var valueInt = parseInt(value);

         var finalValue;

         if ('divide' === lowerCaseHowString) {
            finalValue = dimensionInt / valueInt;
         } else if ('multiply' === lowerCaseHowString) {
            finalValue = dimensionInt * valueInt;
         } else if ('add' === lowerCaseHowString) {
            finalValue = dimensionInt + valueInt;
         } else if ('subtract' === lowerCaseHowString) {
            finalValue = dimensionInt - valueInt;
         } else {
            throw new Error("scaleCSSDimensionString: Unknown math operation!" + how);
         }
         
         return finalValue + dimensionType;
      }
   };

   if ('undefined' !== typeof module && module.exports) {
      module.exports = DomUtils;
   } else {
      window['dom_utils'] = DomUtils;
   }

})();