const browserifyPreprocessor = require('@cypress/browserify-preprocessor');
const resolve = require('resolve');

const preprocessor = (babelOptions = {}, options = browserifyPreprocessor.defaultOptions) => (file) => {
  let presets = ['babel-preset-env', 'babel-preset-stage-1'];
  if (babelOptions && babelOptions.presets) {
    presets = [...presets, ...babelOptions.presets];
  }
  presets = presets.map(resolve);

  let plugins = babelOptions && babelOptions.plugins || [];
  plugins = plugins.map(resolve);

  options.browserifyOptions.transform[1][1].presets = presets;
  options.browserifyOptions.transform[1][1].plugins = plugins;

  return browserifyPreprocessor(options)(file);
};

module.exports = preprocessor;
