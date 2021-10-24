// Scraped together from webinfo/contentjs stuff because I kinda need it in a sane fashion.

function getContentID() {
  return new Promise(async (resolve, reject) => {
    try {
      const url = window.location.href;
      const hostname = window.location.hostname;

      // TODO: Add a 'content' field to identify video/book/music/etc?
      // TODO: Add 'userID' field for site specific user ids? (Disambiguation)
      const retVal = {
        url,
        domain: hostname,
        user: undefined,
        userID: undefined
      };

      // Amazon
      if (hostname.indexOf("amazon.") > -1) {
        if (document.getElementById("bylineInfo") != undefined) {
          retVal.user = document.getElementById("bylineInfo").innerText; // StoreName
          // retVal.userID = document.getElementById("bylineInfo").href;    // StoreHref
        } else if (document.getElementsByClassName("brand-store-title")[0] != undefined) {
          retVal.user = document.getElementsByClassName("brand-store-title")[0].innerText; // StoreName
          // retVal.userID = document.getElementsByClassName("brand-store-title")[0].baseURI; // StoreHref
        } else if (document.getElementById("ap-author-name") != undefined) {
          retVal.user = document.getElementById("ap-author-name").innerText; // StoreName
          // retVal.userID = document.getElementById("ap-author-name").baseURI; // StoreHref
        } else if (document.getElementsByClassName("av-detail-section")[0] != undefined) {
          retVal.user = document.getElementsByClassName("av-detail-section")[0].children[0].innerText; // MovieName
          // retVal.userID = document.getElementsByClassName("av-detail-section")[0].children[0].baseURI;; // MovieUrl
        }
      }

      // Facebook
      if (hostname.indexOf("facebook.") > -1) {
        if (document.getElementsByClassName("_2wmb")[0] != undefined) {
          retVal.user = document.getElementsByClassName("_64-f")[0].innerText; // UserName
          retVal.userID = document.getElementsByClassName("_2wmb")[0].baseURI; // UserLink
        } else if (document.getElementsByClassName("_2nlw _2nlv")[0] != undefined) {
          retVal.user = document.getElementsByClassName("_2nlw _2nlv")[0].innerText; // UserName
          retVal.userID = document.getElementsByClassName("_2nlw _2nlv")[0].baseURI; // UserLink
        } else if (document.getElementsByClassName("_19s-")[0] != undefined) {
          retVal.user = document.getElementsByClassName("_19s-")[0].innerText; // UserName
          retVal.userID = document.getElementsByClassName("_19s-")[0].baseURI; // UserLink
        }
      }

      // Soundcloud
      if (hostname.indexOf("soundcloud.com") > -1) {
        if (document.getElementsByClassName("profileHeaderInfo__userName g-type-shrinkwrap-block g-type-shrinkwrap-large-primary").length > 0) { // Profile
          // retVal.user = document.getElementsByClassName("profileHeaderInfo__userName g-type-shrinkwrap-block g-type-shrinkwrap-large-primary")[0].innerText; // ChannelNameProfile
          retVal.user = document.getElementsByClassName("profileHeaderInfo__userName g-type-shrinkwrap-block g-type-shrinkwrap-large-primary")[0].firstChild.textContent.trim();
          // console.log("cid soundcloud 1");
          // retVal.userID = document.getElementsByClassName("profileHeaderInfo__userName g-type-shrinkwrap-block g-type-shrinkwrap-large-primary")[0].baseURI; // ChannelIDProfile
        } else if (document.getElementsByClassName("soundTitle__usernameHeroContainer").length > 0) { // Song
          retVal.user = document.getElementsByClassName("soundTitle__usernameHeroContainer")[0].firstElementChild.innerText; // ChannelNameProfile
          // console.log("cid soundcloud 2");
          // retVal.userID = document.getElementsByClassName("soundTitle__usernameHeroContainer")[0].firstElementChild.href; // ChannelIDProfile
        } else if (document.getElementsByClassName("playbackSoundBadge__lightLink sc-link-light sc-truncate").length > 0) { // Bottom bar playing song
          retVal.user = document.getElementsByClassName("playbackSoundBadge__lightLink sc-link-light sc-truncate")[0].innerText;
          // console.log("cid soundcloud 3");
          // retVal.userID = document.getElementsByClassName("playbackSoundBadge__lightLink sc-link-light sc-truncate")[0].href;
        }
      }

      // Twitch
      if (hostname.indexOf("twitch.tv") > -1) {
        if (url.indexOf("/videos") > -1) {
          const elements = document.getElementsByClassName("channel-header__user-avatar channel-header__user-avatar--active tw-align-items-stretch tw-flex tw-flex-shrink-0 tw-mg-r-1");
          if (elements[0] != undefined) {
            retVal.user = elements[0].nextSibling.innerHTML;
            if (retVal.user.indexOf("tw-placeholder-wrapper") > -1) { // Silly twitch having placeholders.
              retVal.user = undefined;
            }
          }
          // VideoID = elemente[0].baseURI.split("videos/")[1].split("?")[0].split("/")[0];
        } else {
          const elements = document.getElementsByClassName("channel-header__user-avatar channel-header__user-avatar--active tw-align-items-stretch tw-flex tw-flex-shrink-0 tw-mg-r-1");
          if (elements[0] != undefined) {
            retVal.user = elements[0].baseURI.split("twitch.tv/")[1].split("/")[0];
          }
        }
      }

      // Twitter
      if (hostname.indexOf("twitter.com") > -1) {
        const elements = document.getElementsByClassName("ProfileHeaderCard-nameLink u-textInheritColor js-nav");
        if (elements[0] != undefined) {
          retVal.user = elements[0].href.split("twitter.com/")[1];
        } else if (url.indexOf("/status/") > -1) {
          retVal.user = url.split("/status")[0].split("twitter.com/")[1]
        }
      }

      // Reddit (TEST ~F)
      // if (hostname.indexOf('reddit.com') > -1) {
      //   if (url.indexOf('/comments/') > -1) {
      //     const entryTable = document.getElementById('siteTable');
      //     if (entryTable) {
      //       const authors = entryTable.getElementsByClassName('author');
      //       if (authors.length) {
      //         retVal.user = authors[0].innerText;
      //       }
      //     }
      //   }
      // }

      // Youtube
      if (hostname.indexOf("youtube.") > -1) {
        if (window.location.href.indexOf("channel") > -1) {
          // retVal.user = document.getElementById("channel-title").innerHTML;  // ChannelName
          retVal.user = document.getElementById("channel-title").baseURI;
        } else if (window.location.href.indexOf("playlist?list") > -1) {
          // ???????
        } else {
          //Gets information from Youtube and sends it to webinfo.js and webinfodonation.js with message: "Youtube"    
          var elemente = document.getElementsByTagName("yt-formatted-string");
          var owners = 0;
          var u = 0;
          for (i = 0; i < elemente.length; i++) {
            if ((elemente[i].id.indexOf("owner-name") > -1) && (elemente[i].className.indexOf("style-scope ytd-video-owner-renderer") > -1)) {
              owners++;
            }
          }
          for (i = 0; i < elemente.length; i++) {
            if ((elemente[i].id.indexOf("owner-name") > -1) && (elemente[i].className.indexOf("style-scope ytd-video-owner-renderer") > -1)) {
              u++;

              if (owners > 1) {
                if ((elemente[i].children[0] != undefined) && (u > 1)) {
                  retVal.user = elemente[i].children[0].href.split("channel/")[1];
                  // VideoID = elemente[i].children[0].baseURI.split("watch?v=")[1];
                  // retVal.user = elemente[i].children[0].innerHTML; // ChannelName
                }
              } else {
                if ((elemente[i].children[0] != undefined)) {
                  retVal.user = elemente[i].children[0].href.split("channel/")[1];
                  // VideoID = elemente[i].children[0].baseURI.split("watch?v=")[1];
                  // retVal.user = elemente[i].children[0].innerHTML; // ChannelName
                }
              }
            }
          }
        }
      }

      // console.log("ContentID", retVal);

      resolve(retVal);
    } catch (err) {
      // console.warn("ContentID Err:", err);
      reject(err);
    }
  });
}