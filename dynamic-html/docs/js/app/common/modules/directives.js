/**
 * Apollo Directives Module
 * Contains common directives which are loaded at app startup
 */
define([
  'angular',
  'underscore'
], function (angular, _) {
  var app = angular.module('apollo.directives', [
      'apollo.utilities',
      'apollo.filters'
    ]);
  app.directive('apolloAlert', function () {
    return {
      restrict: 'E',
      template: [
        '<div ng-if="alert.visible" class="alert alert--{{ alert.severity }}">',
        '<div class="alert__icon">',
        '<span ng-switch="alert.severity">',
        '<span ng-switch-when="info" class="icon-info-circle"></span>',
        '<span ng-switch-when="success" class="icon-check"></span>',
        '<span ng-switch-when="warning" class="icon-exclamation-triangle"></span>',
        '<span ng-switch-when="danger" class="icon-exclamation-circle"></span>',
        '</span>',
        '</div>',
        '<div class="alert__message" ng-bind-html="alert.msg"></div>',
        '<div class="alert__close" ng-if="alert.closeButton" ng-click="alert.hide()">',
        '<span class="icon-close"></span>',
        '</div>',
        '</div>'
      ].join(''),
      scope: { alert: '=options' },
      link: function ($scope) {
        _.defaults($scope.alert, {
          closeButton: true,
          defaultSeverity: 'info',
          hide: function () {
            this.visible = false;
          },
          msg: '',
          show: function (msg, severity) {
            _.assign(this, {
              visible: true,
              msg: msg,
              severity: severity || this.defaultSeverity
            });
          },
          visible: false
        });
      }
    };
  });
  app.directive('apolloCollect', [
    '$apolloCollect',
    function ($apolloCollect) {
      return {
        restrict: 'A',
        link: function (scope, element, attrs) {
          var tagName = element[0].tagName.toLowerCase();
          if (tagName === 'a')
            tagName = 'link';
          var options = scope.$eval(attrs.apolloCollect) || attrs.apolloCollect;
          var eventObj = {
              eventCategory: tagName,
              hitType: 'event',
              eventAction: 'click'
            };
          if (!_.isObject(options)) {
            options = {
              area: eventObj,
              operation: options
            };
          } else if (!_.isEmpty(options.area)) {
            options.area = _.extend({}, eventObj, { eventLabel: options.area });
          }
          element.on('click', function () {
            $apolloCollect.send(options);
          });
          element.on('submit', function () {
            options.area.eventAction = 'submit';
            $apolloCollect.send(options);
          });
        }
      };
    }
  ]);
  app.directive('validators', [
    '$q',
    function ($q) {
      return {
        require: 'ngModel',
        link: function ($scope, el, attrs, ctrl) {
          _.each(attrs.validators.split('|'), function (validateFnName) {
            var validateFn = $scope.$eval(validateFnName);
            var validate = _.debounce(function (val) {
                $q.when(validateFn(val)).then(function (valid) {
                  ctrl.$setValidity(validateFnName, valid);
                });
              }, 250);
            ctrl.$parsers.unshift(function (val) {
              validate(val);
              return val;
            });
          });
        }
      };
    }
  ]);
  app.directive('ngCompile', [
    '$compile',
    function ($compile) {
      return function ($scope, el, attrs) {
        var template = $scope.$eval(attrs.ngCompile);
        if (_.isString(template)) {
          el.html($compile(template)($scope));
        }
      };
    }
  ]);
  app.directive('ngEnter', function () {
    return function ($scope, el, attrs) {
      el.bind('keydown keypress', function (e) {
        if (e.which === 13) {
          e.preventDefault();
          $scope.$apply(function () {
            $scope.$eval(attrs.ngEnter);
          });
        }
      });
    };
  });
  app.directive('ngTab', function () {
    return function ($scope, el, attrs) {
      el.bind('keydown keypress', function (e) {
        if (e.which === 9) {
          $scope.$apply(function () {
            $scope.$eval(attrs.ngTab);
          });
        }
      });
    };
  });
  app.directive('stopEvent', function () {
    return {
      restrict: 'A',
      link: function (scope, el, attrs) {
        el.on(attrs.stopEvent, function (e) {
          e.stopPropagation();
        });
      }
    };
  });
  app.directive('setNgAnimate', [
    '$animate',
    function ($animate) {
      return function ($scope, el, attrs) {
        $animate.enabled($scope.$eval(attrs.setNgAnimate), el);
      };
    }
  ]);
  app.directive('loadingDots', function () {
    return {
      restrict: 'E',
      replace: true,
      template: [
        '<div class="loading-dots">',
        '<span></span>',
        '<span></span>',
        '<span></span>',
        '</div>'
      ].join('')
    };
  });
  app.directive('smartLoader2', function () {
    return {
      restrict: 'E',
      transclude: true,
      template: [
        '<div class="smart-loader">',
        '<h3 style="text-align:center;" class="text-muted" ng-show="isLoading">',
        '<span ng-if="!loadingText" ng-bind="::((\'_Loading_\' | i18n) + \'...\')"></span>',
        '<span ng-if="loadingText" ng-bind="loadingText"></span>',
        '<loading-dots class="loading-dots--muted"></loading-dots>',
        '</h3>',
        '<h3 ng-if="text && !isLoading" style="text-align:center" class="text-muted" ng-bind-html="text"></h3>',
        '<div ng-if="html && !isLoading" ng-transclude></div>',
        '</div>'
      ].join(''),
      link: function ($scope, el, attrs) {
        $scope.text = attrs.text;
        $scope.loadingText = attrs.loadingText;
        $scope.html = $scope.$eval(attrs.html);
        $scope.$watch(attrs.loading, function (n) {
          $scope.isLoading = n;
        });
      }
    };
  });
  /**
    * scope { allowed } takes comma delimited mime-types as input (text/plain etc)
    * Keeping directive until a later date, but its only purpose is to shorten
    * the HTML a user of ng-file-upload has to do
    */
  app.directive('dropZone', [
    '$utilities',
    function ($utilities) {
      return {
        restrict: 'E',
        template: [
          '<div id="{{ id }}" name="{{ name }}" ngf-drop ngf-select ng-model="files" ngf-model-invalid="invalid" ngf-multiple="{{ allowMultiple || false }}" class="file-drop" ngf-accept="{{ allowedMime }}" ngf-pattern="{{ pattern }}" ngf-validate="{{ validate }}" required="{{ required || false }}">',
          '<div ng-show="!files">',
          '<span class="file-drop__icon icon-upload"></span>',
          '<h4 ng-bind="dropText" class="text-muted"></h4>',
          '</div>',
          '<div ng-show="files">',
          '<div ng-if="!files.length" class="file-drop__container">',
          '<div class="panel panel--ltgray panel--skinny" title="{{ files.name }}">',
          '<div class="panel__body">',
          '<div class="flex-center-vertical">',
          '<div ng-class="getIconForFile(files.name)" class="file-icon text-muted"></div>',
          '<div class="file-body">',
          '<h5 class="text-ellipsis" ng-bind="files.name"></h5>',
          '<small ng-bind="files.size | fileSize"></small>',
          '</div>',
          '</div>',
          '</div>',
          '</div>',
          '</div>',
          '<div ng-if="files.length">',
          '<div class="file-drop__container">',
          '<div class="panels-5col">',
          '<div class="panel panel--ltgray panel--skinny" ng-repeat="file in files" title="{{ file.name }}">',
          '<div class="panel__body">',
          '<span ng-class="getIconForFile(file.name)" class="file-icon text-muted"></span>',
          '<div class="text-ellipsis">',
          '<small ng-bind="file.name"></small>',
          '</div>',
          '<small ng-bind="file.size | fileSize"></small>',
          '</div>',
          '</div>',
          '</div>',
          '</div>',
          '<div class="file-drop__filecnt">{{ files.length }} Selected (Total: {{ totFileSize | fileSize }})</div>',
          '</div>',
          '</div>',
          '</div>'
        ].join(''),
        scope: {
          allowMultiple: '@',
          dropText: '@',
          files: '=selected',
          required: '@',
          allowedMime: '@',
          pattern: '@',
          invalid: '=',
          id: '@',
          name: '@',
          validate: '@'
        },
        link: function (scope, elem, attrs) {
          var fileTypes = $utilities.getFileTypes();
          if (attrs.allowMultiple) {
            scope.$watch('files', function (files) {
              if (files) {
                if (files.length > 0) {
                  scope.totFileSize = _.sumBy(files, 'size');  //_.reduce(files, function(sum, file) {
                                                               //    return sum + file.size;
                                                               //}, 0);
                } else {
                  scope.files = null;
                }
              }
            });
          }
          scope.getIconForFile = function (filename) {
            var icon = 'icon-file-o';
            if (filename) {
              var suffix = filename.substr(filename.lastIndexOf('.') + 1);
              _.each(fileTypes, function (value) {
                if (_.includes(value.extensions, suffix)) {
                  return icon = value.icon;
                }
              });
            }
            return icon;
          };
        }
      };
    }
  ]);
  /**
     * Takes a rating 1-5 and highlights the appropriate number of stars!
     */
  app.directive('starRatingReview', [function () {
      return {
        restrict: 'E',
        scope: { ratingValue: '=' },
        template: '<span class="icon-star" ng-class="{\'text-warning-alt\': ratingValue >= \'1\'}"></span>' + '<span class="icon-star" ng-class="{\'text-warning-alt\': ratingValue >= \'2\'}"></span>' + '<span class="icon-star" ng-class="{\'text-warning-alt\': ratingValue >= \'3\'}"></span>' + '<span class="icon-star" ng-class="{\'text-warning-alt\': ratingValue >= \'4\'}"></span>' + '<span class="icon-star" ng-class="{\'text-warning-alt\': ratingValue >= \'5\'}"></span>'
      };
    }]);
  app.directive('apolloHero', function () {
    return {
      restrict: 'E',
      scope: { src: '@' },
      transclude: true,
      template: [
        '<div class="apollo-hero">',
        '<div class="container">',
        '<div class="apollo-hero__content">',
        '<div ng-transclude></div>',
        '</div>',
        '</div>',
        '</div>'
      ].join(''),
      link: function ($scope, el) {
        el[0].style.backgroundImage = 'url(\'' + $scope.src + '\')';
      }
    };
  });
  /**
     * Angular Directive: Apollo Progress Bar
     *
     * Directive to show incremental progress
     *
     * Example mark-up:
     * ----------------
     *     <ap-progressbar percentage="percentage" title="msg"></ap-progressbar>
     *
     */
  app.directive('apProgressbar', function () {
    return {
      restrict: 'E',
      scope: {
        msg: '=title',
        percentage: '='
      },
      template: '<div class="progressbar">' + '<div class="progressbar__header-msg" ng-bind="msg"></div>' + '<div class="progressbar__bar">' + '<div class="progressbar__bar-solid"></div>' + '<div class="progressbar__bar-mask"></div>' + '</div>' + '<div class="progressbar__percent-complete-msg" ng-bind="(percentage | number: 2) + \'% Complete\'"><div>' + '</div>',
      link: function (scope, elem) {
        // the mask is a white background rectangle that moves over top of the colored progress bar
        var mask = elem.find('.progressbar__bar-mask');
        mask.css({
          'border-top-left-radius': '0px',
          'border-bottom-left-radius': '0px',
          'left': scope.percentage + '%'
        });
        // move the mask when percentage changes
        scope.$watch('percentage', function (percentage) {
          if (!percentage) {
            scope.percentage = 0;
          }
          if (percentage > 100) {
            scope.percentage = 100;
          }
          mask.css({ 'left': scope.percentage + '%' });
        });
      }
    };
  });
  /**
     * Angular Directive: Apollo Select
     *
     * Directive for Atlantic standard select input
     *
     * Attributes:
     * -----------
     *     -- Required:
     *     ------------
     *         [ model ] (=) : Model to set selection as. (Same behavior as ng-model)
     *         [ options ] (=) : Array of options. (Can be array of objects xor strings)
     *
     *     -- Optional:
     *     ------------
     *         [ name ] (@) : Name of select input
     *         [ label ] (=) : Label for input.
     *         [ placeholder ] : Text for select prior to interaction.
     *         [ change ] (&) : Function to execute when selected value changes. (Same behavior as ng-change)
     *         [ options-prop ] (@) : If using options array of objects, specifies the property to list options by.
     *         [ options-value ] (@) : If using options array of object, specifies value to store in model when option is selected.
     *         [ multiple ] (@) : Turns multiple select on.
     *         [ order-by ] (@) : Property to sort options by.
     *         [ group-by ] (@) : Support for optgroups. Options are grouped by a shared object property.
     *
     * Example mark-up:
     * ----------------
     *     -- Single Select:
     *     <ap-select label="'Select a group'" model="dataModel" change="changeFunction()" options="array" options-prop="name" order-by="name"></ap-select>
     *     -- Multiple Select:
     *     <ap-select label="'Select a group'" model="dataModel" options="array" options-prop="title" multiple></ap-select>
     */
  app.directive('apSelect', [
    '$document',
    '$timeout',
    '$utilities',
    '$filter',
    '$compile',
    function ($document, $timeout, $utilities, $filter, $compile) {
      return {
        restrict: 'E',
        scope: {
          label: '=?',
          name: '@?',
          placeholder: '@?',
          model: '=',
          change: '&?',
          options: '=',
          optionsProp: '@?',
          optionsValue: '@?',
          multiple: '@?',
          orderBy: '@?',
          groupBy: '@?',
          disabled: '@?'
        },
        template: '<div class="form-group">' + '<div class="form-group__text ap-select" ng-if="!isMobile">' + '<input class="ap-select-search text-ellipsis" name="{{ name || \'ap-select\' }}" type="text" ng-model="modelObj.modelString" title="{{ modelObj.modelString }}" ng-mousedown="toggleDropdown($event)" ng-blur="hideDropdown($event)" ng-required="isRequired" autocomplete="off"></input>' + '<label ng-bind="label"></label>' + '</div>' + '<div class="ap-select-dropdown" ng-if="dropdownVisible && !groupBySupplied && (optionsMap | filter: modelObj.modelString).length" ng-mouseover="enterDropdown()" ng-mouseleave="leaveDropdown()">' + '<div class="ap-select-dropdown-option" ng-repeat="i in optionsMap | filter: modelObj.modelString | orderBy:orderBy" ng-mousedown="setModel(i, $event)" ng-class="{ \'selected\': i.selected }">' + '<span ng-show="isMultipleSelect"></span>' + '<span ng-bind="i[optionsProp]"></span>' + '</div>' + '</div>' + '<div class="ap-select-dropdown" ng-if="dropdownVisible && groupBySupplied && (optionsMap | filter: modelObj.modelString).length" ng-mouseover="enterDropdown()" ng-mouseleave="leaveDropdown()">' + '<div class="ap-select-group" ng-repeat="(key, group) in groups">' + '<span class="ap-select-group-header" ng-bind="key"></span>' + '<div class="ap-select-dropdown-option" ng-repeat="i in group | filter:modelObj.modelString | orderBy:orderBy" ng-mousedown="setModel(i, $event)" ng-class="{ \'selected\': i.selected }">' + '<span ng-show="isMultipleSelect"></span>' + '<span ng-bind="i[optionsProp]"></span>' + '</div>' + '</div>' + '</div>' + '<div class="form-group__text select" ng-if="isMobile && isMultipleSelect">' + '<select class="mobile-select" name="{{ name || \'ap-select\' }}" ng-if="!groupBySupplied" ng-change="changeFn(i)" ng-model="modelObj.model" ng-options="(i[optionsValue] || i.mappedObject) as i[optionsProp] for i in optionsMap | orderBy:orderBy" ng-required="isRequired" ng-disabled="disabled" multiple></select>' + '<select class="mobile-select" name="{{ name || \'ap-select\' }}" ng-if="groupBySupplied" ng-change="changeFn(i)" ng-model="modelObj.model" ng-options="(i[optionsValue] || i.mappedObject) as i[optionsProp] group by i[groupBy] for i in optionsMap | orderBy:orderBy" ng-required="isRequired" ng-disabled="disabled" multiple></select>' + '<label ng-bind="label"></label>' + '</div>' + '<div class="form-group__text select" ng-if="isMobile && !isMultipleSelect">' + '<select ng-change="changeFn(i)" name="{{ name || \'ap-select\' }}" ng-if="!groupBySupplied" ng-model="modelObj.model" ng-options="(i[optionsValue] || i.mappedObject) as i[optionsProp] for i in optionsMap | orderBy:orderBy" ng-required="isRequired" ng-disabled="disabled"></select>' + '<select ng-change="changeFn(i)" name="{{ name || \'ap-select\' }}" ng-if="groupBySupplied" ng-model="modelObj.model" ng-options="(i[optionsValue] || i.mappedObject) as i[optionsProp] group by i[groupBy] for i in optionsMap | orderBy:orderBy" ng-required="isRequired" ng-disabled="disabled"></select>' + '<label ng-bind="label"></label>' + '</div>' + '</div>',
        link: function (scope, $elem, attrs) {
          /* ------------------------------------------------------------------------------- /
                /* Variables
                /* _______________________________________________________________________________*/
          // element references
          var $selectElem, $searchElem, $mobileSelectElem;
          $timeout(function () {
            $selectElem = $elem.find('.ap-select');
            $searchElem = $elem.find('.ap-select-search');
            $mobileSelectElem = $elem.find('.mobile-select');
            // setup required Attributes
            scope.isRequired && setupRequired();
          });
          // local variables
          var clickedOff = true, optionsPropDefined = 'optionsProp' in attrs, $i18n = $filter('i18n'), savedModel = {}, savedModelString = '', modelChangedInDirective = false;
          // scope variables
          scope.isMultipleSelect = 'multiple' in attrs;
          scope.groupBySupplied = 'groupBy' in attrs;
          scope.isRequired = 'required' in attrs;
          scope.dropdownVisible = false;
          scope.prepend = attrs.prepend ? scope.$eval(attrs.prepend) : false;
          scope.modelObj = {
            modelString: scope.model[scope.optionsProp],
            model: scope.model
          };
          scope.isMobile = $utilities.isMobile();
          /* ------------------------------------------------------------------------------- /
                /* Initialization
                /* _______________________________________________________________________________*/
          // fix for iOS multi select bug -- adds placeholder for mobile
          $timeout(function () {
            if (scope.isMobile) {
              var firstOption = '<option value="" disabled="disabled"';
              firstOption += ($mobileSelectElem.val() || []).length > 0 ? '' : ' selected="selected"';
              firstOption += '>\xab ' + (scope.placeholder || $i18n('_ApSelectMobileLabel_')) + ' \xbb';
              firstOption += '</option>';
              $mobileSelectElem.prepend(firstOption);
            }
          });
          // setup multi select scope
          if (scope.isMultipleSelect) {
            // need to set model to array if it isn't already for multi select
            if (!Array.isArray(scope.model)) {
              modelChangedInDirective = true;
              scope.model = [];
            }
            setMultiModelString();
          }
          // setup placeholder if supplied
          if (scope.placeholder) {
            $searchElem.addClass('placeholder');
            scope.modelObj.modelString = scope.placeholder;
          }
          scope.$watch('options', function () {
            refreshSelect();
          });
          scope.$watch('model', function (m) {
            if (!modelChangedInDirective) {
              if (scope.optionsValue) {
                var mod = _.find(scope.options, [
                    scope.optionsValue,
                    m
                  ]);
                scope.modelObj.modelString = mod && mod[scope.optionsProp] || '';
              } else {
                scope.modelObj.modelString = m[scope.optionsProp];
              }
              // for mobile, sets modelObj model when outside model changes
              scope.modelObj.model = scope.model;
            }
            modelChangedInDirective = false;
          });
          /* ------------------------------------------------------------------------------- /
                /* Scope functions
                /* _______________________________________________________________________________*/
          // Execute function supplied by change attribute.
          scope.changeFn = function (value) {
            if (scope.isMobile) {
              scope.model = scope.modelObj.model;
            }
            if (scope.change) {
              $timeout(function () {
                scope.$apply();
                scope.change({ option: value || {} });
              });
            }
          };
          scope.toggleDropdown = function (e) {
            e.preventDefault();
            clickedOff = false;
            if (scope.dropdownVisible) {
              $selectElem.removeClass('focused');
              $searchElem.blur();
              if (scope.isMultipleSelect) {
                setMultiModelString();
              } else {
                revertModel();
              }
            } else {
              $selectElem.addClass('focused');
              $searchElem.focus();
              if (!scope.isMultipleSelect) {
                savedModel = scope.model;
                savedModelString = scope.modelObj.modelString;
                modelChangedInDirective = true;
                scope.model = {};
              }
              scope.modelObj.modelString = '';
              $searchElem.removeClass('placeholder');
            }
            scope.dropdownVisible = !scope.dropdownVisible;
          };
          // setModel is called with ng-mousedown, because this needs to execute before the input blurs
          scope.setModel = function (option, e) {
            e.preventDefault();
            clickedOff = false;
            var newModel = scope.optionsValue ? option.mappedObject[scope.optionsValue] : option.mappedObject;
            if (!scope.isMultipleSelect) {
              modelChangedInDirective = true;
              scope.model = newModel;
              scope.modelObj.modelString = scope.groupBy && scope.prepend ? option[scope.groupBy] + ' / ' + option[scope.optionsProp] : option[scope.optionsProp];
              scope.hideDropdown();
            } else {
              // if selected already, deselect
              if (option.selected) {
                _.pull(scope.model, newModel);
                option.selected = false;
              } else {
                // add option to model
                scope.model.push(newModel);
                option.selected = true;
              }
            }
            // execute function supplied by change attribute when model changes
            scope.changeFn(option);
          };
          scope.hideDropdown = function (e) {
            e && e.preventDefault();
            // avoid hiding dropdown when scrollbar is clicked
            if (scope.mouseInDropdown && e) {
              // reset focus
              $timeout(function () {
                // $timeout for firefox focus
                $searchElem.focus();
              });
              return;
            }
            if (scope.dropdownVisible) {
              scope.dropdownVisible = false;
              $selectElem.removeClass('focused');
              scope.mouseInDropdown = false;
              $searchElem.blur();
              if (scope.isMultipleSelect) {
                setMultiModelString();
              } else {
                if (e) {
                  revertModel();
                }
              }
            }
          };
          scope.enterDropdown = function () {
            scope.mouseInDropdown = true;
          };
          scope.leaveDropdown = function () {
            scope.mouseInDropdown = false;
          };
          /* ------------------------------------------------------------------------------- /
                /* Local functions
                /* _______________________________________________________________________________*/
          function setMultiModelString() {
            // sets model string appearing in input to "[#] selected"
            scope.modelObj.modelString = (scope.model.length || 0) + ' selected';
          }
          function revertModel() {
            modelChangedInDirective = true;
            scope.model = savedModel;
            scope.modelObj.modelString = savedModelString;
          }
          function setupGroupBy() {
            scope.groups = _.groupBy(scope.optionsMap, scope.groupBy);
          }
          function setupRequired() {
            if (!scope.isMobile) {
              if (scope.isMultipleSelect) {
                $searchElem.attr('pattern', '^((?!0sselected).)*$');
              } else {
                if (scope.placeholder) {
                  $searchElem.attr('pattern', '^((?!' + scope.placeholder + ').)*$');
                }
              }
              $compile($searchElem);
            }
          }
          // initialize scope.optionsMap and set scope.optionsProp each time scope.options is altered
          function refreshSelect() {
            if (scope.isMultipleSelect) {
              modelChangedInDirective = true;
              scope.model = [];
            }
            if (scope.optionsValue) {
              var m = _.find(scope.options, [
                  scope.optionsValue,
                  scope.model
                ]);
              scope.modelObj.modelString = m && m[scope.optionsProp] || '';
            }
            // need to map options so that initial options data is unaltered
            // ( have to attach "selected" property to each option object )
            scope.optionsMap = _.map(scope.options, function (option) {
              var copy;
              if (typeof option !== 'object' && !optionsPropDefined) {
                scope.optionsProp = 'name';
                copy = { name: option };
              } else {
                copy = _.cloneDeep(option);
              }
              // options objects can have selected property set to true for multiple select
              if (scope.isMultipleSelect && copy.selected) {
                var newModel = scope.optionsValue ? option[scope.optionsValue] : option;
                scope.model.push(newModel);
              }
              copy.selected = copy.selected || false;
              copy.mappedObject = option;
              return copy;
            });
            // scope.optionsProp must be defined.
            // If it's not set it to first key of first option object.
            // ( This assumes all options objects have the same keys. If not, some options won't show up. )
            if (!scope.optionsProp) {
              if (scope.optionsMap[0]) {
                scope.optionsProp = Object.keys(scope.optionsMap[0])[0];
              }
            }
            if (scope.isMultipleSelect) {
              setMultiModelString();
            }
            // setup optgroups if groupBy is supplied
            if (scope.groupBy) {
              setupGroupBy();
            }
          }
        }
      };
    }
  ]);
});