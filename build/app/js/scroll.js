var $body = $(document.body),
	$logo = $('#header .static .logo'),
	threshold = $logo.offset().top + $logo.height(),
	hasClass = false;

function scroll() {
	var docElem = document.documentElement,
		scrollTop = docElem && docElem.scrollTop || document.body.scrollTop,
		state = scrollTop > threshold;

	if(hasClass && !state) {
		$body.removeClass('scrolled');
		hasClass = false;
	}
	else if(!hasClass && state) {
		$body.addClass('scrolled');
		hasClass = true;
	}
}

jQuery.request_scroll(scroll);
scroll();