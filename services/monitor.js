/**
 * This guy has a `start()` method that begins analyzing a number of URLs
 * and keeping track of the time required to retrieve the information.
 */

var http   = require('http');
var url    = require('url');
var redis  = require("redis");
var rconn  = require('./connRedis');

/**
 * When we first connect to the database, let's clear out the QOS history.
 */
var client = rconn.connect( function(c) {
    for ( var u = 0; u < 10; u++ ) {
        // c.ltrim( rconn.getid(u), 0, 0, redis.print);
    }
});

/**
 * Sets up all of the options as module-level variables, and kicks off a
 * timer for each URL we want to manage.
 * 
 * Options:
 * 
 *   - `seconds` - Check each URL the given number of seconds
 *   - `timeout` - The number of seconds to wait to claim the site is dead
 *   
 * @param opts Key/values for each option to set. We use good defaults.
 */
function start(options) {
    
    var checkEvery = ( options.seconds ? options.seconds * 1000 : 20000 );
    var timeout    = ( options.timeout ? options.timeout * 1000 : 10000 );
    
    if (! options.urls) {
        options.urls = [];
    }
    
    // Any environment variable that begins with URL is used as a url
    // to analyze. This approach makes it easy to configure an existing 
    // server running in a PaaS like CloudFoundry.
    
    for ( var k in process.env ) {
        if ( k.indexOf("URL") == 0 ) {
            options.urls.push( process.env[k] );
        }
    }
    
    global.options = options;
    console.log("Working", options);
    
    // Begin a timer for each website.
    
    for ( var u in options.urls ) {
        // console.log("URL:", urls[u]);
        setInterval( timerCallback(u, options.urls[u], timeout), checkEvery);
    }
    
}
exports.start = start;

function timerCallback(id, u, timeout) {
    return function() {
        checkSite(id, u, timeout);
    };
}

function checkSite( id, u, timeout ) {
    // console.log("Checking", id, u);
    var results = {
            created: new Date().getTime()
    };
    
    http.get(url.parse(u), function( res ) {
        results.status   = res.statusCode;
        results.results  = "ok";
        
        store(id, results);
        console.log(u, "response:", res.statusCode);
        
    }).on('error', function( e ) {
        results.status   = e.code;
        results.results  = e.message;

        store(id, results);
        console.log(u, "error:", e.message);
    });
}

function store(id, results) {
    results.finished = new Date().getTime();
    results.delta = results.finished - results.created;
    
    // console.log("Storing", results);
    client.rpush( rconn.getid(id), JSON.stringify(results) );
}