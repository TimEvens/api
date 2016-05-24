define([
  'appModule',
  'underscore'
], function (app, _) {
  app.directive('serviceApiDirective', function ($registry, $compile) {
    return {
      restrict: 'E',
      link: function ($scope, $el, attrs) {
        $scope.options = $scope.$eval(attrs.options);
        if ($scope.options.appId) {
          $registry.getServiceApi($scope.options.appId).then(function (service) {
            var method = service[$scope.options.methodName];
            var args = _.isArray($scope.options.args) ? $scope.options.args : [];
            if (_.isFunction(method)) {
              method.apply(service, args).then(function (template) {
                if (_.isString(template)) {
                  $el.replaceWith($compile(template)($scope));
                }
              });
            }
          });
        }
      }
    };
  });
});