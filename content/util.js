var nativeJSON = Components.classes["@mozilla.org/dom/json;1"]
                    .createInstance(Components.interfaces.nsIJSON);

/**
*
*  Base64 encode / decode
*  http://www.webtoolkit.info/
*
**/
 
var Base64 = {
 
    // private property
    _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
 
    // public method for encoding
    encode : function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
 
        input = Base64._utf8_encode(input);
 
        while (i < input.length) {
 
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
 
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
 
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
 
            output = output +
            this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
            this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
 
        }
 
        return output;
    },
 
    // public method for decoding
    decode : function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
 
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
 
        while (i < input.length) {
 
            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));
 
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
 
            output = output + String.fromCharCode(chr1);
 
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
 
        }
 
        output = Base64._utf8_decode(output);
 
        return output;
 
    },
 
    // private method for UTF-8 encoding
    _utf8_encode : function (string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";
 
        for (var n = 0; n < string.length; n++) {
 
            var c = string.charCodeAt(n);
 
            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
 
        }
 
        return utftext;
    },
 
    // private method for UTF-8 decoding
    _utf8_decode : function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;
 
        while ( i < utftext.length ) {
 
            c = utftext.charCodeAt(i);
 
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i+1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i+1);
                c3 = utftext.charCodeAt(i+2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
 
        }
 
        return string;
    }
 
}

var Tweetlol = {
    prefs: Components.classes["@mozilla.org/preferences-service;1"]
                    .getService(Components.interfaces.nsIPrefService)
                    .getBranch("extensions.tweetlol."),
    
    log: function(msg) {
        if (Tweetlol.prefs.getBoolPref("debug")) {
            if (window.console)
                window.console.log("tweetlol: " + msg);
            else
                Application.console.log("tweetlol: " + msg);
        }
    },
    
    mainWindow: function() {
        return window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                       .getInterface(Components.interfaces.nsIWebNavigation)
                       .QueryInterface(Components.interfaces.nsIDocShellTreeItem)
                       .rootTreeItem
                       .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                       .getInterface(Components.interfaces.nsIDOMWindow); 
    },
    
    nsUrl: function(spec) {
      var ios = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
      return ios.newURI(spec, null, null);
    },
    
    newTab: function(url) {
        var tab = Application.activeWindow.open(Tweetlol.nsUrl(url));
        if (!Tweetlol.prefs.getBoolPref("backgroundTabs"))
            tab.focus();
        return false;
    },
    
    clearAuthenticationCache : function(url) {
        // This bit from http://code.google.com/p/ext-basex/
        try {
            // create an xmlhttp object
            var xmlhttp;
            if (xmlhttp = new XMLHttpRequest()) {
                xmlhttp.mozBackgroundRequest = true;
                // prepare invalid credentials
                xmlhttp.open("GET", url || '/@@', true, "logout", "logout");
                // send the request to the server
                xmlhttp.send("");
                // abort the request
                xmlhttp.abort.defer(100, xmlhttp);
            }
        } catch (e) { // There was an error
        }
    },

    httpRequest: function(method, callback, url, basicAuth, cookieMonster) {
        Tweetlol.clearAuthenticationCache(url);
        Tweetlol.log("http " + method + " " + url);
        var req = new XMLHttpRequest();
        req.mozBackgroundRequest = true;
        req.onreadystatechange = function(event) {
            if (event.target.readyState == 4) callback(event.target);
        };
        if (!basicAuth) req.open(method, url, true);
        else req.open(method, url, true, basicAuth.username, basicAuth.password);
        if (cookieMonster) new Tweetlol.CookieMonster(req);
        req.send("");
    },
    
    getLogin: function(username, host, realm) {
        if (!host) host = "chrome://tweetlol";
        if (!realm) realm = "Tweetlol";
        var myLoginManager = Components.classes["@mozilla.org/login-manager;1"]
                             .getService(Components.interfaces.nsILoginManager);
    
        try {
            var logins = myLoginManager.findLogins({}, host, null, realm);
            for (var i = 0; i < logins.length; i++) {
                if (logins[i].username == username) {
                    return logins[i];
                }
            }
            return null;
        } catch(e) {
            return null;
        }
    },
    
    setLogin: function(username, password, host, realm) {
        if (!host) host = "chrome://tweetlol";
        if (!realm) realm = "Tweetlol";
        var myLoginManager = Components.classes["@mozilla.org/login-manager;1"]
                             .getService(Components.interfaces.nsILoginManager);
        var nsLoginInfo = new Components.Constructor("@mozilla.org/login-manager/loginInfo;1",
                                                     Components.interfaces.nsILoginInfo,
                                                     "init");
    
        var loginInfo = new nsLoginInfo(host, null, realm, username, password, "", "");
        var oldLogin = Tweetlol.getLogin(username);
        if (oldLogin) myLoginManager.modifyLogin(oldLogin, loginInfo);
        else myLoginManager.addLogin(loginInfo);
    },

    /* This bit from OpenLayers, which is:
     * Copyright (c) 2006-2008 MetaCarta, Inc., published under the Clear BSD
     * license.  See http://svn.openlayers.org/trunk/openlayers/license.txt for the
     * full text of the license. */
    Class: function() {
        var Class = function() {
            this.initialize.apply(this, arguments);
        };
        var extended = {};
        var parent, initialize;
        for(var i=0, len=arguments.length; i<len; ++i) {
            if(typeof arguments[i] == "function") {
                // make the class passed as the first argument the superclass
                if(i == 0 && len > 1) {
                    initialize = arguments[i].prototype.initialize;
                    // replace the initialize method with an empty function,
                    // because we do not want to create a real instance here
                    arguments[i].prototype.initialize = function() {};
                    // the line below makes sure that the new class has a
                    // superclass
                    extended = new arguments[i];
                    // restore the original initialize method
                    if(initialize === undefined) {
                        delete arguments[i].prototype.initialize;
                    } else {
                        arguments[i].prototype.initialize = initialize;
                    }
                }
                // get the prototype of the superclass
                parent = arguments[i].prototype;
            } else {
                // in this case we're extending with the prototype
                parent = arguments[i];
            }
            Tweetlol.extend(extended, parent);
        }
        Class.prototype = extended;
        return Class;
    },

    extend: function(destination, source) {
        destination = destination || {};
        if(source) {
            for(var property in source) {
                var value = source[property];
                if(value !== undefined) {
                    destination[property] = value;
                }
            }
        }
        return destination;
    }

};

