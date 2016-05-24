define([
  'appModule',
  'underscore'
], function (app, _) {
  app.controller('profileController', function ($scope, $profile, $http, $toast) {
    $scope.user = _.clone($profile.getProfile());
    var origAvatarUrl = $scope.user.avatarUrl;
    $scope.user.useGravatar = false;
    if ($scope.user.avatarUrl && $scope.user.avatarUrl.indexOf('gravatar') !== -1) {
      $scope.user.useGravatar = true;
    }
    $scope.save = function () {
      $profile.updateProfile(_.omit($scope.user, 'useGravatar')).then($scope.$close).catch(_.partial($toast.post, {
        msg: 'Profile update failed.',
        severity: 'error'
      }));
    };
    $scope.toggleGravatar = function () {
      $scope.user.useGravatar = !$scope.user.useGravatar;
      $scope.user.avatarUrl = $scope.user.useGravatar ? $profile.getGravatarUrl($scope.user.email) : origAvatarUrl;
    };
  });
});