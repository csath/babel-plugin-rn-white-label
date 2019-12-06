var existsSync = require('fs').existsSync;

module.exports = function () {
    return {
        name: 'babel-plugin-rn-white-label',
        visitor: {
            CallExpression (path, state) {
                if (path.node.callee.type === 'Identifier'
                && path.node.callee.name === 'require'
                && path.node.arguments.length) {

                    const options = {
                        mask: state.opts.mask || '',
                        exts: state.opts.exts || [],
                    }
                    
                    // do process only if options are specified
                    if (options.mask && options.exts.length) {

                        const regx = new RegExp(`(\.)(${options.exts.join('|')})$`);
                        const file_name = path.node.arguments[0].value.replace(/^(\.\/)/, '');

                        // skip node_modules
                        if (file_name.indexOf('node_modules') > -1) return;

                        // do only if given extension matches
                        if (regx.exec(file_name)) {

                            const file_dir = state.file.opts.filename.replace(/\/([^\/\s]*)$/, '/') + file_name.replace(regx, `$1${options.mask}.$2`);
                        
                            if (existsSync(file_dir)) {
                                path.node.arguments[0].value = path.node.arguments[0].value.replace(regx, `$1${options.mask}.$2`);
                            }
                        }
                    }
                }
            }
        }
    }
}