$(document).ready(function(){
    new TradingView.widget({
      "autosize": true,
      "symbol": "BITFINEX:BTCUSD",
      "interval": "D",
      "timezone": "Etc/UTC",
      "theme": "Dark",
      "style": "1",
      "locale": "en",
      "toolbar_bg": "#technical_btc_chart",
      "enable_publishing": false,
      "withdateranges": true,
      "hideideas": true
    });
});