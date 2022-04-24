const { useBabelRc, override, getBabelLoader } = require('customize-cra');

const fixBabelLoaderCache =
    (defaultLang = 'en') =>
    (config) => {
        const lang = process.env.LANG || defaultLang;

        getBabelLoader(config).options.cacheDirectory = `./node_modules/.cache/babel-loader/${lang}/`;

        return config;
    };

module.exports = override(useBabelRc(), fixBabelLoaderCache());
