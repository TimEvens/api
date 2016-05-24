define([
  'appModule',
  './createNotification.js',
  './notificationList.js'
], function (app) {
  app.directive('notificationSummary', function ($registry, $notification, $profile, $rootScope) {
    return {
      restrict: 'E',
      templateUrl: $registry.byId('hub').baseUrl + '/js/app/directives/notificationSummary.html',
      scope: {},
      controller: function ($scope) {
        $scope.conversations = [];
        $scope.profile = $profile.getProfile();
        $scope.listOptions = {
          data: 'conversations',
          selectEnabled: false,
          refresh: function () {
            $scope.getConversations();
          }
        };
        $scope.getConversations = function () {
          $notification.read({
            page: 0,
            size: 10,
            sort: 'lastUpdated,desc'
          }).then(function (data) {
            var json = data.data;
            if (json) {
              $scope.conversations = json.content;
              if (json.unreadCount >= 0) {
                $rootScope.unreadNotifications = json.unreadCount;
              }
            }
          });
        };
        $scope.getConversations();
      }
    };
  });
});