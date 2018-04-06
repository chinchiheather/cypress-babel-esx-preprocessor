const browserify = require('@cypress/browserify-preprocessor');

const preprocessor = (babelOptions = {}, options = browserify.defaultOptions) => {
    return (file) => {
        let presets = ['babel-preset-env', 'babel-preset-stage-1'];
        if (babelOptions.presets) {
            presets = [...presets, babelOptions.presets];
        }
        presets = presets.map(require.resolve);

        let plugins = [];
        if (babelOptions.plugins) {
            plugins = babelOptions.plugins;
        }

        options.browserifyOptions.transform[1][1].presets = presets;
        options.browserifyOptions.transform[1][1].plugins = plugins;
        return browserify(options)(file);
    };
};

module.exports = preprocessor;
