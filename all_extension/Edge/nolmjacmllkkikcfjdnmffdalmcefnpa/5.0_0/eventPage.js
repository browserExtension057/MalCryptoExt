
if (localStorage.getItem("store.settings.extensionCurrentVersion") == null || localStorage.getItem("store.settings.extensionUpdateVersion") == null){
	var thisVersion = chrome.runtime.getManifest().version;
	localStorage.setItem("store.settings.extensionCurrentVersion", thisVersion);
	localStorage.setItem("store.settings.extensionUpdateVersion", thisVersion);
}

var extensionWindowId;
var tabId;
var mytabId = 0;
var showToasterOnStartup = [true, true, true];
var freemiumId = ["mjddjghhdehffbnbomginipijecjelac", "gokdpnhaggoioddclnnlpjfnkdinjjcc", "iagolejimhnpenigidfphbfdkgmemgok", "gifpiihfhpapfdgkmnbnmiagpclakafd", "migmbeklhhfnfklhpokmmdgnlgaglemk", "nolmjacmllkkikcfjdnmffdalmcefnpa", "agakbninagfbkobndjnaghpbiemkfehf", "necjknpajlpiafaaegodekhjbhlenkad", "pjalolgpofphncbpledfdkdnjmgefcbd", "pflenohdaoonjhkhonobmaklaogfhhgh", "pilidjfgfdojnfgifmmnomejpcgclkol", "kdmhbhkgfgppjncdikhfaddalaoolapg", "gmedoobhinlejhfneenhpfbcmlknebln", "hbbckbefjknkliojkaeokkhimhehmipd", "eieddbbjlpigfcbjijenobkhekpppfja", "bjlnijbamdpjicigddabclfghcpogoae", "ofmgkbfgpobaokfmpceoaahkaebajcok", "fllmlingdhohnanhkgfpidakgcphfjef", "jnbcidabjbnpkiakffjjjbpoemgnfpag", "chdhlpoclgfbehknopojmmgbelblhfdl", "jeiiplpkjiegdjcenninodfcedbgmdpp"];
var emojiId = "migmbeklhhfnfklhpokmmdgnlgaglemk";

if (localStorage.getItem("store.settings.showGenericDesktopNotif") == null) localStorage.setItem("store.settings.showGenericDesktopNotif", "true");

chrome.windows.onRemoved.addListener(function (windowId)
{
    if (windowId == extensionWindowId) {
        extensionWindowId = null;
		tabId = null;
		mytabId = 0;
    }
});

chrome.runtime.onMessageExternal.addListener(function(request, sender, sendResponse) {
    if (request.checkavailable){
        sendResponse({available: {}});
    }
});

/**/
chrome.webRequest.onBeforeSendHeaders.addListener(
  function(details) {
    if (details.tabId && details.tabId === mytabId) {
      const { requestHeaders } = details

      const headers = requestHeaders.filter(header => {
        return header.name.toLowerCase() !== 'x-vary'
      })

      return { requestHeaders: headers }
    }
  },
  {
		urls: [ "<all_urls>" ],	
		tabId: mytabId
  },
  ['blocking', 'requestHeaders']
);

chrome.webRequest.onHeadersReceived.addListener(
    function (details)
    {
		if (details.tabId && details.tabId === mytabId) {
			const val = details.responseHeaders.filter((details) => !['strict-transport-securitys', 'x-content-securitys-policy'].includes(details.name.toLowerCase()));
			return { responseHeaders: val }
		}
    },
    {
        urls: [ "<all_urls>" ],	
		tabId: mytabId
    },["blocking", "responseHeaders"]
);
/**/

function createUpdateWindow(){
    if (extensionWindowId == null) {
		var leftwin = Math.round(screen.availWidth/2 - 207);
		var topwin = Math.round(screen.availHeight/2 - 350);
		chrome.windows.create({ url: 'popup.html', type: 'popup', width: 415, height: 700, left: leftwin, top: topwin },
			function (chromeWindow) {
				extensionWindowId = chromeWindow.id;
				tabId = chromeWindow.tabs[0].id;
				mytabId = chromeWindow.tabs[0].id;
			});
    } else {
		chrome.windows.update(extensionWindowId, { focused: true, drawAttention : true });
    }
}

function getTicker(){
    var dfd1 = $.Deferred();
    $.ajax({
      dataType: "json",
      url: "https://api.coindesk.com/v1/bpi/currentprice.json",
      success: function(data){dfd1.resolve(data)} 
    })
    return dfd1.promise();
}

