define([
  'appModule',
  'underscore'
], function (app, _) {
  //IE11 doesn't have window.location.origin property yet
  if (!window.location.origin) {
    window.location.origin = window.location.protocol + '//' + window.location.hostname;
  }
  var ERROR_REGEX = /#error=.*/;
  var TOKEN_SUCCESS_REGEX = /access_token=.*/;
  var CODE_SUCCESS_REGEX = /code=.*/;
  var WINDOW_CHECK_DELAY = 1000;
  var OAUTH_REDIRECT = 'validate';
  var REDIRECT_URI = 'https://' + window.location.hostname + '/oauth/';
  var USER_CLOSED_LOGIN_WINDOW = 1;
  var USER_DENIED_APOLLO = 2;
  var POPUPS_BLOCKED = 3;
  var MAX_RETRIES = 3;
  var TOKENS = {};
  var CODES = {};
  function CISCO_OAUTH_CODE_URL(clientId, redirect) {
    if (clientId) {
      var cid = 'client_id=', red = '&redirect_uri=';
      var codeUrl = cisco.oauth.codeUrl;
      return codeUrl.substr(0, codeUrl.indexOf(cid) + cid.length) + clientId + codeUrl.substr(codeUrl.indexOf(red), codeUrl.length) + REDIRECT_URI + (redirect || OAUTH_REDIRECT) + '.html';
    } else {
      return cisco.oauth.codeUrl + REDIRECT_URI + (redirect || OAUTH_REDIRECT) + '.html';
    }
  }
  function CISCO_OAUTH_TOKEN_URL(clientId, redirect) {
    if (clientId) {
      var cid = 'client_id=', red = '&redirect_uri=';
      var tokenUrl = cisco.oauth.tokenUrl;
      return tokenUrl.substr(0, tokenUrl.indexOf(cid) + cid.length) + clientId + tokenUrl.substr(tokenUrl.indexOf(red), tokenUrl.length) + REDIRECT_URI + (redirect || OAUTH_REDIRECT) + '.html';
    } else {
      return cisco.oauth.tokenUrl + REDIRECT_URI + (redirect || OAUTH_REDIRECT) + '.html';
    }
  }
  app.service('ciscoOauthService', function ($rootScope, $q, $modal, $http, $log, $registry) {
    var hubApp = $registry.byId('hub');
    function APOLLO_OAUTH_TOKEN_URL(clientId, redirect) {
      return hubApp.baseWsUrl + '/oauth/token/' + (clientId || cisco.oauth.clientId) + '/' + (redirect || OAUTH_REDIRECT);
    }
    function APOLLO_OAUTH_CODE_URL(clientId, redirect) {
      return hubApp.baseWsUrl + '/oauth/code/' + (clientId || cisco.oauth.clientId) + '/' + (redirect || OAUTH_REDIRECT);
    }
    /**
    * Holds the current OAuth "access_token" value
    * @type {Object}
    */
    var tokenAuth = {
        expires_in: null,
        token_type: null,
        access_token: null
      };
    /**
    * Holds the current OAuth "code" value
    * @type {Object}
    */
    var codeAuth = {
        code: null,
        expires_in: null
      };
    // Active values for processing the current request
    var ciscoOauthWindow = null;
    var oauthPromise = null;
    var oauthValueFunc = null;
    var timerId = null;
    var client_id = null;
    /**
    * Holds queued data.  queued will be set when the Nth call (N > 1) is
    * of a different type from the outstanding request.  Request types
    * are: code and access_token
    * @type Queded parameters
    */
    var queued = {
        promise: null,
        URL: null,
        valueFunc: null,
        client_id: null
      };
    /**
    * Processes an URL and extracts the AUTH Code value,
    * returns the existing Auth Code value if href is null
    * @param  {null|string} href URL to extract access_token from
    * @return null|<auth code> Null if no value, OAuth Auth Code otherwise
    */
    var _tokenValue = function (href) {
      if (href) {
        if (!TOKEN_SUCCESS_REGEX.test(href))
          return null;
        // Extract params from URL
        var parts = href.split('#');
        if (parts.length === 2) {
          // Split the params into their name=value sections
          var params = parts[1].split('&');
          for (var xx = 0; xx < params.length; xx++) {
            // Split name from value
            var paramPieces = params[xx].split('=');
            tokenAuth[paramPieces[0]] = paramPieces[1];
          }
        }
      }
      addToken();
      return tokenAuth.access_token;
    };
    /**
    * Processes an URL and extracts the AUTH Code value,
    * returns the existing Auth Code value if href is null
    * @param  {null|string} href URL to extract code from
    * @return null|<auth code> Null if no value, OAuth Auth Code otherwise
    */
    var _codeValue = function (href) {
      if (href) {
        if (!CODE_SUCCESS_REGEX.test(href))
          return null;
        // Extract params from URL
        var parts = href.split('?');
        if (parts.length === 2) {
          // Split the params into their name=value sections
          var params = parts[1].split('&');
          for (var xx = 0; xx < params.length; xx++) {
            // Split name from value
            var paramPieces = params[xx].split('=');
            codeAuth[paramPieces[0]] = paramPieces[1];
          }
        }
      }
      addCode();
      return codeAuth.code;
    };
    function addToken() {
      var time = new Date().getTime();
      var parsed = parseInt(tokenAuth.expires_in);
      TOKENS[client_id] = {
        token: tokenAuth.access_token,
        expiration: time + (parsed - 500) * 1000
      };
    }
    function addCode() {
      var time = new Date().getTime();
      var parsed = parseInt(codeAuth.expires_in);
      CODES[client_id] = {
        token: codeAuth.code,
        expiration: time + (parsed - 500) * 1000
      };
    }
    function fetchFromCache(cache) {
      var token = cache[client_id];
      var time = new Date().getTime();
      return token && token.expiration >= time ? token.token : null;
    }
    /**
    * Call Apollo Cisco OAuth proxy first.  The first time a user
    * hits OAuth the Apollo OAuth call will fail and we fallback
    * to showing a popup.  After that first popup, this call should
    * always succeeds and removes the need for a popup
    */
    var _apolloOauth = function (apolloAuthUrl, ciscoAuthUrl) {
      _recursiveApolloOauth(apolloAuthUrl, ciscoAuthUrl, MAX_RETRIES).then(function (token) {
        if (token) {
          oauthPromise.resolve(token);
        } else {
          _openAuthWindow(ciscoAuthUrl);
        }
      });
    };
    var _recursiveApolloOauth = function (apolloAuthUrl, ciscoAuthUrl, retries) {
      return $http.get(apolloAuthUrl).then(function (result) {
        try {
          if (result.data.success) {
            if (result.data.token) {
              tokenAuth.access_token = result.data.token;
              tokenAuth.expires_in = result.data.expiration;
              addToken();
            } else {
              codeAuth.code = result.data.token;
              codeAuth.expires_in = result.data.expiration;
              addCode();
            }
            return result.data.token;
          } else if (retries > 0) {
            return _recursiveApolloOauth(apolloAuthUrl, ciscoAuthUrl, --retries);
          }
        } catch (e) {
          $log.error('Failed to get oauth code/token via Apollo, default to Cisco: ', e);
        }
      }, function () {
        _openAuthWindow(ciscoAuthUrl);
      });
    };
    /**
    * Internal cleanup promise callback, works for both
    * success and failure.  Closes the popup window
    * and starts up the queued request if one is waiting
    * @return {[type]} [description]
    */
    var _oauthCleanup = function () {
      if (ciscoOauthWindow && ciscoOauthWindow.close) {
        ciscoOauthWindow.close();
      }
      oauthPromise = null;
      ciscoOauthWindow = null;
      client_id = null;
      // If there is a queued up auth request, send it off
      // moving all queued data forward (Value processing function,
      // promise already returned to consumers).  Wipe out
      // the existing queued promise reference
      if (queued.promise) {
        oauthValueFunc = queued.valueFunc;
        oauthPromise = queued.promise;
        client_id = queued.client_id;
        queued.promise = null;
        // Register cleanup code on our
        oauthPromise.promise.then(_oauthCleanup, _oauthCleanup);
        // get the queued token/code value
        _apolloOauth(queued.URL.apollo, queued.URL.cisco);
      }
    };
    /**
    * Callback function from timer to validate if the OAuth window
    * has returned to Apollo.  If so, then the appropriate code/access_token
    * will be extracted.
    */
    var _validateOauthWindow = function () {
      // $log.debug("Checking login frame");
      // No window attribute, user must have closed the dialog
      // without Accept/Deny
      if (ciscoOauthWindow && ciscoOauthWindow.window === null) {
        window.removeEventListener('message', _receiveOauthToken, false);
        oauthPromise.reject(USER_CLOSED_LOGIN_WINDOW);
        return;
      }
      timerId = setTimeout(_validateOauthWindow, WINDOW_CHECK_DELAY);
    };
    // PostMessage receiver for the OAUth redirect window
    var originRegex = new RegExp('^https://' + location.hostname);
    function _receiveOauthToken(event) {
      // If we receive a postMessage, but not from OAuth window, ignore
      if (!originRegex.test(event.origin)) {
        return;
      }
      // Attempt to parse data and validate it is oauth data
      var data = null;
      try {
        data = JSON.parse(event.data);
      } catch (e) {
        $log.error('Failed to parse inter-window message (' + event.data + ': ' + e);
      }
      if (!data || data.type !== 'oauth') {
        $log.debug('Received message for another listener: ' + event.data);
        return;
      }
      // Cleanup our handler and timer
      window.removeEventListener('message', _receiveOauthToken, false);
      clearTimeout(timerId);
      var href = data.href;
      // We got an error, this is a user "Deny" of API access
      if (ERROR_REGEX.test(href)) {
        oauthPromise.reject(USER_DENIED_APOLLO);
        return;
      }
      // See if access_token is present
      var authValue = oauthValueFunc(href);
      // Did we get a token, yes resolve otherwise wait some more time
      if (authValue) {
        $log.debug('Got valid oauth value: ' + authValue);
        oauthPromise.resolve(authValue);
      } else {
        oauthPromise.reject(USER_DENIED_APOLLO);
      }
    }
    /**
    * Opens a popup for OAuth login, Allow/Deny flow.
    * @param  {string} authUrl Authorization end point for the grant types
    */
    var _openAuthWindow = function (authUrl) {
      $rootScope.$emit('HUB-OauthOpenWindow');
      // We use a window.open because cloud-sso has X-Frame-Options set to DENY,
      // so you either change the original source, ferry APIX login through our Apache server
      // or open in a popup.  With a window popup, you have to use setTimeout to check
      // load status
      ciscoOauthWindow = window.open(authUrl, 'Cisco API Authorization', 'height=450,width=650');
      // If window reference is null, then browser is blocking popups
      if (ciscoOauthWindow !== null) {
        window.addEventListener('message', _receiveOauthToken, false);
        setTimeout(_validateOauthWindow, WINDOW_CHECK_DELAY);
      } else {
        oauthPromise.reject(POPUPS_BLOCKED);
      }
    };
    /**
    * Kicks off an oauth grant type request or queues if an existing
    * request of the opposite type is already in progress
    * @param  {[Function]} authValueFunc Function which will return the current
    *                                    value or extract a new value from
    *                                    the redirect URI
    * @param  {[string]} authUrl         URL for a specific grant type
    * @return {[Promise]}                Promise to listen for success/failure
    */
    var _getAuth = function (authValueFunc, apolloAuthUrl, ciscoAuthUrl, cache, clientId) {
      client_id = clientId || cisco.oauth.clientId;
      // If we are already waiting for an access_token, append to the promise
      if (oauthPromise) {
        if (oauthValueFunc === authValueFunc)
          return oauthPromise.promise;
        if (!queued.promise) {
          queued.promise = $q.defer();
          queued.URL = {
            apollo: apolloAuthUrl,
            cisco: ciscoAuthUrl
          };
          queued.valueFunc = authValueFunc;
          queued.client_id = client_id;
        }
        return queued.promise.promise;
      }
      oauthPromise = $q.defer();
      // If we don't have a token, then open the popup window, otherwise send access_token
      // to the listeners
      var currValue = fetchFromCache(cache);
      if (currValue === null) {
        oauthValueFunc = authValueFunc;
        _apolloOauth(apolloAuthUrl, ciscoAuthUrl);
      } else {
        oauthPromise.resolve(currValue);
      }
      // Register cleanup code on our
      oauthPromise.promise.then(_oauthCleanup, _oauthCleanup);
      return oauthPromise.promise;
    };
    return {
      getToken: function (clientId) {
        return _getAuth(_tokenValue, APOLLO_OAUTH_TOKEN_URL(clientId), CISCO_OAUTH_TOKEN_URL(clientId), TOKENS, clientId);
      },
      getAuthCode: function (clientId) {
        return _getAuth(_codeValue, APOLLO_OAUTH_CODE_URL(clientId), CISCO_OAUTH_CODE_URL(clientId), CODES, clientId);
      },
      USER_CLOSED_LOGIN_WINDOW: USER_CLOSED_LOGIN_WINDOW,
      USER_DENIED_APOLLO: USER_DENIED_APOLLO,
      POPUPS_BLOCKED: POPUPS_BLOCKED
    };
  });
  app.service('ciscoAPIxService', function ($http, $log, ciscoOauthService, $apolloCollect) {
    return function (parser, cache) {
      return {
        read: function (url, params, successCallback, errCallback) {
          var data = typeof cache !== 'undefined' ? cache() : {};
          if (!_.isEmpty(data)) {
            successCallback({ content: parser(data) });
          } else {
            ciscoOauthService.getToken().then(function (token) {
              var opts = { headers: { 'Authorization': 'Bearer ' + encodeURIComponent(token) } };
              $http.get(url, opts).success(function (data, status) {
                successCallback({ content: parser(data) }, status);
              }).error(errCallback);
            }, function (err) {
              $apolloCollect.error({
                operation: 'Oauth-AccessToken',
                value: err
              }, 'OauthService');
              $log.error('Failed to retrieve Cisco Access Token. Error: ', err);
            });
          }
        }
      };
    };
  });
  app.service('ciscoAPIxService2', function ($http, $log, ciscoOauthService, $apolloCollect) {
    return {
      get: function (url) {
        return ciscoOauthService.getToken().then(function (token) {
          var opts = { headers: { 'Authorization': 'Bearer ' + encodeURIComponent(token) } };
          return $http.get(url, opts);
        }, function (err) {
          $log.error('Failed to retrieve Cisco Access Token. Error: ', err);
          $apolloCollect.error({
            operation: 'Oauth-AccessToken',
            value: err
          }, 'OauthService');
          return err;
        });
      }
    };
  });
});