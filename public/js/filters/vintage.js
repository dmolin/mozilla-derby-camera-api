tash.namespace( 'camerapi.filters' );

tash.events.require( 'camerapi.filters.ready' );

camerapi.filters.vintage = {
	id: 'vintage',
	name: "Vintage",

	filter: function( context ) {

		//console.log( "turning the image to grey...");
		var img = context.getImageData( 0, 0, context.canvas.width, context.canvas.height );
		var pix = img.data;
		context.putImageData( img, 0, 0 );
	}
};

camerapi.filters.ready.subscribe( function( filters ) {
	filters.addFilter( camerapi.filters.vintage );
});