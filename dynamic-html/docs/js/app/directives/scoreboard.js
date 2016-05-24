define([
  'appModule',
  'underscore'
], function (app, _) {
  app.directive('scoreboard', function ($registry, $collections, $filter) {
    return {
      restrict: 'E',
      templateUrl: $registry.byId('hub').baseUrl + '/js/app/directives/scoreboard.html',
      scope: {},
      link: function ($scope) {
        var $i18n = $filter('i18n');
        $scope.COLLECTION_TYPES = {
          ib: {
            iconClass: 'icon-devices',
            tooltip: $i18n('_DeviceCollection_')
          },
          supportCases: {
            iconClass: 'icon-notes',
            tooltip: $i18n('_SupportCaseCollection_')
          }
        };
        $collections.read({ size: 10000 }).then(function (res) {
          var data = res.data;
          if (data.content) {
            $scope.collections = _.chain(data.content).filter({ isTile: true }).take(10).each(function (collection) {
              collection.count = 0;
              $collections.getCount(collection).then(function (count) {
                if (_.isNumber(count)) {
                  collection.count = count;
                }
              });
            }).value();
          }
        });
      }
    };
  });
});