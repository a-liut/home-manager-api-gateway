# home-manager-devices

*home-manager-devices* is a very simple microservice that manages IoT devices and their data. It provides a REST interface to register new IoT devices by their IP.
Registered IoT devices can then upload their own readings and data to the service using the provided ID.

## Endpoints

| Method | URL                           |
|--------|-------------------------------|
| GET    | /devices                      |
| POST   | /devices                      |
| GET    | /devices/{id}                 |
| PUT    | /devices/{id}                 |
| GET    | /devices/{id}/data            |
| GET    | /devices/{id}/data/{dataName} |
| POST   | /devices/{id}/data/{dataName} |

Errors are reported with the following structure:

```json
{
    "message": "Device not found",
    "error": "" // Only in development environment
}
```

### Device

#### Get all devices

Returns the list of all registered devices.

Method: ```GET```

URL: ```/devices```

##### Success response

Code: ```200```

```json
[
    {
        "id": "5dc947ccdfb5d10013713a8f",
        "name": "New Device",
        "online": false,
        "address": ":172.21.0.1",
        "heartbeat_url": "http://172.21.0.1/heartbeat",
        "data": [],
        "created_at": "2019-11-11T11:36:44.962Z",
        "updated_at": "2019-11-11T11:36:44.962Z"
    }
]
```

#### Register a new device

Register a new device to the system. Devices are identified by their IP addess. Thus, if a device tries to register twice, the same ID will be provided as a response.

Method: ```POST```

URL: ```/devices```

Body constraints:

```json
{
    "name": "string" // Optional
}
```

##### Success response

Returns the new ID of the registered device.

Code: ```200```

Example body:

```json
{
    "name": "Custom name"
}
```

```json
"5dc947ccdfb5d10013713a8f"
```

##### Errors

- Code: ```400```: Device already registred

#### Get a device by ID

Returns the device identified by ID.

Method: ```GET```

URL: ```/devices/{id}```

##### Success response

Code: ```200```

Example: ```/devices/5dc947ccdfb5d10013713a8f```

```json
{
    "id": "5dc947ccdfb5d10013713a8f",
    "name": "New Device",
    "online": false,
    "address": "::ffff:172.21.0.1",
    "heartbeat_url": "http://172.21.0.1/heartbeat",
    "data": [],
    "created_at": "2019-11-11T11:36:44.962Z",
    "updated_at": "2019-11-11T11:36:44.962Z"
}
```

##### Errors

- Code: ```400```: Invalid id

- Code: ```404```: Device not found

#### Update a device

Update the description of a registered device.

Method: ```PUT```

URL: ```/devices/{id}```

Body constraints:

```json
{
    "name": "string", // Optional
    "heartbeat_url": "string" // Optional
}
```

##### Success response

Returns the updated resource.

Code: ```200```

Example: ```/devices/5dc947ccdfb5d10013713a8f```

Example body:

```json
{
    "name": "Custom name"
}
```

```json
{
    "id": "5dc947ccdfb5d10013713a8f",
    "name": "Custom name",
    "online": false,
    "address": "::ffff:172.21.0.1",
    "heartbeat_url": "http://172.21.0.1/heartbeat",
    "data": [],
    "created_at": "2019-11-11T11:36:44.962Z",
    "updated_at": "2019-11-11T11:36:44.962Z"
}
```

##### Errors

- Code: ```400```: Device already registred

- Code: ```404```: Device not found

#### Get all device data

Returns all data uploaded from a device.

Method: ```GET```

URL: ```/devices/{id}/data```

Query parameters:

- limit (int): limits the number of returned elements to n.

##### Success response

Returns the list of all data uploaded by the device.

Code: ```200```

Example: ```/devices/5dc947ccdfb5d10013713a8f/data```

```json
[
    {
        "_id": "5dc97d515162b600185848b9",
        "name": "temperature",
        "value": "42",
        "unit": "",
        "created_at": "2019-11-11T15:25:05.089Z",
        "updated_at": "2019-11-11T15:25:05.089Z"
    },
    {
        "_id": "5dc97d435162b600185848b8",
        "name": "heat_index",
        "value": "32",
        "unit": "",
        "created_at": "2019-11-11T15:24:51.249Z",
        "updated_at": "2019-11-11T15:24:51.249Z"
    }
]
```

##### Errors

- Code: ```400```: Invalid device id

- Code: ```404```: Device not found

#### Get all instances of a specific data kind

Returns all items updated by a device with a certain name.

Method: ```GET```

URL: ```/devices/{id}/data/{dataName}```

Query parameters:

- limit (int): limits the number of returned elements to n.

Body constraints:

```json
{
    "value": "string",
    "unit": "string" // Optional
}
```

##### Success response

Returns the list of requested data items.

Code: ```200```

Example: ```/devices/5dc947ccdfb5d10013713a8f/data/temperature```

Example body:

```json
{
    "value": "42",
    "unit": "°C"
}
```

```json
[
    {
        "_id": "5dc97d515162b600185848b9",
        "name": "temperature",
        "value": "42",
        "unit": "",
        "created_at": "2019-11-11T15:25:05.089Z",
        "updated_at": "2019-11-11T15:25:05.089Z"
    }
]
```

##### Errors

- Code: ```400```: Invalid device id

- Code: ```400```: Invalid data

- Code: ```404```: Device not found

#### Add new data to a device

Insert new data for a device.

Method: ```POST```

URL: ```/devices/{id}/data/{dataName}```

Body constraints:

```json
{
    "value": "string",
    "unit": "string" // Optional
}
```

##### Success response

Returns a confirmation of the successful operation.

Code: ```200```

Example: ```/devices/5dc947ccdfb5d10013713a8f/data/temperature```

Example body:

```json
{
    "value": "42",
    "unit": "°C"
}
```

```json
{
    "message": "Data inserted successfully"
}
```

##### Errors

- Code: ```400```: Invalid device id

- Code: ```400```: Invalid data

- Code: ```404```: Device not found

## How to run

The simplest way to run the software is to use Docker with docker-compose.
Just run:

```bash
    docker-compose up
```

If you want to run the program without docker you need MongoDB installed and running.
Then run

```bash
    npm install
    npm start
```

## Credits

The project structure is based on [Anychart template](https://github.com/anychart-integrations/nodejs-express-mongodb-template).
