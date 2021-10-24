chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.message == "amazon") {
            //Gets information from Twitch and sends it to webinfo.js and webinfodonation.js with message: "Twitch"
        if(document.getElementById("bylineInfo")!=undefined) {
            var StoreName = document.getElementById("bylineInfo").innerText;
            var StoreHref =  document.getElementById("bylineInfo").href;
            console.log(StoreName)
            console.log(StoreHref)

            sendResponse({message: "amazon", UserName: StoreName, UserId: StoreHref});
        }
        else if(document.getElementsByClassName("brand-store-title")[0]!=undefined) {
            var StoreName = document.getElementsByClassName("brand-store-title")[0].innerText;
            var StoreHref =  document.getElementsByClassName("brand-store-title")[0].baseURI;
            console.log(StoreName)
            console.log(StoreHref)

            sendResponse({message: "amazon", UserName: StoreName, UserId: StoreHref});
        }
        else if(document.getElementById("ap-author-name")!=undefined) {
            var StoreName = document.getElementById("ap-author-name").innerText;
            var StoreHref =  document.getElementById("ap-author-name").baseURI;
            console.log(StoreName)
            console.log(StoreHref)
            sendResponse({message: "amazon", UserName: StoreName, UserId: StoreHref});
        }

        else if(document.getElementsByClassName("av-detail-section")[0]!=undefined) {

            var MovieName = document.getElementsByClassName("av-detail-section")[0].children[0].innerText;
            var MovieUrl =  document.getElementsByClassName("av-detail-section")[0].children[0].baseURI;
            console.log(MovieName)
            console.log(MovieUrl)
            sendResponse({message: "amazon", UserName: MovieName, UserId: MovieUrl});
        }
        else {
            StoreName = "amazon.com"
            console.log(StoreName)
            sendResponse({message: "amazon", UserName: StoreName });
          }
        }

 });