/* -----
 * Apollo Activity Module
 * Contains all activity-related directives, filters, and services
 * Requires the Registry, Profile, and Toast modules
 */
define([
  'angular',
  'moment',
  'underscore'
], function (angular, moment, _) {
  angular.module('apollo.activity', [
    'apollo.registry',
    'apollo.profile',
    'apollo.toast',
    'apollo.logger'
  ]).factory('$activity', [
    '$q',
    '$registry',
    '$profile',
    '$toast',
    '$logger',
    '$apolloCollect',
    '$rootScope',
    function ($q, $registry, $profile, $toast, $logger, $apolloCollect, $rootScope) {
      var fs = require('fs-extra');
      var path = require('path');
      var mkdirp = require('mkdirp');
      var sasaUtils = require('./sasaUtils');
      var _SA_DATA_PATH = sasaUtils.getSASADir();
      var _ACTIVITY_FILE_PATH = path.join(_SA_DATA_PATH, 'activity.json');
      var activitiesCache;
      //load activity file
      function _getActivities() {
        var def = $q.defer();
        try {
          if (activitiesCache) {
            // mimick a backend call: cache a datastring and parse it each time so it
            // can't be mutated (outside of calling _saveActivity):
            def.resolve(JSON.parse(activitiesCache));
          } else {
            fs.readFile(_ACTIVITY_FILE_PATH, function (err, data) {
              var activities;
              if (err) {
                console.log('error loading activity file ' + _ACTIVITY_FILE_PATH + ' err' + err);
                def.reject(err);
              } else {
                try {
                  activities = JSON.parse(data);
                  // if parse was successful, cache datastring:
                  activitiesCache = data;
                  def.resolve(activities);
                } catch (parseErr) {
                  _replaceFile(parseErr).then(function (replacedData) {
                    activitiesCache = JSON.stringify(replacedData);
                    def.resolve(replacedData);
                  }).catch(function (err) {
                    def.reject(err);
                  });
                }
              }
            });
          }
        } catch (err) {
          def.reject(err);
          console.error('Failed to load activity data ' + err);
        }
        return def.promise;
      }
      // add activity
      function _addActivity(value) {
        console.log(' called _addActivity  value=' + value);
        return _getActivities().then(function (res) {
          res.data.content.push(value);
          // only save the latest 100 items:
          res.data.content = _.take(_.orderBy(res.data.content, 'timestamp', 'desc'), 100);
          _saveActivity(res);
        });
      }
      //replace activity.json if unparseable
      function _replaceFile(parseErr) {
        var def = $q.defer();
        $logger.error(parseErr);
        fs.stat(_ACTIVITY_FILE_PATH, function (statErr, stats) {
          $apolloCollect.send({
            area: 'applicationEvent',
            details: { warningMessage: 'FAILED TO PARSE activity.json, size = ' + stats.size },
            operation: 'SASA-FileErrorEvent',
            value: parseErr
          });
          fs.copy('./activity.json', _ACTIVITY_FILE_PATH, { clobber: true }, function (copyErr) {
            if (copyErr) {
              $logger.error('Failed to copy activity.json : ' + copyErr.message);
              def.reject(copyErr);
            } else {
              def.resolve({ 'data': { 'content': [] } });
            }
          });
        });
        return def.promise;
      }
      //save activity to file
      function _saveActivity(activityData) {
        var newData;
        try {
          mkdirp.sync(_SA_DATA_PATH);
          newData = JSON.stringify(activityData);
          // block so _saveActivity can't run several times in parallel:
          fs.writeFileSync(_ACTIVITY_FILE_PATH, newData);
          // update cache:
          activitiesCache = newData;
        } catch (err) {
          console.error('Failed to save activity data ' + err);
        }
      }
      return {
        post: function (options) {
          var user = $profile.getProfile();
          var fancyName = user.firstName !== '' ? user.firstName + ' ' + user.lastName + ' (' + user.userId + ')' : user.userId;
          var now = moment().unix();
          // add activity to fs
          _addActivity({
            id: now,
            created: now,
            title: options.title,
            description: options.msg.replace(/\.$/, '') + ' by user ' + user.userId + '.',
            type: options.type,
            details: options.details || '',
            iconUrl: user.avatarUrl || 'img/nophoto-small.jpg',
            userId: user.userId,
            sessionName: options.sessionName || '',
            host: options.host || '',
            userName: fancyName,
            timestamp: now,
            connectionType: options.connectionType,
            port: options.port
          }).then(function () {
            // Notifies Activity widget to refresh
            $rootScope.$broadcast('activities.refresh');
            var shortMsg = options.msg.length >= 200 ? options.msg.substr(0, 200) + '...' : options.msg;
            if (options.notifyUser) {
              $toast.post({
                title: options.title,
                msg: shortMsg,
                sticky: options.sticky || false,
                severity: options.severity || 'info'
              });
            }
          });
        },
        read: function (url, params) {
          var def = $q.defer();
          _getActivities().then(function (res) {
            if (res) {
              var list = res.data.content;
              if (params.filter) {
                var filterkey = params.filter.split(':')[0];
                var filterval = params.filter.split(':')[1];
                list = _.filter(res.data.content, function (val) {
                  return val[filterkey] === filterval;
                });
              }
              //if sort paaram is specified, handle it
              if (params.sort) {
                var sortby = params.sort.split(',')[0];
                var orderby = params.sort.split(',')[1];
                list = _.sortBy(list, sortby);
                if (orderby === 'desc') {
                  list.reverse();
                }
              }
              //# of elements to return (params.size)
              res.data.content = list.slice(0, params.size);
              def.resolve(res);
            } else {
              def.reject(res);
            }
          });
          return def.promise;
        }
      };
    }
  ]);
});