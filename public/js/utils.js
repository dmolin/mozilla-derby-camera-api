tash.namespace( 'camerapi' );

camerapi.utils = camerapi.utils || {};

camerapi.utils.convertToURL = function convertToURL( src, cb ) {
    var URL = window.URL || window.webkitURL,
        imgURL, fr ;

    try {
        imgURL = URL.createObjectURL( src );
        cb( imgURL );
        URL.revokeObjectURL( src );
    } catch( e ) {
        try {
            //fallback to FileReader
            fr = new FileReader();
            fr.addEventListener( "load", function( evt ) {
                //data available
                cb( evt.target.result );
            });
            fr.readAsDataURL( src );
        } catch( e2 ) {
            console.log( "Neither createObjectURL nor FileReader are supported" );
        }
    }
};