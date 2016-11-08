import path from "path";
import assert from 'assert'
import promisify from "promisify-node";

import { doClone } from '../utils/git.js';

const local = path.join.bind(path, __dirname);
const fse = promisify(require("fs-extra"));

describe('Clone testing', function() {
  this.timeout(15000);

  let rootPath = process.cwd();
  let clonePath = "../../repos/clone";

  beforeEach(function() {
    return fse.remove(path.join(rootPath, clonePath)).catch(function(err) {
      console.log(err);
      throw err;
    });
  });

  it('目录下有 README.md 文件，克隆 git repo 成功。', function() {
    return doClone('https://github.com/hbxeagle/git-batch-clone.git', clonePath, rootPath)
      .then(function(data) {
        return fse.readFile(path.join(rootPath, clonePath,'README.md'))
      })
      .then(function(data) {
        return assert(data != null, "File should exist.");
      });
  });
});