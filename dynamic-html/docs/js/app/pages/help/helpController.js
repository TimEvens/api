define(['appModule'], function (app) {
  app.controller('helpController', [
    '$scope',
    '$registry',
    function ($scope, $registry) {
      $scope.appVersion = $registry.byId('hub').version;
    }
  ]);
});