import Bundler from 'parcel-bundler';
import { statSync } from "fs";
import * as path from 'path';
import * as glob from 'glob';
import * as _ from 'lodash';

const { pathes, entries } = require('../settings.json');
const USELESS_RELATIVE_PATHES = [null, undefined, './', '.'];

const filterUselessPath = (p) => USELESS_RELATIVE_PATHES.includes(p);
const relativePathToAbsoluteFromSource = p => path.resolve(process.cwd(), pathes.SOURCE_DEST, p);

const asyncGlob = path => new Promise((resolve, reject) => glob(path, (err, pathes) => {
    if (err) {
        return reject(err);
    }
    return resolve(pathes);
}));

(async () => {
    let globs = [];
    if (entries.glob && filterUselessPath(entries.glob)) {
        let filePath = relativePathToAbsoluteFromSource(entries.glob);
        globs.push(
            asyncGlob(filePath)
        );
    }

    if (entries.extensions && entries.extensions.constructor === Array) {
        let filePath = relativePathToAbsoluteFromSource(`**/*.{${entries.extensions}}`);
        globs.push(
            asyncGlob(filePath)
        );
    }
    
    globs = await Promise.all(globs);
    
    _(globs)
        .flatten()
        .concat(entries.files)
        .filter(path => statSync(path))
        .each(file => {
            
        });
})();

_(entries.files)


