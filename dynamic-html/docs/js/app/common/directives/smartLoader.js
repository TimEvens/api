define(['appModule'], function (app) {
  app.directive('smartLoader', function () {
    return {
      template: '<div style="position: absolute; margin: auto; top: 150px; left: 0px; right: 0px; bottom: 0px; width: 300px; height: 0px;" class="sample-show-hide">' + '<h3 ng-show="isLoading" class="text-muted ng-hide" style="text-align:center;">' + '<img src="https://swtgdev-apollo-1.cisco.com/img/ajax-loader.gif" />&nbsp;{{ loadingText }}' + '</h3>' + '</div>',
      restrict: 'E',
      replace: true,
      scope: true,
      link: function ($scope, el, attrs) {
        if (attrs.ngModel) {
          $scope.loadingText = attrs.loadingText || 'Loading...';  //$scope.$watch(attrs.ngModel, function(isLoading) {
                                                                   //    $scope.isLoading = isLoading;
                                                                   //});
        }
      }
    };
  });
});