let express = require("express");
let router = express.Router();

const GetDevicesUseCase = require("../src/usecase/GetDevicesUseCase");
const RegisterDeviceUseCase = require("../src/usecase/RegisterDeviceUseCase");
const UpdateDeviceUseCase = require("../src/usecase/UpdateDeviceUseCase");
const GetDeviceDataUseCase = require("../src/usecase/GetDeviceDataUseCase");
const AddDeviceDataUseCase = require("../src/usecase/AddDeviceDataUseCase");

/**
 * GET: Return all registred devices.
 */
router.get("/", async function(req, res, next) {
    res.header("Content-Type", "application/json");

    let useCase = new GetDevicesUseCase();

    try {
        let devices = await useCase.start();

        res.json(devices);
    } catch (ex) {
        return next(ex);
    }
});

/**
 * POST: Register a new device returning the new ID.
 * If the device is already registered, then the same ID is returned.
 */
router.post("/", async function(req, res, next) {
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
});

/**
 * GET: Returns a device by its id.
 */
router.get("/:deviceId", async function(req, res, next) {
    res.header("Content-Type", "application/json");

    let useCase = new GetDevicesUseCase(req.params.deviceId);

    try {
        let devices = await useCase.start();

        res.status(200).json(devices[0]);
    } catch (ex) {
        return next(ex);
    }
});

/**
 * PUT: Update data of a device by its ID.
 */
router.put("/:deviceId", async function(req, res, next) {
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
});

/**
 * GET: Return all data of a specified device.
 * A limit value can be specified to limit the number of objects returned.
 */
router.get("/:deviceId/data", async function(req, res, next) {
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
});

/**
 * GET: Return all data with a specific name of a speficied device.
 * A limit value can be specified to limit the number of objects returned.
 */
router.get("/:deviceId/data/:dataName", async function(req, res, next) {
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
});

/**
 * POST: Add new data for a given device.
 */
router.post("/:deviceId/data/:dataName", async function(req, res, next) {
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
});

module.exports = router;