const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const {
	prod_path,
	src_path
} = require('./path');

module.exports = {
	entry: {
		main: './' + src_path + '/index.ts'
	},
	resolve: {
		extensions: ['.ts', '.js']
	},
	output: {
		path: path.resolve(__dirname, prod_path),
		filename: '[name].[chunkhash].js'
	},
	devtool: 'source-map',
	devServer: {
		open: true,
		port: 9000
	},
	module: {
		rules: [
			{
				test: /\.ts?$/,
				use: 'ts-loader',
				exclude: /node_modules/
			}
		]
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: 'style.css'
		}),
		new HtmlWebpackPlugin()
	]
};
