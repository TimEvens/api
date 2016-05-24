define([
  'underscore',
  'angular'
], function (_, angular) {
  angular.module('apollo.fonts', []).factory('$font', [
    '$window',
    function ($window) {
      return { getFontWidth: _.memoize(getFontWidth) };
      function getFontWidth(size) {
        var context = document.createElement('canvas').getContext('2d');
        var fontWidth;
        context.font = size + 'px Monaco, Consolas, Courier New, Courier, monospace';
        fontWidth = context.measureText('X').width;
        if (isIE()) {
          fontWidth *= 0.9443911792905082;
        } else if (isSafari()) {
          fontWidth *= 1.0306807286673059;
        }
        return fontWidth;
      }
      function isIE() {
        return !$window.ActiveXObject && _.has($window, 'ActiveXObject');
      }
      function isSafari() {
        return userAgentIndexOf('Safari') && !userAgentIndexOf('Chrome');
      }
      function userAgentIndexOf(string) {
        if ($window.navigator && $window.navigator.userAgent) {
          return $window.navigator.userAgent.indexOf(string) !== -1;
        }
      }
    }
  ]);
});