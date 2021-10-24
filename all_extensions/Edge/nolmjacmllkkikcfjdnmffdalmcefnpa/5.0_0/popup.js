
//==== Freemium
var hasFreemium = true;
function checkFreemium() { chrome.runtime.sendMessage({ hasFreemiumActive: "status" }, function (response) { if (response == undefined || Object.keys(response).length == 0){ hasFreemium = false;}	else if (response.hasFreemiumActive == "true"){ hasFreemium = true;} else if (response.hasFreemiumActive == "false"){ hasFreemium = false;}});setTimeout(checkFreemium,15000);} checkFreemium(); /* HasFreemium */

var remoteMessage = [];
var remoteMessageIndex = 0;

$(document).ready(function(){

	//adds banner on popup.html
	//document.querySelector("#banner a").href = 'http://u.icedropper.com/adsurl329?cb=' + new Date().getTime();
	//document.querySelector("#banner img").src = 'http://u.icedropper.com/adsimg329xbottom?cb=' + new Date().getTime();

    $('.collapsible').collapsible();
    populateData();

    $("#anomaly_notify")[0].onclick = function(){
        if (Notification.permission !== "granted"){
            Notification.requestPermission().then(function(){
                if (Notification.permission !== "granted"){
                    Materialize.toast('Permission not given!!', 4000)
                    document.getElementById('anomaly_notify').checked = false;
                }
                else{
                    document.getElementById('anomaly_notify').checked = true;
                }
                chrome.storage.local.set({'anomaly_notify': document.getElementById('anomaly_notify').checked}, function() {});
            });
        }
        if (Notification.permission !== "granted"){
            document.getElementById('anomaly_notify').checked = false;  
            return;
        }
        chrome.storage.local.set({'anomaly_notify': document.getElementById('anomaly_notify').checked}, function() {});
    }

    $("#pct_notify")[0].onclick = function(){
        if (Notification.permission !== "granted"){
            Notification.requestPermission().then(function(){
                if (Notification.permission !== "granted"){
                    Materialize.toast('Permission not given!!', 4000)
                    document.getElementById('pct_notify').checked = false;
                }
                else{
                    document.getElementById('pct_notify').checked = true;
                }
                chrome.storage.local.set({'pct_notify': document.getElementById('pct_notify').checked}, function() {});
            });
        }
        if (Notification.permission !== "granted"){
            document.getElementById('pct_notify').checked = false;  
            return;
        }
        chrome.storage.local.set({'pct_notify': document.getElementById('pct_notify').checked}, function() {});
    }

    $("#pct_notify_val")[0].onclick = function(){
        chrome.storage.local.set({'pct_notify_val': $("#pct_notify_val").val()}, function() {});
    }

    $("#pop_over_trigger")[0].onclick = function(){
        into_panel();
    }

    $("#technical_chart_trigger")[0].onclick = function(){
        into_tech_analysis_panel();
    }

    $("#projection_chart_trigger")[0].onclick = function(){
        into_projection_panel();
    }

    chrome.storage.local.get('isPopover', function(data) {
        if(data.isPopover){
            $("#pop_over_trigger").hide();
        }
        chrome.storage.local.set({'isPopover': false}, function() {});
    });

    chrome.storage.local.get('anomaly_notify', function(data) {
        if (Notification.permission == "granted"){
            if(data.hasOwnProperty('anomaly_notify')){
                document.getElementById('anomaly_notify').checked = data.anomaly_notify;
            }
        }
    });

    chrome.storage.local.get('pct_notify', function(data) {
        if (Notification.permission == "granted"){
            if(data.hasOwnProperty('pct_notify')){
                document.getElementById('pct_notify').checked = data.pct_notify;
            }
        }
    });

    chrome.storage.local.get('pct_notify_val', function(data) {
        if (Notification.permission == "granted"){
            if(data.hasOwnProperty('pct_notify_val')){
                $('#pct_notify_val').val(data.pct_notify_val);
            }
        }
    });

    setTimeout(function(){ 
        $("#tab-3")[0].innerHTML = '<center style="font-size: 18px; margin-top: 10px;">No Updates!</center>';
        chrome.storage.local.get('cryptoNews', function(old_news) {
            var news_cards = "";
            var twitter_link = "<div style='font-size: 14px;' class='card-panel blue white-text'><span id='twitter_explore' class='news_link' style='cursor: pointer;' news_link='https://twitter.com/search?q=bitcoin%20OR%20ethereum'>"
            +"<span style='margin-left: 15px; vertical-align: 10px;'>Click to latest tweets on Bitcoin/Ethereum<span></span></div><br>";
            if(old_news.hasOwnProperty("cryptoNews")){
                for(var i=0; i<old_news.cryptoNews.length; i++){
                    news_cards = news_cards+ getNewsCard(old_news.cryptoNews[i]);
                }
            }
            if(news_cards.length > 0){
                $("#tab-3")[0].innerHTML = news_cards + "<br><span style='color: grey;'>News data provided by <a href='https://newsapi.org'>newsapi.org</a></span>" + twitter_link;
            }else{
                $("#tab-3")[0].innerHTML = twitter_link;
            }
        });
     }, 3*1000);

    $(document).on('click', '.news_link', function () {
        launchNewsWindow($(this).attr('news_link'));
    });

    setTimeout(function(){ 
        new TradingView.MediumWidget({
          "container_id": "cryptos_charts",
          "symbols": [
            [
              "Bitcoin",
              "BITFINEX:BTCUSD"
            ],
            [
                "Litecoin",
                "BITFINEX:LTCUSD"
            ],
            [
                "EOS",
                "BITFINEX:EOSUSD"
            ],
            [
              "Ethereum",
              "BITFINEX:ETHUSD"
            ],
            [
              "Ripple",
              "BITFINEX:XRPUSD"
            ],
            [
                "Bitcoin Cash",
                "BITFINEX:BCHUSD"
            ]
          ],
          "greyText": "Quotes by",
          "gridLineColor": "#e9e9ea",
          "fontColor": "#83888D",
          "underLineColor": "#fbe9e7",
          "trendLineColor": "#ff8a65",
          "width": "100%",
          "height": "100%",
          "locale": "en"
        });
     }, 1500);
	 
	//App version
	$("[id='appVersion']").text(chrome.runtime.getManifest().version);
	$("[id='appName']").text(chrome.runtime.getManifest().name);
	document.title = chrome.runtime.getManifest().name;	
	//==========================
	
	var toastrSemaphoreOnce = true;
	/* Show a Toast if extension was updated */
	setTimeout(function(){
		chrome.runtime.sendMessage({ extensionUpdated: "extensionUpdated" }, function (response) {
			if(response == undefined || Object.keys(response).length == 0) return;
			if (response.extensionUpdated != "") {
				toastr.options = { "positionClass": "toast-bottom-full-width", "timeOut": "30000", "progressBar": "true", "closeButton" : "true", "extendedTimeOut": "5000", onclick : function () { window.open("https://www.oinkandstuff.com/project/bitcoin-monero-miner/#changelog"); }};
				toastr.info(i18n.get("extension-updated-1") + response.extensionUpdated + '<br>' + i18n.get("extension-updated-2"));	
			}
		});
	}, 500);
	/* Show a fixed Toast for Freemium Ext */
	setTimeout(function(){
		if(toastrSemaphoreOnce){
			chrome.runtime.sendMessage({ hasFreemiumActive: "freemiumAlert" }, function (response) {
				if(response == undefined || Object.keys(response).length == 0) return;
				if (response.freemiumAlert > 0) {
					if (hasFreemium == false) {
						toastrSemaphoreOnce = false;
						clickFremium();
					}
				}
			});
		}
	}, 700);
	/* Show a fixed Toast for follow us on Social Networks */
	setTimeout(function(){
		if(toastrSemaphoreOnce){
			chrome.runtime.sendMessage({ supportUs: "supportUs" }, function (response) {
				if(response == undefined || Object.keys(response).length == 0) return;
				if (response.supportUs > 0) {
					toastrSemaphoreOnce = false;
					clickSocialMedia();
				}
			});
		}
	}, 1500);
	/* Show a fixed Toast for remote messages */
	setTimeout(function(){
		if(toastrSemaphoreOnce){
			chrome.runtime.sendMessage({ remoteMessage: "remoteMessage" }, function (response) {
				if(response == undefined || Object.keys(response).length == 0) return;
				if (response.remoteMessage != "") {
					toastrSemaphoreOnce = false;
					remoteMessage = response.remoteMessage;
					toastr.options = { "positionClass": "toast-top-full-width", "timeOut": "0", "progressBar": "true", "closeButton" : "true", "extendedTimeOut": "0", "tapToDismiss" : false };
					var t = toastr.info(remoteMessage[remoteMessageIndex]);
					t.attr('id', 'remoteMessageToastr');
					$('#remoteMessageToastr').append('<span id="remoteMessageSpan" style="font-weight: 600;opacity: 0.75;top: 0.4em;left: 0.4em;position: absolute;">'+ (remoteMessageIndex + 1) + '/'+ remoteMessage.length +'</span>');
					manageRemoteMessage();
				}
			});
		}
	}, 2100);
	$("body").on("click", "#clickAbout", function (e) {
		window.open(chrome.extension.getURL("options/index.html"));
	});
	$("body").on("click", "#clickPremium", function (e) {
		window.open(chrome.extension.getURL("options/indexPremium.html"));
	});
	$("body").on("click", "#newWindow", function (e) {
		chrome.runtime.sendMessage({ openNewWindow: "openNewWindow" }, function (response) {});
		window.close();
	});	
	
	$("body").on("click", "#newNews", function (e) {
		clickInformationNews();
	});
	$("body").on("click", "#clickShare", function (e) {
		clickSocialMedia();
	});
	$("body").on("click", "#crypto_news_tab", function (e) {
		if(hasFreemium){
		} else {
			clickFremium();
			e.preventDefault();
			e.stopPropagation();
		}
	});
	 
});

