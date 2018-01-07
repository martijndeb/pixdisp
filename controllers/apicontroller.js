'use strict';

class ApiController {

	constructor( server, driver, vmcontroller ) {

		this.server = server;
		this.driver = driver;
		this.vmcontroller = vmcontroller;

		this.server.post( { path: '/api/writecanvas' }, this.writeCanvas.bind( this ) );
		this.server.post( { path: '/api/runcode' }, this.runCode.bind( this ) );

		this.server.get( { path: '/api/write' }, this.write.bind( this ) );
		this.server.get( { path: '/api/getdisplaysize' }, this.getDisplaySize.bind( this ) );
		this.server.get( { path: '/api/setpixel/:x/:y/:r/:g/:b' }, this.setPixel.bind( this ) );
		this.server.get( { path: '/api/getcode' }, this.getCode.bind( this ) );

	}

	writeCanvas( request, resource, next ) {

		this.driver.clearMatrix();

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

		let buffer = this.driver.getBuffer();
		this.driver.write( buffer );

		resource.json( 200, { 'msg': 'Ok' } );
		return next();

	}

	getDisplaySize( request, resource, next ) {

		resource.json( 200, this.driver.getSize() );
		return next();

	}

	setPixel( request, resource, next ) {

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

	getCode( request, resource, next ) {

		resource.send( this.vmcontroller.runningCode );
		return next();

	}

	runCode( request, resource, next ) {

		this.runningCode = request.params.code;

		this.vmcontroller.compileScript( this.runningCode );
		this.vmcontroller.runScript();

		resource.json( 200, { 'msg': 'Ok' } );
		return next();

	}

}

exports.ApiController = ApiController;