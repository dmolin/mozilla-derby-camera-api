(function($) {

tash.namespace( "camerapi.data" );

tash.events.require( 'camerapi.grabbed');
tash.events.require( 'camerapi.filters.ready' );
tash.events.require( 'camerapi.filters.visible' );
tash.events.require( 'camerapi.activity.start');
tash.events.require( 'camerapi.activity.stop');
tash.events.require( 'camerapi.reset');

camerapi.Filters = {
    create: function( selector, parent ) {
        var el = $(selector),
            self = {},
            filters = [],
            i,
            context,
            height = 160;

        function imageReady( ctx ) {

            context = ctx;

            //activate the panel and show the available filters
            el.css('bottom', '-' + height + 'px' );
            el.height( height + 'px' );
            el.animate( {bottom: '0' } );

            //alter parent height
            $(parent).css( 'bottom', height + 'px' );

            //show filters
            var filter, ulEl;
            el.empty();
            ulEl = $( "<ul>" );

            for( i = 0; i < filters.length; i++ ) {
                filter = $( tash.util.template( templates.filter, {name: filters[i].name, id: filters[i].id } ) );
                ulEl.append( filter );

                $('a', filter ).click( (function( filt, cont ){
                    return function() {
                        camerapi.activity.start.publish( [filt.name, cont.canvas] );
                        setTimeout( function() {
                            filt.filter( cont );
                            camerapi.activity.stop.publish( [filt.name, cont.canvas] );
                        }, 300 );
                    };
                }( filters[i], context ) ) );
            }
            el.append( ulEl );
        }

        function onReset() {
            //el.animate( {bottom: '-140px' } );
            el.css( 'bottom', '-' + height + 'px' );
        }

        self.addFilter = function addFilter( filter ) {
            //a valid filter must have the 'filter' function
            if( !filter || typeof filter.filter !== 'function' ) {
                return false; //do not add the filter
            }
            filters.push( filter );
        };

        self.getFilters = function getFilters() {
            return [].concat( filters );
        };

        //listen for events
        camerapi.grabbed.subscribe( imageReady );
        camerapi.filters.ready.publish( self );
        camerapi.reset.subscribe( onReset );

        return self;
    }
};

var templates = {
    filter: [
        "<li>",
            "<a href='#' alt='apply this filter'>",
                "<div class='filter'>",
                    "<img src='images/thumb_{{id}}.png'>",
                    "<span class='name'>{{name}}</span>",
                "</div>",
            "</a>",
        "</li>"
    ].join('')
};


$(document).ready( function() {
    camerapi.data.filters = camerapi.Filters.create( '#filters', '#container' );
});

}( jQuery ));

