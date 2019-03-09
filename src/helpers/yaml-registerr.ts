import { readFileSync } from 'fs';
import { safeLoad as safeLoadYaml } from 'js-yaml';

module.exports = (module, filename) => {
    let content = readFileSync(filename, 'utf8');

    // strip bom value
    if (content.charCodeAt(0) === 0x00FEFF) {
		content = content.slice(1);
    }
    content = content.toString();

    try {
        module.exports = safeLoadYaml(content, 'utf-8');
    } catch (ex) {
        ex.message = `${filename}: ${ex.message}`;
        throw ex;
    }
}

if (require.extensions) {
    require.extensions['.yml'] = module.exports;
    require.extensions['.yaml'] = module.exports;
}