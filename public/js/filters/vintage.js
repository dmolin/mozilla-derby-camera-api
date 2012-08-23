tash.namespace( 'camerapi.filters' );

tash.events.require( 'camerapi.filters.ready' );

camerapi.filters.vintage = {
	name: "Vintage",

	filter: function( context ) {

		function clamp(val, min, max) {
            min = min || 0;
            max = max || 255;
            return Math.min(max, Math.max(min, val));
        }

		//console.log( "turning the image to grey...");
		var img = context.getImageData( 0, 0, context.canvas.width, context.canvas.height );
		var pix = img.data,
			kh = parseInt( pix.length / 2, 10),
            kw = parseInt( pix[0].length / 2, 10),
            i = 0, j = 0, n = 0, m = 0,
            h = context.canvas.height,
            w = context.canvas.width;

        for (i = 0; i < h; i++) {
            for (j = 0; j < w; j++) {
                var outIndex = (i*w*4) + (j*4);
                var r = 0, g = 0, b = 0;
                for (n = -kh; n <= kh; n++) {
                    for (m = -kw; m <= kw; m++) {
                        if (i + n >= 0 && i + n < h) {
                            if (j + m >= 0 && j + m < w) {
                                var f = kernel[n + kh][m + kw];
                                if (f === 0) {continue;}
                                var inIndex = ((i+n)*w*4) + ((j+m)*4);
                                r += pix[inIndex] * f;
                                g += pix[inIndex + 1] * f;
                                b += pix[inIndex + 2] * f;
                            }
                        }
                    }
                }
                pix[outIndex]     = clamp(r);
                pix[outIndex + 1] = clamp(g);
                pix[outIndex + 2] = clamp(b);
                pix[outIndex + 3] = 255;
            }
        }
		context.putImageData( img, 0, 0 );
	}
};

camerapi.filters.ready.subscribe( function( filters ) {
	filters.addFilter( camerapi.filters.vintage );
});