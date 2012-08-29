tash.namespace( 'camerapi.filters' );

tash.events.require( 'camerapi.filters.ready' );

camerapi.filters.pixelated = {
	id: 'pixelated',
	name: "Pixelated",

	filter: function( context ) {

		var buff = {};
		// find a specified distance between two colours
		function findColorDifference(dif, dest, src) {
			/*
			var key = dif + '-' + dest + '-' + src,
				val;
			val = buff[key];
			if( !val ) {
				val = (dif * dest + (1 - dif) * src);
				buff[key] = val;
			}
			return val;
			*/
			return (dif * dest + (1 - dif) * src);
		}

		//console.log( "turning the image to grey...");
		var img = context.getImageData( 0, 0, context.canvas.width, context.canvas.height );
		var pix = img.data;
		var width = context.canvas.width;
		var height = context.canvas.height;

		for( var i = 0, n = pix.length; i < n; i+= 4 ) {
			var pos = i >> 2;
			var stepY = Math.floor(pos / width);
			var stepY1 = stepY % 20;
			var stepX = pos - (stepY * width);
			var stepX1 = stepX % 20;
			var thisPixel = {r: pix[i], g: pix[i + 1], b: pix[i + 2]};

			if (stepY1) pos -= stepY1 * width;
			if (stepX1) pos -= stepX1;
			pos = pos << 2;

			pix[i] = findColorDifference(1, pix[pos], thisPixel.r);
			pix[i + 1] = findColorDifference(1, pix[pos + 1], thisPixel.g);
			pix[i + 2] = findColorDifference(1, pix[pos + 2], thisPixel.b);

		}

		// a bit more verbose to reduce amount of math necessary
		context.putImageData( img, 0, 0 );
	}
};

camerapi.filters.ready.subscribe( function( filters ) {
	filters.addFilter( camerapi.filters.pixelated );
});