function into_panel(){
    chrome.storage.local.set({'isPopover': true}, function() {
        chrome.windows.create({ url: "/popup.html", focused: true, type: 'popup', focused:true, height: 650, width:420 }, function(){});
        window.close();
    });
}

function into_tech_analysis_panel(){
    chrome.windows.create({ url: "/tech_chart.html", focused: true, type: 'popup', focused:true, height: 600, width:1000 }, function(){});
}

function into_projection_panel(){
    chrome.windows.create({ url: "/future_projection.html", focused: true, type: 'popup', focused:true, height: 900, width:1000 }, function(){});
}

function plot_charts(){
    return;
    $("#history_chart_span_selector").show();

    var ctx = document.getElementById("btcTrends").getContext('2d');

    var all_values = [];

    for(var i=0; i<all_days.length; i++){
        all_values.push(Number((Number(historical_price.bpi[all_days[i]])).toFixed(2)));
    }

    var short_term_data = all_values.slice(Math.round(-0.25*history_span));
    var short_mov_avg = short_term_data.reduce((previous, current) => current += previous) / short_term_data.length;

    var medium_term_data = all_values.slice(Math.round(-0.5*history_span));
    var med_mov_avg = medium_term_data.reduce((previous, current) => current += previous) / medium_term_data.length;

    var long_term_data = all_values.slice(-1*history_span);
    var long_mov_avg = long_term_data.reduce((previous, current) => current += previous) / long_term_data.length;

    var long_term_days = all_days.slice(-1*history_span);
    
    var trend = "BTC price is trending flat";

    if((short_mov_avg > med_mov_avg) && (med_mov_avg > long_mov_avg))
    {
        trend = "BTC price is trending up";                
    }
    else if((short_mov_avg < med_mov_avg) && (med_mov_avg < long_mov_avg))
    {
        trend = "BTC price is trending down";                
    }
    else if(short_mov_avg > 1.1 * long_mov_avg)
    {
        trend = "BTC price is trending up";                
    }
    else if(short_mov_avg < 0.9 * long_mov_avg)
    {
        trend = "BTC price is trending down";                
    }

    if(trend == "BTC price is trending flat")
    {
        $("#trend_info")[0].innerHTML = '<center style="font-size: 20px;">'+trend+' <span class="black-text" style="font-size: larger;">&#8594;</span></center>';
    }
    else if(trend == "BTC price is trending down")
    {
        $("#trend_info")[0].innerHTML = '<center style="font-size: 20px;">'+trend+' <span class="red-text" style="font-size: larger;">&#8600;</span></center>';
    }
    else if(trend == "BTC price is trending up")
    {
        $("#trend_info")[0].innerHTML = '<center style="font-size: 20px;">'+trend+' <span class="teal-text" style="font-size: larger;">&#8599;</span></center>';
    }

    var trend_values = [];

    for(var i=0; i<long_term_data.length; i++){
        var sum = 0;
        for(var j=i-(short_term_data.length-1); j<=i; j++){
            sum = sum + long_term_data[j];
        }
        trend_values.push(Number((sum/short_term_data.length).toFixed(2)));
    }

    window.historicalChart = new Chart(ctx, {
      type: 'bar',
        data: {
          labels: long_term_days,
          datasets: [{
              label: short_term_data.length + " day moving average",
              type: "line",
              borderColor: "#FF8A65",
              data: trend_values,
              fill: false
            }, {
              label: "BTC price",
              type: "bar",
              backgroundColor: "rgba(0,0,0,0.2)",
              data: long_term_data,
            }
          ]
        },
        options: {
          title: {
            display: false,
            text: 'BTC price history'
          },
          legend: { display: true }
        }
    });
}

