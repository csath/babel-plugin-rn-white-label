var existsSync = require('fs').existsSync;

var project_root = (__dirname || '').replace('node_modules/babel-plugin-rn-white-label/plugin', '');

var default_paths_to_ignore = [
    project_root + 'node_modules',
    project_root + 'ios/',
    project_root + 'android/',
];

module.exports = function ({ types: t }) {
    return {
        name: 'babel-plugin-rn-white-label',
        visitor: {
            CallExpression (path, state) {
                if (path.node.callee.type === 'Identifier'
                    && path.node.callee.name === 'require'
                    && path.node.arguments.length) {

                    // skip if in paths to ignore
                    if (default_paths_to_ignore.find(_path => (state.file.opts.filename.indexOf(_path) > -1)))  return;

                    const options = {
                        mask: state.opts.mask || '',
                        exts: state.opts.exts || [],
                    }
                    
                    // skip if options are not specified
                    if (!options.mask || !options.exts.length) return;
                   
                    const regx = new RegExp(`((\\.)([^\/]*))?(\\.)(${options.exts.join('|')})$`);
                    const file_name = path.node.arguments[0].value.replace(/^(\.\/)/, '');

                    const hits = regx.exec(file_name);

                    // skip if given extension doesn't match
                    if (!hits || !hits.length) return;

                    if (hits[3] === options.mask) {
                        const file_dir_org = state.file.opts.filename.replace(/\/([^\/\s]*)$/, '/') + file_name;
                        
                        // skip if original requirement satisfied
                        if (existsSync(file_dir_org)) return;

                        const file_dir_without_mask = state.file.opts.filename.replace(/\/([^\/\s]*)$/, '/') + file_name.replace(regx, `$4$5`);
                        
                        // replace if file found without mask extension
                        if (existsSync(file_dir_without_mask)) {
                            path.replaceWith(t.callExpression(path.node.callee, [t.stringLiteral(path.node.arguments[0].value.replace(regx, `$4$5`))]));
                            path.skip();
                        }
                    }
                    else {
                        const file_dir = state.file.opts.filename.replace(/\/([^\/\s]*)$/, '/') + file_name.replace(regx, `$1$4${options.mask}$4$5`);

                        // modify require statement if required assets found
                        if (existsSync(file_dir)) {
                            path.replaceWith(t.callExpression(path.node.callee, [t.stringLiteral(path.node.arguments[0].value.replace(regx, `$1$4${options.mask}$4$5`))]));
                            path.skip();
                        }
                    }
                }
            }
        }
    }
}