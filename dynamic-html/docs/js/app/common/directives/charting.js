define([
  'appModule',
  'underscore',
  'moment',
  'highcharts',
  'highcharts-boost',
  'highcharts-downsample',
  'timeAgo'
], function (app, _, moment) {
  var colorRegex = /(rgba\(\d+,\d+,\d+,\d+\)|#[a-fA-F0-9]{3,6})/;
  var DEFAULT_LINE_WIDTH = 2;
  /** Base directive for creating charts
    *
    *  Supported attributes
    *   type:
    *     line, area, etc:  http://api.highcharts.com/highcharts#plotOptions
    *   zoom:
    *     which axis to allow zoom along
    *   title:
    *     Title of the chart
    *   subtitle:
    *     Subtitle for the chart
    *   enableMouseTracking:
    *     Enable/Disable mouse tracking
    *     http://api.highcharts.com/highcharts#plotOptions.line.enableMouseTracking
    *   linearGradient:  w,x,y,z
    *     Fill color for area charts
    *     http://api.highcharts.com/highcharts#plotOptions.area.fillColor
    *   fillColorStops:  rgba(R,G,B,alpha)|#RRGGBB
    *     http://api.highcharts.com/highcharts#plotOptions.area.fillColor
    *   markerRadius:
    *     The radius of the point marker
    *     http://api.highcharts.com/highcharts#plotOptions.area.marker.radius
    **/
  app.directive('chart', [
    '$timeout',
    function ($timeout) {
      return {
        scope: true,
        restrict: 'E',
        controller: [
          '$scope',
          function ($scope) {
            // Controller for receiving calls from sub directives
            var series = $scope.series = [];
            // Called to register a series
            this.addSeries = function (ns) {
              series.push(ns);
            };
            // Called to set x axis
            this.setXAxis = function (nAxis) {
              $scope.xAxis = nAxis;
            };
            // Called to set y axis
            this.setYAxis = function (nAxis) {
              $scope.yAxis = nAxis;
            };
          }
        ],
        link: function ($scope, el, attrs) {
          // Creates the Highcharts configuration object for creating a chart
          $scope.chartType = attrs.type;
          function onChartSelection(event) {
            if (event.resetSelection) {
              _.forEach(event.target.series, function (hSeries) {
                var sSeries = _.find($scope.series, { name: hSeries.name });
                if (sSeries) {
                  hSeries.setData(sSeries.origData);
                }
              });
              return;
            }
            var rXMin = Math.round(event.xAxis[0].min);
            var rXMax = Math.round(event.xAxis[0].max);
            var origData = $scope.series[0].origData;
            var oMinIdx = _.findIndex(origData, function (origValue) {
                return origValue[0] > rXMin;
              });
            var oMaxIdx = _.findLastIndex(origData, function (origValue) {
                return origValue[0] < rXMax;
              });
            oMinIdx = oMinIdx > 0 ? --oMinIdx : oMinIdx;
            oMaxIdx = oMaxIdx > 0 ? ++oMaxIdx : oMaxIdx;
            _.forEach(event.target.series, function (hSeries) {
              var sSeries = _.find($scope.series, { name: hSeries.name });
              if (sSeries) {
                hSeries.setData(sSeries.origData.slice(oMinIdx, oMaxIdx));
              }
            });
          }
          function initChart() {
            var chartDef = {
                chart: {
                  zoomType: $scope.zoom || attrs.zoom,
                  type: $scope.chartType
                },
                title: { text: $scope.title || attrs.title || 'Unset' },
                subtitle: { text: $scope.subtitle || attrs.subtitle || '' },
                credits: { enabled: false },
                xAxis: {
                  title: {
                    text: _.get($scope, [
                      'xAxis',
                      'label'
                    ], '')
                  }
                },
                yAxis: {
                  min: _.get($scope, [
                    'yAxis',
                    'min'
                  ], undefined),
                  title: {
                    text: _.get($scope, [
                      'yAxis',
                      'label'
                    ], '')
                  }
                },
                plotOptions: {}
              };
            var xAxisType = _.get($scope, [
                'xAxis',
                'type'
              ], undefined);
            var xAxisFormat = _.get($scope, [
                'xAxis',
                'format'
              ], undefined);
            chartDef.xAxis.type = xAxisType;
            if (xAxisType === 'datetime' && xAxisFormat) {
              chartDef.xAxis.labels = {
                formatter: function () {
                  return moment(this.value).format(xAxisFormat);
                }
              };
            }
            var plotOptions = { enableMouseTracking: $scope.enableMouseTracking || attrs.enableMouseTracking || false };
            var lc = $scope.linearGradient || attrs.linearGradient;
            if (lc) {
              var grad = lc.split(',');
              plotOptions.fillColor = {
                linearGradient: {
                  x1: parseInt(grad[0]),
                  y1: parseInt(grad[1]),
                  x2: parseInt(grad[2]),
                  y2: parseInt(grad[3])
                }
              };
            }
            var fcs = $scope.fillColorStops || attrs.fillColorStops;
            if (fcs) {
              plotOptions.fillColor.stops = _.reduce(_.filter(_.split(fcs, colorRegex), function (itm) {
                return itm && itm !== ',';
              }), function (accum, value, index) {
                accum.push([
                  index,
                  value
                ]);
                return accum;
              }, []);
            }
            var mr = $scope.markerRadius || attrs.markerRadius;
            if (mr) {
              plotOptions.marker = { radius: parseInt(mr) };
            }
            if (!$scope.downsample) {
              var pStart = _.get($scope, [
                  'xAxis',
                  'start'
                ]);
              if (pStart) {
                plotOptions.pointStart = pStart;
              }
              var pInterval = _.get($scope, [
                  'xAxis',
                  'increment'
                ]);
              if (pInterval) {
                plotOptions.pointStart = pInterval;
              }
            } else {
              chartDef.chart.events = { selection: onChartSelection };
            }
            chartDef.legend = { enabled: $scope.legend || attrs.legend };
            chartDef.plotOptions[$scope.chartType] = plotOptions;
            var shouldShowChart = function () {
              var parent = $($scope.parentElement || el[0].parentElement);
              if (!parent.is(':visible')) {
                $timeout(shouldShowChart, 100);
                return;
              }
              chartDef.chart.width = parent.innerWidth();
              _.invoke($scope, 'clearParentElement');
              chartDef.series = _.map($scope.series, function (theSeries) {
                var s = { name: theSeries.name };
                if ($scope.downsample) {
                  s.downsample = { threshold: parseInt($scope.downsample) };
                  var xData = _.get($scope, [
                      'xAxis',
                      'values'
                    ]);
                  s.data = _.zip(xData, theSeries.values);
                } else {
                  s.data = theSeries.values;
                }
                theSeries.origData = s.data;
                if (theSeries.lineWidth) {
                  s.lineWidth = parseInt(theSeries.lineWidth);
                  s.states = { hover: { lineWidth: s.lineWidth } };
                }
                return s;
              });
              el.highcharts(chartDef);
            };
            $timeout(shouldShowChart, 50);
          }
          initChart();
        }
      };
    }
  ]);
  /**
    * Line chart directive built on top of "chart"
    */
  app.directive('lineChart', function () {
    return {
      restrict: 'E',
      scope: true,
      transclude: true,
      template: '<chart type="line"><div ng-transclude></div></chart>',
      link: {
        pre: function ($scope, el, attrs) {
          _.assignIn($scope, _.pick(attrs, [
            'title',
            'subtitle',
            'legend',
            'zoom',
            'markerRadius',
            'enableMouseTracking',
            'downsample'
          ]));
          // Set parentElement so that base chart can determine if we are
          // visible
          $scope.parentElement = $(el[0].parentElement);
          // Allow base chart to remove the parent element from scope
          $scope.clearParentElement = function () {
            delete $scope.parentElement;
          };
        }
      }
    };
  });
  /**
    * Area chart directive built on top of "chart"
    */
  app.directive('areaChart', function () {
    return {
      restrict: 'E',
      scope: true,
      transclude: true,
      template: '<chart type="area"><div ng-transclude></div></chart>',
      link: {
        pre: function ($scope, el, attrs) {
          _.assignIn($scope, _.pick(attrs, [
            'title',
            'subtitle',
            'legend',
            'zoom',
            'markerRadius',
            'linearGradient',
            'fillColorStops',
            'enableMouseTracking'
          ]));
          // Set parentElement so that base chart can determine if we are
          // visible
          $scope.parentElement = $(el[0].parentElement);
          // Allow base chart to remove the parent element from scope
          $scope.clearParentElement = function () {
            delete $scope.parentElement;
          };
        }
      }
    };
  });
  /**
    * Define a series for a chart
    *
    * Attributes:
    *  lineWidth:
    *    Number of pixels for a line
    *  hoverLineWidth:
    *    Number of pixes when the line is hovered over
    *  label:
    *    Label for the line
    *  markerRadius:
    *    Radius of the marker
    **/
  app.directive('series', function () {
    function validateFloat(v) {
      return parseFloat(v) || 0;
    }
    return {
      restrict: 'E',
      scope: true,
      require: '^chart',
      link: function ($scope, el, attrs, chart) {
        var vFunc = attrs.notNumber ? _.identity : validateFloat;
        $scope.values = _.map(_.get($scope, attrs.values, []), vFunc);
        $scope.name = attrs.name || '';
        if (attrs.lineWidth) {
          $scope.lineWidth = parseInt(attrs.lineWidth) || DEFAULT_LINE_WIDTH;
        }
        if (attrs.hoverLineWidth) {
          $scope.states = { hover: { lineWidth: parseInt(attrs.hoverLineWidth) || $scope.lineWidth || DEFAULT_LINE_WIDTH } };
        }
        if (attrs.markerRadius) {
          $scope.markerRadius = attrs.markerRadius;
        }
        // Add the series to the chart
        chart.addSeries($scope);
      }
    };
  });
  /**
    * Defines the X-Axis for a chart
    *
    * Attributes
    *  label:
    *    X-Axis label
    *  type:
    *    datetime, linear, http://api.highcharts.com/highcharts#plotOptions
    *  start:
    *    Defines the X starting value for the first y value in a series
    *  increment:
    *    Amount x values should increase per y value
    **/
  app.directive('xaxis', function () {
    return {
      restrict: 'E',
      scope: true,
      require: '^chart',
      link: function ($scope, el, attrs, chart) {
        var def = _.assignWith({
            start: 0,
            increment: 1,
            values: [],
            format: undefined
          }, _.pick(attrs, [
            'label',
            'type',
            'start',
            'increment',
            'format',
            'values'
          ]), function (objValue, srcValue, key) {
            if (key === 'increment' || key === 'start' && !(_.isUndefined(srcValue) || _.isNull(srcValue))) {
              try {
                return parseFloat(srcValue);
              } catch (e) {
                return objValue;
              }
            } else if (key === 'values' && !(_.isUndefined(srcValue) || _.isNull(srcValue))) {
              return _.get($scope, srcValue);
            }
            return _.isUndefined(srcValue) || _.isNull(srcValue) ? objValue : srcValue;
          });
        // Add the axis to the chart
        chart.setXAxis(def);
      }
    };
  });
  /**
    * Defines the Y-Axis for a chart
    *
    * Attributes
    *  label:
    *    Y-Axis label
    *  min:
    *    Minimum value for the y-axis
    **/
  app.directive('yaxis', function () {
    return {
      restrict: 'E',
      scope: true,
      require: '^chart',
      link: function ($scope, el, attrs, chart) {
        var def = _.assignWith({
            label: '',
            min: 0
          }, _.pick(attrs, [
            'label',
            'min'
          ]), function (objValue, srcValue, key) {
            if (key === 'min' && !(_.isUndefined(srcValue) || _.isNull(srcValue))) {
              try {
                return parseFloat(srcValue);
              } catch (e) {
                return objValue;
              }
            }
            return _.isUndefined(srcValue) || _.isNull(srcValue) ? objValue : srcValue;
          });
        chart.setYAxis(def);
      }
    };
  });
});