define(['appModule'], function (app) {
  app.directive('focusFirst', function ($timeout) {
    return {
      restrict: 'AC',
      link: function (scope, el) {
        $timeout(function () {
          el[0].focus();
        }, 0);
      }
    };
  });
});