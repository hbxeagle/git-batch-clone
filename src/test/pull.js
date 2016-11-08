import path from "path";
import assert from 'assert'
import promisify from "promisify-node";

import { doPull } from '../utils/git.js';

const local = path.join.bind(path, __dirname);
const fse = promisify(require("fs-extra"));

describe('Clone testing', function() {
  this.timeout(15000);

  let rootPath = process.cwd();

  it('目录下有 README.md 文件，拉去 git repo 成功。', function() {
    return doPull(repoName, repoPath)
      .then(function(data) {
        return fse.readFile(path.join(repoPath, 'README.md'))
      })
      .then(function(data) {
        return assert(data != null, "File should exist.");
      });
  });
});