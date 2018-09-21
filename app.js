// dependencies
'use strict';
const express = require('express');
const http = require('https');
const jsforce = require('jsforce'); 
var port = process.env.PORT || 8080;
var conn = new jsforce.Connection({ 
    loginUrl: 'https://login.salesforce.com', //'https://login.salesforce.com', 
    version: '43.0' 
}); 
 
// create serve and configure it.
const server = express();

server.post('/',function (request,response)  {
	conn.login(process.env.username, process.env.pass, function(err, res) { 
    if (err) { 
        return console.error(err); 
    }
     else
	 {
	 	 response.setHeader('Content-Type', 'application/json');
                    response.send(JSON.stringify({
                        "fulfillmentText" : "Connected to Salesforce",
                        "source" : "EchoService"
                    })); 
	 }
                
     });
});
    

server.get('/',function (req,res){
    res.send('Hello World');
});
server.listen(port, function () {
    console.log("Server is up and running...");
});