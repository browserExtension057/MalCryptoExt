var background = (function () {
  var tmp = {};
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    for (var id in tmp) {
      if (tmp[id] && (typeof tmp[id] === "function")) {
        if (request.path === "background-to-options") {
          if (request.method === id) tmp[id](request.data);
        }
      }
    }
  });
  /*  */
  return {
    "receive": function (id, callback) {tmp[id] = callback},
    "send": function (id, data) {chrome.runtime.sendMessage({"path": "options-to-background", "method": id, "data": data})}
  }
})();

var config = {
  "render": function (o) {
    if (window[o.pref]) {
      window[o.pref].value = o.value;
    }
  },
  "load": function () {
    var prefs = document.querySelectorAll("*[data-pref]");
    [].forEach.call(prefs, function (elem) {
      var pref = elem.getAttribute("data-pref");
      window[pref] = config.connect(elem, pref);
    });
    /*  */
    window.removeEventListener("load", config.load, false);
  },
  "connect": function (elem, pref) {
    var att = "value";
    var pref = elem.getAttribute("data-pref");
    if (elem) {
      if (elem.type === "checkbox") att = "checked";
      if (elem.localName === "textarea") att = "value";
      if (elem.localName === "span") att = "textContent";
      if (elem.localName === "select") att = "selectedIndex";
      /*  */
      background.send("get", pref);
      elem.addEventListener("change", function (e) {
        try {
          var value = this[att];
          var pref = e.target.getAttribute("data-pref");
          if (pref === "addon.filter.list") value = JSON.parse(value);
          /*  */
          background.send("changed", {"pref": pref, "value": value});
        } catch (e) {}
      });
    }
    /*  */
    return {
      get value () {return elem[att]},
      set value (val) {
        if (elem.type === "textarea") {
          elem[att] = JSON.stringify(val, null, 2);
        } else elem[att] = val;
      }
    }
  }
};

background.receive("set", config.render);
window.addEventListener("load", config.load, false);