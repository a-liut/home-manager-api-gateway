const DeviceDataService = require("../service/DeviceDataService");
const DeviceService = require("../service/DeviceService");

const DeviceNotFoundException = require("../exception/DeviceNotFoundException");

async function getDeviceData(req, res, next) {
    res.header("Content-Type", "application/json");

    let filter = {
        limit: parseInt(req.query.limit, 10) || 0,
        device_id: req.query.device_id,
        name: req.query.name
    };

    try {
        let list = await DeviceDataService.find(filter);

        res.status(200).json(list);
    } catch (ex) {
        return next(ex);
    }
};

async function getDeviceDataById(req, res, next) {
    res.header("Content-Type", "application/json");

    try {
        let data = await DeviceDataService.get(req.params.deviceId);

        res.status(200).json(data);
    } catch (ex) {
        return next(ex);
    }
};

async function addDeviceData(req, res, next) {
    res.header("Content-Type", "application/json");

    try {
        let device = await DeviceService.get(req.body.device_id);

        if (!device) {
            throw new DeviceNotFoundException("Device not found");
        }

        let data = {
            name: req.body.name,
            value: req.body.value,
            unit: req.body.unit,
            device: device
        };

        let deviceData = await DeviceDataService.add(data);

        res.status(201).json(deviceData);

    } catch (ex) {
        next(ex);
    }
}

module.exports.getDeviceData = getDeviceData;
module.exports.getDeviceDataById = getDeviceDataById;
module.exports.addDeviceData = addDeviceData;