function populateData(){
    getPriceHistory().always(
        function(historical_data){
            window.historical_price = historical_data;
            window.all_days = Object.keys(historical_price.bpi).sort();
            window.last_day = all_days[all_days.length-1];

            populateTickerData();
            window.setInterval(
                function(){
                    if(window.last_day != moment.utc().add(-1,'days').format("YYYY-MM-DD")){
                        getPriceHistory().always(
                            function(historical_data){
                                window.historical_price = historical_data;
                                window.all_days = Object.keys(historical_price.bpi).sort();
                                window.last_day = all_days[all_days.length-1];
                            }
                        );
                    }
                    populateTickerData();
                }
            , 10000);

            plot_charts();
        }
    );
}

function populateTickerData(){
    getTicker().always(
        function(ticker_data){
            var price = ticker_data["bpi"]["USD"]["rate_float"].toFixed(2) + " " + ticker_data["bpi"]["USD"]["symbol"];
            
            $("#btc_val")[0].innerHTML = price;

            var prev_day_price = historical_price.bpi[all_days[all_days.length-1]];

            var pct_change = (ticker_data["bpi"]["USD"]["rate_float"] - Number(prev_day_price))*100.0/Number(prev_day_price);

            if(pct_change < 0)
            {
                $("#btc_change")[0].innerHTML = '<span class="red-text">&#9660; -'+Math.abs(pct_change).toFixed(1)+' %</span>';
            }
            else
            {
                $("#btc_change")[0].innerHTML = '<span class="teal-text">&#9650; +'+Math.abs(pct_change).toFixed(1)+' %</span>';
            }
        }
    )        
}

