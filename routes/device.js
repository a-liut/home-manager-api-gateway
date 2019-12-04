let express = require("express");
let router = express.Router();
let Device = require("../src/model/Device");
let DeviceData = require("../src/model/DeviceData");
let mongoose = require("mongoose");
let createError = require("http-errors");

const RegisterDeviceUseCase = require("../src/usecases/RegisterDeviceUseCase");
const InvalidDataException = require("../src/exception/InvalidDataException");

/**
 * GET all registred devices.
 */
router.get("/", async function(req, res, next) {
    res.header("Content-Type", "application/json");

    try {
        let devices = await Device.find().populate({ path: "data", select: 'name device' })

        res.json(devices);
    } catch (err) {
        return next(err);
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

    if (!mongoose.Types.ObjectId.isValid(req.params.deviceId)) {
        return next(createError(400, "Invalid device id"));
    }

    try {
        let device = await Device.findById(req.params.deviceId).populate({ path: "data", select: 'name device' });
        if (device == null) return next(createError(404, "Device not found"));

        res.status(200).json(device);
    } catch (err) {
        return next(createError(500, err));
    }
});

/**
 * PUT Updates a device by its id.
 */
router.put("/:deviceId", async function(req, res, next) {
    res.header("Content-Type", "application/json");

    if (!mongoose.Types.ObjectId.isValid(req.params.deviceId)) {
        return next(createError(400, "Invalid device id"));
    }

    try {
        let device = await Device.findById(req.params.deviceId).populate({ path: "data", select: 'name device' });
        if (device == null) return next(createError(404, "Device not found"));

        let name = req.body.name || null;
        let heartbeat_url = req.body.heartbeat_url || null;
        let online = req.body.online || null;

        if (name != null) {
            device.name = name;
        }

        if (heartbeat_url != null) {
            device.heartbeat_url = heartbeat_url;
        }

        if (online != null) {
            device.online = !!online;
        }

        try {
            const d = await device.save();

            res.send(d);
        } catch (err) {
            return next(createError(400, err));
        }
    } catch (err) {
        return next(createError(500, err));
    }
});

/**
 * GET Get all device data.
 * A limit value can be specified to limit the number of objects returned.
 */
router.get("/:deviceId/data", async function(req, res, next) {
    res.header("Content-Type", "application/json");

    let limit = parseInt(req.query.limit, 10) || 0;

    if (!mongoose.Types.ObjectId.isValid(req.params.deviceId)) {
        return next(createError(400, "Invalid device id"));
    }

    try {
        let device = await Device.findById(req.params.deviceId);
        if (device == null) return next(createError(404, "Device not found"));

        var query = DeviceData.find().byDeviceId(device.id);

        if (limit > 0) {
            query = query.limit(limit);
        }

        let data = await query;

        res.status(200).json(data);
    } catch (err) {
        return next(createError(500, err));
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

    if (!mongoose.Types.ObjectId.isValid(req.params.deviceId)) {
        return next(createError(400, "Invalid device id"));
    }

    try {
        let device = await Device.findById(req.params.deviceId);
        if (device == null) return next(createError(404, "Device not found"));

        var query = DeviceData.find({ name: dataName });

        if (limit > 0) {
            query = query.limit(limit);
        }

        let data = await query;

        res.status(200).json(data);
    } catch (err) {
        return next(createError(500, err));
    }
});

/**
 * POST a new data to upload for a given device.
 */
router.post("/:deviceId/data/:dataName", async function(req, res, next) {
    res.header("Content-Type", "application/json");

    if (!mongoose.Types.ObjectId.isValid(req.params.deviceId)) {
        return next(createError(400, "Invalid device id"));
    }

    try {
        let device = await Device.findById(req.params.deviceId);
        if (device == null) return next(createError(404, "Device not found"));

        var d = new DeviceData({
            name: req.params.dataName,
            value: req.body.value,
            unit: req.body.unit,
            device: device.id
        });

        try {
            await d.save();

            res.status(200).json({
                message: "Data inserted successfully"
            });
        } catch (err) {
            return next(createError(400, err));
        }
    } catch (err) {
        return next(createError(500, err));
    }
});

module.exports = router;