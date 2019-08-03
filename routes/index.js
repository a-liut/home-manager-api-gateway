var express = require('express');
var router = express.Router();
var Device = require('../models/Device');

/* GET index page. */
router.get('/', function(req, res, next) {
    Device.find({}, (err, devices) => {
        res.render('index', { title: 'Home-Manager', devices: devices });
    });
});

module.exports = router;