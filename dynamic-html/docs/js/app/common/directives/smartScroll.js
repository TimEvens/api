define(['appModule'], function (app) {
  app.directive('smartScroll', function () {
    return {
      restrict: 'A',
      link: function ($scope, el) {
        el.perfectScrollbar({ suppressScrollX: true }).one('mouseenter', function () {
          el.perfectScrollbar('update');
        });
      }
    };
  });
});  // Keep for now - this is the fading effect we will use on our scrolling lists (using perfect-scrollbar)
     // '<div style="z-index:30;position:absolute;bottom:0;right:0;background: -moz-linear-gradient(top,rgba(255,255,255,0) 0%,rgba(255,255,255,0.7) 100%);height:300px; width:100%;pointer-events:none;"></div>'+
