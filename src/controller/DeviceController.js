const GetDevicesUseCase = require("../usecase/GetDevicesUseCase");
const RegisterDeviceUseCase = require("../usecase/RegisterDeviceUseCase");
const UpdateDeviceUseCase = require("../usecase/UpdateDeviceUseCase");
const GetDeviceDataUseCase = require("../usecase/GetDeviceDataUseCase");
const AddDeviceDataUseCase = require("../usecase/AddDeviceDataUseCase");

async function getAllDevices(req, res, next) {
    res.header("Content-Type", "application/json");

    let useCase = new GetDevicesUseCase();

    try {
        let devices = await useCase.start();

        res.json(devices);
    } catch (ex) {
        return next(ex);
    }
};

async function createDevice(req, res, next) {
    res.header("Content-Type", "application/json");

    let ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    let data = {
        name: req.body.name || null,
        heartbeat_url: req.body.heartbeat_url || null
    };

    let useCase = new RegisterDeviceUseCase(ip, data);

    try {
        let device = await useCase.start();

        res.status(200).json(device._id);
    } catch (ex) {
        return next(ex);
    }
};

async function getDeviceById(req, res, next) {
    res.header("Content-Type", "application/json");

    let useCase = new GetDevicesUseCase(req.params.deviceId);

    try {
        let devices = await useCase.start();

        res.status(200).json(devices[0]);
    } catch (ex) {
        return next(ex);
    }
};

async function updateDeviceById(req, res, next) {
    res.header("Content-Type", "application/json");

    let data = {
        name: req.body.name,
        heartbeat_url: req.body.heartbeat_url,
        online: req.body.online
    }

    let useCase = new UpdateDeviceUseCase(req.params.deviceId, data);

    try {
        let device = await useCase.start();

        res.status(200).json(device);
    } catch (ex) {
        return next(ex);
    }
};

async function getDeviceData(req, res, next) {
    res.header("Content-Type", "application/json");

    let limit = parseInt(req.query.limit, 10) || 0;

    let findDeviceUseCase = new GetDevicesUseCase(req.params.deviceId);

    try {
        let devices = await findDeviceUseCase.start();
        let device = devices[0];

        let findDeviceDataUseCase = new GetDeviceDataUseCase(device, null, limit);

        let data = await findDeviceDataUseCase.start();

        res.status(200).json(data);
    } catch (ex) {
        return next(ex);
    }
};

async function getDeviceDataByName(req, res, next) {
    res.header("Content-Type", "application/json");

    let dataName = req.params.dataName || "";
    let limit = parseInt(req.query.limit, 10) || 0;

    let findDeviceUseCase = new GetDevicesUseCase(req.params.deviceId);

    try {
        let devices = await findDeviceUseCase.start();
        let device = devices[0];

        let findDeviceDataUseCase = new GetDeviceDataUseCase(device, dataName, limit);

        let data = await findDeviceDataUseCase.start();

        res.status(200).json(data);
    } catch (ex) {
        return next(ex);
    }
};

async function addDeviceData(req, res, next) {
    res.header("Content-Type", "application/json");

    let findDeviceUseCase = new GetDevicesUseCase(req.params.deviceId);

    try {
        let devices = await findDeviceUseCase.start();
        let device = devices[0];

        let data = {
            name: req.params.dataName,
            value: req.body.value,
            unit: req.body.unit
        };

        let updateDeviceDataUseCase = new AddDeviceDataUseCase(device, data);
        let deviceData = await updateDeviceDataUseCase.start();

        res.status(200).json(deviceData);
    } catch (ex) {
        return next(ex);
    }
}

module.exports.getAllDevices = getAllDevices;
module.exports.createDevice = createDevice;
module.exports.getDeviceById = getDeviceById;
module.exports.updateDeviceById = updateDeviceById;
module.exports.getDeviceData = getDeviceData;
module.exports.getDeviceDataByName = getDeviceDataByName;
module.exports.addDeviceData = addDeviceData;