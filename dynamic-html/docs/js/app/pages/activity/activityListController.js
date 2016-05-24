define([
  'appModule',
  'smartTimeline',
  'crudPromiseService2',
  'formatDate'
], function (app) {
  app.controller('activityListController', function ($scope, $registry, crudPromiseService2, smartPager, $filter) {
    var baseUrl = $registry.byId('hub').baseWsUrl;
    var restUrl = baseUrl + '/activities';
    var pageSize = 50;
    var $i18n = $filter('i18n');
    $scope.toolbarOptions = {
      title: $i18n('_Activity_'),
      select: false
    };
    $scope.searchOptions = {
      value: 'pager.params.search',
      placeholder: 'Search'
    };
    $scope.sortOptions = {
      value: 'pager.params.sort',
      columns: [{
          name: $i18n('_Timestamp_'),
          value: 'timestamp'
        }]
    };
    $scope.filterOptions = {
      activeFilters: 'pager.params.filter',
      clearFilters: function (keys) {
        $scope.pager.clearFilters(keys);
      },
      filters: [{
          label: $i18n('_ActivityType_'),
          value: 'type',
          values: [
            {
              label: $i18n('_Device_'),
              value: 'Device'
            },
            {
              label: $i18n('_Support_'),
              value: 'Support'
            },
            {
              label: $i18n('_Software_'),
              value: 'Software'
            },
            {
              label: $i18n('_Collection_'),
              value: 'Collection'
            },
            {
              label: $i18n('_Session_'),
              value: 'Session'
            },
            {
              label: $i18n('_User_'),
              value: 'User'
            },
            {
              label: $i18n('_Storage_'),
              value: 'Storage'
            }
          ]
        }]
    };
    $scope.$on('searchUpdated', function (e, search) {
      $scope.pager.search(search);
    });
    $scope.$on('sortUpdated', function (e, sort) {
      $scope.pager.sort(sort);
    });
    $scope.$on('filterUpdated', function (e, field, value, checked) {
      $scope.pager.filter(field, value, checked);
    });
    $scope.$on('selectionUpdated', function () {
      $scope.pager.updateSelected();
    });
    $scope.timelineOptions = {
      data: 'pager.data',
      template: [
        '<div class="notification__icon" title="{{ event.type }}">',
        '<span ng-class="typeClasses[event.type]"></span>',
        '</div>',
        '<div class="notification__body">',
        '<span ng-bind="event.title"></span>&nbsp;',
        '<span class="text-muted" title="{{ event.description | htmlToText }}" ng-bind-html="event.description"></span>',
        '<span class="text-muted" ng-if="event.details != \'\'" ng-bind-html="event.details"></span>',
        '</div>',
        '<div class="notification__timestamp" ng-bind="event.timestamp | fromNowNoZone:true" title="{{ event.timestamp | formatDateNoZone:\'LLL\':true }}"></div>'
      ].join('')
    };
    $scope.pageSizes = [
      pageSize,
      pageSize * 2,
      pageSize * 3
    ];
    $scope.pager = new smartPager({
      params: {
        sort: {
          value: 'timestamp',
          direction: 'desc'
        },
        size: pageSize
      },
      service: new crudPromiseService2(restUrl),
      autoLoad: true
    });
    $scope.metric = { area: 'HU-Activity' };
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
  });
});