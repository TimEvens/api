define([
  'appModule',
  'underscore'
], function (app, _) {
  app.directive('urlPhoto', function ($utilities) {
    return {
      require: 'ngModel',
      link: function ($scope, elm, attrs, ctrl) {
        var urlPatterns = {
            validUrl: /https?:\/\/.+/i,
            validExt: /(jpe?g|png|gif)$/i
          };
        function testUrlPatterns(val) {
          return _.every(urlPatterns, function (pattern, key) {
            var valid = pattern.test(val);
            ctrl.$setValidity(key, valid);
            return valid;
          });
        }
        function set404Validity(bool) {
          return function () {
            ctrl.$setValidity('url404', bool);
            $utilities.safeApply();
          };
        }
        function setValidity(bool, fields) {
          _.each(fields, function (field) {
            ctrl.$setValidity(field, bool);
          });
        }
        ctrl.$parsers.unshift(function (val) {
          if (!val) {
            setValidity(true, [
              'validUrl',
              'validExt',
              'url404'
            ]);
          } else if (testUrlPatterns(val)) {
            $('<img src=\'' + val + '\'>').error(set404Validity(false)).load(set404Validity(true));
          }
          return val;
        });
      }
    };
  });
});