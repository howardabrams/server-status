exports.values = {
 
    /**
     * The host that this server attaches to. Normally, localhost,
     * however, if this application is hosted in a Cloud Foundry DEA
     * it picks up the value from the environment variable: VCAP_APP_HOST.
     */
    host : (process.env.VCAP_APP_HOST || 'localhost'),

    /**
     * The port that this server listens. Defaults to 3000,
     * however, if this application is hosted in a Cloud Foundry DEA
     * it picks up the value from the environment variable: VCAP_APP_PORT.
     */
    port: Number(process.env.VMC_APP_PORT || 3000),

    /**
     * Check each URL the given number of seconds
     */
    seconds: 20,
    
    /**
     * The number of seconds to wait to claim the site is dead
     */
    timeout: 10,
    
    /**
     * Limits the history stored for each request. Defaults to no limit.
     */
    // limit: 1000,
    
    /**
     * An array of URLs to monitor.
     */
    urls: [
           "http://build.cloud-eco.com:8080/",
           "http://git.cloud-eco.us/gitweb/",
           "http://cp.jira.cloud-eco.com:7711/secure/Dashboard.jspa"
    ]
};
