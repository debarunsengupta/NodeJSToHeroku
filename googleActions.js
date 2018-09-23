const {
    dialogflow,
    SimpleResponse,
    Image,
  } = require('actions-on-google');


  var app=dialogflow();


  app.intent('connect_salesforce',(conv)=>{
      conv.ask(new SimpleResponse({speech:"We are able to connect to your account",text:"We are able to connect your account"}));
  });

module.exports.app=app;