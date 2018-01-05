'use strict';

let driver, config;

let { DriverFactory } = require( '../drivers/driverfactory' );
let { Dummy } = require( '../drivers/dummy' );

let driverFactory = new DriverFactory();

beforeEach(() => {
	config = {
		"driver": "dummy",
		"matrix": {
			"width": 4,
			"height": 4,
			"brightness": 1,
			"flipHorizontal": false,
			"flipVertical": false
		}
	};
});

test( 'Matrix creation', () => {
	driver = driverFactory.createFromConfig( config );

	expect( driver.getSize() ).toEqual( { width: 4, height: 4 } );
	expect( driver.getBuffer().length ).toEqual( 48 );
} );

test( 'Set a pixel', () => {
	driver = driverFactory.createFromConfig( config );

	driver.setPixel( 0, 0, 255, 255, 255, 1 );
	driver.setPixel( 3, 0, 255, 255, 255, 1 );
	driver.setPixel( 0, 3, 255, 255, 255, 1 );
	driver.setPixel( 3, 3, 255, 255, 255, 1 );

	let matrix = driver.getMatrix();

	expect( matrix[ 0 ][ 0 ] ).toEqual( { r: 255, g: 255, b: 255, a: 1} );
	expect( matrix[ 3 ][ 0 ] ).toEqual( { r: 255, g: 255, b: 255, a: 1} );
	expect( matrix[ 0 ][ 3 ] ).toEqual( { r: 255, g: 255, b: 255, a: 1} );
	expect( matrix[ 3 ][ 3 ] ).toEqual( { r: 255, g: 255, b: 255, a: 1} );

	expect( matrix[ 0 ][ 1 ] ).toEqual( { r: 0, g: 0, b: 0, a: 1} );
	expect( matrix[ 3 ][ 1 ] ).toEqual( { r: 0, g: 0, b: 0, a: 1} );
	expect( matrix[ 1 ][ 3 ] ).toEqual( { r: 0, g: 0, b: 0, a: 1} );
	expect( matrix[ 2 ][ 3 ] ).toEqual( { r: 0, g: 0, b: 0, a: 1} );

} );

test( 'Draw a line', () => {
	driver = driverFactory.createFromConfig( config );

	driver.drawLine( 0, 0, 3, 3, 255, 255, 255, 1 );

	let matrix = driver.getMatrix();

	expect( matrix[ 0 ][ 0 ] ).toEqual( { r: 255, g: 255, b: 255, a: 1} );
	expect( matrix[ 1 ][ 1 ] ).toEqual( { r: 255, g: 255, b: 255, a: 1} );
	expect( matrix[ 2 ][ 2 ] ).toEqual( { r: 255, g: 255, b: 255, a: 1} );
	expect( matrix[ 3 ][ 3 ] ).toEqual( { r: 255, g: 255, b: 255, a: 1} );

	expect( matrix[ 0 ][ 1 ] ).toEqual( { r: 0, g: 0, b: 0, a: 1} );
	expect( matrix[ 1 ][ 2 ] ).toEqual( { r: 0, g: 0, b: 0, a: 1} );
	expect( matrix[ 2 ][ 3 ] ).toEqual( { r: 0, g: 0, b: 0, a: 1} );
	expect( matrix[ 3 ][ 0 ] ).toEqual( { r: 0, g: 0, b: 0, a: 1} );

} );

test( 'Draw a circle', () => {
	config.matrix.width = 8;
	config.matrix.height = 8;

	driver = driverFactory.createFromConfig( config );

	driver.drawCircle( 3, 3, 4, 255, 255, 255, 1 );

	let matrix = driver.getMatrix();

	expect( matrix[ 1 ][ 0 ] ).toEqual( { r: 255, g: 255, b: 255, a: 1} );
	expect( matrix[ 2 ][ 0 ] ).toEqual( { r: 255, g: 255, b: 255, a: 1} );
	expect( matrix[ 2 ][ 6 ] ).toEqual( { r: 255, g: 255, b: 255, a: 1} );
	expect( matrix[ 3 ][ 6 ] ).toEqual( { r: 255, g: 255, b: 255, a: 1} );

	expect( matrix[ 0 ][ 0 ] ).toEqual( { r: 0, g: 0, b: 0, a: 1} );
	expect( matrix[ 0 ][ 7 ] ).toEqual( { r: 0, g: 0, b: 0, a: 1} );
	expect( matrix[ 2 ][ 1 ] ).toEqual( { r: 0, g: 0, b: 0, a: 1} );
	expect( matrix[ 3 ][ 1 ] ).toEqual( { r: 0, g: 0, b: 0, a: 1} );

} );