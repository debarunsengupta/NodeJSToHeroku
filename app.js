// dependencies
'use strict';
const express = require('express');
const http = require('https');
const bodyParser=require('body-parser');
const jsforce = require('jsforce'); 
const server = express();
var db=require('mysql');
//var dbConfig = { host: 'localhost', user: 'root', database: 'testdb' };
var connection=db.createConnection({ host: 'localhost', user: 'root', database: 'testdb' });


connection.connect();

connection.query('SELECT * from usersfcredentials', function(err, rows, fields) {
  if (!err)
    console.log('The solution is: ', rows);
  else
    console.log('Error while performing Query.');
	console.log('err',err);
});

connection.end();

var strName='';
var opptName = '';
var acctName = '';
var leadName = '';
var conn = new jsforce.Connection({ 
    loginUrl: 'https://login.salesforce.com', //'https://login.salesforce.com', 
    version: '43.0' 
}); 
const {
    dialogflow,
    SignIn,
    SimpleResponse,
    Image,
    Suggestions,
    BasicCard
  } = require('actions-on-google');


server.use(bodyParser.json());
// create serve and configure it.


var app=dialogflow({clientId: '935413124579-u9dogkgvtm558onccdpctsuu4vmoin2d.apps.googleusercontent.com'});
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


var leadCreation = function (leadFName,leadLName,leadCompany){
	return new Promise((resolve,reject)=>{
		console.log('Lead Name passed is -->',leadFName+' '+leadLName);
		//console.log('Lead Company passed is -->',leadCompany);
		conn.login(process.env.username, process.env.pass, function(err, res){
			if(err){reject(err);}
			else{   
				conn.sobject("Lead").create({ FirstName : leadFName , LastName : leadLName,Company : leadCompany}, function(error, ret) {
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
		console.log('oppStage -->',oppStage);
		conn.login(process.env.username, process.env.pass, (err, res)=>{
			if(err){reject(err);}
			else{ 
                conn.query('select Id,Name from Opportunity where StageName = \''+oppStage+'\' LIMIT 2', function(err, result){
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

var specificOppRetrieval=function(OppName){
	return new Promise((resolve,reject)=>{
		console.log('oppName -->',OppName);
		opptName  = OppName;
		conn.login(process.env.username, process.env.pass, (err, res)=>{
			if(err){reject(err);}
			else{ 
                conn.query('select Id,Name,Amount,StageName from Opportunity where Name = \''+OppName+'\'', function(err, result){
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

var specificOppUpdate = function(OppAmt){
	return new Promise((resolve,reject)=>{
		console.log('OppAmt -->',OppAmt);
		
		
		conn.login(process.env.username, process.env.pass, (err, res)=>{
			if(err){reject(err);}
			else{ 
                conn.sobject('Opportunity').find({ 'Name' : opptName }).update({ Amount: OppAmt }, function(err, result) {
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

var oppStageUpdate = function(oppStage){
	return new Promise((resolve,reject)=>{
		console.log('oppStage -->',oppStage);
		
		
		conn.login(process.env.username, process.env.pass, (err, res)=>{
			if(err){reject(err);}
			else{ 
                conn.sobject('Opportunity').find({ 'Name' : opptName }).update({ StageName : oppStage }, function(err, result) {
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

var accUpdate = function(accName,accRating,accType,accIndustry){
	return new Promise((resolve,reject)=>{
		acctName = accName;
		conn.login(process.env.username, process.env.pass, (err, res)=>{
			if(err){reject(err);}
			else{ 
                conn.sobject('Account').find({ 'Name' : accName }).update({ Rating: accRating,Type: accType,Industry: accIndustry }, function(err, result) {
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

var accBillingUpdate = function(accountName,accBillingStrt,accBillingCty,accBillingstate,accBillingZip,accBillingCountry){
	return new Promise((resolve,reject)=>{
		
		conn.login(process.env.username, process.env.pass, (err, res)=>{
			if(err){reject(err);}
			else{ 
                conn.sobject('Account').find({ 'Name' : accountName }).update({ BillingStreet: accBillingStrt,BillingCity: accBillingCty,BillingState: accBillingstate,BillingPostalCode : accBillingZip,BillingCountry : accBillingCountry}, function(err, result) {
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


var leadUpdate = function(leadFirstName,leadLastName,leadComp,leadTitle,leadSource){
	console.log('value feteched here',leadFirstName+' '+leadLastName);
	leadName=leadFirstName+' '+leadLastName;
	return new Promise((resolve,reject)=>{
		
		conn.login(process.env.username, process.env.pass, (err, res)=>{
			if(err){reject(err);}
			else{ 
				//conn.sobject('Opportunity').find({ 'Name' : opptName }).update({ Amount: OppAmt }, function(err, result) {
                conn.sobject('Lead').find({'FirstName' : leadFirstName,'LastName' : leadLastName}).update({ Company: leadComp,Title: leadTitle,LeadSource: leadSource }, function(err, result) {
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

var approvalprocesssubmit=function (actname,actid){
	return new Promise((resolve,reject)=>{
		console.log('actname -->',actname);
		console.log('actid -->',actid);

   conn.login(process.env.username, process.env.pass, function(err, res){
			if(err){reject(err);}
			else{
				console.log('conn.accessToken:'+conn.accessToken);
				var header='Bearer '+conn.accessToken;
		      var options = { Authorization: header};
			//var url=conn.instanceUrl+"/services/apexrest/Lead/00Q6F000012xmpT";
				console.log('conn.instanceUrl:'+conn.instanceUrl);
				//console.log('url:'+url);
				conn.apex.get("/SubmitForApproval/"+actid,options,function(err, res) {
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


var actid=function (actname){
	return new Promise((resolve,reject)=>{
		console.log('actname -->',actname);
		conn.login(process.env.username, process.env.pass, function(err, res){
			if(err){
				console.log('where2');
				reject(err);}
			else{
				
			console.log('where3');
			   
                conn.query('select Id,Name from account where Name =\''+actname+'\'', function(err, result){
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
// Create a Dialogflow intent with the `actions_intent_SIGN_IN` event
/*
app.intent('Get Signin', (conv, params, signin) => {
	console.log('signin:',signin);
	console.log('signin.status:',signin.status);
  if (signin.status === 'OK') {
    const email = conv.user.email;
	  console.log('email fetched:',email);
    conv.ask('I got your email as ${email}. What do you want to do next?')
  } else {
    conv.ask('I wont be able to save your data, but what do you want to next?')
  }
})

app.intent("Start Sign-in", conv => {
  conv.ask(new SignIn("To personalize"));
});*/
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

app.intent('Default Welcome Intent', (conv) => {
	conv.ask(new SimpleResponse({speech:"Hello, this is your friendly salesforce connector.I would like to help you with some basic salesforce functionalities.Here are some suggestions",text:"Hello, this is your friendly salesforce connector.I would like to help you with some basic salesforce functionalities.Here are some suggestions"}));
    conv.ask(new Suggestions('Create new Lead'));
	//conv.ask(new Suggestions('Convert Lead'));
	conv.ask(new Suggestions('Create a new Account'));
	//conv.ask(new Suggestions('Submit for Approval'));
	//conv.ask(new Suggestions('Submit Account for Approval'));
	console.log('conv.user',conv.user);
	//console.log('conv.user.id',conv.user.id);
	console.log('conv.user.profile.payload.email',conv.user.profile.payload.email);
	//console.log('conv.user.profile.payload',conv.user.profile.payload);
	 //conv.ask(new SignIn('To get your account details'))
});


app.intent('AccountName',(conv,params)=>{
	return accountCreation(params.AccountName).then((resp)=>{
		conv.ask(new SimpleResponse({speech:"We are able to create your account named "+params.AccountName,text:"We are able to create your account named "+params.AccountName}));
		//conv.ask(new Suggestions('Update Rating,Type and Industry on the account named ' +params.AccountName+' as Hot,Customer - Direct and Consulting respectively.'));
		//conv.ask(new Suggestions('Fetch Recent Accounts'));
		//conv.ask(new Suggestions('Submit for Approval'));
	}).catch((err)=>{
	conv.ask(new SimpleResponse({speech:"Error while creating salesforce account",text:"Error while creating salesforce account"}));});	
});

app.intent('createLead',(conv,params)=>{
	
	console.log('leadFName',params.leadFName);
	console.log('leadLName',params.leadLName);
	console.log('leadCompany',params.leadCompany);
	
	return leadCreation(params.leadFName,params.leadLName,params.leadCompany).then((resp)=>{
		conv.ask(new SimpleResponse({speech:"We are able to create Lead named "+params.leadFName+' '+params.leadLName,text:"We are able to create Lead named "+params.leadFName+' '+params.leadLName}));
		//conv.ask(new Suggestions('Update Rating,Type and Industry on the account named ' +params.AccountName+' as Hot,Customer - Direct and Consulting respectively.'));
		//conv.ask(new Suggestions('Fetch Recent Accounts'));
		//conv.ask(new Suggestions('Submit for Approval'));
	}).catch((err)=>{
		console.log('the error is',err);
	conv.ask(new SimpleResponse({speech:"Error while creating salesforce lead",text:"Error while creating salesforce lead"}));});	
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

app.intent('exitintent', (conv) => {
  conv.close('GoodBye. Please feel free to drop in again');
});
app.intent('getOppprty',(conv,{oppStage})=>{
    var strnm = '';
    console.log('stage passed from google'+oppStage);
	return oppRetrieval(oppStage).then((resp)=>{
        console.log('response',resp);
        for (let i = 0; i < resp.records.length; i++) {
            console.log("record name: : " + resp.records[i].Name);
            console.log("record id: : " + resp.records[i].Id);
            strnm += resp.records[i].Name + ',';
           
       }
		strnm=strnm.slice(0,-1);
		conv.ask(new SimpleResponse({speech:"We are able to get the Opportunity information: "+strnm,text:"We are able to get the Opportunity information: "+strnm}));
		
	}).catch((err)=>{
        console.log('error',err);
	    conv.ask(new SimpleResponse({speech:"Error while fetching Opportunity info",text:"Error while fetching Opportunity info"}));});	
});

app.intent('getSpecificOpp',(conv,{OppName})=>{
    
	var rsltStageStr = '';
	var rsltAmtStr = '';
	
    console.log('opp name passed from google'+OppName);
	
	return specificOppRetrieval(OppName).then((resp)=>{
        
		console.log('response',resp);
        
		//var rsltStageStr='';
		//var rsltAmtStr='';
       		
		var rsltStageStr = resp.records[0].StageName;
		var rsltAmtStr = resp.records[0].Amount;
		
		
		conv.ask(new SimpleResponse({speech:"Opportunity named " + OppName + " Stage and Amount is " + rsltStageStr + " and " + rsltAmtStr + " respectively",text:"Opportunity named " + OppName + " Stage and Amount is " + rsltStageStr + " and " + rsltAmtStr + " respectively"}));
		conv.ask(new Suggestions('Update Opportunity Amount'));
		
	}).catch((err)=>{
        console.log('error',err);
	conv.ask(new SimpleResponse({speech:"Error while fetching Opportunity info",text:"Error while fetching Opportunity info"}));});	
	
});

app.intent('updateAcc',(conv,{accName,accRating,accType,accIndustry})=>
	{
	//console.log('Param:',params);
	console.log('Param accName:',accName);
	console.log('Param accType:',accType);
	   return accUpdate(accName,accRating,accType,accIndustry).then((resp)=>{
		conv.ask(new SimpleResponse({speech:"Ok.Account information updated",text:"Ok.Account information updated"}));
		conv.ask(new Suggestions('Submit for Approval'));
		
	}).catch((err)=>{
	conv.ask(new SimpleResponse({speech:"Error while updating Account info",text:"Error while updating Account info"}));});	
});

app.intent('updateAccAddr',(conv,{accountName,accBillingStrt,accBillingCty,accBillingstate,accBillingZip,accBillingCountry})=>
	{
	//console.log('Param:',params);
	console.log('Param accName:',accountName);
	console.log('Param accBillingStrt:',accBillingStrt);
	   return accBillingUpdate(accountName,accBillingStrt,accBillingCty,accBillingstate,accBillingZip,accBillingCountry).then((resp)=>{
		conv.ask(new SimpleResponse({speech:"Ok.Account details updated",text:"Ok.Account details updated"}));
		//conv.ask(new Suggestions('Submit for Approval'));
		
	})
	.catch((err)=>{
		console.log('error is',err);
		conv.ask(new SimpleResponse({speech:"Error while updating Account info",text:"Error while updating Account info"}));});	
});
	
app.intent('updateLead',(conv,{leadFirstName,leadLastName,leadComp,leadTitle,leadSource})=>
{
	//console.log('Param:',params);
	//console.log('Param leadName:',leadName);
	console.log('Param leadSource:',leadSource);
	   return leadUpdate(leadFirstName,leadLastName,leadComp,leadTitle,leadSource).then((resp)=>{
		conv.ask(new SimpleResponse({speech:"Ok.Lead information updated",text:"Ok.Lead information updated"}));
		conv.ask(new Suggestions('Convert Lead'));
		
		
	}).catch((err)=>{
		   console.log('the err lead is',err);
	conv.ask(new SimpleResponse({speech:"Error while updating Lead info",text:"Error while updating Lead info"}));});	
});

app.intent('updateOppAmt',(conv,{OppAmt})=>{
    
	var rsltStageStr = '';
	var rsltAmtStr = '';
	
    console.log('opp amt passed from google'+OppAmt);
	
	return specificOppUpdate(OppAmt).then((resp)=>{
        
		console.log('response',resp);
		
		
		conv.ask(new SimpleResponse({speech:"Opportunity amount updated",text:"Opportunity amount updated"}));
		conv.ask(new Suggestions('Update Opportunity Stage.'));
		
	}).catch((err)=>{
        console.log('error',err);
	conv.ask(new SimpleResponse({speech:"Error while updating Opportunity amount",text:"Error while updating Opportunity amount"}));});	
	
});

app.intent('updateOppStage',(conv,{oppStage})=>{
	
    console.log('opp stage passed from google' + oppStage);
	
	return oppStageUpdate(oppStage).then((resp)=>{
        
		console.log('response',resp);
		
		conv.ask(new SimpleResponse({speech:"Ok.Opportunity Stage has been updated",text:"Ok.Opportunity Stage has been updated"}));
		
		
	})
	.catch((err)=>{
        console.log('error',err);
		conv.ask(new SimpleResponse({speech:"Error while updating Opportunity Stage",text:"Error while updating Opportunity Stage"}));
	});	
	
});

app.intent('SubmitForApproval',(conv)=>{
   
   	return actid(acctName).then((resp)=>{
        console.log('response',resp); //lead id
		
		if(resp.records.length >0)
		{
       return approvalprocesssubmit(acctName,resp.records[0].Id).then((resp)=>{
        console.log('response fetched while calling apex service: ',resp);
		 console.log('Inside called 3');
		 conv.ask(new SimpleResponse({speech:"Approval Process Submitted Successfully",text:"Approval Process Submitted Successfully"}));
        }).catch((err)=>{
        console.log('error msg:',err);
		reqleadid='error';
	    /* conv.ask(new SimpleResponse({speech:"Error while Submitting for Approval",text:"Error while Submitting for Approval"})); */
		});
		}
		else
		{
			conv.ask(new SimpleResponse({speech:"The Account name is not present in salesforce",text:"The Account name is not present in salesforce"}));
		}
	}).catch((err)=>{
        console.log('error',err);
	    conv.ask(new SimpleResponse({speech:"Error while fetching account id",text:"Error while fetching account id"}));});
});
app.intent('ConvertLead',(conv)=>{
    //console.log('lead name:'+params.leadname);
	
	return leadid(leadName).then((resp)=>{
        console.log('response',resp); //lead id
		
		if(resp.records.length >0)
		{
       return convertlead(leadName,resp.records[0].Id).then((resp)=>{
        console.log('response fetched while calling apex service: ',resp);
		 console.log('Inside called 3');
      
		  return leaddetails(leadName).then((resp)=>{
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
