requirejs.config({
    baseUrl: 'js',
    paths: {
        jquery: 'jquery-1.12.1.min',
        sockjs: 'sockjs.min'
    }
});

define(['config', 'utils', 'ticker', 'ws',], function(config, utils, ticker, ws){

    if (config.chartActive == 0) {
        chrome.browserAction.setPopup({popup: ""});
    }

    utils.showAdminMessage();
    ticker.updateTicker();

    chrome.browserAction.onClicked.addListener(function (tab) {
        ticker.updateTicker();
    });

    var exMessageListeners = {
        "updateTickerReq": ticker.updateTicker,
        "resetTickerReq": ticker.resetTicker,
        "resetInterval": ticker.restartInterval,
        "wsRecreate": function(req) {
            ticker['needUpdate'] = true;
            WSOCK.recreate(utils.getSymbols())
        },
        "popupOpen": utils.publishMarkets
    }
    chrome.extension.onMessage.addListener(function (req, sender, sendResponse) {
        if (exMessageListeners.hasOwnProperty(req.msg)) {
            exMessageListeners[req.msg](req)
        }
    });

    ticker['needUpdate'] = true;
    WSOCK = ws(utils.getSymbols())
        .addHandler('default', function(data) {
            utils.updateMarketSymbol(data);
            if (data.symbol == localStorage['targetCurrency'] &&
                ticker['needUpdate']
            ) {
                ticker.updateTicker();
                ticker['needUpdate'] = false;
            }
        });
        // .addHandler('first_message', ticker.updateTicker);

});
