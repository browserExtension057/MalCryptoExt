window.addEvent("domready", function () {
    // Option 1: Use the manifest:
    new FancySettings.initWithManifest(function (settings) {
        //settings.manifest.myButton.addEvent("action", function () {
        //    alert("You clicked me!");
        //});
    });
	
	document.getElementById("appVersion").innerHTML = chrome.runtime.getManifest().version;
	document.getElementById("appName").innerHTML = chrome.runtime.getManifest().name;
	document.title = chrome.runtime.getManifest().name;
	
	//Insert Remote Message
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
		if (xmlHttp.readyState == 4 && xmlHttp.status == 200 && xmlHttp.response != null){
			var jsonData = JSON.parse(xmlHttp.response);
			if(jsonData != null && jsonData.length > 0 && jsonData[0].result == "success"){
				document.getElementById("tab-container-2").style.display="block";
				document.getElementById("tab-container-2").innerHTML = safeResponse.cleanDomString(jsonData[0].data[0].MESSAGE);
			}
		}
	}
	xmlHttp.open("GET", 'https://www.oinkandstuff.com/oink-remote/api/v1/RemoteMessage?app=EdgeOptionsGeneric', true); // true for asynchronous 
	xmlHttp.send(null);	
    
    // Option 2: Do everything manually:
    /*
    var settings = new FancySettings("My Extension", "icon.png");
    
    var username = settings.create({
        "tab": i18n.get("information"),
        "group": i18n.get("login"),
        "name": "username",
        "type": "text",
        "label": i18n.get("username"),
        "text": i18n.get("x-characters")
    });
    
    var password = settings.create({
        "tab": i18n.get("information"),
        "group": i18n.get("login"),
        "name": "password",
        "type": "text",
        "label": i18n.get("password"),
        "text": i18n.get("x-characters-pw"),
        "masked": true
    });
    
    var myDescription = settings.create({
        "tab": i18n.get("information"),
        "group": i18n.get("login"),
        "name": "myDescription",
        "type": "description",
        "text": i18n.get("description")
    });
    
    var myButton = settings.create({
        "tab": "Information",
        "group": "Logout",
        "name": "myButton",
        "type": "button",
        "label": "Disconnect:",
        "text": "Logout"
    });
    
    // ...
    
    myButton.addEvent("action", function () {
        alert("You clicked me!");
    });
    
    settings.align([
        username,
        password
    ]);
    */
});
