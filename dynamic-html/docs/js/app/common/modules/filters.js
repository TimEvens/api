/* -----
 * Apollo Filters Module
 * Contains common filters which are loaded at app startup
 */
define([
  'angular',
  'underscore',
  'moment'
], function (angular, _, moment) {
  var app = angular.module('apollo.filters', []);
  // Filter that sorts associative arrays (object hashes)
  app.filter('orderObjectBy', function () {
    return function (items, field, reverse) {
      var sorted = _.sortBy(items, field);
      return reverse ? sorted.reverse() : sorted;
    };
  });
  app.filter('parseUrlFilter', function () {
    var urlPattern = /(<a.*?href=("|'))?(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/gi;
    return function (text, target, shorten) {
      target = target || '';
      return _.reduce(text.match(urlPattern), function (memo, url) {
        var link;
        //ignore urls in href attributes
        if (url.charAt(0) === '<') {
          return memo;
        }
        link = '<a target="' + target + '" href="' + url + '">';
        link += shorten ? _.compact(url.split('/')).pop() : url;
        link += '</a>';
        return memo.replace(url, link);
      }, text);
    };
  });
  app.filter('properCase', [
    '$utilities',
    function ($utilities) {
      return function (text) {
        return $utilities.toProperCase(text);
      };
    }
  ]);
  app.filter('htmlToText', function () {
    return function (text) {
      return String(text).replace(/<[^>]+>/gm, '');
    };
  });
  app.filter('slice', function () {
    return function (arr, start, end) {
      return arr.slice(start, end);
    };
  });
  app.filter('fileSize', function () {
    return function (size) {
      if (!_.isUndefined(size)) {
        var unit = _.find([
            'B',
            'KB',
            'MB',
            'GB',
            'TB'
          ], function () {
            if (size / 1024 >= 1) {
              size /= 1024;
              return false;
            }
            return true;
          });
        return Math.round(parseFloat(size.toFixed(2)) * 10) / 10 + ' ' + unit;
      }
    };
  });
  app.filter('fromNow', function () {
    function fromNow(date, unix) {
      return moment(unix ? date * 1000 : date).zone('-08:00').fromNow();
    }
    fromNow.$stateful = true;
    return fromNow;
  });
  app.filter('guidFromNow', function () {
    // For getting timestamps from Mongo GUIDs
    return function (id) {
      var ts = id.toString().substring(0, 8);
      return moment(new Date(parseInt(ts, 16) * 1000)).zone('-08:00').fromNow();
    };
  });
  app.filter('urlToHttps', function () {
    return function (url) {
      return String(url).replace(/^http/, 'https');
    };
  });
  /**
    * Formats number larger than or equal to max to become truncated and appended with a 'K'.
    * i.e. 10K
    * Will round to nearest 100 at values above max.
    * i.e. 12.1K
    * Does not take into account numbers into the millions and beyond.
    */
  app.filter('truncatePartialInt', function () {
    return function (value, max) {
      if (value <= max) {
        return value;
      } else {
        return Math.round(parseFloat(value) / 100) / 10 + 'K';
      }
    };
  });
});