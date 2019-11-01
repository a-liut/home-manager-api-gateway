let express = require("express");
let router = express.Router();
let Device = require("../models/Device");
let mongoose = require('mongoose');

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
                res.status(500).send("ERROR: " + err);
                return;
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
                        res.status(400).send("ERROR: " + err);
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
        res.status(400).send("Invalid device id");
        return;
    }

    Device.findById(req.params.deviceId, (err, device) => {
        res.header("Content-Type", "application/json");

        if (err != null) {
            res.status(500).send("ERROR: " + err);
            return;
        }

        if (device == null) {
            res.status(404).send("Device not found");
            return;
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
            res.status(500).send("ERROR: " + err);
            return;
        }

        if (device == null) {
            res.status(404).send("Device not found");
            return;
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
                res.status(400).send("ERROR: " + err);
            });
    });
});

module.exports = router;