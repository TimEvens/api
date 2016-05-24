define(['appModule'], function (app) {
  app.directive('simpleTimeline', function () {
    return {
      template: [
        '<div class="notifications">',
        '<div class="notification" ng-repeat="event in events" ng-compile="options.template"></div>',
        '</div>'
      ].join(''),
      restrict: 'E',
      scope: true,
      link: function ($scope, el, attrs) {
        $scope.options = $scope.$eval(attrs.options);
        $scope.$watch($scope.options.data, function (n) {
          $scope.events = n;
        });
      }
    };
  });
});