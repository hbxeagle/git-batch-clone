'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.doAddHooks = doAddHooks;
exports.doConfig = doConfig;
exports.doConfigs = doConfigs;
exports.doBranch = doBranch;
exports.doPull = doPull;
exports.doCheckout = doCheckout;
exports.doClone = doClone;

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _promise = require('promise');

var _promise2 = _interopRequireDefault(_promise);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

global.decho = global.decho || console;

function promiseChildProcessExec(command, options) {
  return new _promise2.default(function (resolve, reject) {
    _child_process2.default.exec(command, options, function (err, stdout, stderr) {
      if (err) {
        global.decho.log(_chalk2.default.red("ERR: "), err);
        reject(err);
      } else {
        resolve(stdout, stderr);
      }
    });
  });
}

function doAddHooks(hooks, repoPath) {
  // let promise = new Promise(function(resolve, reject){
  //   childProcess.exec('efes hook', {
  //     cwd: repoPath
  //   }, function(err, stdout) {
  //     if(err) {
  //       reject();
  //     } else {
  //       resolve();
  //     }
  //   });
  // });
  // return promise;
}

function doConfig(key, value, repoPath) {
  global.decho.log(_chalk2.default.gray('配置 '), key + ' -> ' + value);
  return promiseChildProcessExec('git config ' + key + ' "' + value + '"', { cwd: repoPath });
}

function doConfigs(gitConfigs, repoPath) {
  return new _promise2.default(function (resolve, reject) {
    if (gitConfigs) {
      // git config 操作是读写 .git/config 文件，读写时会先锁定文件，所以需要同步执行。
      _async2.default.eachOfSeries(gitConfigs, function (value, key, callback) {
        try {
          doConfig(key, value, repoPath).then(callback);
        } catch (e) {
          reject(e);
          callback();
        }
      }, function () {
        resolve();
      });
    } else {
      resolve();
    }
  });
};

function doBranch(repoPath) {
  return promiseChildProcessExec('git branch', { cwd: repoPath });
}

function doPull(repoName, repoPath) {
  return promiseChildProcessExec('git pull', {
    cwd: repoPath,
    stdio: 'inherit'
  });
}

function doCheckout(repoName, repoPath, remoteBranch, localBranch) {
  return promiseChildProcessExec('git checkout -b ' + localBranch + ' ' + remoteBranch, {
    cwd: repoPath,
    stdio: 'inherit'
  });
}

function doClone(repoName, repoPath, rootPath) {
  return new _promise2.default(function (resolve, reject) {
    var _clone = _child_process2.default.spawn('git', ['clone', repoName, repoPath], {
      cwd: rootPath,
      stdio: 'inherit'
    });
    _clone.on('close', function (code) {
      resolve(code);
    });
  });
}