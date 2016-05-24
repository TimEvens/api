/* -----
 * Apollo Profile Module
 * Contains functions for retrieving the user profile and account information
 */
define([
  'angular',
  'underscore',
  'md5'
], function (angular, _) {
  angular.module('apollo.profile', []).factory('$profile', [
    '$http',
    '$registry',
    '$utilities',
    function ($http, $registry, $utilities) {
      var baseWsUrl = $registry.byId('hub').baseWsUrl;
      var hubAdmin = $registry.byId('hubAdmin');
      var psirtUpdateURL;
      if (hubAdmin) {
        psirtUpdateURL = hubAdmin.baseWsUrl + '/account/ib';
      }
      function calcGravatarHash(email) {
        return email ? CryptoJS.MD5(email.trim().toLowerCase()) : '';
      }
      return {
        getBearerToken: function () {
          return cisco.bearerToken;
        },
        getProfile: function () {
          return cisco.user;
        },
        getProfileCaseFlag: function () {
          var flag = _.get(cisco, 'user.cpr.pf_auth_casemanagement');
          return flag ? parseInt(flag, 10) : 3;
        },
        getProfileFullname: function (user) {
          user = user || cisco.user;
          var firstname = user.firstName || user.cpr.pf_auth_firstname;
          var lastname = user.lastName || user.cpr.pf_auth_lastname;
          return firstname && lastname ? $utilities.toProperCase(firstname + ' ' + lastname) : user.cpr.pf_auth_uid;
        },
        getAccount: function () {
          return cisco.account;
        },
        getDefaultAvatar: function () {
          return $registry.byId('hub').baseUrl + '/img/default-avatar.gif';
        },
        getGravatarUrl: function (email) {
          return 'http://www.gravatar.com/avatar/' + calcGravatarHash(email) + '.jpg?s=80';
        },
        getSessionId: function () {
          if (!cisco.user.sessionId || !cisco.user.sessionId.session) {
            cisco.user.sessionId = { session: $utilities.uuid4() };
          }
          return cisco.user.sessionId;
        },
        accountUpdated: function () {
          return $http.post(psirtUpdateURL);
        },
        updateCpr: function (cpr) {
          _.extend(cisco.user, { cpr: cpr });
        },
        updateProfile: function (update) {
          update.fullname = this.getProfileFullname(update);
          return $http.put(baseWsUrl + '/profile', update).then(function () {
            _.extend(cisco.user, update);
          });
        },
        updateSessionId: function (ids) {
          _.extend(cisco.user, { sessionId: ids });
        },
        updateProfileFullname: function () {
          cisco.user.fullname = this.getProfileFullname();
        }
      };
    }
  ]);
});