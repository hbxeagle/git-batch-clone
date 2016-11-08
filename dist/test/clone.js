"use strict";

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _assert = require("assert");

var _assert2 = _interopRequireDefault(_assert);

var _promisifyNode = require("promisify-node");

var _promisifyNode2 = _interopRequireDefault(_promisifyNode);

var _git = require("../utils/git.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var local = _path2.default.join.bind(_path2.default, __dirname);
var fse = (0, _promisifyNode2.default)(require("fs-extra"));

describe('Clone testing', function () {
  this.timeout(15000);

  var rootPath = process.cwd();
  var clonePath = "../../repos/clone";

  beforeEach(function () {
    return fse.remove(_path2.default.join(rootPath, clonePath)).catch(function (err) {
      console.log(err);
      throw err;
    });
  });

  it('目录下有 README.md 文件，克隆 git repo 成功。', function () {
    return (0, _git.doClone)('https://github.com/hbxeagle/git-batch-clone.git', clonePath, rootPath).then(function (data) {
      return fse.readFile(_path2.default.join(rootPath, clonePath, 'README.md'));
    }).then(function (data) {
      return (0, _assert2.default)(data != null, "File should exist.");
    });
  });
});