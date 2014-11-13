var math = require('../utils/math')
var util = require('util');
var widget = require('../core/widget');

/** 
	@class slider      
	Slider (vertical or horizontal)
	```html
	<canvas nx="slider"></canvas>
	```
	<canvas nx="slider" style="margin-left:25px"></canvas>
*/

var slider = module.exports = function (target) {
	this.defaultSize = { width: 30, height: 100 };
	widget.call(this, target);
	
	//unique attributes
	/** @property {float}  val   Slider value (float 0-1)
	*/
	this.val.value = 0.7

	/** @property {string}  mode   Set "absolute" or "relative" mode. In absolute mode, slider will jump to click/touch position. In relative mode, it does not.
	```js
	nx.onload = function() {
	    // Slider will not jump to touch position.
	    slider1.mode = "relative" 
	}
	```
	*/
	this.mode = "absolute";

	// handling horiz possibility
	/** @property {boolean}  hslider   Whether or not the slider should be horizontal. This is set to true *automatically* if the canvas is wider than it is tall. To override the default decision, set this property to true to create a horizontal slider, or false to create a vertical slider.
	
	```js
	nx.onload = function() {
		//forces horizontal slider 
	    slider1.hslider = true
	    //forces vertical slider 
	    slider2.hslider = false
	}
	```
	*/
	this.hslider = false;
	this.handle;
	this.relhandle;
	this.cap;
	this.init();
}
util.inherits(slider, widget);

slider.prototype.init = function() {

	//decide if hslider or vslider
	if (this.height>=this.width) {
		this.hslider = false;
	} else {
		this.hslider = true;
	}

	this.realSpace = { x: this.width-this.lineWidth*2, y: this.height-this.lineWidth*2 }

	if (this.canvas.getAttribute("label")!=null) {
		this.label = this.canvas.getAttribute("label");
	}

	this.draw();
}

slider.prototype.draw = function() {
	this.erase();
	this.makeRoundedBG();
		
	with (this.context) {
		strokeStyle = this.colors.border;
		fillStyle = this.colors.fill;
		lineWidth = this.lineWidth;
		stroke();
		fill();
		
		fillStyle = this.colors.accent;
	
		if (!this.hslider) {

			var x1 = this.lineWidth;
			var y1 = this.height-this.val.value*this.height;
			var x2 = this.lineWidth+this.realSpace.x;
			var y2 = this.height-this.lineWidth;
			var depth = 0;

			if (this.val.value>0.01) {
				fillRect(x1,y1,x2-x1,y2-y1);
			}
			
			if (nx.showLabels) {

				save();
	 			translate(this.width/2, 0);
				rotate(Math.PI/2);
				textAlign = "left";
				textBaseline = "middle";
				font = "bold 15px courier";
				fillStyle = this.colors.accent;
				globalAlpha = 0.3;
				fillText(this.label, this.width/2, 0);
				globalAlpha = 1;
				restore();
			
			}
		} else {

			var x1 = this.lineWidth;
			var y1 = this.lineWidth;
			var x2 = this.lineWidth+this.val.value*this.realSpace.x;
			var y2 = this.height-this.lineWidth;
			var depth = 0;
		   
			if (this.val.value>0.01) {
				fillRect(x1,y1,x2-x1,y2-y1);
			}
			
			if (nx.showLabels) {

				textAlign = "center";
				textBaseline = "middle";
				font = "bold 15px courier";
				fillStyle = this.colors.accent;
				globalAlpha = 0.3;
				fillText(this.label, this.width/2, this.height/2);
				globalAlpha = 1;
			
			}
		}
	}
}

slider.prototype.click = function() {
	this.move();
}

slider.prototype.move = function() {
	if (this.hslider) {
		this.handle = this.clickPos.x;
		this.relhandle = this.deltaMove.x;
		this.cap = this.width;
	} else {
		this.handle = this.clickPos.y;
		this.relhandle = this.deltaMove.y*-1;
		this.cap = this.height
	}

	if (this.mode=="absolute") {
		if (this.clicked) {
			if (!this.hslider) {
				this.val.value = (Math.abs((math.clip(this.clickPos.y/this.height, 0, 1)) - 1));
			} else {	
				this.val.value = math.clip(this.clickPos.x/this.width, 0, 1);
			}
			this.draw();
		}
	} else if (this.mode=="relative") {
		if (this.clicked) {
			if (!this.hslider) {
				this.val.value = math.clip((this.val.value + ((this.deltaMove.y*-1)/this.height)),0,1);
			} else {
				this.val.value = math.clip((this.val.value + ((this.deltaMove.x)/this.width)),0,1);
			}
			this.draw();
		}
	}
	//	var scaledVal = ( this.val.value - 0.02 ) * (1/.97);
	this.nxTransmit(this.val);
}