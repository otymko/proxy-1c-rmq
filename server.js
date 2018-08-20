var configNode = require('./config.json');

var express = require('express');
    bodyParser = require('body-parser'); 
    app = express();
    port = process.env.PORT || configNode.port;

var publisherClient = require('./rmq-publisher');
var subcriberClient = require('./rmq-subscribe');

app.use(bodyParser.text({ type: 'text/xml' , limit: '50mb'}))

app.post('/publish', function(req, res) {
    var guid = req.param('guid');
    var exchange = req.param('exchange');
    var routing_key = req.param('routing_key');
    
    publisherClient.publish("", routing_key, new Buffer(req.body));
    now = new Date();
    console.log("" + now + " / Sent to " + routing_key + " message: " + guid);
    res.send(guid);
});
    
app.listen(port);

publisherClient.startPub();
subcriberClient.startSub();
    
console.log('Server started! At http://localhost:' + port);