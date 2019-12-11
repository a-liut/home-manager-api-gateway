var mongoose = require('mongoose');

function connectMongo() {
    let host = process.env.MONGO_HOST;
    let port = process.env.MONGO_PORT;

    mongoose.connect(`mongodb://${host}:${port}/home-manager-devices`, {
        useNewUrlParser: true
    });

    mongoose.connection.on("connected", () => {
        console.log("Connected to db!");
    });

    mongoose.connection.on("disconnected", () => {
        console.log("Disconnected from db!");
    });

    mongoose.connection.on('error', err => {
        console.error('Connection error:', err);

        process.exit(1);
    });
}

function init() {
    mongoose.plugin(schema => { schema.options.usePushEach = true });

    mongoose.Promise = require('bluebird');

    connectMongo();
}

module.exports.init = init;