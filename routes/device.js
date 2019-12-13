let express = require("express");
let router = express.Router();

const DeviceController = require("../src/controller/DeviceController");

/**
 * GET: Return all registred devices.
 */
router.get("/", DeviceController.getAllDevices);

/**
 * POST: Register a new device returning the new ID.
 * If the device is already registered, then the same ID is returned.
 */
router.post("/", DeviceController.createDevice);

/**
 * GET: Returns a device by its id.
 */
router.get("/:deviceId", DeviceController.getDeviceById);

/**
 * PUT: Update data of a device by its ID.
 */
router.put("/:deviceId", DeviceController.updateDeviceById);

module.exports = router;