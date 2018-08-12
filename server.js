var configNode = require('./config.json');

var express = require('express');
    bodyParser = require('body-parser'); 
    app = express();
    port = process.env.PORT || configNode.port;

var publisherClient = require('./rmq-publisher');

app.use(bodyParser.text({ type: 'text/xml' , limit: '50mb'}))

//http://localhost:3000/publish?guid=32323-32323-4332-222&exchange=directory&routing_key=site
app.post('/publish', function(req, res) {
    var guid = req.param('guid');
    var exchange = req.param('exchange');
    var routing_key = req.param('routing_key');
    
    publisherClient.publish("", routing_key, new Buffer(req.body));
    console.log("routing_key " + routing_key);
    console.log("Sent " + guid);
    res.send(guid);
});
    
app.listen(port);
publisherClient.startPub();
    
console.log('Server started! At http://localhost:' + port);