/* -----
 * Apollo Feedback Module
 * Contains the feedback slide-out widget which posts a msg to the server
 */
define([
  'angular',
  'moment',
  'underscore'
], function (angular, moment, _) {
  angular.module('apollo.feedback', ['apollo.utilities']).directive('feedback', [
    '$modal',
    function ($modal) {
      // NOTE: This is the Feedback widget for all apps EXCEPT the Standalone CLI Analyzer (see below)
      return {
        scope: true,
        link: function ($scope) {
          $scope.openFeedbackModal = function (opts) {
            $modal.open({
              template: [
                '<div class="modal-header text-center">',
                '<button class="close" ng-click="$dismiss()" ga-collect="HU-FeedbackClose"><span class="icon-close"></span></button>',
                '<h1 ng-bind="\'_Feedback_\' | i18n"></h1>',
                '<p class="subheading" ng-bind="\'_TellUsWhatYouThink_\' | i18n"></p>',
                '</div>',
                '<div class="modal-body" stop-event="touchend">',
                '<div class="rating">',
                '<div class="rating__stars">',
                '<a ng-click="sendRating(5)" ng-class="{active: feedback.rating == 5}" class="rating__star" title="5 Stars" ga-collect="HU-FeedbackRating"><span class="icon-star"></span></a>',
                '<a ng-click="sendRating(4)" ng-class="{active: feedback.rating >= 4}" class="rating__star" title="4 Stars" ga-collect="HU-FeedbackRating"><span class="icon-star"></span></a>',
                '<a ng-click="sendRating(3)" ng-class="{active: feedback.rating >= 3}" class="rating__star" title="3 Stars" ga-collect="HU-FeedbackRating"><span class="icon-star"></span></a>',
                '<a ng-click="sendRating(2)" ng-class="{active: feedback.rating >= 2}" class="rating__star" title="2 Stars" ga-collect="HU-FeedbackRating"><span class="icon-star"></span></a>',
                '<a ng-click="sendRating(1)" ng-class="{active: feedback.rating >= 1}" class="rating__star" title="1 Star"  ga-collect="HU-FeedbackRating"><span class="icon-star"></span></a>',
                '</div>',
                '</div>',
                '<form name="feedbackForm" novalidate>',
                '<div class="form-group">',
                '<div class="form-group__text">',
                '<textarea autofocus rows="1" name="message" ng-model="feedback.message" ng-maxlength="{{ options.maxChars }}" ng-model-options="{ allowInvalid: true }" ng-trim="false" id="feedback-comments" msd-elastic></textarea>',
                '<label for="feedback-comments" ng-bind="\'_Comments_\' | i18n"></label>',
                '</div>',
                '</div>',
                '<div class="help-block text-danger" ng-show="feedbackForm.message.$error.maxlength">',
                '<span class="icon-exclamation-circle"></span> ',
                '<span ng-bind="\'_CommonErrorMaxlength_\' | i18n:options.maxChars"></span>',
                '</div>',
                '<div class="help-block text-right">{{ feedback.message.length }} / {{ options.maxChars }}</div>',
                '</form>',
                '</div>',
                '<div class="modal-footer">',
                '<span ng-if="!isSubmitting">',
                '<button ng-click="$dismiss()" class="button" ng-bind="\'_Cancel_\' | i18n" ga-collect="HU-FeedbackCancel"></button> ',
                '<button ng-click="sendFeedback()" class="button button--cta" ng-disabled="!feedback.message || feedbackForm.$invalid" ng-bind="\'_Submit_\' | i18n" ga-collect="HU-FeedbackSubmit"></button>',
                '</span>',
                '<loading-dots ng-if="isSubmitting" class="loading-dots--muted"></loading-dots>',
                '</div>'
              ].join(''),
              controller: [
                '$scope',
                '$http',
                function ($scope, $http) {
                  $scope.options = opts;
                  _.defaults($scope.options, {
                    url: '/feedback',
                    subject: 'unknown subject',
                    context: 'unknown',
                    maxChars: 300
                  });
                  $scope.feedback = {
                    message: '',
                    rating: -1
                  };
                  $scope.isSubmitting = false;
                  $scope.sendFeedback = function () {
                    $scope.isSubmitting = true;
                    $scope.sendRequest({
                      area: 'feedback',
                      value: $scope.feedback.message
                    }).then($scope.$close);
                  };
                  $scope.sendRating = function (rating) {
                    $scope.feedback.rating = rating;
                    $scope.sendRequest({
                      area: 'rating',
                      value: $scope.feedback.rating
                    });
                  };
                  $scope.sendRequest = function (payload) {
                    payload.env = $scope.options.context;
                    payload.subject = $scope.options.subject;
                    payload.to = $scope.options.to;
                    payload.from = $scope.options.from;
                    return $http.post($scope.options.url, payload);
                  };
                }
              ]
            });
          };
        }
      };
    }
  ]).directive('sccFeedback', [
    '$modal',
    '$utilities',
    function ($modal, $utilities) {
      // NOTE: This is the Feedback widget specifically for the Standalone CLI Analyzer
      return {
        scope: true,
        link: function ($scope, $el, attrs) {
          $scope.options = $scope.$eval(attrs.options);
          $scope.openFeedbackModal = function () {
            $modal.open({
              scope: $scope,
              template: [
                '<div class="modal-header text-center">',
                '<button class="close" ng-click="$dismiss()"><span class="icon-close"></span></button>',
                '<h1>Feedback</h1>',
                '<p class="subheading">Tell us what you think...</p>',
                '</div>',
                '<div class="modal-body">',
                '<div class="rating">',
                '<div class="rating__stars">',
                '<a ng-click="sendRatingDebounce(5)" ng-class="{active: feedback.rating == 5}" class="rating__star" title="5 Stars" ga-collect="HU-FeedbackRating"><span class="icon-star"></span></a>',
                '<a ng-click="sendRatingDebounce(4)" ng-class="{active: feedback.rating >= 4}" class="rating__star" title="4 Stars" ga-collect="HU-FeedbackRating"><span class="icon-star"></span></a>',
                '<a ng-click="sendRatingDebounce(3)" ng-class="{active: feedback.rating >= 3}" class="rating__star" title="3 Stars" ga-collect="HU-FeedbackRating"><span class="icon-star"></span></a>',
                '<a ng-click="sendRatingDebounce(2)" ng-class="{active: feedback.rating >= 2}" class="rating__star" title="2 Stars" ga-collect="HU-FeedbackRating"><span class="icon-star"></span></a>',
                '<a ng-click="sendRatingDebounce(1)" ng-class="{active: feedback.rating >= 1}" class="rating__star" title="1 Star" ga-collect="HU-FeedbackRating"><span class="icon-star"></span></a>',
                '</div>',
                '</div>',
                '<form name="feedbackForm" novalidate>',
                '<div ng-if="options.showProfileFields" class="form-group">',
                '<div class="form-group__text">',
                '<input autofocus ng-model="feedback.username" id="feedback-username"></input>',
                '<label for="feedback-username">Name</label>',
                '</div>',
                '</div>',
                '<div ng-if="options.showProfileFields" class="form-group">',
                '<div class="form-group__text">',
                '<input ng-model="feedback.email" id="feedback-email"></input>' + '<label for="feedback-email">Email</label>',
                '</div>',
                '</div>',
                '<div class="form-group">',
                '<div class="form-group__text">',
                '<textarea rows="1" name="message" ng-model="feedback.message" ng-maxlength="{{ options.maxChars }}" ng-model-options="{ allowInvalid: true }" ng-trim="false" id="feedback-comments" msd-elastic></textarea>',
                '<label for="feedback-comments">Comments</label>',
                '</div>',
                '</div>',
                '<div class="help-block" ng-show="feedbackForm.message.$error.maxlength">',
                '<span class="icon-exclamation-circle"></span> ',
                '<span ng-bind="\'_CommonErrorMaxlength_\' | i18n:options.maxChars"></span>',
                '</div>',
                '<div class="help-block text-right">{{ feedback.message.length }} / {{ options.maxChars }}</div>',
                '</form>',
                '</div>',
                '<div class="modal-footer">',
                '<span ng-if="!isSubmitting">',
                '<button ng-click="$dismiss()" class="button button--small">Cancel</button> ',
                '<button ng-click="sendFeedback()" class="button button--cta button--small" ng-disabled="!feedback.message || feedbackForm.$invalid">Submit</button>',
                '</span>',
                '<loading-dots ng-if="isSubmitting" class="loading-dots--muted"></loading-dots>',
                '</div>'
              ].join(''),
              controller: [
                '$scope',
                '$http',
                function ($scope, $http) {
                  var cliVersion = cisco.version, clientOS = $utilities.getOSVersion();
                  _.defaults($scope.options, {
                    url: '/rating',
                    context: 'unknown',
                    maxChars: 1000,
                    showProfileFields: false,
                    profile: {}
                  });
                  $scope.feedback = {
                    email: $scope.options.profile.pf_auth_email || '',
                    message: '',
                    rating: -1,
                    username: $scope.options.profile.username || ''
                  };
                  $scope.open = false;
                  $scope.isSubmitting = false;
                  $scope.$watch('options.url', function (n, o) {
                    if (n && n !== o) {
                      console.log('Feedback Url changed to ' + n);
                      $scope.options.url = n;
                    }
                  });
                  $scope.sendRatingDebounce = _.debounce(function (n) {
                    $scope.feedback.rating = n;
                    var payload = {
                        env: $scope.options.context,
                        area: 'rating',
                        value: $scope.feedback.rating,
                        os: clientOS,
                        cliVersion: cliVersion
                      };
                    $scope.sendRequest(payload);
                  }, 1500);
                  $scope.sendFeedback = function () {
                    $scope.isSubmitting = true;
                    var payload = {
                        env: $scope.options.context,
                        area: 'feedback',
                        value: $scope.feedback.message,
                        os: clientOS,
                        cliVersion: cliVersion
                      };
                    $scope.sendRequest(payload).then($scope.$close);
                  };
                  $scope.sendRequest = function (payload) {
                    if ($scope.options.showProfileFields) {
                      payload.profile = _.extend($scope.options.profile, _.pick($scope.feedback, 'username', 'email'));
                    }
                    console.log('Sending feedback using options');
                    console.dir($scope.options);
                    return $http.post($scope.options.url, payload);
                  };
                }
              ]
            });
          };
        }
      };
    }
  ]).service('$chhFeedback', [
    '$modal',
    '$utilities',
    function ($modal, $utilities) {
      return function (options) {
        return $modal.open({
          template: [
            '<div class="modal-header text-center">',
            '<button class="close" ng-click="$dismiss()"><span class="icon-close"></span></button>',
            '<h4 ng-bind="::\'_SARequestCHHContentModal_\' | i18n"></h4>',
            '</div>',
            '<div class="modal-body">',
            '<form name="feedbackForm" novalidate>',
            '<div ng-if="options.showProfileFields" class="form-group">',
            '<div class="form-group__text">',
            '<input autofocus ng-model="feedback.username" id="feedback-username"></input>',
            '<label for="feedback-username" ng-bind="::\'_Username_\' | i18n"></label>',
            '</div>',
            '</div>',
            '<div ng-if="options.showProfileFields" class="form-group">',
            '<div class="form-group__text">',
            '<input ng-model="feedback.email" id="feedback-email"></input>' + '<label for="feedback-email" ng-bind="::\'_Email_\' | i18n"></label>',
            '</div>',
            '</div>',
            '<div class="form-group">',
            '<div class="form-group__text">',
            '<input ng-model="feedback.command" id="feedback-command" required></input>' + '<label for="feedback-command" ng-bind="::\'_Command_\' | i18n"></label>',
            '<div class="required-block"><span class="icon-asterisk"></span></div>',
            '</div>',
            '</div>',
            '<div class="form-group">',
            '<div class="form-group__text">',
            '<input ng-model="feedback.content" id="feedback-content" required></input>' + '<label for="feedback-content" ng-bind="::\'_Content_\' | i18n"></label>',
            '<div class="required-block"><span class="icon-asterisk"></span></div>',
            '</div>',
            '</div>',
            '<div class="form-group">',
            '<div class="form-group__text">',
            '<textarea rows="1" name="comment" ng-model="feedback.comment" ng-maxlength="{{ options.maxChars }}" ng-model-options="{ allowInvalid: true }" ng-trim="false" id="feedback-comments" msd-elastic></textarea>',
            '<label for="feedback-comments" ng-bind="::\'_Comments_\' | i18n"></label>',
            '</div>',
            '</div>',
            '<div class="help-block" ng-show="feedbackForm.comment.$error.maxlength">',
            '<span class="icon-exclamation-circle"></span> ',
            '<span ng-bind="::\'_CommonErrorMaxlength_\' | i18n:options.maxChars"></span>',
            '</div>',
            '<div class="help-block text-right">{{ feedback.comment.length }} / {{ options.maxChars }}</div>',
            '</form>',
            '</div>',
            '<div class="modal-footer">',
            '<span ng-if="!isSubmitting">',
            '<button ng-click="$dismiss()" class="button button--small" ng-bind="::\'_Cancel_\' | i18n"></button> ',
            '<button ng-click="sendFeedback()" class="button button--cta button--small" ng-disabled="feedbackForm.$invalid" ng-bind="::\'_Submit_\' | i18n"></button>',
            '</span>',
            '<loading-dots ng-if="isSubmitting" class="loading-dots--muted"></loading-dots>',
            '</div>'
          ].join(''),
          controller: function ($scope, $http) {
            var cliVersion = cisco.version, clientOS = $utilities.getOSVersion();
            console.log('cliVersion: ' + cliVersion + ', clientOS: ' + clientOS);
            $scope.options = _.defaults(options, {
              url: '/chh',
              context: 'unknown',
              maxChars: 1000,
              profile: {}
            });
            $scope.feedback = {
              username: $scope.options.profile.username || '',
              email: $scope.options.profile.pf_auth_email || '',
              command: $scope.options.command,
              content: $scope.options.content,
              deviceInfo: $scope.options.deviceInfo,
              comment: ''
            };
            $scope.sendFeedback = function () {
              $scope.isSubmitting = true;
              return $http.post($scope.options.url, {
                env: $scope.options.context,
                area: 'chh',
                value: _.pick($scope.feedback, 'command', 'content', 'deviceInfo', 'comment'),
                profile: _.assign($scope.options.profile, _.pick($scope.feedback, 'username', 'email')),
                os: clientOS,
                cliVersion: cliVersion
              }).then($scope.$close).finally(function () {
                $scope.isSubmitting = false;
              });
            };
          }
        }).result;
      };
    }
  ]);
});