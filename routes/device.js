let express = require("express");
let router = express.Router();
let Device = require("../src/models/device");
let mongoose = require("mongoose");
let createError = require("http-errors");

/**
 * GET all registred devices.
 */
router.get("/", async function(req, res, next) {
    res.header("Content-Type", "application/json");

    try {
        let devices = await Device.find();

        res.send(JSON.stringify(devices.map(d => d._id), null, 4));
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

            // Create a new device
            let data = {
                address: ip
            };

            if (name != null) {
                data.name = name
            }

            const device = new Device(data);

            try {
                const d = await device.save();

                res.send(device._id);
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
        let device = await Device.findById(req.params.deviceId);
        if (device == null) return next(createError(404, "Device not found"));

        // clean output
        let ret = {
            name: device.name,
            online: device.online,
            address: device.address,
            created_at: device.created_at,
            updated_at: device.updated_at
        }

        res.status(200).send(JSON.stringify(ret));
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
        let device = await Device.findById(req.params.deviceId);
        if (device == null) return next(createError(404, "Device not found"));

        let name = req.body.name || null;

        if (name != null) {
            device.name = name;
        }

        try {
            const d = await device.save();

            res.send(device);
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

    let limit = req.query.limit || 0;

    if (!mongoose.Types.ObjectId.isValid(req.params.deviceId)) {
        return next(createError(400, "Invalid device id"));
    }

    try {
        let device = await Device.findById(req.params.deviceId);
        if (device == null) return next(createError(404, "Device not found"));

        let ret = device.data || [];

        // Filter data
        if (limit > 0) {
            ret = ret.slice(ret.length - limit, ret.length);
        }

        res.status(200).send(JSON.stringify(ret));
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

    let dataName = req.params.dataName || 0;
    let limit = req.query.limit || 0;

    if (!mongoose.Types.ObjectId.isValid(req.params.deviceId)) {
        return next(createError(400, "Invalid device id"));
    }

    try {
        let device = await Device.findById(req.params.deviceId);
        if (device == null) return next(createError(404, "Device not found"));

        let ret = device.data.filter(d => d.name == dataName) || [];

        // Filter data
        if (limit > 0) {
            ret = ret.slice(ret.length - limit, ret.length);
        }

        res.status(200).send(JSON.stringify(ret));
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

        device.data.push({
            name: req.params.dataName,
            value: req.body.value,
            unit: req.body.unit
        });

        try {
            await device.save();

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