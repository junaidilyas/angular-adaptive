/*! angular-adaptive v0.1.0: A hybrid between adaptive and responsive templating. Provides a directive to dynamically load device specific templates in a responsive manner.
 * Copyright 2016 Junaid Ilyas <junaidilyas1@gmail.com>
 * Licensed under MIT
 * https://junaidilyas.github.io/angular-adaptive */

/*! matchMedia() polyfill - Test a CSS media type/query in JS. Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas, David Knight. Dual MIT/BSD license */
window.matchMedia || (window.matchMedia = function() {
  "use strict";
  // For browsers that support matchMedium api such as IE 9 and webkit
  var styleMedia = window.styleMedia || window.media;
  // For those that don't support matchMedium
  if (!styleMedia) {
    var style = document.createElement("style"), script = document.getElementsByTagName("script")[0], info = null;
    style.type = "text/css";
    style.id = "matchmediajs-test";
    script.parentNode.insertBefore(style, script);
    // 'style.currentStyle' is used by IE <= 8 and 'window.getComputedStyle' for all other browsers
    info = "getComputedStyle" in window && window.getComputedStyle(style, null) || style.currentStyle;
    styleMedia = {
      matchMedium: function(media) {
        var text = "@media " + media + "{ #matchmediajs-test { width: 1px; } }";
        // 'style.styleSheet' is used by IE <= 8 and 'style.textContent' for all other browsers
        if (style.styleSheet) {
          style.styleSheet.cssText = text;
        } else {
          style.textContent = text;
        }
        // Test if media query is true or false
        return info.width === "1px";
      }
    };
  }
  return function(media) {
    return {
      matches: styleMedia.matchMedium(media || "all"),
      media: media || "all"
    };
  };
}());

/*! matchMedia() polyfill addListener/removeListener extension. Author & copyright (c) 2012: Scott Jehl. Dual MIT/BSD license */
(function() {
  // Bail out for browsers that have addListener support
  if (window.matchMedia && window.matchMedia("all").addListener) {
    return false;
  }
  var localMatchMedia = window.matchMedia, hasMediaQueries = localMatchMedia("only all").matches, isListening = false, timeoutID = 0, // setTimeout for debouncing 'handleChange'
  queries = [], // Contains each 'mql' and associated 'listeners' if 'addListener' is used
  handleChange = function(evt) {
    // Debounce
    clearTimeout(timeoutID);
    timeoutID = setTimeout(function() {
      for (var i = 0, il = queries.length; i < il; i++) {
        var mql = queries[i].mql, listeners = queries[i].listeners || [], matches = localMatchMedia(mql.media).matches;
        // Update mql.matches value and call listeners
        // Fire listeners only if transitioning to or from matched state
        if (matches !== mql.matches) {
          mql.matches = matches;
          for (var j = 0, jl = listeners.length; j < jl; j++) {
            listeners[j].call(window, mql);
          }
        }
      }
    }, 30);
  };
  window.matchMedia = function(media) {
    var mql = localMatchMedia(media), listeners = [], index = 0;
    mql.addListener = function(listener) {
      // Changes would not occur to css media type so return now (Affects IE <= 8)
      if (!hasMediaQueries) {
        return;
      }
      // Set up 'resize' listener for browsers that support CSS3 media queries (Not for IE <= 8)
      // There should only ever be 1 resize listener running for performance
      if (!isListening) {
        isListening = true;
        window.addEventListener("resize", handleChange, true);
      }
      // Push object only if it has not been pushed already
      if (index === 0) {
        index = queries.push({
          mql: mql,
          listeners: listeners
        });
      }
      listeners.push(listener);
    };
    mql.removeListener = function(listener) {
      for (var i = 0, il = listeners.length; i < il; i++) {
        if (listeners[i] === listener) {
          listeners.splice(i, 1);
        }
      }
    };
    return mql;
  };
})();

(function() {
  "use strict";
  /**
   * angular-adaptive - A hybrid between adaptive and responsive templating.
   * @version v0.1.0
   * @link https://junaidilyas.github.io/angular-adaptive
   * @author Junaid Ilyas <junaidilyas1@gmail.com>
   * @license MIT License, http://www.opensource.org/licenses/MIT
   */
  angular.module("angular-adaptive", []).directive("adaptive", [ "$compile", "$window", "adaptiveConfig", function($compile, $window, adaptiveConfig) {
    var devices = adaptiveConfig.devices.slice(0);
    var templates = {};
    var linker = function(scope, element, attrs) {
      angular.forEach(devices, function(device) {
        device.viewTemplate = attrs[device.name];
        if (device.viewTemplate) {
          templates[device.mediaQuery] = device.viewTemplate;
          device.loadTemplate = function(mql) {
            if (mql.matches) {
              element.html("<ng-include src=\"'" + templates[mql.media] + "'\"></ng-include>").show();
              $compile(element.contents())(scope);
              if (!scope.$root.$$phase) {
                scope.$digest();
              }
            }
          };
          device.mql = $window.matchMedia(device.mediaQuery);
          device.mql.addListener(device.loadTemplate);
          device.loadTemplate(device.mql);
        }
      });
      // remove all listeners on element destroy.
      element.on("$destroy", function() {
        angular.forEach(devices, function(device) {
          if (device.mql) {
            device.mql.removeListener(device.loadTemplate);
          }
        });
      });
    };
    return {
      restrict: "E",
      link: linker
    };
  } ]).provider("adaptiveConfig", function() {
    var opts = {
      devices: [ {
        name: "desktop",
        mediaQuery: "screen and (min-width: 768px)"
      }, {
        name: "mobile",
        mediaQuery: "screen and (max-width: 767px)"
      } ]
    };
    return {
      config: function(newOpts) {
        opts = newOpts;
      },
      $get: function() {
        return opts;
      }
    };
  });
})();