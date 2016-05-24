/* -----
 * Apollo Property Module
 * Contains functions for retrieving the application-specific properties which can be
 * specified in each application's appDescriptor.json file 
 */
define([
  'angular',
  'underscore'
], function (angular, _) {
  angular.module('apollo.property', []).factory('$property', [
    '$registry',
    function ($registry) {
      return {
        byName: function (appId, name, args) {
          var app = $registry.byId(appId) || {}, prop = _.find(app.properties, { name: name });
          args = args || [];
          if (prop && prop.value) {
            // Replace all placeholders (e.g. {0}, {1}) with values passed in the args array
            return prop.value.replace(/{\d}/g, function (match) {
              return args[parseInt(match.slice(1), 10)];
            });
          }
          return '';
        }
      };
    }
  ]);
});