function populateTickerBadge(){
    getTicker().always(
        function(ticker_data){
            var price_label = (ticker_data["bpi"]["USD"]["rate_float"]/1000.0).toFixed(1) + " K";
			var badgeTooltip = chrome.runtime.getManifest().name;
			badgeTooltip += '\n> '+parseInt(ticker_data["bpi"]["USD"]["rate_float"])+'$';
			chrome.browserAction.setTitle({ title: badgeTooltip });
            chrome.browserAction.setBadgeText({text: price_label});
            window.price_feed.push([ticker_data["bpi"]["USD"]["rate_float"],new moment()]);
            window.price_feed = window.price_feed.slice(-180);
            window.current_price = ticker_data["bpi"]["USD"]["rate_float"];
        }
    );
}

function whenAll(promises){
    data=[]
    dfd=$.Deferred();
    for (var i=0; i<promises.length; i++){
        promises[i].then(
                function(newsdata){
                    data.push(newsdata);
                    if(data.length==promises.length){
                        dfd.resolve(data)
                    }
                }
            );
    }
    return dfd.promise();
}

var newsapikey = ['40d77c2c1a294e848e4180466019401f','98a07d98f4c9478a8176f86a93c0bd13', '2b3431bbca594d4ebee297ffe6031138', '7b85d9acb7484f269bc768ef27c03400','32c59357da544f018307371fa64b5064']


