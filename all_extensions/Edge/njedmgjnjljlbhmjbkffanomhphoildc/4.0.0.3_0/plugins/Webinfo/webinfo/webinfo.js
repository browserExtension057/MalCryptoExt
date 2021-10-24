getDomain();

function getDomain(){

  if (typeof(browser) != 'undefined'){
    browser.tabs.query({active: true}, function(tab) {
      extractHostname(tab[0].url);
      checkProtocolUrl(tab[0].url);
    });
  }else{
    if (chrome != undefined){
      chrome.tabs.getSelected(null, function(tab) {
        extractHostname(tab.url);
        checkProtocolUrl(tab.url);
      });
    }else{
      getDomain();
    }
  }

  }

  function checkProtocolUrl(url){
    const url_string = new URL(url);
    if (url_string.protocol != 'http:' && url_string.protocol != 'https:'){
      localStorage.removeItem('walletToDonate');
      localStorage.removeItem('ammontToDonate')
      const sectionDonate = document.getElementsByClassName('donateSection');
      for (let i=0; i < sectionDonate.length; i++){
        sectionDonate[i].classList.add('displayNone');
      }

      // const infoAirtimeBottom = document.getElementsByClassName('infoAirtimeBottom');
      // for (let i=0; i < infoAirtimeBottom.length; i++){
      //   infoAirtimeBottom[i].classList.add('marginBottom10');
      // }
    }
  }

  function extractHostname(url) {
    var hostname;
    //find & remove protocol (http, ftp, etc.) and get hostname
    if (url != undefined){
      if(url.indexOf("youtube.com")>-1) {
        getPageInfo("youtube")
      }
      else if(url.indexOf("twitch.tv/")>-1) {
        getPageInfo("twitch")
      }
      else if(url.indexOf("soundcloud.com")>-1) {
        getPageInfo("soundcloud")
      }
      else if(url.indexOf("amazon.")>-1) {
        getPageInfo("amazon")
      }
      else if(url.indexOf("twitter.com/")>-1) {
        getPageInfo("twitter")
      }
      else if(url.indexOf("facebook.com/")>-1) {
        getPageInfo("facebook")
      }

      else {

      if (parseDomain(url) != null ){
        var hostname= parseDomain(url).domain + "."+ parseDomain(url).tld
        console.log(hostname)
      }

        /*
        if (url.indexOf("//") > -1) {
          protocol = url.split('/')[0]+"//";
      }

        if(url.indexOf("//www.") >-1) {
          if(url.split("//www.")[1].indexOf(":") >-1) {
            if(url.split("/www.")[1].split("/")[0].split(".").length>2) {
              var hostname = url.split("/www.")[1].split("/")[0].split(":")[0].split(".")[1] + "." + url.split("/www.")[1].split("/")[0].split(":")[0].split(".")[2]
              console.log(hostname)
            }
            else {
              var hostname = url.split("/www.")[1].split("/")[0].split(":")[0].split(".")[0] + "." + url.split("/www.")[1].split("/")[0].split(":")[0].split(".")[1]
              console.log(hostname)
            }

        }
        else {
          if(url.split("/www.")[1].split("/")[0].split(".").length>2) {
            var hostname = url.split("/www.")[1].split("/")[0].split(".")[1] + "." + url.split("/www.")[1].split("/")[0].split(".")[2]
            console.log(hostname)
          }
          else {
            var hostname = url.split("/www.")[1].split("/")[0].split(".")[0] + "." + url.split("/www.")[1].split("/")[0].split(".")[1]
            console.log(hostname)
          }
        }
      }
        else if(url.indexOf("://") >-1) {
          if(url.split("://")[1].indexOf(":") >-1) {
            if(url.split("://")[1].split("/")[0].split(".").length>2) {
              var hostname = url.split("://")[1].split("/")[0].split(":")[0].split(".")[1] + "." + url.split("://")[1].split("/")[0].split(":")[0].split(".")[2]
              console.log(hostname)
            }
            else {
              var hostname = url.split("://")[1].split("/")[0].split(":")[0].split(".")[0] + "." + url.split("://")[1].split("/")[0].split(":")[0].split(".")[1]
              console.log(hostname)
            }

          }
          else {
            if(url.split("://")[1].split("/")[0].split(".").length>2) {
              var hostname = url.split("://")[1].split("/")[0].split(".")[1] + "." + url.split("://")[1].split("/")[0].split(".")[2]
              console.log(hostname)
            }
            else {
              var hostname = url.split("://")[1].split("/")[0].split(".")[0] + "." + url.split("://")[1].split("/")[0].split(".")[1]
              console.log(hostname)
            }

          }

        }
          else {
            if(url.indexOf(":")>-1) {
              if(url.split("/")[0].split(".").length>2) {
                var hostname = url.split("/")[0].split(":")[0].split(".")[1] + "." + url.split("/")[0].split(":")[0].split(".")[2]
                console.log(hostname)
              }
              else {
                var hostname = url.split("/")[0].split(":")[0].split(".")[0] + "." + url.split("/")[0].split(":")[0].split(".")[1]
                console.log(hostname)
              }

            }
            else {
              if(url.split("/")[0].split(".").length>2) {
                var hostname = url.split("/")[0].split(".")[1] + "." + url.split("/")[0].split(".")[2]
                console.log(hostname)
              }
              else {
                var hostname = url.split("/")[0].split(".")[0] + "." + url.split("/")[0].split(".")[1]
                console.log(hostname)
              }

            }
          }

       */
      }

      if(hostname!=undefined) {
        document.getElementById('spanPublisherName').innerHTML =hostname;

        chrome.runtime.sendMessage({message: "getWallet", username: hostname , domain:'domain'});
      }
    }
  }

  function getPageInfo(url) {
    chrome.tabs.executeScript(null, {file: "/plugins/Webinfo/contentjs/"+url+".js"});
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {message: url}, function(response) {
        if(response!=undefined) {
          if(response.message==url){
            console.log(response)
            // if (url == 'youtube'){
            //   if (response.UserID.indexOf('channel')){
            //     response.UserID = response.UserID.split("/channel/")[1].split("/")[0];
            //   }
            // }
            console.log('GetPAgeInfo')
            console.log(response)
              if(response.UserID != undefined){
                chrome.runtime.sendMessage({message: "getWallet", username: response.UserID , domain:url}, function(responsegetWallet){
                  responsegetWallet.wallet = convertAddress(responsegetWallet.wallet);
                  localStorage.setItem('walletToDonate', responsegetWallet.wallet);
                });
              }else{
                chrome.runtime.sendMessage({message: "getWallet", username: response.UserName , domain:url}, function(responsegetWallet){
                  responsegetWallet.wallet = convertAddress(responsegetWallet.wallet);
                  localStorage.setItem('walletToDonate', responsegetWallet.wallet);
                });
              }

              document.getElementById('spanPublisherName').innerHTML =response.UserName;
          }
        }
      });
    })
  }

  