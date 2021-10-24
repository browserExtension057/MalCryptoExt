chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.message == "twitch") {

        //Gets information from Twitch and sends it to webinfo.js and webinfodonation.js with message: "Twitch"
        if(window.location.href.indexOf("/videos")>-1) {
           var elemente = document.getElementsByClassName("channel-header__user-avatar channel-header__user-avatar--active tw-align-items-stretch tw-flex tw-flex-shrink-0 tw-mg-r-1");
           ChannelName=elemente[0].nextSibling.innerHTML;
           VideoID=elemente[0].baseURI.split("videos/")[1].split("?")[0].split("/")[0];
           console.log("Channel: "+ChannelName)
           console.log("VideoID: "+VideoID)
           sendResponse({message: "twitch", UserName: ChannelName, VideoID: VideoID});

        }
        else {
          var elemente = document.getElementsByClassName("channel-header__user-avatar channel-header__user-avatar--active tw-align-items-stretch tw-flex tw-flex-shrink-0 tw-mg-r-1");
           if(elemente[0]!=undefined){
            ChannelName=elemente[0].baseURI.split("twitch.tv/")[1].split("/")[0];
           }

           else {
             ChannelName=window.location.href.split("https://")[1].split("/")[0]
           }

         console.log("Channel: "+ChannelName)

         sendResponse({message: "twitch", UserName: ChannelName});
        }

       }
 });
