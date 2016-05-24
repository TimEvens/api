define([
  'appModule',
  'underscore',
  'crudService'
], function (app, _) {
  var ERROR = 1;
  function CreateNotificationController($scope, $registry, $profile, $notification, $log, crudService) {
    var baseUrl = $registry.byId('hubAdmin').baseWsUrl, userProfile = $profile.getProfile();
    function formatName(user) {
      return user.firstName ? user.firstName + ' ' + user.lastName : user.userId;
    }
    function getUsersFailure() {
      $log.error('Failed to fetch users for this account');
    }
    function getUsersSuccess(data) {
      var users = data.content;
      $scope.recipients = $scope.recipients.concat(_.map(users, function (user) {
        return {
          data: user,
          id: user._id,
          userId: user.userId,
          value: formatName(user)
        };
      }));
    }
    $scope.addMsg = function () {
      var newNotification = {
          category: $scope.notification.type.value,
          messages: [{
              body: $scope.notification.body,
              from: {
                name: '',
                userId: userProfile.userId
              },
              $severity: $scope.notification.severity.value
            }],
          msg: $scope.notification.body,
          severity: $scope.notification.severity.value,
          title: $scope.notification.subject,
          to: null
        };
      if ($scope.notification.recipient.id) {
        newNotification.to = [{
            name: formatName($scope.notification.recipient),
            userId: $scope.notification.recipient.id
          }];
      }
      $notification.create(newNotification).then($scope.$close);
    };
    $scope.recipients = [{
        id: '',
        value: 'All Users'
      }];
    crudService.read(baseUrl + '/account/users', null, getUsersSuccess, getUsersFailure);
    $scope.severities = $notification.NOTIFICATION_SEVERITIES;
    $scope.types = $notification.NOTIFICATION_TYPES;
    $scope.notification = {
      body: '',
      fromId: userProfile.userId,
      recipient: $scope.recipients[0],
      severity: _.find($scope.severities, { value: ERROR }),
      subject: '',
      type: $scope.types.security
    };
  }
  app.directive('createNotification', function ($modal, $registry) {
    return {
      scope: true,
      restrict: 'A',
      link: function ($scope, element, attrs) {
        element.on('click', function () {
          $modal.open({
            controller: CreateNotificationController,
            templateUrl: $registry.byId('hub').baseUrl + '/js/app/directives/createNotification.html'
          }).result.then(function () {
            $scope.$eval(attrs.createNotification);
          });
        });
      }
    };
  });
});