/*jslint vars: true, white: true */
/*global jQuery */

(function($) {

	"use strict";

	// TODO: Use enhance.js

	$(".rows").fancyControls();

	$("[data-emitter]").dataMirror();

	if (!Modernizr.touch) {
		$('.with-tooltip').tooltipsy({
			className: 'tooltip'
		});
	}

	$('.checkin-form').h5Validate({
		errorClass: 'invalid-input',
		validClass: 'valid-input'
	});

}(jQuery));
