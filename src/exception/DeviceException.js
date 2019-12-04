function DeviceException(message, cause = null) {
    this.message = message;
    this.name = 'DeviceException';
    this.cause = cause;
}

module.exports = DeviceException;