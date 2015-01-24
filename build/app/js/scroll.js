var body = document.body,
	logo = document.getElementById('logo'),
	threshold = logo.offsetTop + logo.height,
	hasClass = false;

function scroll() {
	var docElem = document.documentElement,
		scrollTop = docElem && docElem.scrollTop || document.body.scrollTop,
		state = scrollTop > threshold;

	if(hasClass && !state) {
		body.className = body.className.replace(/\s*scrolled\s*/g, '');
		hasClass = false;
	}
	else if(!hasClass && state) {
		body.className = body.className + ' scrolled';
		hasClass = true;
	}
}

function request_scroll(callback) {
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

request_scroll(scroll);
scroll();