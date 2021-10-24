$( document ).ready(function()
{
	// https://co-in.io/crypto-price-widget/
	// https://es.cointelegraph.com/price-indexes

	// LINK TO https://coinmarketcap.com/

	// https://coinlib.io/widgets

	// https://api.coingecko.com/api/v3/coins/markets?vs_currency=EUR&order=market_cap_desc&per_page=100&page=1&sparkline=false

    var theme = 'light',
    	srcBTC = 'https://widget.coinlib.io/widget?type=chart&theme='+theme+'&coin_id=859',
    	srcBCH = 'https://widget.coinlib.io/widget?type=chart&theme='+theme+'&coin_id=157',
    	srcBSV = 'https://widget.coinlib.io/widget?type=chart&theme='+theme+'&coin_id=1510485',
		srcETH = 'https://widget.coinlib.io/widget?type=chart&theme='+theme+'&coin_id=145',
		srcLTC = 'https://widget.coinlib.io/widget?type=chart&theme='+theme+'&coin_id=359',
		srcXRP = 'https://widget.coinlib.io/widget?type=chart&theme='+theme+'&coin_id=619',
		srcUSDT = 'https://widget.coinlib.io/widget?type=chart&theme='+theme+'&coin_id=637',
		srcBNB = 'https://widget.coinlib.io/widget?type=chart&theme='+theme+'&coin_id=1209',
		srcEOS = 'https://widget.coinlib.io/widget?type=chart&theme='+theme+'&coin_id=585',
		srcXTZ = 'https://widget.coinlib.io/widget?type=chart&theme='+theme+'&coin_id=986',
		srcXLM = 'https://widget.coinlib.io/widget?type=chart&theme='+theme+'&coin_id=489',
		srcCryptoList = 'https://widget.coinlib.io/widget?type=full_v2&theme='+theme+'&cnt=10&graph=yes',
		currencyArray = {
			EUR: '1506',
			USD: '1505',
			GBP: '1508',
			AUD: '1528',
			JPY: '1509',
			CNY: '1519',
			RUB: '1525',
		},
		currentCurrency,
		$containerDetail = $( '#crypto-detail' ),
		$containerList = $( '#crypto-list' ),
		body = document.body,
		timerScroll,
		timerLazyLoad,
		createIframeDetail = function( url, currency )
		{
			// loading="lazy"
			$containerDetail.append('<iframe loading="lazy" class="iframe iframe-detail lazy-loading" data-src="'+url+'&pref_coin_id='+currency+'" src="" height="536px"></iframe>');
		},
		createIframeList = function( url, currency )
		{
			$containerList.append('<iframe loading="lazy" class="iframe iframe-list" src="'+url+'&pref_coin_id='+currency+'" height="645px"></iframe>');
		},
		setList = function()
		{
			if( $containerList.is(':empty') )
			{
				createIframeList( srcCryptoList, currentCurrency );
			}

			$containerList.removeClass('hidden');
			if( !$containerDetail.hasClass('hidden') )
			{
				$containerDetail.addClass('hidden');
			}
			// $containerDetail.html('');
		},
		setDetail = function()
		{
			if( $containerDetail.is(':empty') )
			{
				createIframeDetail( srcXLM, currentCurrency );
				createIframeDetail( srcLTC, currentCurrency );

				createIframeDetail( srcBTC, currentCurrency );
				createIframeDetail( srcBCH, currentCurrency );
				createIframeDetail( srcBSV, currentCurrency );
				createIframeDetail( srcETH, currentCurrency );
				// createIframeDetail( srcLTC, currentCurrency );
				createIframeDetail( srcXRP, currentCurrency );
				createIframeDetail( srcUSDT, currentCurrency );
				// createIframeDetail( srcXLM, currentCurrency );
				createIframeDetail( srcBNB, currentCurrency );
				createIframeDetail( srcEOS, currentCurrency );
				createIframeDetail( srcXTZ, currentCurrency );
			}

			$containerDetail.removeClass('hidden');
			if( !$containerList.hasClass('hidden') )
			{
				$containerList.addClass('hidden');
			}
			// $containerList.html('');
		},
		lazyLoadIframes = function()
		{
		  $('iframe.lazy-loading').each(function() {
		    var frame = $(this),
		        vidSource = $(frame).attr('data-src'),
		        distance = $(frame).offset().top - $(window).scrollTop(),
		        distTopBot = window.innerHeight - distance,
		        distBotTop = distance + $(frame).height();

		        // console.log( distTopBot, distBotTop, window.innerHeight, $(window).height() );

		    if (distTopBot >= 0 && distBotTop >= 0) { // if frame is partly in view
		    	$(frame).attr('src', vidSource);
				$(frame).removeAttr('data-src');
		    }
		  });
		};

	if( localStorage.getItem('change-currency') in currencyArray )
	{
		currentCurrency = currencyArray[localStorage.getItem('change-currency')];
	}
	else
	{
		currentCurrency = currencyArray.USD;
	}

	window.addEventListener('scroll', function() {
		// Improve performance on scroll: https://gist.github.com/LouisWhit/7751304
		// clearTimeout(timerScroll);
		// if(!body.classList.contains('disable-hover')) {
		// 	body.classList.add('disable-hover')
		// }
		// timerScroll = setTimeout(function(){
		// 	body.classList.remove('disable-hover')
		// },500);

		// Lazy Load Iframes:
		clearTimeout(timerLazyLoad);
		timerLazyLoad = setTimeout(function(){
			lazyLoadIframes();
		},100);

	}, false);

	setTimeout(lazyLoadIframes, 1);

	$('#change-info')
	.val( localStorage.getItem('change-info') || 'list' )
	.on('change', function()
	{
		localStorage.setItem('change-info', this.value);

		if( this.value === 'list' )
		{
			setList();
		}
		else setDetail();
	});

	if( localStorage.getItem( 'change-info' ) === 'list' || !localStorage.getItem( 'change-info' ) )
	{
		setList();
	}
	else setDetail();


	$('#change-crypto')
	.val( localStorage.getItem('change-crypto') || 'BTC' )
	.on('change', function()
	{
		localStorage.setItem('change-crypto', this.value);
		chrome.runtime.sendMessage(
		{
		    type: 'change-crypto',
		    currentFrom: this.value,
		    currentTo: localStorage.getItem('change-currency') || 'USD',
		});
	});

	$('#change-currency')
	.val( localStorage.getItem('change-currency') || 'USD' )
	.on('change', function()
	{
		localStorage.setItem('change-currency', this.value);
		chrome.runtime.sendMessage(
		{
		    type: 'change-currency',
		    currentFrom: localStorage.getItem('change-crypto') || 'BTC',
		    currentTo: this.value
		});
	});

/*	$('.right')
	.on('hover', function()
	{
		$('.ducky').addClass('turn-up');
		$('.ducky').removeClass('turn-down')
		// $('.ducky').removeClass('floating');
	})
	.on('mouseleave', function()
	{
		// $('.ducky').removeClass('turn-up');
		// $('.ducky').addClass('floating');
	});

	$('.left')
	.on('hover', function()
	{
		$('.ducky').addClass('turn-down');
		$('.ducky').removeClass('turn-up')
		// $('.ducky').removeClass('floating');
	})
	.on('mouseleave', function()
	{
		// $('.ducky').removeClass('turn-down');
		// $('.ducky').addClass('floating');
	});*/
});