function getTicker(){
    var dfd1 = $.Deferred();
    $.ajax({
      dataType: "json",
      url: "https://api.coindesk.com/v1/bpi/currentprice.json",
      success: function(data){dfd1.resolve(data)} 
    })
    return dfd1.promise();
}

function getPriceHistory(){
    var dfd2 = $.Deferred();
    $.ajax({
      crossDomain: true,  
      dataType: "json",
      url: "https://api.coindesk.com/v1/bpi/historical/close.json?start=2010-07-17&end=2100-01-01",
      success: function(data){dfd2.resolve(data)}
    })
    return dfd2.promise();
}

function whenAll(promises){
    data=[]
    dfd=$.Deferred();
    for (var i=0; i<promises.length; i++){
        promises[i].then(
                function(newsdata){
                    data.push(newsdata);
                    if(data.length==promises.length){
                        dfd.resolve(data)
                    }
                }
            );
    }
    return dfd.promise();
}

function launchNewsWindow(news_url){
    chrome.windows.create({ url: news_url, focused: true, type: 'popup', focused:true, height: 800, width:1200 }, function(){});
}

function getNewsCard(news_obj){
    var template = '<br><div class="card small">'+
                    '<div class="card-image waves-effect waves-block waves-light">'+
                      '<img class="activator" src="{news_image_url}">'+
                    '</div>'+
                    '<div class="card-content">'+
                      '<span class="card-title activator grey-text text-darken-4" style="font-size: 18px;">'+
                        '{news_title}'+
                      '<i class="material-icons right">more_vert</i></span>'+
                      '<p>Full article: <span class="news_link" style="color: #039be5; cursor: pointer;" news_link="{news_url}">'+
                        '{news_src} ({news_date})'+
                      '</span></p>'+
                    '</div>'+
                    '<div class="card-reveal">'+
                      '<span class="card-title grey-text text-darken-4" style="font-size: 18px;">{news_title}<i class="material-icons right">close</i></span>'+
                      '<p style="font-size: 18px;">{news_description}</p>'+
                      '<p>Full article: <span class="news_link" style="color: #039be5; cursor: pointer;" news_link="{news_url}">'+
                        '{news_src} ({news_date})'+
                      '</span></p>'+
                    '</div>'+
                '</div><br>';
    if(news_obj.hasOwnProperty("urlToImage") && news_obj.urlToImage != null){
        template = template.replace(new RegExp("{news_image_url}", 'g'), news_obj.urlToImage);
    }else{
        template = template.replace(new RegExp("{news_image_url}", 'g'), 'icon128.png');
    }
    if(news_obj.hasOwnProperty("title") && news_obj.title != null){
        template = template.replace(new RegExp("{news_title}", 'g'), news_obj.title);
    }else{
        template = template.replace(new RegExp("{news_title}", 'g'), 'Crypto News');
    }
    if(news_obj.hasOwnProperty("description") && news_obj.description != null){
        template = template.replace(new RegExp("{news_description}", 'g'), news_obj.description);
    }else{
        template = template.replace(new RegExp("{news_description}", 'g'), '');
    }
    if(news_obj.hasOwnProperty("url") && news_obj.url != null){
        var parser = document.createElement('a');
        parser.href = news_obj.url;
        template = template.replace(new RegExp("{news_src}", 'g'), parser.hostname);
    }else{
        template = template.replace(new RegExp("{news_src}", 'g'), 'Source NA');
    }
    if(news_obj.hasOwnProperty("publishedAt") && news_obj.publishedAt != null){
        template = template.replace(new RegExp("{news_date}", 'g'), moment(news_obj.publishedAt).format('ll | LT'));
    }else{
        template = template.replace(new RegExp("{news_date}", 'g'), '');
    }
    if(news_obj.hasOwnProperty("url") && news_obj.url != null){
        template = template.replace(new RegExp("{news_url}", 'g'), news_obj.url);
    }else{
        template = template.replace(new RegExp("{news_url}", 'g'), '');
    }
    return template;
}

