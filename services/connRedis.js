var redis = require("redis");


var redisPort = 6379;
var redisHost = '127.0.0.1';
var redisPassword = '';

function connect(callback) {
    var client;
    
    if (process.env.VCAP_SERVICES) {      
        var vcapServices = JSON.parse(process.env.VCAP_SERVICES);
        var cfRedis = vcapServices['redis-2.2'][0];  
        redisHost = cfRedis.credentials.hostname;
        redisPort = cfRedis.credentials.port;
        client = redis.createClient(redisPort, redisHost);
        
        redisPassword = cfRedis.credentials.password;
        console.log("Redis database:", redisHost, redisPort, redisPassword);
        client.auth(redisPassword);
    }
    else {
        client = redis.createClient();
    }
    
    client.on("connect", function() {
        if (process.env.VCAP_SERVICES) {
            client.auth(redisPassword, function( err, res ) {
                if (err) {
                    console.warn("Client connection failed", err);
                    response.end("err: " + err);
                }
            });
        }
        
        if (callback) {
            callback(client);
        }
    });
    
    return client;
}
exports.connect = connect;

exports.getid = function(id) {
    return "urlstat-" + id;
};