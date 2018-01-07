'use strict';

let fs = require( 'fs' );
let os = require( 'os' );

let config,
    vmcontroller,
    api,
    contents;

if ( fs.existsSync( 'config.json' ) ) {
    contents = fs.readFileSync( 'config.json' );
} else if ( fs.existsSync( os.homedir() + '/.pixdisp/config.json' ) ) {
    contents = fs.readFileSync( os.homedir() + '/.pixdisp/config.json' );
} else {
    contents = fs.readFileSync( 'config.example.json' );
}

if ( typeof contents === 'undefined' ||
     contents === false || contents === undefined ||
     contents === ''  ) {

    console.log( 'Invalid or no configuration' );
    process.exit();
}

config = JSON.parse( contents );

let driver;
let { DriverFactory } = require( './drivers/driverfactory' );
let driverFactory = new DriverFactory();

let { VMController } = require( './controllers/vmcontroller' );
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

vmcontroller = new VMController( driver );
api = new ApiController( server, driver, vmcontroller );

server.get(/.*/, restify.plugins.serveStatic({

    'directory': 'www',
    'default': 'index.html'

}));

server.pre( restify.pre.userAgentConnection() );

server.listen( bindPort, bindAddr, function() {

    console.log( '%s listening at %s ', server.name , server.url );
    console.log( 'Ready.' );

});
