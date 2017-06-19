'use strict';

const express = require('express');
var bodyParser = require('body-parser');
var crypto = require('crypto');

var s3 = require('./s3');

var app = express()
app.use(express.static('client'));
app.use(bodyParser.json());
//app.get('/', function (req, res) {
//    res.send('Hi!')
//})

app.post('/get_credential', function (req, res) {
    var config = req.body;
    res.status(200).json(s3.s3Credentials(config.bucket, config.region, config.filename, config.fileContent));
});

app.listen(8080, function () {
    console.log('app listening on port 8080!')
});
