'use strict';

let { Driver } = require( './driver' );
let fs = require( 'fs' );


class PimoroniUnicorn extends Driver {
	constructor() {
		super();

		this.spi = false;
	}

	write( buffer ) {
		if ( this.spi === false) {
			if ( fs.existsSync( '/dev/spidev0.0' ) ) {
				let SPI = require( 'pi-spi' );
				this.spi = SPI.initialize( '/dev/spidev0.0' );
			} else {
				console.warn( 'Device path \'/dev/spidev0.0\' was unavailable.' );
				return;
			}
		}

		this.spi.write(
			Buffer.concat(
				[
					new Buffer( [ 0x72 ] ),
					buffer
				]
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