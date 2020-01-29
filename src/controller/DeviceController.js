const DeviceService = require("../service/DeviceService");

const DeviceNotFoundException = require("../exception/DeviceNotFoundException");

async function getAllDevices(req, res, next) {
    res.header("Content-Type", "application/json");

    try {
        let devices = await DeviceService.find();

        res.json(devices);
    } catch (ex) {
        return next(ex);
    }
};

async function getDeviceById(req, res, next) {
    res.header("Content-Type", "application/json");

    try {
        let device = await DeviceService.get(req.params.deviceId);
        if (!device) {
            throw new DeviceNotFoundException("Device " + req.params.deviceId + " not found.");
        }

        res.status(200).json(device);
    } catch (ex) {
        return next(ex);
    }
};

async function createDevice(req, res, next) {
    res.header("Content-Type", "application/json");

    let ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    let data = {
        address: ip,
        name: req.body.name || null,
        heartbeat_url: req.body.heartbeat_url || null,
        picture_url: req.body.picture_url || null
    };

    try {
        let device = await DeviceService.add(data);

        res.status(200).json(device._id);
    } catch (ex) {
        return next(ex);
    }
};

async function updateDeviceById(req, res, next) {
    res.header("Content-Type", "application/json");

    let data = {
        name: req.body.name,
        heartbeat_url: req.body.heartbeat_url,
        online: req.body.online,
        picture_url: req.body.picture_url || null
    }

    try {
        let device = await DeviceService.get(req.params.deviceId);
        if (!device) {
            throw new DeviceNotFoundException("Device not found");
        }

        device = await DeviceService.update(device, data);

        res.status(200).json(device);
    } catch (ex) {
        return next(ex);
    }
};

module.exports.getAllDevices = getAllDevices;
module.exports.createDevice = createDevice;
module.exports.getDeviceById = getDeviceById;
module.exports.updateDeviceById = updateDeviceById;