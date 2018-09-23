// dependencies
'use strict';
const express = require('express');
const http = require('https');
const jsforce = require('jsforce'); 
var app=require('./googleActions');


var port = process.env.PORT || 8080;
//var arr = new Array();
var conn = new jsforce.Connection({ 
    loginUrl: 'https://login.salesforce.com', //'https://login.salesforce.com', 
    version: '43.0' 
}); 
 
// create serve and configure it.
const server = express();
server.post('/fulfillment',app);

server.listen(port, function () {
    console.log("Server is up and running...");
});
