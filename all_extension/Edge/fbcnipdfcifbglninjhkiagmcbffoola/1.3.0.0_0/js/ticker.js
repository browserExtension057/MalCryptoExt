define(['jquery', 'config'], function($, config) {
    return (function () {
        var self = {},
        lastCheckAmount = 0,
        mainInterval;

        self.processNewRate = function (currentRate) {
            if (lastCheckAmount == 0) {
                lastCheckAmount = currentRate;

            } else if (Math.abs(currentRate - lastCheckAmount) > config["alertsAmountChange"]) {
                var delta = currentRate - lastCheckAmount;

                if (!!parseInt(+config["alertsActive"], 10)) {
                    if (delta > 0) {
                        chrome.notifications.create("", {
                            type: "basic",
                            title: config["sourceCurrency"] + " is going up!",
                            message: "1 " + config["sourceCurrency"] + " = " + currentRate + " " + config["targetCurrency"] + "",
                            iconUrl: "images/icon-48.png"
                        }, function () {});
                        if (config["notisounds"]=='true') {
                            var audio=new Audio("sounds/up.wav");
                            audio.play();
                        }
                    } else if (delta < 0) {
                        chrome.notifications.create("", {
                            type: "basic",
                            title: config["sourceCurrency"] + " is going down!",
                            message: "1 " + config["sourceCurrency"] + " = " + currentRate + " " + config["targetCurrency"] + "",
                            iconUrl: "images/icon-48.png"
                        }, function () {});
                        if (config["notisounds"]=='true') {
                            var audio=new Audio("sounds/fall.wav");
                            audio.play();
                        }
                    }
                }

                lastCheckAmount = currentRate;
            }

            if (currentRate > 1000) {
                var rateString = (Math.floor(currentRate)).toString();
            } else if (currentRate > 100) {
                var rateString = (Math.floor(currentRate * 10) / 10).toString();
            } else if (currentRate > 10) {
                var rateString = (Math.floor(currentRate * 100) / 100).toString();
            } else if (currentRate > 1) {
                var rateString = (Math.floor(currentRate * 1000) / 1000).toString();
            } else if (currentRate >= 0.01) {
                var rateString = (Math.floor(currentRate * 10000) / 10000).toString().substring(2);
            } else {
                var rateString = (Math.floor(currentRate * 10000) / 10000).toString().substring(2);
            }

            self.setBadgeOptions(rateString, "#080", "#c45c50");
        }

        self.setBadgeOptions = function(text, bcolor, bcolor1) {
            chrome.browserAction.setBadgeText({text: text});
            chrome.browserAction.setBadgeBackgroundColor({color: bcolor});
            setTimeout(function () {
                chrome.browserAction.setBadgeBackgroundColor({color: bcolor1});
            }, 600);
        }

        self.updateTicker = function () {
            var service = config["exchangeService"],
            currency = config["targetCurrency"];
            // new system
            var symbol = config["targetCurrency"];

            if (MASTER_ARRAY.hasOwnProperty(service) &&
                MASTER_ARRAY[service].src == 'new' &&
                MARKETS.hasOwnProperty(service.toLowerCase()) &&
                MARKETS[service.toLowerCase()].hasOwnProperty(symbol))
            {
                var rate = MARKETS[service.toLowerCase()][symbol].bid;
                self.processNewRate(rate);
            } else {
                self.setBadgeOptions("1", "#080", "#c45c50");
            }

            if (typeof mainInterval == 'undefined') {
                self.restartInterval();
            }
        }

        self.resetTicker = function () { lastCheckAmount = 0; }

        self.restartInterval = function () {
            if (typeof mainInterval != 'undefined') {
                clearInterval(mainInterval);
            }
            mainInterval = setInterval(function () {
                self.updateTicker();
            }, config['updateDelay'] * 1000);
        }
        return self;

    }());
})
