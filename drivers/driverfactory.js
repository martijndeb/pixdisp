'use strict';

class DriverFactory {
	constructor() {
	}

	createFromConfig( config ) {

		let driver;

		switch ( config.driver.toLowerCase() ) {

		default:
			// eslint-disable-next-line
			console.warn( 'Unknown driver defaulting to Dummy' );
			break;

		case 'dummy':
			let { Dummy } = require( './dummy' );
			driver = new Dummy();
			break;

		case 'pimoroniunicorn':
			let { PimoroniUnicorn } = require( './pimoroniunicorn' );
			driver = new PimoroniUnicorn();
			break;

		case 'motionjpeg':
			let { MotionJPEG } = require( './motionjpeg' );
			driver = new MotionJPEG();
			break;

		}

		driver.setSize( config.matrix.width, config.matrix.height );
		driver.setBrightness( config.matrix.brightness );

		driver.flipHorizontal = config.matrix.flipHorizontal;
		driver.flipVertical = config.matrix.flipVertical;

		return driver;

	}

}

exports.DriverFactory = DriverFactory;