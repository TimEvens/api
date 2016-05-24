define([
  'appModule',
  'underscore',
  'formatDate',
  'crudPromiseService2'
], function (app, _) {
  app.controller('collectionsController', function ($scope, $registry, $modal, $filter, $profile, $collections, crudPromiseService2, smartPager) {
    var $i18n = $filter('i18n');
    var hub = $registry.byId('hub');
    $scope.isGuest = $profile.getProfile().role === 'guest';
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
    $scope.edit = function (collection) {
      $collections.editModal(_.pick(collection, 'displayName', 'isTile')).then(function (formValues) {
        return $collections.update(_.extend(collection, formValues));
      }).then(function () {
        $scope.pager.reload(true);
      });
    };
    $scope.delete = function (collections) {
      collections = _.castArray(collections);
      return $modal.open({
        templateUrl: hub.baseUrl + '/js/app/modals/collectionDelete.html',
        controller: [
          '$scope',
          function (scope) {
            scope.collections = collections;
          }
        ]
      }).result.then(function () {
        return $collections.delete(collections).then(function () {
          $scope.pager.reload(true);
        });
      });
    };
    $scope.toggleSelected = function (e, collection) {
      collection.selected = !collection.selected;
      $scope.$emit('selectionUpdated', collection);
      e.preventDefault();
      e.stopPropagation();
    };
    $scope.viewCollection = $collections.view;
    $scope.updateCollection = function (c) {
      $collections.update(c).then(function (data) {
        c.updated = data.data.updated;
      });
    };
    $scope.toggleScoreboard = function (e, c) {
      e.stopPropagation();
      $scope.updateCollection(c);
      c.isTile = !c.isTile;
    };
    // SmartCard Setup and Options
    $scope.toolbarOptions = { title: $i18n('_Collections_') };
    $scope.$on('filterUpdated', function (e, field, value, checked) {
      $scope.pager.filter(field, value, checked);
    });
    $scope.$on('searchUpdated', function (e, search) {
      $scope.pager.search(search);
    });
    $scope.$on('sortUpdated', function (e, sort) {
      $scope.pager.sort(sort);
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
          name: $i18n('_Name_'),
          value: 'displayName'
        },
        {
          name: $i18n('_Category_'),
          value: 'applicationName',
          group: true
        },
        {
          name: $i18n('_Created_'),
          value: 'createdDate'
        },
        {
          name: $i18n('_ShowOnDashboard_'),
          value: 'isTile',
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
          label: 'Type',
          value: 'applicationName',
          values: _.map($scope.COLLECTION_TYPES, function (type, key) {
            return {
              label: type.tooltip,
              value: key
            };
          })
        }]
    };
    $scope.pager = new smartPager({
      params: {
        sort: {
          value: 'createdDate',
          direction: 'desc'
        },
        size: 16,
        filter: $scope.filterObj || {}
      },
      service: new crudPromiseService2(hub.baseWsUrl + '/collections'),
      autoLoad: true
    });
    $scope.metric = { area: 'HU-Collections' };
    $scope.actions = {
      delete: function () {
        $scope.delete($scope.pager.selectedItems);
      }
    };
    $scope.$watch('pager.data', function (collections) {
      _.each(collections, function (collection) {
        collection.count = 0;
        $collections.getCount(collection).then(function (count) {
          if (_.isNumber(count)) {
            collection.count = count;
          }
        });
      });
    });
  });
});