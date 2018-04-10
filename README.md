# cypress-babel-esx-preprocessor
Cypress plugin to allow you to use all proposals to the JavaScript language at Proposal stage or above by using [babel-preset-stage-1](https://babeljs.io/docs/plugins/preset-stage-1/) as well as all JavaScript that has been finalised in the ECMA standard by using [babel-preset-env](https://babeljs.io/docs/plugins/preset-env/)

This uses Cypress' default preprocessor under the hood ([@cypress/browserify-preprocessor](https://github.com/cypress-io/cypress-browserify-preprocessor)), adding the necessary configuration to use these babel presets

Most notably this allows use of object destructuring/object spread syntax in your Cypress spec files

## Install

```bash
# npm
npm install cypress-babel-esx-preprocessor --save-dev

# yarn
yarn add cypress-babel-esx-preprocessor --dev
```

## Usage

```javascript
// cypress/plugins/index.js

const babelEsX = require('cypress-babel-esx-preprocessor');

module.exports = (on) => {
    on('file:preprocessor', babelEsX());
};
```

Pass in some additional babel presets/plugins:
```javascript
// cypress/plugins/index.js

const babelEsX = require('cypress-babel-esx-preprocessor');

module.exports = (on) => {
    const babelOptions = {
        presets: ['babel-preset-react'],
        plugins: ['babel-plugin-lodash']
    };
    on('file:preprocessor', babelEsX(babelOptions));
};
```

Pass in options to @cypress/browserify-preprocessor:
```javascript
// cypress/plugins/index.js

const babelEsX = require('cypress-babel-esx-preprocessor');
const browserify = require('@cypress/browserify-preprocessor')

module.exports = (on) => {
    const options = browserify.defaultOptions;
    options.extensions.push('ts', 'tsx');
    on('file:preprocessor', babelEsX(null, options));
};
```
