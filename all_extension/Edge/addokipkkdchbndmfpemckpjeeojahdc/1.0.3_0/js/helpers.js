//Set browser for Firefox extensions to be chrome
if (typeof browser !== 'undefined') {
	window.chrome = browser;
}

var formatCurrency = function (val) {
	return val ? val.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : 0;
};

var updateTotal = function (data) {
	document.getElementById('currentPrice').innerHTML = data.bpi.USD.rate_float.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

var updateBadgeIcon = function (data) {
	var usdRate = Math.trunc(data.bpi.USD.rate_float);
	var badgeText = usdRate.toString();
	if (usdRate > 10000) {
		var truncateValue = (value, n) => Math.floor(value * Math.pow(10, n)) / Math.pow(10, n);
		badgeText = Number.parseFloat(truncateValue(usdRate / 1000, 1)).toPrecision(3) + 'k';
	}

	chrome.browserAction.setBadgeText({
		text: badgeText,
	});

	var localDateTime = new Date(data.time.updated);
	localDateTimeStr = localDateTime.toLocaleString('en-US');

	var title = 'Bitcoin Tracker \n' + usdRate.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) + '\n' + localDateTimeStr;

	chrome.browserAction.setTitle({
		title: title,
	});

	chrome.browserAction.setBadgeBackgroundColor({
		color: '#4d4d4e',
	});
};

var getBitcoinPrice = function () {
	fetch('https://api.coindesk.com/v2/bpi/currentprice.json')
		.then((response) => response.json())
		.then(function (data) {
			updateBadgeIcon(data);
			updateTotal(data);
		});
};
