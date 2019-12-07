var existsSync = require('fs').existsSync;

module.exports = function () {
    return {
        name: 'rn-white-label',
        visitor: {
            CallExpression (path, state) {
                if (path.node.callee.type === 'Identifier'
                && path.node.callee.name === 'require'
                && path.node.arguments.length) {

                    const options = {
                        mask: state.opts.mask || '',
                        exts: state.opts.exts || [],
                    }
                    
                    // skip if options are not specified
                    if (!options.mask || !options.exts.length) return;

                    const regx = new RegExp(`(\.)(${options.exts.join('|')})$`);
                    const file_name = path.node.arguments[0].value.replace(/^(\.\/)/, '');

                    // skip node_modules
                    if (file_name.indexOf('node_modules') > -1) return;

                    // skip if given extension doesn't matche
                    if (!regx.exec(file_name)) return;

                    const file_dir = state.file.opts.filename.replace(/\/([^\/\s]*)$/, '/') + file_name.replace(regx, `$1${options.mask}.$2`);
                
                    // modify require statement if required assets found
                    if (existsSync(file_dir)) {
                        path.node.arguments[0].value = path.node.arguments[0].value.replace(regx, `$1${options.mask}.$2`);
                    }
                }
            }
        }
    }
}