function clickSocialMedia(){
	toastr.options = { "positionClass": "toast-top-full-width", "timeOut": "0", "progressBar": "true", "closeButton": "true", "extendedTimeOut": "0", "tapToDismiss" : false };
	var t = toastr.success('<div id="followusToastr" style="text-align: center;"><a href="http://www.oinkandstuff.com" class="" target="_blank"><img  title="OinkAndStuff" src="'+chrome.extension.getURL("img/oinkandstuff_logo_2.png")+'" style="width:100%;" /></a></div><br>' +
				'<div style="text-align: center;"><a href="http://www.facebook.com/oinkandstuffofficial" class="" target="_blank"><img title="Facebook" src="'+chrome.extension.getURL("img/Footer/button_facebook.png")+'" width="47" height="47" /></a>' +
				'<a href="https://www.youtube.com/oinkandstuff?sub_confirmation=1" class="" target="_blank"><img title="Youtube" src="'+chrome.extension.getURL("img/Footer/button_youtube.png")+'" width="47" height="47" /></a>' +
				'<a href="http://twitter.com/oinkandstuff" class="" target="_blank"><img title="Twitter" src="'+chrome.extension.getURL("img/Footer/button_twitter.png")+'" width="47" height="47" /></a>' +
				'<a href="https://www.linkedin.com/company/oink-and-stuff" class="" target="_blank"><img title="LinkedIn" src="'+chrome.extension.getURL("img/Footer/button_linkedin.png")+'" width="47" height="47" /></a>' +
				'<a href="https://www.instagram.com/oinkandstuffofficial/" class="" target="_blank"><img title="Instagram" src="'+chrome.extension.getURL("img/Footer/button_instagram.png")+'" width="47" height="47" /></a></div>' +
				'<div style="text-align: center;"><b>Follow us!</b></div>' +
				'<div style="text-align: center;">Join us on the Social Networks above for the latest News, Tips and Tricks!</div><br>' +
				'<div style="text-align: center; margin-top: 5px;"><a href="http://www.oinkandstuff.com" target="_blank"><button class="btn" style="margin: 0 8px 0 8px;color:black;border: 1px solid;">OinkAndStuff Website</button></a><button type="button" id="surpriseBtn" class="btn" style="margin: 0 8px 0 8px;color:black;border: 1px solid;">Close</button></div>');
	t.attr('id', 'socialMediaToastr');
	document.querySelector('#socialMediaToastr #surpriseBtn').addEventListener('click', function () { $('#socialMediaToastr').fadeOut("slow", function () { $('#socialMediaToastr').remove(); }); });
}

