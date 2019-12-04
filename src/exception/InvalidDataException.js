function InvalidDataException(message, cause = null) {
    this.message = message;
    this.name = 'InvalidDataException';
    this.cause = cause;
}

module.exports = InvalidDataException;