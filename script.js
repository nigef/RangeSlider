


// set on load
$(document).ready(function() {
	moveHandlesFromStorage();
});


/*
for window resizing, fit right handle onto window, even the left one too,
when handle has been moved and set, attach to window resize event, but only if 
$(".slider").is(":visible")...
*/
$(window).resize(function() {
	moveHandlesFromStorage();
});



// Set percent widths on load, and on resize viewport
// get localStorage number to set handles
function moveHandlesFromStorage() {
	$(".slider").each(function(index, element) {
		var anyHandle;
		var id = element.id;
		var self = $(this);
		
		// override widths if people use less than 11 items
		var lengthNum = $(self).find('.num').length;
		var amt = (100/lengthNum) + "%";
		$(self).find('.num').each(function(){
		  $(this).css('width', amt);
		});
		$(self).find('.slider_handle').css('width', amt);
		
		// set this with localStorage so can get detect the number selected
		var handle_left = Number(localStorage.getItem("_slide-"+id+"-handle_left"));
		var handle_right = Number(localStorage.getItem("_slide-"+id+"-handle_right"));
		
		// sometimes will not have handle_left, or handle_right, if never set
		if ( $(self).is(":visible") && id ) {
		
			// zero based
			if ( handle_left ) {
				var handle = $('#'+id+" .handle_left");
				var left_num_offset = $('#'+id+' .num')[handle_left-1].offsetLeft;
				$(handle).css("left",left_num_offset);
				var anyHandle = handle;
			}
			// handle separately
			if ( handle_right ) {
				var handle = $('#'+id+" .handle_right");
				var right_num_offset = $('#'+id+' .num')[handle_right-1].offsetLeft;
				$(handle).css("left",right_num_offset);
				var anyHandle = handle;
			}
			
		} else {
			alert("Error, cannot process handle placements.")
		}
		
		// need to display range UI on first load, if no localStorage, or anything
		if ( anyHandle === undefined ) {
			if ( $(self).find(".handle_left").length ) {
				var anyHandle = $(self).find(".handle_left");
			} else {
				var anyHandle = $(self).find(".handle_right");
			}
		}
		
		// sanity check
		if ( anyHandle != undefined && anyHandle.length ) {
			// send any handle over to render the range view
			sliderRangeView( anyHandle );
		}
	});
}



// Set localStorage of slider handle
// check against string containging classes
function sliderHandleLocalStorage(parentID, handleSide, value) {
	var key;
	var matchLeft = handleSide.match(/((l|L)eft)/g);
	var matchRight = handleSide.match(/((r|R)ight)/g);
	if ( matchLeft && parentID ) {
		key = "_slide-"+parentID+"-handle_left";
	} else if ( matchRight && parentID ) {
		key = "_slide-"+parentID+"-handle_right";
	} else {
		alert("Cannot determine the value desired range");
	}
	localStorage.setItem(key, value);
}




// generate the shading view between the two handles
// if slider has two handles => make range between them
// if slider is left handle only => range starts from bottom, 1
// if slider is right handle only => range starts from top, 11
// 'anyHandle' makes no assumption about which handle sent: left or right
// 'anyHandle' is the DOM object
function sliderRangeView( anyHandle ) {
	var sliderContainer = anyHandle[0].offsetParent;
	var handleLeft = $(sliderContainer).find(".handle_left");
	var handleRight = $(sliderContainer).find(".handle_right");		
	var numArray = [];
	var handleArrayLeftPositions = [];
	
	// get array of num objects
	$(sliderContainer).find(".num").each(function() {
		// could refactor, this is repeated once, elsewhere below
		var numLeft = $(this)[0];
		numArray.push(numLeft);
	});
	var numNums = numArray.length;
	
	// if both: color to right of leftmost handle
	if ( handleLeft.length && handleRight.length ) {
		var leftPosition = handleLeft[0].offsetLeft;
		var rightPosition = handleRight[0].offsetLeft;
		
		// compare left position of left_handle to left position of all nums in array
		// add highlight class to all nums positioned right of handle...
		for (var i = 0; i < numNums; i++) {
			var numPosition = numArray[i].offsetLeft;
			
			// remove existing first
			$(numArray[i]).removeClass("inRange");
			
			// add class to nums left of leftmost handle
			if ( leftPosition <= numPosition ) {
				$(numArray[i]).addClass("inRange");
			}
			
			// remove class from nums right of rightmost handle
			// not including the num under rightmost handle
			if ( rightPosition < numPosition ) {
				$(numArray[i]).removeClass("inRange");
			}
		}
	}
	
	// if just leftmost, color everything to right
	if ( handleLeft.length && !handleRight.length ) {
		
		var leftPosition = handleLeft[0].offsetLeft;
		
		for (var i = 0; i < numNums; i++) {
			var numPosition = numArray[i].offsetLeft;
			
			// remove existing first
			$(numArray[i]).removeClass("inRange");
			
			// add class to nums
			if ( leftPosition <= numPosition ) {
				$(numArray[i]).addClass("inRange");
			}
		}
	}
	
	// if just rightmost, color everything to left
	if ( handleRight.length && !handleLeft.length ) {
		
		var rightPosition = handleRight[0].offsetLeft;
		
		for (var i = 0; i < numNums; i++) {
			var numPosition = numArray[i].offsetLeft;
			
			// remove existing first
			$(numArray[i]).removeClass("inRange");
			
			// add class to nums
			if ( rightPosition >= numPosition ) {
				$(numArray[i]).addClass("inRange");
			}
		}
	}
}


