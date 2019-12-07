const sinon = require("sinon");

function buildReq(headers = {}, connection = {}, params = {}, body = {}, query = {}) {
    return {
        headers: headers,
        connection: connection,
        params: params,
        body: body,
        query: query
    }
}

function buildRes(header = sinon.stub(), status = sinon.stub(), json = sinon.stub()) {
    return {
        header: header,
        status: status,
        json: json
    }
}

module.exports.buildReq = buildReq;
module.exports.buildRes = buildRes;