// CoinBUrl = 'https://www.coinbase.com',
// CoinBId = 'join/aja_w',
// CoinBIdUrl = 'https://www.coinbase.com/join/aja_w',

var eur = 'EUR',
	usd = 'USD',
	btc = 'BTC',
	// ltc = 'LTC',
	// eth = 'ETH',
	// bch = 'BCH',
	// xrp = 'XRP',
	// eos = 'EOS',
	colorIncreasing = '#3dcc44',
	colorDecreasing = '#f53232',
	colorStart = '#2e62bb',//#78A7A7',
	priceResponse,
	pricePrevious = -1;
	web1_id = 'bitcoin_price_coinbase',
	web1_url = 'https://www.coinbase.com/join/aja_w',
	// 12345 to 12.3k:
	abbrNumber = function(n,d){x=(''+n).length,p=Math.pow,d=p(10,d);x-=x%3;return Math.round(n*d/p(10,x))/d+" kMGTPE"[x/3]},
	createMenus = function()
	{
		chrome.contextMenus.create(
		{
			id: web1_id,
			title: chrome.i18n.getMessage('goToCoinbase'),
			contexts: ['browser_action']
		});

		chrome.contextMenus.onClicked.addListener( function(info, tab)
		{
		    if ( info.menuItemId == web1_id )
		    {
		    	chrome.tabs.create({ url: web1_url });
		    }
		});
	},
	getPriceFromTo = async function( currencyFrom, currencyTo )
	{
		// https://min-api.cryptocompare.com/documentation
		// https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=EUR&e=Coinbase
		// https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD,JPY,EUR
		// https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD
		[priceResp/*, yesterdayPriceResp*/] = await Promise.all([
			fetch("https://min-api.cryptocompare.com/data/price?fsym=" + currencyFrom + "&tsyms=" + currencyTo /*+ "&e=Coinbase"*/, {cache: "no-store"})
		]);

		return await priceResp.json();
	},
	updateBadge = async function( currencyFrom, currencyTo, newValue )
	{
		var priceResponse = await getPriceFromTo( currencyFrom, currencyTo );

		setBadge( priceResponse[currencyTo], currencyFrom, currencyTo, newValue );
	},
	setBadge = function( price, currencyFrom, currencyTo, newValue )
	{
		var priceResponseTemp = price.toFixed(0).toString(),
			priceResponseTempLen = priceResponseTemp.length,
			colorBadge = colorStart,
			titleBadge =
`  Precio ${currencyFrom} ahora:
${price} ${currencyTo}  `;

		if( !!newValue )
		{
			colorBadge = colorStart;
		}
		else if( pricePrevious < price )
		{
			colorBadge = colorIncreasing;
		}
		else if( pricePrevious > price)
		{
			colorBadge = colorDecreasing;
		}
		pricePrevious = price;

		if( price < 48 )
		{
			/*chrome.notifications.create('alarm-price-test',
			{
				title: '¡Alarma de precio!',
				message: 'aaaaaa',
				iconUrl: 'icon-48.png',
				type: 'basic',
			});*/
		}

		// chrome.runtime.sendMessage(
		// {
		//     type: 'alarm-price',
		//     price: price,
		//     method: 'decrease',
		//     currentFrom: 'LTC',
		// 	currentTo: 'EUR'
		// });

		// priceResponseTemp = '14350';
		// priceResponseTempLen = 5;

		// Chrome's Badge max 4 characters:
		if( priceResponseTempLen < 4  )
		{
			price = price.toFixed(4-priceResponseTempLen).toString();
		}
		else if( priceResponseTempLen > 4 )
		{
			price = abbrNumber( priceResponseTemp, 1 );
		}
		else
		{
			price = priceResponseTemp;
			// price = abbrNumber( priceResponseTemp, 2 );
		}

		chrome.browserAction.setBadgeText({ text: price });
		chrome.browserAction.setBadgeBackgroundColor({ color: colorBadge });
		chrome.browserAction.setTitle({ title: titleBadge });
	};

updateBadge(
	localStorage.getItem('change-crypto') || btc,
	localStorage.getItem('change-currency') || usd, true
);


createMenus();


chrome.alarms.create('crypto-currency-icon-badge', {periodInMinutes: 1});
chrome.alarms.onAlarm.addListener(function()
{
	updateBadge(
		localStorage.getItem('change-crypto') || btc,
		localStorage.getItem('change-currency') || usd, false
	);
});


chrome.browserAction.onClicked.addListener(function () {
    chrome.tabs.create({ url: chrome.runtime.getURL("index.html") });
});


chrome.runtime.onMessage.addListener(function(request, sender, callback)
{
    if (request.type == 'change-crypto')
    {
        callback( updateBadge(request.currentFrom, request.currentTo, true) );
    }
    else if (request.type == 'change-currency')
    {
    	callback( updateBadge(request.currentFrom, request.currentTo, true) );
    }
});