$('.ducky').click(function(e)
{
	e.preventDefault();

	var win = window.open('https://www.coinbase.com/join/aja_w', '_blank');
 	win.focus();
})



document.querySelectorAll('[data-locale]').forEach(function(elem)
{
	elem.innerText = chrome.i18n.getMessage(elem.dataset.locale);
})
document.querySelectorAll('[data-locale-t]').forEach(function(elem)
{
	elem.title = chrome.i18n.getMessage(elem.dataset.localeT);
})

document.title = chrome.i18n.getMessage('appName');


// CREATE ALARM
// LTC a EUR
// RISES 42

$('.ducky').click(function(e)
{
	e.preventDefault();

	// localStorage.setItem('alarm-LTC-EUR-42', JSON.stringify( {
	// 	currentFrom: 'LTC',
	// 	currentTo: 'EUR',
	// 	value: '42',
	// 	method: 'decrease'
	// } ) );
});
$('.ducky').hover(function(e)
{
	// chrome.runtime.sendMessage(
	// {
	//     type: 'alarm-price',
	//     price: '100',
	//     method: 'decrease',
	//     currentFrom: 'LTC',
	// 	currentTo: 'EUR'
	// });
	// chrome.notifications.create('alarm-price-test',
	// {
	// 	title: '¡Alarma de precio!',
	// 	message: 'aaaaaa',
	// 	iconUrl: 'icon-48.png',
	// 	type: 'basic',
	// });
})

// var alarms = JSON.parse( localStorage.getItem('alarm-LTC-EUR-42') );
var alarms = {
	value: '99',
	currentTo: 'EURRR'
}

// console.log( alarms );

chrome.runtime.onMessage.addListener(function(request, sender, callback)
{
    if (request.type == 'alarm-price')
    {
        console.log( request.price );
  //  		if(request.price > alarms.value)
		// {

			chrome.notifications.create('alarm-price-test',
			{
				title: '¡Alarma de precio!',
				message: alarms.currentFrom + ' ha alcanzado el valor de ' + alarms.value + ' ' + alarms.currentTo + '.',
				iconUrl: 'icon-48.png',
				type: 'basic',
			});

			// chrome.notifications.clear('alarm-price-test', function(wasCleared)
			// {
			// 	console.log( 'Deleted' );
			// });
		// }
    }
});