import fsp from '../utils/fs.js'
import path from '../utils/path.js'
import clone from '../core/clone.js'

// let stream = process.stdout;
// let loadding = ['|', '/', '-', '\\'];
// let _i = 0;
// if (stream && stream.cursorTo) {
//   stream.cursorTo(0);
//   stream.write(loadding[_i]);
//   stream.cursorTo(0);
//   _i++;
//   _i = _i % loadding.length;
// }
// global.timer = setInterval(function () {
//   if (stream && stream.cursorTo) {
//     stream.cursorTo(0);
//     stream.write(loadding[_i]);
//     stream.cursorTo(0);
//     _i++;
//     _i = _i % loadding.length;
//   }
// }, 50);

export default function (options) {
  console.log('正在开始 克隆/更新 git repos...');

  let dirname = process.cwd();
  let configfile = options.config || 'configfile.json';
  let spaceInfo = fsp.readJSONSync(path.join(dirname, configfile));
  clone(dirname, spaceInfo);
}