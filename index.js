/**
 * A module to handle resize events in an optimized way.
 *
 * This is basically an adaption of Mozilla Developer Network's
 * "Optimized Resize", but includes support for browsers without
 * requestAnimationFrame support. For those older browsers we fall back
 * to a simple throttled event callback.
 */
module.exports = (function (window) {
	'use strict';

	var
		debounce = require('lodash.debounce'),
		callbacks = [],
		running = false,
		changed = false,
		handler;

	function init () {
		window.addEventListener('resize', handler);
		window.addEventListener('orientationchange', handler);
	}

	function loop () {
		if (!changed) {
			running = false;
		}
		else {
			changed = false;
			running = true;

			run();

			window.requestAnimationFrame(loop);
		}
	}

	function run () {
		callbacks.forEach(function (fn) {
			fn();
		});
	}

	if (window.requestAnimationFrame) {
		handler = function () {
			if (!running) {
				changed = true;
				loop();
			}
		};
	}
	else {
		handler = debounce(run, 150);
	}

	return {
		listen: function (callback) {
			if (callbacks.length === 0) {
				init();
			}

			callbacks.push(callback);
		}
	};
})(window);
