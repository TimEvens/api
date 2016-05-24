/* -----
 * Apollo Notification Module
 * Contains the Notification ($notification) service which can be used for all notification-related
 * CRUD (create/read/update/delete) operations
 * Requires the Registry, and Profile modules
 *
 * Sample URL:
 *      https://swtgdev-apollo-1.cisco.com/hub/ws/hub-1-3-201407-kbroich/rest/message?cache=false&page=0&size=12&sort=lastUpdated,des
 *
 * Data Model:
 *      {
 *          "content":[{
 *              "id":"53baef03e4b083816f98fba7",
 *              "subject":"Testing HTML in Notification Body",
 *              "messages":[{
 *                  "messageId":"53baef03e4b083816f98fba8",
 *                  "conversationId":"53baef03e4b083816f98fba7",
 *                  "from":{
 *                      "name":"Kevin Broich",
 *                      "userId":"53b447fee4b0ba57229cbc73"
 *                  },
 *                  "body":"Cisco Security Intelligence Operations has detected spam email messages",
 *                  "icon":null,
 *                  "severity":"error",
 *                  "error":null,
 *                  "status":null,
 *                  "created":1404329141056
 *              }],
 *              "lastUpdated":1404329141134,
 *              "category":"security",
 *              "icon":null,
 *              "readStatus":[{
 *                  "messageId":"53b45cb5e4b0e55acfed5276",
 *                  "userId":"53b447fee4b0ba57229cbc73",
 *                  "status":1,
 *                  "dateRead":1404749374876
 *              }],
 *              "to":[
 *                  {"name":"Antonio Carola","userId":"52fd9478e4b0d2a234a97a1a"},
 *                  {"name":"Peter Ryan","userId":"530f6420e4b00611cbe08801"},
 *                  {"name":"Oscar Bauer","userId":"532326f5e4b02c44f4340bc5"}
 *              }]
 *          }],
 *          "totalForUser":1,
 *          "unreadCount":0,
 *          "sort":[{
 *              "direction":"DESC",
 *              "property":"lastUpdated",
 *              "ignoreCase":false,
 *              "ascending":false
 *          }],
 *          "numberOfElements":1,
 *          "totalElements":1,
 *          "totalPages":1,
 *          "lastPage":true,
 *          "firstPage":true,
 *          "size":12,
 *          "number":0
 *      }
 */
