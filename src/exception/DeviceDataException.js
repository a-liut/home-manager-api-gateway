function DeviceDataException(message, cause = null) {
    this.message = message;
    this.name = 'DeviceDataException';
    this.cause = cause;
}

module.exports = DeviceDataException;