// Get it going
$(document).ready(function() {
	
	// Attach drag UI
	$( ".slider_handle" ).draggable({
		containment: ".slider",
		snap: ".num",
		snapTolerance: 5, // keep it low to avoid the jerky (default 20)
		scroll: false ,
		
		
		// prevent handles from crossing
		// and fix containment issue
		drag: function( event, ui ) {
			var handle = event.target;
			var instantWidth = event.target.offsetWidth;
			var lastNum = $(event.target.offsetParent).find(".num").filter(":last")[0].offsetLeft;
			
			// sanity check: should be '.slider_handle'
			// because single slider handles don't always have the
			// firstElementChild or lastElementChild as a .slider_handle
			var staticLeft = event.target.offsetParent.firstElementChild;
			if ( $(staticLeft).hasClass("slider_handle") ) {
				var staticLeftLeft = staticLeft.offsetLeft;
				var staticLeftWidth = staticLeft.offsetWidth;
			}
			
			var staticRight = event.target.offsetParent.lastElementChild;
			if ( $(staticRight).hasClass("slider_handle") ) {
				var staticRightLeft = staticRight.offsetLeft;
			}
			
			// ui.position.left is currently dragged handle
			// this part is not affected by single lone handles
			// Careful: ! gotcha, no such thing as ui.position.right
			// if dragging left handle
			if ( (ui.position.left + instantWidth) > staticRightLeft && $(handle).hasClass("handle_left") ) { 
	      ui.position.left = (staticRightLeft - instantWidth);
	      
	      // if dragging right handle
	    } else if ( ui.position.left < (staticLeftLeft + staticLeftWidth) && $(handle).hasClass("handle_right") ) { 
	    	ui.position.left = (staticLeftLeft + staticLeftWidth);
	    }
	    
	    // Correct containment issue where handles slide 
	    // outside of .slider container, left and right sides.
	    if ( ui.position.left < 0) {
	    	ui.position.left = 0;
	    } else if ( ui.position.left > lastNum ) {
	    	ui.position.left = lastNum;
	    }
	    
	    // update the view
	    var anyHandle = $(handle);
	    sliderRangeView( anyHandle );
		},
		
		
		
		// When drag stopped
		// console log the event, ui stuff to see hooks/objects/whatever
		stop: function( event, ui ){
			// get position of dragged handle
			var handle = $(ui.helper[0]);
			var parentID = handle[0].offsetParent.id;
			var classNames = handle[0].className;
			var handleLeft = handle[0].offsetLeft;
			var container = handle.parents(".slider");
			
			// make array of positions of each num
			var numArray = [];
			$(container).find(".num").each(function() {
				var numLeft = $(this)[0].offsetLeft;
				numArray.push(numLeft);
			})
			
			// make comparison, find closest num
			// store index (integer, position in array) of lowest diff here
			var distance = [];
			var lowestIndex = 0;
			var lowestValue = 99999;
			var compareLength = numArray.length;
			for (var i = 0; i < compareLength; i++) {
				var diff = Math.abs(numArray[i] - handleLeft);
				if ( diff < lowestValue ) {
					lowestIndex = i;
					lowestValue = diff;
				}
				distance.push(diff);
			}
			var newNum = numArray[lowestIndex];
			
			// animate to this position
			$(handle).animate(
				{left: newNum}, 
				60,
				"swing",
				function() {
					var anyHandle = $(handle);
					sliderRangeView(anyHandle); // update the view
				}
			);
			
			var num = lowestIndex+1;
			
			// localStorage
			sliderHandleLocalStorage(parentID, classNames, num);
		}
	});
})






// Added functionality
// clicking on num divs should snap nearest handle to it
// compare and move handle closest to click target
$('html').on("click", ".num", function(e) {
	var parentContainer = e.target.offsetParent;
	var parentID = parentContainer.id;
	var target_x = e.target.offsetLeft;
	var num = Number(e.target.textContent);
	var handle_left = $(parentContainer).find(".handle_left");
	var handle_right = $(parentContainer).find(".handle_right");
	
	// If container has left handle
	if ( handle_left.length ) {
		var handle_left_x_left = handle_left[0].offsetLeft;
		var handle_left_width = handle_left[0].offsetWidth;
		var handle_left_center = handle_left_x_left + (handle_left_width/2);
		var left_handle_distance = Math.abs(handle_left_center - target_x);
	}
	
	// If container has right handle
	if ( handle_right.length ) {
		var handle_right_x_left = handle_right[0].offsetLeft;
		var handle_right_width = handle_right[0].offsetWidth;
		var handle_right_center = handle_right_x_left + (handle_right_width/2);
		var right_handle_distance = Math.abs(handle_right_center - target_x);
	}
	
	// If both handles exist in slider
	// Logic: which handle is closer to the click
	if ( left_handle_distance < right_handle_distance || !right_handle_distance ) {
		// closer to left, or only left handle exists
		$(handle_left).animate(
			{left: target_x}, 
			60,
			"swing",
			function() {
				sliderRangeView(handle_left) // update the view
			}
		);
		sliderHandleLocalStorage(parentID, "handle_left", num);
		var anyHandle = handle_left;
	} else if ( left_handle_distance > right_handle_distance || !left_handle_distance ) {
		// closer to right, or only right handle exists
		// weird bug where right animates from left: 0 always at beginning,
		// so need to feed it this initial value.
		$(handle_right).css("left", handle_right_x_left);
		$(handle_right).animate(
			{left: target_x}, 
			60,
			"swing",
			function() {
				sliderRangeView(handle_right) // update the view
			}
		);
		sliderHandleLocalStorage(parentID, "handle_right", num);
		var anyHandle = handle_right;
	} 
});