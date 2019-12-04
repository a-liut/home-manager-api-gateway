var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var DeviceDataSchema = require('./DeviceData');

var DeviceSchema = Schema({
    name: {
        type: String,
        required: [true, "Name is missing"],
        unique: true
    },
    address: {
        type: String,
        required: [true, "IP address is missing"],
        index: true,
        unique: true
    },
    heartbeat_url: {
        type: String,
    },
    online: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: {
        virtuals: true
    }
});

DeviceSchema.virtual('data', {
    ref: 'Device',
    localField: '_id',
    foreignField: 'device',
    justOne: false
});

module.exports = mongoose.model("Device", DeviceSchema);