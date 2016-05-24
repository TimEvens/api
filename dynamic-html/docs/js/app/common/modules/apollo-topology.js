define([
  'angular',
  'underscore',
  'vis'
], function (angular, _, vis) {
  var app = angular.module('ap-topology', []);
  /**
     *	An impelmentation of vis.js network graphing.
     *
     *  full documentation here: http://visjs.org/docs/network/
     *
     * 	options:
     * 	{
     *     width: '900px',  will take % or px. eg width:100% or width:500px
     *     height: '500px', will take % or px. eg height:100% or height:500px
     *     edges :{ Defining edge arrow directions here will make it global,
     *     			if necessary you could do this on a per 'edge' basis.
     *        arrows:{
     *        	 to: {enabled: true, scaleFactor:1}
     *        	 from: {enabled: false, scaleFactor:1}
     *        	 middle: {enabled: false, scaleFactor:1}
     *        },
     *        color:'#049fd9' - {string} default color is 'cisco blue'
     *     },
     *     physics: {
     *     	  enabled: true - {boolean} by default set to true.
     *     	                            If you would like to disable the "jiggle" effect turn this off.
     *     }
     * 	}
     *
     * 	nodes {array} :
     * 	[{
     * 		id: 1, - {int} (required) unique identifier of the node
     * 		label: 'router', - {string} text to repersent this node
     * 		shape: 'star', - {string} shape of the node, default is 'ellipse'.
     * 					     shapes avaiable: ellipse, circle, box, diamond, star, triangle, triangleDown, squared
     *
     * 		type: 'switch' - {string} if you would like to show an icon instead of a shape
     *
     * 		color: '#abc233' - {string or object}
     *
     *   	# Full color options
     * 		color: {
     * 			border: '#abc233', {string}
     * 			background: '#abc233', {string}
     * 			highlight:{
 	 *		        border: '#abc233', {string}
     *  			background: '#abc233', {string}
     * 			},
     * 			hover:{
     *    	        border: '#abc233', {string}
     *  			background: '#abc233', {string}
     * 			}
     * 		}
     * 	}]
     *
     *
     * 	edges {array}: connets two nodes. The values for 'from' and 'to',
     * 	 are based on the 'id' of each node as explained above.
     *
     * 	[
     * 		{
     * 			from: 1, - From sed node
     * 			to: 1, - to sed node
     * 			label:'label of arrow' - labels are optional
     * 		},
     * 		{from:1, to: 2}
     * 	]
     */
  app.directive('networkVis', [
    '$registry',
    function ($registry) {
      return {
        scope: {
          options: '=',
          nodes: '=',
          edges: '='
        },
        restrict: 'E',
        template: '<div class="panel" id="networkvisualization"></div>',
        link: function ($scope, $el) {
          $scope.hubBase = $registry.byId('hub').baseUrl;
          var imageMap = {
              'switch': $scope.hubBase + '/img/topology/switches/switch.svg',
              'layer3Switch': $scope.hubBase + '/img/topology/switches/layer3Switch.svg',
              'multiServiceSwitch': $scope.hubBase + '/img/topology/switches/multiserviceSwitch.svg',
              'ucsSwitch': $scope.hubBase + '/img/topology/switches/ucsSwitch.svg',
              'voiceATMSwitch': $scope.hubBase + '/img/topology/switches/voiceATMSwitch.svg',
              'voiceSwitch': $scope.hubBase + '/img/topology/switches/voiceSwitch.svg',
              'router': $scope.hubBase + '/img/topology/routers/router.svg',
              'voiceRouter': $scope.hubBase + '/img/topology/routers/voiceRouter.svg',
              'wirelessRouter': $scope.hubBase + '/img/topology/routers/wirelessRouter.svg',
              'server': $scope.hubBase + '/img/topology/servers/virtualServer.svg',
              'aceServer': $scope.hubBase + '/img/topology/servers/ACEServer.svg',
              'serverFarm': $scope.hubBase + '/img/topology/servers/serverFarm.svg',
              'sipProxyServer': $scope.hubBase + '/img/topology/servers/SIPProxyServer.svg',
              'webServer': $scope.hubBase + '/img/topology/servers/wwwServer.svg',
              'firewall': $scope.hubBase + '/img/topology/firewalls/routerFirewall.svg',
              'internet': $scope.hubBase + '/img/topology/Internet.svg',
              'modem': $scope.hubBase + '/img/topology/modems/modem.svg'
            };
          function checkNodeImages() {
            _.each($scope.nodes, function (node) {
              if (node.type && imageMap[node.type]) {
                node.image = imageMap[node.type];
                node.shape = 'image';
              }
            });
          }
          $scope.options = _.defaultsDeep($scope.options || {}, {
            height: '500px',
            width: '100%',
            edges: {
              arrows: {
                to: {
                  enabled: true,
                  scaleFactor: 1
                },
                middle: {
                  enabled: false,
                  scaleFactor: 1
                },
                from: {
                  enabled: false,
                  scaleFactor: 1
                }
              },
              color: '#049fd9'
            }
          });
          $scope.$watchCollection('nodes', function () {
            loadNetworkGraph();
          });
          $scope.$watchCollection('edges', function () {
            loadNetworkGraph();
          });
          function loadNetworkGraph() {
            checkNodeImages();
            var data = {
                nodes: new vis.DataSet($scope.nodes),
                edges: new vis.DataSet($scope.edges)
              };
            var network = new vis.Network($el.find('#networkvisualization')[0], data, $scope.options);
          }
        }
      };
    }
  ]);
});