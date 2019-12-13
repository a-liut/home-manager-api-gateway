let express = require("express");
let router = express.Router();

const DeviceDataController = require("../src/controller/DeviceDataController");

/**
 * GET: Return all device data available.
 * A limit value can be specified to limit the number of objects returned.
 */
router.get("/", DeviceDataController.getDeviceData);

/**
 * POST: Add new device data.
 */
router.post("/", DeviceDataController.addDeviceData);

/**
 * GET: Get a specific device data.
 * A limit value can be specified to limit the number of objects returned.
 */
router.get("/:dataId", DeviceDataController.getDeviceDataById);

module.exports = router;