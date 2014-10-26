/*jslint vars: true, white: true */
/*global jQuery */

(function($) {

	"use strict";

	// Find out on which page to load what. We do not want to serve
	// unused enhancements to all pages. Not very elegant, I know...

	function isStartPage() {
		return document.title.indexOf("Start") > -1;
	};

	function isSeatSelectionPage() {
		return document.title.indexOf("Seat Selection") > -1;
	};


	// We use feature-detection provided by Moderizr to load in
	// additional enhancements async. For the sake of
	// simpilcity all enhancements are loaded individually.

	Modernizr.load([

		{
			test : Modernizr.fontface,
			yep  : '//ajax.googleapis.com/ajax/libs/webfont/1.5.3/webfont.js',
			callback: function () {
				WebFont.load({
					google: {
						families: ['Lato:700italic', 'Open+Sans:400,300,600']
					}
				});
			}
		},

		{
			test : Modernizr.formvalidationapi && isStartPage(),
			yep  : "/assets/vendor/h5validate.js",
			callback : function() {
				$('.checkin-form').h5Validate({
					errorClass: 'invalid-input',
					validClass: 'valid-input',
					invalidCallback: function(elem, valid) {
						$(elem.element).attr('aria-invalid', true);
					},
					validCallback: function(elem, valid) {
						$(elem.element).removeAttr('aria-invalid');
					}
				});
			}
		},


		{
			// These enhancements should be fine with just jQuery in place
			test : isSeatSelectionPage(),
			yep  : ["/assets/scripts/fancy_controls.js",
					"/assets/scripts/data_mirror.js",
					"/assets/scripts/smooth_scroll.js"],
			callback : {
				"fancy_controls.js": function () {
					$(".rows").fancyControls();
				},
				"data_mirror.js": function () {
					$("[data-emitter]").dataMirror();
				}
			}
		},

		{
			test : !Modernizr.touch && isSeatSelectionPage(),
			yep  : "/assets/vendor/tooltipsy.js",
			callback : function () {
				$('.with-tooltip').tooltipsy({
					className: 'tooltip'
				});
			}
		}

	]);

}(jQuery));
