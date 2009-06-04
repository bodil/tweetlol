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
    
    nsUrl: function(spec) {
      var ios = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
      return ios.newURI(spec, null, null);
    },
    
    newTab: function(url) {
        var tab = Application.activeWindow.open(Tweetlol.nsUrl(url));
        if (!Tweetlol.prefs.getBoolPref("backgroundTabs"))
            tab.focus();
        return false;
    }
};
