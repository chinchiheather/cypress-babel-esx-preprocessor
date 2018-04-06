const sinon = require('sinon');
const mockery = require('mockery');

/* eslint-env mocha */

describe('cypress-babel-esx', () => {
  const cypressBabelEsX = (file, options, browserifyOptions) => {
    const preprocessor = require('../index');
    return preprocessor(options, browserifyOptions)(file);
  };

  let file;
  let defaultBrowserifyOptions;
  let browserifySpy;
  let fileSpy;
  let resolveSpy;
  let preprocessed;

  before(() => {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false
    });

    file = {
      filePath: 'my-file.e2e-spec.js',
      outputPath: '/tmp/user/my-file.e2e-spec.js'
    };
    defaultBrowserifyOptions = {
      browserifyOptions: {
        transform: [[], [{}, {
          presets: [],
          plugins: []
        }]]
      }
    };

    fileSpy = sinon.spy(() => 'preprocessed file!');
    browserifySpy = sinon.spy(() => fileSpy);
    browserifySpy.defaultOptions = defaultBrowserifyOptions;
    resolveSpy = sinon.spy(filePath => filePath);

    mockery.registerMock('@cypress/browserify-preprocessor', browserifySpy);
    mockery.registerMock('resolve', { sync: resolveSpy });
  });

  after(() => {
    mockery.deregisterMock('@cypress/browserify-preprocessor');
    mockery.disable();
  });

  context('Simple use', () => {
    beforeEach(() => {
      preprocessed = cypressBabelEsX(file);
    });

    it('uses babel-preset-env', () => {
      sinon.assert.calledWith(browserifySpy, sinon.match((value) => {
        const presets = value.browserifyOptions.transform[1][1].presets;
        return presets.indexOf('babel-preset-env') !== -1;
      }));
    });

    it('uses babel-preset-stage-1', () => {
      sinon.assert.calledWith(browserifySpy, sinon.match((value) => {
        const presets = value.browserifyOptions.transform[1][1].presets;
        return presets.indexOf('babel-preset-stage-1') !== -1;
      }));
    });

    it('resolves paths to presets', () => {
      sinon.assert.calledWith(resolveSpy, 'babel-preset-env');
      sinon.assert.calledWith(resolveSpy, 'babel-preset-stage-1');
    });

    it('uses no babel plugins', () => {
      sinon.assert.calledWith(browserifySpy, sinon.match((value) => {
        const plugins = value.browserifyOptions.transform[1][1].plugins;
        return plugins.length === 0;
      }));
    });

    it('uses the default options for @cypress/browserify-preprocessor', () => {
      sinon.assert.calledWith(browserifySpy, sinon.match(defaultBrowserifyOptions));
    });

    it('calls @cypress/browserify-preprocessor', () => {
      sinon.assert.called(browserifySpy);
      sinon.assert.called(fileSpy);
      sinon.assert.match(preprocessed, 'preprocessed file!');
    });
  });


  context('Providing custom babel config', () => {
    context('Providing extra presets', () => {
      beforeEach(() => {
        preprocessed = cypressBabelEsX(file, {
          presets: ['babel-preset-custom-preset']
        });
      });

      it('uses extra babel presets provided', () => {
        sinon.assert.calledWith(browserifySpy, sinon.match((value) => {
          const presets = value.browserifyOptions.transform[1][1].presets;
          return presets.indexOf('babel-preset-custom-preset') !== -1;
        }));
      });

      it('uses babel-preset-env', () => {
        sinon.assert.calledWith(browserifySpy, sinon.match((value) => {
          const presets = value.browserifyOptions.transform[1][1].presets;
          return presets.indexOf('babel-preset-env') !== -1;
        }));
      });

      it('uses babel-preset-stage-1', () => {
        sinon.assert.calledWith(browserifySpy, sinon.match((value) => {
          const presets = value.browserifyOptions.transform[1][1].presets;
          return presets.indexOf('babel-preset-stage-1') !== -1;
        }));
      });

      it('resolves paths to presets', () => {
        sinon.assert.calledWith(resolveSpy, 'babel-preset-env');
        sinon.assert.calledWith(resolveSpy, 'babel-preset-stage-1');
        sinon.assert.calledWith(resolveSpy, 'babel-preset-custom-preset');
      });

      it('uses no babel plugins', () => {
        sinon.assert.calledWith(browserifySpy, sinon.match((value) => {
          const plugins = value.browserifyOptions.transform[1][1].plugins;
          return plugins.length === 0;
        }));
      });

      it('uses the default options for @cypress/browserify-preprocessor', () => {
        sinon.assert.calledWith(browserifySpy, sinon.match(defaultBrowserifyOptions));
      });

      it('calls @cypress/browserify-preprocessor', () => {
        sinon.assert.called(browserifySpy);
        sinon.assert.called(fileSpy);
        sinon.assert.match(preprocessed, 'preprocessed file!');
      });
    });

    context('Providing extra plugins', () => {
      beforeEach(() => {
        preprocessed = cypressBabelEsX(file, {
          plugins: ['babel-plugin-custom-plugin']
        });
      });

      it('uses babel plugins provided', () => {
        sinon.assert.calledWith(browserifySpy, sinon.match((value) => {
          const plugins = value.browserifyOptions.transform[1][1].plugins;
          return plugins.indexOf('babel-plugin-custom-plugin') !== -1;
        }));
      });

      it('resolves paths to plugins', () => {
        sinon.assert.calledWith(resolveSpy, 'babel-plugin-custom-plugin');
      });

      it('uses babel-preset-env', () => {
        sinon.assert.calledWith(browserifySpy, sinon.match((value) => {
          const presets = value.browserifyOptions.transform[1][1].presets;
          return presets.indexOf('babel-preset-env') !== -1;
        }));
      });

      it('uses babel-preset-stage-1', () => {
        sinon.assert.calledWith(browserifySpy, sinon.match((value) => {
          const presets = value.browserifyOptions.transform[1][1].presets;
          return presets.indexOf('babel-preset-stage-1') !== -1;
        }));
      });

      it('uses the default options for @cypress/browserify-preprocessor', () => {
        sinon.assert.calledWith(browserifySpy, sinon.match(defaultBrowserifyOptions));
      });

      it('calls @cypress/browserify-preprocessor', () => {
        sinon.assert.called(browserifySpy);
        sinon.assert.called(fileSpy);
        sinon.assert.match(preprocessed, 'preprocessed file!');
      });
    });

    context('Providing extra presets and plugins', () => {
      beforeEach(() => {
        preprocessed = cypressBabelEsX(file, {
          presets: ['babel-preset-custom-preset'],
          plugins: ['babel-plugin-custom-plugin']
        });
      });

      it('uses extra babel presets provided', () => {
        sinon.assert.calledWith(browserifySpy, sinon.match((value) => {
          const presets = value.browserifyOptions.transform[1][1].presets;
          return presets.indexOf('babel-preset-custom-preset') !== -1;
        }));
      });

      it('uses babel plugins provided', () => {
        sinon.assert.calledWith(browserifySpy, sinon.match((value) => {
          const plugins = value.browserifyOptions.transform[1][1].plugins;
          return plugins.indexOf('babel-plugin-custom-plugin') !== -1;
        }));
      });

      it('uses babel-preset-env', () => {
        sinon.assert.calledWith(browserifySpy, sinon.match((value) => {
          const presets = value.browserifyOptions.transform[1][1].presets;
          return presets.indexOf('babel-preset-env') !== -1;
        }));
      });

      it('uses babel-preset-stage-1', () => {
        sinon.assert.calledWith(browserifySpy, sinon.match((value) => {
          const presets = value.browserifyOptions.transform[1][1].presets;
          return presets.indexOf('babel-preset-stage-1') !== -1;
        }));
      });

      it('resolves paths to presets and plugins', () => {
        sinon.assert.calledWith(resolveSpy, 'babel-preset-env');
        sinon.assert.calledWith(resolveSpy, 'babel-preset-stage-1');
        sinon.assert.calledWith(resolveSpy, 'babel-preset-custom-preset');
        sinon.assert.calledWith(resolveSpy, 'babel-plugin-custom-plugin');
      });

      it('uses the default options for @cypress/browserify-preprocessor', () => {
        sinon.assert.calledWith(browserifySpy, sinon.match(defaultBrowserifyOptions));
      });

      it('calls @cypress/browserify-preprocessor', () => {
        sinon.assert.called(browserifySpy);
        sinon.assert.called(fileSpy);
        sinon.assert.match(preprocessed, 'preprocessed file!');
      });
    });
  });

  context('Providing custom browserify-preprocessor config', () => {
    let customBrowserifyConfig;
    beforeEach(() => {
      customBrowserifyConfig = Object.assign({}, defaultBrowserifyOptions, { extensions: ['.ts', '.tsx'] });
      preprocessed = cypressBabelEsX(file, null, customBrowserifyConfig);
    });

    it('uses provided config', () => {
      sinon.assert.calledWith(browserifySpy, customBrowserifyConfig);
    });

    it('uses babel-preset-env', () => {
      sinon.assert.calledWith(browserifySpy, sinon.match((value) => {
        const presets = value.browserifyOptions.transform[1][1].presets;
        return presets.indexOf('babel-preset-env') !== -1;
      }));
    });

    it('uses babel-preset-stage-1', () => {
      sinon.assert.calledWith(browserifySpy, sinon.match((value) => {
        const presets = value.browserifyOptions.transform[1][1].presets;
        return presets.indexOf('babel-preset-stage-1') !== -1;
      }));
    });

    it('resolves paths to presets', () => {
      sinon.assert.calledWith(resolveSpy, 'babel-preset-env');
      sinon.assert.calledWith(resolveSpy, 'babel-preset-stage-1');
    });

    it('uses no babel plugins', () => {
      sinon.assert.calledWith(browserifySpy, sinon.match((value) => {
        const plugins = value.browserifyOptions.transform[1][1].plugins;
        return plugins.length === 0;
      }));
    });

    it('calls @cypress/browserify-preprocessor', () => {
      sinon.assert.called(browserifySpy);
      sinon.assert.called(fileSpy);
      sinon.assert.match(preprocessed, 'preprocessed file!');
    });
  });
});
