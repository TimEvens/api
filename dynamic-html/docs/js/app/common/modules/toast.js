/* -----
 * Apollo Toast Module
 * Renders a notification bubble/popup used to alert the user that some activity has occurred
 * Uses gritter (http://boedesign.com/blog/2009/07/11/growl-for-jquery-gritter/) for toast popups
 */
define([
  'angular',
  'jquery-gritter'
], function (angular) {
  angular.module('apollo.toast', []).factory('$toast', [
    '$sanitize',
    '$registry',
    function ($sanitize, $registry) {
      $.extend($.gritter.options, {
        position: 'bottom-right',
        fade_in_speed: 'medium',
        fade_out_speed: 2000,
        time: 4000
      });
      var icons = {
          'info': 'img/info48.png',
          'error': 'img/error48.png',
          'warn': 'img/warn48.png',
          'success': 'img/success48.png'
        };
      return {
        post: function (options) {
          var ico = options.severity ? icons[options.severity] : icons.info;
          return $.gritter.add({
            title: options.title || '',
            text: $sanitize(options.msg),
            sticky: options.sticky || false,
            image: $registry.byId('hub').baseUrl + '/' + ico
          });
        },
        remove: function (id, options) {
          options = options || {};
          $.gritter.remove(id, {
            fade: options.fade || true,
            speed: options.speed || 'fast'
          });
        },
        setTitle: function (id, title) {
          $('#gritter-item-' + id + ' .gritter-item .gritter-with-image span.gritter-title').html('<span>' + title + '</span>');
        },
        setMsg: function (id, msg) {
          $('#gritter-item-' + id + ' .gritter-item .gritter-with-image p').html('<p>' + msg + '</p>');
        },
        setImg: function (id, url) {
          $('#gritter-item-' + id + ' .gritter-item img.gritter-image').src(url);
        }
      };
    }
  ]);
});