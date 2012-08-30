(function($) {

tash.namespace( "camerapi" );
tash.namespace( 'camerapi.pages' );

tash.events.require( 'camerapi.grabbed');
tash.events.require( 'camerapi.reset');

camerapi.pages.homepage = {
    init: function() {
        var grabber = document.querySelector( '#grabber' ),
            cameraButtonEl = $('.camera-button button'),
            image = new Image(),
            canvas = document.querySelector( '#picture2' ),
            ctx = canvas.getContext( "2d" ),
            imageContainerEl = $( '#container .result' ),
            filters,
            original;

        cameraButtonEl.click( function() {
            $(grabber).trigger('click');
        });

        camerapi.grabbed.subscribe( function() {
            //hide the button
            $('#shot-view').hide();
            //show result view
            $('.options').slideDown( function() {
                $('#container').css('top', $('header').height() + 'px');
                imageContainerEl.show();
            });
        });

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

                    //keep a copy of the original data for recovery
                    original = ctx.getImageData( 0, 0, ctx.canvas.width, ctx.canvas.height );

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

        });

        $('.another').click( function() {
            $('.result').hide();
            try {
                ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height );
            } catch( ignored ){}
            $('.options').slideUp( function() {
                $('#container').css('top', $('header').height() + 'px');
            });
            camerapi.reset.publish( ctx );
            $('#shot-view').show();
        });

        $('.restore').click( function() {
            ctx.putImageData( original, 0, 0 );
        });

        $('.saveme').click( function(){
            var data, type = "png", mimetype = "image/" + type;
            var prev = window.location.href;
            data = ctx.canvas.toDataURL( mimetype );
            data = data.replace( mimetype, "image/octet-stream" );
            window.location.href = data;
            window.location.href = prev;
        });

    }
};

}( jQuery ) );



window.addEventListener( "load", function() {
    camerapi.pages.homepage.init();
});