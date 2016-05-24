/* -----
 * Apollo Session Module
 * Contains all session-related directives, filters, and services
 * Requires the Registry module
 */
define(['angular'], function (angular) {
  var visible = false;
  angular.module('apollo.session', ['apollo.registry']).factory('$sessionExpired', [
    '$modal',
    function ($modal) {
      return {
        show: function (scope) {
          // Don't reshow the dialog
          if (visible) {
            console.log('Session expired dialog is already visible, don\'t show it');
            return;
          }
          var modalDefaults = {
              scope: scope,
              windowClass: 'expiredSession',
              template: '<div class="modal-header">' + '<h4 class="modal-title" ng-bind="\'_YourSessionHasExpired_\' | i18n "></h4>' + '</div>' + '<div class="modal-footer">' + '<button class="button" data-ng-click="modalOptions.ok();" ng-bind="\'_OK_\' | i18n "></button>' + '</div>',
              controller: function ($scope, $modalInstance) {
                $scope.modalOptions = {};
                $scope.modalOptions.ok = function (result) {
                  $modalInstance.close(result);
                  visible = false;
                };
              }
            };
          visible = true;
          return $modal.open(modalDefaults).result;
        }
      };
    }
  ]).factory('$staleData', [
    '$modal',
    function ($modal) {
      return {
        show: function (scope) {
          // Don't reshow the dialog
          if (visible) {
            console.log('Stale data dialog is already visible, don\'t show it');
            return;
          }
          var modalDefaults = {
              scope: scope,
              windowClass: 'expiredSession',
              template: '<div class="modal-header">' + '<h4 class="modal-title" ng-bind="\'_UpdateFailed_\' | i18n "></h4>' + '</div>' + '<div class="modal-body" ng-bind-html="\'_HUStaleData_\' | i18n "></div>' + '<div class="modal-footer">' + '<button class="button" data-ng-click="modalOptions.ok();" ng-bind="\'_Refresh_\' | i18n "></button>' + '</div>',
              controller: function ($scope, $modalInstance) {
                $scope.modalOptions = {};
                $scope.modalOptions.ok = function (result) {
                  $modalInstance.close(result);
                  visible = false;
                };
              }
            };
          visible = true;
          return $modal.open(modalDefaults).result;
        }
      };
    }
  ]).factory('$logoutWarn', [
    '$modal',
    function ($modal) {
      return {
        show: function () {
          var visible = false;
          var modalDefaults = {
              backdrop: 'static',
              keyboard: false,
              modalFade: true,
              windowClass: 'expiredSession',
              template: '<div class="modal-header">' + '<h4 class="modal-title" ng-bind="\'_LoggingOut_\' | i18n "></h4>' + '</div>' + '<div class="modal-body" ng-bind-html="\'_HUlogoutWarn_\' | i18n "></div>' + '<div class="modal-footer">' + '<button class="button" data-ng-click="modalOptions.ok();" ng-bind="\'_OK_\' | i18n "></button>' + '</div>',
              controller: function ($scope, $modalInstance) {
                $scope.modalOptions = {};
                $scope.modalOptions.ok = function (result) {
                  $modalInstance.close(result);
                  visible = false;
                };
              }
            };
          // Don't reshow the dialog
          if (visible)
            return;
          visible = true;
          return $modal.open(modalDefaults).result;
        }
      };
    }
  ]);
});