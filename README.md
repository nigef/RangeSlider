RangeSlider
===========

RangeSlider is a simple slider built ontop of [jQuery UI Draggable](http://jqueryui.com/draggable/#constrain-movement)

This is was quickly built to fill the need for a decent range/slider for setting the level of difficulty of test questions. It has not been optimized or refactored.

## Built With
[jQuery 2+](https://code.jquery.com/jquery-2.1.1.min.js)

[jQuery UI (.js only, not .css)](//ajax.googleapis.com/ajax/libs/jqueryui/1.11.2/themes/smoothness/jquery-ui.css)

## Features
* localStorage
* Sliders move by either: drag, or clicking adjacent spaces
* Supports different amount of '.num' elements

## HTML
* The container needs a unique id.
* Must have 1 or 2 '.slider_handle' elements.
* '.handle_left' must be first, and '.handle_right' must be last.
* Supports multiple sliders on same page.

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
* Attach the handles with .draggable()
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
The css updated is triggered by these ways
1. on load `$(document).ready` => gets localStorage and sets css
2. on viewport change `$(window).resize` => adjusts css from localStorage if exists
3. dragging the `slider_handle` handle => snaps handle, and adjusts range css, sets localStorage
4. stopping dragging the `slider_handle` handle => snaps handle to nearest place, sets localStorage
5. clicking somewhere on the range => moves handles, sets localStorage

## Issues
* Safari and FF interpretation of `inline-flex` requires `margin-right: -4px;` on `.num` elements
* Unfortunately, current workaround uses browser sniffing
