'use strict';

// Module Imports
const express = require('express'),
	path = require('path'),
	compression = require('compression'),
	bodyParser = require('body-parser'),
	morgan = require('morgan');

// Config
const pkg = require('./package.json');

// Server Setup
const port = process.env.PORT || 3000;
const environment = process.env.NODE_ENV || 'development';
const staticPath = process.env.STATIC_PATH || path.join(__dirname, 'dist');
const app = express();
app.use(morgan('dev'));
app.use(compression());
app.use(bodyParser.json());

console.log(`${environment} v${pkg.version}`);

/*============================== STATIC ASSETS ============================== */

if (environment === 'development') {
	const webpack = require('webpack');
	const webpackMiddleware = require('webpack-dev-middleware');
	const webpackConfig = require('./webpack.config.js');
	webpackConfig.mode = environment;

	app.use(
		webpackMiddleware(webpack(webpackConfig), {
			publicPath: '/',
			stats: { colors: true }
		})
	);
} else {
	app.use(express.static(staticPath));
}

/*============================== ROUTES============================== */
app.use('/', require('./routes/index.js'));

/*============================== ERROR HANDLING ============================== */
/* eslint-disable no-unused-vars */
// 404
app.use(function(req, res, next) {
	res.status(404).send('Not Found');
});

// 500
app.use(function(err, req, res, next) {
	console.error(err.stack);
	res.status(500).send('Internal Server Error: ' + err);
});
/* eslint-enable no-unused-vars */

// Serving
app.listen(port, () => console.log(`http://localhost:${port}`));

// Export for Integration testing
module.exports = app;
