'use strict';

const logger = {
	info: m => {
		console.info(m);
	},
	error: m => {
		console.error(m);
	},
	warn: m => {
		console.warn(m);
	},
	debug: m => {
		console.debug(m);
	},
	log: m => {
		console.log(m);
	}
};

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
let httpServer;

/**
 * startupSystem() Defines the critical path setup of the API server
 *
 * @return {Promise} returns promise of `Express` App.
 */
function startupSystem() {
	const app = express();
	app.use(morgan('dev'));
	app.use(compression());
	app.use(bodyParser.json());

	logger.log(`${environment} v${pkg.version}`);

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
		logger.error(err.stack);
		res.status(500).send('Internal Server Error: ' + err);
	});
	/* eslint-enable no-unused-vars */

	/*============================== PROCESS SHUTDOWN HANDLING ============================== */
	process.on('exit', code => {
		logger.info(`Application about to exit with code: ${code}`);
	});
	process.on('SIGINT', () => shutdownSystem('SIGINT'));
	process.on('SIGTERM', () => shutdownSystem('SIGTERM'));

	// Serving
	// server start
	// eslint-disable-next-line no-unused-vars
	return new Promise((resolve, reject) => {
		httpServer = app.listen(port, () => {
			logger.log(`http://localhost:${port}`);
			resolve(app);
		});
	});
}

/**
 * shutdownSystem() Handler for cleaning up forked process and allocated resources
 *
 * @param {string} code - String code representing shutdown reason eg SIGINT, SIGTERM
 *
 * @return {void}
 */
function shutdownSystem(code) {
	if (code) {
		logger.info(`${code} event received, application closing`);
	} else {
		logger.info(`Application closing`);
	}

	return Promise.all([
		new Promise(resolve => {
			if (httpServer) {
				logger.info('Express.js server closing');
				httpServer.close(() => resolve());
			} else {
				logger.warn('Express.js server NOT initialised !!!');
				resolve();
			}
		})
	]).catch(err => {
		logger.error(err);
	});
}
// Export for Integration testing
module.exports = { startupSystem, shutdownSystem };
