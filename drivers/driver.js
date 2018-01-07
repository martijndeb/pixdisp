'use strict';

/**
 * Basic matrix driver which every implementation can derive from
 */
class Driver {
	constructor() {

		// Some sane-ish defaults
		this.setSize( 16, 16 );
		this.setBrightness( 1 );

		this.flipHorizontal = false;
		this.flipVertical = false;

	}

	/**
	 * Sets the display size
	 */
	setSize( w, h ) {
		this.width = w;
		this.height = h;

		this.clearMatrix();
	}

	/**
	 * Return an object containing the width and height
	 */
	getSize() {
		return {
			width: this.width,
			height: this.height
		};
	}

	/**
	 * Sets brightness between 0.0f and 1.0f
	 */
	setBrightness( v ) {
		this.brightness = v;
	}

	/**
	 * Gets the current brightness
	 */
	getBrightness() {
		return this.brightness;
	}

	/**
	 * CLear the matrix with the following color, from 0..255
	 */
	clear( r = 0, g = 0, b = 0, a = 1 ) {
		for ( let x = 0; x < this.width; x++ ) {
			for ( let y = 0; y < this.height; y++) {
				this.setPixel( x, y, r, g, b, a );
			}
		}
	}

	/**
	 * Set pixel color
	 */
	setPixel( x, y, r = 0, g = 0, b = 0, a = 1 ) {
		if ( x >= 0 && x < this.width &&
			y >= 0 && y < this.height ) {
			this.matrix[x][y].r = r;
			this.matrix[x][y].g = g;
			this.matrix[x][y].b = b;
			this.matrix[x][y].a = a;
		}
	}

	/**
	 * Return the pixel color
	 */
	getPixel( x, y ) {
		if ( x >= 0 && x <= this.width &&
			y >= 0 && y <= this.height ) {
			return {
				r: this.matrix[x][y].r,
				g: this.matrix[x][y].g,
				b: this.matrix[x][y].b,
				a: this.matrix[x][y].a
			};
		}

		return {
			r: -1,
			g: -1,
			b: -1,
			a: -1
		};
	}

	/**
	 * Draw a line from x1,y1 to x2,y2
	 */
	drawLine( x1, y1, x2, y2, r = 0, g = 0, b = 0, a = 1 ) {
		let dx = x2 - x1;
		let dy = y2 - y1;

		for ( let x = x1; x <= x2; x++ ) {
			let y = Math.floor( y1 + dy * ( x - x1 ) / dx );

			this.setPixel( x, y, r, g, b, a );
		}
	}

	/**
	 * Draw a rectangle from x,y with dimensions w,h
	 */
	drawRect( x1, y1, w, h, r = 0, g = 0, b = 0, a = 1 ) {
		for ( let x = x1; x < x1 + w; x++ ) {
			this.setPixel( x, y1, r, g, b, a );
			this.setPixel( x, y1 + h - 1, r, g, b, a );
		}

		for ( let y = y1; y < y1 + h - 1; y++ ) {
			this.setPixel( x1, y, r, g, b, a );
			this.setPixel( x1 + w - 1, y, r, g, b, a );
		}
	}

	/**
	 * Draw a rectangle from x,y with dimensions w,h
	 */
	drawRectFilled( x1, y1, w, h, r = 0, g = 0, b = 0, a = 1 ) {
		for ( let x = x1; x < x1 + w; x++ ) {
			for ( let y = y1; y < y1 + h; y++ ) {
				this.setPixel( x, y, r, g, b, a );
			}
		}
	}

	/**
	 * Draws a circle at x,y with radius r
	 */
	drawCircle( x1, y1, radius, r = 0, g = 0, b = 0, a = 1 ) {
		let x = radius - 1;
		let y = 0;
		let dx = 1;
		let dy = 1;
		let err = dx - ( radius << 1 );

		while ( x >= y ) {
			this.setPixel( x1 + x, y1 + y, r, g, b, a );
			this.setPixel( x1 + y, y1 + x, r, g, b, a );
			this.setPixel( x1 - y, y1 + x, r, g, b, a );
			this.setPixel( x1 - x, y1 + y, r, g, b, a );
			this.setPixel( x1 - x, y1 - y, r, g, b, a );
			this.setPixel( x1 - y, y1 - x, r, g, b, a );
			this.setPixel( x1 + y, y1 - x, r, g, b, a );
			this.setPixel( x1 + x, y1 - y, r, g, b, a );

			if ( err <= 0 ) {
				y++;
				err += dy;
				dy += 2;
			}

			if ( err > 0 ) {
				x--;
				dx += 2;
				err += dx - ( radius << 1 );
			}
		}
	}

	/**
	 * Returns the current matrix at any given state
	 */
	getMatrix() {
		return this.matrix;
	}

	/**
	 * Get the buffer for writing
	 * @return {Buffer}
	 */
	getBuffer() {
		this.flipMatrix( this.flipHorizontal, this.flipVertical );

		let buffer = new Buffer( this.width * this.height * 3 );

		let size = this.getSize();

		// @TODO: for now this only supports square displays!
		for ( let y = 0; y < size.height; y++ ) {
			for ( let x = 0; x < size.width; x++  ) {
				buffer[ y * size.height * 3 + x * 3 + 0 ] = this.matrix[ x ][ y ].r * this.matrix[ x ][ y ].a * this.brightness;
				buffer[ y * size.height * 3 + x * 3 + 1 ] = this.matrix[ x ][ y ].g * this.matrix[ x ][ y ].a * this.brightness;
				buffer[ y * size.height * 3 + x * 3 + 2 ] = this.matrix[ x ][ y ].b * this.matrix[ x ][ y ].a * this.brightness;
			}
		}

		return buffer;
	}

	/**
	 * Write output to the device. Implement at driver level.
	 */
	write( buffer = false ) { //eslint-disable-line no-unused-vars
		console.log( 'Driver should implement this' );
	}

	/**
	 * Flip the matrix along it's axis.
	 */
	flipMatrix( horizontal, vertical ) {
		if ( horizontal === true ) {
			for ( let i = 0; i < this.matrix.length; i++ ) {
				this.matrix[ i ].reverse();
			}
		}

		if ( vertical === true ) {
			this.matrix.reverse();
		}
	}

	/**
	 * Create the internal frame
	 */
	clearMatrix() {
		this.matrix = [];

		for ( let y = 0; y < this.height; y++ ) {
			this.matrix.push( [] );

			for ( let x = 0; x < this.width; x++  ) {
				this.matrix[ y ].push( {
					r: 0,
					g: 0,
					b: 0,
					a: 1
				} );
			}
		}
	}
}

exports.Driver = Driver;