const browserify = require('@cypress/browserify-preprocessor');

const process = (extraPresets = [], options = browserify.defaultOptions) => {
    return (file) => {
        const presets = ['babel-preset-stage-1', ...extraPresets].map(require.resolve);
        options.browserifyOptions.transform[1][1].presets = presets;
        return browserify(options)(file);
    };
};

module.exports = process;
