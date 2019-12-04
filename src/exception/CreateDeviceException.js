function CreateDeviceException(message, cause = null) {
    this.message = message;
    this.name = 'CreateDeviceException';
    this.cause = cause;
}

module.exports = CreateDeviceException;