define([
  'appModule',
  'underscore',
  'moment',
  'formatDate',
  'truncate'
], function (app, _, moment) {
  app.directive('notificationList', function ($registry, $notification, $profile, $modal) {
    var hub = $registry.byId('hub');
    return {
      restrict: 'E',
      scope: true,
      replace: true,
      templateUrl: hub.baseUrl + '/js/app/directives/notificationList.html',
      link: function ($scope, $el, attrs) {
        $scope.options = $scope.$eval(attrs.options);
        $scope.isDashboard = !$scope.options.selectEnabled;
        $scope.profile = $profile.getProfile();
        $scope.types = $notification.NOTIFICATION_TYPES;
        $scope.severitiesByValue = _.keyBy($notification.severities(), 'value');
        $scope.toggleSelected = function (e, conversation) {
          if ($scope.options.selectEnabled) {
            conversation.selected = !conversation.selected;
            $scope.$emit('selectionUpdated', conversation);
            e.preventDefault();
            e.stopPropagation();
          }
        };
        $scope.delete = function (conversations) {
          conversations = _.castArray(conversations);
          return $modal.open({
            templateUrl: hub.baseUrl + '/js/app/modals/notificationDelete.html',
            controller: [
              '$scope',
              function (scope) {
                scope.conversations = conversations;
              }
            ]
          }).result.then(function () {
            return $notification.delete(conversations).then(function () {
              $scope.options.refresh();
            });
          });
        };
        $scope.options.delete = $scope.delete;
        $scope.markAsRead = function (messageId, obj) {
          $notification.markAsRead(messageId).then(function () {
            obj.status = true;
            obj.dateRead = moment().valueOf();
          });
        };
        $scope.viewDetails = function (conversation) {
          $modal.open({
            templateUrl: hub.baseUrl + '/js/app/modals/notificationDetail.html',
            scope: $scope,
            controller: [
              '$scope',
              function (scope) {
                scope.notification = conversation;
                scope.delete = function () {
                  $scope.delete(conversation).then(scope.$close);
                };
              }
            ]
          });
        };
        $scope.$watch($scope.options.data, function (n) {
          $scope.data = n;
        });
      }
    };
  });
});