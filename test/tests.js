import assert from 'assert';
import * as babel from '@babel/core';

function createOptions({
  mask = '',
  exts = [],
}) {
  return {
    mask,
    exts,
  };
};

function transformFile(filename, options = createOptions({})) {
  return babel.transformFileSync(filename, {
    presets: [['@babel/preset-env', { modules: false }]],
    plugins: [['./plugin/index', options]]
  }).code;
}

function transformCode(code, options = createOptions({})) {
  return babel.transform(code, {
    presets: [['@babel/preset-env', { modules: false }]],
    plugins: [['./plugin/index', options]]
  }).code;
}

describe('handle require statements for specified in exts list option', function () {
  
  it('should handle require statements for csa mask', function () {
    const code = transformFile(__dirname + '/src/code.js', { mask: 'csa', exts: ['png', 'jpeg'] });
    assert.equal(code, `require("./img.csa.png");\n\nrequire('./img1.png');\n\nrequire('./img2.jpeg');`);
  });

  it('should handle require statements for ath mask', function () {
    const code = transformFile(__dirname + '/src/code.js', { mask: 'ath', exts: ['png', 'jpeg'] });
    assert.equal(code, `require("./img.ath.png");\n\nrequire('./img1.png');\n\nrequire('./img2.jpeg');`);
  });

});

describe('skip require statements if not specified in exts list option', function () {
  
  it('should not handle require statements for .png ext', function () {
    const code = transformFile(__dirname + '/src/code.js', { mask: 'csa', exts: ['jpeg'] });
    assert.equal(code, `require('./img.png');\n\nrequire('./img1.png');\n\nrequire('./img2.jpeg');`);
  });

  it('should not handle require statements for empty exts', function () {
    const code = transformFile(__dirname + '/src/code.js', { mask: 'ath', exts: [] });
    assert.equal(code, `require('./img.png');\n\nrequire('./img1.png');\n\nrequire('./img2.jpeg');`);
  });

});
