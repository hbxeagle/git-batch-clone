'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = clone;

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _promise = require('promise');

var _promise2 = _interopRequireDefault(_promise);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _deepAssign = require('deep-assign');

var _deepAssign2 = _interopRequireDefault(_deepAssign);

var _fs3 = require('../utils/fs.js');

var _fs4 = _interopRequireDefault(_fs3);

var _path = require('../utils/path.js');

var _path2 = _interopRequireDefault(_path);

var _git = require('../utils/git.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

global.decho = global.decho || console;

function doJob(repoName, repoPath, localBranch, remoteBranch, rBranch, dirname) {

  return new _promise2.default(function (resolve, reject) {

    if (repoName && repoPath) {
      if (_fs2.default.existsSync(repoPath)) {
        return (0, _git.doBranch)(repoPath).then(function (stdout) {
          global.decho.log(_chalk2.default.green('更新 '), '' + repoName);
          if (rBranch.test(stdout)) {
            return (0, _git.doPull)(repoName, repoPath).then(function () {
              resolve();
            });
          } else {
            global.decho.log(_chalk2.default.yellow('警告 '), repoName, '不是 ' + localBranch + ' 分支， 跳过更新。');
            resolve();
          }
        });
      } else {
        global.decho.log(_chalk2.default.green('克隆 '), '' + repoName);
        return (0, _git.doClone)(repoName, repoPath, dirname).then(function () {
          if (localBranch !== 'master') {
            global.decho.log(_chalk2.default.yellow('\u914D\u7F6E\u7684\u9ED8\u8BA4\u5206\u652F\u4E3A ' + localBranch + ' \u975E master \u5206\u652F\uFF0C\u9700\u8981\u68C0\u51FA'));
            global.decho.log(_chalk2.default.green('检出 '), repoName + ' \u5206\u652F\uFF1A' + localBranch + ' ' + remoteBranch);
            return (0, _git.doCheckout)(repoName, repoPath, remoteBranch, localBranch).then(function () {
              resolve();
            });
          } else {
            resolve();
          }
        });
      }
    } else {
      reject();
    }
  });
}

function clone(dirname, spaceInfo) {
  return new _promise2.default(function (resolve, reject) {
    var _spaceInfo = (0, _deepAssign2.default)({
      "global": {
        "git": {
          "branch": {
            "local": "master",
            "remote": ""
          },
          "hooks": []
        }
      }
    }, spaceInfo);

    var spaceGlobal = spaceInfo.global;
    var repos = spaceInfo.repos;

    if (repos && repos.length > 0) {
      _async2.default.eachSeries(repos, function (pj, callback) {
        if (pj) {
          var _ret = function () {
            var repoName = (pj.host || spaceGlobal.host).replace(/\/$/, '') + '\/' + pj.repo.replace(/\.git$/i, '') + ".git";
            var repoPath = _path2.default.join(dirname, pj.mapping || _path2.default.basename(pj.repo.replace(/\.git$/i, '') + '.git', '.git'));
            var localBranch = pj.branch && pj.branch.local ? pj.branch.local : spaceGlobal.branch.local;
            var remoteBranch = pj.branch && pj.branch.remote ? pj.branch.remote : spaceGlobal.branch.remote;
            var rBranch = new RegExp('\\*\\s' + localBranch + '\\b', 'm');

            return {
              v: doJob(repoName, repoPath, localBranch, remoteBranch, rBranch, dirname).then(function () {
                var gitConfigs = (0, _deepAssign2.default)(spaceGlobal.config, pj.config);
                return (0, _git.doConfigs)(gitConfigs, repoPath);
              }).then(function () {
                callback();
              }).catch(function (err) {
                reject(err);
                callback();
              })
            };
          }();

          if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
        } else {
          callback();
        }
      }, function () {
        global.decho.log(_chalk2.default.bgGreen.yellow('All Jobs Done...'));
        resolve();
      });
    } else {
      reject();
    }
  });
};