define([
  'appModule',
  'underscore',
  'crudPromiseService2',
  '../../directives/createNotification.js',
  '../../directives/notificationList.js'
], function (app, _) {
  app.controller('notificationsController', function ($scope, $routeParams, $registry, $profile, $filter, $notification, crudPromiseService2, smartPager) {
    var $i18n = $filter('i18n');
    var hub = $registry.byId('hub');
    var notificationId = $routeParams.id;
    $scope.profile = $profile.getProfile();
    // SmartCard Setup and Options
    $scope.toolbarOptions = { title: $i18n('_Notifications_') };
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
    $scope.searchOptions = {
      value: 'pager.params.search',
      placeholder: $i18n('_Search_')
    };
    $scope.sortOptions = {
      value: 'pager.params.sort',
      columns: [
        {
          name: $i18n('_Published_'),
          value: 'messages.created'
        },
        {
          name: $i18n('_Severity_'),
          value: 'messages.severity'
        },
        {
          name: $i18n('_Title_'),
          value: 'subject'
        },
        {
          name: $i18n('_Type_'),
          value: 'category',
          group: true
        }
      ]
    };
    $scope.filterOptions = {
      activeFilters: 'pager.params.filter',
      clearFilters: function (keys) {
        $scope.pager.clearFilters(keys);
      },
      filters: [{
          label: 'Severity',
          value: 'messages.severity',
          values: _.map($notification.severities(), function (sev) {
            return {
              label: sev.displayName,
              value: sev.value.toString()
            };
          })
        }]
    };
    $scope.listOptions = {
      data: 'pager.data',
      selectEnabled: true,
      refresh: function () {
        $scope.pager.reload(true);
      }
    };
    $scope.pager = new smartPager({
      params: {
        sort: {
          value: 'created',
          direction: 'desc'
        },
        search: notificationId,
        size: 16
      },
      service: new crudPromiseService2(hub.baseWsUrl + '/message'),
      autoLoad: true
    });
    $scope.metric = { area: 'HU-Notifications' };
    $scope.actions = {
      delete: function () {
        $scope.listOptions.delete($scope.pager.selectedItems);
      }
    };
  });
});