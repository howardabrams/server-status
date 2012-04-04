var redis  = require("redis");
var rconn  = require('../services/connRedis');

var client = rconn.connect();

/**
 * Redirects to the index.html page to run the tests.
 *
 * This function simply returns a `302` HTTP status and redirects
 * to the `test-api/index.html` file to quickly start up the tests.
 */

module.exports.index = function( request, response ) {
    response.statusCode = 302;
    response.setHeader("Location", "/index.html");
    response.end('<p>302. Redirecting to index.html</p>');
};

exports.sites = function( request, response ) {
    var results = [];
    for ( var u in global.options.urls ) {
        results[u] = {
                id: u,
                url: global.options.urls[u],
                refresh: global.options.seconds
        };
    }
    response.setHeader("Content-Type", "application/json");
    response.end( JSON.stringify(results) );
};

exports.details = function( request, response ) {
    var id  = request.params.id;
    var pos = request.params.pos ? - request.params.pos : -1;
    // console.log("DETAILS", id);
    
    client.lindex( rconn.getid(id), pos, function(err, data) {
        var results      = JSON.parse(data);
        
        results.id       = id;
        results.url      = global.options.urls[id];
        results.created  = new Date(results.created);
        results.finished = new Date(results.finished);
        
        response.setHeader('Content-Type', 'application/json');
        response.end( JSON.stringify(results) + '\n' );
    });
};

exports.history = function( request, response ) {
    var id    = request.params.id;
    var range = request.params.range ? - request.params.range : -100;
    // console.log("HISTORY", id);

    var results = {
       id:     id,
       url:    global.options.urls[id],
       deltas: [],
       errors: 0
    };

    client.lindex( rconn.getid(id), -1, function(err, data) {
        var latest = JSON.parse(data);
        latest.created  = new Date(latest.created);
        latest.finished = new Date(latest.finished);
        results.latest   = latest;
        
        client.lrange(rconn.getid(id), range, -1, function(err, data) {
            for ( var d in data ) {
                var item = JSON.parse(data[d]);
                results.deltas.push(item.delta);
                if (typeof item.status != "number") {
                    results.errors++;
                }
            }
            response.end( JSON.stringify(results) );
        });
    });

    
};
