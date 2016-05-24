define([
  'angular',
  'underscore'
], function (angular, _) {
  var app = angular.module('ap-scaffolding', []);
  app.directive('apolloHeader', function () {
    return {
      restrict: 'E',
      transclude: true,
      replace: true,
      scope: true,
      template: [
        '<div>',
        '<header class="header">',
        '<div class="header-bar container">',
        '<a ng-click="toggleMobileMenu()" ga-collect="HU-HeaderSidebar" class="button button--icon toggle-menu">',
        '<span class="icon-list-menu"></span>',
        '</a>',
        '<a class="header-bar__logo" ng-if="settings.showBrandingLogo" ng-href="{{ branding.link }}" ga-collect="HU-HeaderLogo" title="{{ branding.title }}">',
        '<span ng-if="!branding.marquee" class="icon-cisco"></span>',
        '<img ng-if="branding.marquee" alt="{{ branding.title }}" ng-src="{{ branding.marquee }}">',
        '</a>',
        '<div class="header-bar__main">',
        '<div class="header-breadcrumbs">',
        '<ul class="breadcrumb" ng-if="breadCrumbs.length">',
        '<li ng-repeat="bc in breadCrumbs" ng-class="{active: !bc.url}">',
        '<a ng-if="bc.url" ng-href="{{ bc.url }}" ga-collect="HU-HeaderBreadcrumb" ng-bind="bc.label"></a>',
        '<span ng-if="!bc.url" ng-bind="bc.label"></span>',
        '</li>',
        '</ul>',
        '</div>',
        '<div class="header-heading">',
        '<h1 class="page-title" aria-level="1" ng-bind="title"></h1>',
        '</div>',
        '<div class="header-menus">',
        '<div ng-transclude></div>',
        '</div>',
        '</div>',
        '<div class="header-toolbar" ng-if="settings.showHeader">',
        '<a ng-if="settings.showProfileName && settings.showProfileNameAsLink" route-modal="/profile" ga-collect="HU-HeaderProfile" class="avatar">',
        '<span ng-bind="user.fullname"></span>',
        '<span ng-if="settings.showProfileRole">',
        '&nbsp;(<span ng-bind="user.role"></span>)',
        '</span>',
        '</a>',
        '<span class="avatar" ng-if="settings.showProfileName && !settings.showProfileNameAsLink">',
        '<span ng-bind="user.fullname"></span>',
        '<span ng-if="settings.showProfileRole">',
        '&nbsp;(<span ng-bind="user.role"></span>)',
        '</span>',
        '</span>',
        '<a class="button button--icon" ng-show="settings.showNotifications && unreadNotifications &gt; 0" ga-collect="HU-HeaderNotifications" href="notifications" title="{{ unreadNotifications }} {{ ::\'_UnreadNotifications_\' | i18n }}">',
        '<span class="icon-alert"></span>',
        '<span class="button-subtext" ng-bind="unreadNotifications"></span>',
        '</a>',
        '<a class="button button--icon" ng-if="settings.showFeedback" feedback ga-collect="HU-HeaderFeedback" ng-click="openFeedbackModal(feedbackOptions)" title="{{ ::\'_Feedback_\' | i18n }}">',
        '<span class="icon-feedback"></span>',
        '</a>',
        '<a class="button button--icon" ng-if="settings.showLogoutLink" ng-click="doLogout()" ga-collect="HU-HeaderLogout" title="{{ ::\'_Logout_\' | i18n }}">',
        '<span class="icon-sign-out"></span>',
        '</a>',
        '<a class="button button--icon" ng-if="settings.showHelpInModal && settings.showHelpLink" ga-collect="HU-HeaderHelp" title="{{ ::\'_Help_\' | i18n }}" route-modal="/{{ settings.helpUrl }}">',
        '<span class="icon-help"></span>',
        '</a>',
        '<a class="button button--icon" ng-if="!settings.showHelpInModal && settings.showHelpLink" ga-collect="HU-HeaderHelp" title="{{ ::\'_Help_\' | i18n }}" target="{{ settings.helpTarget }}" ng-href="{{ settings.helpUrl }}">',
        '<span class="icon-help"></span>',
        '</a>',
        '</div>',
        '</div>',
        '</header>',
        '<div class="breadcrumb-bar" ng-if="breadCrumbs.length">',
        '<div class="container">',
        '<ul class="breadcrumb">',
        '<li ng-repeat="bc in breadCrumbs" ng-class="{active: !bc.url}">',
        '<a ng-if="bc.url" ng-href="{{ bc.url }}" ga-collect="HU-HeaderBreadcrumb" ng-bind="bc.label"></a>',
        '<span ng-if="!bc.url" ng-bind="bc.label"></span>',
        '</li>',
        '</ul>',
        '</div>',
        '</div>',
        '<!-- ',
        'Broadcast Message Feature',
        'Severity and message are controlled via the individual application environment collections',
        '-->',
        '<div class="container" ng-if="settings.showBroadcastMessage && settings.broadcastMessage.length">',
        '<br>',
        '<div class="alert alert--{{settings.broadcastSeverity}}">',
        '<div class="alert__icon">',
        '<span ng-switch="settings.broadcastSeverity">',
        '<span ng-switch-when="info" class="icon-info-circle"></span>',
        '<span ng-switch-when="success" class="icon-check"></span>',
        '<span ng-switch-when="warning" class="icon-exclamation-triangle"></span>',
        '<span ng-switch-when="danger" class="icon-error"></span>',
        '</span>',
        '</div>',
        '<div class="alert__message" ng-bind-html="settings.broadcastMessage"></div>',
        '</div>',
        '</div>',
        '</div>'
      ].join(''),
      link: function ($scope, $el, attrs) {
        _.each([
          'settings',
          'user',
          'branding'
        ], function (variable) {
          if (attrs[variable]) {
            $scope[variable] = $scope.$eval(attrs[variable]);
          }
        });
        $scope.title = attrs.pageTitle;
        $scope.breadCrumbs = $scope.$eval(attrs.breadcrumbs) || [];
        attrs.$observe('pageTitle', function (n) {
          $scope.title = n;
        });
      }
    };
  });
  app.directive('apolloFooter', function () {
    return {
      restrict: 'E',
      replace: true,
      scope: true,
      template: [
        '<footer class="apollo-footer" ng-if="settings.showFooter">',
        '<div class="container">',
        '<ul class="list--inline list--divider">',
        '<li><a class="link" href="http://www.cisco.com/cisco/web/siteassets/contacts/index.html" target="_blank" ga-collect="HU-FooterContacts" ng-bind="::\'_Contacts_\' | i18n"></a></li>',
        '<li><a class="link" href="https://secure.opinionlab.com/ccc01/o.asp?id=jBjOhqOJ" target="_blank" ga-collect="HU-FooterFeedback" ng-bind="::\'_Feedback_\' | i18n"></a></li>',
        '<li><a class="link" href="http://www.cisco.com/web/siteassets/sitemap/index.html" target="_blank" ga-collect="HU-FooterSitemap" ng-bind="::\'_SiteMap_\' | i18n"></a></li>',
        '<li><a class="link" href="http://www.cisco.com/web/siteassets/legal/terms_condition.html" target="_blank" ga-collect="HU-FooterTerms" ng-bind="::\'_TermsConditions_\' | i18n"></a></li>',
        '<li><a class="link" href="http://www.cisco.com/web/siteassets/legal/privacy.html" target="_blank" ga-collect="HU-FooterPrivacy" ng-bind="::\'_PrivacyStatement_\' | i18n"></a></li>',
        '<li><a class="link" href="http://www.cisco.com/web/siteassets/legal/privacy.html#cookies" target="_blank" ga-collect="HU-FooterCookies" ng-bind="::\'_CookiePolicy_\' | i18n"></a></li>',
        '<li><a class="link" href="http://www.cisco.com/web/siteassets/legal/trademark.html" target="_blank" ga-collect="HU-FooterTrademark" ng-bind="::\'_Trademarks_\' | i18n"></a></li>',
        '</ul>',
        '</div>',
        '</footer>'
      ].join('')
    };
  });
});