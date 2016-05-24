define([
  'angular',
  'underscore',
  './js/app/common/modules/collect-utilities.js'
], function (angular, _, collectUtilities) {
  angular.module('apollo.collect', [
    'apollo.sa.updater',
    'apollo.utilities',
    'apollo.profile',
    'apollo.logger'
  ]).factory('$apolloCollect', [
    '$updater',
    '$utilities',
    '$profile',
    '$logger',
    '$window',
    '$http',
    function ($updater, $utilities, $profile, $logger, $window, $http) {
      var collectionUrl;
      var queue = [];
      function send() {
        collectUtilities.detailDefaults = {
          sessionId: $profile.getSessionId(),
          cpr: $profile.getProfile().cpr,
          applicationVersion: require('nw.gui').App.manifest.version,
          isStandalone: $utilities.isStandalone
        };
        var data = collectUtilities.composeData.apply(collectUtilities, arguments);
        if ($window.gaTrackingId) {
          if (collectionUrl) {
            $http.post(collectionUrl, data);
          } else {
            queue.push(arguments);
          }
        } else {
          $logger.info('AC - ' + JSON.stringify(data), false);
        }
      }
      if ($window.gaTrackingId) {
        $updater.getManifest('apolloCollect').then(function (result) {
          collectionUrl = result.url;
          if (queue.length) {
            _.each(queue, function (eventInfo) {
              send.apply(this, eventInfo);
            });
            queue = [];
          }
        });
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