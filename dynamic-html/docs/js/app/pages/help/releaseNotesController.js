define(['appModule'], function (app) {
  app.controller('releaseNotesController', function ($scope, $http) {
    $http.get('/docs/ReleaseNotes/cway.json').then(function (res) {
      $scope.releaseData = res.data;
    });
  });
});