var app = {};

app.version = function () {return chrome.runtime.getManifest().version};
app.homepage = function () {return chrome.runtime.getManifest().homepage_url};

app.tab = {
  "open": function (url) {chrome.tabs.create({"url": url, "active": true})},
  "removed": function (callback) {
    chrome.tabs.onRemoved.addListener(function (tabId, info) {
      callback(tabId);
    });
  }
};

if (!navigator.webdriver) {
  chrome.runtime.setUninstallURL(app.homepage() + "?v=" + app.version() + "&type=uninstall", function () {});
  chrome.runtime.onInstalled.addListener(function (e) {
    chrome.management.getSelf(function (result) {
      if (result.installType === "normal") {
        window.setTimeout(function () {
          var previous = e.previousVersion !== undefined && e.previousVersion !== app.version();
          var doupdate = previous && parseInt((Date.now() - config.welcome.lastupdate) / (24 * 3600 * 1000)) > 45;
          if (e.reason === "install" || (e.reason === "update" && doupdate)) {
            var parameter = (e.previousVersion ? "&p=" + e.previousVersion : '') + "&type=" + e.reason;
            app.tab.open(app.homepage() + "?v=" + app.version() + parameter);
            config.welcome.lastupdate = Date.now();
          }
        }, 3000);
      }
    });
  });
}

app.storage = (function () {
  var objs = {};
  window.setTimeout(function () {
    chrome.storage.local.get(null, function (o) {
      objs = o;
      var script = document.createElement("script");
      script.src = "../common.js";
      document.body.appendChild(script);
    });
  }, 300);
  /*  */
  return {
    "read": function (id) {return objs[id]},
    "write": function (id, data) {
      var tmp = {};
      tmp[id] = data;
      objs[id] = data;
      chrome.storage.local.set(tmp, function () {});
    }
  }
})();

app.options = (function () {
  var tmp = {};
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    for (var id in tmp) {
      if (tmp[id] && (typeof tmp[id] === "function")) {
        if (request.path === "options-to-background") {
          if (request.method === id) tmp[id](request.data);
        }
      }
    }
  });
  /*  */
  return {
    "receive": function (id, callback) {tmp[id] = callback},
    "send": function (id, data) {
      chrome.runtime.sendMessage({"path": "background-to-options", "method": id, "data": data});
    }
  }
})();

app.button = {
  "clicked": function (callback) {
    chrome.browserAction.onClicked.addListener(callback);
  },
  "icon": function (e) {
    chrome.browserAction.setIcon({
      "path": {
        "16": "../../data/icons/" + (e ? e + '/' : '') + "16.png",
        "32": "../../data/icons/" + (e ? e + '/' : '') + "32.png",
        "48": "../../data/icons/" + (e ? e + '/' : '') + "48.png",
        "64": "../../data/icons/" + (e ? e + '/' : '') + "64.png"
      }
    });
  },
  "badge": function (tabId) {
    if (tabId) {
      var number = config.addon.badge[tabId];
      var text = number && number > 0 ? number + '' : '';
      chrome.browserAction.setBadgeText({
        "text": text, 
        "tabId": tabId
      }, function () {
        var tmp = chrome.runtime.lastError;
      });
    }
  }
};

app.request = {
  "listen": function (callback) {
    var beforerequest = function (info) {return callback(info)};
    /*  */
    var listener = function () {
      app.button.icon(config.addon.active ? "active" : "inactive");
      chrome.webRequest.onBeforeRequest.removeListener(beforerequest);
      if (config.addon.active) {
        chrome.webRequest.onBeforeRequest.addListener(beforerequest, {
          "urls": [
            "*://*/*", 
            "ws://*/*", 
            "wss://*/*"
          ],
          "types": [
            "other",
            "script", 
            "sub_frame", 
            "websocket",
            "main_frame", 
            "xmlhttprequest"
          ]
        }, ["blocking"]);
      }
    };
    /*  */
    window.setTimeout(listener, 300);
    chrome.storage.onChanged.addListener(listener);
  }
};