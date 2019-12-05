let mongoose = require("mongoose");

const Device = require("../model/Device");
const DeviceData = require("../model/DeviceData");
const UseCase = require("./UseCase");

const InvalidDataException = require("../exception/InvalidDataException");
const DeviceNotFoundException = require("../exception/DeviceNotFoundException");

/**
 * Use case that fetches devices from the data source.
 * @param {Device} device Device to fetch data for
 */
function GetDeviceDataUseCase(device, dataName = null, limit = 0) {
    UseCase.call(this);
    this.name = "GetDeviceDataUseCase";

    this.device = device;
    this.dataName = dataName;
    this.limit = limit;
}

GetDeviceDataUseCase.prototype = Object.create(UseCase.prototype);
Object.defineProperty(GetDeviceDataUseCase.prototype, 'constructor', {
    value: GetDeviceDataUseCase,
    enumerable: false,
    writable: true
})

/**
 * Implement the use case. Return a list of DeviceData objects.
 */
GetDeviceDataUseCase.prototype.run = async function run() {
    if (!this.device) throw new InvalidDataException("missing device");

    var query = DeviceData.find().byDeviceId(this.device.id);

    if (this.limit > 0) {
        query = query.limit(this.limit);
    }

    if (this.dataName != null) {
        query.where({ name: this.dataName });
    }

    return await query;
}

module.exports = GetDeviceDataUseCase;