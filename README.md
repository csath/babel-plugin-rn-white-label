# babel-plugin-rn-white-label

Transforms require statements for given custom extensions:

_This plugin was originally created for [react-native-white-label](https://github.com/csath/react-native-white-label) library._

## What plugin does?

Modify `require` statements according to specified options.

If you have `img.png` asset as follows using custom extensions,

![Image of Assets](https://github.com/csath/babel-plugin-rn-white-label/screenshots/assets.png)

and if you want to bundle different files without modifiying the code,

`require('./src/img.png')`

for specific configs you are running your application, pass following options to babel plugin.

``
{ 
      mask: 'csa', 
      exts: ["png", "jpeg", "gif"]
}
``

If `src` directory has `img.csa.png` bundler will pick up it or if `img.csa.png` is not available it'll pick up `img.png`

#### Options

| Attribute     | Data type     | Description    |
| ------------- | ------------- | ------------- |
| mask          | String \| ""   | Custom extension (eg: 'csa' to pick up `for abc.csa.png`)        |
| exts          | String Array \| [] | Extensions to be modified (eg: ['png', 'jpeg']) |

## Installation

```to be modified
npm install --save-dev babel-plugin-rn-white-label
```
or
```
yarn add -D babel-plugin-rn-white-label
```

## Usage

`babel.config.js`:

```javascript
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ['babel-plugin-rn-white-label', { 
      mask: 'csa', 
      exts: ["png", "jpeg", "gif"]
    }
    ]
  ]
};
```

or

`.babelrc`:

```json
{
  "plugins": [
    ["babel-plugin-rn-white-label", {
      "mask": "csa",
      "exts": ["png", "jpeg", "gif"]
     }
    ]
  ]
}
```


