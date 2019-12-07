const chai = require("chai");
const sinon = require("sinon");
const expect = chai.expect;

const TestUtils = require("../util/TestUtils");

const DeviceController = require("../../src/controller/DeviceController");
const GetDevicesUseCase = require("../../src/usecase/GetDevicesUseCase");
const RegisterDeviceUseCase = require("../../src/usecase/RegisterDeviceUseCase");
const UpdateDeviceUseCase = require("../../src/usecase/UpdateDeviceUseCase");
const GetDeviceDataUseCase = require("../../src/usecase/GetDeviceDataUseCase");
const AddDeviceDataUseCase = require("../../src/usecase/AddDeviceDataUseCase");

const InvalidDataException = require("../../src/exception/InvalidDataException");
const DeviceException = require("../../src/exception/DeviceException");
const DeviceDataException = require("../../src/exception/DeviceDataException");

// chai.use(chaiHttp);
chai.should();

describe("DeviceController", () => {
    describe("getAllDevices", () => {
        let useCaseStub;

        beforeEach(() => {
            useCaseStub = sinon.stub(GetDevicesUseCase.prototype, "start");
        });

        afterEach(() => {
            useCaseStub.restore();
        });

        it("should send all devices", async() => {
            let testDevices = [{ id: "test" }];

            useCaseStub.returns(Promise.resolve(testDevices));

            let req = TestUtils.buildReq();
            let res = TestUtils.buildRes();
            let next = () => {};

            await DeviceController.getAllDevices(req, res, next);

            expect(res.json.calledOnceWith(testDevices)).to.be.true;
        });
    });

    describe("createDevice", () => {
        let useCaseStub;

        beforeEach(() => {
            useCaseStub = sinon.stub(RegisterDeviceUseCase.prototype, "start");
        });

        afterEach(() => {
            useCaseStub.restore();
        });

        it("should fail on error", async() => {
            let ex = new InvalidDataException();
            useCaseStub.throws(ex);

            let req = TestUtils.buildReq();
            let res = TestUtils.buildRes();
            let nextStub = sinon.spy();

            await DeviceController.createDevice(req, res, nextStub);

            expect(nextStub.calledOnceWith(ex)).to.be.true;
        });

        it("should send an id on success", async() => {
            let device = {
                _id: "abcdefghilmnopqrstuvz",
                name: "test"
            };

            useCaseStub.returns(Promise.resolve(device));

            let req = TestUtils.buildReq();
            let res = TestUtils.buildRes();
            let next = () => {};

            res.status.returns(res);

            await DeviceController.createDevice(req, res, next);

            expect(res.status.calledOnceWith(200)).to.be.true;
            expect(res.json.calledOnceWith(device._id)).to.be.true;
        });
    });

    describe("getDeviceById", () => {
        let useCaseStub;

        beforeEach(() => {
            useCaseStub = sinon.stub(GetDevicesUseCase.prototype, "start");
        });

        afterEach(() => {
            useCaseStub.restore();
        });

        it("should fail on error", async() => {
            let ex = new DeviceException();
            useCaseStub.throws(ex);

            let req = TestUtils.buildReq();
            let res = TestUtils.buildRes();
            let nextStub = sinon.spy();

            await DeviceController.getDeviceById(req, res, nextStub);

            expect(nextStub.calledOnceWith(ex)).to.be.true;
        });

        it("should send a device on success", async() => {
            let device = {
                _id: "abcdefghilmnopqrstuvz",
                name: "test"
            };

            let devices = [device];

            useCaseStub.returns(Promise.resolve(devices));

            let req = TestUtils.buildReq();
            let res = TestUtils.buildRes();
            let next = () => {};

            res.status.returns(res);

            await DeviceController.getDeviceById(req, res, next);

            expect(res.status.calledOnceWith(200)).to.be.true;
            expect(res.json.calledOnceWith(device)).to.be.true;
        });
    });

    describe("updateDeviceById", () => {
        let useCaseStub;

        beforeEach(() => {
            useCaseStub = sinon.stub(UpdateDeviceUseCase.prototype, "start");
        });

        afterEach(() => {
            useCaseStub.restore();
        });

        it("should fail on error", async() => {
            let ex = new DeviceException();
            useCaseStub.throws(ex);

            let req = TestUtils.buildReq();
            let res = TestUtils.buildRes();
            let nextStub = sinon.spy();

            await DeviceController.updateDeviceById(req, res, nextStub);

            expect(nextStub.calledOnceWith(ex)).to.be.true;
        });

        it("should send a device on success", async() => {
            let device = {
                _id: "abcdefghilmnopqrstuvz",
                name: "test"
            };

            useCaseStub.returns(Promise.resolve(device));

            let req = TestUtils.buildReq();
            let res = TestUtils.buildRes();
            let next = () => {};

            res.status.returns(res);

            await DeviceController.updateDeviceById(req, res, next);

            expect(res.status.calledOnceWith(200)).to.be.true;
            expect(res.json.calledOnceWith(device)).to.be.true;
        });
    });

    describe("getDeviceData", () => {
        let getDeviceUseCaseStub;
        let getDevicesDataUseCaseStub;

        beforeEach(() => {
            getDeviceUseCaseStub = sinon.stub(GetDevicesUseCase.prototype, "start");
            getDevicesDataUseCaseStub = sinon.stub(GetDeviceDataUseCase.prototype, "start");
        });

        afterEach(() => {
            getDeviceUseCaseStub.restore();
            getDevicesDataUseCaseStub.restore();
        });

        it("should fail on error fetching the device", async() => {
            let ex = new DeviceException();
            getDeviceUseCaseStub.throws(ex);

            let req = TestUtils.buildReq();
            let res = TestUtils.buildRes();
            let nextStub = sinon.spy();

            await DeviceController.getDeviceData(req, res, nextStub);

            expect(nextStub.calledOnceWith(ex)).to.be.true;
        });

        it("should fail on error fetching data", async() => {
            let devices = [{
                _id: "abcdefghilmnopqrstuvz",
                name: "test"
            }];

            getDeviceUseCaseStub.returns(devices);

            let ex = new DeviceException();
            getDevicesDataUseCaseStub.throws(ex);

            let req = TestUtils.buildReq();
            let res = TestUtils.buildRes();
            let nextStub = sinon.spy();

            await DeviceController.getDeviceData(req, res, nextStub);

            expect(nextStub.calledOnceWith(ex)).to.be.true;
        });

        it("should send a list of data on success", async() => {
            let devices = [{
                _id: "abcdefghilmnopqrstuvz",
                name: "test"
            }];

            let data = [{
                _id: "abcdefghilmnopqrstuvz",
                name: "test",
                value: 22
            }];

            getDeviceUseCaseStub.returns(Promise.resolve(devices));
            getDevicesDataUseCaseStub.returns(Promise.resolve(data));

            let req = TestUtils.buildReq();
            let res = TestUtils.buildRes();
            let next = () => {};

            res.status.returns(res);

            await DeviceController.getDeviceData(req, res, next);

            expect(res.status.calledOnceWith(200)).to.be.true;
            expect(res.json.calledOnceWith(data)).to.be.true;
        });

        it("should send a list of data with specific length on success", async() => {
            let devices = [{
                _id: "deviceId",
                name: "test"
            }];

            let data = [{
                _id: "a1",
                name: "test1",
                value: 21
            }, {
                _id: "b2",
                name: "test2",
                value: 22
            }, {
                _id: "c3",
                name: "test3",
                value: 23
            }];

            getDeviceUseCaseStub.returns(Promise.resolve(devices));
            getDevicesDataUseCaseStub.returns(Promise.resolve(data));

            let req = TestUtils.buildReq();
            req.query.limit = 3;
            let res = TestUtils.buildRes();
            let next = () => {};

            res.status.returns(res);

            await DeviceController.getDeviceData(req, res, next);

            expect(res.status.calledOnceWith(200)).to.be.true;

            expect(res.json.calledOnce).to.be.true;

            let jsonCallArgs = res.json.getCall(0).args[0];
            expect(jsonCallArgs)
                .to.be.an('array')
                .to.have.lengthOf(3)
                .to.include.members(data);
        });
    });

    describe("addDeviceData", () => {
        let getDeviceUseCaseStub;
        let addDeviceDataUseCaseStub;

        beforeEach(() => {
            getDeviceUseCaseStub = sinon.stub(GetDevicesUseCase.prototype, "start");
            addDeviceDataUseCaseStub = sinon.stub(AddDeviceDataUseCase.prototype, "start");
        });

        afterEach(() => {
            getDeviceUseCaseStub.restore();
            addDeviceDataUseCaseStub.restore();
        });

        it("should fail on error fetching the device", async() => {
            let ex = new DeviceException();
            getDeviceUseCaseStub.throws(ex);

            let req = TestUtils.buildReq();
            let res = TestUtils.buildRes();
            let nextStub = sinon.spy();

            await DeviceController.addDeviceData(req, res, nextStub);

            expect(nextStub.calledOnceWith(ex)).to.be.true;
        });

        it("should fail on error inserting new data", async() => {
            let devices = [{
                _id: "abcdefghilmnopqrstuvz",
                name: "test"
            }];

            getDeviceUseCaseStub.returns(devices);

            let ex = new DeviceDataException();
            addDeviceDataUseCaseStub.throws(ex);

            let req = TestUtils.buildReq();
            let res = TestUtils.buildRes();
            let nextStub = sinon.spy();

            await DeviceController.addDeviceData(req, res, nextStub);

            expect(nextStub.calledOnceWith(ex)).to.be.true;
        });

        it("should send the inserted DeviceData on success", async() => {
            let devices = [{
                _id: "abcdefghilmnopqrstuvz",
                name: "test"
            }];

            let data = {
                _id: "abcdefghilmnopqrstuvz",
                name: "test",
                value: "22",
                unit: "test",
                device: devices[0]._id
            };

            getDeviceUseCaseStub.returns(Promise.resolve(devices));
            addDeviceDataUseCaseStub.returns(Promise.resolve(data));

            let req = TestUtils.buildReq({}, {}, {
                deviceId: data._id,
                dataName: data.name
            }, {
                value: data.value,
                unit: data.unit
            });
            let res = TestUtils.buildRes();
            let next = () => {};

            res.status.returns(res);

            await DeviceController.addDeviceData(req, res, next);

            expect(res.status.calledOnceWith(200)).to.be.true;
            expect(res.json.calledOnce).to.be.true;

            let jsonCallArgs = res.json.getCall(0).args[0];
            expect(jsonCallArgs)
                .to.be.an('object')
                .to.have.any.keys('value', 'name', 'unit', 'name', 'device');

            expect(jsonCallArgs).to.have.property('name', req.params.dataName).that.is.a("string");
            expect(jsonCallArgs).to.have.property('value', req.body.value).that.is.a("string");
            expect(jsonCallArgs).to.have.property('unit', req.body.unit).that.is.a("string");
            expect(jsonCallArgs).to.have.property('device', req.params.deviceId).that.is.a("string");
        });
    });
});