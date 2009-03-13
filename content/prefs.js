function getLogin(username) {
    var myLoginManager = Components.classes["@mozilla.org/login-manager;1"]
                         .getService(Components.interfaces.nsILoginManager);

    try {
        var logins = myLoginManager.findLogins({}, "chrome://tweetlol", null, "Twitter Auth");
        for (var i = 0; i < logins.length; i++) {
            if (logins[i].username == username) {
                return logins[i];
            }
        }
        return null;
    } catch(e) {
        return null;
    }
}

function setLogin(username, password) {
    var myLoginManager = Components.classes["@mozilla.org/login-manager;1"]
                         .getService(Components.interfaces.nsILoginManager);
    var nsLoginInfo = new Components.Constructor("@mozilla.org/login-manager/loginInfo;1",
                                                 Components.interfaces.nsILoginInfo,
                                                 "init");

    var loginInfo = new nsLoginInfo("chrome://tweetlol", null, "Twitter Auth", username, password, "", "");
    var oldLogin = getLogin(username);
    if (oldLogin) myLoginManager.modifyLogin(oldLogin, loginInfo);
    else myLoginManager.addLogin(loginInfo);
}

function initPrefsDialog() {
    var prefs = Components.classes["@mozilla.org/preferences-service;1"]
                        .getService(Components.interfaces.nsIPrefService);
    prefs = prefs.getBranch("extensions.tweetlol.");
    var username = prefs.getCharPref("username");
    var login = username ? getLogin(username) : null;
    if (login) {
        var bPassword = document.getElementById("bPassword");
        bPassword.value = login.password;
    }
}

function applyPrefsDialog() {
    var bUsername = document.getElementById("bUsername");
    var bPassword = document.getElementById("bPassword");
    setLogin(bUsername.value, bPassword.value);
}
