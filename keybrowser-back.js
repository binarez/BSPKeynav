
let gettingAllCommands = browser.commands.getAll();
gettingAllCommands.then((commands) => {
  for (let command of commands) {
    // Note that this logs to the Add-on Debugger's console: https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Debugging
    // not the regular Web console.
    console.log(command);
  }
});

browser.commands.onCommand.addListener(
  function(command) {
    if (command.substr(0, 7) == "keynav-") {
      sendCommandToCurrentTab(command.substr(7));
    }
});

function sendCommandToCurrentTab(command){
  /*
    var args = Array.prototype.slice.call(arguments); //Get arguments as an array
    return browser.tabs.query({active:true,currentWindow:true}).then(function(tabs){
        args.unshift(tabs[0].id); //Add tab ID to be the new first argument.
        return browser.tabs.sendMessage.apply(this,args);
    });
  */
  browser.tabs.query({active: true, currentWindow: true}, function(tabs){
      browser.tabs.sendMessage(tabs[0].id, { keynav: command}, function(response) {});
  });
}
