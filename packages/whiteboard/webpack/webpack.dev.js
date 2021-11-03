const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const {prod_path, src_path} = require('./path');

module.exports = {
    entry: {
        main: './' + src_path + '/index.ts',
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    output: {
        path: path.resolve(__dirname, prod_path),
        filename: '[name].[chunkhash].js',
    },
    devtool: 'source-map',
    devServer: {
        open: false,
        port: 9000,
        hot: true,
        client: {
            progress: true,
        },
    },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: ['babel-loader', 'ts-loader'],
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'style.css',
        }),
        new HtmlWebpackPlugin(),
        new webpack.ProvidePlugin({
            PIXI: 'pixi.js',
        }),
    ],
};
