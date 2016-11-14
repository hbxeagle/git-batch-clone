import program from 'commander'
import run from './commands/run'

import pkg from '../package.json';

program
  .version(pkg.version)
  .option('-c, --config [value]','the configfile')
  // .option('-f, --force','If you can, forced to switch to the configuration of the Branch and pull')
  .description('start clone and config git repos')
  .parse(process.argv);

  run(program);