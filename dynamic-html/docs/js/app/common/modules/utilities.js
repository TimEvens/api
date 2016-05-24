define([
  'angular',
  'underscore'
], function (angular, _) {
  angular.module('apollo.utilities', []).factory('$utilities', [
    '$window',
    '$log',
    '$modal',
    '$q',
    '$rootScope',
    '$timeout',
    '$http',
    function ($window, $log, $modal, $q, $rootScope, $timeout, $http) {
      var anchorEl = document.createElement('a');
      var thePlatform = null;
      function html5FileDownload(content, filename) {
        var deferred = $q.defer();
        anchorEl.setAttribute('href', this.encodeDataURI(content));
        anchorEl.setAttribute('download', filename);
        anchorEl.setAttribute('target', '_blank');
        this.fakeClick(anchorEl);
        deferred.resolve();
        return deferred.promise;
      }
      function modalFileDownload(content, filename) {
        var self = this;
        // Safari won't let us set a filename for a file if it's auto-downloaded, so
        // display a modal that lets the user bring up the native "Save As" dialog
        return $modal.open({
          controller: [
            '$scope',
            function ($scope) {
              $scope.downloadContent = content;
              $scope.encodeData = function (content) {
                return self.encodeDataURI(content);
              };
            }
          ],
          template: [
            '<div>',
            '<div class="modal-header">',
            '<button type="button" class="close" ng-click="$close()" aria-hidden="true"><span class="icon-close"></span></button>',
            '<h4 class="modal-title" ng-bind="\'_DownloadFile_\' | i18n"></h4>',
            '</div>',
            '<div class="modal-body">',
            '<p ng-bind="\'_CommonDownloadFileInstructions_\' | i18n"></p>',
            '<br />',
            '<a href="{{ encodeData(downloadContent) }}" target="_blank">' + filename + '</a>',
            '</div>',
            '<div class="modal-footer">',
            '<button type="button" class="bttn" ng-click="$close();" ng-bind="\'_Close_\' | i18n"></button>',
            '</div>',
            '</div>'
          ].join('')
        }).result;
      }
      function msSaveBlobFileDownload(content, filename) {
        var deferred = $q.defer();
        $window.navigator.msSaveBlob(new Blob([content]), filename);
        deferred.resolve();
        return deferred.promise;
      }
      //If filepath is passed in, use that with associated filename. Otherwise use one of the standard paths with the filename.
      function nativeFileDownload(content, filename, filePath) {
        var fs = require('fs');
        var path = require('path');
        var sasaUtils = require('./sasaUtils');
        var deferred = $q.defer();
        var $saveDialog, extension;
        filePath = !_.isUndefined(filePath) ? path.join(filePath, filename) : path.join(sasaUtils.getSASADir(), filename);
        extension = path.extname(filename);
        $saveDialog = $('<input type="file" nwsaveas="' + filePath + '" />');
        if (extension) {
          $saveDialog.attr('accept', extension);
        }
        $saveDialog.on('change', function (event) {
          fs.writeFile(event.target.value, content, function (err) {
            if (err) {
              $log.error(err.message);
              return deferred.reject(err);
            }
            deferred.resolve(event);
          });
        });
        $saveDialog.click();
        return deferred.promise;
      }
      function getPlatform() {
        //This function is used to find the platform for standalone, return null if called from WEB version
        //In standalone returns 'win', 'mac' or 'linux'
        if (!process) {
          return null;
        }
        if (_.isNull(thePlatform)) {
          thePlatform = /^win/.test(process.platform) ? 'win' : /^darwin/.test(process.platform) ? 'mac' : 'linux';
        }
        return thePlatform;
      }
      function getOSVersion() {
        var unknown = '-', nAgt = $window.navigator.userAgent || $window.navigator.vendor || $window.opera, nVer = $window.navigator.appVersion, os = unknown, osVersion = unknown, clientStrings = [
            {
              s: 'Windows 10',
              r: /(Windows 10.0|Windows NT 10.0)/
            },
            {
              s: 'Windows 8.1',
              r: /(Windows 8.1|Windows NT 6.3)/
            },
            {
              s: 'Windows 8',
              r: /(Windows 8|Windows NT 6.2)/
            },
            {
              s: 'Windows 7',
              r: /(Windows 7|Windows NT 6.1)/
            },
            {
              s: 'Windows Vista',
              r: /Windows NT 6.0/
            },
            {
              s: 'Windows Server 2003',
              r: /Windows NT 5.2/
            },
            {
              s: 'Windows XP',
              r: /(Windows NT 5.1|Windows XP)/
            },
            {
              s: 'Windows 2000',
              r: /(Windows NT 5.0|Windows 2000)/
            },
            {
              s: 'Windows ME',
              r: /(Win 9x 4.90|Windows ME)/
            },
            {
              s: 'Windows 98',
              r: /(Windows 98|Win98)/
            },
            {
              s: 'Windows 95',
              r: /(Windows 95|Win95|Windows_95)/
            },
            {
              s: 'Windows NT 4.0',
              r: /(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/
            },
            {
              s: 'Windows CE',
              r: /Windows CE/
            },
            {
              s: 'Windows 3.11',
              r: /Win16/
            },
            {
              s: 'Android',
              r: /Android/
            },
            {
              s: 'Open BSD',
              r: /OpenBSD/
            },
            {
              s: 'Sun OS',
              r: /SunOS/
            },
            {
              s: 'Linux',
              r: /(Linux|X11)/
            },
            {
              s: 'iOS',
              r: /(iPhone|iPad|iPod)/
            },
            {
              s: 'Mac OS X',
              r: /Mac OS X/
            },
            {
              s: 'Mac OS',
              r: /(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/
            },
            {
              s: 'QNX',
              r: /QNX/
            },
            {
              s: 'UNIX',
              r: /UNIX/
            },
            {
              s: 'BeOS',
              r: /BeOS/
            },
            {
              s: 'OS/2',
              r: /OS\/2/
            },
            {
              s: 'Search Bot',
              r: /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/
            }
          ];
        for (var id in clientStrings) {
          var cs = clientStrings[id];
          if (cs.r.test(nAgt)) {
            os = cs.s;
            break;
          }
        }
        if (/Windows/.test(os)) {
          osVersion = /Windows (.*)/.exec(os)[1];
          os = 'Windows';
        }
        switch (os) {
        case 'Mac OS X':
          osVersion = /Mac OS X (10[\.\_\d]+)/.exec(nAgt)[1];
          break;
        case 'Android':
          osVersion = /Android ([\.\_\d]+)/.exec(nAgt)[1];
          break;
        case 'iOS':
          osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(nVer);
          osVersion = osVersion[1] + '.' + osVersion[2] + '.' + (osVersion[3] | 0);
          break;
        }
        return os + ' ' + osVersion;
      }
      return {
        REGEX_SERIAL_NUMBER: /^[0-9a-zA-Z-]{3,}$/,
        REGEX_SERIAL_NUMBER_LIST: /^(([0-9a-zA-Z-][0-9a-zA-Z-]{2,})([,\s\n\r\t;:|~]+[0-9a-zA-Z-][0-9a-zA-Z-]{2,})*)$/,
        REGEX_DEVICE_NAME: /^[0-9a-zA-Z-_,.~+=:;? ]+$/,
        REGEX_TAG: /^[a-zA-Z0-9/_-\s!@#$%^&*()+{}[\]\\/:;'<>.?~]+$/,
        REGEX_ASSET_TAG: /^[^|]+$/,
        REGEX_IP_ADDRESS: /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
        REGEX_IPV6_ADDRESS: /^\s*(?!::\s*$)((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/,
        REGEX_MAC_ADDRESS: /^([0-9A-F]{2}[:-]?){5}([0-9A-F]{2})$/,
        REGEX_HOSTNAME: /^(([a-zA-Z0-9_]|[a-zA-Z0-9_][a-zA-Z0-9\-_]*[a-zA-Z0-9_])\.)*([A-Za-z0-9_]|[A-Za-z0-9_][A-Za-z0-9\-_]*[A-Za-z0-9_])$/,
        REGEX_FQDN: /(?=^.{4,253}$)(^((?!-)[a-zA-Z0-9-]{0,62}[a-zA-Z0-9]\.)+[a-zA-Z]{2,63}$)/,
        REGEX_EMAIL: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
        REGEX_URL_PROTOCOL: /^(https?|socks5?):\/\//i,
        getCombinedRegex: function (keys) {
          return RegExp(_.chain(this).pick(keys).filter(_.isRegExp).map('source').value().join('|'));
        },
        toProperCase: function (str) {
          return str.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
          });
        },
        absUrl: function (url) {
          return $window.location.href.split('/').slice(0, -1).join('/') + '/' + url;
        },
        downloadFile: function () {
          // Figure out the appropriate way to handle each browser's save abilities.
          // For standalone, use nw.js's native file save window
          if (this.isStandalone) {
            return nativeFileDownload.apply(this, arguments);  // For IE, use its custom blob saving abilities
          } else if ($window.navigator.msSaveBlob) {
            return msSaveBlobFileDownload.apply(this, arguments);  // For browsers like Chrome and Firefox, use the HTML5 Download attribute
          } else if (!_.isUndefined(anchorEl.download)) {
            return html5FileDownload.apply(this, arguments);  // Default is to use a modal window and tell the user to save as.
          } else {
            return modalFileDownload.apply(this, arguments);
          }
        },
        cryptoJSDecrypt: function (password, items) {
          // Decrypt items in an object
          return _.mapValues(items, function (itemValue) {
            return itemValue ? CryptoJS.AES.decrypt(itemValue, password).toString(CryptoJS.enc.Utf8) : '';
          });
        },
        cryptoJSEncrypt: function (password, items) {
          // Encrypt items in an object
          return _.mapValues(items, function (itemValue) {
            return itemValue ? CryptoJS.AES.encrypt(itemValue, password).toString() : '';
          });
        },
        cryptoJSReEncrypt: function (newPassword, oldPassword, items) {
          // ReEncrypt items in an object
          return _.mapValues(items, function (itemValue) {
            if (itemValue) {
              itemValue = CryptoJS.AES.decrypt(itemValue, oldPassword).toString(CryptoJS.enc.Utf8);
              return CryptoJS.AES.encrypt(itemValue, newPassword).toString();
            } else {
              return '';
            }
          });
        },
        encodeBase64: function (data) {
          data = data || '';
          if (data && $window.btoa && $window.unescape && $window.encodeURIComponent) {
            return $window.btoa($window.unescape($window.encodeURIComponent(data)));
          }
          return '';
        },
        encodeDataURI: function (data) {
          return 'data:text/plain;charset=utf-8;base64,' + this.encodeBase64(data);
        },
        fakeClick: function (el) {
          var event;
          if (document.createEvent) {
            event = document.createEvent('MouseEvents');
            event.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            el.dispatchEvent(event);
          } else {
            $log.log('ERROR: can\'t create MouseEvent');
          }
        },
        getDeep: function (obj, keys) {
          return _.reduce(keys.split('.'), function (memo, key) {
            return _.result(memo, key);
          }, obj);
        },
        setDeep: function (obj, keys, value) {
          keys = keys.split('.');
          var finalObj = _.reduce(_.initial(keys), function (memo, key) {
              var tmp = memo[key];
              if (!tmp) {
                tmp = memo[key] = {};
              }
              return tmp;
            }, obj);
          finalObj[_.last(keys)] = value;
        },
        isStandalone: function () {
          var isStandalone = false;
          if (typeof process !== 'undefined') {
            try {
              isStandalone = typeof require('nw.gui') !== 'undefined';
            } catch (e) {
            }
          }
          return isStandalone;
        }(),
        isMobile: function () {
          var userAgent = $window.navigator.userAgent || $window.navigator.vendor || $window.opera;
          return /android|(bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(userAgent.substr(0, 4));
        },
        getPlatform: function () {
          return getPlatform();
        },
        getOSVersion: function () {
          return getOSVersion();
        },
        isPlatformLinux: function () {
          return getPlatform() === 'linux';
        },
        isPlatformMac: function () {
          return getPlatform() === 'mac';
        },
        isPlatformWindows: function () {
          return getPlatform() === 'win';
        },
        fetchMobileFeatures: function () {
          var deferred = $q.defer();
          if (window.ctsapp) {
            var result = window.ctsapp.features();
            result = result ? JSON.parse(result) : { scanner: false };
            deferred.resolve(result);
          } else {
            $http.get('https://ctsapp.cisco.com/features').then(function (result) {
              deferred.resolve(result && result.data ? result.data : '');
            }, function () {
              $.ajax({
                url: 'ctsapp://features',
                dataType: 'json',
                contentType: 'application/json',
                success: function (result) {
                  deferred.resolve(result);
                },
                error: function () {
                  deferred.reject();
                }
              });
            });
          }
          return deferred.promise;
        },
        doMobileBarcodeScan: function () {
          var deferred = $q.defer();
          if (window.ctsapp) {
            var result = window.ctsapp.scanBarcode();
            result = result ? JSON.parse(result) : '';
            deferred.resolve(result);
          } else {
            $http.get('https://ctsapp.cisco.com/scanBarcode').then(function (result) {
              deferred.resolve(result && result.data ? result.data : '');
            }, function () {
              $.ajax({
                url: 'ctsapp://scanBarcode',
                dataType: 'json',
                contentType: 'application/json',
                success: function (result) {
                  deferred.resolve(result);
                },
                error: function () {
                  deferred.reject();
                }
              });
            });
          }
          return deferred.promise;
        },
        lineWrap: function (message, lineLength) {
          var spaceLeft = lineLength;
          var spaceLength = 1;
          return message.split(' ').map(function (word) {
            if (word.length + spaceLength > spaceLeft) {
              spaceLeft = lineLength - word.length;
              return '\n' + word;
            }
            spaceLeft -= word.length + spaceLength;
            return word;
          }).join(' ');
        },
        loadModules: function (modules) {
          if (!_.isArray(modules)) {
            $log.error('loadModules() : modules must be an array');
            return null;
          }
          var deferred = $q.defer();
          function safeDigest() {
            if (!$rootScope.$$phase) {
              $rootScope.$digest();
            }
          }
          require(modules, function () {
            deferred.resolve();
            safeDigest();
          }, function (err) {
            $log.error(err);
            deferred.resolve();
            safeDigest();
          });
          return deferred.promise;
        },
        safeApply: function (expr) {
          if (!$rootScope.$$phase) {
            $rootScope.$apply(expr);
          } else if (_.isFunction(expr)) {
            $timeout(expr);
          } else if (_.isString(expr)) {
            // You can pass an expression to $apply, so deal with that situation
            $rootScope.$eval(expr);
          }
        },
        uuid4: function () {
          var time = Date.now();
          return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (char) {
            var remainder = (time + 16 * Math.random()) % 16 | 0;
            time = Math.floor(time / 16);
            return (char === 'x' ? remainder : remainder & 7 | 8).toString(16);
          });
        },
        getFileTypes: function () {
          return [
            {
              name: 'archive',
              icon: 'icon-file-archive-o',
              extensions: [
                'tar',
                'jar',
                'cpio',
                'zip',
                'zipx',
                'iso',
                'ar',
                'gz',
                'gzip',
                'bz2',
                'apk',
                'car',
                'cab',
                'dmg',
                'rar',
                'z',
                'Z'
              ]
            },
            {
              name: 'audio',
              icon: 'icon-file-audio-o',
              extensions: [
                'au',
                'aac',
                'm4p',
                'm4a',
                'mp1',
                'mp2',
                'mp3',
                'mpg',
                'mpeg',
                'oga',
                'ogg',
                'wav',
                'webm',
                'wma'
              ]
            },
            {
              name: 'code',
              icon: 'icon-file-code-o',
              extensions: [
                'js',
                'css',
                'asp',
                'aspx',
                'jsp',
                'htm',
                'html',
                'php',
                'pl',
                'asm',
                'java',
                'lib',
                'o',
                'scpt',
                'vbs',
                'cc',
                'sql'
              ]
            },
            {
              name: 'image',
              icon: 'icon-file-image-o',
              extensions: [
                'jpg',
                'jpeg',
                'tif',
                'tiff',
                'png',
                'gif',
                'bmp',
                'ico',
                'icon',
                'pic'
              ]
            },
            {
              name: 'ms-word',
              icon: 'icon-file-word-o',
              extensions: [
                'doc',
                'dot',
                'docx',
                'docm',
                'dotm'
              ]
            },
            {
              name: 'ms-excel',
              icon: 'icon-file-excel-o',
              extensions: [
                'xls',
                'xlt',
                'xla',
                'xlsx',
                'xltx',
                'xlsm',
                'xltm',
                'xlam',
                'xlsb'
              ]
            },
            {
              name: 'ms-powerpoint',
              icon: 'icon-file-powerpoint-o',
              extensions: [
                'ppt',
                'pot',
                'pps',
                'ppa',
                'pptx',
                'potx',
                'ppsx',
                'ppam',
                'pptm',
                'potm',
                'ppsm'
              ]
            },
            {
              name: 'pdf',
              icon: 'icon-file-pdf-o',
              extensions: ['pdf']
            },
            {
              name: 'text',
              icon: 'icon-file-text-o',
              extensions: [
                'txt',
                'text',
                'tex',
                'log',
                'cfg',
                'csv'
              ]
            },
            {
              name: 'video',
              icon: 'icon-file-video-o',
              extensions: [
                'mp4',
                'm4v',
                'mov',
                'flv',
                'm3u8',
                'ts',
                '3gp',
                'avi',
                'wmv'
              ]
            }
          ];
        }
      };
    }
  ]);
});