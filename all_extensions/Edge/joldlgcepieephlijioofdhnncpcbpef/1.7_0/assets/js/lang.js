// lang.js - jlozano developer Copyright (c) | jlozano.net/license  - Version 1.7 

if (typeof safari !== "undefined") chrome = {
  i18n: {
    getMessage: function(messageID, args) {
      var i;
      if (typeof chrome.i18n.strings === "undefined") {
        var languages = [navigator.language.replace("-", "_")];
        if (navigator.language.length > 2) languages.push(navigator.language.substring(0, 2));
        if (navigator.language !== "en") languages.push("en");
        chrome.i18n.strings = {};
        var fetchAndParse = function(locale) {
          var xhr = new XMLHttpRequest;
          xhr.open("GET", safari.extension.baseURI + "_locales/" + locale + "/messages.json", false);
          xhr.onreadystatechange =
            function() {
              if (this.readyState === 4 && this.responseText) {
                var parsed = JSON.parse(this.responseText);
                var string;
                for (string in parsed)
                  if (!chrome.i18n.strings[string]) {
                    var result = parsed[string].message;
                    var ph = parsed[string].placeholders;
                    if (ph) {
                      var phID;
                      for (phID in ph) {
                        var rgx = new RegExp("\\$" + phID + "\\$");
                        result = result.replace(rgx, ph[phID].content)
                      }
                    }
                    chrome.i18n.strings[string] = result
                  }
              }
            };
          try {
            xhr.send()
          } catch (ex) {}
        };
        for (i = 0; i < languages.length; i++) fetchAndParse(languages[i])
      }
      if (typeof args === "string") args = [args];
      else if (!args) args = [];
      var edited = chrome.i18n.strings[messageID].replace(/\$\$/g, "@@@@");
      for (i = 0; i < args.length; i++) {
        var rgx = new RegExp("(?!\\$\\$)\\$" + (i + 1), "g");
        edited = edited.replace(rgx, args[i])
      }
      return edited.replace(/@@@@/g, "$$")
    }
  }
};
items = document.querySelectorAll("[data-i18n]");
for (i = 0; i < items.length; i++) {
  var translation = chrome.i18n.getMessage(items[i].getAttribute("data-i18n"));
  if (items[i].value === "i18n") items[i].value = translation;
  else items[i].innerText = translation
};

// lang.js - jlozano developer Copyright (c) | jlozano.net/license  - Version 1.7 