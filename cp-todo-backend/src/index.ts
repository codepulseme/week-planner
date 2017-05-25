/* entry point of the application, where the server configs are defined */
import * as http from 'http';
import * as debug from 'debug';

import App from './app';

var configs = require('../config.json')[process.env.NODE_ENV || 'dev'];

debug('ts-express:server');

// const port = normalizePort(process.env.PORT || 5000);
const port = normalizePort(process.env.PORT || configs.port);
console.log('App is running on port ' + port);
App.set('port', port);

// create a new instance of server
const server = http.createServer(App);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

// normalize the port
// @val: the input parameter, can be either a number or a string
function normalizePort(val: number|string): number|string|boolean {
    let port: number = (typeof val === 'string') ? parseInt(val, 10) : val; // radix 10 = base 10
    if (isNaN(port)) return val;    // if somehow port was not cast, return the original value
    else if (port >= 0) return port;
    return false;
}

function onError(error: NodeJS.ErrnoException): void {
    if (error.syscall !== 'listen') throw error;
    let bind = (typeof port === 'string') ? 'Pipe ' + port : 'Port ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error('${bind} requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINEUSE':
            console.error('${bind} is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening(): void {
    let addr = server.address();
    let bind = (typeof addr === 'string') ? 'pipe ${addr}' : 'port ${addr.port}';
    debug('Listening on ${bind}');
}
