'use strict';

let driverFactory, config;
let { DriverFactory } = require( '../drivers/driverfactory' );

let { Dummy } = require( '../drivers/dummy' );
let { PimoroniUnicorn } = require( '../drivers/pimoroniunicorn' );
let { MotionJPEG } = require( '../drivers/motionjpeg' );

beforeEach(() => {
	driverFactory = new DriverFactory();
	config = {
		"driver": "dummy",
		"matrix": {
			"width": 16,
			"height": 16,
			"brightness": 1,
			"flipHorizontal": false,
			"flipVertical": false
		}
	};
});

test( 'Dummy driver to be properly created', () => {
	let driver = driverFactory.createFromConfig( config );

	driver.silence = true;

	expect( driver ).toBeInstanceOf( Dummy );
	expect( driver.write( driver.getBuffer() ) ).toBeUndefined();
} );

test( 'Pimoroni Unicorn driver to be properly created', () => {
	config.driver = "pimoroniunicorn";

	let driver = driverFactory.createFromConfig( config );

	expect( driver ).toBeInstanceOf( PimoroniUnicorn );
	expect( driver.write( driver.getBuffer() ) ).toBeUndefined();
} );

test( 'MotionJPEG driver to be properly created', () => {
	config.driver = "motionjpeg";

	let driver = driverFactory.createFromConfig( config );

	expect( driver ).toBeInstanceOf( MotionJPEG );
	expect( driver.write( driver.getBuffer() ) ).toBeUndefined();

	driver.cleanup();
} );