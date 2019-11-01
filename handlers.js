function devErrorHandler(err, req, res, next) {
    res.status(err.status || 500);
    res.send({
        message: err.message,
        error: err.stack
    });
}

function prodErrorHandler(err, req, res, next) {
    res.status(err.status || 500);
    res.send({
        message: err.message,
        error: {}
    });
}

module.exports = {
    devErrorHandler: devErrorHandler,
    prodErrorHandler: prodErrorHandler
}