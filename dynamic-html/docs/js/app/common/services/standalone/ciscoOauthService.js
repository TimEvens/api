define([
  'appModule',
  'underscore',
  'pubsub-js',
  'text!../../../js/sa/clientCfg.json'
], function (app, _, $topic, ccfg) {
  app.service('ciscoOauthService', [
    '$modal',
    '$q',
    '$proxyConfig',
    '$logger',
    '$timeout',
    '$apolloCollect',
    function ($modal, $q, $proxyConfig, $logger, $timeout, $apolloCollect) {
      var Cco = require('apollo-cisco-cco');
      var Oauth = require('apollo-cisco-oauth');
      var https = require('https');
      var url = require('url');
      var cfg = JSON.parse(ccfg);
      var ciscoOAuth, ciscoSSO;
      var oAuthConstructor = {
          host: cfg.oauth.host,
          client_id: cfg.oauth.clientid,
          codeUrl: cfg.oauth.codeUrl,
          tokenUrl: cfg.oauth.tokenUrl
        };
      var ccoConstructor = {
          host: cfg.sso.host,
          url: cfg.sso.url
        };
      var userConstructor = {};
      $proxyConfig.applyProxy().then(function (proxy) {
        if (proxy) {
          oAuthConstructor.proxy = proxy;
          ccoConstructor.proxy = proxy;
          userConstructor.agent = proxy;
        }
        ciscoOAuth = new Oauth(oAuthConstructor);
        ciscoSSO = new Cco(ccoConstructor);
      });
      /**
         * Holds the current obssoCookie value
         * @type {Object}
        */
      var sessionVars = {
          token: null,
          obssoCookie: null,
          profile: {},
          user: {
            userId: null,
            name: null,
            userLevel: 0
          }
        };
      /**
         * Opens a modal where the user can enter SSO credentials to get a CCO oauthtoken
         *
         * @param {String} errorMsg Error msg that will be displayed on the modal
         * @return {Promise} Promise object that receives the user's
         *         credentials on success or failure reason on error
         */
      function _getSSOCredentials(errorMsg, credentials) {
        return $modal.open({
          size: 'sm',
          template: [
            '<div class="modal-header">',
            '<button class="close" ng-click="$dismiss(dismissalReason)"><span class="icon-close"></span></button>',
            '<h4 class="modal-title">CCO Login Required</h4>',
            '</div>',
            '<div class="modal-body">',
            '<form name="ccoLogin" ng-submit="$close(credentials)" novalidate>',
            '<p style="font-size: 14px; line-height: 18px">This secure operation requires your Cisco login credentials</p>',
            '<fieldset>',
            '<div class="form-group">',
            '<div class="form-group__text">',
            '<input name="userId" id="userId" type="text" ng-model="credentials.userId" deferred-focus required>',
            '<label for="userId" autofocus>Username</label>',
            '<div class="required-block"><span class="icon-asterisk"></span></div>',
            '</div>',
            '</div>',
            '<div class="form-group">',
            '<div class="form-group__text">',
            '<input name="password" id="password" type="password" ng-model="credentials.password" required>',
            '<label for="password">Password</label>',
            '<div class="required-block"><span class="icon-asterisk"></span></div>',
            '</div>',
            '</div>',
            '</fieldset>',
            '<div class="alert alert--danger" ng-if="errorMsg">',
            '<div class="alert__icon"><span class="icon-alert"></span></div>',
            '<div class="alert__message" ng-bind="errorMsg"></div>',
            '</div>',
            '<button class="ng-hide" type="submit" ng-disabled="ccoLogin.$invalid"></button>',
            '</form>',
            '</div>',
            '<div class="modal-footer">',
            '<button class="button button--small" ng-click="$dismiss(dismissalReason)">Cancel</button>',
            '&nbsp;',
            '<button class="button button--primary button--small" ng-click="$close(credentials)" ng-disabled="ccoLogin.$invalid">Log In</button>',
            '</div>'
          ].join(''),
          controller: function ($scope) {
            $scope.credentials = credentials || {};
            $scope.dismissalReason = 'User did provide credentials';
            $scope.errorMsg = errorMsg;
          }
        }).result;
      }
      /*
         * Takes user credentials and gets an SSO cookie. Uses SSO cookie to get an SSO token.
         * Resolves success or error conditions on the service level `oauthPromise`
         *
         * @param {Object} credentials Contains `userId` and `password` keys
         */
      function _getOauthToken(credentials) {
        $topic.publish('consoleManager.ccoUser.loggingIn', { 'loggingIn': true });
        return ciscoSSO.login(credentials.userId, credentials.password).then(function (obssoCookie) {
          $topic.publish('consoleManager.ccoUser.credentialSave', { credentials: credentials });
          sessionVars.obssoCookie = obssoCookie;
          sessionVars.user.userId = credentials.userId;
          return ciscoOAuth.getToken(obssoCookie);
        }).catch(function (err) {
          $topic.publish('consoleManager.ccoUser.loggingIn', { 'loggingIn': false });
          _collectError(err, 'SASA-Oauth-getToken');
          return _getSSOCredentials('There was an error logging in. Check your username and password and try again.', credentials).then(_getOauthToken);
        }).finally(function () {
          // Use this as a catch all to make sure the overlay doesn't stay open
          $timeout(function () {
            $topic.publish('consoleManager.ccoUser.loggingIn', { 'loggingIn': false });
          }, 15000);
        });
      }
      /**
         * Retrieves a Cisco OAuth "access_token" from APIx.  Always returns a promise from
         * which success/failure are called.  This is the stand alone version
         * if obssoCookie is available in session, that'll be used
         * @return {Promise} Promise object for receiving the access_token or failure
         */
      function _getToken(credentials) {
        if (sessionVars.obssoCookie) {
          return ciscoOAuth.getToken(sessionVars.obssoCookie).catch(function () {
            return _getSSOCredentials('Session Expired, Please login again with your username and password.', credentials).then(_getOauthToken).then(function (token) {
              // requery user info in case they logged in as someone else:
              delete sessionVars.user.name;
              return _userInfoCall().finally(function () {
                $topic.publishSync('consoleManager.ccoUser.update', sessionVars);
                $topic.publishSync('consoleManager.ccoUser.loggingIn', { loggingIn: false });
                return token;
              });
            }).catch(function (err) {
              _collectError(err, 'SASA-Oauth-getToken');
              return $q.reject('getToken Error' + err);
            });
          });
        } else {
          return _getSSOCredentials(null, credentials).then(_getOauthToken);
        }
      }
      function _getAllInfo() {
        if (sessionVars.user.name) {
          return _getToken().then(function (token) {
            return _.extend(sessionVars, { token: token });
          });
        } else {
          return _getUserInfo();
        }
      }
      function _getUserInfo(credentials) {
        //Already grabbed the user info
        if (sessionVars.user.name) {
          return $q.when(sessionVars);
        } else {
          return _getToken(credentials).then(function (token) {
            sessionVars.token = token;
            return _userInfoCall();
          });
        }
      }
      function _collectError(err, operation) {
        $apolloCollect.error({
          operation: operation,
          value: err
        }, 'OauthService');
      }
      function _userInfoCall() {
        return $q(function (resolve, reject) {
          var pUrl = url.parse(cfg.userInfo.url);
          var options = {
              method: 'GET',
              host: pUrl.host,
              path: pUrl.path,
              port: 443,
              headers: { Cookie: 'ObSSOCookie=' + sessionVars.obssoCookie }
            };
          var req = https.request(_.extend({}, options, userConstructor), function (response) {
              var data = '';
              response.setEncoding('utf8');
              response.on('data', function (chunk) {
                data += chunk;
              });
              response.on('end', function () {
                try {
                  var json = JSON.parse(data);
                  sessionVars.profile = json;
                  sessionVars.profile.username = sessionVars.user.name = json.pf_auth_firstname + ' ' + json.pf_auth_lastname;
                  sessionVars.user.userLevel = json.pf_auth_user_level;
                  resolve(sessionVars);
                } catch (err) {
                  $logger.error(err);
                  _collectError(err, 'SASA-Oauth-UserInfo');
                  reject(sessionVars);
                }
              });
            });
          req.on('error', function (err) {
            $logger.error(err);
            _collectError(err, 'SASA-Oauth-UserInfo');
            reject(sessionVars);
          });
          req.end();
        });
      }
      return {
        getToken: _getToken,
        getAllInfo: _getAllInfo,
        getUserInfo: _getUserInfo
      };
    }
  ]);
});