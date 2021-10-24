// options.js - jlozano developer Copyright (c) | jlozano.net/license  - Version 1.7 


// Init options UI 

$('.add-currency-btn').hide(); 
$('.back').hide(); 
$('.back2').hide(); 
$('.buttons').hide(); 
$('.configuration-settings').show(); 
$('.configuration').addClass('configuration_active');	
$('.configuration_active').removeClass('configuration');
$('body').addClass('height_500_2');
$('body').removeClass('height_500');
$('body').removeClass('height_auto'); 


// Quick command 

function edit() {
  chrome.tabs.create({
    url: 'chrome://extensions/configureCommands',
    active: true
  });
}

function hotkeys() {
  chrome.tabs.create({
    url: 'chrome://extensions/configureCommands',
    active: true
  });
}

document.getElementById("edit_bt").addEventListener('click', edit);
document.getElementById("hotkeys_bt").addEventListener('click', hotkeys);

(function() {
  chrome.commands.getAll(existingKeys);

  function existingKeys(keys) {
    var i, l;
    for (i = 0, l = keys.length; i < l; ++i) {
      addHotKeyRow(
        keys[i].name,
        keys[i].description,
        keys[i].shortcut
      );
    }
  }
  function editKey(e) {
    var properties = {
      "url": "chrome://extensions/configureCommands",
      "active": true
    };
    chrome.tabs.update(null, properties);
  }
  function addHotKeyRow(name, description, shortcut) {
    var hotkeys = document.getElementById("hotkeys");
    var hotkey = document.createElement("div");
    var cellTitle = document.createElement("div");
    var cellKey = document.createElement("div");
    var cellEdit = document.createElement("div");
    var spanTitle = document.createElement("span");
    var spanKey = document.createElement("span");
    var spanEdit = document.createElement("span");
    hotkey.className = "hotkey";
    cellTitle.className = "cell title";
    cellKey.className = "cell key";
    cellEdit.className = "cell edit";
    spanTitle.textContent = description;
    spanKey.textContent = shortcut || "";
    spanEdit.textContent = "";
    spanEdit.addEventListener("click", editKey.bind(hotkey), false);
    cellTitle.appendChild(spanTitle);
    cellKey.appendChild(spanKey);
    cellEdit.appendChild(spanEdit);
    hotkey.appendChild(cellTitle);
    hotkey.appendChild(cellKey);
    hotkey.appendChild(cellEdit);
    hotkeys.appendChild(hotkey);
    hotkey.setAttribute("data-hotkey", name);
  }
})();


// options.js - jlozano developer Copyright (c) | jlozano.net/license  - Version 1.7 