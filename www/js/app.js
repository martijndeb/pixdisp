'use strict';

class App
{
	constructor() {
		let request = new XMLHttpRequest();
		request.open( 'GET', '/api/getdisplaysize', true );
		request.onload = this.onGetDisplaySizeFinished;
		request.send();
	}

	onGetDisplaySizeFinished() {
		if ( this.status >= 200 && this.status < 400 ) {
			let resp = JSON.parse( this.responseText );

			app.createCanvas( resp.width, resp.height );
			app.createPalette();
		}
	}

	createCanvas( width, height ) {
		let holder = document.querySelector( '#canvasHolder' );
		let canvas = document.createElement( 'canvas' );

		canvas.id = 'artboard';
		canvas.width = width;
		canvas.height = height;

		holder.appendChild( canvas );

		canvas.addEventListener( 'click', this.handleCanvas );
		document.getElementById( 'submitImage' ).addEventListener( 'click', this.submitCanvas );
		document.getElementById( 'captureCamera' ).addEventListener( 'click', this.captureCamera );

		this.canvas = canvas;
		this.context = canvas.getContext( '2d' );
		this.context.imageSmoothingEnabled = false;

		this.context.fillStyle = 'black';
		this.context.fillRect( 0, 0, width, height );
	}

	createPalette() {
		let paletteItBe = [
			"0 0 0",
			"20 12 28",
			"68 36 52",
			"48 52 109",
			"78 74 78",
			"133 76 48",
			"52 101 36",
			"208 70 72",
			"117 113 97",
			"89 125 206",
			"210 125 44",
			"133 149 161",
			"109 170 44",
			"210 170 153",
			"109 194 202",
			"218 212 94",
			"222 238 214",
			"0 71 189",
			"2 136 217",
			"7 185 252",
			"0 149 67",
			"0 171 56",
			"154 240 0",
			"255 179 0",
			"255 206 0",
			"255 239 59",
			"255 206 0",
			"255 230 59",
			"234 0 52",
			"253 71 3",
			"255 139 42",
			"130 0 172",
			"182 16 191",
			"204 114 245"
		];

		let holder = document.querySelector( '#paletteHolder' );
		for ( let i = 0 ; i < paletteItBe.length; i++ ) {
			let paletteStr = paletteItBe[ i ];
			let colorValues = paletteStr.split( ' ' );

			let element = document.createElement( 'div' );
			element.className = 'paletteBox column';
			element.dataset.colorR = colorValues[ 0 ];
			element.dataset.colorG = colorValues[ 1 ];
			element.dataset.colorB = colorValues[ 2 ];

			element.style.backgroundColor = `rgba(${colorValues[ 0 ]}, ${colorValues[ 1 ]}, ${colorValues[ 2 ]}, 1)`;

			holder.appendChild( element );

			element.addEventListener( 'click', this.handlePalette );
		}

		let colorValues = paletteItBe[ paletteItBe.length - 1 ].split( ' ' );
		this.selectedR = colorValues[ 0 ];
		this.selectedG = colorValues[ 1 ];
		this.selectedB = colorValues[ 2 ];
	}

	handlePalette( ev ) {

		if ( ev.preventDefault ) {
			ev.preventDefault();
		}

		app.selectedR = this.dataset.colorR;
		app.selectedG = this.dataset.colorG;
		app.selectedB = this.dataset.colorB;

	}

	handleCanvas( ev ) {

		if ( ev.preventDefault ) {
			ev.preventDefault();
		}

		let rect = app.canvas.getBoundingClientRect(),
			scale = app.canvas.width / rect.width;

		let mouseX = Math.floor( ( ev.clientX - rect.left ) * scale ),
			mouseY = Math.floor( ( ev.clientY - rect.top ) * scale );

		app.context.fillStyle = `rgba(${app.selectedR}, ${app.selectedG}, ${app.selectedB}, 1)`;
		app.context.fillRect( mouseX, mouseY, 1, 1 );

	}

	submitCanvas( ev ) {

		if ( ev.preventDefault ) {
			ev.preventDefault();
		}

		let imageData = app.context.getImageData( 0, 0, app.canvas.width, app.canvas.height );
		let request = new XMLHttpRequest();

		request.open( 'POST', '/api/writecanvas', true );
		request.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8' );

		let obj = [];
		for ( let x = 0; x < app.canvas.width; x++ ) {
			for ( let y = 0; y < app.canvas.height; y++ ) {
				let index = ( y * app.canvas.width + x ) * 4;
				let r = imageData.data[ index ];
				let g = imageData.data[ index + 1 ];
				let b = imageData.data[ index + 2 ];

				if ( r > 0 || g > 0 || b > 0 ) {
					obj.push( {
						x: x,
						y: y,
						r: r,
						g: g,
						b: b
					} )
				}
			}
		}

		obj = encodeURI( 'data=' + JSON.stringify( obj ) );
		request.send( obj );

	}

	captureCamera( ev ) {

		if ( ev.preventDefault ) {
			ev.preventDefault();
		}

		navigator.mediaDevices.getUserMedia( { video: true, audio: false } )
			.then( function( stream ) {
				let vs = document.getElementById( 'videoStream' );
				vs.srcObject = stream;
				vs.play();

				app.drawVideoToCanvas();
			} )
			.catch( function( err ) {
				console.warn( err );
			} )
		;

	}

	drawVideoToCanvas() {

		try {

			let vs = document.getElementById( 'videoStream' );
			app.context.drawImage( vs, 0, 0, app.canvas.width, app.canvas.height );

		} catch ( err ) { }

		window.requestAnimationFrame( app.drawVideoToCanvas );

	}

}

let app = new App();