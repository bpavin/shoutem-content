var data = require("sdk/self").data;
// Construct a panel, loading its content from the "text-entry.html"
// file in the "data" directory, and loading the "get-text.js" script
// into it.
var text_entry = require("sdk/panel").Panel({
  width: 700,
  height: 500,
  contentURL: data.url("text-entry.html"),
  contentScriptFile: [ data.url("jquery-1.11.3.min.js"), data.url("enter-content.js") ]
});
var pageMod = require("sdk/page-mod");
var login = require("sdk/page-mod");

// Create a button
require("sdk/ui/button/action").ActionButton({
  id: "show-panel",
  label: "Show Panel",
  icon: {
    "16": "./icon-16.png",
    "32": "./icon-32.png",
    "64": "./icon-64.png"
  },
  onClick: handleClick
});

// Show the panel when the user clicks the button.
function handleClick(state) {
  text_entry.show();
}

// When the panel is displayed it generated an event called
// "show": we will listen for that event and when it happens,
// send our own "show" event to the panel's script, so the
// script can prepare the panel for display.
text_entry.on("show", function() {
  text_entry.port.emit("show");
});

// Listen for messages called "text-entered" coming from
// the content script. The message payload is the text the user
// entered.
// In this implementation we'll just log the text to the console.
text_entry.port.on("text-entered", function (text) {
  console.log(text);
  text_entry.hide();
});

var ports = [];
pageMod.PageMod({
  include: "http://www.shoutem.com/builder/content?nid*",
  contentScriptFile: [ data.url("jquery-1.11.3.min.js"), data.url("insert-content.js") ],
  onAttach: function(worker) {
        ports.push(worker.port);
        worker.on('detach', function() {
            var index = ports.indexOf(worker.port);
            if (index !== -1) ports.splice(index, 1);
        });
    }
});
login.PageMod({
  include: "https://www.shoutem.com/login*",
  contentScriptFile: data.url("jquery-1.11.3.min.js"),
  contentScript: "$('#ctl00_cphMain_AuthenticationTabs_AuthenticationTabContainer_LoginTabPanel_LoginForm_txtEmail').val('nekarijec@mailinator.com');"
		+"$('#ctl00_cphMain_AuthenticationTabs_AuthenticationTabContainer_LoginTabPanel_LoginForm_txtPassword').val('nekarijec.shoutem');"
});
text_entry.port.on('message-to-tabs', function(message) {
    for (var i=0; i<ports.length; i++) {
        ports[i].emit('message-to-tab', message);
    }
});
