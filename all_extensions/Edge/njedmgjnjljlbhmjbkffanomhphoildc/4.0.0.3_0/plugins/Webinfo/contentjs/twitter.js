chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.message == "twitter") {
        //Gets information from Twitch and sends it to webinfo.js and webinfodonation.js with message: "Twitch"
           var elemente = document.getElementsByClassName("ProfileHeaderCard-nameLink u-textInheritColor js-nav");
           if(elemente[0]!=undefined) {
            User=elemente[0].href.split("twitter.com/")[1];

            sendResponse({message: "twitter", UserName: User});
            }
           else if(window.location.href.indexOf("/status/")>-1) {
             User=window.location.href.split("/status")[0].split("twitter.com/")[1]
            sendResponse({message: "twitter", UserName: User});
           }
           else {
            User="twitter.com"
            sendResponse({message: "twitter", UserName: User});
           }
       }
 });
