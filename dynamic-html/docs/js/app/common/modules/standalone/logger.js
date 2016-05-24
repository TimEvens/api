define(['angular'], function (angular) {
  angular.module('apollo.logger', []).factory('$logger', function () {
    var winston = require('winston'), moment = require('moment'), path = require('path'), fs = require('fs-extra'), _ = require('underscore-node'), BPromise = require('bluebird'), sasaUtils = require('./sasaUtils'), dirPath = path.join(sasaUtils.getSASADir(), 'logs');
    var MAX_DIRECTORY_SIZE = 104857600;
    // 100MB
    /**
             * Will create logging files such as:
             * debug.log.YYYY-MM-DD.(#1-5)
             * exceptions.log.YYYY-MM-DD.(#1-5)
             */
    var logger = new winston.Logger({
        exitOnError: false,
        transports: [
          new winston.transports.DailyRotateFile({
            filename: path.join(dirPath, 'debug.log'),
            level: 'debug',
            colorize: true,
            maxsize: 5242880,
            maxFiles: 5,
            json: true,
            prettyPrint: true
          }),
          new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            colorize: true
          })
        ],
        exceptionHandlers: [new winston.transports.DailyRotateFile({
            filename: path.join(dirPath, 'exceptions.log'),
            colorize: true,
            maxsize: 5242880,
            maxFiles: 5,
            json: true,
            prettyPrint: true
          })]
      });
    /**
             * Check logs directory size to decide if old files need to be deleted
             */
    function _checkDir() {
      _readDir().then(function (dir) {
        if (dir.size > MAX_DIRECTORY_SIZE && dir.files && dir.files.length > 1) {
          return _retrieveOldFiles(dir.files);
        }
      }).then(function (files) {
        if (files && files.length >= 1) {
          _removeOldFiles(_.sortBy(files));
        }
      }).catch(function (err) {
        _log('Error checking directory : ' + err, 'DEBUG');
      });
    }
    /**
            * Retrieve the files and size of the logs directory
            */
    function _readDir() {
      var dir = {
          size: 0,
          files: []
        };
      return BPromise.resolve().then(function () {
        return _getFiles(dirPath);
      }).then(function (files) {
        dir.files = files;
        return BPromise.all(_.map(files, function (file) {
          return _fileSize(dirPath, file).then(function (s) {
            dir.size += s;
          });
        }));
      }).then(function () {
        return dir;
      }).catch(function (err) {
        _log('Error reading directory : ' + err, 'DEBUG');
      });
    }
    /**
            * Return the files from the directory
            * @param dir Directory string where files reside
            */
    function _getFiles(dir) {
      return new BPromise(function (resolve) {
        fs.readdir(dir, function (err, files) {
          resolve(files);
        });
      });
    }
    /**
            * Get the size of the file
            * @param dir Directory string where file resides
            * @param file File name as string
            */
    function _fileSize(dir, file) {
      return new BPromise(function (resolve) {
        fs.lstat(path.join(dir, file), function (err, stats) {
          resolve(stats.isFile() ? parseInt(stats.size) : 0);
        });
      });
    }
    /**
             * Return array of log files with parsed dates before today's
             * @param files Array of files to be parsed
             */
    function _retrieveOldFiles(files) {
      var today = moment().format('YYYY-MM-DD');
      return BPromise.resolve().then(function () {
        return _.map(files, function (file) {
          if (moment(file.split('.')[2], 'YYYY-MM-DD').isBefore(today)) {
            return file;
          }
        }).filter(function (x) {
          return typeof x !== 'undefined';
        });
      });
    }
    /**
             * Remove old log files until directory size is less than max size
             * @param files Array of files to be removed
             */
    function _removeOldFiles(files) {
      fs.remove(path.join(dirPath, files[0]), function (err) {
        if (err) {
          _log(err, 'WARN');
        } else {
          _log('Removed ' + path.join(dirPath, files[0]));
          _checkDir();
        }
      });
    }
    /**
             *  Log message to log file and console
             *  @param message String to represent the message to be logged
             *  @param level String to represent the level of the meesage
             *  @param file Boolean for whether to log message to logging file
             */
    function _log(message, level, file) {
      level = level ? level.toLowerCase() : 'info';
      if (_.isObject(message) || _.isArray(message)) {
        console.dir(level + ': ' + message);
      } else {
        console.log(level + ': ' + message);
      }
      if (typeof file === 'undefined' || file && file === true) {
        logger.log(level, message);
      }
    }
    return {
      log: _log,
      checkDir: _checkDir,
      info: function (message, file) {
        _log(message, 'INFO', file);
      },
      debug: function (message, file) {
        _log(message, 'DEBUG', file);
      },
      warn: function (message, file) {
        _log(message, 'WARN', file);
      },
      error: function (message, file) {
        _log(message, 'ERROR', file);
      },
      verbose: function (message, file) {
        _log(message, 'VERBOSE', file);
      }
    };
  });
});