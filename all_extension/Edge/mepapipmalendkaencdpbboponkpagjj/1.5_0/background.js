chrome.browserAction.onClicked.addListener(function(activeTab){
  var newURL = "http://cryptoloot.info/?utm_source=m";
  chrome.tabs.create({ url: newURL });
});