var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var DeviceDataSchema = Schema({
    name: {
        type: String,
        required: [true, "Name is missing"]
    },
    value: {
        type: String,
        required: [true, "Value is missing"]
    },
    unit: {
        type: String
    },
    device: {
        type: ObjectId,
        ref: 'Device',
        required: true
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: {
        virtuals: true
    }
});

DeviceDataSchema.query.byDeviceId = function(deviceId) {
    return this.where({ device: deviceId });
}

module.exports = mongoose.model("DeviceData", DeviceDataSchema);