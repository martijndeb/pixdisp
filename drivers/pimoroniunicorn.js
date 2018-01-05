"use strict";

let { Driver } = require( './driver' );
let fs = require( 'fs' );


class PimoroniUnicorn extends Driver {
	constructor() {
		super();

		this.spi = false;
		this.spiPath = '/dev/spidev0.0';
	}

	write( buffer ) {
		if ( this.spi === false) {
			if ( fs.existsSync( this.spiPath ) ) {
				let SPI = require( 'pi-spi' );
				this.spi = SPI.initialize( this.spiPath );
			} else {
				console.warn( 'Device path ' + this.spiPath + ' was unavailable.' );
				return;
			}
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