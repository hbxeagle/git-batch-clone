'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _path = require('./path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.findFileSync = function (filename, start, stop) {
  start = _path2.default.resolve(start);
  stop = stop && _path2.default.resolve(stop) || '';
  var result;
  while (!/^(?:[a-z]:)?$/i.test(start) && start.indexOf(stop) === 0) {
    if (_fs2.default.existsSync(result = start + '/' + filename) && _fs2.default.statSync(result).isFile()) {
      return result;
    }
    start = start.replace(/\/[^\/]+$/, '');
  }
};

exports.writeFileSync = function (filename, filedata) {
  if (!_fs2.default.existsSync(_path2.default.dirname(filename))) {
    var segments = filename.split('/');
    var segment = segments.shift() + '/' + segments.shift();
    while (segments.length) {
      if (!_fs2.default.existsSync(segment)) {
        _fs2.default.mkdirSync(segment);
      }
      segment += '/' + segments.shift();
    }
  }
  _fs2.default.writeFileSync(filename, filedata);
};

exports.readFileSync = function (filename, buffer) {
  return _fs2.default.readFileSync(filename, !buffer && {
    encoding: 'utf8'
  });
};

exports.readJSONSync = function (filename) {
  var filedata = void 0,
      data = void 0;
  try {
    filedata = _fs2.default.readFileSync(filename);
    if (filedata) {
      data = JSON.parse(filedata);
    }
  } catch (e) {
    return null;
  }
  return data;
};

exports.writeJSONSync = function (filename, filedata) {
  _fs2.default.writeFileSync(filename, JSON.stringify(filedata, null, 2));
};

exports.readFileCommit = function (filename, commit, callback, buffer) {
  commit.getEntry(filename, function (err, entry) {
    if (err || !entry.isFile()) {
      callback(filename + ' doesn\'t exist');
    } else {
      entry.getBlob(function (err, blob) {
        if (err) {
          callback(err);
        } else {
          callback(null, buffer ? blob.content() : blob.toString());
        }
      });
    }
  });
};