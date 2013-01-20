mozilla-derby-camera-api
========================

Shoot a picture with your device camera and apply a filter!
Finalist at Mozilla Derby August 2012 (even though it was built in less than 2 days). 

![See the picture](https://developer.cdn.mozilla.net/media/uploads/demos/d/m/dmolin/32e3a962711d808b80581a95716c3e98/1346370491_screenshot_1.png)

An Example project leveraging the new Camera API

[See the Demo on the Mozilla Website!](https://developer.mozilla.org/en-US/demos/detail/shot-filter)

### Technologies Used ####

- jQuery 1.7
- Tash! (my other Github project. see it [Here](https://github.com/dmolin/tash))


### Reactive Components all around ###

This example leverages the concept of reactive components. A system made of reactive components take advantage of loose coupling and it's thus resilient to change and easy to extend and test in isolation.

Each of the components is literally "dropped" into the system and starts interacting with it through events and event buses.

The Filters panel is an example of that.
When a picture is shot with the camera API and the picture data is available, an event it published:

```javascript
		//signal image ready event
		camerapi.grabbed.publish( ctx );
```

That event signals to any other interested component in the system that an image has been made available.
The Filter panel (public/filters.js) is subscribed to that (and others) event and reacts accordingly, popping up from the bottom of the screen and letting the user apply filters to the grabbed image:

```javascript
        //listen for events
        camerapi.grabbed.subscribe( imageReady );
        camerapi.filters.ready.publish( self );
        camerapi.reset.subscribe( onReset );
```

Each provided filter is a small indipendent widget that registers itself in the system when the Filters panel publish its "ready" event:

```javascript
camerapi.filters.bw = {
	id: 'bw',
	name: "Black & White",

	filter: function( context ) {
		....
	}
};

camerapi.filters.ready.subscribe( function( filters ) {
	filters.addFilter( camerapi.filters.bw );
});
```

Adding new filters is just a matter of adding new files to the "filters" folder.


### Microtemplating framework ###

Available with [Tash!](https://github.com/dmolin/tash)) is a Microtemplating framework; it's just a small function

`tash.utils.template( templateHtmlMarkup, jsonSubstitutionObject )`

This simple function (in less than 7 lines of code) allow us to easily compose small templates:

```javascript
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

markup = tash.util.template( templates.filter, {name: filters[i].name, id: filters[i].id } );
$('#filters').append($(markup));
``` 
