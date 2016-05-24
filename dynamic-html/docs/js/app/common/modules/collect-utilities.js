define(['underscore'], function (_) {
  function _composeData(area, operation, value, details, ga) {
    var data;
    // Accepts an single object or individual parameters so deal with that
    if (_.isObject(area)) {
      data = area;
      if (ga) {
      }
    } else {
      data = {
        area: area,
        details: details,
        operation: operation,
        value: value || {}
      };
      if (ga) {
      }
    }
    if (!_.isObject(data.area)) {
      data.area = {
        hitType: 'event',
        eventCategory: 'event',
        eventAction: data.area
      };
    }
    // We need to put some other data on the details property, so move any
    // string message we have to its own property inside details
    if (_.isString(data.details)) {
      data.details = { message: data.details };
    }
    data.value = data.value || {};
    data.details = _.defaults(data.details || {}, this.detailDefaults);
    return data;
  }
  function _error(object, errorCategory) {
    object.area = {
      hitType: 'error',
      errorCategory: errorCategory
    };
    return object;
  }
  function _timing(object, value, variable) {
    object.area = {
      hitType: 'timing',
      timingCategory: object.area,
      timingValue: value,
      timingVar: variable
    };
    return object;
  }
  return {
    detailDefaults: {},
    composeData: _composeData,
    error: _error,
    timing: _timing
  };
});