function loadTV(market, quoteCurrency) {
    $.getScript("https://d33t3vvu2t2yu5.cloudfront.net/tv.js", function(){
        // if new system
        if (/\//.test(quoteCurrency)){
            var symbol = quoteCurrency.replace("/","");
        } else {
            var symbol = "BTC"+quoteCurrency;
        }
        symbol = market.toUpperCase()+":"+symbol;
        new TradingView.widget({
            "container_id": "chart",
            "width": 770,
            "height": 560,
            "symbol": symbol,
            "interval": "30",
            "timezone": "Etc/UTC",
            "theme": "White",
            "style": "1",
            "locale": "en",
            "toolbar_bg": "#f1f3f6",
            "allow_symbol_change": true,
            "hideideas": true,
            "studies": [
                "MACD@tv-basicstudies"
            ],
            //"show_popup_button": false,
            //"popup_width": "1000",
            //"popup_height": "650",
            "referral_id": "1645"
        });
    });
}

function updatePopupSymbols() {
    var marketsData = backgroundPage.MARKETS,
        trackableSymbols = backgroundPage.SYMBOLS;

    for(var marketSymbol of trackableSymbols) {
        var marketData = marketsData[marketSymbol.market];
        if (!marketData) continue;
        var ticker = marketData[marketSymbol.symbol];
        if (!ticker) continue;
        var rate_block_id = marketSymbol.symbol.replace('/',''),
            $rate_block = $('#'+rate_block_id);
        if (!$rate_block.length) {
            $rate_block = $('<div/>')
                .attr({id: rate_block_id, class:'rateblock'})
                .appendTo($('#rate_wrapper'));
        }
        $rate_block.html(marketSymbol.symbol+': '+ticker.bid);
    }
}

var backgroundPage = chrome.extension.getBackgroundPage();

function initPopup() {
    var market = localStorage["exchangeService"],
        quoteCurrency = localStorage["targetCurrency"];

    loadTV(market, quoteCurrency);
    updatePopupSymbols();

    chrome.extension.onMessage.addListener(function(req) {
        console.log('popup onMessage');
        // message about that markets data was update
        if (req.msg == 'markets') {
            updatePopupSymbols()
        }
    });
    chrome.extension.sendMessage({'msg': 'popupOpen'}, function() {});
}

requirejs.config({
    baseUrl: 'js',
    paths: {
        jquery: 'jquery-1.12.1.min'
    }
});

define(['jquery', 'utils'], function($, utils) {
    $("#closeBtn").click(function(){window.close();})
    setTimeout(initPopup, 10);
});
