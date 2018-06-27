'use strict';

class VMController
{
	constructor( driver ) {

		this.driver = driver;
		this.runningCode = ';';
		this.runningVmScript = false;
		this.previousTime = 0;
		this.delta = 0;
		this.sandbox = {};
		this.vm = null;
		this.runNextFrame = false;

	}

	getRunningCode() {
		return this.runningCode;
	}

	compileScript( script ) {

		let { NodeVM, VMScript } = require( 'vm2' );

		this.resetSandbox();
		this.runningCode = script;
		this.vm = new NodeVM( {
			'console': 'inherit',
			'sandbox': this.sandbox
		} );

		this.runningVmScript = new VMScript( this.runningCode );

	}

	resetSandbox() {
		this.previousTime = this.getTimeData();
		let matrixSize = this.driver.getSize();

		this.sandbox = {
			'sandbox': {},
			'WIDTH': matrixSize.width,
			'HEIGHT': matrixSize.height,

			'clear': this.driver.clear.bind( this.driver ),
			'setBrightness': this.driver.setBrightness.bind( this.driver ),
			'getBrightness': this.driver.getBrightness.bind( this.driver ),
			'setPixel': this.driver.setPixel.bind( this.driver ),
			'getPixel': this.driver.getPixel.bind( this.driver ),
			'drawLine': this.driver.drawLine.bind( this.driver ),
			'drawRect': this.driver.drawRect.bind( this.driver ),
			'drawRectFilled': this.driver.drawRectFilled.bind( this.driver ),
			'drawCircle': this.driver.drawCircle.bind( this.driver ),
			'write': this.driver.write.bind( this.driver ),

			'getDelta': this.getDelta.bind( this ),
			'run': this.run.bind( this )
		};
	}

	runScript( ) {

		let deltaLocal = 0;
		let tmd = this.getTimeData();

		deltaLocal = tmd - this.previousTime;

		this.previousTime = tmd;

		this.delta = deltaLocal / 1000000;

		this.vm.run( this.runningVmScript, 'pixdisp-sandbox.js' );

		if ( this.runNextFrame === true ) {
			this.runNextFrame = false;
			setTimeout( this.runScript.bind( this ), 1000 / 60 );
		}
	}

	getTimeData() {
		let hrTime = process.hrtime();
		return hrTime[ 0 ] * 1000000 + hrTime[ 1 ] / 1000;
	}

	getDriver() {
		return this.driver;
	}

	getDelta() {
		return this.delta;
	}

	run() {
		this.runNextFrame = true;
	}
}

exports.VMController = VMController;