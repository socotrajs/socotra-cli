import { _, map, concat, filter, reduce } from 'lodash';
import { homedir } from 'os';
import { resolve, join, extname } from 'path';
import { existsSync, readFileSync } from 'fs';
import { safeLoad as safeLoadYaml } from 'js-yaml';

const resolveFromCwd = (dir) => resolve(process.cwd(), dir);
const getParsedFile = (filename) => {
  const contents = readFileSync(filename, 'utf8');
  let yaml = null;
  try {
    return JSON.parse(contents);
  } catch (ex) {}
  try {
    yaml = safeLoadYaml(contents, 'utf-8');
  } catch (ex) {
    return require(filename);
  }
  if (typeof yaml !== 'string') {
    return require(filename);
  }
};

class Config {
  sourcePaths: string[];
  data: {
    [dataKeyName: string]: any
  };

  constructor(roots = [], configs = []) {
    this.sourcePaths = Config.getConfigDirs(roots)
      .map(resolveFromCwd)
      .reduce(Config.accumulateConfigVariants, [])
      .filter(existsSync);;
  }

  load() {
    return this.data = this.data || this.sourcePaths.reduce(Config.accumulateConfigData, {});
  }

  static getConfigDirs = roots => roots.concat([homedir(), __dirname, process.cwd()]);
  static createFilenameVariants = dir => _.map(['.socotrarc', '.socotrarc.json', '.socotrarc.js'], filename => join(dir, filename));
  static accumulateConfigVariants = (acc, dir) => acc.concat(Config.createFilenameVariants(dir));
  static accumulateConfigData = (acc, filename) => ({ ...acc, ...getParsedFile(filename) });

}

export default Config;
