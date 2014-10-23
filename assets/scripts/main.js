/*jslint vars: true, white: true */
/*global jQuery */

(function($) {

	"use strict";

	// TODO: Use enhance.js

	// augmentation controls
	$(".rows").fancyControls();
	$("[data-emitter]").dataMirror();

	$('.with-tooltip').tooltipsy({
		className: 'tooltip'
	});

	$(document).ready(function () {
		$('.checkin-form').h5Validate({
			errorClass: 'invalid-input',
			validClass: 'valid-input'
		});
	});

}(jQuery));
