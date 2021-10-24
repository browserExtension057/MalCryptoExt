chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.message == "soundcloud") {

        //Gets information from Soundcloud and sends it to webinfo.js and webinfodonation.js with message: "Soundcloud"
            var ChannelNamePlayer = document.getElementsByClassName("playbackSoundBadge__lightLink sc-link-light sc-truncate")[0].innerText;
            var ChannelIDPlayer = document.getElementsByClassName("playbackSoundBadge__lightLink sc-link-light sc-truncate")[0].href;

           if(document.getElementsByClassName("profileHeaderInfo__userName g-type-shrinkwrap-block g-type-shrinkwrap-large-primary").length>0) {
            var ChannelNameProfile = document.getElementsByClassName("profileHeaderInfo__userName g-type-shrinkwrap-block g-type-shrinkwrap-large-primary")[0].innerText;
            var ChannelIDProfile = document.getElementsByClassName("profileHeaderInfo__userName g-type-shrinkwrap-block g-type-shrinkwrap-large-primary")[0].baseURI;

            sendResponse({message: "soundcloud", ChannelNamePlayer: ChannelNamePlayer, ChannelIDPlayer: ChannelIDPlayer, UserName: ChannelNameProfile, UserId: ChannelIDProfile });
            }

            else if(document.getElementsByClassName("soundTitle__usernameHeroContainer").length>0) {
            var ChannelNameProfile = document.getElementsByClassName("soundTitle__usernameHeroContainer")[0].firstElementChild.innerText;
            var ChannelIDProfile = document.getElementsByClassName("soundTitle__usernameHeroContainer")[0].firstElementChild.href;
            sendResponse({message: "soundcloud", ChannelNamePlayer: ChannelNamePlayer, ChannelIDPlayer: ChannelIDPlayer, UserName: ChannelNameProfile, UserId: ChannelIDProfile });
            }
            else {
                sendResponse({message: "soundcloud", UserName: ChannelNamePlayer, UserId: ChannelIDPlayer});
            }

        }

 });