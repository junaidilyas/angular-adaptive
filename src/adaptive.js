(function () {
  'use strict';

  /**
   * angular-adaptive - A hybrid between adaptive and responsive templating.
   * @version v0.1.0
   * @link https://junaidilyas.github.io/angular-adaptive
   * @author Junaid Ilyas <junaidilyas1@gmail.com>
   * @license MIT License, http://www.opensource.org/licenses/MIT
   */
  var module = angular.module('angular-adaptive', []);

  module.directive('adaptive', function ($compile, $window, adaptiveConfig) {
    var devices = adaptiveConfig.devices.slice(0);
    var templates = {};

    var linker = function(scope, element, attrs) {

      angular.forEach(devices, function(device) {
        device.viewTemplate = attrs[device.name];

        if (device.viewTemplate) {
          templates[device.mediaQuery] = device.viewTemplate;
          device.loadTemplate = function (mql) {
            if (mql.matches) {
              element.html('<ng-include src="\'' + templates[mql.media] + '\'"></ng-include>').show();
              $compile(element.contents())(scope);

              if (!scope.$$phase) {
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
      element.on('$destroy', function() {
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
  });

  module.provider('adaptiveConfig', function() {
    var opts = {
      devices: [
        {
          name: "desktop",
          mediaQuery: "screen and (min-width: 768px)"
        },
        {
          name: "mobile",
          mediaQuery: "screen and (max-width: 767px)"
        }
      ]
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
