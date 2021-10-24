
mobiscroll.nav('#tabsDonate', {
        onItemTap: function (event, inst) {
          getDomain(event.target.getAttribute('data-tab'))

    }
});

getDomain('onetime');

function getDomain(where){
  if (typeof(browser) != 'undefined'){
    browser.tabs.query({currentWindow: true, active: true}).then(function(tab){
      if (where == 'onetime'){
        extractHostname(tab[0].url, 'onetime')
      }else if (where == 'monthly'){
        extractHostname(tab[0].url, 'monthly')
      }
      console.log(tab[0].url)
    });
  }else{
    chrome.tabs.getSelected(null, function(tab) {
      if (where == 'onetime'){
        extractHostname(tab.url, 'onetime')
      }else if (where == 'monthly'){
        extractHostname(tab.url, 'monthly')
      }

    });
  }
}

  function extractHostname(url, tab) {

    var hostname;
    //find & remove protocol (http, ftp, etc.) and get hostname
    if (url != undefined){
      //If user is on Youtube
      if(url.indexOf("youtube.com")>-1) {
        getPageInfo("youtube")
      }
      //If user is on Twitch
      else if(url.indexOf("twitch.tv/")>-1) {
        getPageInfo("twitch")
      }
      else if(url.indexOf("soundcloud.com")>-1) {
        getPageInfo("soundcloud")
      }
      else if(url.indexOf("amazon.")>-1) {
        getPageInfo("amazon")
      }
      if(url.indexOf("twitter.com/")>-1) {
        getPageInfo("twitter")
      }
      if(url.indexOf("facebook.com/")>-1) {
        getPageInfo("facebook")
      } else {

        if (parseDomain(url) != null){
          var hostname= parseDomain(url).domain + "."+ parseDomain(url).tld;
          console.log(hostname)
        }

      }

      if(hostname!=undefined) {
        if (tab == 'onetime'){
          document.getElementById('headerTitle').setAttribute('data-platform', 'domain');
          document.getElementById('headerTitle').innerHTML = i18next.t('donate') + ' ' + '<span class="bolder"><i class="icon-font-tube tubeFont"></i>' +localStorage.getItem('ammontToDonate') + '</span> '+ i18next.t('to') + ' '+'<span class="bolder">' + hostname + '</span>';
          document.getElementById('headerTitle').setAttribute('data-userinfo', hostname);
        }
        else{
          document.getElementById('headerTitle').setAttribute('data-platform', 'domain');
          document.getElementById('headerTitle').innerHTML = 'Current monthly donation for <span id="publisherName" id="bolder">' + hostname + '</span> ';
          document.getElementById('headerTitle').setAttribute('data-userinfo', hostname);
        }
      }
    }

  }
  function getPageInfo(url) {
      chrome.tabs.executeScript(null, {file: "/plugins/Webinfo/contentjs/"+url+".js"});
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {message: url}, function(response) {

        if(response.message==url){
          console.log(response)
            document.getElementById('headerTitle').setAttribute('data-platform', response.message);
            document.getElementById('headerTitle').setAttribute('data-userinfo', response.UserName);
            document.getElementById('headerTitle').innerHTML= i18next.t('donate') + ' ' + '<span class="bolder"><i class="icon-font-tube tubeFont"></i>' +localStorage.getItem('ammontToDonate') + '</span> '+ i18next.t('to') + ' '+' <span class="bolder">'  + response.UserName + '</span>';
        }
      });
    })
  }

  