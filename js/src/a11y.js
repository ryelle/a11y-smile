window.Smile = window.Smile || {};

(function($, undefined){
	Smile.a11y = {};

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


