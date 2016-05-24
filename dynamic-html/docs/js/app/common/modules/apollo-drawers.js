/**
 * Angular Directive: apolloDrawers
 *
 * Directive for drawers with expandable content
 *
 * Example mark-up:
 * ----------------
 *     <ap-drawers>
 *         <ap-drawer-header>
 *             <ap-drawer-label>
 *                 <!-- HTML for header label goes here -->
 *             </ap-drawer-label>
 *         </ap-drawer-header>
 *         <ap-drawer>
 *             <ap-drawer-label>
 *                 <!-- HTML for label goes here -->
 *             </ap-drawer-label>
 *             <ap-drawer-content>
 *                 <!-- HTML for expandable content goes here -->
 *             </ap-drawer-content>
 *         </ap-drawer>
 *   </ap-drawers>
 */
define(['angular'], function (angular) {
  var app = angular.module('ap.drawers', []);
  /* apollo-drawers
     *
     * Container for apollo-drawer directive(s)
     */
  app.directive('apDrawers', function () {
    return {
      restrict: 'E',
      transclude: true,
      replace: true,
      template: '<div class="panel-group panel-group--skinny" ng-transclude></div>',
      link: function (scope, elem, attrs) {
        // allow-mult-expanded="true" will allow mutiple drawers to be open at the same time
        // allow-mult-expanded="false" is the default
        scope.allowMultExpanded = scope.$eval(attrs.allowMultExpanded);
        // watch the top-level element for when its number of children changes
        scope.$watch(function () {
          return elem[0].children.length;
        }, function () {
          // store all drawers in scope
          scope.drawers = elem.find('.panel');
          scope.header = elem.find('.panel-group__header');
          // initially hide drawer content
          scope.drawers.find('.ap-drawer-content').addClass('ng-hide');
        });
        scope.toggleExpanded = function ($event, allowExpand) {
          $event.stopPropagation();
          if (!allowExpand) {
            return;
          }
          // get the clicked drawer
          var clickedElem = angular.element($event.currentTarget);
          // if multipleExpanded === false, only one drawer can be open at a time
          var isAlreadyExpanded = !clickedElem.next().hasClass('ng-hide');
          if (!scope.allowMultExpanded) {
            // add ng-hide class to all drawers
            scope.drawers.find('.ap-drawer-content').addClass('ng-hide');
            // make sure all chevrons point down
            showDownArrow(scope.drawers.find('.up-or-down-arrow'));
            if (isAlreadyExpanded) {
              // if the clicked element was already expanded, remove ng-hide class
              clickedElem.next().removeClass('ng-hide');
            }
          }
          // if clicked drawer isn't already expanded, show it
          if (!isAlreadyExpanded) {
            clickedElem.next().removeClass('ng-hide');
            // make sure chevron is up
            showUpArrow(clickedElem.find('.up-or-down-arrow'));
          } else {
            // if clicked drawer is already expanded, hide it
            clickedElem.next().addClass('ng-hide');
            // make sure chevron is down
            showDownArrow(clickedElem.find('.up-or-down-arrow'));
          }
          var up = scope.drawers.find('.icon-chevron-up');
          var down = scope.drawers.find('.icon-chevron-down');
          if (up.length === scope.drawers.length) {
            showUpArrow(scope.header.find('.up-or-down-arrow'));
          } else if (down.length === scope.drawers.length) {
            showDownArrow(scope.header.find('.up-or-down-arrow'));
          }
        };
        scope.toggleAllExpanded = function ($event, allowExpand) {
          $event.stopPropagation();
          if (!allowExpand) {
            return;
          }
          // get the clicked drawer
          var clickedElem = angular.element($event.currentTarget);
          // if multipleExpanded === false, only one drawer can be open at a time
          var isAlreadyExpanded = !clickedElem.find('.up-or-down-arrow').hasClass('icon-chevron-down');
          if (scope.allowMultExpanded) {
            if (!isAlreadyExpanded) {
              showUpArrow(clickedElem.find('.up-or-down-arrow'));
              showUpArrow(scope.drawers.find('.up-or-down-arrow'));
              scope.drawers.find('.ap-drawer-content').removeClass('ng-hide');
            } else {
              showDownArrow(clickedElem.find('.up-or-down-arrow'));
              showDownArrow(scope.drawers.find('.up-or-down-arrow'));
              scope.drawers.find('.ap-drawer-content').addClass('ng-hide');
            }
          }
        };
        function showDownArrow(elem) {
          elem.removeClass('icon-chevron-up');
          elem.addClass('icon-chevron-down');
        }
        function showUpArrow(elem) {
          elem.removeClass('icon-chevron-down');
          elem.addClass('icon-chevron-up');
        }
      }
    };
  });
  /* apollo-drawer-header
     *
     * primary purpose is to process one transclusion slot
     *
     * Expects 1 elements:
     *     - <apollo-drawer-header> (always visible)
     */
  app.directive('apDrawerHeader', function () {
    return {
      restrict: 'E',
      transclude: true,
      replace: true,
      template: '<div class="panel-group__header">' + '<div class="panel__header flex-center-vertical toggle" ng-click="toggleAllExpanded($event, allowExpand);">' + '<div class="flex-fluid text-ellipsis ap-drawer-header-transclude"></div>' + '<div ng-if="allowExpand" class="up-or-down-arrow icon-chevron-down"></div>' + '</div>' + '</div>',
      link: function (scope, elem, attrs, ctrl, transclude) {
        attrs = attrs;
        ctrl = ctrl;
        // suppress lint warnings
        var transcludeObj = {};
        scope.allowExpand = attrs.allowExpand ? scope.$eval(attrs.allowExpand) : true;
        transclude(scope, function (clone) {
          // find the label and content tags
          for (var i = 0; i < clone.length; i++) {
            if (clone[i].tagName) {
              var tag = clone[i].tagName.toLowerCase();
              if (tag === 'ap-drawer-label') {
                transcludeObj.label = angular.element(clone[i]);
              }
            }
          }
          // append label and content into the template
          elem.find('.ap-drawer-header-transclude').append(transcludeObj.label);
        });
      }
    };
  });
  /* apollo-drawer
     *
     * primary purpose is to process two transclusion slots
     *
     * Expects 2 elements:
     *     - <ap-drawer-label> (always visible)
     *     - <ap-drawer-content> (visibility toggled when label is clicked)
     */
  app.directive('apDrawer', function () {
    return {
      restrict: 'E',
      transclude: true,
      replace: true,
      template: '<div class="panel panel--highlight">' + '<div class="panel__header flex-center-vertical toggle" ng-click="toggleExpanded($event, allowExpand);">' + '<div class="flex-fluid text-ellipsis ap-drawer-label-transclude"></div>' + '<div ng-if="allowExpand" class="up-or-down-arrow icon-chevron-down"></div>' + '</div>' + '<div class="ap-drawer-content">' + '<div class="panel__body ap-drawer-content-transclude"></div>' + '</div>' + '</div>',
      link: function (scope, elem, attrs, ctrl, transclude) {
        attrs = attrs;
        ctrl = ctrl;
        // suppress lint warnings
        var transcludeObj = {};
        scope.allowExpand = attrs.allowExpand ? scope.$eval(attrs.allowExpand) : true;
        transclude(scope, function (clone) {
          // find the label and content tags
          for (var i = 0; i < clone.length; i++) {
            if (clone[i].tagName) {
              var tag = clone[i].tagName.toLowerCase();
              if (tag === 'ap-drawer-label') {
                transcludeObj.label = angular.element(clone[i]);
              } else if (tag === 'ap-drawer-content') {
                transcludeObj.content = angular.element(clone[i]);
              }
            }
          }
          // append label and content into the template
          elem.find('.ap-drawer-label-transclude').append(transcludeObj.label);
          elem.find('.ap-drawer-content-transclude').append(transcludeObj.content);
        });
      }
    };
  });
});