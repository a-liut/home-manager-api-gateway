const DeviceDataService = require("../../service/DeviceDataService");
const DeviceService = require("../../service/DeviceService");

const DeviceNotFoundException = require("../../exception/DeviceNotFoundException");

async function addDeviceData(messageData) {
    let device = await DeviceService.get(messageData.device_id);

    if (!device) {
        throw new DeviceNotFoundException("Device not found");
    }

    let data = {
        name: messageData.name,
        value: messageData.value,
        unit: messageData.unit,
        device: device
    };

    await DeviceDataService.add(data);
}

/**
 * Registers callbacks to listen for events from 
 * @param {AmqpConsumer} consumer The AmqpConsumer object
 */
async function bind(consumer) {
    await consumer.consume("device_data", "data.produced", async(message) => {
        var data = null;
        try {
            let content = message.content.toString();
            data = JSON.parse(content);
        } catch (ex) {
            console.error("Cannot parse message:", message);
            return;
        }

        try {
            await addDeviceData(data);
        } catch (ex) {
            console.error("Error: ", ex);
        }
    });
}

module.exports.bind = bind;