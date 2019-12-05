let express = require("express");
let router = express.Router();
let mongoose = require("mongoose");
let createError = require("http-errors");

let Device = require("../src/model/Device");
let DeviceData = require("../src/model/DeviceData");

const GetDevicesUseCase = require("../src/usecase/GetDevicesUseCase");
const RegisterDeviceUseCase = require("../src/usecase/RegisterDeviceUseCase");
const UpdateDeviceUseCase = require("../src/usecase/UpdateDeviceUseCase");
const GetDeviceDataUseCase = require("../src/usecase/GetDeviceDataUseCase");
const AddDeviceDataUseCase = require("../src/usecase/AddDeviceDataUseCase");

const InvalidDataException = require("../src/exception/InvalidDataException");
const DeviceNotFoundException = require("../src/exception/DeviceNotFoundException");

/**
 * GET all registred devices.
 */
router.get("/", async function(req, res, next) {
    res.header("Content-Type", "application/json");

    let useCase = new GetDevicesUseCase();

    try {
        let devices = await useCase.start();

        res.json(devices);
    } catch (err) {
        return next(createError(500, ex.message));
    }
});

/**
 * POST a new device to register.
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
        console.log("Exception: ", ex);
        switch (ex.constructor) {
            case InvalidDataException:
                return next(createError(400, ex.message));
            default:
                return next(createError(500, ex.message));
        }
    }
});

/**
 * GET a device by its id.
 */
router.get("/:deviceId", async function(req, res, next) {
    res.header("Content-Type", "application/json");

    let useCase = new GetDevicesUseCase(req.params.deviceId);

    try {
        let devices = await useCase.start();

        res.status(200).json(devices[0]);
    } catch (ex) {
        switch (ex.constructor) {
            case DeviceNotFoundException:
                return next(createError(404, ex.message));
            case InvalidDataException:
                return next(createError(400, ex.message));
            default:
                return next(createError(500, ex.message));
        }
    }
});

/**
 * PUT Updates a device by its id.
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
        switch (ex.constructor) {
            case DeviceNotFoundException:
                return next(createError(404, ex.message));
            case InvalidDataException:
                return next(createError(400, ex.message));
            default:
                return next(createError(500, ex.message));
        }
    }
});

/**
 * GET Get all device data.
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
        switch (ex.constructor) {
            case DeviceNotFoundException:
                return next(createError(404, ex.message));
            case InvalidDataException:
                return next(createError(400, ex.message));
            default:
                return next(createError(500, ex.message));
        }
    }
});

/**
 * GET Get device data with a specific name.
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
        switch (ex.constructor) {
            case DeviceNotFoundException:
                return next(createError(404, ex.message));
            case InvalidDataException:
                return next(createError(400, ex.message));
            default:
                return next(createError(500, ex.message));
        }
    }
});

/**
 * POST a new data to upload for a given device.
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
        switch (ex.constructor) {
            case DeviceNotFoundException:
                return next(createError(404, ex.message));
            case InvalidDataException:
                return next(createError(400, ex.message));
            default:
                return next(createError(500, ex.message));
        }
    }
});

module.exports = router;