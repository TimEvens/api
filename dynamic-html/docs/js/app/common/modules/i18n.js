/* -----
 * Apollo Internationalization Module
 */
define([
  'angular',
  'underscore'
], function (angular, _) {
  angular.module('apollo.i18n', []).factory('$i18n', [
    '$http',
    function ($http) {
      var DEFAULT_LANG = 'en-us';
      window.cisco = window.cisco || {};
      cisco.locale = {
        dictionary: [],
        loaded: []
      };
      return {
        loadBundle: function (resourceUrl) {
          return this.fetchBundle({
            baseUrl: resourceUrl,
            appId: resourceUrl
          });
        },
        fetchBundle: function (app, language) {
          language = language || this.getPreferredLang();
          return $http.get(app.baseUrl + '/i18n/resources-locale_' + language + '.json').then(function (result) {
            if (result) {
              cisco.locale.dictionary = cisco.locale.dictionary.concat(result.data || []);
              cisco.locale.loaded.push(app.appId);
            }
          });
        },
        getPreferredLang: function () {
          var val = _.chain(window.navigator).pick([
              'languages',
              'language',
              'browserLanguage',
              'userLanguage',
              'systemLanguage'
            ]).values().flatten().compact().uniq().first().value();
          return val ? val.toLowerCase() : DEFAULT_LANG;
        },
        getString: function (val) {
          var entry;
          if (entry = _.find(cisco.locale.dictionary, { key: val })) {
            return _.reduce(_.tail(arguments), function (memo, variable, i) {
              return memo.replace(new RegExp('\\{' + i + '\\}', 'g'), variable);
            }, entry.value);
          }
          return '';
        },
        getDictionary: function () {
          return cisco.locale.dictionary;
        }
      };
    }
  ]).filter('i18n', [
    '$i18n',
    function ($i18n) {
      return $i18n.getString;
    }
  ]);
});