import async from 'async'
import Promise from 'promise'
import chalk from 'chalk'
import fs from 'fs'
import childProcess from 'child_process'
import assign from 'deep-assign'

import fsp from '../utils/fs.js'
import path from '../utils/path.js'
import { doClone, doPull, doConfigs, doBranch, doCheckout, doAddHooks } from '../utils/git.js'

global.decho = global.decho || console;

function doJob(repoName, repoPath, localBranch, remoteBranch, rBranch, dirname) {

  return new Promise(function(resolve, reject) {

    if (repoName && repoPath) {
      if (fs.existsSync(repoPath)) {
        return doBranch(repoPath)
        .then(function(stdout){
          global.decho.log(chalk.green('更新 '), `${repoName}`);
          if (rBranch.test(stdout)) {
            return doPull(repoName, repoPath).then(function(){
              resolve();
            });
          } else {
            global.decho.log(chalk.yellow('警告 '), repoName, '不是 ' + localBranch + ' 分支， 跳过更新。');
            resolve();
          }
        });
      } else {
        global.decho.log(chalk.green('克隆 '), `${repoName}`);
        return doClone(repoName, repoPath, dirname)
        .then(function(){
          if (localBranch !== 'master') {
            global.decho.log(chalk.yellow(`配置的默认分支为 ${localBranch} 非 master 分支，需要检出`));
            global.decho.log(chalk.green('检出 '), `${repoName} 分支：${localBranch} ${remoteBranch}`);
            return doCheckout(repoName, repoPath, remoteBranch, localBranch).then(function(){
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

export default function clone(dirname, spaceInfo) {
  return new Promise(function(resolve, reject){
    let _spaceInfo = assign({
      "global": {
        "git": {
          "branch": {
            "local": "master",
            "remote": ""
          },
          "hooks":[]
        }
      }
    }, spaceInfo);

    let spaceGlobal = spaceInfo.global;
    let repos = spaceInfo.repos;

    if (repos && repos.length > 0) {
      async.eachSeries(repos, function(pj, callback) {
        if(pj) {
          let repoName = (pj.host || spaceGlobal.host).replace(/\/$/,'') + '\/' + pj.repo.replace(/\.git$/i,'') + ".git";
          let repoPath = path.join(dirname, pj.mapping || path.basename(pj.repo.replace(/\.git$/i,'') + '.git', '.git'));
          let localBranch = pj.branch && pj.branch.local ? pj.branch.local : spaceGlobal.branch.local;
          let remoteBranch = pj.branch && pj.branch.remote ? pj.branch.remote : spaceGlobal.branch.remote;
          let rBranch = new RegExp('\\*\\s' + localBranch + '\\b', 'm');

          return doJob(repoName, repoPath, localBranch, remoteBranch, rBranch, dirname)
            .then(function() {
              let gitConfigs = assign(spaceGlobal.config, pj.config);
              return doConfigs(gitConfigs, repoPath);
            }).then(function(){
              callback();
            }).catch(function(err){
              reject(err);
              callback();
            });
        } else {
          callback();
        }
      }, function(){
        global.decho.log(chalk.bgGreen.yellow('All Jobs Done...'));
        resolve();
      });
    } else {
      reject();
    }
  });
};


