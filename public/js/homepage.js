(function($) {

tash.namespace( "camerapi" );
tash.namespace( 'camerapi.pages' );

tash.events.require( 'camerapi.grabbed');

camerapi.pages.homepage = {
    init: function() {
        var grabber = document.querySelector( '#grabber' ),
            image = new Image(),
            canvas = document.querySelector( '#picture2' ),
            ctx = canvas.getContext( "2d" ),
            imageContainerEl = document.querySelector( '#container .result' ),
            filters;

        grabber.addEventListener( "change", function( evt ) {
            //console.log( "image taken" );
            var files = evt.target.files,
                file;

            //show the filename in the 'fake' field
            $('#container .input .fake input').val( $('#grabber').val() );

            function urlConverted( data ) {
                image.addEventListener( "load", function() {
                    canvas.width = image.width;
                    canvas.height = image.height;
                    ctx.drawImage( image, 0, 0, image.width, image.height );
                    //signal image ready event
                    camerapi.grabbed.publish( ctx );
                });
                image.src = data;
            }

            if( !files || files.length === 0 ) {
                return;
            }
            file = files[0];

            camerapi.utils.convertToURL( file, urlConverted );

            imageContainerEl.style.display = 'block';
        });

        $('.saveme').click( function(){
            var data, type = type || "png", mimetype = "image/" + type;
            data = ctx.canvas.toDataURL( mimetype );
            data = data.replace( mimetype, "image/octet-stream" );
            window.location.href = data;
        });

    }
};

}( jQuery ) );



window.addEventListener( "load", function() {
    camerapi.pages.homepage.init();
});