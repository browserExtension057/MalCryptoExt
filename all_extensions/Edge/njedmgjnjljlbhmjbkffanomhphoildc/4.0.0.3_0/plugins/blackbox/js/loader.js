((globals) => {
  "use strict"; 
  const log = (...args) => console.log(...args);

  /*
  chrome.runtime.sendMessage({action: 'getTabs'}, function(resp) {
    log('tabs: ', resp);
  });
  */

  try { // Just in case.
    document.documentElement.setAttribute('airtime-extension-installed', true); // Hint for package, to know the extension is installed.
  } catch (err) {
    // console.warn('Error setting hint', err);
  }

  class BlackBoxMessageBus {
    sendMessage(msg) {
      try {
        chrome.runtime.sendMessage(msg);
      } catch (err) {
        // Tends to error if extension was reloaded, but page wasnt.
        //    Guess we can ignore it.
        // console.warn("BlackBoxMessageBus sendMessage Error:", err, msg);
      }
    }
  }
  
  // log('BlackBox Message Bus Created', location.href);
  globals.BlackBox = new BlackBoxMessageBus;
})(window);
