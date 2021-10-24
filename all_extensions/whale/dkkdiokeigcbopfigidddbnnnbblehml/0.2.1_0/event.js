chrome.webRequest.onBeforeRequest.addListener(
  function(info) {
    if (info.url.split("?")[0].split("#")[0].endsWith("m3u8")) {
      var playerUrl = chrome.extension.getURL('player.html') + "#" + info.url
      return { redirectUrl:  playerUrl }
    }
  },
  {urls: ["*://*/*.m3u8*"], types:["main_frame"]},
  ["blocking"]
);
