// dependencies
'use strict';
const express = require('express');
const http = require('https');
const bodyParser=require('body-parser');
const jsforce = require('jsforce'); 
const server = express();
global.name='test';
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

var accountCreation=new Promise((resolve,reject)=>{
	
	conn.login(process.env.username, process.env.pass, function(err, res){
		if(err){reject(err);}
		else{
			//resolve(res);
			
	conn.sobject("Account").create({ Name : name }, function(err, ret) {
      if (err || !ret.success) { return reject(err); }
      else
       {
	  resolve(ret);
      }
 
      });
		
		}
	});
});
app.intent('connect_salesforce',(conv,params)=>{
    
   	signIN.then((resp)=>{
	console.log(resp);
		//const explicit = conv.arguments.get('objName'); // also retrievable with explicit arguments.get
		//console.log('the val is :'+explicit);

		conv.ask(new SimpleResponse({speech:"We are able to connect to your account",text:"We are able to connect your account"}));
	},(error) => {
  console.log('Promise rejected.');
  console.log(error.message);
 conv.ask(new SimpleResponse({speech:"Error while connecting to salesforce",text:"Error while connecting to salesforce"}));

});
});

app.intent('AccountName',(conv,params)=>{
    console.log('Inside');
	  console.log('params-->'+JSON.stringify(params));
	console.log('params fetched-->'+JSON.stringify(params.AccountName));
	 console.log('conv.arguments-->'+JSON.stringify(conv.arguments));
	 name=params.AccountName;
	 console.log('The value fetched is:'+name);
	   	accountCreation.then((resp)=>{
	console.log(resp);
	conv.ask(new SimpleResponse({speech:"Account has been created successfully",text:"Account has been created successfully"}));
	},(error) => {
  console.log('Promise rejected while account creation.');
  console.log(error.message);
conv.ask(new SimpleResponse({speech:"Error Encountered while Account Creation",text:"Error Encountered while Account Creation"}));
//conv.ask(new SimpleResponse({speech:"Error while connecting to salesforce",text:"Error while connecting to salesforce"}));

});

});

var port = process.env.PORT || 3000;
//var arr = new Array();
 

server.get('/',(req,res)=>{res.send('Hello World!');});
server.post('/fulfillment',app);






server.listen(port, function () {
    console.log("Server is up and running...");
});
