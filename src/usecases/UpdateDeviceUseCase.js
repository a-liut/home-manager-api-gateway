let mongoose = require("mongoose");

const Device = require("../model/Device");
const UseCase = require("./UseCase");

const InvalidDataException = require("../exception/InvalidDataException");
const DeviceException = require("../exception/DeviceException");
const DeviceNotFoundException = require("../exception/DeviceNotFoundException");

/**
 * Use case that updates data of a registered device.
 * 
 * @param {string} id ID of the device
 * @param {Object} data Object containing device's data
 */
function UpdateDeviceUseCase(id, data) {
    UseCase.call(this);
    this.name = "UpdateDeviceUseCase";

    this.id = id;
    this.data = data;
}

UpdateDeviceUseCase.prototype = Object.create(UseCase.prototype);
Object.defineProperty(UpdateDeviceUseCase.prototype, 'constructor', {
    value: UpdateDeviceUseCase,
    enumerable: false,
    writable: true
})

/**
 * Implement the use case. Update the requested device data with new ones.
 */
UpdateDeviceUseCase.prototype.run = async function run() {
    if (!this.data) throw new InvalidDataException("missing data");

    if (!this.id) {
        throw new InvalidDataException("missing id");
    }

    if (!mongoose.Types.ObjectId.isValid(this.id)) {
        throw new InvalidDataException("invalid device id");
    }

    let device = await Device.findById(this.id);

    if (device == null)
        throw new DeviceNotFoundException("Device " + this.id + " not found");

    return await updateDevice(device, this.data);
}

/**
 * Updates data of a Device.
 * 
 * @param {Device} device The device to update
 * @param {Object} data Object containing device's data
 */
async function updateDevice(device, data) {
    if (data.name != null) {
        device.name = data.name;
    }

    if (data.heartbeat_url != null) {
        device.heartbeat_url = data.heartbeat_url;
    }

    if (data.online != null) {
        device.online = !!online;
    }

    try {
        console.log("Updating " + device.id + "...");

        device.save();

        console.log("Device successfully updated.");

        return device;
    } catch (ex) {
        throw new DeviceException("Cannot update Device " + device.id, ex);
    }
}

module.exports = UpdateDeviceUseCase;