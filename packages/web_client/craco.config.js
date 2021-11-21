const path = require('path');
const {
    getLoader,
    loaderByName,
    addAfterLoader,
    throwUnexpectedConfigError,
} = require('@craco/craco');
const WasmPackPlugin = require('@wasm-tool/wasm-pack-plugin');

const typeScriptPackages = [path.join(__dirname, '../whiteboard')];
const wasmPackage = {
    src: path.join(__dirname, '../whiteboard_engine'),
    out: path.join(__dirname, '../whiteboard_engine/pkg'),
};

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
            webpackConfig.resolve.extensions.push('.wasm');

            /** Create TSLoader to add it for the TypeScript packages */
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

            const {isFound: isTsLoaderFound, match: tsLoadermatch} = getLoader(
                webpackConfig,
                loaderByName('ts-loader'),
            );

            if (isTsLoaderFound) {
                const include = Array.isArray(tsLoadermatch.loader.include)
                    ? tsLoadermatch.loader.include
                    : [tsLoadermatch.loader.include];

                tsLoadermatch.loader.include =
                    include.concat(typeScriptPackages);
            }

            const {isFound: isFileLoaderFound, match: fileLoadermatch} =
                getLoader(webpackConfig, loaderByName('file-loader'));

            /** We have to make `file-loader` to ignore `wasm` files. Otherwise it'll crash */
            if (isFileLoaderFound) {
                fileLoadermatch.loader.exclude.push(/\.wasm$/);
            }

            /**
             * Add WasmPackPlugin only for Development mode
             *  because for production mode we have
             *  "wasm-pack build" which creates `pkg` folder
             *  and we may use them
             */
            if (process.env.NODE_ENV === 'development') {
                webpackConfig.plugins.push(
                    new WasmPackPlugin({
                        crateDirectory: wasmPackage.src,
                        outDir: wasmPackage.out,
                    }),
                );
            }

            return webpackConfig;
        },
    },
};
