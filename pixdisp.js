'use strict';

let fs = require( 'fs' );
let config;
let api;

if ( fs.existsSync( 'config.json' ) ) {
    let contents = fs.readFileSync( 'config.json' );
    config = JSON.parse( contents );
} else {
    let contents = fs.readFileSync( 'config.example.json' );
    config = JSON.parse( contents );
}

let driver;
let { DriverFactory } = require( './drivers/driverfactory' );
let driverFactory = new DriverFactory();

let { ApiController } = require( './controllers/apicontroller' );

let restify = require( 'restify' );

let bindAddr = config.bindAddr;
let bindPort = config.bindPort;

let server = restify.createServer( {
	handleUpgrades: true
} );

server.use( restify.plugins.queryParser() );
server.use( restify.plugins.bodyParser( {
    mapParams: true
} ) );
server.use( restify.plugins.jsonp() );
server.use( restify.plugins.gzipResponse() );
server.use( restify.plugins.throttle(
    {
        burst: 50,
        rate: 30,
        ip: true
    }
));

driver = driverFactory.createFromConfig( config );
driver.write( driver.getBuffer() );

api = new ApiController( server, driver );

server.get(/.*/, restify.plugins.serveStatic({

    'directory': 'www',
    'default': 'index.html'

}));

server.pre( restify.pre.userAgentConnection() );

server.listen( bindPort, bindAddr, function() {

    console.log( '%s listening at %s ', server.name , server.url );
    console.log( 'Ready.' );

});
