// dependencies
'use strict';
const express = require('express');
const http = require('https');
const bodyParser=require('body-parser');
const jsforce = require('jsforce'); 
const server = express();
var strName='';
var conn = new jsforce.Connection({ 
    loginUrl: 'https://login.salesforce.com', //'https://login.salesforce.com', 
    version: '43.0' 
}); 
const {
    dialogflow,
    SimpleResponse,
    Image,
    Suggestions,
    BasicCard
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


var accountCreation=function (acctName){
	return new Promise((resolve,reject)=>{
		console.log('Account Name is -->',acctName);
		conn.login(process.env.username, process.env.pass, function(err, res){
			if(err){reject(err);}
			else{
				
			
			   
		conn.sobject("Account").create({ Name : acctName }, function(error, ret) {
		  if (error || !ret.success) { 
			  
			  reject(error); 
		  }
		  else
		   {
			 
			 resolve(ret);
		  }
	 
		  });
			
			}
		});
});
}

var accountRetrieval=function (days){
	return new Promise((resolve,reject)=>{
		console.log('days -->',days);
		conn.login(process.env.username, process.env.pass, function(err, res){
			if(err){reject(err);}
			else{
				
			
			   
                conn.query('select Id,Name,createddate from Account where createddate = LAST_N_DAYS:'+days+' LIMIT 2', function(err, result){
                    if (err) {
                        reject(err);
                    }
                    else{
                        resolve(result);
                    }
                });
			
            }
		});
});
}

var convertlead=function (leadname,leadidfetched){
	return new Promise((resolve,reject)=>{
		console.log('leadname -->',leadname);
		console.log('leadidfetched -->',leadidfetched);

conn.login(process.env.username, process.env.pass, function(err, res){
			if(err){reject(err);}
			else{
				console.log('conn.accessToken:'+conn.accessToken);
				var header='Bearer '+conn.accessToken;
		      var options = { Authorization: header};
			//var url=conn.instanceUrl+"/services/apexrest/Lead/00Q6F000012xmpT";
				console.log('conn.instanceUrl:'+conn.instanceUrl);
				//console.log('url:'+url);
				conn.apex.get("/Lead/"+leadidfetched,options,function(err, res) {
  if (err) {
	  reject(err);
	  //return console.error(err); 
	  }
	  else
	  {
  console.log("response: ", res);
  resolve(res);
	  }
  // the response object structure depends on the definition of apex class
});
		
            }
		});
});
}

function leadid(leadname)
{
	conn.login(process.env.username, process.env.pass, function(err, res){
			if(err){reject(err);}
			else{
			  console.log('Query is:'+'select Id,Name from Lead where Name =\''+leadname+'\'');
		          conn.query('select Id,Name from Lead where Name =\''+leadname+'\'', function(err, result){
                    if (err) {
                        console.log('err in fetching lead id:'+err);
                    }
                    else{
			    console.log("result:",result);
			    console.log("result record:",result.records[0].attributes);
			  return result.records[0].Id;
                        
                    }
                });
            }
		});
	
	
}

app.intent('connect_salesforce',(conv,params)=>{
    
   	signIN.then((resp)=>{
	console.log(resp);
		//const explicit = conv.arguments.get('objName'); // also retrievable with explicit arguments.get
		//console.log('the val is :'+explicit);

		conv.ask(new SimpleResponse({speech:"We are able to connect to your account",text:"We are able to connect your account"}));
				
		/*conv.ask(new BasicCard({
  text: 'testing',
  subtitle: 'This is a subtitle',
  title: 'Title: this is a title',
  display: 'CROPPED'
}));*/
		

	conv.ask(new Suggestions('Create New Account'));
		
	},(error) => {
  console.log('Promise rejected.');
  console.log(error.message);
 conv.ask(new SimpleResponse({speech:"Error while connecting to salesforce",text:"Error while connecting to salesforce"}));


});
});

app.intent('AccountName',(conv,params)=>{
	return accountCreation(params.AccountName).then((resp)=>{
		conv.ask(new SimpleResponse({speech:"We are able to create your account named:"+params.AccountName,text:"We are able to create your account named:"+params.AccountName}));
		conv.ask(new Suggestions('Fetch Recent Accounts'));
	}).catch((err)=>{
	conv.ask(new SimpleResponse({speech:"Error while creating salesforce account",text:"Error while creating salesforce account"}));});	
});


app.intent('getAccInfo',(conv,params)=>{
    console.log('days passed from google'+params.days);
	return accountRetrieval(params.days).then((resp)=>{
        console.log('response',resp);
        for (var i = 0; i < resp.records.length; i++) {
            console.log("record name: : " + resp.records[i].Name);
            console.log("record id: : " + resp.records[i].Id);
            strName += resp.records[i].Name + ',';
           
       }
		strName=strName.slice(0,-1);
		conv.ask(new SimpleResponse({speech:"We are able to get the account information: "+strName,text:"We are able to get the account information: "+strName}));
		conv.ask(new Suggestions('Convert Lead'));
		
	}).catch((err)=>{
        console.log('error',err);
	    conv.ask(new SimpleResponse({speech:"Error while fetching info",text:"Error while fetching info"}));});	
});


app.intent('ConvertLead',(conv,params)=>{
    console.log('lead name:'+params.leadname);
	 var leadidfetched=leadid(params.leadname);
	console.log('lead id here:'+leadidfetched);
	return convertlead(params.leadname,leadidfetched).then((resp)=>{
        console.log('response',resp);
        /*for (var i = 0; i < resp.records.length; i++) {
            console.log("record name: : " + resp.records[i].Name);
            console.log("record id: : " + resp.records[i].Id);
            strName += resp.records[i].Name + ',';
           
       }
		strName=strName.slice(0,-1);*/
		conv.ask(new SimpleResponse({speech:"Lead Converted Successfully",text:"Lead Converted Successfully"}));
		
	}).catch((err)=>{
        console.log('error msg:',err);
	    conv.ask(new SimpleResponse({speech:"Error while converting Lead",text:"Error while converting Lead"}));});	
});

var port = process.env.PORT || 3000;
//var arr = new Array();
 

server.get('/',(req,res)=>{res.send('Hello World!');});
server.post('/fulfillment',app);






server.listen(port, function () {
    console.log("Server is up and running...");
});
