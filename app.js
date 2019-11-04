var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.plugin(schema => { schema.options.usePushEach = true });

mongoose.Promise = require('bluebird');

function connectMongo() {
    let host = process.env.MONGO_HOST;
    let port = process.env.MONGO_PORT;

    mongoose.connect(`mongodb://${host}:${port}/homemanager`, {
        useNewUrlParser: true
    });
    mongoose.connection.on('error', console.error.bind(console, 'Connection error:'));
}

connectMongo();

var deviceRoute = require('./routes/device');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/devices', deviceRoute);


// --- error handlers
let handlers = require('./handlers.js');

if (app.get('env') === 'development') {
    app.use(handlers.devErrorHandler);
}

app.use(handlers.prodErrorHandler);

module.exports = app;