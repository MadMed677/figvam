const path = require('path');
const {
    getLoader,
    loaderByName,
    addAfterLoader,
    throwUnexpectedConfigError,
} = require('@craco/craco');

const packages = [path.join(__dirname, '../whiteboard')];

const throwError = message =>
    throwUnexpectedConfigError({
        packageName: 'craco',
        githubRepo: 'gsoft-inc/craco',
        message,
        githubIssueQuery: 'webpack',
    });

module.exports = {
    webpack: {
        /**
         * We have to do 2 things in here
         *  1. When we import from `packages` lerna will add it as `dependencies`
         *      and because it's a dependency webpack inside `create-react-app`
         *      decide to not transpile it because it's interpret it as `node_modules`
         *     But we need to transpile it because it's pure TS files.
         *     And in that case we have to add all loaders which has `babel-loader`
         *      to our "packages"
         *  2. But `babel-loader` cannot work with decorators which has been using
         *      inside `whiteboard` package. To be able to transpile it we have to
         *      add `ts-loader` to them too
         *     Tricky! `ts-loader@9` doesn't support Webpack@4 but `create-react-app` uses
         *      Webpack@4. To keep everything work fine we have to instell `ts-loader@8`
         *      More information about it: https://github.com/TypeStrong/ts-loader/issues/595#issuecomment-824240989
         */
        configure: (webpackConfig, {paths}) => {
            /** Create TSLoader to add it for the packages */
            const tsLoader = {
                test: /\.(js|mjs|jsx|ts|tsx)$/,
                include: paths.appSrc,
                loader: require.resolve('ts-loader'),
                options: {transpileOnly: true},
            };

            const {isAdded: tsLoaderIsAdded} = addAfterLoader(
                webpackConfig,
                loaderByName('babel-loader'),
                tsLoader,
            );
            if (!tsLoaderIsAdded) throwError('failed to add ts-loader');

            const {isFound, match} = getLoader(
                webpackConfig,
                loaderByName('ts-loader'),
            );

            if (isFound) {
                const include = Array.isArray(match.loader.include)
                    ? match.loader.include
                    : [match.loader.include];

                match.loader.include = include.concat(packages);
            }

            return webpackConfig;
        },
    },
};
