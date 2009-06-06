Tweetlol.Fetcher = Tweetlol.Class({
    initialize: function(server, url) {
        this.server = server;
        this.url = url;
        this.basicAuth = null;
        this.main = Components.classes["@mozilla.org/thread-manager;1"].getService().mainThread;
    },
    
    run: function() {
        try {
            var req = new XMLHttpRequest();
            req.mozBackgroundRequest = true;
            if (this.basicAuth)
                req.open("GET", url, false, basicAuth.username, basicAuth.password);
            else
                req.open("GET", url, false);
            req.send("");
            this.processResult(req);
        } catch(err) {
            Components.utils.reportError(err);
        }
    },

    QueryInterface: function(iid) {
        if (iid.equals(Components.interfaces.nsIRunnable) ||
            iid.equals(Components.interfaces.nsISupports)) {
                return this;
        }
        throw Components.results.NS_ERROR_NO_INTERFACE;
    },

    CLASS_NAME: "Tweetlol.Fetcher"
});

Tweetlol.ServiceBackend = Tweetlol.Class({
    CLASS_NAME: "Tweetlol.ServiceBackend"
});

Tweetlol.Server = Tweetlol.Class({
    initialize: function() {
        Tweetlol.log("server init");
        this.thread = Components.classes["@mozilla.org/thread-manager;1"].getService().newThread(0);
    },
    
    CLASS_NAME: "Tweetlol.Server"
});

Tweetlol.server = new Tweetlol.Server();
