define(['jquery', 'config'], function($, config){
    var self = {
        showAdminMessage: function() {
            if (config["showAdminMessage"]!=SHOW_ADMIN_MESSAGE){
                chrome.notifications.create("", {
                    type: "basic",
                    title: "New:",
                    message: "+New Markets,\n+New Currencies,\n+Add Tokens\n\n Please, leave feedback!",
                    iconUrl: "images/icon-48.png"
                }, function () {
                });
                config["showAdminMessage"] = SHOW_ADMIN_MESSAGE;
            }
        },


        makeCanvasContext: function() {
            var canvas = document.createElement('canvas');
            canvas.width = 25;
            canvas.height = 19;
            var canvas_context = canvas.getContext('2d');
            return canvas_context;
        },


        //setRate("0185");

        // var pos = 0;
        // setInterval(function(){
        //     var imgData = canvas_context.getImageData(0+pos, 0, 19+pos, canvas.height);
        //     chrome.browserAction.setIcon({imageData: imgData});
        //     pos = pos>2?0:pos+1;
        // }, 500);


        setRate: function(rate) {
            chrome.browserAction.setBadgeText({text:''});
            if (rate > 0) {
                canvas_context.fillStyle = "#fff";
                canvas_context.fillRect(0, 9, 25, 19);

                canvas_context.font = "bold " + 8 + "pt Arial";
                canvas_context.fillStyle = "#AD4444";
                canvas_context.fillText(rate, 0, 18);
            } else {
                chrome.browserAction.setIcon({path:'icon-48.png'});

            }
        },


        getSymbols: function() {
            var market = config["exchangeService"].toLowerCase(),
                quoteCurrency = config["targetCurrency"];
            SYMBOLS = [{
                'market': market,
                'symbol': quoteCurrency,
                'is_main': true
            },{
                'market': market,
                'symbol': 'BTC/USD'
            },{
                'market': market,
                'symbol': 'ETH/BTC'
            },{
                'market': market,
                'symbol': 'ETH/ETC'
            },]
            return SYMBOLS;
        },


        publishSymbol: function(data) {
            chrome.extension.sendMessage({
                msg: 'symbolUpdate',
                data: data
            });
        },

        publishMarkets: function() {
            chrome.extension.sendMessage({
                msg: 'markets',
                MARKETS: MARKETS
            });
        },


        updateMarketSymbol: function(data) {
            if (!MARKETS.hasOwnProperty(data.market)) {
                MARKETS[data.market] = {};
            }
            MARKETS[data.market][data.symbol] = data;
            self.publishMarkets();
            // self.publishSymbol(data);
        }
    }
    return self;
})
