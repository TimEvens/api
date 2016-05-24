define(['require'], function (require) {
  //
  // Application Registry
  //
  // The registry manages the loading (via Require JS async module loads).
  // The registry makes the apps available for other interested apps via
  // the 'byId()' function
  //
  // The application registry is a singleton. Only one instance of this registry should
  // exist in the application and the register() function should only be called once
  // at initialization
  //
  return {
    _appData: {},
    register: function (appData) {
      //
      // summary:
      //		Registers the application data. The application data contains additional
      //		information specific to each application
      // componentData:
      //		Specify JSON array containing the application data for ALL applications
      //		used in this application. The format of the JSON array should look
      //	 	like this:
      //
      // 			[
      //				{
      //					'serviceApi': 'app/api/hubService',
      //					'appId': 'hub',
      //					'baseUrl': '/hub/'
      //					'id': '525d921c2d148121538f60d0',
      //					'appId': 'deviceSummary',
      //					'name': 'Device Summary Application',
      //					'baseUrl': 'assets/apps/deviceSummary/1.3',
      //					'url': 'assets/apps/deviceSummary/1.3/js/deviceSummary.js',
      //					'version': '1.3'
      //				},
      //				{
      //					'id': '525d5cce2d148121538f60cf',
      //					'appId': 'caseSummary',
      //					'name': 'Case Summary Application',
      //					'baseUrl': 'assets/apps/caseSummary/1.6',
      //					'url': 'assets/apps/caseSummary/1.6/js/caseSummary.js',
      //					'version': '1.6'
      //				}
      //			]
      //
      this._appData = appData;
      var apps = this._appData;
      console.log('Registry :: Registering application data. Found [' + apps.length + '] apps');
    },
    registerServiceApi: function (appId) {
      //
      // summary:
      //		Registers an application service API. A service API is an Angular service which
      //		resides outside of the app in a separate file and is always loaded versus an app
      //		which is loaded as-needed. This service API enables inter-app communication. This
      //		service API is useful for apps interested in exposing a set of APIs that are global
      //		(singleton) to the Apollo web application you can use this service API.
      // appId:
      //		Specify the unique application identifier. Each app can have only one service API
      // service:
      //		Specify a string containing the relative path to your app's service API file
      //		(e.g. 'app/api/hubService')
      //
      var self = this;
      require(['app/api/hubServiceApi'], function (serviceModule) {
        //require([ service ],
        //function(serviceModule) {
        console.log('Successfully registered API service for app ' + appId);
        for (var ii = 0; ii < self._appData.length; ii++) {
          var app = self._appData[ii];
          if (appId === app.appId) {
            app.service = serviceModule;
            // Save off the service API instance
            break;
          }
        }
      }, function (err) {
        console.error('Failed to load API service for app ' + appId + '. Reason: ' + err);
      });
    },
    load: function (dependencies, apps) {
      //
      // summary:
      //		Loads the list of dependencies using Require JS
      // dependencies:
      //		Specify an array of file dependencies to load. List may contain both relative
      //		file paths and application identifiers. Example:
      //
      //		[
      //			"app/pages/dashboard/homeController",	<== Normal file dependency
      //			"deviceSummary",						<== App (Angular directive)
      //			"caseSummary"							<== App (Angular directive)
      //		]
      //
      var self = this;
      var definition = {
          resolver: [
            '$q',
            '$rootScope',
            function ($q, $rootScope) {
              var deferred = $q.defer();
              var modules = dependencies;
              if (apps) {
                // If apps were specified we need to resolve them to their real URLs
                // and append them to the module list
                modules = modules.concat(self._resolveApps(apps));
              }
              function safeDigest() {
                if (!$rootScope.$$phase) {
                  $rootScope.$digest();
                }
              }
              // Load the module dependencies
              require(modules, function () {
                deferred.resolve();
                safeDigest();
              }, function (err) {
                console.error('Failed to load dependencies: ' + err.requireModules.join(', '));
                deferred.resolve();
                safeDigest();
              });
              return deferred.promise;
            }
          ]
        };
      return definition;
    },
    unload: function (appIdList) {
      //
      // summary:
      //		Unloads the specified applications
      // appIdList:
      //		Specify an array of application identifiers to unload (ready=false)
      //
      for (var ii = 0; ii < appIdList.length; ii++) {
        var id = appIdList[ii];
        var c = this._getComponentById(id);
        if (c) {
          c.isReady = false;
          c.scope = null;
          console.log('Registry :: Component [' + id + '] has been unloaded');
        }
      }
    },
    byId: function (id) {
      //
      // summary:
      //		Retrieves the application instance given the application identifier
      // id:
      //		Specify a application identifier
      // returns:
      //		Returns a application instance if successful, null if not
      //
      return this._getComponentById(id);
    },
    _getComponentById: function (id) {
      //
      // summary:
      //		Private function which retrieves the application data object
      // id:
      //		Specify a application identifier
      // returns:
      //		Returns the application data object if successful, null if failure
      //
      var compItems = this._appData;
      for (var ii = 0; ii < compItems.length; ii++) {
        if (id === compItems[ii].appId) {
          return compItems[ii];
        }
      }
      return null;
    },
    _getComponentUrls: function (ids) {
      //
      // summary:
      //		Private function which retrieves a list of application URLs that are
      //		used for loading the applications asynchronously via Require JS
      // ids:
      //		Specify an array of application identifiers
      // returns:
      //		Returns an array of application URLs in the same order as the array
      //		of application identifiers passed in
      //
      var urls = [];
      for (var ii = 0; ii < ids.length; ii++) {
        var c = this._getComponentById(ids[ii]);
        urls.push(c ? c.baseUrl + '/' + c.entry : '');
      }
      return urls;
    },
    _resolveApps: function (apps) {
      //
      // summary:
      //		Private function which walks the list of apps checking for
      //		any matching application ids. If match then resolve the dependency
      //		to the application's real URL. If no match then it is not added
      // apps:
      //		Specify an array of dependencies to resolve
      // returns:
      //		Returns an array of resolved dependencies
      //
      var resolved = [];
      for (var ii = 0; ii < apps.length; ii++) {
        var appId = apps[ii];
        var c = this._getComponentById(appId);
        // Check if this app exists in our list
        if (c) {
          resolved.push(c.baseUrl + '/' + c.entry);
        }
      }
      return resolved;
    }
  };
});