// configuration.js - jlozano developer Copyright (c) | jlozano.net/license - Version 1.7 

// Open configuration

$('.configuration').on('click', function() {
	   $("#currencysearch2").hide();
			 $("#currencysearch3").hide();
				$(".active_fromDropdown").hide();
				$(".active_toDropdown").hide();
				$('.configuration-settings').show(); 
				$(this).removeClass('configuration');
    $(this).addClass('configuration_active');
				$('.configuration_active').addClass('configuration'); 
				$('.configuration_active').removeClass('configuration'); 
			 localStorage.setItem('Configuration', 'on');
			 $('body').addClass('height_500_2');
				$('body').removeClass('height_500');
				$('body').removeClass('height_auto');
				// close currencies list
				$('.currencies-list').hide(); 
				$('.list_active').addClass('list'); 
				$('.list').removeClass('list_active');
				localStorage.setItem('List', 'off'); 
});

// Configuration Back
		
$('.back2').on('click', function() {
				$('.configuration-settings').hide(); 
				$('.configuration_active').addClass('configuration'); 
			 $('.configuration').removeClass('configuration_active');
			 localStorage.setItem('Configuration', 'off'); 
			 $('body').addClass('height_auto'); 
				$('body').removeClass('height_500'); 			
				$('body').removeClass('height_500_2');	
				$("#currencysearch2").hide();
				$("#fromDropdown	.dd-selected-text").show();
	   $("#fromDropdown	.dd-selected-image").show();
				$("#toDropdown	.dd-selected-text").show();
	   $("#toDropdown	.dd-selected-image").show();
				$(".active_fromDropdown").show();
				$(".active_toDropdown").show();
});

// Check status localstorage

var Configuration = localStorage.getItem("Configuration");

if (Configuration == "on") {
		$(".active_fromDropdown").hide();
		$(".active_toDropdown").hide();
		$('.configuration-settings').show(); 
  $('.configuration').addClass('configuration_active');	
		$('.configuration_active').removeClass('configuration');
		$('body').addClass('height_500_2');
		$('body').removeClass('height_500');
		$('body').removeClass('height_auto'); 
}
if (Configuration == "off") {
	$('.configuration-settings').hide();
	$('body').removeClass('height_500_2');	 
}

// Open fullscreen

var elem = document.getElementById("body");

function resizewindow() {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) {
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen();
  }  						
}
document.getElementById("fullscreen").addEventListener('click', resizewindow);

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



// configuration.js - jlozano developer Copyright (c) | jlozano.net/license - Version 1.7 