const http = require('http');
const port=process.env.PORT || 3000
var expres=require('express');
var app=expres();
const server = http.createServer((req, res) => {
res.statusCode = 200;
res.setHeader('Content-Type', 'text/html');
res.end('<h1>Hello World</h1>');
});
app.get('/',function (req,res){
    //res.send('Swarup Bam');
   res.setHeader('Content-Type', 'application/json');
   
                    res.send(JSON.stringify({
                        "speech" : 'connection achieved',
                        "displayText" : 'connection achieved'
                    }));
});
server.listen(port,() => {
console.log(`Server running at port `+port);
});
<<<<<<< HEAD
=======
server.get('/',function (req,res){
    //res.send('Swarup Bam');
   res.setHeader('Content-Type', 'application/json');
   
                    res.send(JSON.stringify({
                        "speech" : 'connection achieved',
                        "displayText" : 'connection achieved'
                    }));
});
>>>>>>> 33ca7d1ae8356d40e7a3aa0269e55580b56389ca
