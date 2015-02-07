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
