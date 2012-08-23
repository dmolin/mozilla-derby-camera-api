tash.namespace( 'camerapi.filters' );

tash.events.require( 'camerapi.filters.ready' );

camerapi.filters.bw = {
	id: 'bw',
	name: "Black & White",

	filter: function( context ) {
		//console.log( "turning the image to grey...");
		var img = context.getImageData( 0, 0, context.canvas.width, context.canvas.height );
		var pix = img.data;
		var grayscale;
		//each pixel has 4 values (rgb+alpha)
		for( var i = 0, n = pix.length; i < n; i+= 4 ) {
			//luminance: red*0.3 + green*0.59 + blue*0.11
			grayscale = pix[i  ]*0.3 + pix[i+1]*0.59 + pix[i+2]*0.11;
			pix[i  ] = grayscale;
			pix[i+1] = grayscale;
			pix[i+2] = grayscale;
		}
		context.putImageData( img, 0, 0 );
	}
};

camerapi.filters.ready.subscribe( function( filters ) {
	filters.addFilter( camerapi.filters.bw );
});