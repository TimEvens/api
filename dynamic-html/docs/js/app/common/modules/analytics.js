/* -----
 * Apollo Analytics Module
 * Contains all analytics-related directives, filters, and services *
 */
define([
  'angular',
  'underscore'
], function (angular, _) {
  var trackingId;
  angular.module('apollo.analytics', ['apollo.utilities']).factory('$gaMeasurementProtocol', [
    '$http',
    '$window',
    '$utilities',
    function ($http, $window, $utilities) {
      var clientId;
      // Converts field parameters names from the format used with traditional
      // GA to the parameter name format used for the measurement protocol.
      // Supports field parameters used in the pageview, timing and event apis
      function convertFieldParameterNames(oldOptions) {
        var fields = {
            eventAction: 'ea',
            eventCategory: 'ec',
            eventLabel: 'el',
            eventValue: 'ev',
            hitType: 't',
            location: 'dl',
            page: 'dp',
            timingCategory: 'utc',
            timingLabel: 'utl',
            timingValue: 'utt',
            timingVar: 'utv',
            title: 'dt'
          }, formattedOptions = {};
        _.each(oldOptions, function (value, key) {
          if (fields[key]) {
            formattedOptions[fields[key]] = value;
          }
        });
        return formattedOptions;
      }
      function getClientId() {
        var id = $window.localStorage.getItem('_ga');
        if (!id) {
          id = $utilities.uuid4();
          $window.localStorage.setItem('_ga', id);
        }
        return id;
      }
      function send(action, options) {
        var gui = require('nw.gui');
        if (!clientId) {
          clientId = getClientId();
        }
        var params = {
            cd1: gui.App.manifest.version,
            cid: clientId,
            tid: trackingId,
            v: 1
          };
        _.extend(params, convertFieldParameterNames(options));
        $http.get('http://www.google-analytics.com/collect', { params: params });
      }
      return { send: send };
    }
  ]).factory('$ga', [
    '$window',
    '$document',
    '$utilities',
    '$gaMeasurementProtocol',
    function ($window, $document, $utilities, $gaMeasurementProtocol) {
      // Regular Google Analytics does not work with nw.js apps, so use
      // our $gaMeasurementProtocol service if we're in a standalone app.
      // If we're just working on our development machines,
      // just log out what we would send to Google
      if ($utilities.isStandalone && $window.gaTrackingId) {
        trackingId = $window.gaTrackingId;
        $window.ga = $gaMeasurementProtocol.send;
      } else if (!$window.ga) {
        $window.ga = function () {
          console.log('GA - ' + JSON.stringify(arguments));
        };
      }
      return {
        event: function (category, action, label, value) {
          var options = {
              eventAction: action,
              eventCategory: category,
              hitType: 'event'
            };
          if (label) {
            options.eventLabel = label;
          }
          if (value) {
            options.eventValue = value;
          }
          $window.ga('send', options);
        },
        pageview: function (page) {
          var options = {
              hitType: 'pageview',
              location: $window.location.protocol + '//' + $window.location.hostname + $window.location.pathname + $window.location.search,
              page: page || $window.location.pathname + $window.location.search,
              title: $document[0].title
            };
          $window.ga('send', options);
        },
        timing: function (category, variable, value, label, field) {
          var options = {
              hitType: 'timing',
              timingCategory: category,
              timingValue: value,
              timingVar: variable
            };
          if (label) {
            options.timingLabel = label;
          }
          if (field) {
            _.extend(options, field);
          }
          $window.ga('send', options);
        }
      };
    }
  ]).directive('gaCollect', [
    '$ga',
    function ($ga) {
      return {
        restrict: 'A',
        link: function (scope, element, attrs) {
          // get the tag name
          var tagName = element[0].tagName.toLowerCase();
          if (tagName === 'a')
            tagName = 'link';
          element.on('click', function () {
            var clickLabel = attrs.gaCollect;
            if (clickLabel) {
              // Send the Google click event
              $ga.event(tagName, 'click', clickLabel);
            }
          });
        }
      };
    }
  ]);
});