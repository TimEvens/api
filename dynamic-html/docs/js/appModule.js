cisco.appConfig.appDefine.splice(0, 0, 'underscore', 'moment');
define(cisco.appConfig.appDefine, function (_, moment) {
  var app = angular.module('app', cisco.appConfig.appModules);
  var appRoutes = {
      defaultRoutePath: cisco.defaultRoute,
      routes: {}
    };
  var DEFAULT_LANG = 'en-us';
  function _getPreferredLang() {
    var val = _.chain(window.navigator).pick([
        'languages',
        'language',
        'browserLanguage',
        'userLanguage',
        'systemLanguage'
      ]).values().flatten().compact().uniq().first().value();
    return val ? val.toLowerCase() : DEFAULT_LANG;
  }
  var preferredLang = _getPreferredLang();
  moment.locale(preferredLang);
  cisco.locale = {
    dictionary: [],
    loaded: []
  };
  // Pulled this function from the old appRegistry. We use this to load all of our
  // per-page dependencies defined in each app's appDescriptor
  function _loadModules(modules, $q, $rootScope) {
    var deferred = $q.defer();
    function safeDigest() {
      if (!$rootScope.$$phase) {
        $rootScope.$digest();
      }
    }
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
  function _loadAppsForRoute(appIds) {
    return _.reduce(appIds, function (memo, appId) {
      var app = _.find(cisco.apps, { appId: appId });
      if (app)
        memo.push(app);
      return memo;
    }, []);
  }
  function _loadBundle(route, $q, $http) {
    var apps = _loadAppsForRoute(route.apps);
    apps.unshift(route.app);
    var bundlesToLoad = [];
    // First check if the hub bundle has been loaded. If we don't do this and the hub
    // has no configured routes (e.g. SN Checker, My Devices, etc) then it's bundle
    // will never get loaded so we piggyback on another app's bundle load :-)
    var hubApp = _.find(cisco.apps, { appId: 'hub' });
    if (hubApp && !_.includes(cisco.locale.loaded, 'hub')) {
      bundlesToLoad.push({
        app: hubApp,
        promise: _fetchBundle(hubApp, $http)
      });
    }
    _.each(apps, function (app) {
      // Only add the app's bundle if it has not yet been loaded
      if (!_.includes(cisco.locale.loaded, app.appId)) {
        bundlesToLoad.push({
          app: app,
          promise: _fetchBundle(app, $http)
        });
      }
    });
    // Map the promises so we can catch file not found exception. We need this so
    // we can load the default resource bundle. This can happen if someone sets
    // their browser language to anything other than en-us
    var promises = bundlesToLoad.map(function (obj) {
        return obj.promise.catch(function () {
          return _fetchBundle(obj.app, $http, DEFAULT_LANG);  // Use default bundle on failure
        });
      });
    return $q.all(promises);
  }
  function _fetchBundle(app, $http, language) {
    language = language || preferredLang;
    return $http.get(app.baseUrl + '/i18n/resources-locale_' + language + '.json').then(function (result) {
      if (result) {
        cisco.locale.dictionary = cisco.locale.dictionary.concat(result.data || []);
        cisco.locale.loaded.push(app.appId);
      }
    });
  }
  function _resolveApps(appIds) {
    return _.reduce(appIds, function (memo, appId) {
      var app = _.find(cisco.apps, { appId: appId });
      if (app)
        memo.push(app.baseUrl + '/' + app.entry);
      return memo;
    }, []);
  }
  /* -----
     * Hub Application Properties
     * This is where module-specific properties can be set for the entire application
     */
  app.run([
    'editableOptions',
    'editableThemes',
    'Idle',
    '$route',
    '$rootScope',
    '$location',
    '$modalStack',
    function (editableOptions, editableThemes, Idle, $route, $rootScope, $location, $modalStack) {
      // Xeditable properties
      editableOptions.theme = 'bs3';
      editableThemes.bs3.inputClass = 'input-sm';
      editableThemes.bs3.submitTpl = '<button type="submit" class="button button--primary"><span class="icon-check"></span></button>';
      editableThemes.bs3.cancelTpl = '<button type="button" class="button" ng-click="$form.$cancel()"><span class="icon-close"></span></button>';
      Idle.watch();
      // This section of code fixes the issue where a change in the URL causes a page reload
      // Useful for pages that have routes that have dynamic parameters
      // http://joelsaupe.com/programming/angularjs-change-path-without-reloading
      var original = $location.path;
      $location.path = function (path, reload) {
        if (reload === false) {
          var lastRoute = $route.current;
          var un = $rootScope.$on('$locationChangeSuccess', function () {
              $route.current = lastRoute;
              un();
            });
        }
        return original.apply($location, [path]);
      };
      // close modals on route changes:
      $rootScope.$on('$routeChangeSuccess', function () {
        $modalStack.dismissAll();
      });
    }
  ]);
  /* -----
     * Hub Application Configuration
     * This is where the per-page dependencies and routes are loaded
     */
  app.config([
    '$routeProvider',
    '$locationProvider',
    '$controllerProvider',
    '$compileProvider',
    '$filterProvider',
    '$provide',
    '$httpProvider',
    'IdleProvider',
    'KeepaliveProvider',
    '$tooltipProvider',
    function ($routeProvider, $locationProvider, $controllerProvider, $compileProvider, $filterProvider, $provide, $httpProvider, IdleProvider, KeepaliveProvider, $tooltipProvider) {
      app.controller = $controllerProvider.register;
      app.directive = $compileProvider.directive;
      app.filter = $filterProvider.register;
      app.factory = $provide.factory;
      app.service = $provide.service;
      var imgWhiteList = new RegExp('^\\s*(' + cisco.params.imgWhiteList.join('|') + '):');
      $compileProvider.imgSrcSanitizationWhitelist(imgWhiteList);
      var hrefWhiteList = new RegExp('^\\s*(' + cisco.params.hrefWhiteList.join('|') + '):');
      $compileProvider.aHrefSanitizationWhitelist(hrefWhiteList);
      IdleProvider.idle(4 * 60 * 60);
      // 4 hours idle
      IdleProvider.timeout(0);
      // no need of warning
      KeepaliveProvider.interval(10 * 60);
      // 10 minutes
      $locationProvider.html5Mode(true);
      _.each(cisco.apps, function (app) {
        _.each(app.routes, function (route) {
          appRoutes.routes[route.name] = {
            app: app,
            templateUrl: app.baseUrl + '/' + route.templateUrl,
            dependencies: _.map(route.dependencies, function (dependency) {
              return app.baseUrl + '/' + dependency.name + '.js';
            }),
            apps: route.apps
          };
        });
      });
      // Now we feed in all of our routes along with their dependencies into the Angular
      // Route provider. The Route provider will only load the dependencies for each route
      // as the user navigates through the application
      _.each(appRoutes.routes, function (route, path) {
        $routeProvider.when(path, {
          templateUrl: route.templateUrl,
          resolve: {
            resolver: [
              '$q',
              '$http',
              '$rootScope',
              function ($q, $http, $rootScope) {
                return $q.all([
                  _loadModules(route.dependencies.concat(_resolveApps(route.apps)), $q, $rootScope),
                  _loadBundle(route, $q, $http)
                ]);
              }
            ]
          },
          reloadOnSearch: false
        });
      });
      // We are going to watch for $http errors and then determine if our session has expired
      $provide.factory('apolloHttpInterceptor', [
        '$rootScope',
        '$q',
        function ($rootScope, $q) {
          return {
            'request': function (config) {
              $rootScope.$emit('keepAlive');
              config.headers = config.headers || {};
              // Add authorization header to web service calls and force to https
              if (/ws\//.test(config.url)) {
                config.headers.Authorization = cisco.bearerToken;
                config.url = 'https://' + location.hostname + '/' + cisco.params.baseUrl + '/' + config.url;
              }
              return config;
            },
            'responseError': function (rejection) {
              if (rejection.status === 401 || rejection.status === -1 && _.isNull(rejection.data)) {
                // if either fails, then report expired session
                if (/ws\//.test(rejection.config.url) || /WebContent\//.test(rejection.config.url)) {
                  $rootScope.$emit('ExpiredSession');
                }
              }
              //Generic handling of stale data, show an alert asking user to refresh data
              //if(rejection.status === 409) {
              //$rootScope.$emit('StaleData');
              //}
              return $q.reject(rejection);
            }
          };
        }
      ]);
      // Disable tooltips on mobile devices
      var tooltipFactory = $tooltipProvider.$get[$tooltipProvider.$get.length - 1];
      $tooltipProvider.$get = function ($window, $compile, $timeout, $parse, $document, $position, $interpolate, $rootScope) {
        // for touch devices, don't return tooltips
        if (_.has($window, 'ontouchstart') || $rootScope.mobile.isActive) {
          return _.constant({ compile: _.noop });
        } else {
          // run the default behavior
          return tooltipFactory($window, $compile, $timeout, $document, $position, $interpolate, $rootScope);
        }
      };
      $httpProvider.interceptors.push('apolloHttpInterceptor');
      if (cisco.defaultRoute !== undefined) {
        // Set the default route
        $routeProvider.otherwise({ redirectTo: cisco.defaultRoute });
      }
    }
  ]);
  app.controller('themeController', [
    '$scope',
    function ($scope) {
      $scope.showContrast = false;
      $scope.currentTheme = 'cisco-light';
      $scope.toggleContrast = function () {
        $scope.currentTheme = $scope.currentTheme === 'cisco-light' ? 'cisco-contrast' : 'cisco-light';
        $scope.showContrast = !$scope.showContrast;
      };
    }
  ]);
  /* -----
     * Root Controller
     * This is the main controller and entry point for the Hub
     */
  app.controller('rootController', [
    '$q',
    '$log',
    '$scope',
    '$rootScope',
    '$window',
    '$location',
    '$i18n',
    '$profile',
    '$theme',
    '$registry',
    '$route',
    '$sessionExpired',
    '$http',
    '$timeout',
    '$staleData',
    'Idle',
    '$logoutWarn',
    '$utilities',
    '$ga',
    function ($q, $log, $scope, $rootScope, $window, $location, $i18n, $profile, $theme, $registry, $route, $sessionExpired, $http, $timeout, $staleData, Idle, $logoutWarn, $utilities, $ga) {
      $scope.user = cisco.user;
      $profile.updateProfileFullname();
      $scope.settings = cisco.params;
      $scope.isLoggingIn = true;
      $scope.isLoggingOut = false;
      $scope.isDesktop = true;
      // Check header / footer URL params
      var urlParams = $location.search();
      if (urlParams.showHeader && urlParams.showHeader === 'false') {
        $scope.settings.showHeader = false;
      }
      if (urlParams.showFooter && urlParams.showFooter === 'false') {
        $scope.settings.showFooter = false;
      }
      var baseUrl = $registry.byId('hub').baseUrl;
      // Loop the apps and check if we need to add any additional menus or actions
      // Actions are added to the contextual action dropdown button on the subnav
      // Menus are added to the top nav. Each menu needs an order # which we can use to
      // sort on 1-n. This info comes from each app's appDescriptor.json file
      // Also load each app's i18n resource bundle (if one exists)
      $scope.menus = [];
      $scope.menuOptions = [];
      $scope.actions = [];
      $scope.menus = _.reduce($registry.getApps(), function (memo, app) {
        if (app.menus.apollo && $scope.settings.showDashboard) {
          app.menus = app.menus.apollo;
        }
        if (app.menus && app.appId !== 'hubAdmin') {
          return memo.concat(app.menus);
        }
        return memo;
      }, []);
      var hubAdmin = _.find($registry.getApps(), { appId: 'hubAdmin' });
      if (hubAdmin && hubAdmin.menus) {
        $scope.adminMenu = _.first(hubAdmin.menus);
        $scope.adminMenu.items = _.reject($scope.adminMenu.items, { name: 'Branding' });
      }
      $scope.menuOptions = _.clone($scope.menus);
      $scope.actions = _.reduce($registry.getApps(), function (memo, app) {
        if (app.actions) {
          return memo.concat(app.actions);
        }
        return memo;
      }, []);
      _.chain($scope.menus).filter({ type: 'pulldown' }).each(function (menu) {
        $scope.menuOptions = $scope.menuOptions.concat(menu.items);
        _.each(menu.items, function (item) {
          item.type = 'link';
        });
      });
      $scope.i18n = $i18n.getString;
      // Feedback widget config
      $scope.feedbackOptions = {
        'url': $registry.byId('hub').baseWsUrl + '/feedback',
        'to': $scope.settings.feedbackToAddress,
        'from': $scope.settings.feedbackFromAddress,
        'subject': $scope.settings.feedbackSubject,
        'maxChars': $scope.settings.feedbackMaxChars,
        'context': $scope.settings.feedbackContext
      };
      // Environment Setting Defaults
      _.defaults($scope.settings, {
        helpUrl: 'help',
        helpTarget: '',
        showHelpInModal: false,
        showAdminMenuItems: false,
        showBroadcastMessage: false,
        broadcastSeverity: 'info',
        broadcastMessage: ''
      });
      // --- Branding and Theme
      if (cisco.account) {
        $scope.branding = {
          title: cisco.account.brandingTitle,
          link: cisco.account.brandingLink || 'http://www.cisco.com',
          marquee: cisco.account.brandingLogoUrl,
          description: cisco.account.brandingDescription
        };
      } else {
        $scope.branding = { link: 'http://www.cisco.com' };
      }
      $theme.setBaseUrl(baseUrl + '/');
      $theme.setCurrentTheme(cisco.user.theme);
      $scope.setPageTitle = function (title) {
        $scope.pageTitle = title;
      };
      $scope.setActive = function (idx) {
        $scope.slides[idx].active = true;
      };
      $rootScope.setBranding = function (obj) {
        $scope.branding = obj;
      };
      // --- Logout
      $scope.doLogout = function () {
        // Cisco logout to remove ObSSOCookie, then Apollo to remove others
        $window.location = 'https://www.cisco.com/autho/logout.html?ReturnUrl=https://' + $window.location.hostname + '/doLogout';
      };
      // --- Navigation (Mobile)
      $scope.mobileMenu = {
        show: false,
        style: ''
      };
      $scope.closeMobileMenu = function (url, target) {
        $scope.mobileMenu.show = false;
        if (target === '_blank') {
          $window.open(url, target);
        } else {
          var currentPath = $location.path().slice(1);
          $location.path(url).search({});
          if (currentPath === url) {
            $route.reload();
          }
        }
      };
      $scope.toggleMobileMenu = function () {
        $scope.mobileMenu.show = !$scope.mobileMenu.show;
        if ($scope.mobileMenu.show) {
          var xtrans = $window.outerWidth - 84;
          // 84 = Hamburger thumb width (in pixels)
          $scope.mobileMenu.style = {
            '-webkit-transform': 'translateX(-' + xtrans + 'px)',
            '-moz-transform': 'translateX(-' + xtrans + 'px)',
            transform: 'translateX(-' + xtrans + 'px)'
          };
        } else {
          $scope.mobileMenu.style = '';
        }
      };
      // var win = angular.element($window);
      // win.bind('resize', function(e) {
      //     if ($scope.mobileMenu.show) {
      //         $scope.mobileMenu.style = '';
      //         $scope.mobileMenu.show = false;
      //         $scope.$apply();
      //     }
      // });
      // --- Miscellaneous
      $scope.$on('$viewContentLoaded', function () {
        // Send a page view using the URL value, default use of GA in this case
        // doesn't pick up our change to the URL
        $ga.pageview(window.location.pathname);
      });
      $scope.isMenuActive = function (menu) {
        if ($route.current) {
          if ($route.current.originalPath) {
            if ($route.current.originalPath.indexOf(menu.href) !== -1) {
              return true;
            }
          }
        }
        return false;
      };
      // User's session has expired, and force the browser to /hub
      $rootScope.$on('ExpiredSession', function () {
        $sessionExpired.show().then(function () {
          window.location.replace(window.location.protocol + '//' + window.location.host + '/' + cisco.params.baseUrl);
        });
      });
      // User trying to update stale data, let the user know and then reload
      // the page when they dismiss dialog
      $rootScope.$on('StaleData', function () {
        $staleData.show().then(function () {
          window.location.reload();
        });
      });
      // Two listeners to let Apollo know that it has transitioned to
      // online or offline
      window.addEventListener('online', function () {
        $rootScope.$apply(function () {
          $rootScope.$emit('ApolloOnLine', true);
        });
      });
      window.addEventListener('offline', function () {
        $rootScope.$apply(function () {
          $rootScope.$emit('ApolloOnLine', false);
        });
      });
      // --- Mobile Application Feature Check
      $rootScope.mobile = {
        isActive: false,
        hasScanner: false
      };
      $utilities.fetchMobileFeatures().then(function (result) {
        $rootScope.mobile.isActive = true;
        $rootScope.mobile.hasScanner = result.scanner || false;
      });
      // --- End of Mobile Application Feature Check
      // For each app that has a Service API defined and that Service API has an
      // init() function go ahead and invoke it. This gives each app a hook within
      // which they can initialize themselves (if necessary) at startup
      _.each(cisco.apps, function (app) {
        $registry.getServiceApi(app.appId).then(function (api) {
          if (api && typeof api.init === 'function') {
            api.init().then(function () {
              $log.log('Service API init() complete for app ' + app.name);
            });
          } else {
            $log.log('No Service API init() found for app ' + app.name);
          }
        });
      });
      //$idle implimentation
      $scope.$on('IdleWarn', function () {
      });
      $scope.$on('IdleTimeout', function () {
        // the user has timed out (meaning idleDuration + warningDuration has passed without any activity)
        // this is where you'd logout them
        $scope.doLogout();
      });
      $rootScope.$on('keepAlive', function () {
        //reset the $idle timer
        Idle.watch();
      });
      //force logout after 12 hours
      var startTime = Date.now() / 1000;
      var maxInUseTime = 12 * 60 * 60;
      $scope.$on('$keepalive', function () {
        var currentTime = Date.now() / 1000;
        if (currentTime - startTime > maxInUseTime) {
          $logoutWarn.show().then(function () {
            $scope.doLogout();
          });
        }
      });
      $scope.$on('$routeChangeStart', function (e, next) {
        if (next.templateUrl) {
          $scope.sccRoute = next.templateUrl.indexOf('case-collect.html') !== -1;
          $scope.IBRoute = next.templateUrl.indexOf('WebContent/ib-') !== -1;
          $scope.SARoute = next.templateUrl.indexOf('WebContent/sa-') !== -1 || $utilities.isStandalone && next.templateUrl.indexOf('sa/') !== -1;
        }
      });
      $scope.isLoggingOut = false;
      $scope.isLoggingIn = false;
      //spinner scope
      $rootScope.inputSpin = false;
      $rootScope.inputSpinMsg = '';
      // Detect if iOS Device
      if (/(iPad|iPhone|iPod)/.test(navigator.userAgent)) {
        $(document.body).addClass('is-ios-device');
      }
      // Detect mobile versus desktop and add class to body
      $scope.isDesktop = $utilities.isMobile() ? false : true;
    }
  ]);
  app.directive('routeModal', [
    '$registry',
    '$modal',
    function ($registry, $modal) {
      return {
        restrict: 'A',
        link: function ($scope, $el, attrs) {
          $el.on('click', function () {
            var route = appRoutes.routes[attrs.routeModal];
            if (route) {
              require(route.dependencies, function () {
                $modal.open({ templateUrl: route.templateUrl });
              });
            }
          });
        }
      };
    }
  ]);
  // Fix for mobile modal click events (mainly on Android)
  // https://github.com/angular-ui/bootstrap/issues/2017
  app.directive('stopEvent', function () {
    return {
      restrict: 'A',
      link: function ($scope, $el, attrs) {
        $el.on(attrs.stopEvent, function (e) {
          e.stopPropagation();
        });
      }
    };
  });
  return app;
});