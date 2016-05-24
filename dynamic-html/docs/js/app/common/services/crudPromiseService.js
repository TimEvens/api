/**
 * Web Service
 * A generic REST-based Angular service used for CRUD-related operations
 */
define([
  'appModule',
  'underscore'
], function (app, _) {
  app.service('crudPromiseService', [
    '$http',
    '$q',
    function ($http, $q) {
      return {
        create: function (url, data) {
          return $http.post(url, JSON.stringify(data));
        },
        read: function (url, params) {
          var params = params ? params : {};
          params.nocache = new Date().getTime();
          // Needed for stale data issue in IE10/11
          return $http.get(url, { 'params': params });
        },
        update: function (url, data) {
          return $http.put(url, JSON.stringify(data));
        },
        delete: function (url, id) {
          var promises = [];
          if (id) {
            _.each(_.castArray(id), function (id) {
              promises.push($http.delete(url + '/' + id));
            });
            return $q.all(promises);
          } else {
            return $q.reject('Delete collection operation failed: Invalid / no IDs given.');
          }
        }
      };
    }
  ]);
});