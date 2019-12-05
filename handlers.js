const createError = require("http-errors");

const InvalidDataException = require("./src/exception/InvalidDataException");
const DeviceNotFoundException = require("./src/exception/DeviceNotFoundException");

function customErrorHandler(err, req, res, next) {
    switch (err.constructor) {
        case InvalidDataException:
            return next(createError(400, err.message));
        case DeviceNotFoundException:
            return next(createError(404, err.message));
        default:
            return next(createError(500, err.message));
    }
}

/**
 * development error handler: will print stacktrace
 */
function devErrorHandler(err, req, res, next) {
    console.log("Error: ", err);
    res.status(err.status || 500);
    res.send({
        message: err.message,
        error: err.stack
    });
}

/**
 * production error handler: no stacktraces leaked to user
 */
function prodErrorHandler(err, req, res, next) {
    res.status(err.status || 500);
    res.send({
        message: err.message
    });
}

module.exports = {
    customErrorHandler: customErrorHandler,
    devErrorHandler: devErrorHandler,
    prodErrorHandler: prodErrorHandler
}