Tweetlol.Tweet = Tweetlol.Class({
    initialize: function(options) {
        Tweetlol.extend(this, options);
    },
    
    CLASS_NAME: "Tweetlol.Tweet"
});

Tweetlol.HttpRequest = Tweetlol.Class({
    initialize: function(method, url, auth, callback) {
        this.callback = callback;
        Tweetlol.log("http " + method + " " + url);
        this.observerService = Components.classes["@mozilla.org/observer-service;1"].getService(Components.interfaces.nsIObserverService);
        this.observerService.addObserver(this, "http-on-modify-request", false);
        var ioService = Components.classes["@mozilla.org/network/io-service;1"]
                          .getService(Components.interfaces.nsIIOService);
        var uri = ioService.newURI(url, null, null);
        this.channel = ioService.newChannelFromURI(uri);
        this.channel.QueryInterface(Components.interfaces.nsIHttpChannel);
        this.channel.requestMethod = method;
        this.channel.asyncOpen(this, null);
    },
    
    onStartRequest: function(request, context) {
        this.responseText = "";
    },
    
    onDataAvailable: function(request, context, stream, sourceOffset, length) {
        var scriptableInputStream = 
              Components.classes["@mozilla.org/scriptableinputstream;1"]
                .createInstance(Components.interfaces.nsIScriptableInputStream);
        scriptableInputStream.init(stream);
        this.responseText += scriptableInputStream.read(length);
        Tweetlol.log(this.responseText);
    },

    onStopRequest: function (request, context, status) {
        this.observerService.removeObserver(this, "http-on-modify-request");
        this.status = status;
        Tweetlol.log("http " + status);
        this.callback(this);
    },

    // nsIChannelEventSink
    onChannelRedirect: function (aOldChannel, aNewChannel, aFlags) {
        // if redirecting, store the new channel
        this.channel = aNewChannel;
    },

    // nsIInterfaceRequestor
    getInterface: function (aIID) {
        try {
            return this.QueryInterface(aIID);
        } catch (e) {
            throw Components.results.NS_NOINTERFACE;
        }
    },

    // nsIProgressEventSink (not implementing will cause annoying exceptions)
    onProgress : function (aRequest, aContext, aProgress, aProgressMax) { },
    onStatus : function (aRequest, aContext, aStatus, aStatusArg) { },

    // nsIHttpEventSink (not implementing will cause annoying exceptions)
    onRedirect : function (aOldChannel, aNewChannel) { },

    observe: function(subject, topic, data)
    {
        if (topic != "http-on-modify-request" || subject != this.channel)
            return;
        Tweetlol.log("observe " + topic);
        this.channel.setRequestHeader("Cookie", "", false);
        this.channel.setRequestHeader("Authorization", "", false);
    },

    // we are faking an XPCOM interface, so we need to implement QI
    QueryInterface : function(aIID) {
        if (aIID.equals(Components.interfaces.nsISupports) ||
            aIID.equals(Components.interfaces.nsIInterfaceRequestor) ||
            aIID.equals(Components.interfaces.nsIChannelEventSink) || 
            aIID.equals(Components.interfaces.nsIProgressEventSink) ||
            aIID.equals(Components.interfaces.nsIHttpEventSink) ||
            aIID.equals(Components.interfaces.nsIStreamListener) ||
            aIID.equals(Components.interfaces.nsIObserver))
            return this;
    
        throw Components.results.NS_NOINTERFACE;
    },

    CLASS_NAME: "Tweetlol.HttpRequest"
});

