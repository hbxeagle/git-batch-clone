'use strict';

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _run = require('./commands/run');

var _run2 = _interopRequireDefault(_run);

var _package = require('../package.json');

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_commander2.default.version(_package2.default.version).option('-c, --config [value]', 'the configfile').description('start clone and config git repos').parse(process.argv);

(0, _run2.default)(_commander2.default);