const amqp = require('amqplib');
const util = require('util');

const CONNECTION_RETRY_DELAY_MS = 3000;

/**
 * Creates a new AmqpConsumer
 * @param {Object} cfg A configuration object. It allows to set default parameters.
 */
function AmqpConsumer(cfg) {
    this.config = cfg;
    this.connection = null;
    this.channel = null;
}

/**
 * Returns true if this consumer is connected to the AMQP server.
 */
AmqpConsumer.prototype.isConnected = function isConnected() {
    return this.connection != null;
}

/**
 * Opens a connection with the AMQP server.
 */
AmqpConsumer.prototype.openConnection = function openConnection() {
    return new Promise((resolve, reject) => {
        if (this.isConnected()) {
            resolve();
            return;
        }

        let _open = async() => {
            try {
                console.log("AmqpConsumer: connecting to amqp server...");
                this.connection = await amqp.connect(`amqp://${this.config.host}`);

                console.log("AmqpConsumer: connected to amqp server.");

                resolve();
            } catch (ex) {
                console.warn("AmqpConsumer: connection error: ", ex.message);
                if (ex.code === 'ECONNREFUSED') {
                    setTimeout(async() => {
                        // Try again
                        _open();
                    }, CONNECTION_RETRY_DELAY_MS);
                } else {
                    reject(ex);
                }
            }
        }

        _open();
    });
};

/**
 * Closes the current connection with the AMQP server.
 */
AmqpConsumer.prototype.closeConnection = async function closeConnection() {
    console.log("AmqpConsumer: closing connection...");
    if (this.isConnected()) {
        await this.connection.close();

        this.connection = null;
        this.channel = null;
    }
    console.log("AmqpConsumer: connection closed");
};

/**
 * Connects the AmqpConsumer to the AMQP server.
 */
AmqpConsumer.prototype.connect = async function connect() {
    if (!this.connection) {
        this.channel = null;
        await this.openConnection();
    }

    if (!this.channel) {
        console.log("AmqpConsumer: creating channel...");
        this.channel = await this.connection.createChannel();

        console.log("AmqpConsumer: channel created.");
    }
};

/**
 * Listens for messages sent through an exchange.
 * @param {String} exchange The exchange identifier
 * @param {String} key The key to identify the queue
 * @param {String} callback A callback for notifying messages
 * @param {Object} consumeOptionsOverride Overrides default options for consume
 * @param {Object} exchangeOptionsOverride Overrides default options for exchange
 * @param {Object} queueOptionsOverride Overrides default options for queue
 */
AmqpConsumer.prototype.consume = async function consume(exchange, key, callback, consumeOptionsOverride = {}, exchangeOptionsOverride = {}, queueOptionsOverride = {}) {
    if (!this.isConnected()) {
        throw new Error("Amqp client not connected");
    }

    console.log(`AmqpConsumer: consuming: exchange: ${exchange}, key: ${key}.`);

    let exchangeOptions = Object.assign({}, this.config.exchangeOptions, exchangeOptionsOverride);
    let queueOptions = Object.assign({}, this.config.queueOptions, queueOptionsOverride);
    let consumeOptions = Object.assign({}, this.config.consumeOptions, consumeOptionsOverride);

    await this.channel.assertExchange(exchange, 'topic', exchangeOptions);

    let q = await this.channel.assertQueue('', queueOptions);

    this.channel.bindQueue(q.queue, exchange, key);

    this.channel.consume(q.queue, callback, consumeOptions);
};

module.exports = {
    /**
     * Creates a new AmqpConsume, ready for consuming messages from the AMQP server.
     * @param {Object} cfg Default parameters
     */
    create: async function create(cfg) {
        let c = new AmqpConsumer(cfg);

        await c.connect();

        return c;
    }
};