/*
    The Cookie Monster, or How to Remove HTTP Cookies From XMLHttpRequest With setRequestHeader()

    Description: This class is used to remove cookies from XMLHttpRequests.

    Copyright (c) 2006 Michael G. Noll <http://www.michael-noll.com/>

    Documentation:
    http://www.michael-noll.com/wiki/Cookie_Monster_for_XMLHttpRequest

    Original article:
    http://www.michael-noll.com/blog/2006/06/16/the-cookie-monster-or-how-to-remove-cookies-from-xmlhttprequest/



    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA

*/
Tweetlol.CookieMonster = Tweetlol.Class({
    initialize: function(aXMLHttpRequest)
    {
        this.channel_ = aXMLHttpRequest.channel;
    
        // happens after the cookie data has been loaded into the request,
        // but before the request is sent
        this.topic_ = "http-on-modify-request";
    
        this.observerService_ = Components.classes["@mozilla.org/observer-service;1"].getService(Components.interfaces.nsIObserverService);
        this.observerService_.addObserver(this, this.topic_, false /* hold a strong reference */);
    
        // we assume that waiting 15 seconds for cookies is enough in practice;
        // we want to have a defined end time for removing the observer again
        this.lunchTime_ = new Tweetlol.Scheduler(this.stopEating, 15000 /* stop eating after 15 seconds */);
    },
    
    /*
        Be a standard conform cookie monster.
    */
    QueryInterface: function(iid)
    {
        if (   iid.equals(Components.interfaces.nsISupports)
            || iid.equals(Components.interfaces.nsIObserver))
            return this;
        throw Components.results.NS_ERROR_NO_INTERFACE;
    },
    
    /*
        When we are notified that a cookie comes our way through our channel
        (attached to the XMLHttpRequest), we will eat all of them, i.e. remove them.
    */
    observe: function(subject, topic, data)
    {
        if (topic != this.topic_ || subject != this.channel_)
            return; // not our cookies, bleh (as if the original cookie monster did care...)
    
        // lunch time!
        this.channel_.QueryInterface(Components.interfaces.nsIHttpChannel);
        this.channel_.setRequestHeader("Cookie", "", false); // aaah, cookies! scrunch, scrunch...

        // Cookies will only be included once to the HTTP channel, so whenever
        // we have been notified via topic "http-on-modify-request" and ate all
        // cookies, our work is done and we will stop eating.
        this.lunchTime_.stop();
        this.stopEating();
    },
    
    /*
        Stop eating cookies.
    */
    stopEating: function()
    {
        // we finished our lunch, so we clean up (again, as if the original cookie monster...)
        this.observerService_.removeObserver(this, this.topic_); // avoid memory leaks
        delete(this.channel_);
        delete(this.lunchTime_);
        delete(this.observerService_);
    },
    
    CLASS_NAME: "Tweetlol.CookieMonster"
});

/*
    A scheduler for executing a function (callback) after a specified amount of time.

    First parameter:    function variable, executing on every beat
    Second parameter:   time (in ms) after which the supplied function is called
*/
Tweetlol.Scheduler = Tweetlol.Class({
    initialize: function(callback, callAfter_MS)
    {
        this.callback_ = callback;
    
        // get a timer
        this.timer_ = Components.classes["@mozilla.org/timer;1"].createInstance(Components.interfaces.nsITimer);
    
        // we want to stop the beat on shutdown
        var observerService = Components.classes["@mozilla.org/observer-service;1"].getService(Components.interfaces.nsIObserverService);
        observerService.addObserver(this, "xpcom-shutdown", false);
    
        // initialize the timer to fire after the given ms interval
        this.timer_.initWithCallback(this, callAfter_MS, this.timer_.TYPE_ONE_SHOT);
    },
    
    QueryInterface: function(iid)
    {
        if (   iid.equals(Components.interfaces.nsISupports)
            || iid.equals(Components.interfaces.nsITimerCallback)
            || iid.equals(Components.interfaces.nsIObserver))
            return this;
        throw Components.results.NS_ERROR_NO_INTERFACE;
    },
    
    observe: function(aSubject, aTopic, aData)
    {
        // stop the beat on shutdown (see http://wiki.mozilla.org/XPCOM_Shutdown)
        if (aTopic == "xpcom-shutdown")
            this.stop();
    },
    
    stop: function()
    {
        if (this.timer_) {
            // stop the timebeat and remove the observer
            this.timer_.cancel();
            this.timer_ = null;
            this.callback_ = null;
            var observerService = Components.classes["@mozilla.org/observer-service;1"].getService(Components.interfaces.nsIObserverService);
            observerService.removeObserver(this, "xpcom-shutdown");
        }
    },
    
    notify: function(aTimer)
    {
        this.callback_();
        this.stop();
    },
    
    CLASS_NAME: "Tweetlol.Scheduler"
});

