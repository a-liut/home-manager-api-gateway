let mongoose = require("mongoose");

const Device = require("../model/Device");
const UseCase = require("./UseCase");

const InvalidDataException = require("../exception/InvalidDataException");
const DeviceNotFoundException = require("../exception/DeviceNotFoundException");

/**
 * Use case that fetches devices from the data source.
 * @param {string} id Id of the device to find
 */
function GetDevicesUseCase(id) {
    UseCase.call(this);
    this.name = "GetDevicesUseCase";

    this.id = id;
}

GetDevicesUseCase.prototype = Object.create(UseCase.prototype);
Object.defineProperty(GetDevicesUseCase.prototype, 'constructor', {
    value: GetDevicesUseCase,
    enumerable: false,
    writable: true
})

/**
 * Implement the use case. Return a list of Device objects.
 */
GetDevicesUseCase.prototype.run = async function run() {
    if (this.id) {
        if (!mongoose.Types.ObjectId.isValid(this.id)) {
            throw new InvalidDataException("invalid device id");
        }

        let d = await Device.findById(this.id).populate({ path: "data", select: 'name device' });

        if (d == null) throw new DeviceNotFoundException("device " + this.id + " not found");

        return [d];
    }

    return await Device.find().populate({ path: "data", select: 'name device' });
}

module.exports = GetDevicesUseCase;