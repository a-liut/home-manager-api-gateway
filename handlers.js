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
    devErrorHandler: devErrorHandler,
    prodErrorHandler: prodErrorHandler
}