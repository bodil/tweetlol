Tweetlol.Service = Tweetlol.Class({
    toString: function() {
        return eval(this.CLASS_NAME).id;
    },
    
    CLASS_NAME: "Tweetlol.Service"
});

Tweetlol.Service.Twitter = Tweetlol.Class(Tweetlol.Service, {
    initialize: function(options) {
        Tweetlol.extend(this, options);
        if (options.password)
            Tweetlol.setLogin(this.toString(), this.password);
        else
            this.password = Tweetlol.getLogin(this.toString());
    },
    
    toJSON: function() {
        return { "username": this.username };
    },
    
    toString: function() {
        return this.username + "@" + eval(this.CLASS_NAME).id;
    },
    
    CLASS_NAME: "Tweetlol.Service.Twitter"
});

Tweetlol.extend(Tweetlol.Service.Twitter, {
    id: "twitter",
    title: "Twitter",
    editor: "chrome://tweetlol/content/services/twitter.xul",
    
    verifyAccount: function(username, password, callback) {
        if (!username || !password) {
            callback(false, "Credentials incomplete.");
            return;
        }
        Tweetlol.httpRequest("GET", function(req) {
            if (req.status == 200) {
                callback(true);
            } else {
                var response = nativeJSON.decode(req.responseText);
                callback(false, response.error);
            }
        }, "https://twitter.com/account/verify_credentials.json", {
            username: username,
            password: password,
            host: "http://twitter.com",
            realm: "Twitter API"
        }, true);
    }
});

Tweetlol.Service.Identica = Tweetlol.Class(Tweetlol.Service.Twitter, {
    CLASS_NAME: "Tweetlol.Service.Identica"
});

Tweetlol.extend(Tweetlol.Service.Identica, {
    id: "identica",
    title: "Identi.ca",
    editor: "chrome://tweetlol/content/services/twitter.xul",
    
    verifyAccount: function(username, password, callback) {
        if (!username || !password) {
            callback(false, "Credentials incomplete.");
            return;
        }
        Tweetlol.httpRequest("GET", function(req) {
            if (req.status == 200) {
                callback(true);
            } else {
                var response = nativeJSON.decode(req.responseText);
                callback(false, response.error);
            }
        }, "https://identi.ca/api/account/verify_credentials.json", {
            username: username,
            password: password
        }, true);
    }
});

Tweetlol.Services = [
    Tweetlol.Service.Twitter,
    Tweetlol.Service.Identica
];

