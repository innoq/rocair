/*jslint vars: true, white: true */
/*global jQuery */

(function($) {

"use strict";

$.fn.dataMirror = function () {
	this.each(function() {
		var emitter = $(this);
		console.log('Data mirroring enabled for: ' + emitter.attr('value'));
		var receiverID = emitter.attr("data-emitter");
		var receiversSelector = "[data-receiver=" + receiverID + "]";
		var receivers = $(receiversSelector);
		emitter.on('change', function(ev){
			var value = $(this).attr('value');
			console.log(value + ' changed: ' + ev);
			receivers.each(function(){
				$(this).text(value);
			});
		});
	});
};

}(jQuery));
