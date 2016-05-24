define(['angular'], function (angular) {
  angular.module('apollo.mobileDetect', ['apollo.utilities']).factory('$mobileDetect', [
    '$window',
    '$utilities',
    function ($window, $utilities) {
      return function (message) {
        var message = message || 'This application feature is not supported on mobile operating systems. Please retry on a desktop operating system.';
        var isMobile = $utilities.isMobile();
        if (isMobile) {
          $window.alert(message);
        }
        return isMobile;
      };
    }
  ]);
});