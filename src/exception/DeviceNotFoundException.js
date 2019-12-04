function DeviceNotFoundException(message, cause = null) {
    this.message = message;
    this.name = 'DeviceNotFoundException';
    this.cause = cause;
}

module.exports = DeviceNotFoundException;