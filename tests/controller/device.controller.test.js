const chai = require("chai");
const sinon = require("sinon");
const expect = chai.expect;

const TestUtils = require("../util/TestUtils");

const DeviceController = require("../../src/controller/DeviceController");

const DeviceService = require("../../src/service/DeviceService");

const InvalidDataException = require("../../src/exception/InvalidDataException");
const DeviceException = require("../../src/exception/DeviceException");
const DeviceDataException = require("../../src/exception/DeviceDataException");
const DeviceNotFoundException = require("../../src/exception/DeviceNotFoundException");

chai.should();

describe("DeviceController", () => {
    describe("getAllDevices", () => {
        let deviceServiceStub;

        beforeEach(() => {
            deviceServiceStub = sinon.stub(DeviceService, "find");
        });

        afterEach(() => {
            deviceServiceStub.restore();
        });

        it("should send all devices", async() => {
            let testDevices = [{ id: "test" }];

            deviceServiceStub.returns(Promise.resolve(testDevices));

            let req = TestUtils.buildReq();
            let res = TestUtils.buildRes();
            let next = () => {};

            await DeviceController.getAllDevices(req, res, next);

            expect(res.json.calledOnceWith(testDevices)).to.be.true;
        });
    });

    describe("getDeviceById", () => {
        let deviceServiceStub;

        beforeEach(() => {
            deviceServiceStub = sinon.stub(DeviceService, "get");
        });

        afterEach(() => {
            deviceServiceStub.restore();
        });

        it("should fail on error", async() => {
            let ex = new DeviceException();
            deviceServiceStub.throws(ex);

            let req = TestUtils.buildReq();
            let res = TestUtils.buildRes();
            let nextStub = sinon.spy();

            await DeviceController.getDeviceById(req, res, nextStub);

            expect(nextStub.calledOnceWith(ex)).to.be.true;
        });

        it("should fail on device not found", async() => {
            deviceServiceStub.returns(null);

            let req = TestUtils.buildReq();
            let res = TestUtils.buildRes();
            let nextStub = sinon.spy();

            await DeviceController.getDeviceById(req, res, nextStub);

            expect(nextStub.calledOnce).to.be.true;

            let thrownException = nextStub.getCall(0).args[0];

            // TODO: check the type of the object!
            expect(thrownException.name).to.be.eq('DeviceNotFoundException');
        });

        it("should send a device on success", async() => {
            let device = {
                _id: "abcdefghilmnopqrstuvz",
                name: "test"
            };

            deviceServiceStub.returns(Promise.resolve(device));

            let req = TestUtils.buildReq();
            let res = TestUtils.buildRes();
            let next = () => {};

            res.status.returns(res);

            await DeviceController.getDeviceById(req, res, next);

            expect(res.status.calledOnceWith(200)).to.be.true;
            expect(res.json.calledOnceWith(device)).to.be.true;
        });
    });

    describe("createDevice", () => {
        let deviceServiceStub;

        beforeEach(() => {
            deviceServiceStub = sinon.stub(DeviceService, "add");
        });

        afterEach(() => {
            deviceServiceStub.restore();
        });

        it("should fail on error", async() => {
            let ex = new InvalidDataException();
            deviceServiceStub.throws(ex);

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

            deviceServiceStub.returns(Promise.resolve(device));

            let req = TestUtils.buildReq();
            let res = TestUtils.buildRes();
            let next = () => {};

            res.status.returns(res);

            await DeviceController.createDevice(req, res, next);

            expect(res.status.calledOnceWith(200)).to.be.true;
            expect(res.json.calledOnceWith(device._id)).to.be.true;
        });
    });

    describe("updateDeviceById", () => {
        let deviceServiceGetStub;
        let deviceServiceUpdateStub;

        beforeEach(() => {
            deviceServiceGetStub = sinon.stub(DeviceService, "get");
            deviceServiceUpdateStub = sinon.stub(DeviceService, "update");
        });

        afterEach(() => {
            deviceServiceGetStub.restore();
            deviceServiceUpdateStub.restore();
        });

        it("should fail on error fetching the device", async() => {
            let ex = new DeviceException();
            deviceServiceGetStub.throws(ex);

            let req = TestUtils.buildReq();
            let res = TestUtils.buildRes();
            let nextStub = sinon.spy();

            await DeviceController.updateDeviceById(req, res, nextStub);

            expect(nextStub.calledOnceWith(ex)).to.be.true;
        });

        it("should fail on device not found", async() => {
            deviceServiceGetStub.returns(null);

            let req = TestUtils.buildReq();
            let res = TestUtils.buildRes();
            let nextStub = sinon.spy();

            await DeviceController.updateDeviceById(req, res, nextStub);

            expect(nextStub.calledOnce).to.be.true;

            let nextArgs = nextStub.getCall(0).args[0];

            // TODO: check the type of the object.
            expect(nextArgs.name).to.be.eq('DeviceNotFoundException');
        });

        it("should fail on error storing the device", async() => {
            let ex = new DeviceException();
            let device = {
                _id: "abcdefghilmnopqrstuvz",
                name: "test"
            };

            deviceServiceGetStub.returns(Promise.resolve(device));
            deviceServiceUpdateStub.throws(ex);

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

            deviceServiceGetStub.returns(Promise.resolve(device));
            deviceServiceUpdateStub.returns(Promise.resolve(device));

            let req = TestUtils.buildReq();
            let res = TestUtils.buildRes();
            let next = () => {};

            res.status.returns(res);

            await DeviceController.updateDeviceById(req, res, next);

            expect(res.status.calledOnceWith(200)).to.be.true;
            expect(res.json.calledOnceWith(device)).to.be.true;
        });
    });
});