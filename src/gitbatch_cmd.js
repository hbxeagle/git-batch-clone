import program from 'commander'
import run from './commands/run'

import pkg from '../package.json';

program
  .version(pkg.version)
  .option('-c, --config [value]','the configfile')
  .description('start clone and config git repos')
  .parse(process.argv);

  run(program);