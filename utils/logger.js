'use strict';

// Poor mans logging tool
module.exports = {
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
