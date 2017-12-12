"use strict";

/**
 * Basic matrix driver which every implementation can derive from
 */
class Driver {
	constructor() {

		// Some sane-ish defaults
		this.setSize( 16, 16 );
		this.setBrightness( 1 );

	}

	/**
	 * Sets the display size
	 */
	setSize( w, h ) {
		this.width = w;
		this.height = h;

		this.createMatrix();
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
	clear( r = 0, g = 0, b = 0) {
		for ( let x = 0; x < this.width; x++ ) {
			for ( let y = 0; y < this.height; y++) {
				this.matrix[x][y].r = r;
				this.matrix[x][y].g = g;
				this.matrix[x][y].b = b;
			}
		}
	}

	/**
	 * Set pixel color
	 */
	setPixel( x, y, r = 0, g = 0, b = 0 ) {
		this.matrix[x][y].r = r;
		this.matrix[x][y].g = g;
		this.matrix[x][y].b = b;
	}

	/**
	 * Return the pixel color
	 */
	getPixel( x, y ) {
		return {
			r: this.matrix[x][y].r,
			g: this.matrix[x][y].g,
			b: this.matrix[x][y].b,
		}
	}

	/**
	 * Get the buffer for writing
	 * @return {Buffer}
	 */
	getBuffer() {
		let buffer = new Buffer( this.width * this.height * 3 );

		let size = this.getSize();

		// @TODO: for now this only supports square displays!
		for ( let y = 0; y < size.height; y++ ) {
			for ( let x = 0; x < size.width; x++  ) {
				buffer[ y * size.height * 3 + x * 3 + 0 ] = this.matrix[ x ][ y ].r * this.brightness;
				buffer[ y * size.height * 3 + x * 3 + 1 ] = this.matrix[ x ][ y ].g * this.brightness;
				buffer[ y * size.height * 3 + x * 3 + 2 ] = this.matrix[ x ][ y ].b * this.brightness;
			}
		}

		return buffer;
	}

	write( buffer ) {
		console.log( 'Driver should implement this' );
	}

	/**
	 * Create the internal frame
	 */
	createMatrix() {
		this.matrix = [];

		let size = this.getSize();

		for ( let y = 0; y < size.height; y++ ) {
			this.matrix.push( [] );

			for ( let x = 0; x < size.width; x++  ) {
				this.matrix[ y ].push( {
					r: 0,
					g: 0,
					b: 0
				} );
			}
		}
	}
}

exports.Driver = Driver;