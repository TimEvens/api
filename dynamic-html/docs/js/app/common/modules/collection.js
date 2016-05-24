/* -----
 * Apollo Collections Module
 * Contains all collections-related directives, filters, and services
 * Requires the Registry module
 */
define([
  'angular',
  'underscore'
], function (angular, _) {
  angular.module('apollo.collection', ['apollo.registry']).factory('$collections', [
    '$http',
    '$location',
    '$registry',
    '$q',
    '$filter',
    '$activity',
    '$registry',
    '$modal',
    function ($http, $location, $registry, $q, $filter, $activity, $registry, $modal) {
      var $i18n = $filter('i18n');
      function postDeleteActivity(collections) {
        var activityTitle = $i18n('_CollectionRemoved_');
        var msg = '';
        if (collections.length === 1) {
          msg = $i18n('_HUCollectionsDeletedMsgSinglePre_') + collections[0].displayName + $i18n('_HUCollectionsDeletedMsgSinglePost_');
        } else {
          msg = collections.length + $i18n('_HUCollectionsDeletedMsgMultiPost_');
        }
        $activity.post({
          title: activityTitle,
          msg: msg,
          type: 'Collection',
          priority: 'info'
        });
      }
      return {
        _url: $registry.byId('hub').baseWsUrl + '/collections',
        getAll: function (params) {
          params = params || {};
          params.nocache = new Date().getTime();
          return $http.get(this._url, { params: params });
        },
        byId: function (id) {
          var cfg = { params: { nocache: new Date().getTime() } };
          return $http.get(this._url + '/' + id, cfg);
        },
        byName: function (name) {
          var cfg = {
              params: {
                nocache: new Date().getTime(),
                filter: 'displayName' + ':' + name
              }
            };
          return $http.get(this._url, cfg);
        },
        byType: function (type) {
          var cfg = {
              params: {
                nocache: new Date().getTime(),
                filter: 'applicationName' + ':' + type
              }
            };
          return $http.get(this._url, cfg);
        },
        create: function (obj) {
          return $http.post(this._url, {
            displayName: obj.displayName,
            applicationName: obj.appId,
            applicationMethod: obj.callback,
            query: obj.query,
            isTile: obj.isTile || false,
            href: obj.href,
            queryProperties: obj.queryProperties
          });
        },
        update: function (obj) {
          return $http.put(this._url, obj);
        },
        delete: function (collections) {
          collections = _.castArray(collections);
          if (collections) {
            return $q.all(_.map(collections, function (collection) {
              return $http.delete(this._url + '/' + collection._id);
            }, this)).then(_.partial(postDeleteActivity, collections)).catch(_.bind(console.log, console));
          } else {
            return $q.reject('Delete collection operation failed: Invalid / no IDs given.');
          }
        },
        view: function (c) {
          $location.search({ 'cq': c._id }).path(c.href);
        },
        getCount: function (collection) {
          if (collection && collection.applicationMethod) {
            return $registry.getServiceApi(collection.applicationName).then(function (api) {
              return $registry.invoke(api[collection.applicationMethod], [collection._id], collection);
            });
          } else {
            return $q.reject('Invalid collection or missing function');
          }
        },
        read: function (params) {
          return $http.get(this._url, {
            params: _.defaults(params, {
              sort: 'createdDate,desc',
              cache: false
            })
          });
        },
        editModal: function (collectionForm) {
          return this.createModal(collectionForm, true);
        },
        createModal: function (collectionForm, isUpdate) {
          var $collections = this;
          return $modal.open({
            template: [
              '<form name="cf" ng-submit="submit()" novalidate>',
              '<div class="modal-header">',
              '<button type="button" class="close" data-dismiss="modal" aria-hidden="true" ng-click="$dismiss()">',
              '<span class="icon-close"></span>',
              '</button>',
              '<h4 class="modal-title" ng-bind="modalTitle"></h4>',
              '</div>',
              '<div class="modal-body">',
              '<div class="form-group">',
              '<div class="form-group__text">',
              '<input id="cName" name="cName" type="text" required ng-minlength="1" ng-maxlength="100" validators="lookupName" ng-model="collectionForm.displayName"></input>',
              '<label for="cName" ng-bind="\'_Name_\' | i18n"></label>',
              '<div class="required-block"><span class="icon-asterisk"></span></div>',
              '</div>',
              '</div>',
              '<div class="help-block" ng-show="cf.cName.$error.lookupName">',
              '<span class="icon-exclamation-circle"></span>&nbsp;',
              '<span ng-bind="\'_CommonCollectionErrorDuplicate_\' | i18n"></span>',
              '</div>',
              '<div class="help-block" ng-show="cf.cName.$error.maxlength">',
              '<span class="icon-exclamation-circle"></span>&nbsp;',
              '<span ng-bind="\'_CommonErrorMaxlength_\' | i18n:100"></span>',
              '</div>',
              '<div>',
              '<label class="checkbox">',
              '<input type="checkbox" ng-model="collectionForm.isTile">',
              '<span class="checkbox__input"></span>',
              '<span class="checkbox__label" ng-bind="\'_DisplayOnDashboard_\' | i18n"></span>',
              '</label>',
              '</div>',
              '</div>',
              '<div class="modal-footer">',
              '<button type="button" class="button" ng-click="$dismiss()" ng-bind="\'_Cancel_\' | i18n"></button>&nbsp;',
              '<button type="button" class="button button--cta" ng-click="submit()" ng-disabled="!cf.$dirty || cf.$invalid" ng-bind="submitLabel"></button>',
              '</div>',
              '</form>'
            ].join(''),
            controller: [
              '$scope',
              function (scope) {
                scope.modalTitle = $i18n(isUpdate ? '_UpdateCollection_' : '_CreateNewCollection_');
                scope.submitLabel = $i18n(isUpdate ? '_Update_' : '_AddCollection_');
                scope.loading = false;
                scope.collectionForm = _.defaults(collectionForm || {}, {
                  displayName: '',
                  isTile: true
                });
                scope.lookupName = function (name) {
                  scope.loading = true;
                  return $collections.byName(name).then(function (data) {
                    scope.loading = false;
                    return !data.data.content.length;
                  });
                };
                scope.submit = function () {
                  if (!scope.loading && scope.cf.$valid) {
                    scope.$close(scope.collectionForm);
                  }
                };
              }
            ]
          }).result;
        }
      };
    }
  ]);
});