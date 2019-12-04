const Device = require("../model/Device");
const UseCase = require("./UseCase");

/**
 * Use case that fetches devices from the data source.
 */
function GetDevicesUseCase() {
    UseCase.call(this);
    this.name = "GetDevicesUseCase";
}

GetDevicesUseCase.prototype = Object.create(UseCase.prototype);
Object.defineProperty(GetDevicesUseCase.prototype, 'constructor', {
    value: GetDevicesUseCase,
    enumerable: false,
    writable: true
})

/**
 * Implement the use case.
 */
GetDevicesUseCase.prototype.run = async function run() {
    return await Device.find().populate({ path: "data", select: 'name device' });
}

module.exports = GetDevicesUseCase;