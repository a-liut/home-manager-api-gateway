let express = require("express");
let router = express.Router();
let Device = require("../models/Device");
let mongoose = require("mongoose");
var createError = require("http-errors");

/**
 * GET all registred devices.
 */
router.get("/", function(req, res, next) {
    Device.find({}, (err, devices) => {
        res.header("Content-Type", "application/json");
        res.send(JSON.stringify(devices.map(d => d._id), null, 4));
    });
});

/**
 * POST a new device to register.
 */
router.post("/", function(req, res, next) {
    let ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    Device.find({
            address: ip
        },
        (err, devices) => {
            if (err) {
                return next(createError(500, err));
            }

            if (devices.length > 0) {
                // Take the first (and only) element
                res.send(devices[0]._id);
            } else {
                let name = req.body.name || null;

                // Create a new device
                const device = new Device({
                    address: ip,
                    name: name
                });

                device
                    .save()
                    .then(device => {
                        res.send(device._id);
                    })
                    .catch(err => {
                        return next(createError(400, err));
                    });
            }
        }
    );
});

/**
 * GET a device by its id.
 */
router.get("/:deviceId", function(req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.deviceId)) {
        return next(createError(400, "Invalid device id"));
    }

    Device.findById(req.params.deviceId, (err, device) => {
        res.header("Content-Type", "application/json");

        if (err != null) {
            return next(createError(500, err));
        }

        if (device == null) {
            return next(createError(404, "Device not found"));
        }

        res.status(200).send(JSON.stringify(device));
    });
});

/**
 * POST a new data to upload for a given device.
 */
router.post("/:deviceId/data/:dataName", function(req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.deviceId)) {
        res.status(400).send("Invalid device id");
        return;
    }
    Device.findById(req.params.deviceId, (err, device) => {
        if (err != null) {
            return next(createError(500, err));
        }

        if (device == null) {
            return next(createError(404, "Device not found"));
        }

        device.data.push({
            name: req.params.dataName,
            value: req.body.value,
            unit: req.body.unit
        });

        device
            .save()
            .then(device => {
                res.status(200).send("OK");
            })
            .catch(err => {
                return next(createError(400, err));
            });
    });
});

module.exports = router;