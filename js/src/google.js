window.Smile = window.Smile || {};

(function($, undefined){

	Smile.Google = {};

	Smile.Google.show = function( event, data ) {
		var element = document.getElementById( data.service + '-' + data.id ).querySelector('.pano'),
			venue = new google.maps.LatLng( data.venue.latitude, data.venue.longitude ),
			panoramaOptions = {
				position: venue,
				pov: {
					heading: 34,
					pitch: 10
				}
			};
		new google.maps.StreetViewPanorama( element, panoramaOptions );
	};

	$( document ).on( 'event-loaded', Smile.Google.show );
	// google.maps.event.addDomListener( window, 'load', Smile.Google.show );

}( jQuery ) );
