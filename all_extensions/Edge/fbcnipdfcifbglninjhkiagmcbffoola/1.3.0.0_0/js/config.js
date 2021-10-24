define(['jquery'], function($) {
    MASTER_ARRAY = {
        "Poloniex": {"src": "new"},
        "Kraken": {"src": "new"},
        "hitbtc": {"src": "new"},
        "bittrex": {"src": "new"},
        "bitfinex": {"src": "new"},
        "binance": {"src": "new"},
    };

    SHOW_ADMIN_MESSAGE = 2;
    MARKETS = {};
    DEFAULT_CONFIG = {
        "sourceCurrency": "BTC",
        "targetCurrency": "BTC/USDT",
        "alertsActive": 1,
        "alertsAmountChange": 50,
        "updateDelay": 30,
        "exchangeService": "binance",
        "chartActive": 1,
        "notisounds": 'true',
        "showAdminMessage": 0
    };
    WS_HOST = HOST = 'localhost:8384';
    WS_HOST = HOST = 'allcrypto.info';
    WS_PATH = '/ws/v2/';

    var config = $.extend({}, DEFAULT_CONFIG, localStorage);
    $.extend(localStorage, config);
    return localStorage;
})
