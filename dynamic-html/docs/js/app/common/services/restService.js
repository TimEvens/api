/**
 * Rest Service
 * A generic REST-based Angular service used for all CRUD-related operations
 */
define([
  'appModule',
  'underscore'
], function (app, _) {
  app.service('restService', [
    '$log',
    '$http',
    function ($log, $http) {
      var service = {
          add: function (url, obj, successCallback, errCallback) {
            $http.post(url, JSON.stringify(obj)).success(successCallback).error(errCallback);
          },
          update: function (url, id, obj, successCallback, errCallback) {
            var theUrl = id ? url + '/' + id : url;
            $http.put(theUrl, JSON.stringify(obj)).success(successCallback).error(errCallback);
          },
          remove: function (url, id, successCallback, errCallback) {
            var theUrl = id ? url + '/' + id : url;
            //$http.delete(theUrl+'/'+id).success(successCallback).error(errCallback);
            $http.delete(theUrl).success(successCallback).error(errCallback);
          },
          fetchSingle: function (url, id, successCallback, errCallback) {
            var cfg = { params: { nocache: new Date().getTime() } };
            // Needed for IE10/11
            var theUrl = id ? url + '/' + id : url;
            $http.get(theUrl, cfg).success(successCallback).error(errCallback);
          },
          fetchAll: function (url, successCallback, errCallback) {
            var cfg = {
                params: {
                  size: 10000,
                  nocache: new Date().getTime()
                }
              };
            errCallback = errCallback || _.noop;
            $http.get(url, cfg).success(successCallback).error(errCallback);
          },
          fetch: function (url, urlParams, callback, table) {
            // Extract name/value pairs into a simpler map
            var paramMap = {};
            for (var ii = 0; ii < urlParams.length; ii++) {
              paramMap[urlParams[ii].name] = urlParams[ii].value;
            }
            // Pagination calculations
            var pageSize = paramMap.iDisplayLength;
            var start = paramMap.iDisplayStart;
            var pageNum = start / pageSize;
            // pageNum is 0 based
            // Extract sort information
            var sortCol = paramMap.iSortCol_0;
            var sortName = paramMap['mDataProp_' + sortCol];
            // Create new json structure for parameters for REST request
            // We do this so we can map the DataTables params to the params
            // our REST API needs on the server
            var restParams = {};
            restParams.size = pageSize;
            restParams.page = pageNum;
            restParams.sort = sortName + ',' + paramMap.sSortDir_0;
            restParams[sortName + '.dir'] = paramMap.sSortDir_0;
            // If we are searching by name, override the url and add the name parameter
            if (paramMap.sSearch) {
              if (typeof table.oInit.searchMap !== 'undefined') {
                url += table.oInit.searchMap.url;
                restParams[table.oInit.searchMap.param] = paramMap.sSearch;
              }
            }
            // Now fetch the data
            restParams.nocache = new Date().getTime();
            $http.get(url, { params: restParams }).success(function (data) {
              data.iTotalRecords = data.page.totalElements;
              data.iTotalDisplayRecords = data.page.totalElements;
              data.currentPage = data.page.number + 1;
              callback(data);
            }).error(callback);
          }
        };
      return service;
    }
  ]);
});