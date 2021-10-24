app.button.clicked(function () {
  config.addon.active = !config.addon.active;
});

app.tab.removed(function (tabId) {
  delete config.addon.top[tabId];
  delete config.addon.badge[tabId];
});

app.options.receive("get", function (pref) {
  app.options.send("set", {
    "pref": pref, 
    "value": config.get(pref)
  });
});

app.options.receive("changed", function (o) {
  config.set(o.pref, o.value);
  app.options.send("set", {
    "pref": o.pref, 
    "value": config.get(o.pref)
  });
});

config.filter.load(function (data) {
  config.addon.filter.list = config.addon.filter.list && Object.keys(config.addon.filter.list).length ? config.addon.filter.list : data;
  /*  */
  app.request.listen(function (info) {
    if (info.type === "main_frame") {
      config.addon.badge[info.tabId] = 0;
      config.addon.top[info.tabId] = config.hostname(info.url);
      window.setTimeout(function () {app.button.badge(info.tabId)}, 0);
    } else {
      var id = info.tabId;
      var top = config.addon.top[info.tabId];
      var hostname = config.hostname(info.url);
      /*  */
      if (top) {
        if (hostname) {
          if (top !== hostname) {
            if (config.addon.filter.list[hostname] === true) {
              config.addon.badge[id] = config.addon.badge[id] ? config.addon.badge[id] + 1 : 1;
              if (config.addon.log) console.error("Coin miner blocked ::", "URL:", info.url);
              window.setTimeout(function () {app.button.badge(id)}, 0);
              /*  */
              return {"cancel": true};
            } 
          }
        }
      }
    }
  });
});
