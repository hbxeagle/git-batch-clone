import async from 'async'
import Promise from 'promise'
import chalk from 'chalk'
import childProcess from 'child_process'

global.decho = global.decho || console;

function promiseChildProcessExec(command, options) {
  return new Promise(function(resolve, reject){
    childProcess.exec(command, options, function(err, stdout, stderr) {
      if(err) {
        global.decho.log(chalk.red("ERR: "), err);
        reject(err);
      } else {
        resolve(stdout, stderr);
      }
    });
  });
}

export function doAddHooks(hooks, repoPath) {
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

export function doConfig(key, value, repoPath) {
  global.decho.log(chalk.gray('配置 '), `${key} -> ${value}`);
  return promiseChildProcessExec(`git config ${key} "${value}"`, { cwd: repoPath });
}

export function doConfigs(gitConfigs, repoPath) {
  return new Promise(function(resolve, reject){
    if (gitConfigs) {
      // git config 操作是读写 .git/config 文件，读写时会先锁定文件，所以需要同步执行。
      async.eachOfSeries(gitConfigs, function(value, key, callback) {
        try{
          doConfig(key, value, repoPath).then(callback);
        } catch(e) {
          reject(e);
          callback();
        }
      },function(){
        resolve();
      });
    } else {
      resolve();
    }
  });
};

export function doBranch(repoPath) {
  return promiseChildProcessExec('git branch', { cwd: repoPath });
}

export function doPull(repoName, repoPath) {
  return promiseChildProcessExec('git pull', {
    cwd: repoPath,
    stdio: 'inherit'
  });
}

export function doCheckout(repoName, repoPath, remoteBranch, localBranch) {
  return promiseChildProcessExec(`git checkout -b ${localBranch} ${remoteBranch}`, {
    cwd: repoPath,
    stdio: 'inherit'
  });
}

export function doClone(repoName, repoPath, rootPath) {
  return new Promise(function(resolve, reject){
    let _clone = childProcess.spawn(`git`, ['clone', repoName, repoPath], {
      cwd: rootPath,
      stdio: 'inherit'
    });
    _clone.on('close', function(code) {
      resolve(code);
    });
  });
}


