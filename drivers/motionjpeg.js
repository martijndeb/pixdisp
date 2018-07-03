'use strict';

let { Driver } = require( './driver' );
let fs = require( 'fs' );
let http = require( 'http' );
let mjpegServer = require( 'mjpeg-server' );
let jpeg = require( 'jpeg-js' );

let mjpegReqHandler = undefined;

class MotionJPEG extends Driver {
	constructor() {
		super();

		this.httpServer = http.createServer( function( req, res ) {
			mjpegReqHandler = mjpegServer.createReqHandler( req, res );
		} ).listen( 8081, '0.0.0.0' );
	}

	write( buffer = false ) {
		if ( mjpegReqHandler === undefined) {
			return;
		}

		buffer = new Buffer( this.width * this.height * 4 );

		let i = 0;
		let size = this.getSize();

		for ( let y = 0; y < size.height; y++ ) {
			for ( let x = 0; x < size.width; x++  ) {
				buffer[ i++ ] = this.matrix[ x ][ y ].r * this.matrix[ x ][ y ].a * this.brightness;
				buffer[ i++ ] = this.matrix[ x ][ y ].g * this.matrix[ x ][ y ].a * this.brightness;
				buffer[ i++ ] = this.matrix[ x ][ y ].b * this.matrix[ x ][ y ].a * this.brightness;
				buffer[ i++ ] = 0xFF;
			}
		}

		var imageData = {
			data: buffer,
			width: this.width,
			height: this.height
		};

		var dt = jpeg.encode( imageData, 50 );
		mjpegReqHandler.write( dt.data );
	}
}

exports.MotionJPEG = MotionJPEG;