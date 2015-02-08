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
		var token, expires;
		if ( location.hash ) {
			var hash = Smile.Meetup.parseHash( location.hash );
			console.log( hash );
			if ( hash.expires_in && hash.access_token ) {
				localStorage.setItem( 'meetup-token', hash.access_token );
				var seconds = Math.floor(Date.now() / 1000);
				expires = seconds + parseInt( hash.expires_in );
				localStorage.setItem( 'meetup-token-expires', expires );
			}
		}
		token = localStorage.getItem( 'meetup-token' );
		expires = localStorage.getItem( 'meetup-token-expires' );
		if ( token && Math.floor(Date.now() / 1000) < expires ) {
			$( ".meetup-login" ).html( "Connected to<br />Meetup.com" );
			Smile.Meetup.getEvents( token );
		}
	};

	Smile.Meetup.parseHash = function( hash ){
		var hashArray = hash.substring(1).split('&');
		var parsedHash = {};

		for ( var i = 0; i < hashArray.length; i++ ) {
			parsedHash[hashArray[i].split('=')[0]] = hashArray[i].split('=')[1];
		}
		return parsedHash;
	}

	Smile.Meetup.getEvents = function( token ){
		$.ajax( 'https://api.meetup.com/2/events', {
			data: {
				access_token: token,
				rsvp: "yes,waitlist,maybe"
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
