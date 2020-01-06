const mongoose = require('mongoose');

const CONNECTION_RETRY_DELAY_MS = 3000;

mongoose.plugin(schema => { schema.options.usePushEach = true });
mongoose.Promise = require('bluebird');

const host = process.env.MONGO_HOST;
const port = process.env.MONGO_PORT;

function init() {
    return new Promise((resolve, reject) => {
        let _connect = async() => {
            try {
                console.log("Connecting to Mongo...");
                await mongoose.connect(`mongodb://${host}:${port}/home-manager-devices`, {
                    useNewUrlParser: true
                });

                console.log("Connected to Mongo.");

                resolve();
            } catch (ex) {
                console.error('Connection error:', ex.message);

                setTimeout(() => {
                    _connect();
                }, CONNECTION_RETRY_DELAY_MS);
            }
        }

        _connect();
    });

}

module.exports.init = init;