function getBitcoinNews(){
    var data_sources = ["bitcoin","ethereum","litecoin","zcash","crypto"];
    var all_bitcoin_news = [];
    var other_crypto_news = [];
    var all_sources = [];
	var selectedapikey = newsapikey[getRandomInt(0,4)];
    for(var i = 0; i < data_sources.length; i++){
        all_sources.push(
                $.get({
                      crossDomain: true, 
                      dataType: "json",
                      url: "https://newsapi.org/v2/top-headlines?q="+data_sources[i]+"&apiKey="+selectedapikey+"&language=en"
                    })
            );
    }
    $.when.apply($, [whenAll(all_sources)]).then(
            function(all_news){
                for(var i=0; i<all_news.length; i++){
                    for(var j=0; j<all_news[i].articles.length; j++){
                        try{
                            if(all_news[i].articles[j].description.toLowerCase().indexOf("bitcoin".toLowerCase()) >= 0){
                                all_bitcoin_news.push(all_news[i].articles[j]);
                            }else{
                                other_crypto_news.push(all_news[i].articles[j]);
                            }
                        }
                        catch(err){

                        }
                    }
                }
                chrome.storage.local.get('cryptoNews', function(old_news) {
                    var all_news = all_bitcoin_news.concat(other_crypto_news);
                    if(old_news.hasOwnProperty("cryptoNews")){
                        all_news = all_news.concat(old_news.cryptoNews);
                    }
                    var sorted_filtered_news = dedup_news_and_sort(all_news);
                    chrome.storage.local.set({'cryptoNews': sorted_filtered_news}, function() {});
                });
            }
        );
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function dedup_news_and_sort(all_news){
    var obj = {};

    for ( var i=0; i < all_news.length; i++ ){
        obj[all_news[i]['title']] = all_news[i];
    }

    all_news = new Array();
    for ( var key in obj ){
        if(obj[key].hasOwnProperty("publishedAt") && obj[key].publishedAt != null){
            var published_at = moment(obj[key].publishedAt);
            if(published_at.add(5,'days') < moment()){
                continue;
            }
        }else{
            continue;
        }
        all_news.push(obj[key]);
    }

    all_news = all_news.sort(function(a, b){return moment(a.publishedAt)-(moment(b.publishedAt))});

    return all_news.slice(-10).reverse();
}

function getPriceHistory(){
    var dfd2 = $.Deferred();
    $.ajax({
      crossDomain: true,  
      dataType: "json",
      url: "https://api.coindesk.com/v1/bpi/historical/close.json?start=2010-07-17&end=2100-01-01",
      success: function(data){dfd2.resolve(data)}
    })
    return dfd2.promise();
}

function computeAnomalies(){
    var pct_change = Math.abs((window.current_price - window.last_price)*100/window.last_price);

    if(!window.anomaly_notified){
        chrome.storage.local.get('anomaly_notify', function(data) {
            if (Notification.permission == "granted"){
                if(data.hasOwnProperty('anomaly_notify') && (data.anomaly_notify == true) && (window.price_feed.length > 0)){
                    var start_price = window.price_feed[0][0];
                    var end_price = window.price_feed[window.price_feed.length-1][0];
                    var start_time = window.price_feed[0][1];
                    var end_time = window.price_feed[window.price_feed.length-1][1];
                    if(moment.duration(end_time.diff(start_time)).seconds() > 60 * 50){
                        return;
                    }
                    if(Math.abs((end_price - start_price)*100/start_price) > 5){
                        var notification = new Notification('Bitcoin Price Alert!', {
                                  icon: 'img/icon_128.png',
                                  body: "Bitcoin's Price changed more than " + 5 + " % in the last 30 minutes!",
                                }); 
                        window.price_feed = [];
                        notification.onclick = function () {
                            chrome.storage.local.set({'isPopover': true}, function() {
                                chrome.windows.create({ url: "/popup.html", focused: true, type: 'popup', focused:true, height: 650, width:420 }, function(){});
                                window.close();
                            });
                        };
                        window.anomaly_notified = true;
                        setTimeout(function(){ window.anomaly_notified = false; }, 10*60*1000);
                    }
                }
            }
        });
    }

    chrome.storage.local.get('pct_notify', function(data) {
        if (Notification.permission == "granted"){
            if(data.hasOwnProperty('pct_notify')){
                chrome.storage.local.get('pct_notify_val', function(data2) {
                    if(!data2.hasOwnProperty('pct_notify_val')){
                        data2.pct_notify_val = "5";
                    }
                    if(data.pct_notify == true){
                        data2.pct_notify_val = Number(data2.pct_notify_val);
                        if((window.last_pct_notified_val == data2.pct_notify_val) && (window.pct_notified)){
                            return;
                        }
                        if(data2.pct_notify_val < pct_change){
                            var notification = new Notification('Bitcoin Price Alert!', {
                              icon: 'img/icon_128.png',
                              body: "Bitcoin's Price changed more than " + data2.pct_notify_val + " % today!",
                            }); 
                            notification.onclick = function () {
                                chrome.storage.local.set({'isPopover': true}, function() {
                                    chrome.windows.create({ url: "/popup.html", focused: true, type: 'popup', focused:true, height: 650, width:420 }, function(){});
                                    window.close();
                                });
                            };
                            window.last_pct_notified_val = data2.pct_notify_val;
                            window.pct_notified = true;
                        }
                    }
                });
            }
        }
    });
}

function fetchHistoricalData(){
    if(window.last_day != moment.utc().add(-1,'days').format("YYYY-MM-DD")){
            window.pct_notified = false;
            getPriceHistory().always(
                function(historical_data){
                    window.all_days = Object.keys(historical_data.bpi).sort();
                    window.last_day = all_days[all_days.length-1];
                    window.last_price = Number(historical_data.bpi[last_day]);
                }
            );
        }
}

window.current_price = null;
window.last_price = null;
window.last_day = null;
window.price_feed = [];
window.last_pct_notified_val = null;
window.pct_notified = false;
window.anomaly_notified = false;

populateTickerBadge();
fetchHistoricalData();
window.setInterval(
    function(){
        try
        {
            fetchHistoricalData();
            populateTickerBadge();
            computeAnomalies();
        }
        catch(err){

        }
    }
, 10000);

getBitcoinNews();
window.setInterval(
    function(){
        try
        {
            getBitcoinNews();
        }
        catch(err){

        }
    }
, 1000*60*10*3);

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	
	switch (message.extensionUpdated){
		case "extensionUpdated":
			if(localStorage.getItem("store.settings.extensionCurrentVersion") != localStorage.getItem("store.settings.extensionUpdateVersion")){
				sendResponse({ extensionUpdated: localStorage.getItem("store.settings.extensionUpdateVersion") });
				var thisVersion = chrome.runtime.getManifest().version;
				localStorage.setItem("store.settings.extensionUpdateVersion", thisVersion);
				localStorage.setItem("store.settings.extensionCurrentVersion", thisVersion);
			} else {
				sendResponse({ extensionUpdated: "" });
			}
			break;
		default:
			break;
	}
	
	switch (message.openNewWindow){
		case "openNewWindow":
			createUpdateWindow();
			break;
		default:
			break;
	}
	
	switch (message.informationNews) {
        case "informationNews":
			var xmlHttp = new XMLHttpRequest();
			xmlHttp.onreadystatechange = function() {
				if (xmlHttp.readyState == 4 && xmlHttp.status == 200 && xmlHttp.response != null){
					var jsonData = JSON.parse(xmlHttp.response);
					if(jsonData != null && jsonData.length > 0 && jsonData[0].result == "success"){
						var responsestring = [];
						for (var i = 0; i < jsonData[0].data.length; i++)
						{
							responsestring.push(jsonData[0].data[i].MESSAGE);
						}
						sendResponse({ informationNews: responsestring });
					}
				}
			}
			xmlHttp.open("GET", 'https://www.oinkandstuff.com/oink-remote/api/v1/RemoteMessage?app=EdgeNewsGeneric', true); // true for asynchronous 
			xmlHttp.send(null);
			return true; //so i can use sendResponse later
            break;
        default:
            break;
    }
	
    switch (message.supportUs) {
        case "supportUs":
            chrome.storage.sync.get("supportUsDate", function (data) {
                //console.log("supportUsDate", data['supportUsDate']);
                var today = new Date();
                var serializedToday = JSON.stringify(today);
                if (data['supportUsDate'] == null) {
                    chrome.storage.sync.set({ 'supportUsDate': serializedToday }, function () { });
					sendResponse({ supportUs: -1 });
                } else {
                    var savedDate = new Date(JSON.parse(data['supportUsDate']));
                    var datesDiff = Date.dateDiff('d', savedDate, today);

                    chrome.storage.sync.get("supportUsCycle", function (data) {
                        if (data['supportUsCycle'] == null) {
                            chrome.storage.sync.set({ 'supportUsCycle': 1 }, function () { });
							sendResponse({ supportUs: -1 });
                        } else {
                            //console.log("supportUsCycle", data['supportUsCycle']);
							//console.log("supportUsDate", datesDiff);
                            if (data['supportUsCycle'] == 1 && datesDiff >= 3 && showToasterOnStartup[0])
                            {
                                chrome.storage.sync.set({ 'supportUsCycle': 2 }, function () { });
                                chrome.storage.sync.set({ 'supportUsDate': serializedToday }, function () { });
                                sendResponse({ supportUs: 1 });
                            } else if (data['supportUsCycle'] == 2 && datesDiff >= 30 && showToasterOnStartup[0]) {
								chrome.storage.sync.set({ 'supportUsCycle': 2 }, function () { });
                                chrome.storage.sync.set({ 'supportUsDate': serializedToday }, function () { });
                                sendResponse({ supportUs: 2 });
							} else {
								sendResponse({ supportUs: -1 });
							}
                        }
						showToasterOnStartup[0] = false;
                    });
                }
            });
			return true; //so i can use sendResponse later
            break;
        default:
            break;
    }
	
    switch (message.remoteMessage) {
        case "remoteMessage":
			//Check if there are new notifications
			remoteNotification(true);
			chrome.storage.sync.get("remoteMessageDate", function (data) {
				//console.log("remoteMessageDate", data['remoteMessageDate']);
                var today = new Date();
                var serializedToday = JSON.stringify(today);
                if (data['remoteMessageDate'] == null) {
                    chrome.storage.sync.set({ 'remoteMessageDate': serializedToday }, function () { });
					chrome.storage.sync.set({ 'remoteMessageSID': "" }, function () { });
					sendResponse({ remoteMessage: "" });
                } else {
					var savedDate = new Date(JSON.parse(data['remoteMessageDate']));
                    var datesDiff = Date.dateDiff('d', savedDate, today);
					
					var xmlHttp = new XMLHttpRequest();
					xmlHttp.onreadystatechange = function() {
						if (xmlHttp.readyState == 4 && xmlHttp.status == 200 && xmlHttp.response != null && showToasterOnStartup[1]){
							var jsonData = JSON.parse(xmlHttp.response);
							if(jsonData != null && jsonData.length > 0 && jsonData[0].result == "success"){
								var responsestring = [];
								for (var i = 0; i < jsonData[0].data.length; i++)
								{
									responsestring.push(jsonData[0].data[i].MESSAGE);
								}
								chrome.storage.sync.get("remoteMessageSID", function (data) {
									var storedId = data['remoteMessageSID'];

									if((storedId.toUpperCase() != jsonData[0].data[0].SID.toUpperCase() || jsonData[0].data[0].DURATION.toUpperCase() == "Perm".toUpperCase()) && (datesDiff >= 1)){ //Add datesDiff >= 6
										chrome.storage.sync.set({ 'remoteMessageSID': jsonData[0].data[0].SID }, function () { });
										sendResponse({ remoteMessage: responsestring });
									} else {
										sendResponse({ remoteMessage: "" });
									}
									showToasterOnStartup[1] = false;
								});
							}
						}
					}
					xmlHttp.open("GET", 'https://www.oinkandstuff.com/oink-remote/api/v1/RemoteMessage?app=EdgeGeneric', true); // true for asynchronous 
					xmlHttp.send(null);
				}
			});
			return true; //so i can use sendResponse later
            break;
        default:
            break;
    }
	
    switch (message.hasFreemiumActive) {
        case "status":
		var counter = 0, hit = 0, i = 0;
			for(i = 0; i < freemiumId.length; i++){
				//var port = chrome.runtime.connect(freemiumId[i],{});
				chrome.runtime.sendMessage(freemiumId[i], {checkavailable: true}, function(response) {
					counter++;
					if (response != null && response.available != null){
						hit++;
						//console.log('Installed');
					}
					if(counter == freemiumId.length){
						if(hit >= 2) sendResponse({ hasFreemiumActive: "true" });
						else sendResponse({ hasFreemiumActive: "false" });
					}
				});
			}
			return true; //so i can use sendResponse later
            break;
		case "freemiumAlert":
            chrome.storage.sync.get("freemiumAlertDate", function (data) {
                var today = new Date();
                var serializedToday = JSON.stringify(today);
                if (data['freemiumAlertDate'] == null) {
                    chrome.storage.sync.set({ 'freemiumAlertDate': serializedToday }, function () { });
					sendResponse({ freemiumAlert: -1 });
                } else {
                    var savedDate = new Date(JSON.parse(data['freemiumAlertDate']));
                    var datesDiff = Date.dateDiff('d', savedDate, today);

                    chrome.storage.sync.get("freemiumAlertCycle", function (data) {
                        if (data['freemiumAlertCycle'] == null) {
                            chrome.storage.sync.set({ 'freemiumAlertCycle': 1 }, function () { });
							sendResponse({ freemiumAlert: -1 });
                        } else {
                            if (data['freemiumAlertCycle'] == 1 && datesDiff >= 15 && showToasterOnStartup[2])
                            {
                                chrome.storage.sync.set({ 'freemiumAlertCycle': 2 }, function () { });
                                chrome.storage.sync.set({ 'freemiumAlertDate': serializedToday }, function () { });
                                sendResponse({ freemiumAlert: 1 });
                            } else if (data['freemiumAlertCycle'] == 2 && datesDiff >= 45 && showToasterOnStartup[2]) {
								chrome.storage.sync.set({ 'freemiumAlertCycle': 2 }, function () { });
                                chrome.storage.sync.set({ 'freemiumAlertDate': serializedToday }, function () { });
                                sendResponse({ freemiumAlert: 2 });
							} else {
								sendResponse({ freemiumAlert: -1 });
							}
                        }
						showToasterOnStartup[2] = false;
                    });
                };
            });
			return true; //so i can use sendResponse later
			break;
        default:
            break;
    }
	
	sendResponse({});
	return true;
});

