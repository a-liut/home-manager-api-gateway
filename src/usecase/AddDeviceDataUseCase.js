let mongoose = require("mongoose");

const Device = require("../model/Device");
const DeviceData = require("../model/DeviceData");
const UseCase = require("./UseCase");

const InvalidDataException = require("../exception/InvalidDataException");
const DeviceDataException = require("../exception/DeviceDataException");

/**
 * Use case that fetches devices from the data source.
 * @param {Device} device Device to fetch data for
 */
function AddDeviceDataUseCase(device, data) {
    UseCase.call(this);
    this.name = "AddDeviceDataUseCase";

    this.device = device;
    this.data = data;
}

AddDeviceDataUseCase.prototype = Object.create(UseCase.prototype);
Object.defineProperty(AddDeviceDataUseCase.prototype, 'constructor', {
    value: AddDeviceDataUseCase,
    enumerable: false,
    writable: true
})

/**
 * Implement the use case. Creates a new DeviceData object for the specified Device.
 */
AddDeviceDataUseCase.prototype.run = async function run() {
    if (!this.device) throw new InvalidDataException("missing device");

    if (!this.data.name)  throw new InvalidDataException("missing name");

    if (!this.data.value)  throw new InvalidDataException("missing value");

    try {
        let d = new DeviceData({
            name: this.data.name,
            value: this.data.value,
            unit: this.data.unit,
            device: this.device.id
        });

        await d.save();

        return d;
    } catch (ex) {
        throw new DeviceDataException("Cannot create DeviceData", ex);
    }
}

module.exports = AddDeviceDataUseCase;