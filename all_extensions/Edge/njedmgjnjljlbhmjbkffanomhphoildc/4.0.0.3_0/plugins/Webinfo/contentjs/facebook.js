chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.message == "facebook") {

        //Gets information from Twitch and sends it to webinfo.js and webinfodonation.js with message: "Facebook"

            if(document.getElementsByClassName("_2wmb")[0]!=undefined) {
                var UserName = document.getElementsByClassName("_64-f")[0].innerText;
                var UserLink = document.getElementsByClassName("_2wmb")[0].baseURI;
                sendResponse({message: "facebook", UserName: UserName, UserLink: UserLink});
            }
            else if(document.getElementsByClassName("_2nlw _2nlv")[0]!=undefined) {
                UserName = document.getElementsByClassName("_2nlw _2nlv")[0].innerText;
                UserLink = document.getElementsByClassName("_2nlw _2nlv")[0].baseURI;
                sendResponse({message: "facebook", UserName: UserName, UserLink: UserLink});
            }

            else if(document.getElementsByClassName("_19s-")[0]!=undefined) {
                UserName = document.getElementsByClassName("_19s-")[0].innerText;
                UserLink = document.getElementsByClassName("_19s-")[0].baseURI;
                sendResponse({message: "facebook", UserName: UserName, UserLink: UserLink});
            }
            else {
                sendResponse({message: "facebook", UserName: "facebook.com"});
                }

            }

        });