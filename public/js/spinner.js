(function($) {

tash.events.require( 'camerapi.filters.ready' );
tash.events.require( 'camerapi.activity.start');
tash.events.require( 'camerapi.activity.stop');

function addSpinner( filterName, canvas ) {
	console.log( 'starting spinner...' );
	if( $('.spinner', $(canvas).parent()).length === 0 ) {
		//add markup to the container
		var spinnerEl = $('<div class="spinner">Applying filter ' + filterName + '...</div>' );
		$(canvas).parent().append( spinnerEl );
		$(canvas).css('opacity', '0.3');
	}
}

function removeSpinner( filterName, canvas ) {
	console.log( 'stopping spinner...' );
	if( $('.spinner', $(canvas).parent() ).length > 0 ) {
		$('.spinner', $(canvas).parent() ).remove();
		$(canvas).css('opacity', '1');
	}
}

camerapi.filters.ready.subscribe( function(filters) {
	//subscribe this spinner
	console.log( 'registering spinner...' );
    camerapi.activity.start.subscribe(addSpinner);
    camerapi.activity.stop.subscribe( removeSpinner );

} );

}(jQuery));