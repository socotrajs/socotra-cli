import Config from './Config';
import LoggerStack from './LoggerStack';

import { debugInitMsg } from './tessaurus';

type filePaths = ReadonlyArray<string> | string;

const log = new LoggerStack('socotra');

const loadConfig = (root?: filePaths, configFile?: filePaths ): object => {
  const config = new Config(
    root ? [root] : [],
    configFile ? [configFile] : []
  );
  return config.load();
};

const { name } = require('../package.json');
log(log.DEBUG, debugInitMsg());
require('yargs')
  .usage(`${name} <command> [args]`)
  .command(require('./commands/watch.js').default)
  .command(require('./commands/build.js').default)
  .config(loadConfig(process.cwd()))
  .option('debug', {
    default: false,
    type: 'boolean',
    describe: 'Show debug information'
  })
  .option('config', {
    alias: 'C',
    default: null,
    type: 'string',
    describe: 'Pass config path'
  })
  .option('root', {
    alias: 'R',
    default: null,
    type: 'string',
    describe: 'Pass root path'
  })
  .argv;
/*
const root = argv.R || argv.root;
const configFile = argv.C || argv.config;
const config = new Config(
    root ? [root] : [],
    configFile ? [configFile] : []
);
const configData = config.load();
console.log(configData);
*/
