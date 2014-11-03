RangeSlider
===========
## [DEMO, or it didn't happen](http://nigelnsf.github.io/RangeSlider/)

RangeSlider is a simple slider built ontop of [jQuery UI Draggable](http://jqueryui.com/draggable/#constrain-movement)

This was built over a weekend to fill a need for a decent range/slider for setting the level of difficulty of test questions. The dual-handle slider allows for filtering out minima and maxima values.

## Built With
[jQuery 2+](https://code.jquery.com/jquery-2.1.1.min.js)

[jQuery UI (.js only)](https://code.jquery.com/ui/1.11.2/jquery-ui.min.js)

## Minimal Browser Tests
* Chrome 38.0.2125.111 *Recommended
* Firefox 32.0.3
* Safari 8.0

## Features
* localStorage of state and view
* Sliders move by either: drag, or clicking adjacent spaces
* Supports different amount of `.num` elements
* Currently `.num` can only contain unsigned integers
* Responsive
* Works on touchscreen (tested recent iOS, Android)

## HTML
* The container needs a unique id.
* Must have 1 or 2 `.slider_handle` elements.
* `.handle_left` must be first, and `.handle_right` must be last.
* Supports multiple `.slider` things on same page.

```html
<div class="slider" id="uniqueID">
  <span class="slider_handle handle_left"></span>
  <span class="num">1</span>
  <span class="num">2</span>
  <span class="num">3</span>
  <span class="num">4</span>
  <span class="num">5</span>
  <span class="num">6</span>
  <span class="num">7</span>
  <span class="num">8</span>
  <span class="num">9</span>
  <span class="num">10</span>
  <span class="num">11</span>
  <span class="slider_handle handle_right"></span>
</div>
```

## JS
* jQuery UI attaches the slider handles with .draggable()
```javascript
$( ".slider_handle" ).draggable({
	containment: ".slider",
	snap: ".num",
	snapTolerance: 5, // (default 20)
	scroll: false ,
	drag: function( event, ui ) {
		// Stuff here...
	},
	stop: function( event, ui ){
		// Stuff here...
	}
});
```
* The localStorage key is set in the form: `"_slide-" + parentID + "-handle_left"`
* The localStorage value is the integer from `.num` text

## Events
The css is updated and localStorage are set by these ways:  

1.  on load `$(document).ready` => gets localStorage and sets css
2.  on viewport change `$(window).resize` => adjusts css from localStorage if exists
3.  dragging the `slider_handle` handle => snaps handle, and adjusts range css, sets localStorage
4.  stopping dragging the `slider_handle` handle => snaps handle to nearest place, sets localStorage
5.  clicking somewhere on the range => moves handles, sets localStorage

