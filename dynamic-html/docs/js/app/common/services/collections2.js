define([
  'appModule',
  'underscore',
  'smartPager'
], function (app, _) {
  app.factory('collectionsPager', function ($http, $q, smartPager, $routeParams, $collections, $location, $modal, $activity, $filter, $utilities) {
    var $i18n = $filter('i18n');
    function convertFilterObj(obj) {
      return _.map(obj, function (values, field) {
        return {
          field: field,
          operation: null,
          values: values
        };
      });
    }
    function postActivity(data) {
      $activity.post(_.defaults(data, {
        type: 'Collection',
        priority: 'info'
      }));
    }
    function CollectionsPager(options) {
      _.extend(this, options);
      this.fetchCollections();
      if ($routeParams.cq) {
        this.activateCollectionById($routeParams.cq);
      }
      smartPager.prototype.constructor.apply(this, arguments);
    }
    CollectionsPager.prototype = Object.create(smartPager.prototype);
    CollectionsPager.prototype.applyParent = function (methodName, args) {
      return smartPager.prototype[methodName].apply(this, args);
    };
    CollectionsPager.prototype.activateCollection = function (collection) {
      collection = collection || {};
      this.activeCollection = collection;
      collection.pristine = true;
      collection.active = true;
      if (collection.queryProperties.search) {
        this.params.search = collection.queryProperties.search[0];
      }
      this.params.filter = _.reduce(collection.queryProperties.filter, function (memo, filter) {
        memo[filter.field] = filter.values;
        return memo;
      }, {});
      this.params.sort = {
        value: collection.queryProperties.sort[0].field,
        direction: collection.queryProperties.sort[0].direction
      };
      if (!$utilities.isStandalone) {
        this._updateUrlParams();
      }
    };
    CollectionsPager.prototype.activateCollectionById = function (id) {
      this.activeCollection = {
        pristine: true,
        _id: id
      };
      $collections.byId(id).then(_.bind(function (response) {
        this.activateCollection(response.data);
      }, this));
    };
    CollectionsPager.prototype.deactivateCollection = function (reload) {
      this.activeCollection = {};
      this.resetSettings(this.params.sort, reload);
    };
    CollectionsPager.prototype.fetchCollections = function () {
      $collections.getAll({
        sort: 'isTile,desc',
        filter: 'applicationName:' + this.collectionOptions.appId
      }).then(_.bind(function (response) {
        this.collections = response.data.content;
      }, this));
    };
    CollectionsPager.prototype._getCollectionQueryObj = function () {
      return {
        filter: convertFilterObj(this.params.filter),
        search: this.params.search ? [this.params.search] : null,
        sort: [{
            field: this.params.sort.value,
            direction: this.params.sort.direction.toUpperCase()
          }]
      };
    };
    CollectionsPager.prototype.createCollection = function () {
      $collections.createModal().then(_.bind(function (formValues) {
        var collectionObj = _.extend(formValues, {
            appId: this.collectionOptions.appId,
            callback: this.collectionOptions.callback,
            href: this.collectionOptions.href,
            queryProperties: this._getCollectionQueryObj()
          });
        $collections.create(collectionObj).then(_.bind(function (response) {
          postActivity({
            title: $i18n('_CollectionCreated_'),
            msg: $i18n('_CreatedNewCollection_') + ' ' + collectionObj.displayName
          });
          $location.search({ 'cq': response.data._id });
          this.activateCollectionById(response.data._id);
          this.reload(true);
          this.fetchCollections();
        }, this));
      }, this));
    };
    CollectionsPager.prototype.updateCollection = function () {
      var collectionObj = _.clone(this.activeCollection);
      collectionObj.queryProperties = this._getCollectionQueryObj();
      $collections.update(collectionObj).then(_.bind(function () {
        this.activeCollection.active = false;
        this.activeCollection = collectionObj;
        this.activeCollection.active = true;
        this.activeCollection.pristine = true;
        postActivity({
          title: $i18n('_CollectionUpdated_'),
          msg: $i18n('_SuccessfullyUpdatedCollection_') + ' ' + collectionObj.displayName
        });
      }, this));
    };
    CollectionsPager.prototype._setPristine = function (pristine) {
      if (this.activeCollection) {
        this.activeCollection.pristine = pristine;
      }
    };
    CollectionsPager.prototype.search = function () {
      this._setPristine(false);
      this.applyParent('search', arguments);
    };
    CollectionsPager.prototype.sort = function () {
      this._setPristine(false);
      this.applyParent('sort', arguments);
    };
    CollectionsPager.prototype.clearFilters = function () {
      this._setPristine(false);
      this.applyParent('clearFilters', arguments);
    };
    CollectionsPager.prototype.filter = function () {
      this._setPristine(false);
      this.applyParent('filter', arguments);
    };
    CollectionsPager.prototype._getParams = function () {
      var params;
      if (this.activeCollection && this.activeCollection.pristine) {
        params = _.clone(this.params);
        params.cq = this.activeCollection._id;
        return _.omit(params, [
          'search',
          'sort',
          'filter'
        ]);
      } else {
        return this.applyParent('_getParams', arguments);
      }
    };
    return CollectionsPager;
  });
});