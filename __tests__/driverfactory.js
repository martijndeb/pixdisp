'use strict';

let driverFactory, config;
let { DriverFactory } = require( '../drivers/driverfactory' );

let { Dummy } = require( '../drivers/dummy' );
let { PimoroniUnicorn } = require( '../drivers/pimoroniunicorn' );

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
	expect( driverFactory.createFromConfig( config ) ).toBeInstanceOf( Dummy );
} );

test( 'Pimoroni Unicorn driver to be properly created', () => {
	config.driver = "pimoroniunicorn";
	expect( driverFactory.createFromConfig( config ) ).toBeInstanceOf( PimoroniUnicorn );
} );