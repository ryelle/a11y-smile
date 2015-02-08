window.Smile = window.Smile || {};

(function($, undefined){
	Smile.a11y = {};

	var weather_url = 'http://api.wunderground.com/api/e9413299706840fe/forecast/q/';

	Smile.a11y.check = function( event, data ){
		var element = document.getElementById( data.service + '-' + data.id );

		if ( Math.random() > 0.5 ) {
			$( element ).find( '.a11y-status' ).attr( 'data-a11y', 'yes' );
		} else {
			$( element ).find( '.a11y-status' ).attr( 'data-a11y', 'no' );
		}
	}

	Smile.a11y.weather = function( event, data ){
		var element = document.getElementById( data.service + '-' + data.id ).querySelector( '.weather' ),
			url = weather_url + data.venue.state + '/' + data.venue.city + '.json';

		console.log( url );
		$.ajax({
			url: url,
			dataType: 'jsonp',
			success: function( data ){
				if ( data.error ) {
					return;
				}
				var _weather = Smile.template( 'weather' );
				$( element ).html( _weather( data.forecast.txt_forecast.forecastday[0] ) );
			}
		});
	}

	$( document ).on( 'event-loaded', Smile.a11y.check );
	$( document ).on( 'event-loaded', Smile.a11y.weather );

}( jQuery ) );
