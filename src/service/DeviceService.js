let mongoose = require("mongoose");

const Device = require("../model/Device");

const InvalidDataException = require("../exception/InvalidDataException");
const DeviceException = require("../exception/DeviceException");

async function find(params = {}) {
    var query = Device.find();

    if (params.limit > 0) {
        query = query.limit(params.limit);
    }

    if (params.name != null) {
        query.where({ name: params.name });
    }

    if (params.ip != null) {
        query.where({ ip: params.ip });
    }

    return await query;
}

async function get(id) {
    if (!id) throw new InvalidDataException("missing id");

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new InvalidDataException("invalid id");
    }

    return await Device.findById(id);
}

async function add(data) {
    if (!data.address) {
        throw new InvalidDataException("Missing ip");
    }

    let devices = await find({ address: data.address });

    if (devices.length > 0) {
        throw new DeviceException("Ip already assigned!");
    }

    try {
        let d = new Device({
            address: data.address,
            name: data.name,
            heartbeat_url: data.heartbeat_url,
            picture_url: data.picture_url
        });

        await d.save();

        return d;
    } catch (ex) {
        throw new DeviceException("Cannot create DeviceData", ex);
    }
}

async function update(device, data) {
    if (!device) {
        throw new InvalidDataException("Missing device");
    }

    if (data.name != null) {
        device.name = data.name;
    }

    if (data.heartbeat_url != null) {
        device.heartbeat_url = data.heartbeat_url;
    }

    if (data.online != null) {
        device.online = !!online;
    }

    if (data.picture_url != null) {
        device.picture_url = data.picture_url;
    }

    try {
        await device.save();

        return device;
    } catch (ex) {
        throw new DeviceException("Cannot update Device " + device.id, ex);
    }
}

module.exports.find = find;
module.exports.get = get;
module.exports.add = add;
module.exports.update = update;