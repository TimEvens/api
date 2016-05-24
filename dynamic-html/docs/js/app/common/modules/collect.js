define([
  'angular',
  'underscore',
  'collectUtilities'
], function (angular, _, collectUtilities) {
  angular.module('apollo.collect', [
    'apollo.registry',
    'apollo.utilities',
    'apollo.profile',
    'apollo.logger'
  ]).factory('$apolloCollect', [
    '$registry',
    '$utilities',
    '$profile',
    '$logger',
    '$window',
    '$http',
    function ($registry, $utilities, $profile, $logger, $window, $http) {
      var hub = $registry.byId('hub'), collectionUrl = hub.baseWsUrl + '/collect/send';
      collectUtilities.detailDefaults = {
        sessionId: $profile.getSessionId(),
        cpr: $profile.getProfile().cpr,
        applicationVersion: hub.version,
        isStandalone: $utilities.isStandalone
      };
      function send() {
        var data = collectUtilities.composeData.apply(collectUtilities, arguments);
        if ($window.GoogleAnalyticsObject) {
          $http.post(collectionUrl, data);
        } else {
          $logger.info('AC - ' + JSON.stringify(data), false);
        }
      }
      return {
        send: send,
        error: function () {
          send(collectUtilities.error.apply(collectUtilities, arguments));
        },
        timing: function () {
          send(collectUtilities.timing.apply(collectUtilities, arguments));
        }
      };
    }
  ]);
});