'use strict';

let { UnicornHatHD } = require( './drivers/unicornhathd' );

let restify = require( 'restify' );

let bindAddr = '0.0.0.0';
let bindPort = 8080;

let server = restify.createServer( {
	handleUpgrades: true
} );

server.use( restify.plugins.queryParser() );
server.use( restify.plugins.bodyParser() );
server.use( restify.plugins.jsonp() );
server.use( restify.plugins.gzipResponse() );
server.use( restify.plugins.throttle(
    {
        burst: 50,
        rate: 30,
        ip: true
    }
));

server.get(/.*/, restify.plugins.serveStatic({

    'directory': 'www',
    'default': 'index.html'

}));

server.pre( restify.pre.userAgentConnection() );

server.listen( bindPort, bindAddr, function() {

    console.log( '%s listening at %s ', server.name , server.url );
    console.log( 'Ready.' );

    // Some test code
    let driver = new UnicornHatHD();
    driver.setPixel( 1, 1, 255, 0, 0 );
    driver.setPixel( 5, 5, 255, 0, 255 );

    let buffer = driver.getBuffer();
    driver.write( buffer );

});