define([
  'appModule',
  'moment-timezone'
], function (app, moment) {
  app.filter('formatDate', function () {
    return function (date, format, unix) {
      var retdate = moment(unix ? date * 1000 : date);
      return unix ? retdate.tz('America/Los_Angeles').format(format || 'L') : retdate.format(format || 'L');
    };
  });
  app.filter('formatDateNoZone', function () {
    return function (date, format, unix) {
      return moment(unix ? date * 1000 : date).format(format || 'L');
    };
  });
  app.filter('utcFormatDate', function () {
    return function (date, format) {
      return moment(date + moment().zone(), format + 'Z').format(format);
    };
  });
  app.filter('utcFromNow', function () {
    function utcFromNow(date, format) {
      return moment(date + moment().zone(), format + 'Z').fromNow();
    }
    utcFromNow.$stateful = true;
    return utcFromNow;
  });
  app.filter('fromNow', function () {
    function fromNow(date, unix) {
      return moment(unix ? date * 1000 : date).zone('-08:00').fromNow();
    }
    fromNow.$stateful = true;
    return fromNow;
  });
  app.filter('fromNowNoZone', function () {
    function fromNowNoZone(date, unix) {
      return moment(unix ? date * 1000 : date).fromNow();
    }
    fromNowNoZone.$stateful = true;
    return fromNowNoZone;
  });
  app.filter('formatToUnix', function () {
    return function (date, format) {
      return format ? moment(date, format).unix() : moment(date).unix();
    };
  });
});