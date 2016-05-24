/**
 * Web Service
 * A generic REST-based Angular service used for CRUD-related operations
 */
define(['appModule'], function (app) {
  app.service('crudService', [
    '$http',
    function ($http) {
      return {
        create: function (url, data, successCallback, errCallback) {
          $http.post(url, JSON.stringify(data)).success(successCallback).error(errCallback);
        },
        read: function (url, params, successCallback, errCallback) {
          var params = params ? params : {};
          params.nocache = new Date().getTime();
          // Needed for stale data issue in IE10/11
          $http.get(url, { 'params': params }).success(successCallback).error(errCallback);
        },
        update: function (url, data, successCallback, errCallback) {
          $http.put(url, JSON.stringify(data)).success(successCallback).error(errCallback);
        },
        delete: function (url, id, successCallback, errCallback) {
          $http.delete(id ? url + '/' + id : url).success(successCallback).error(errCallback);
        }
      };
    }
  ]);
});