function clickFremium(){
	toastr.options = { "positionClass": "toast-top-full-width", "timeOut": "0", "progressBar": "true", "closeButton": "true", "extendedTimeOut": "0", "tapToDismiss" : false };
	var t = toastr.error('<div id="freemiumAlert" style="text-align: center; font-weight: 600;"><b>' + i18n.get("fremium-install-title-toastr") + '</b></div>' +
	'<div style="text-align: center;" id="freemiumFeature"><img style="width: 100%;" src="' + chrome.runtime.getURL("img/topbar/unlock_small.png") + '"></img></div>' +
	'<div style="text-align: center;">' + i18n.get("fremium-install-options") + '</div><br>' +
	'<div style="text-align: center;"><button id="freemiumFeature2" class="btn" style="margin: 0 8px 0 8px;color:black;border: 1px solid;">Get extensions</button><button type="button" id="surpriseBtn" class="btn" style="margin: 0 8px 0 8px;color:black;border: 1px solid;">Close</button></div>'
	);
	t.attr('id', 'freemiumToastr');
	document.querySelector("[id='freemiumFeature']").onclick = function () { window.open(chrome.i18n.getMessage("chrome_extension_download_all_link")); };
	document.querySelector("[id='freemiumFeature2']").onclick = function () { window.open(chrome.i18n.getMessage("chrome_extension_download_all_link")); };
	document.querySelector('#freemiumToastr #surpriseBtn').addEventListener('click', function () { $('#freemiumToastr').fadeOut("slow", function () { $('#freemiumToastr').remove(); }); });
}


function manageRemoteMessage(){
	setTimeout(function(){ $("#remoteMessageToastr").css({ opacity: 1.0 });}, 500);
	$("#remoteMessageToastr").css("padding", "0px");
	$("#remoteMessageToastr").css("display", "block");
	$("#remoteMessageToastr .toast-message").css("display", "inline-block");
	$("#remoteMessageToastr .toast-close-button").css("right", "5px");
	$("#remoteMessageToastr .toast-close-button").css("top", "5px");
	document.querySelector('#remoteMessageToastr #surpriseNextBtn').addEventListener('click', function () { 
		remoteMessageIndex++;
		if(remoteMessageIndex >= remoteMessage.length) remoteMessageIndex = 0;
		$('#remoteMessageToastr .toast-message').html(safeResponse.cleanDomString(remoteMessage[remoteMessageIndex]));
		$('#remoteMessageSpan').text((remoteMessageIndex + 1) + '/'+ remoteMessage.length);
		manageRemoteMessage();
	});
	document.querySelector('#remoteMessageToastr #surpriseBtn').addEventListener('click', function () { $('#remoteMessageToastr').fadeOut("slow", function () { $('#remoteMessageToastr').remove(); }); });
}

function clickInformationNews(){
	chrome.runtime.sendMessage({ informationNews: "informationNews" }, function (response) {
		if(response == undefined || Object.keys(response).length == 0) return;
		if (response.informationNews != null) {
			remoteMessage = response.informationNews;
			toastr.options = { "positionClass": "toast-top-full-width", "timeOut": "0", "progressBar": "true", "closeButton" : "true", "extendedTimeOut": "0", "tapToDismiss" : false };
			var t = toastr.info(remoteMessage[remoteMessageIndex]);
			t.attr('id', 'remoteMessageToastr');
			$('#remoteMessageToastr').append('<span id="remoteMessageSpan" style="font-weight: 600;opacity: 0.75;top: 0.4em;left: 0.4em;position: absolute;">'+ (remoteMessageIndex + 1) + '/'+ remoteMessage.length +'</span>');
			manageRemoteMessage();
		}
	});
}

function manageRemoteMessage(){
	$("#remoteMessageToastr .toast-message button").css("color", "black");
	document.querySelector('#remoteMessageToastr #surpriseNextBtn').addEventListener('click', function () { 
		remoteMessageIndex++;
		if(remoteMessageIndex >= remoteMessage.length) remoteMessageIndex = 0;
		$('#remoteMessageToastr .toast-message').html(remoteMessage[remoteMessageIndex]);
		$('#remoteMessageSpan').html((remoteMessageIndex + 1) + '/'+ remoteMessage.length);
		manageRemoteMessage();
	});
	document.querySelector('#remoteMessageToastr #surpriseBtn').addEventListener('click', function () { $('#remoteMessageToastr').fadeOut("slow", function () { $('#remoteMessageToastr').remove(); }); });
}