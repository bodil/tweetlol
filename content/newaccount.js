var currentService = null;
var configuredService = null;

function populateServiceMenu() {
    var menu = document.getElementById("serviceSelector");
    var wizard = document.getElementById("newAccountWizard");
    menu.removeAllItems();
    for (var i = 0; i < Tweetlol.Services.length; i++) {
        var service = Tweetlol.Services[i];
        menu.appendItem(service.title, service.id);
    }
    menu.selectedIndex = 0;
    wizard.canAdvance = true;
}

function selectService() {
    var wizard = document.getElementById("newAccountWizard");
    var menu = document.getElementById("serviceSelector");
    var frame = document.getElementById("serviceFrame");
    var service;
    for (var i = 0; i < Tweetlol.Services.length; i++) {
        service = Tweetlol.Services[i];
        if (service.id == menu.value) break;
    }
    frame.setAttribute("src", service.editor);
    currentService = service;
    wizard.canAdvance = false;
}

function setValid() {
    var wizard = document.getElementById("newAccountWizard");
    wizard.canAdvance = true;
}

function setInvalid() {
    var wizard = document.getElementById("newAccountWizard");
    wizard.canAdvance = false;
}

function configure() {
    var frame = document.getElementById("serviceFrame");
    configuredService = frame.contentWindow.configure();
    document.getElementById("accountName").value = configuredService.toString();
}
