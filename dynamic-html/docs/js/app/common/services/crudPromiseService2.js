define([
  'appModule',
  'underscore'
], function (app, _) {
  app.factory('crudPromiseService2', function ($http, $q) {
    function CrudPromiseService(url) {
      this.url = url;
    }
    CrudPromiseService.prototype.create = function (data) {
      if (data) {
        return $q.all(_.map(_.castArray(data), function (item) {
          return $http.post(this.url + '/' + item);
        }, this));
      } else {
        return $q.reject('Delete operation failed: Invalid / no IDs given.');
      }
    };
    CrudPromiseService.prototype.read = function (params) {
      params = params || {};
      // Needed for stale data issue in IE11:
      params.nocache = _.now();
      return $http.get(this.url, { 'params': params });
    };
    CrudPromiseService.prototype.update = function (data) {
      return $http.put(this.url, data);
    };
    /**
          Removes one or more items
          **/
    CrudPromiseService.prototype.delete = function (id) {
      if (id) {
        return $q.all(_.map(_.castArray(id), function (item) {
          return $http.delete(this.url + '/' + item);
        }, this));
      } else {
        return $q.reject('Delete operation failed: Invalid / no IDs given.');
      }
    };
    return CrudPromiseService;
  });
});