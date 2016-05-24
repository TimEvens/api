/* -----
 * Apollo Activity Module
 * Contains all activity-related directives, filters, and services
 * Requires the Registry, Profile, and Toast modules
 */
define([
  'angular',
  'moment',
  'underscore'
], function (angular, moment, _) {
  angular.module('apollo.activity', [
    'apollo.registry',
    'apollo.profile',
    'apollo.toast'
  ]).factory('$activity', [
    '$http',
    '$registry',
    '$profile',
    '$toast',
    '$rootScope',
    function ($http, $registry, $profile, $toast, $rootScope) {
      return {
        post: function (options) {
          var user = $profile.getProfile(), fancyName = user.firstName !== '' ? user.firstName + ' ' + user.lastName + ' (' + user.userId + ')' : user.userId, notifyUser = _.has(options, 'notifyUser') ? options.notifyUser : true;
          var hub = $registry.byId('hub');
          if (hub) {
            $http.post(hub.baseWsUrl + '/activities', {
              title: options.title,
              description: options.msg.replace(/\.$/, '') + ' by user ' + user.userId + '.',
              type: options.type,
              details: options.details || '',
              iconUrl: user.avatarUrl || 'img/nophoto-small.jpg',
              userId: user.userId,
              sessionName: options.sessionName || '',
              userName: fancyName,
              timestamp: moment().unix(),
              connectionType: options.connectionType,
              port: options.port
            }).then(function (ret) {
              if (ret.status === 201) {
                // Notifies Activity widget to refresh
                $rootScope.$broadcast('activities.refresh');
                var shortMsg = options.msg.length >= 200 ? options.msg.substr(0, 200) + '...' : options.msg;
                if (notifyUser) {
                  $toast.post({
                    title: options.title,
                    msg: shortMsg,
                    sticky: options.sticky || false,
                    severity: options.severity || 'info'
                  });
                }
              }
            });
          }
        },
        read: function (url, params) {
          var params = params ? params : {};
          params.nocache = new Date().getTime();
          // Needed for stale data issue in IE10/11
          return $http.get(url, { 'params': params });
        }
      };
    }
  ]);
});