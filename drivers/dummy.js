"use strict";

let { Driver } = require( './driver' );

class Dummy extends Driver {
	constructor() {
		super();
	}

	write( buffer ) {
		console.log( buffer );
	}
}

exports.Dummy = Dummy;