var mongoose = require('mongoose');

function connectMongo() {
    let host = process.env.MONGO_HOST;
    let port = process.env.MONGO_PORT;

    mongoose.connect(`mongodb://${host}:${port}/homemanager`, {
        useNewUrlParser: true
    });
    mongoose.connection.on('error', console.error.bind(console, 'Connection error:'));
}

function init() {
    mongoose.plugin(schema => { schema.options.usePushEach = true });

    mongoose.Promise = require('bluebird');

    connectMongo();
}

module.exports.init = init;