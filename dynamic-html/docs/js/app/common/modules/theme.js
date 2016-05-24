/* -----
 * Apollo Theme Module
 * Enables dynamic theme changing
 */
define(['angular'], function (angular) {
  angular.module('apollo.theme', []).directive('themeChanger', [
    '$log',
    function ($log) {
      return {
        restrict: 'A',
        replace: false,
        scope: {
          cssId: '@',
          delay: '@'
        },
        link: function (scope, el, attrs) {
          if (!attrs.cssId) {
            $log.error('Attribute css ID is required');
            return;
          }
          scope.cssId = attrs.cssId;
          scope.delay = attrs.delay ? parseInt(attrs.delay) : 2000;
          scope.$on('theme:change', function (e, obj) {
            $(el).fadeOut(200, function () {
              $(scope.cssId).attr('href', obj.baseUrl + 'css/themes/bootstrap-' + obj.theme.id + '.css');
              setTimeout(function () {
                $(el).fadeIn();
              }, scope.delay);
            });
          });
        }
      };
    }
  ]).factory('$theme', [
    '$log',
    '$rootScope',
    function ($log, $rootScope) {
      var baseUrl = '';
      var themes = [
          {
            id: 'cisco',
            name: 'Cisco'
          },
          {
            id: 'slate',
            name: 'Slate'
          }
        ];
      var currentTheme = themes[2];
      // Default theme - Cisco
      function byId(id) {
        for (var ii = 0; ii < themes.length; ii++) {
          if (themes[ii].id === id) {
            return themes[ii];
          }
        }
      }
      return {
        changeTheme: function (id) {
          this.setCurrentTheme(id);
          $rootScope.$broadcast('theme:change', {
            baseUrl: baseUrl,
            theme: currentTheme
          });
        },
        getThemes: function () {
          return themes;
        },
        getCurrentTheme: function () {
          return currentTheme;
        },
        setCurrentTheme: function (id) {
          currentTheme = byId(id);
        },
        setBaseUrl: function (url) {
          baseUrl = url;
        }
      };
    }
  ]);
});