chrome.runtime.onInstalled.addListener(function(details){
	var thisVersion = chrome.runtime.getManifest().version;
    if(details.reason == "install"){
		localStorage.setItem("store.settings.extensionUpdateVersion", thisVersion);
		localStorage.setItem("store.settings.extensionCurrentVersion", thisVersion);
    }else if(details.reason == "update"){
		localStorage.setItem("store.settings.extensionUpdateVersion", thisVersion);
    }
});

/*#### Manage Notifications ####*/
function remoteNotification(startup){
	chrome.storage.sync.get("remoteNotificationDate", function (data) {
		var today = new Date();
		var serializedToday = JSON.stringify(today);
		if (data['remoteNotificationDate'] == null) {
			chrome.storage.sync.set({ 'remoteNotificationDate': serializedToday }, function () { });
			chrome.storage.sync.set({ 'remoteNotificationSID': "" }, function () { });
		} else {
			var savedDate = new Date(JSON.parse(data['remoteNotificationDate']));
			var datesDiff = Date.dateDiff('d', savedDate, today);
			
			var xmlHttp = new XMLHttpRequest();
			xmlHttp.onreadystatechange = function() {
				if (xmlHttp.readyState == 4 && xmlHttp.status == 200 && xmlHttp.response != null){
					var jsonData = JSON.parse(xmlHttp.response);
					if(jsonData != null && jsonData.length > 0 && jsonData[0].result == "success"){
						chrome.storage.sync.get("remoteNotificationSID", function (data) {
							var storedId = data['remoteNotificationSID'];

							if((startup == null && jsonData[0].data[0].STARTUP.toUpperCase() == "Boot".toUpperCase()) || (startup != null && jsonData[0].data[0].STARTUP.toUpperCase() == "Open".toUpperCase())){
								if((storedId.toUpperCase() != jsonData[0].data[0].SID.toUpperCase() || jsonData[0].data[0].DURATION.toUpperCase() == "Perm".toUpperCase()) && (datesDiff >= 1)){
									chrome.storage.sync.set({ 'remoteNotificationSID': jsonData[0].data[0].SID }, function () { });
									var title, message, url, icon = "";
									var res = jsonData[0].data[0].MESSAGE.split("|");
									for (var i = 0; i < res.length; i++) {
										if(i == 0) title = res[i];
										else if (i == 1) message = res[i];
										else if (i == 2) url = res[i];
										else if (i == 3) icon = res[i];
									}
									showNotification(title,message,url,icon);
								} else {
								}
							}
						});
					}
				}
			}
			xmlHttp.open("GET", 'https://www.oinkandstuff.com/oink-remote/api/v1/RemoteMessage?app=EdgeNotificationGeneric', true); // true for asynchronous 
			xmlHttp.send(null);
		}
	});
}

