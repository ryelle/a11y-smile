window.Smile = window.Smile || {};

(function($, undefined){
	Smile.template = _.memoize(function ( id ) {
		var compiled,
			options = {
				evaluate:    /<#([\s\S]+?)#>/g,
				interpolate: /\{\{\{([\s\S]+?)\}\}\}/g,
				escape:      /\{\{([^\}]+?)\}\}(?!\})/g,
				variable:    'data'
			};

		return function ( data ) {
			compiled = compiled || _.template( $( '#tmpl-' + id ).html(), null, options );
			return compiled( data );
		};
	});

	Smile.renderEvent = function( event ) {
		var _event = Smile.template( 'event' );
		$( document.getElementById( 'event-list' ) ).append( _event( event ) );
	};

}( jQuery ) );

window.Smile = window.Smile || {};

(function($, undefined){

	Smile.FB = {};

	// This is called with the results from from FB.getLoginStatus().
	Smile.FB.loginEvent = function( response ) {
		if (response.status === 'connected') {
			// Logged into your app and Facebook.
			$( ".facebook-login" ).html( "Connected to Facebook" );
			Smile.FB.loadEvents();
		}
	};

	// This function is called when someone finishes with the Login
	// Button.  See the onlogin handler attached to it in the sample
	// code below.
	Smile.FB.checkLoginState = function() {
		FB.getLoginStatus(Smile.FB.loginEvent);
	};

	// Here we run a very simple test of the Graph API after login is
	// successful.  See statusChangeCallback() for when this call is made.
	Smile.FB.loadEvents = function() {
		FB.api( '/me/events', function(response) {
			if ( response.data.length == 0 ){
				return;
			}
			_.each( response.data, Smile.FB.fetchEvent );
		});
	};

	Smile.FB.fetchEvent = function( event, key, list ){
		FB.api( '/' + event.id , function(response) {
			if ( response.error ) {
				// Ignore errors
				return;
			}
			response.service = 'facebook';
			response.a11y = 'unknown';
			response.venue.name = response.location;
			Smile.renderEvent( response );

			$( document ).trigger( 'event-loaded', response );
		});
	};

}( jQuery ) );

window.fbAsyncInit = function() {
	FB.init({
		appId      : '1531058637168342',
		xfbml      : true,
		cookie     : true,
		version    : 'v2.1'
	});

	FB.getLoginStatus(Smile.FB.loginEvent);
};

// Load the SDK asynchronously
(function(d, s, id) {
	var js, fjs = d.getElementsByTagName(s)[0];
	if (d.getElementById(id)) return;
	js = d.createElement(s); js.id = id;
	js.src = "//connect.facebook.net/en_US/sdk.js";
	fjs.parentNode.insertBefore(js, fjs);
}( document, 'script', 'facebook-jssdk' ) );

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
