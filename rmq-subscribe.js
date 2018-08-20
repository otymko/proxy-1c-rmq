var amqp = require('amqplib/callback_api');
var request = require('request');

var configNode = require('./config.json');
var auth1c = Buffer.from(configNode.point1c.user + ":" + configNode.point1c.password).toString('base64');

var setting = {
    protocol: 'amqp',
    hostname: configNode.rabbitmq.hostname,
    port: configNode.rabbitmq.port,
    username: configNode.rabbitmq.username,
    password: configNode.rabbitmq.password,
    vhost: configNode.rabbitmq.vhost
};

console.dir(setting);

exports.startSub = start;

var amqp = require('amqplib/callback_api');

function start()
{
    amqp.connect(setting, function (err, conn) {
        conn.createChannel(function (err, ch) {
            //var q = configNode.point1c.queue;
            var q = 'v2hsorder';
            ch.assertQueue(q, { durable: true });
            console.log("[AMQP] connected for receive");
            console.log(q);
            ch.consume(q, pushMessage, { noAck: true });
        });
    });
}

function pushMessage(msg) {

    console.log(configNode.point1c.host);
    myXMLText = msg.content.toString();
    request({
        url: configNode.point1c.host,
        method: "POST",
        headers: {
            "content-type": "text/xml",
            "Authorization": "Basic " + auth1c
        },
        body: myXMLText
    }, function (error, response, body){
        console.dir('load message..');
        console.log(response.statusCode);
    });

}
