define([
  'appModule',
  'smartTimeline',
  'crudPromiseService2',
  'formatDate'
], function (app) {
  app.directive('activitySummary', function ($registry) {
    var hub = $registry.byId('hub');
    return {
      restrict: 'E',
      templateUrl: hub.baseUrl + '/js/app/directives/activitySummary.html',
      scope: {},
      controller: function ($scope, crudPromiseService2, smartPager) {
        $scope.timelineOptions = {
          data: 'pager.data',
          template: [
            '<div class="notification__icon" title="{{ event.type }}">',
            '<span ng-class="typeClasses[event.type]"></span>',
            '</div>',
            '<div class="notification__body">',
            '<span ng-bind="event.title"></span>&nbsp;',
            '<span class="text-muted" title="{{ event.description | htmlToText }}" ng-bind-html="event.description"></span>',
            '</div>',
            '<div class="notification__timestamp" ng-bind="event.timestamp | fromNowNoZone:true" title="{{ event.timestamp | formatDateNoZone:\'LLL\':true }}"></div>'
          ].join('')
        };
        $scope.pager = new smartPager({
          params: {
            sort: {
              value: 'timestamp',
              direction: 'desc'
            },
            size: 10
          },
          service: new crudPromiseService2(hub.baseWsUrl + '/activities'),
          autoLoad: true
        });
        $scope.typeClasses = {
          Device: 'icon-devices',
          Support: 'icon-notes',
          Software: 'icon-software',
          Collection: 'icon-grid-view',
          Session: 'icon-terminalalt',
          'Session-Connect': 'icon-terminalalt',
          User: 'icon-user',
          Storage: 'icon-cloud'
        };
      }
    };
  });
});