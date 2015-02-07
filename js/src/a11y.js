window.Smile = window.Smile || {};

(function($, undefined){
	Smile.a11y = {};

	var auth = {
		//
		// Update with your auth tokens.
		//
		consumerKey : "d86aA6e9luwCkEBPQ8RsBw",
		consumerSecret : "1qgY4NxisuKgE3-Sh3cYYaAPNHA",
		accessToken : "XidIrU_2lh1X5O4u469jSLkjQzzRAWlZ",
		// This example is a proof of concept, for how to use the Yelp v2 API with javascript.
		// You wouldn't actually want to expose your access token secret like this in a real application.
		accessTokenSecret : "WQMd4LhHdC3DHuWN2fZ01budG2A",
		serviceProvider : {
			signatureMethod : "HMAC-SHA1"
		}
	};

	Smile.a11y.check = function( event, data ){
		var element = document.getElementById( data.service + '-' + data.id );

		if ( Math.random() > 0.5 ) {
			$( element ).find( '.a11y-status' ).attr( 'data-a11y', 'yes' );
		} else {
			$( element ).find( '.a11y-status' ).attr( 'data-a11y', 'no' );
		}
	}

	$( document ).on( 'event-loaded', Smile.a11y.check );

}( jQuery ) );


