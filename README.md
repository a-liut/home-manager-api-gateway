# home-manager

This is a VERY simple data collector service for IoT devices. It provides a REST interface to register new IoT devices by their IP.
Registered IoT devices can then upload their own readings and data to the service using the provided ID.

## Running

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
