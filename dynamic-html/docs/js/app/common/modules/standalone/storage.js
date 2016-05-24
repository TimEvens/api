/* -----
 * Apollo Storage Module
 * Contains functions for saving/retrieving preferences to/from local file system
 * in a stand alone environment
 */
define([
  'angular',
  'underscore'
], function (angular, _) {
  var settingsKeyMap = {
      auto_capture: 'general.globalConsoleSettings.defaultValue.autoSessionCapture',
      bg_color: 'general.colorPreference.defaultValue.consoleBackground',
      cache_credentials: 'general.allowClickToReconnectWithCreds.defaultValue',
      cco_password: 'cco_password',
      cco_username: 'cco_username',
      chh_danger: 'general.globalConsoleSettings.defaultValue.augmentations_danger',
      chh_enabled: 'general.globalConsoleSettings.defaultValue.augmentations',
      chh_info: 'general.globalConsoleSettings.defaultValue.augmentations_info',
      chh_warning: 'general.globalConsoleSettings.defaultValue.augmentations_warning',
      data_view: 'general.dataView',
      enhanced_login_flow: 'enhanced_login_flow',
      fg_color: 'general.colorPreference.defaultValue.consoleText',
      hl_background1: 'general.colorPreference.defaultValue.firstBackground',
      hl_background2: 'general.colorPreference.defaultValue.secondBackground',
      hl_background3: 'general.colorPreference.defaultValue.thirdBackground',
      hl_background4: 'general.colorPreference.defaultValue.fourthBackground',
      hl_background5: 'general.colorPreference.defaultValue.fifthBackground',
      hl_color1: 'general.colorPreference.defaultValue.firstText',
      hl_color2: 'general.colorPreference.defaultValue.secondText',
      hl_color3: 'general.colorPreference.defaultValue.thirdText',
      hl_color4: 'general.colorPreference.defaultValue.fourthText',
      hl_color5: 'general.colorPreference.defaultValue.fifthText',
      install_id: 'id.installId',
      last_welcome_version: 'last_welcome_version',
      master_password_hash: 'master_password_hash',
      preferred_protocol: 'general.globalConsoleSettings.defaultValue.preferredProtocol',
      proxy_credentials_password: 'general.globalConsoleSettings.defaultValue.proxyCredentialsPassword',
      proxy_credentials_username: 'general.globalConsoleSettings.defaultValue.proxyCredentialsUsername',
      proxy_hasCredentials: 'general.globalConsoleSettings.defaultValue.proxyHasCredentials',
      proxy_host: 'general.globalConsoleSettings.defaultValue.proxyHost',
      proxy_isSingleProxy: 'general.globalConsoleSettings.defaultValue.proxyIsSingleProxy',
      proxy_pac: 'general.globalConsoleSettings.defaultValue.proxyPac',
      proxy_port: 'general.globalConsoleSettings.defaultValue.proxyPort',
      proxy_protocol: 'general.globalConsoleSettings.defaultValue.proxyProtocol',
      scrollback: 'general.globalConsoleSettings.defaultValue.scrollBackBuffer',
      selection_mode: 'selection_mode',
      session_dir: 'general.globalConsoleSettings.defaultValue.sessionDirectory',
      session_id: 'id.sessionId',
      sort_column: 'general.globalConsoleSettings.defaultValue.sortColumn',
      sort_direction_hostname: 'sort_direction_hostname',
      sort_direction_location: 'sort_direction_location',
      sort_direction_name: 'sort_direction_name',
      sort_direction_recentlyAccessed: 'sort_direction_recentlyAccessed',
      sort_direction_updateddate: 'sort_direction_updateddate',
      theme: 'general.colorPreference.defaultValue.theme',
      user_queried_for_master_password: 'user_queried_for_master_password'
    };
  var sasaUtils = require('./sasaUtils');
  var path = require('path');
  var fs = require('fs');
  var SA_DATA_PATH = sasaUtils.getSASADir();
  var SETTINGS_FILEPATH = path.join(SA_DATA_PATH, 'sasettings.json');
  var SETTINGS_DATA;
  angular.module('apollo.storage', []).factory('$storage', [
    '$q',
    function ($q) {
      // load user settings JSON from disk. if it's not loaded
      function _getSettings() {
        var def = $q.defer();
        if (SETTINGS_DATA) {
          def.resolve(SETTINGS_DATA);
        } else {
          fs.readFile(SETTINGS_FILEPATH, function (err, data) {
            if (err) {
              console.log('error loading file');
              return def.reject(err);
            }
            try {
              SETTINGS_DATA = JSON.parse(data);
              def.resolve(SETTINGS_DATA);
            } catch (err) {
              def.reject(err);
              console.error('Failed to load settings data ' + err);
            }
          });
        }
        return def.promise;
      }
      //save settings to file
      function _saveSettings(data) {
        var def = $q.defer();
        var mkdirp = require('mkdirp');
        mkdirp(SA_DATA_PATH, function (err) {
          if (err) {
            return def.reject(err);
          }
          fs.writeFile(SETTINGS_FILEPATH, JSON.stringify(data), function (error) {
            if (error) {
              console.error('Could not write file: %s', error);
              def.reject(error);
            } else {
              def.resolve('saved');
            }
          });
        });
        return def.promise;
      }
      function StorageApi(appDesc) {
        this.appId = appDesc.appId;
      }
      // Reset all preferences of the user to the account
      StorageApi.prototype.delete = function () {
        return _saveSettings({});
      };
      StorageApi.prototype.get = function (name) {
        var appId = this.appId;
        return _getSettings().then(function (data) {
          var keyObj = name ? _.pick(settingsKeyMap, name) : settingsKeyMap;
          return _.reduce(keyObj, function (memo, translatedKey, key) {
            var value = _.get(data, appId + '.' + translatedKey);
            if (!_.isUndefined(value)) {
              memo[key] = value;
            }
            return memo;
          }, {});
        });
      };
      StorageApi.prototype.putData = function (newData) {
        var appId = this.appId;
        return _getSettings().then(function (data) {
          _.each(newData, function (value, key) {
            if (settingsKeyMap[key]) {
              _.set(data, appId + '.' + settingsKeyMap[key], value);
            }
          });
          return _saveSettings(data);
        });
      };
      StorageApi.prototype.set = function (key, value) {
        return this.putData(_.zipObject([key], [value]));
      };
      return StorageApi;
    }
  ]);
});