var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// DB
require('./src/db/db').init();

var deviceRoute = require('./routes/device');
var dataRoute = require('./routes/device_data');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/devices', deviceRoute);
app.use('/data', dataRoute);

// --- error handlers
let handlers = require('./handlers.js');

app.use(handlers.customErrorHandler);

if (app.get('env') === 'development') {
    app.use(handlers.devErrorHandler);
}

app.use(handlers.prodErrorHandler);

module.exports = app;

// Start AMQP messaging
let AmqpConsumer = require("./src/amqp/AmqpConsumer");

(async() => {
    let consumer = await AmqpConsumer.create({
        host: "amqp",
        exchangeOptions: {
            durable: false
        },
        queueOptions: {
            exclusive: true
        },
        consumeOptions: {
            noAck: true
        }
    });

    // Close connection in case of SIGINTs
    process.once('SIGINT', () => {
        consumer.closeConnection();
    });

    try {
        await consumer.consume("device_data", "data.produced", (message) => {
            console.log("RECEIVED: ", message);
        });
    } catch (ex) {
        console.error("Cannot consume data: ", ex);
    }
})();