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
		this.sandbox = {
			'matrix': this.driver,
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