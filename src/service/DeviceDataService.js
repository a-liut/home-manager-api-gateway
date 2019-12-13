let mongoose = require("mongoose");

const DeviceData = require("../model/DeviceData");

const InvalidDataException = require("../exception/InvalidDataException");
const DeviceDataException = require("../exception/DeviceDataException");

async function find(params) {
    var query = DeviceData.find();

    if (params.device_id != null) {
        if (!mongoose.Types.ObjectId.isValid(params.device_id)) {
            throw new InvalidDataException("invalid id");
        }

        query.byDeviceId(params.device_id);
    }

    if (params.limit > 0) {
        query = query.limit(params.limit);
    }

    if (params.name != null) {
        query.where({ name: params.name });
    }

    return await query;
}

async function get(id) {
    if (!id) throw new InvalidDataException("missing id");

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new InvalidDataException("invalid id");
    }

    return await DeviceData.findById(id);
}

async function add(data) {

    try {
        let d = new DeviceData({
            name: data.name,
            value: data.value,
            unit: data.unit,
            device: data.device._id
        });

        await d.save();

        return d;
    } catch (ex) {
        throw new DeviceDataException("Cannot create DeviceData", ex);
    }
}

module.exports.find = find;
module.exports.get = get;
module.exports.add = add;