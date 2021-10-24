if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onInstalled) {
	chrome.runtime.onInstalled.addListener(function (details) {
		if (details.reason == 'install') {
			chrome.tabs.create({
				url: 'https://timleland.com/bitcoin-tracker-extension-install/',
			});
		}
	});
}

if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.setUninstallURL) {
	chrome.runtime.setUninstallURL('https://timleland.com/extensions/');
}

var canUseAlarms = function () {
	return typeof chrome !== 'undefined' && chrome.alarms && chrome.alarms.onAlarm;
};

if (canUseAlarms()) {
	chrome.alarms.onAlarm.addListener(function (alarm) {
		if (alarm.name == 'updatePrice') {
			getBitcoinPrice();
		}
	});

	chrome.alarms.clearAll(function (wasCleared) {
		chrome.alarms.create('updatePrice', {
			periodInMinutes: 15,
		});
	});
}

getBitcoinPrice();
