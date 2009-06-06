var service = Tweetlol.mainWindow().currentService;

function verifyAccount() {
    var button = document.getElementById("verifyButton");
    var username = document.getElementById("bUsername");
    var password = document.getElementById("bPassword");
    document.getElementById("verifyButtonGroup").hidden = true;
    document.getElementById("verifiedGroup").hidden = true;
    document.getElementById("verifyingGroup").hidden = false;
    var callback = function(success, message) {
        if (success) {
            document.getElementById("verifyButtonGroup").hidden = true;
            document.getElementById("verifyingGroup").hidden = true;
            document.getElementById("verifiedGroup").hidden = false;
            Tweetlol.mainWindow().setValid();
        } else {
            invalidate();
            alert("Failed: " + message);
        }
    };
    service.verifyAccount(username.value, password.value, callback);
}

function invalidate() {
    document.getElementById("verifyingGroup").hidden = true;
    document.getElementById("verifiedGroup").hidden = true;
    document.getElementById("verifyButtonGroup").hidden = false;
    Tweetlol.mainWindow().setInvalid();
}

function configure() {
    var options = {
        username: document.getElementById("bUsername").value,
        password: document.getElementById("bPassword").value
    };
    return new service(options);
}
