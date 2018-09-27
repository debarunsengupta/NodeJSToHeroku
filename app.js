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

var oppRetrieval=function(oppStage){
	return new Promise((resolve,reject)=>{
		console.log('days -->',days);
		conn.login(process.env.username, process.env.pass, (err, res)=>{
			if(err){reject(err);}
			else{ 
                conn.query('select Id,Name from Opportunity where StageName = \''+oppStage+'\'', function(err, result){
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


var leadid=function (leadname){
	return new Promise((resolve,reject)=>{
		console.log('leadname -->',leadname);
		conn.login(process.env.username, process.env.pass, function(err, res){
			if(err){
				console.log('where2');
				reject(err);}
			else{
				
			console.log('where3');
			   
                conn.query('select Id,Name from Lead where Name =\''+leadname+'\'', function(err, result){
                    if (err) {
						console.log('where1');
                        reject(err);
                    }
                    else{
						console.log('where');
						console.log('result.records',result.records.length);
						if(result.records!=null && result.records!='')
						{
							console.log('inside records');
                        //resolve(result.records[0].Id);
						resolve(result);
						}
						else
						{
							console.log('inside records 1');
							resolve(result);
						}
                    }
                });
			
            }
		});
});
}

var leaddetails=function (leadname){
	return new Promise((resolve,reject)=>{
		console.log('leadname -->',leadname);
		conn.login(process.env.username, process.env.pass, function(err, res){
			if(err){reject(err);}
			else{
			  console.log('Query is:'+'select Id,ConvertedAccount.Name, ConvertedContact.Name, ConvertedOpportunity.Name from Lead where Name =\''+leadname+'\'');
		          conn.query('select Id,ConvertedAccount.Name, ConvertedContact.Name, ConvertedOpportunity.Name from Lead where Name =\''+leadname+'\'', function(err, result){
                    if (err) {
                        console.log('err in fetching lead id:'+err);
						 reject(err);
                    }
                    else{
			    console.log("result:",result);
			    //console.log("result record:",typeof(result.records[0]));
			  //return result.records[0].Id;
			   resolve(result);
			    //return callback(result);
                        
                    }
                });
            }
		});
  
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

app.intent('getOppprty',(conv,{oppStage})=>{
    console.log('stage passed from google'+oppStage);
	return oppRetrieval(oppStage).then((resp)=>{
        console.log('response',resp);
        for (let i = 0; i < resp.records.length; i++) {
            console.log("record name: : " + resp.records[i].Name);
            console.log("record id: : " + resp.records[i].Id);
            strName += resp.records[i].Name + ',';
           
       }
		strName=strName.slice(0,-1);
		conv.ask(new SimpleResponse({speech:"We are able to get the Opportunity information: "+strName,text:"We are able to get the Opportunity information: "+strName}));
		
	}).catch((err)=>{
        console.log('error',err);
	    conv.ask(new SimpleResponse({speech:"Error while fetching Opportunity info",text:"Error while fetching Opportunity info"}));});	
});


app.intent('ConvertLead',(conv,params)=>{
    console.log('lead name:'+params.leadname);
	
	return leadid(params.leadname).then((resp)=>{
        console.log('response',resp); //lead id
		
		if(resp.records.length >0)
		{
       return convertlead(params.leadname,resp.records[0].Id).then((resp)=>{
        console.log('response fetched while calling apex service: ',resp);
		 console.log('Inside called 3');
      
		  return leaddetails(params.leadname).then((resp)=>{
			  var str='The Lead converted account name is ';
          console.log('Inside called 6');
		 console.log('response.records[0].ConvertedAccount.Name',resp.records[0].ConvertedAccount["Name"]);
			str+=resp.records[0].ConvertedAccount["Name"]+',';
			str+='The Lead converted contact name is ' +resp.records[0].ConvertedContact["Name"]+',';
			str+='The Lead converted opportunity name is '+resp.records[0].ConvertedOpportunity["Name"]+'.';
		conv.ask(new SimpleResponse({speech:str,text:str}));
	}).catch((err)=>{
        console.log('error',err);
	    conv.ask(new SimpleResponse({speech:"Error while fetching info",text:"Error while fetching info"}));
		});	
	
	}).catch((err)=>{
        console.log('error msg:',err);
		reqleadid='error';
	    conv.ask(new SimpleResponse({speech:"Error while converting Lead",text:"Error while converting Lead"}));
		});
		}
		else
		{
			conv.ask(new SimpleResponse({speech:"The lead name is not present in salesforce",text:"The lead name is not present in salesforce"}));
		}
	}).catch((err)=>{
        console.log('error',err);
	    conv.ask(new SimpleResponse({speech:"Error while fetching lead id",text:"Error while fetching lead id"}));});	
});

var port = process.env.PORT || 3000;
//var arr = new Array();
 

server.get('/',(req,res)=>{res.send('Hello World!');});
server.post('/fulfillment',app);






server.listen(port, function () {
    console.log("Server is up and running...");
});
