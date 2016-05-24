/* -----
 * Apollo Registry Module
 * Acts as the bridge between apps enabling inter-app communication
 * Applications which require inter-app communications should use DI to access this service
 */
define([
  'angular',
  'underscore'
], function (angular, _) {
  angular.module('apollo.registry', []).factory('$registry', [
    '$log',
    '$injector',
    '$q',
    function ($log, $injector, $q) {
      var apps = cisco.apps;
      // Asynchronously (via Require) loads any Service APIs and then adds that service instance
      // to the app object. This enables app-to-app communications w/o having to use dependency
      // injection. The reason we do this is because in Apollo there is no guarantee that the
      // app which you wish to communicate with has been loaded into the system. When that
      // happens dependency injection will fail causing the entire page to fail. To use this
      // Service API your code should use the $registry.byId() function and then check for the
      // existence of the Service API instance. If no instance then handle it gracefully.
      //
      //     var serviceInstance = $registry.byId('hub').service;
      //     if (serviceInstance) {
      //         serviceInstance.addNotification(...);
      //     }
      function loadServiceApi(app) {
        var deferred = $q.defer();
        if (app && app.service) {
          deferred.resolve(app.service);  // Return immediately if we have previously loaded this service api
        } else {
          if (app && app.serviceApi) {
            var api = app.baseUrl + '/' + app.serviceApi + '.js';
            var serviceName = app.appId + 'ServiceApi';
            requirejs([api], function () {
              if ($injector.has(serviceName)) {
                app.service = $injector.get(serviceName);
                deferred.resolve(app.service);
              } else {
                deferred.reject('Failed to load service api for app ' + app.appId + '. Service api not found for service name ' + serviceName);
              }
            }, function (err) {
              console.log('loadServiceApi:: ' + err + ', api = ' + api + ', serviceName = ' + serviceName);
              deferred.reject(err);
            });
          } else {
            deferred.reject('Failed to load service api. Invalid app or service api was empty');
          }
        }
        return deferred.promise;
      }
      return {
        byId: function (id) {
          return _.find(apps, { appId: id });
        },
        getServiceApi: function (id) {
          return loadServiceApi(this.byId(id));
        },
        getApps: function () {
          return apps;
        },
        invoke: function (func, args, scope) {
          if (func && typeof func === 'function') {
            return func.apply(scope, args);
          }
          var deferred = $q.defer();
          deferred.reject('invalid/unknown function');
          return deferred.promise;
        }
      };
    }
  ]);
});