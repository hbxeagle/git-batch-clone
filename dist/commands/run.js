'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (options) {
  console.log('正在开始 克隆/更新 git repos...');

  var dirname = process.cwd();
  var configfile = options.config || 'configfile.json';
  var spaceInfo = _fs2.default.readJSONSync(_path2.default.join(dirname, configfile));
  (0, _clone2.default)(dirname, spaceInfo);
};

var _fs = require('../utils/fs.js');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('../utils/path.js');

var _path2 = _interopRequireDefault(_path);

var _clone = require('../core/clone.js');

var _clone2 = _interopRequireDefault(_clone);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }