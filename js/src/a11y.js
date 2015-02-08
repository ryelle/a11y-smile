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
		// Only get weather for upcoming events
		if ( ! data.time ){
			return;
		}
		var d = new Date( data.time ),
			offset = 3 * 86400 * 1000; // 2 Days in miliseconds
		if ( d.getTime() > ( Date.now() + offset ) ) {
			return;
		}

		var element = document.getElementById( data.service + '-' + data.id ).querySelector( '.weather' ),
			url = weather_url + data.venue.state + '/' + data.venue.city + '.json';

		// console.log( url );
		$.ajax({
			url: url,
			dataType: 'jsonp',
			success: function( data ){
				if ( data.error ) {
					return;
				}
				var _weather = Smile.template( 'weather' ),
					forecast;
				_.each( data.forecast.simpleforecast.forecastday, function( day ){
					if ( day.date.weekday_short == Smile.getWeekday(d) ){
						forecast = day;
						return;
					}
				});
				if ( undefined !== forecast ) {
					$( element ).html( _weather( forecast ) );
				}
			}
		});
	}

	$( document ).on( 'event-loaded', Smile.a11y.check );
	$( document ).on( 'event-loaded', Smile.a11y.weather );

}( jQuery ) );
