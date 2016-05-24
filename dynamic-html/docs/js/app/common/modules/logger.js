define([
  'angular',
  'underscore'
], function (angular, _) {
  angular.module('apollo.logger', []).factory('$logger', function () {
    /**
             *  Log message to console
             *  @param message String to represent the message to be logged
             *  @param level String to represent the level of the meesage
             */
    function _log(message, level) {
      level = level ? level.toLowerCase() : 'info';
      if (_.isObject(message)) {
        console.log(level + ': ');
        console.dir(message);
      } else {
        console.log(level + ': ' + message);
      }
    }
    return {
      log: _log,
      info: function (message, file) {
        _log(message, 'INFO', file);
      },
      debug: function (message, file) {
        _log(message, 'DEBUG', file);
      },
      warn: function (message, file) {
        _log(message, 'WARN', file);
      },
      error: function (message, file) {
        _log(message, 'ERROR', file);
      },
      verbose: function (message, file) {
        _log(message, 'VERBOSE', file);
      }
    };
  });
});