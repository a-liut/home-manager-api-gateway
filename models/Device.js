var mongoose = require('mongoose');

var DataSchema = mongoose.Schema({
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
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

var DeviceSchema = mongoose.Schema({
    name: {
        type: String,
        unique: true,
        default: "New Device"
    },
    address: {
        type: String,
        required: [true, "IP address is missing"],
        index: true,
        unique: true
    },
    data: {
        type: [DataSchema]
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model("Device", DeviceSchema);