define(['appModule'], function (app) {
  app.controller('versionController', [
    '$log',
    '$scope',
    function ($log, $scope) {
      $scope.setPageTitle('Apollo Versions');
      $scope.apps = cisco.apps;
      $scope.controller = cisco.controller;
    }
  ]);
});