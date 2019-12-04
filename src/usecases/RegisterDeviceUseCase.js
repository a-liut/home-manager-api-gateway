const Device = require("../model/Device");
const UseCase = require("./UseCase");
const InvalidDataException = require("../exception/InvalidDataException");
const CreateDeviceException = require("../exception/CreateDeviceException");

/**
 * Use case that implements the registration process of a new device.
 * 
 * @param {string} ip IP address of the device
 * @param {Object} data Object containing device's data
 */
function RegisterDeviceUseCase(ip, data) {
    UseCase.call(this);
    this.name = "RegisterDeviceUseCase";

    this.ip = ip;
    this.data = data;
}

RegisterDeviceUseCase.prototype = Object.create(UseCase.prototype);
Object.defineProperty(RegisterDeviceUseCase.prototype, 'constructor', {
    value: RegisterDeviceUseCase,
    enumerable: false,
    writable: true
})

/**
 * Implement the use case.
 */
RegisterDeviceUseCase.prototype.run = async function run() {
    if (!this.data) throw new InvalidDataException("missing data");

    if (!this.ip) {
        throw new InvalidDataException("missing ip");
    }

    let devices = await Device.find({
        address: this.ip
    });

    if (devices.length > 0) {
        console.log("Device already registered: ", devices[0]);

        return devices[0];
    }

    let data = Object.assign({}, this.data, { ip: this.ip });

    return await registerDevice(data);
}

/**
 * Register a new Device.
 * @param {Object} data Object containing device's data
 */
async function registerDevice(data) {
    let deviceData = {
        address: data.ip
    }

    if (data.name != null) {
        deviceData.name = data.name;
    }

    if (data.heartbeat_url != null) {
        deviceData.heartbeat_url = data.heartbeat_url;
    }

    try {
        console.log("Creating a new Device...");

        const d = new Device(deviceData);

        d.save();

        console.log("A new Device has been created: ", d._id);

        return d;
    } catch (ex) {
        throw new CreateDeviceException("Cannot create a new Device", ex);
    }
}

module.exports = RegisterDeviceUseCase;