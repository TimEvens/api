define([
  'appModule',
  'underscore'
], function (app, _) {
  app.directive('ngCompileTitle', function ($compile) {
    return function ($scope, el, attrs) {
      $scope.$watch(attrs.ngCompileTitle, function (n) {
        el.html($compile('<span>' + n + '</span>')($scope));
      });
    };
  });
  app.directive('smartWizard', function ($compile, $filter) {
    return {
      restrict: 'E',
      transclude: true,
      scope: true,
      template: [
        '<div class="smartWizard" set-ng-animate="false">',
        '<form name="wizardForm" novalidate>',
        '<ul class="ui-steps">',
        '<li class="ui-step" ng-repeat="slide in slides" ng-class="{ \'active\': slide.active, \'visited\': slide.visited }">',
        '<a ng-if="$index !== activeIndex && slide.visited && ($index < activeIndex || wizardForm.$valid)" ng-click="activateSlide($index)">',
        '<div class="step__icon">',
        '<span ng-show="!slide.visited">{{ $index + 1 }}</span>',
        '<span ng-show="slide.visited" class="icon-check"></span>',
        '</div>',
        '<div class="step__label" ng-compile-title="slide.title"></div>',
        '</a>',
        '<a ng-if="$index === activeIndex || !slide.visited || ($index > activeIndex && wizardForm.$invalid)">',
        '<div class="step__icon">{{ $index + 1 }}</div>',
        '<div class="step__label" ng-compile-title="slide.title"></div>',
        '</a>',
        '</li>',
        '</ul>',
        '<div class="panel panel--xspace carousel-target" ng-transclude></div>',
        '<div class="text-right" ng-show="showControls">',
        '<button ng-show="!isFirstSlide" ng-click="moveSlide(\'prev\')" class="button" type="button">',
        '{{ \'_Previous_\' | i18n }}',
        '</button>&nbsp;',
        '<button ng-show="hasCancel && !isLastSlide" ng-click="onCancel()" || class="button" type="button">',
        '{{ cancelButtonText }}',
        '</button>&nbsp;',
        '<button ng-show="!isLastSlide" ng-click="moveSlide(\'next\')" ng-disabled="disabledButtons.next || wizardForm.$invalid" class="button button--primary" type="button">',
        '{{ \'_Next_\' | i18n }}',
        '</button>',
        '<button ng-show="isLastSlide" ng-disabled="isSubmitted || wizardForm.$invalid" ng-click="isSubmitted=true;onSubmit()" class="button button--primary" type="button">{{ submitButtonText }}</button>',
        '</div>',
        '</form>',
        '</div>'
      ].join(''),
      link: function ($scope, el, attrs) {
        $scope.forms = [];
        $scope.options = $scope.$eval(attrs.options);
        $scope.showControls = true;
        $scope.onSubmit = $scope.options.onSubmit || function () {
        };
        $scope.onCancel = $scope.options.onCancel || function () {
        };
        $scope.hasCancel = !_.isEmpty($scope.options.hasCancel) ? $scope.options.hasCancel : true;
        $scope.submitButtonText = $scope.options.submitButtonText || $filter('i18n')('_Submit_');
        $scope.cancelButtonText = $scope.options.cancelButtonText || $filter('i18n')('_Cancel_');
        $scope.isSubmitted = false;
        var unwatch;
        $scope.slides = [];
        var hideCtrlsIndexes = {};
        el.find('wizard-step').each(function (index) {
          var $this = $(this);
          $scope.slides.push({ title: $this.attr('title') });
          if (_.isString($this.attr('hide-controls'))) {
            hideCtrlsIndexes[index] = $this.attr('hide-controls');
          }
        }).replaceWith(function (i) {
          return '<div ng-show="activeIndex == ' + i + '">' + $(this).html() + '</div>';
        });
        el.find('.carousel-target').html($compile('<div>' + el.find('.carousel-target').html() + '</div>')($scope));
        $scope.activeSlideTitle = $scope.slides[0].title;
        $scope.slides[0].active = true;
        $scope.slides[0].visited = true;
        $scope.next = null;
        $scope.prev = null;
        $scope.activeIndex = 0;
        $scope.isFirstSlide = true;
        $scope.isLastSlide = $scope.slides.length === 1;
        $scope.disabledButtons = {
          next: false,
          prev: true
        };
        function postSlideChange(direction) {
          checkControlVisibility($scope.activeIndex);
          if (direction === 'next') {
            $scope.slides[$scope.activeIndex].visited = true;
            if ($scope.slides.length === $scope.activeIndex + 1) {
              $scope.disabledButtons.next = true;
            }
          } else if (!$scope.activeIndex) {
            $scope.disabledButtons.prev = true;
          }
          $scope.$emit('slideChange', $scope.activeIndex);
          $scope.disabledButtons[direction === 'next' ? 'prev' : 'next'] = false;
        }
        $scope.updateMobileTitle = function (index) {
          $scope.activeSlideTitle = $scope.slides[index].title;
        };
        function checkControlVisibility(index) {
          if (_.isFunction(unwatch)) {
            unwatch();
          }
          if (_.has(hideCtrlsIndexes, index)) {
            if (hideCtrlsIndexes[index]) {
              unwatch = $scope.$watch(hideCtrlsIndexes[index], function (n) {
                $scope.showControls = !n;
              });
            } else {
              $scope.showControls = false;
            }
          } else {
            $scope.showControls = true;
          }
        }
        $scope.getActiveIndex = function () {
          return $scope.activeIndex;
        };
        $scope.activateSlide = function (index) {
          var oldIndex = $scope.activeIndex;
          var direction = oldIndex > index ? 'prev' : 'next';
          $scope.updateMobileTitle(index);
          $scope.slides[oldIndex].active = false;
          $scope.slides[index].active = true;
          $scope.activeIndex = index;
          $scope.isFirstSlide = $scope.activeIndex === 0;
          $scope.isLastSlide = index === $scope.slides.length - 1;
          postSlideChange(direction);
        };
        $scope.moveSlide = function (direction) {
          $scope.slides[$scope.activeIndex].active = false;
          $scope.activeIndex += direction === 'next' ? 1 : -1;
          $scope.slides[$scope.activeIndex].active = true;
          $scope.updateMobileTitle($scope.activeIndex);
          $scope.isFirstSlide = $scope.activeIndex === 0;
          $scope.isLastSlide = $scope.activeIndex === $scope.slides.length - 1;
          postSlideChange(direction);
        };
        checkControlVisibility(0);
      }
    };
  });
});