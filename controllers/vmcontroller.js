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
		let matrixSize = this.driver.getSize();

		this.sandbox = {
			'WIDTH': matrixSize.width,
			'HEIGHT': matrixSize.height,

			'setBrightness': this.driver.setBrightness.bind( this.driver ),
			'getBrightness': this.driver.getBrightness.bind( this.driver ),
			'setPixel': this.driver.setPixel.bind( this.driver ),
			'getPixel': this.driver.getPixel.bind( this.driver ),
			'drawLine': this.driver.drawLine.bind( this.driver ),
			'drawRect': this.driver.drawRect.bind( this.driver ),
			'drawRectFilled': this.driver.drawRectFilled.bind( this.driver ),
			'drawCircle': this.driver.drawCircle.bind( this.driver ),
			'write': this.driver.write.bind( this.driver ),

			'delta': this.getDelta.bind( this )
		};
	}

	runScript( ) {

		let delta = 0;
		let tmd = this.getTimeData();

		if ( this.previousTime === 0 ) {
			this.previousTime = tmd;
		} else {
			delta = tmd - this.previousTime;
			this.previousTime = tmd;
		}

		this.delta = delta;

		this.vm.run( this.runningVmScript, 'pixdisp-sandbox.js' );

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
}

exports.VMController = VMController;