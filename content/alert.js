function tweetlolAlertThing() {
    Application.console.log("hello from alert overlay! " + window.arguments[5]);
    var label = document.getElementById("alertBox");
    if (window.arguments.length > 4) {
        var content = window.arguments[2];
        if (window.arguments[4] == "tweetlol") {
            content = '<html><head><link rel="stylesheet" type="text/css" '
            + 'href="chrome://tweetlol/content/frame.css"/></head><body>' + content
            + '</body></html>';
            var iframe = document.createElement("iframe");
            iframe.setAttribute("id", "tweetlolAlertTextFrame");
            iframe.setAttribute("src", 'data:text/html,' + content);
            iframe.setAttribute("width", "300");
            label.parentNode.insertBefore(iframe, label);
            label.setAttribute("hidden", "true");
        }
    }
}
