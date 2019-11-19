let express = require("express");
let router = express.Router();
let Device = require("../src/model/device");
let mongoose = require("mongoose");
let createError = require("http-errors");

function processDevice(device) {
    // Find data names
    let datanames = device.data
        .map(d => d.name)
        .reduce((accumulator, dataName) => {
            if (!accumulator.includes(dataName)) {
                accumulator.push(dataName);
            }
            return accumulator
        }, []);

    return {
        id: device._id,
        name: device.name,
        online: device.online,
        address: device.address,
        heartbeat_url: device.heartbeat_url,
        data: datanames,
        created_at: device.created_at,
        updated_at: device.updated_at
    }
}

/**
 * GET all registred devices.
 */
router.get("/", async function(req, res, next) {
    res.header("Content-Type", "application/json");

    try {
        let devices = await Device.find();

        let ret = devices.map(processDevice);

        res.send(JSON.stringify(ret, null, 4));
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
        let device = await Device.findById(req.params.deviceId);
        if (device == null) return next(createError(404, "Device not found"));

        // clean output
        let ret = processDevice(device)

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
            ret = ret.slice(0, limit);
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

        device.data.splice(0, 0, {
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