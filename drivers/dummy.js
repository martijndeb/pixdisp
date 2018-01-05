"use strict";

let { Driver } = require( './driver' );

class Dummy extends Driver {
	constructor() {
		super();

		this.silence = false;
	}

	write( buffer ) {
		if ( this.silence !== true ) {
			console.log( buffer );
		}
	}
}

exports.Dummy = Dummy;