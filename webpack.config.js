'use strict';
// const webpack = require('webpack');
const path = require('path');

const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	entry: path.resolve(__dirname, 'src/index.js'),

	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, 'dist')
	},

	module: {
		rules: []
	},
	plugins: [new CopyWebpackPlugin([{ from: 'static' }])]
};
