window.Smile = window.Smile || {};

(function($, undefined){

	Smile.FB = {};

	// This is called with the results from from FB.getLoginStatus().
	Smile.FB.loginEvent = function( response ) {
		if (response.status === 'connected') {
			// Logged into your app and Facebook.
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
