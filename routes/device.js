let express = require("express");
let router = express.Router();
let Device = require("../src/model/device");
let DeviceData = require("../src/model/devicedata");
let mongoose = require("mongoose");
let createError = require("http-errors");

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

    try {
        let devices = await Device.find({
            address: ip
        });

        if (devices.length > 0) {
            // Take the first (and only) element
            res.send(devices[0]._id);
        } else {
            let name = req.body.name || null;
            let heartbeat_url = req.body.heartbeat_url || null;

            // Create a new device
            let data = {
                address: ip
            };

            if (name != null) {
                data.name = name
            }

            if (heartbeat_url != null) {
                data.heartbeat_url = heartbeat_url;
            }

            const device = new Device(data);

            try {
                const d = await device.save();

                res.send(d._id);
            } catch (err) {
                return next(createError(400, err));
            }
        }
    } catch (err) {
        return next(createError(500, err));
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