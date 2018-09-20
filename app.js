// dependencies
'use strict';
const express = require('express');
const http = require('https');

var port = process.env.PORT || 8080;
// create serve and configure it.
const server = express();

server.post('/',function (request,response)  {
  
                    response.setHeader('Content-Type', 'application/json');
                    response.send(JSON.stringify({
                        "textToSpeech" : "output",
                        "displayText" : "output"
                    })); 
                
            });
    

server.get('/',function (req,res){
    res.send('Swarup Bam');
});
server.listen(port, function () {
    console.log("Server is up and running...");
});
