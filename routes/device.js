var express = require('express');
var router = express.Router();
var Device = require('../models/Device');

/* GET all registred devices. */
router.get('/', function(req, res, next) {
    Device.find({}, (err, devices) => {
        res.header("Content-Type", 'application/json');
        res.send(JSON.stringify(devices, null, 4));
    });
});

/* POST a new device to register */
router.post("/", function(req, res, next) {
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    Device.find({
        address: ip
    }, (err, devices) => {
        if (devices.length > 0) {
            // Take the first (and only) element
            res.send(devices[0]._id);
        } else {
            // Create a new device
            const device = new Device(req.body);
            device.save()
                .then(device => {
                    res.send(device._id);
                })
                .catch(err => {
                    res.status(400).send("ERROR: " + err);
                });
        }
    });
});

/* POST a new data to upload for a given device */
router.post("/:deviceId/:dataName", function(req, res, next) {
    Device.findById(req.params.deviceId, (err, device) => {
        if (device == null) {
            res.status(404).send("Device not found");
            return
        }

        device.data.push({
            name: req.params.dataName,
            value: req.body.value,
            unit: req.body.unit
        });

        device.save(function(err) {
            if (err) {
                res.status(400).send("ERROR: " + err);
                return
            }

            res.status(200).send("OK");
        });
    })
});

module.exports = router;