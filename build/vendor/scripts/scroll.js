jQuery.request_scroll = function(callback) {
	/*
	Callback for our scroll event - just
	keeps a track on the last scroll value
	 */
	var lastScrollY, onScroll, requestAnimFrame, requestTick, ticking, update;
	onScroll = function() {
		var lastScrollY;
		lastScrollY = window.scrollY;
		return requestTick();
	};

	/*
	Calls rAF if it's not already
	been done already
	 */
	requestTick = function() {
		var ticking;
		if (!ticking) {
			requestAnimFrame(update);
			return ticking = true;
		}
	};

	/*
	Our animation callback
	 */
	update = function() {
		var ticking;
		callback(lastScrollY);
		return ticking = false;
	};
	lastScrollY = 0;
	ticking = false;
	window.addEventListener("scroll", onScroll, false);
	return requestAnimFrame = (function() {
		return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(timeout_callback) {
			return window.setTimeout(timeout_callback, 1000 / 60);
		};
	})();
};