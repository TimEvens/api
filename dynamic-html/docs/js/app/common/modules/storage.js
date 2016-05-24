/* -----
 * Apollo Storage Module
 * Contains functions for saving/retrieving preferences to/from Apollo Database
 */
define([
  'angular',
  'underscore'
], function (angular, _) {
  angular.module('apollo.storage', []).factory('$storage', [
    '$http',
    '$registry',
    function ($http, $registry) {
      var hubUrl = $registry.byId('hub').baseWsUrl;
      var getPrefUrl = _.memoize(function (appId) {
          return [
            hubUrl,
            'pref',
            appId
          ].join('/');
        });
      function StorageApi(appDesc) {
        this.appId = appDesc.appId;
      }
      // Reset a specific app set of preferences to account
      StorageApi.prototype.delete = function () {
        return $http.delete(this._getUrl());
      };
      // Get a prefeference value
      StorageApi.prototype.get = function (name) {
        return $http.get(this._getUrl()).then(function (result) {
          if (result.status === 200) {
            if (name) {
              return result.data[name];
            }
            return result.data;
          }
        });
      };
      StorageApi.prototype._getUrl = function () {
        return getPrefUrl(this.appId);
      };
      StorageApi.prototype.putData = function (data) {
        return $http.put(this._getUrl(), data);
      };
      // Save preferences
      StorageApi.prototype.set = function (key, value) {
        return this.putData(_.zipObject([key], [value]));
      };
      return StorageApi;
    }
  ]);
});