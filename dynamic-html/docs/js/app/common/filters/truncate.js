define([
  'appModule',
  'underscore'
], function (app, _) {
  function getHTMLArray(val) {
    var matches = val.match(/<[^>]+>.*?<\/[^>]+>/g);
    return _.map(matches, function (match) {
      return {
        inner: match.replace(/<[^>]+>(.*?)<\/[^>]+>/, '$1'),
        outer: match
      };
    });
  }
  function plugHTML(truncated, original) {
    return _.reduce(getHTMLArray(original), function (memo, obj) {
      return memo.replace(obj.inner, obj.outer);
    }, truncated);
  }
  //post allows for a post-max truncate vs a pre-max truncate (ie ...<max> vs <max>...)
  app.filter('truncate', function () {
    return function (value, wordwise, max, tail, post) {
      var lastspace, stripped, truncated;
      if (!value)
        return '';
      max = parseInt(max, 10);
      if (!max)
        return value;
      //strip html
      stripped = value.replace(/<[^>]+>(.*?)<\/[^>]+>/g, '$1');
      if (stripped.length <= max) {
        return value;
      }
      if (post === true) {
        truncated = stripped.slice(stripped.length - max, stripped.length);
        return (tail || '... ') + plugHTML(truncated, value);
      } else {
        truncated = stripped.slice(0, max);
        if (wordwise) {
          lastspace = truncated.lastIndexOf(' ');
          if (lastspace !== -1) {
            truncated = truncated.slice(0, lastspace);
          }
        }
        return plugHTML(truncated, value) + (tail || ' \u2026');
      }
    };
  });
  app.filter('truncateInt', function () {
    return function (integer, max) {
      if (integer >= max) {
        return parseFloat(integer / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
      } else {
        return integer;
      }
    };
  });
});