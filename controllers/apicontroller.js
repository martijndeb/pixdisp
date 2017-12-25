"use strict";

class ApiController {

	constructor( server, driver ) {

		this.server = server;
		this.driver = driver;

		this.server.post( { path: '/api/writecanvas' }, this.writeCanvas.bind( this ) );
		this.server.get( { path: '/api/write' }, this.write.bind( this ) );
		this.server.get( { path: '/api/getdisplaysize' }, this.getDisplaySize.bind( this ) );
		this.server.get( { path: '/api/setpixel/:x/:y/:r/:g/:b' }, this.setPixel.bind( this ) );

	}

	writeCanvas( request, resource, next ) {

		this.driver.clearMatrix();

		resource.setHeader( 'Access-Control-Allow-Origin', '*' );

		let data = JSON.parse( request.params.data );

		for ( let obj of data) {
			this.driver.setPixel( obj.y, obj.x, obj.r, obj.g, obj.b );
		}

		let buffer = this.driver.getBuffer();
		this.driver.write( buffer );

		resource.json( 200, { 'msg': 'Ok' } );
		return next();

	}

	write( request, resource, next ) {

		resource.setHeader( 'Access-Control-Allow-Origin', '*' );

		let buffer = this.driver.getBuffer();
		this.driver.write( buffer );

		resource.json( 200, { 'msg': 'Ok' } );
		return next();

	}

	getDisplaySize( request, resource, next ) {

		resource.setHeader( 'Access-Control-Allow-Origin', '*' );

		resource.json( 200, this.driver.getSize() );
		return next();

	}

	setPixel( request, resource, next ) {

		resource.setHeader( 'Access-Control-Allow-Origin', '*' );

		this.driver.setPixel(
			request.params.x,
			request.params.y,
			request.params.r,
			request.params.g,
			request.params.b
		);

		resource.json( 200, { 'msg': 'Ok' } );
		return next();

	}

}

exports.ApiController = ApiController;