define([
  'angular',
  'underscore',
  'moment'
], function (angular, _, moment) {
  angular.module('apollo.notification', [
    'apollo.registry',
    'apollo.profile',
    'apollo.i18n',
    'apollo.activity'
  ]).factory('$notification', [
    '$http',
    '$rootScope',
    '$q',
    '$filter',
    '$registry',
    '$profile',
    '$activity',
    function ($http, $rootScope, $q, $filter, $registry, $profile, $activity) {
      var $i18n = $filter('i18n');
      function postDeleteActivity(notifications) {
        var title = '', msg = '';
        if (notifications.length === 1) {
          title = $i18n('_NotificationDeleted_');
          msg = $i18n('_HUNotificationsDeletedSingle_', notifications[0].subject);
        } else if (notifications.length > 1) {
          title = $i18n('_NotificationsDeleted_');
          msg = $i18n('_HUNotificationsDeletedMulti_', notifications.length);
        }
        $activity.post({
          title: title,
          msg: msg,
          type: 'User',
          priority: 'info'
        });
      }
      return {
        _url: $registry.byId('hub').baseWsUrl + '/message',
        NOTIFICATION_TYPES: {
          security: {
            value: 'security',
            displayName: $i18n('_Security_'),
            iconClass: 'icon-lock',
            tooltip: $i18n('_TypeSecurity_')
          },
          warranty: {
            value: 'warranty',
            displayName: $i18n('_Warranty_'),
            iconClass: 'icon-certified',
            tooltip: $i18n('_TypeWarranty_')
          },
          contract: {
            value: 'contract',
            displayName: $i18n('_Contract_'),
            iconClass: 'icon-briefcase',
            tooltip: $i18n('_TypeContract_')
          },
          eox: {
            value: 'eox',
            displayName: $i18n('_EOX_'),
            iconClass: 'icon-calendar',
            tooltip: $i18n('_TypeEOX_')
          },
          software: {
            value: 'software',
            displayName: $i18n('_Software_'),
            iconClass: 'icon-software',
            tooltip: $i18n('_TypeSoftware_')
          },
          miscellaneous: {
            value: 'miscellaneous',
            displayName: $i18n('_Misc_'),
            iconClass: 'icon-folder',
            tooltip: $i18n('_Miscellaneous_')
          }
        },
        NOTIFICATION_SEVERITIES: {
          ERROR: {
            value: 1,
            mapValue: 'ERROR',
            displayName: $i18n('_Critical_'),
            cssClass: 'danger',
            iconClass: 'icon-exclamation-circle',
            tooltip: $i18n('_Severity1_')
          },
          WARN: {
            value: 2,
            mapValue: 'WARN',
            displayName: $i18n('_Warning_'),
            cssClass: 'warning',
            iconClass: 'icon-exclamation-triangle',
            tooltip: $i18n('_Severity2_')
          },
          INFO: {
            value: 3,
            mapValue: 'INFO',
            displayName: $i18n('_Informational_'),
            cssClass: 'info',
            iconClass: 'icon-info-circle',
            tooltip: $i18n('_Severity3_')
          },
          SUCCESS: {
            value: 4,
            mapValue: 'SUCCESS',
            displayName: $i18n('_Success_'),
            cssClass: 'success',
            iconClass: 'icon-check-circle',
            tooltip: $i18n('_Severity4_')
          }
        },
        markAsRead: function (id) {
          if ($rootScope.unreadNotifications > 0) {
            $rootScope.unreadNotifications--;
          }
          return $http.put(this._url + '/markRead/' + id, null);
        },
        getUnreadCount: function () {
          return $http.get(this._url + '/unread', { 'cache': false });
        },
        severities: function () {
          return _.chain(this.NOTIFICATION_SEVERITIES).map(function (severity) {
            severity.filter = true;
            severity.count = 0;
            return severity;
          }).sortBy('sortValue').value();
        },
        create: function (options) {
          var category = options.category ? options.category.toLowerCase() : '';
          var severity = options.severity || '';
          if (_.isNaN(severity)) {
            severity = this.NOTIFICATION_SEVERITIES[severity.toUpperCase()].value;
          }
          var user = $profile.getProfile();
          var fancyName = user.firstName ? user.firstName + ' ' + user.lastName : user.userId;
          return $http.post(this._url, {
            subject: options.title || '',
            category: category,
            messages: [{
                from: {
                  name: fancyName,
                  userId: user.id
                },
                body: options.msg || '',
                severity: severity,
                created: moment().valueOf()
              }],
            to: options.to
          });
        },
        read: function (cfg) {
          return $http.get(this._url, {
            params: _.defaults(cfg, {
              sort: 'lastUpdated,desc',
              cache: false
            })
          });
        },
        counts: function (cfg) {
          return $http.get(this._url + '/count', { params: cfg || {} });
        },
        readOne: function (id) {
          return $http.get(this._url + '/' + id, { cache: false });
        },
        update: function (data) {
          return $http.put(this._url, data);
        },
        delete: function (notifications) {
          notifications = _.castArray(notifications);
          if (notifications) {
            return $q.all(_.map(notifications, function (notification) {
              return $http.delete(this._url + '/' + notification._id);
            }, this)).then(_.partial(postDeleteActivity, notifications)).catch(_.bind(console.log, console));
          } else {
            return $q.reject('Delete notification operation failed: Invalid / no IDs given.');
          }
        }
      };
    }
  ]);
});