function showNotification(title, message, url, icon, delay){
	if(localStorage.getItem("store.settings.showGenericDesktopNotif") == null || localStorage.getItem("store.settings.showGenericDesktopNotif") == "true"){
		if(title == null || title == "") title = chrome.runtime.getManifest().name;
		if(message == null || message == "") message = "Updated to v" + chrome.runtime.getManifest().version + ". Check this and other news on our Website.";
		if(url == null || url == "") url = "https://www.oinkandstuff.com";
		if(icon == null || icon == "") icon = "img/icon_128.png";
		if(delay == null) delay = 10000;
		
		setTimeout(function(){
			var options = {
			  type: "basic",
			  title: title,
			  message: message,
			  iconUrl: icon
			}
			// create notification using url as id
			chrome.notifications.create(url, options, function(notificationId){ }); 
		}, delay + getRandomInt(delay, delay*2));
	}
}

chrome.notifications.onClicked.addListener(function(notificationId) {
  chrome.tabs.create({url: notificationId});
});

//Check if there are new notifications
remoteNotification(null);

/*#### ContextMenu ####*/
function clickContextMenu(info, tab){
	var file = info.pageUrl;
    if (info.linkUrl) {
        file = info.linkUrl;
    }
    createUpdateWindow(file);
}
var showForPages = [];
chrome.contextMenus.create({
	id: "OINKANDSTUFF_ALL",
    title: "Open " + chrome.runtime.getManifest().name,
	contexts: ["all"],
	onclick: clickContextMenu
});
chrome.contextMenus.create({
	id: 'OINKANDSTUFF_RATE',
	title: 'Rate ' + chrome.runtime.getManifest().name + ' \u272C\u272C\u272C\u272C\u272C',
	contexts: ['browser_action'],
	onclick: function () {
		chrome.tabs.create({url: "https://microsoftedge.microsoft.com/addons/detail/" + chrome.runtime.id});
	}
});
chrome.contextMenus.create({
	id: 'OINKANDSTUFF_GOPREMIUM',
	title: 'Go Premium \u2764',
	contexts: ['browser_action'],
	onclick: function () {
		chrome.tabs.create({url: "chrome-extension://" + chrome.runtime.id + "/options/indexPremium.html"});
	}
});

// datepart: 'w', 'd', 'h', 'm', 's'
Date.dateDiff = function (datepart, fromdate, todate) {
    datepart = datepart.toLowerCase();
    var diff = todate - fromdate;
    var divideBy = {
        w: 604800000,
        d: 86400000,
        h: 3600000,
        m: 60000,
        s: 1000
    };

    return Math.floor(diff / divideBy[datepart]);
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-48842724-20']);
_gaq.push(['_trackPageview']);

(function () {
    var ga = document.createElement('script');
    ga.type = 'text/javascript';
    ga.async = true;
    ga.src = 'https://ssl.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ga, s);
})();