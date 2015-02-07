window.Smile = window.Smile || {};

(function($, undefined){

	var API_URL = "https://secure.meetup.com/oauth2/authorize",
		location = window.location;

	Smile.Meetup = {};

	Smile.Meetup.login = function(){
		var url = API_URL + '?client_id=3g07h3805fmm4fqr2h8b17tjs4&response_type=token&redirect_uri=' + location.href;
		window.location.assign( url );
	};

	Smile.Meetup.initialize = function(){
		var token;
		if ( location.hash && ( match = location.hash.match( /access_token=(.*)/ ) ) ) {
			token = match[1];
			localStorage.setItem( 'meetup-token', token );
		} else if ( ! localStorage.getItem( 'meetup-token' ) ) {
			if ( location.hash && ( match = location.hash.match( /access_token=(.*)/ ) ) ) {
				token = match[1];
				localStorage.setItem( 'meetup-token', token );
			}
		}
		token = localStorage.getItem( 'meetup-token' )
		console.log( token );
		if ( token ) {
			Smile.Meetup.getEvents( token );
		}
	};

	Smile.Meetup.getEvents = function( token ){
		$.ajax( 'https://api.meetup.com/2/events', {
			data: {
				access_token: token,
				rsvp: "yes,waitlist,maybe,none"
			},
			dataType: 'jsonp',
			success: Smile.Meetup.renderEvents
		});
	};

	Smile.Meetup.renderEvents = function( response ){
		if ( undefined == response.results ) {
			// Ignore errors
			return;
		}
		_.each( response.results, Smile.Meetup.renderEvent );
	};

	Smile.Meetup.renderEvent = function( event ){
		if ( undefined == event.venue ) {
			// No venue? Nothing to see
			return;
		}
		// console.log( event );
		var data = event;
		data.service = 'meetup';
		data.a11y = 'unknown';
		data.venue.street = data.venue.address_1;
		data.venue.latitude = data.venue.lat;
		data.venue.longitude = data.venue.lon;

		Smile.renderEvent( data );

		$( document ).trigger( 'event-loaded', data );
	}

	$(".meetup-login").on( 'click', Smile.Meetup.login );
	$( document ).ready( Smile.Meetup.initialize );

}( jQuery ) );
