
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.message == "youtube") {
      if(window.location.href.indexOf("channel")>-1) {
        var ChannelName = document.getElementById("channel-title").innerHTML;
        var ChannelID = document.getElementById("channel-title").baseURI;
        sendResponse({message: "youtube", UserID: ChannelID, UserName: ChannelName});
      }
      else if(window.location.href.indexOf("playlist?list")>-1){
        ChannelName = "www.youtube.com"
        sendResponse({message: "youtube", UserName: ChannelName});
      }
      else {

      //Gets information from Youtube and sends it to webinfo.js and webinfodonation.js with message: "Youtube"
        var elemente = document.getElementsByTagName("yt-formatted-string");
        var owners=0;
        var u = 0;
        for(i=0; i<elemente.length; i++) {
          if((elemente[i].id.indexOf("owner-name")>-1) && (elemente[i].className.indexOf("style-scope ytd-video-owner-renderer") > -1)) {
            owners++;
          } }
          for(i=0; i<elemente.length; i++) {
            if((elemente[i].id.indexOf("owner-name")>-1) && (elemente[i].className.indexOf("style-scope ytd-video-owner-renderer") > -1)) {
              u++;

            if(owners>1) {
                if((elemente[i].children[0]!=undefined)&&(u>1)) {
                  ChannelID =elemente[i].children[0].href.split("channel/")[1];
                  VideoID= elemente[i].children[0].baseURI.split("watch?v=")[1];
                  ChannelName= elemente[i].children[0].innerHTML;
                }
                if(elemente[i].className.indexOf("super-title style-scope ytd-video-primary-info-renderer")>-1 && u>1) {
                  for(k=0; k<elemente[i].getElementsByTagName("a").length; k++) {
                    if(elemente[i].getElementsByTagName("a")[k].innerText.indexOf("Tube_")>-1){
                      var WalletAdress= elemente[i].getElementsByTagName("a")[k].innerText.split("_")[1];
                    }
                  }
                }
              }

            else {
            if((elemente[i].children[0]!=undefined)) {
              ChannelID =elemente[i].children[0].href.split("channel/")[1];
              VideoID= elemente[i].children[0].baseURI.split("watch?v=")[1];
              ChannelName= elemente[i].children[0].innerHTML;
            }

          if(elemente[i].className.indexOf("super-title style-scope ytd-video-primary-info-renderer")>-1) {
            for(k=0; k<elemente[i].getElementsByTagName("a").length; k++) {
              if(elemente[i].getElementsByTagName("a")[k].innerText.indexOf("Tube_")>-1){
                var WalletAdress= elemente[i].getElementsByTagName("a")[k].innerText.split("_")[1];
              }
            }
          }
        }
        }
      }

        if(ChannelName!=undefined) {

        sendResponse({message: "youtube", UserID: ChannelID, VideoID: VideoID, UserName: ChannelName, WalletAdress: WalletAdress});
        }

        else {
          ChannelName = "www.youtube.com"
          sendResponse({message: "youtube", UserName: ChannelName});
        }
      }
    }

  });

