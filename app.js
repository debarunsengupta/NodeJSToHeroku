// dependencies
'use strict';
const express = require('express');
const http = require('https');
const bodyParser=require('body-parser');
const jsforce = require('jsforce'); 
const server = express();

var conn = new jsforce.Connection({ 
    loginUrl: 'https://login.salesforce.com', //'https://login.salesforce.com', 
    version: '43.0' 
}); 
const {
    dialogflow,
    SimpleResponse,
    Image,
  } = require('actions-on-google');


server.use(bodyParser.json());
// create serve and configure it.


var app=dialogflow();
var signIN=new Promise((resolve,reject)=>{
	conn.login(process.env.username, process.env.pass, function(err, res){
		if(err){reject(err);}
		else{
			resolve(res);}
	});
});

app.intent('connect_salesforce',(conv,params)=>{
    
   	signIN.then((resp)=>{
	console.log(resp);
		const explicit = conv.arguments.get('objName'); // also retrievable with explicit arguments.get
		console.log('the val is :'+explicit);

		conv.ask(new SimpleResponse({speech:"We are able to connect to your account",text:"We are able to connect your account"}));
	},(error) => {
  console.log('Promise rejected.');
  console.log(error.message);
});
});

var port = process.env.PORT || 3000;
//var arr = new Array();
var conn = new jsforce.Connection({ 
  loginUrl: 'https://login.salesforce.com', //'https://login.salesforce.com', 
  version: '43.0' 
}); 

server.get('/',(req,res)=>{res.send('Hello World!');});
server.post('/fulfillment',app);






server.listen(port, function () {
    console.log("Server is up and running...");
});
