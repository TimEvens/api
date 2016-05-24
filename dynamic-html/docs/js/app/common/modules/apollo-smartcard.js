define([
  'angular',
  'underscore'
], function (angular, _) {
  var app = angular.module('ap-smartcard', [
      'ui.bootstrap',
      'apollo.utilities'
    ]);
  var DEFAULT_SEARCH_TIMEOUT = 500;
  var DETAILS_MODAL = {};
  function makeGroups(data, groupBy, unknownGroupName) {
    var groups = _.groupBy(data, groupBy), unknownGroupName = unknownGroupName || 'Unknown';
    _.each(groups, function (group, groupName) {
      if (groupName === 'null' || groupName === '') {
        if (groups[unknownGroupName]) {
          groups[unknownGroupName] = groups[unknownGroupName].concat(group);
        } else {
          groups[unknownGroupName] = group;
        }
        delete groups[groupName];
      }
    });
    return _.map(groups, function (cards, name) {
      return new Group(cards, name);
    });
  }
  function Group(cards, name) {
    this.cards = cards;
    this.name = name;
  }
  function capitalizeWords(str) {
    return str.replace(/\w\S*/g, function (text) {
      return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    });
  }
  function getGroupByLabel(groupBy, sortColumns) {
    var col = _.find(sortColumns, { value: groupBy });
    if (col) {
      return col.name;
    } else {
      return capitalizeWords(groupBy);
    }
  }
  function quickViewOpts(item, scope) {
    return {
      template: [
        '<div ng-include="options.detailsTemplateUrl" class="details-panel"></div>',
        '<div class="modal-pagination">',
        '<span class="icon-chevron-left" ng-click="updateItem(-1)" ng-show="showPrev"></span>',
        '<span class="icon-chevron-right" ng-click="updateItem(1)" ng-show="showNext"></span>',
        '</div>'
      ].join(''),
      windowClass: 'smart-card-desktop-detail-modal',
      scope: scope,
      controller: function ($scope) {
        $scope.item = item;
        scope.options.refreshPanelData = function (pager) {
          pager.refresh(item.id).then(function (res) {
            $scope.item = res.data.content[0];
          });
        };
        $scope.updateItem = function (direction) {
          var newIndex, newItem;
          $scope.showPrev = true;
          $scope.showNext = true;
          newIndex = $scope.data.indexOf($scope.item) + direction;
          newItem = $scope.data[newIndex];
          if (newItem) {
            $scope.item = newItem;
            $scope.isPanelOpen = true;
            $scope.$emit('cardOpened', newItem);
          }
          if (newIndex === 0) {
            $scope.showPrev = false;
          } else if (newIndex === $scope.data.length - 1) {
            $scope.showNext = false;
          }
        };
        $scope.updateItem(0);
      }
    };
  }
  app.directive('smartInfiniteScroller', function () {
    return {
      restrict: 'E',
      template: '<p class="text-muted" ng-if="smartPager.data.length" ng-bind-template="{{ label }} 1-{{ smartPager.data.length }} of {{ smartPager.totalElements }}"></p>',
      scope: {
        label: '=',
        smartPager: '='
      },
      link: function ($scope, $el) {
        var contentMain = $el.closest('.apollo-content__main')[0];
        $el.closest('.apollo-content').on('scroll', _.debounce(function () {
          if (this.scrollTop + this.offsetHeight > contentMain.offsetHeight - 50) {
            $scope.smartPager.loadMore();
          }
        }, 500));
      }
    };
  });
  app.directive('smartPager', function () {
    return {
      restrict: 'E',
      template: [
        '<div class="smart-pager" ng-if="smartPager.data.length">',
        '<span ng-bind-template="{{ label }} {{ smartPager.getFirstItemIndex() }}-{{ smartPager.getLastItemIndex() }} of {{ smartPager.totalElements }}"></span>&nbsp;',
        '<a class="link" ng-disabled="smartPager.isFirstPage()" ng-click="smartPager.loadFirstPage(); scrollUp()">',
        '<span class="icon-step-backward"></span>',
        '</a>',
        '<a class="link" ng-disabled="smartPager.isFirstPage()" ng-click="smartPager.loadPreviousPage(); scrollUp()">',
        '<span class="icon-step-prev"></span>',
        '</a>',
        '<a class="link" ng-disabled="smartPager.isLastPage()" ng-click="smartPager.loadNextPage(); scrollUp()">',
        '<span class="icon-step-next"></span>',
        '</a>',
        '<a class="link" ng-disabled="smartPager.isLastPage()" ng-click="smartPager.loadLastPage(); scrollUp()">',
        '<span class="icon-step-forward"></span>',
        '</a>',
        '</div>'
      ].join(''),
      scope: {
        label: '=',
        smartPager: '='
      },
      link: function ($scope) {
        $scope.scrollUp = function () {
          $('.apollo-content').scrollTop(0);
        };
      }
    };
  });
  app.directive('smartTable', [
    '$modal',
    function ($modal) {
      return {
        restrict: 'E',
        replace: true,
        template: [
          '<div class="responsive-table">',
          '<table class="table table--highlight" ng-show="data.length">',
          '<thead>',
          '<tr>',
          '<th ng-if="options.selectionEnabled">',
          '<label ng-if="smartPager" class="checkbox" title="{{ isAllSelected ? \'_SelectNone_\' : \'_SelectAll_\' | i18n }}">',
          '<input type="checkbox" ng-click="toggleAllSelected()" ng-checked="isAllSelected">',
          '<span class="checkbox__input"></span>',
          '</label>',
          '</th>',
          '<th ng-repeat="col in options.columns" ng-click="toggleSort(col)"',
          ' ng-class="{sortable: col.sortField, sorted: col.sortField == sort.value}" ng-style="{ width: col.width || \'none\' }">',
          '{{ col.displayName }}',
          '<span ng-if="col.sortField == sort.value"',
          ' class="sort-indicator icon-chevron-{{ sort.direction == \'asc\' ? \'down\' : \'up\' }}"></span>',
          '</th>',
          '</tr>',
          '</thead>',
          '<tbody ng-if="options.groupBy">',
          '<tr ng-if="options.groupBy" ng-repeat-start="group in groups">',
          '<td colspan="{{options.columns.length + 2}}">',
          '<span ng-if="!options.groupNameTemplate" ng-bind="group.name"></span>',
          '<span ng-if="options.groupNameTemplate" ng-compile="options.groupNameTemplate"></span>',
          '</td>',
          '</tr>',
          '<tr ng-if="options.groupBy" ng-repeat="item in group.cards" ng-repeat-end>',
          '<td ng-if="options.selectionEnabled">',
          '<label class="checkbox" ng-click="toggleSelected(item, $event);">',
          '<input type="checkbox" ng-checked="item.selected">',
          '<span class="checkbox__input"></span>',
          '</label>',
          '</td>',
          '<td ng-repeat="col in options.columns">',
          '<span ng-if="col.template" ng-compile="col.template"></span>',
          '<span ng-if="col.bind" ng-bind="$eval(col.bind)"></span>',
          '</td>',
          '</tr>',
          '</tbody>',
          '<tbody ng-if="!options.groupBy">',
          '<tr ng-repeat="item in data" ng-click="toggleSelected(item, $event)">',
          '<td ng-if="options.selectionEnabled">',
          '<label class="checkbox" ng-click="toggleSelected(item, $event);">',
          '<input type="checkbox" ng-checked="item.selected">',
          '<span class="checkbox__input"></span>',
          '</label>',
          '</td>',
          '<td ng-repeat="col in options.columns">',
          '<span ng-if="col.template" ng-compile="col.template"></span>',
          '<span ng-if="col.bind" ng-bind="$eval(col.bind)"></span>',
          '</td>',
          '</tr>',
          '</tbody>',
          '</table>',
          '</div>'
        ].join(''),
        scope: true,
        link: function ($scope, el, attrs) {
          $scope.options = $scope.$eval(attrs.options);
          $scope.smartPager = $scope.$eval(attrs.smartPager);
          _.defaults($scope.options, {
            selectionEnabled: true,
            unknownGroupName: {}
          });
          $scope.isAllSelected = false;
          $scope.options.refreshPanelData = function () {
          };
          $scope.options.closePanel = function () {
            if (_.isFunction(DETAILS_MODAL.close)) {
              DETAILS_MODAL.close();
            }
            $scope.options.refreshPanelData = function () {
            };
          };
          $scope.toggleSelected = function (item, e) {
            e = e || {};
            /* Ignore anchor, input and button mouse clicks in the row */
            if ($scope.options.selectionEnabled) {
              item.selected = !item.selected;
              $scope.$emit('selectionUpdated', item);
              if (_.isFunction($scope.options.udpateSelected)) {
                $scope.options.udpateSelected();
              }
              e.preventDefault();
              e.stopPropagation();
            }
          };
          $scope.toggleAllSelected = function () {
            $scope.isAllSelected = !$scope.isAllSelected;
            if ($scope.smartPager) {
              $scope.smartPager.selectAll($scope.isAllSelected);
            }
          };
          $scope.togglePanel = function (item, e) {
            e = e || {};
            DETAILS_MODAL = $modal.open(quickViewOpts(item, $scope));
            if (e.stopPropagation) {
              e.stopPropagation();
            }
          };
          $scope.toggleSort = function (col) {
            if (col.sortField) {
              if (col.direction === null) {
                col.direction = $scope.sort.direction;
              }
              col.direction = col.direction === 'asc' ? 'desc' : 'asc';
              $scope.$emit('sortUpdated', {
                value: col.sortField,
                direction: col.direction
              });
              emitGrouping(col);
            }
          };
          function emitGrouping(col) {
            var col = _.find($scope.sortColumns, { value: col.sortField });
            if (col) {
              $scope.$emit('groupingUpdated', col.group ? col.value : false, col.groupNameTemplate);
            }
          }
          function groupByCheck(groupBy) {
            if (groupBy) {
              $scope.groups = makeGroups($scope.data, groupBy, $scope.options.unknownGroupName[groupBy]);
              $scope.groupByLabel = getGroupByLabel(groupBy, $scope.$eval($scope.options.sortColumns));
            } else {
              $scope.groups = [];
            }
          }
          $scope.$watch('smartPager.selectedItems', function (selected) {
            if (selected) {
              $scope.isAllSelected = selected.length && selected.length === $scope.smartPager.data.length;
            }
          });
          $scope.$watch('options.groupBy', groupByCheck);
          $scope.$watch($scope.options.data, function (n) {
            $scope.data = n;
            groupByCheck($scope.options.groupBy);
          });
          _.each([
            'sort',
            'sortColumns'
          ], function (key) {
            $scope.$watch($scope.options[key], function (n) {
              $scope[key] = n;
            });
          });
        }
      };
    }
  ]);
  app.directive('smartCard2', [
    '$modal',
    function ($modal) {
      return {
        restrict: 'E',
        template: [
          '<div class="card-group" ng-if="options.groupBy" ng-repeat="group in cardGroups">',
          '<h6 class="card-group__header text-muted">',
          '<span ng-if="!options.groupNameTemplate" ng-bind="group.name"></span>',
          '<span ng-if="options.groupNameTemplate" ng-compile="options.groupNameTemplate"></span>',
          '</h6>',
          '<div class="cards cards--{{ options.cardsPerRow }}col" ng-class="{\'cards--selected\': selectedItems.length}" smart-cards="group.cards"></div>',
          '</div>',
          '<div ng-if="!options.groupBy" class="cards cards--{{ options.cardsPerRow }}col" ng-class="{\'cards--selected\': selectedItems.length}" smart-cards="data"></div>'
        ].join(''),
        scope: true,
        link: function ($scope, el, attrs) {
          $scope.options = $scope.$eval(attrs.options);
          $scope.cardGroups = [];
          $scope.selectedItems = [];
          _.defaults($scope.options, {
            selectionClass: 'success',
            selectionEnabled: true,
            unknownGroupName: {}
          });
          $scope.toggleSelected = function (e, card, buttonClicked) {
            e = e || {};
            /* Ignore anchor, input and button mouse clicks in the row */
            if ($scope.options.selectionEnabled && (buttonClicked || $scope.selectedItems.length && !$(e.target).hasClass('select-ignore'))) {
              card.selected = !card.selected;
              $scope.$emit('selectionUpdated', card);
              if (_.isFunction($scope.options.updateSelected)) {
                $scope.options.updateSelected();
              }
            }
            e.stopPropagation();
          };
          $scope.options.refreshPanelData = function () {
          };
          $scope.options.closePanel = function () {
            if (_.isFunction(DETAILS_MODAL.close)) {
              DETAILS_MODAL.close();
            }
            $scope.options.refreshPanelData = function () {
            };
          };
          $scope.options.toggleCardPanel = function (card) {
            if (!_.isObject(card)) {
              card = _.find($scope.data, { id: card });
            }
            $scope.togglePanel(card);
          };
          $scope.togglePanel = function (card, e) {
            e = e || {};
            DETAILS_MODAL = $modal.open(quickViewOpts(card, $scope));
            if (e.stopPropagation) {
              e.stopPropagation();
            }
          };
          function groupByCheck(groupBy) {
            if (groupBy) {
              $scope.cardGroups = makeGroups($scope.data, groupBy, $scope.options.unknownGroupName[groupBy]);
              $scope.groupByLabel = getGroupByLabel(groupBy, $scope.$eval($scope.options.sortColumns));
            } else {
              $scope.cardGroups = [];
            }
          }
          $scope.$watch('options.groupBy', groupByCheck);
          $scope.$watch($scope.options.selectedItems, function (items) {
            if (items) {
              $scope.selectedItems = items;
            }
          });
          $scope.$watch($scope.options.data, function (n) {
            $scope.data = n;
            groupByCheck($scope.options.groupBy);
            if ($scope.options.deferredCardToggle && !_.isEmpty(n)) {
              $scope.options.toggleCardPanel($scope.options.deferredCardToggle);
              $scope.options.deferredCardToggle = null;
            }
          });
        }
      };
    }
  ]);
  app.directive('smartCards', function () {
    return {
      scope: true,
      template: [
        '<div class="card-container" ng-repeat="card in cardArray">',
        '<div ng-click="toggleSelected($event, card)" class="card card--{{ card.selected ? \'selected\' : \'default\' }}">',
        '<div ng-include="options.cardTemplateUrl"></div>',
        '<div class="card__footer select-ignore" ng-if="options.cardToolbarTemplate || options.detailsTemplateUrl">',
        '<span ng-compile="options.cardToolbarTemplate"></span>',
        '<a ng-if="options.detailsTemplateUrl" class="link pull-right" title="More Info" ng-click="togglePanel(card, $event)"><span class="icon-more"></span></a>',
        '</div>',
        '</div>',
        '</div>'
      ].join(''),
      link: function ($scope, el, attrs) {
        $scope.$watch(attrs.smartCards, function (n) {
          $scope.cardArray = n;
        });
      }
    };
  });
  app.directive('cardBody2', function () {
    return {
      restrict: 'E',
      transclude: true,
      replace: true,
      template: '<div class="card__body" ng-transclude></div>'
    };
  });
  app.directive('cardHeader2', function () {
    return {
      restrict: 'E',
      transclude: true,
      replace: true,
      template: [
        '<div class="card__header">',
        '<div ng-if="options.selectionEnabled" class="card-select">',
        '<a class="button button--icon" ng-click="toggleSelected($event, card, true, options)"><span class="icon-check"></span></a>',
        '</div>',
        '<div ng-transclude></div>',
        '</div>'
      ].join('')
    };
  });
  app.directive('smartFilter', function () {
    return {
      restrict: 'E',
      replace: true,
      scope: true,
      template: [
        '<div class="smart-filter">',
        '<div class="toggle-filters" ng-class="{\'toggle-filters--expanded\': filterGroups.expanded}">',
        '<div class="toggle-filters__button" ng-click="filterGroups.expanded = !filterGroups.expanded">',
        '<span class="text-muted"><span class="icon-filter"></span> Filters</span>',
        '<span class="pull-right text-disabled" ng-class="{\'icon-chevron-up\': filterGroups.expanded, \'icon-chevron-down\': !filterGroups.expanded}"></span>',
        '<span ng-if="smartPager.isFiltered(true)">',
        '<button class="button button--small clear-filters--mobile" ng-click="clearAll(); $event.stopPropagation()">Clear All Filters</button>',
        '</span>',
        '</div>',
        '<div class="filter-groups">',
        '<div ng-repeat="filterGroup in options.filters" class="filter-group">',
        '<div class="legend legend--toggle" ng-if="!filterGroup.exception" ng-click="filterGroup.hidden = !filterGroup.hidden">',
        '<span ng-bind="filterGroup.label"></span>',
        '<small class="pull-right text-disabled"><span ng-class="{\'icon-chevron-down\': filterGroup.hidden, \'icon-chevron-up\': !filterGroup.hidden}"></span></small>',
        '</div>',
        '<div ng-hide="filterGroup.hidden">',
        '<label ng-show="filterGroup.expanded" class="checkbox" ng-repeat="filter in filterGroup.values" ng-if="!filter.exception">',
        '<input type="checkbox" ng-click="toggleFilter(filter, filterGroup.value)" ng-checked="filter.checked">',
        '<div class="checkbox__input"></div>',
        '<div class="checkbox__label" title="{{ filter.title || filter.label }}" ng-bind="filter.label"></div>',
        '</label>',
        '<label ng-show="!filterGroup.expanded" class="checkbox" ng-repeat="filter in filterGroup.values | limitTo:10" ng-if="!filter.exception">',
        '<input type="checkbox" ng-click="toggleFilter(filter, filterGroup.value)" ng-checked="filter.checked">',
        '<div class="checkbox__input"></div>',
        '<div class="checkbox__label" title="{{ filter.title || filter.label }}" ng-bind="filter.label"></div>',
        '</label>',
        '<a ng-if="options.clearFilters && activeFilters[filterGroup.value]" ng-click="options.clearFilters([filterGroup.value])">Clear Filters</a>',
        '<span ng-if="options.clearFilters && activeFilters[filterGroup.value] && filterGroup.values.length > 10 && !filterGroup.expanded" class="text-muted"> | </span>',
        '<a ng-if="filterGroup.values.length > 10 && !filterGroup.expanded" ng-click="filterGroup.expanded = true">Show All</a>',
        '</div>',
        '</div>',
        '</div>',
        '</div>',
        '<span ng-if="smartPager.isFiltered(true)">',
        '<button class="button button--small clear-filters--desktop" ng-click="clearAll()">Clear All Filters</button>',
        '</span>',
        '</div>'
      ].join(''),
      link: function ($scope, el, attrs) {
        $scope.options = $scope.$eval(attrs.options);
        $scope.smartPager = $scope.$eval(attrs.smartPager);
        $scope.clearAll = function () {
          $scope.options.clearAllFilters ? $scope.options.clearAllFilters() : $scope.smartPager.clearFilters();
        };
        $scope.emit = function (filter, field) {
          $scope.$emit('filterUpdated', field, filter.value, filter.checked);
        };
        $scope.toggleFilter = function (filter, field) {
          filter.checked = !filter.checked;
          $scope.emit(filter, field);
        };
        function checkActiveFilters() {
          var filterGroups;
          var filters = $scope.options.filters;
          _.each(_.flatMap(filters, 'values'), function (filter) {
            filter.checked = false;
          });
          if (!_.isEmpty($scope.activeFilters)) {
            filterGroups = _.keyBy(filters, 'value');
            _.each($scope.activeFilters, function (values, field) {
              if (filterGroups[field]) {
                _.each(filterGroups[field].values, function (filter) {
                  filter.checked = _.includes(values, filter.value);
                });
              }
            });
          }
        }
        $scope.$watch('options.filters', function () {
          checkActiveFilters();
          if ($scope.smartPager) {
            $scope.smartPager.checkOldFilters($scope.filterOptions.filters);
          }
        });
        $scope.$watch($scope.options.activeFilters, function (n) {
          if (_.isObject(n)) {
            $scope.activeFilters = n;
            $scope.filtersActive = !_.isEmpty(n);
            checkActiveFilters();
          }
        }, true);
      }
    };
  });
  app.directive('smartSort', function () {
    return {
      restrict: 'E',
      replace: true,
      scope: true,
      template: [
        '<div class="input-group">',
        '<div class="input-group__prefix">',
        '<a ng-click="toggleSortDir()" class="link" title="{{ selectedSortDir == \'desc\' ? \'_SortAscending_\' : \'_SortDescending_\' | i18n }}">',
        '<span class="icon-sort-amount-{{ selectedSortDir == \'asc\' ? \'asc\' : \'desc\' }}"></span>',
        '</a>',
        '</div>',
        '<div class="input-group__select">',
        '<div class="select select--inline">',
        '<select id="sortby" ng-model="selectedSortCol" ng-change="emit()" ng-options="column.name for column in options.columns"></select>',
        '</div>',
        '</div>',
        '</div>'
      ].join(''),
      link: function ($scope, el, attrs) {
        $scope.options = $scope.$eval(attrs.options);
        $scope.selectedSortCol = {};
        $scope.toggleSortDir = function () {
          $scope.selectedSortDir = $scope.selectedSortDir === 'asc' ? 'desc' : 'asc';
          $scope.emit();
        };
        $scope.setSortCol = function (col, noEmit) {
          $scope.selectedSortCol = col;
          if (!noEmit) {
            $scope.emit();
          }
        };
        $scope.emit = function () {
          var col = $scope.selectedSortCol;
          $scope.$emit('sortUpdated', {
            value: col.value,
            direction: $scope.selectedSortDir,
            group: col.group
          });
          emitGrouping(col);
        };
        function emitGrouping(col) {
          var grouping = col.group ? col.value : false;
          $scope.$emit('groupingUpdated', grouping, col.groupNameTemplate);
        }
        $scope.$watch($scope.options.value, function (sort) {
          if (_.isObject(sort)) {
            var col = _.find($scope.options.columns, { value: sort.value });
            if (col) {
              $scope.setSortCol(col, true);
              $scope.selectedSortDir = sort.direction.toLowerCase();
              if (col.group) {
                emitGrouping(col);
              }
            }
          }
        }, true);
      }
    };
  });
  app.directive('smartTagSearch', function () {
    return {
      restrict: 'E',
      replace: true,
      template: [
        '<div class="smart-search">',
        '<form ng-submit="addTag()">',
        '<div class="form-group">',
        '<div class="form-group__text">',
        '<input id="search" type="search" placeholder="{{ options.placeholder }}" ng-model="searchText">',
        '<label for="search"><span class="icon-search"></span></label>',
        '</div>',
        '</div>',
        '<span class="label label-info" ng-repeat="tag in tags" title="{{ tag.text }}">',
        '<span ng-click="removeTag(tag)" class="icon-close"></span>',
        '<span ng-bind="tag.text"></span>',
        '</span>',
        '</form>',
        '</div>'
      ].join(''),
      scope: { options: '=' },
      link: function ($scope, $el) {
        $scope.tags = [];
        $el.find('input').on('keydown', function (e) {
          //treat tab and comma as submit keys
          if (e.keyCode === 9 || e.keyCode === 188) {
            $scope.addTag();
            return false;
          }
        });
        $scope.addTag = function () {
          if ($scope.searchText) {
            $scope.tags.push({ text: $scope.searchText });
            $scope.searchText = '';
            $scope.emit();
          }
        };
        $scope.removeTag = function (tag) {
          $scope.tags = _.without($scope.tags, tag);
          $scope.emit();
        };
        function getSearchText() {
          return _.map($scope.tags, 'text');
        }
        $scope.emit = function () {
          if ($scope.searchText !== null) {
            $scope.$emit('searchUpdated', getSearchText());
          }
        };
      }
    };
  });
  app.directive('smartSearch', function () {
    return {
      restrict: 'E',
      replace: true,
      scope: true,
      template: [
        '<div class="smart-search">',
        '<div class="form-group">',
        '<div class="form-group__text">',
        '<input id="search" type="search" placeholder="{{ options.placeholder }}" ng-model="searchText" ng-change="debouncedEmit()">',
        '<label for="search"><span class="icon-search"></span></label>',
        '<button type="button" class="link" ng-show="!!searchText" ng-click="clearSearchText()">',
        '<span class="icon-close"></span>',
        '</button>',
        '</div>',
        '</div>',
        '</div>'
      ].join(''),
      link: function ($scope, el, attrs) {
        $scope.options = $scope.$eval(attrs.options);
        $scope.clearSearchText = function () {
          $scope.searchText = '';
          $scope.emit();
        };
        $scope.emit = function () {
          if ($scope.searchText !== null) {
            $scope.$emit('searchUpdated', $scope.searchText);
          }
        };
        $scope.debouncedEmit = _.debounce($scope.emit, DEFAULT_SEARCH_TIMEOUT);
        $scope.$watch($scope.options.value, function (n) {
          $scope.searchText = n;
        });
      }
    };
  });
  app.directive('carouselPager', function () {
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      template: [
        '<div style="position: relative">',
        '<div ng-transclude></div>',
        '<div ng-if="smartPager.totalPages <= 10" class="smart-dots">',
        '<span class="dot" ng-repeat="n in getRange(smartPager.totalPages)" ng-click="smartPager.loadPage(n)" ng-class="{active: smartPager.params.page === n}"></span>',
        '</div>',
        '<div class="modal-pagination">',
        '<span class="icon-chevron-left" ng-hide="smartPager.isFirstPage()" ng-click="smartPager.loadPreviousPage()"></span>',
        '<span class="icon-chevron-right" ng-hide="smartPager.isLastPage()" ng-click="smartPager.loadNextPage()"></span>',
        '</div>',
        '</div>'
      ].join(''),
      scope: { smartPager: '=' },
      link: function ($scope) {
        $scope.getRange = _.range;
      }
    };
  });
  app.directive('smartToolbar', function () {
    return {
      template: [
        '<div class="smart-toolbar">',
        '<div class="smart-toolbar__actions">',
        '<label class="checkbox checkbox--inline" ng-if="smartPager.data.length && options.select && dataView !== \'table\'" title="{{ isAllSelected ? \'_SelectNone_\' : \'_SelectAll_\' | i18n }}">',
        '<input type="checkbox" ng-click="toggleAllSelected()" ng-checked="isAllSelected">',
        '<span class="checkbox__input"></span>',
        '</label>',
        '<span ng-transclude></span>',
        '</div>',
        '<div class="pull-right">',
        '<div class="input-group">',
        '<label ng-if="toggleView" class="switch--icon">',
        '<input ng-checked="dataView === \'table\'" type="checkbox" ng-click="toggleView()">',
        '<span class="switch__input">',
        '<span class="icon-grid-view" title="{{ \'_GridView_\' | i18n }}"></span>',
        '<span class="icon-list-view" title="{{ \'_ListView_\' | i18n }}"></span>',
        '</span>',
        '</label>',
        '</div>',
        '<smart-sort ng-if="sortOptions" options="sortOptions"></smart-sort>',
        '</div>',
        '</div>'
      ].join(''),
      restrict: 'E',
      replace: true,
      scope: true,
      transclude: true,
      link: function ($scope, el, attrs) {
        $scope.options = _.defaults($scope.$eval(attrs.options), { select: true });
        $scope.sortOptions = $scope.$eval(attrs.sortOptions);
        $scope.smartPager = $scope.$eval(attrs.smartPager);
        $scope.isAllSelected = false;
        $scope.$watch('smartPager.selectedItems', function (selected) {
          if (selected) {
            $scope.isAllSelected = selected.length && selected.length === $scope.smartPager.data.length;
          }
        });
        $scope.toggleAllSelected = function () {
          $scope.isAllSelected = !$scope.isAllSelected;
          $scope.smartPager.selectAll($scope.isAllSelected);
        };
      }
    };
  });
  app.factory('smartPager', [
    '$location',
    '$utilities',
    function ($location, $utilities) {
      function SmartPager(options) {
        _.extend(this, options);
        _.defaults(this, {
          data: [],
          selectedItems: [],
          totalElements: 0
        });
        _.defaults(this.params, {
          filter: {},
          page: 0
        });
        if (options.autoLoad) {
          this.loadData();
        }
      }
      SmartPager.prototype.selectAll = function (bool) {
        _.each(this.data, function (item) {
          item.selected = bool;
        });
        this.updateSelected();
      };
      SmartPager.prototype.selectItem = function (item, bool) {
        if (_.includes(this.data, item)) {
          item.selected = bool;
          this.updateSelected();
        }
      };
      SmartPager.prototype.selectIndex = function (index, bool) {
        this.data[index].selected = bool;
        this.updateSelected();
      };
      SmartPager.prototype.updateSelected = function () {
        this.selectedItems = _.filter(this.data, { selected: true });
      };
      SmartPager.prototype.refresh = function (id) {
        this.service.read({ filter: 'id:' + id });
      };
      SmartPager.prototype.reload = function (resetPaging) {
        var page, size;
        this.selectedItems = [];
        if (resetPaging) {
          this.params.page = 0;
          this.data = [];
          this.loadData();
        } else {
          size = this.params.size;
          page = this.params.page;
          this.params.size = this.data.length;
          this.data = [];
          this.params.page = 0;
          this.loadData().then(_.bind(function () {
            this.params.page = page;
            this.params.size = size;
          }, this));
        }
      };
      SmartPager.prototype.isFiltered = function (filteringOnly) {
        if (filteringOnly) {
          return !_.isEmpty(this.params.filter);
        }
        return !_.isEmpty(this.params.filter) || this.params.search;
      };
      SmartPager.prototype.sort = function (sort) {
        this.params.sort = sort;
        this.reload(true);
      };
      SmartPager.prototype.clearSortNoReload = function (sortDefault) {
        this.params.sort = sortDefault;
      };
      SmartPager.prototype.search = function (search) {
        this.params.search = search;
        this.reload(true);
      };
      SmartPager.prototype.clearSearchNoReload = function () {
        this.params.search = '';
      };
      SmartPager.prototype.clearFilters = function (keys, performReload) {
        if (_.isArray(keys)) {
          this.params.filter = _.omit(this.params.filter, keys);
        } else {
          this.params.filter = {};
        }
        if (!$utilities.isStandalone) {
          this._updateUrlParams();
        }
        if (performReload || _.isUndefined(performReload)) {
          this.reload(true);
        }
      };
      SmartPager.prototype.resetSettings = function (sortDefault, performReload) {
        this.clearFilters(null, false);
        this.clearSearchNoReload();
        this.clearSortNoReload(sortDefault);
        if (performReload || _.isUndefined(performReload)) {
          this.reload(true);
        }
      };
      /**
         * Used to get around issues with setting the pager service too late on some browsers
         * Should only be used in conjunction with autoLoad: false
         * ie. Firefox when loading SupportCases from MyDevices and wrapping the pager in a promise
         */
      SmartPager.prototype.setService = function (service) {
        this.service = service;
      };
      SmartPager.prototype.filter = function (field, value, checked, reload) {
        if (checked) {
          if (this.params.filter[field]) {
            this.params.filter[field].push(value);
          } else {
            this.params.filter[field] = [value];
          }
        } else {
          this.params.filter[field] = _.without(this.params.filter[field], value);
          if (!this.params.filter[field].length) {
            delete this.params.filter[field];
          }
        }
        if (!$utilities.isStandalone) {
          this._updateUrlParams();
        }
        if (reload || _.isUndefined(reload)) {
          this.reload(true);
        }
      };
      SmartPager.prototype.checkOldFilters = function (filters) {
        var update = false;
        var reduceMap = _.reduce(filters, function (memo, group) {
            memo[group.value] = _.flatMap(group.values, 'value');
            return memo;
          }, {});
        _.each(this.params.filter, _.bind(function (activeFilters, cat) {
          if (reduceMap[cat]) {
            _.each(activeFilters, _.bind(function (filter) {
              if (!_.includes(reduceMap[cat], filter) && !_.find(filters, { value: cat }).exception) {
                this.params.filter[cat] = _.without(this.params.filter[cat], filter);
                if (!this.params.filter[cat].length) {
                  delete this.params.filter[cat];
                }
                update = true;
              }
            }, this));
          } else {
            delete this.params.filter[cat];
            update = true;
          }
        }, this));
        if (update) {
          if (!$utilities.isStandalone) {
            this._updateUrlParams();
          }
          this.reload(true);
        }
      };
      SmartPager.prototype.loadMore = function () {
        this.params.page += 1;
        this.loadData(true);
      };
      SmartPager.prototype.loadPreviousPage = function () {
        if (!this.isFirstPage()) {
          this.loadPage(this.params.page - 1);
        }
      };
      SmartPager.prototype.loadNextPage = function () {
        if (!this.isLastPage()) {
          this.loadPage(this.params.page + 1);
        }
      };
      SmartPager.prototype.loadFirstPage = function () {
        if (!this.isFirstPage()) {
          this.loadPage(0);
        }
      };
      SmartPager.prototype.loadLastPage = function () {
        if (!this.isLastPage()) {
          this.loadPage(this.totalPages - 1);
        }
      };
      SmartPager.prototype.loadPage = function (page) {
        this.selectedItems = [];
        this.params.page = page;
        this.loadData();
      };
      SmartPager.prototype.isFirstPage = function () {
        return this.params.page === 0;
      };
      SmartPager.prototype.isLastPage = function () {
        return this.params.page === this.totalPages - 1;
      };
      SmartPager.prototype.getFirstItemIndex = function () {
        return this.params.size * this.params.page + 1;
      };
      SmartPager.prototype.getLastItemIndex = function () {
        return this.getFirstItemIndex() + this.numberOfElements - 1;
      };
      SmartPager.prototype.loadAll = function () {
        var size = this.params.size;
        this.params.size = 1000000;
        this.reload(true);
        this.params.size = size;
      };
      SmartPager.prototype._updateUrlParams = function () {
        $location.search(_.pick($location.search(), 'cq'));
        var filters = _.chain(this.params.filter).omit('undefined').map(function (values, key) {
            return key + ':' + values.join(',' + key + ':');
          }).value().join();
        if (filters) {
          $location.search('filter', filters);
        }
      };
      SmartPager.prototype._checkUrlParams = function () {
        var urlParams = $location.search();
        if (urlParams.filter && urlParams.filter !== '') {
          _.each(urlParams.filter.split(','), _.bind(function (filterStr) {
            var filterTokens = filterStr.split(':');
            var key = filterTokens[0];
            var val = decodeURIComponent(filterTokens[1], true, true);
            if (!this.params.filter[key]) {
              this.params.filter[key] = [val];
            } else {
              if (!_.includes(this.params.filter[key], val)) {
                this.params.filter[key].push(val);
              }
            }
          }, this));
        }
        if (urlParams.exactFilter) {
          this.params.exactFilter = urlParams.exactFilter;
        }
      };
      SmartPager.prototype._getParams = function () {
        var params = _.clone(this.params);
        params.sort = this.params.sort.value + ',' + this.params.sort.direction;
        this._checkUrlParams();
        params.exactFilter = this.params.exactFilter;
        params.filter = _.chain(this.params.filter).omit('undefined').map(function (values, key) {
          return key + ':' + values.join(',' + key + ':');
        }).value().join();
        if (this.splitSearchWords && this.params.search) {
          params.search = this.params.search.split(' ');
        }
        return params;
      };
      SmartPager.prototype.loadData = function (append) {
        if (!this.params.page || !this.totalPages || this.params.page < this.totalPages) {
          this.isLoading = true;
          if (!append) {
            this.data = [];
          }
          return this.service.read(this._getParams()).then(_.bind(function (res) {
            if (res && res.data) {
              _.extend(this, _.pick(res.data, [
                'numberOfElements',
                'totalElements',
                'totalPages',
                'lastPage'
              ]));
              if (append) {
                this.data.push.apply(this.data, res.data.content);
              } else {
                this.data = res.data.content;
              }
            }
          }, this)).finally(_.bind(function () {
            this.isLoading = false;
          }, this));
        }
      };
      return SmartPager;
    }
  ]);
});