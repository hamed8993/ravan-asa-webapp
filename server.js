require('app-module-path').addPath(__dirname);

require('dotenv').config();
global.config = require('config/index.js');//for global....
const app = require('./app/index.js');
//for web-socket:
const ws = require('./WebSocketServer.js');
new ws();

// const appmetrics = require('appmetrics');
// const monitoring = appmetrics.monitor();
// require('appmetrics-dash').monitor();
// monitoring.on('initialized', function (env) {
//     console.log('appmetrics initialized');
// });
// monitoring.on('cpu', function (data) {
//     console.log('CPU: ', data);
// });
//
// monitoring.on('http', function (data) {
//     console.log('Http: ', data);
// });
//
// monitoring.on('mongo', function (data) {
//     console.log('Mongo:' , data);
// });