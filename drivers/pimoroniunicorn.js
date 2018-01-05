"use strict";

let { Driver } = require( './driver' );

class PimoroniUnicorn extends Driver {
	constructor() {
		super();

		this.initializedSpi = false;
	}

	write( buffer ) {
		if ( this.initializedSpi !== true ) {
			this.initializedSpi = true;

			let SPI = require( 'pi-spi' );
			this.spi = SPI.initialize( '/dev/spidev0.0' );
		}

		this.spi.write(
			Buffer.concat(
				[ new Buffer( [ 0x72 ] ),
				  buffer ]
			),

			function ( err ) {
				if ( err ) {
					throw 'Failed writing buffer';
				}
			}
		);
	}
}

exports.PimoroniUnicorn = PimoroniUnicorn;