"use strict";

// === CONTENTID INTERNALS - START ===

// Asegurar que el modulo de parseDomain esta accesible.
if (!parseDomain) {
  throw new Error('contentID.js - "parseDomain" is undefined!');
}
const salvagedParseDomain = parseDomain; // FIXME: Twitch loses it, for some reason, so keep it handy.

// Limpiar URL para obtener 'domain.tld'
function getCleanedDomainFromUrl(hostname) {
  try {
    const parsed = salvagedParseDomain(hostname);
    return parsed.domain + '.' + parsed.tld;
  } catch (err) {
    // console.warn('getCleanedDomainFromUrl Error:', err, hostname);
    return hostname + '.invalid.tld';
  }
}

// Holder
let currentContentID;

// Helper to get contentID.
function getContentID() {
  if (!currentContentID) updateContentID(); // Ensure contentID is populated, even if late.
  return currentContentID;
}

// Async Helper to get contentID.
async function getContentIDAsync() {
  if (!currentContentID) await updateContentID(); // Ensure contentID is populated.
  return currentContentID;
}

//Detect phone device
const detecPhoneDevice = () => {
  if (navigator.userAgent.match(/Android/i) ||
    navigator.userAgent.match(/webOS/i) ||
    navigator.userAgent.match(/iPhone/i) ||
    navigator.userAgent.match(/iPad/i) ||
    navigator.userAgent.match(/iPod/i) ||
    navigator.userAgent.match(/BlackBerry/i) ||
    navigator.userAgent.match(/Windows Phone/i)
  ) {
    return true;
  } else {
    return false;
  }
}

// Used internally, actually gets the current ContentID
async function getContentIDImpl() {
  const url = window.location.href;
  const hostname = window.location.hostname;

  const retVal = {
    domain: getCleanedDomainFromUrl(hostname),
    platform: 'domain', // Default to rewarding the domain
    userName: undefined,
    userID: undefined,
    package: false
  };

  const packageInfo = await getPackageInfo();
  if (packageInfo) {
    retVal.package = true;
    if (packageInfo.contentUUID) {
      retVal.platform = packageInfo.platformUUID;
      retVal.userName = packageInfo.contentDisplayName;
      retVal.userID = packageInfo.contentUUID;
    } else {
      retVal.platform = 'module';
      retVal.userName = packageInfo.platformDisplayName || retVal.domain;
      retVal.userID = packageInfo.platformUUID;
    }
  }

  // Amazon
  else if (hostname.indexOf("amazon.") > -1) {
    if (document.getElementById("bylineInfo") != undefined) { // Store page
      const storeLinkElem = document.getElementById("bylineInfo");
      const authorNameElem = storeLinkElem.querySelector('.contributorNameID');
      if (authorNameElem) { // For book store pages
        retVal.userID = authorNameElem.href.split('/')[3];
        retVal.userName = storeLinkElem.querySelector('.contributorNameID').innerText; // StoreName
        // console.log('Amazon 1 Author -', retVal.userID, retVal.userName);
      } else {
        retVal.userID = storeLinkElem.href.split('/')[3];
        // retVal.userName = storeLinkElem.innerText;
        retVal.userName = retVal.userID;
        if (retVal.userID === 's') {
          retVal.userID = undefined;
          retVal.userName = undefined;
        }
        // console.log('Amazon 1 Store -', retVal.userID, retVal.userName);
      }
    } else if (document.getElementById('authorPageContainer')) { // Author profile page
      const authorPageContainerElem = document.getElementById('authorPageContainer');
      const authorNameElem = authorPageContainerElem.querySelector('#authorName');
      retVal.userName = authorNameElem.innerText;
      retVal.userID = url.split('/')[3];
    }
    if (retVal.userID) {
      retVal.platform = "amazon";
    }
  }

  // Facebook
  else if (hostname.indexOf("facebook.") > -1) {
    if (document.getElementsByClassName("_64-f")[0] != undefined) {
      retVal.userName = document.getElementsByClassName("_64-f")[0].innerText; // UserName
      retVal.userID = document.getElementsByClassName("_64-f")[0].href.split('/')[3]; // UserLink
      // console.log('Facebook 1', retVal.userID, retVal.userName);
    } else if (document.getElementsByClassName("_2nlw _2nlv")[0] != undefined) {
      retVal.userName = document.getElementsByClassName("_2nlw _2nlv")[0].innerText; // UserName
      const split = document.getElementsByClassName("_2nlw _2nlv")[0].href.split('/');
      if (split[3] === 'people' || split[3] === 'groups') {
        retVal.userID = split[4];
      } else {
        retVal.userID = split[3];
      }
      // console.log('Facebook 2', retVal.userID, retVal.userName);
    } else if (document.getElementsByClassName("_19s-")[0] != undefined) {
      const userProfileElem = document.getElementsByClassName("_19s-")[0];
      retVal.userName = userProfileElem.innerText; // UserName
      let split;
      if (userProfileElem.href) split = userProfileElem.href.split('/');
      else { split = userProfileElem.querySelector('a').href.split('/'); }
      if (split[3] === 'people' || split[3] === 'groups') {
        retVal.userID = split[4];
      } else {
        retVal.userID = split[3];
      }
      // console.log('Facebook 3', retVal.userID, retVal.userName);
    }
    if (retVal.userID) {
      retVal.platform = "facebook";
    }
  }

  // Soundcloud
  else if (hostname.indexOf("soundcloud.com") > -1) {
    if (document.getElementsByClassName("profileHeaderInfo__userName g-type-shrinkwrap-block g-type-shrinkwrap-large-primary").length > 0) { // Profile
      retVal.userName = document.getElementsByClassName("profileHeaderInfo__userName g-type-shrinkwrap-block g-type-shrinkwrap-large-primary")[0].firstChild.textContent.trim();
      retVal.userID = document.getElementsByClassName("profileHeaderInfo__userName g-type-shrinkwrap-block g-type-shrinkwrap-large-primary")[0].baseURI.split('soundcloud.com/')[1].split('/')[0]; // ChannelIDProfile
    } else if (document.getElementsByClassName("soundTitle__usernameHeroContainer").length > 0) { // Song
      retVal.userName = document.getElementsByClassName("soundTitle__usernameHeroContainer")[0].firstElementChild.innerText; // ChannelNameProfile
      retVal.userID = document.getElementsByClassName("soundTitle__usernameHeroContainer")[0].firstElementChild.href.split('soundcloud.com/')[1]; // ChannelIDProfile
    } else if (document.getElementsByClassName("playbackSoundBadge__lightLink sc-link-light sc-truncate").length > 0) { // Bottom bar playing song
      retVal.userName = document.getElementsByClassName("playbackSoundBadge__lightLink sc-link-light sc-truncate")[0].innerText;
      retVal.userID = document.getElementsByClassName("playbackSoundBadge__lightLink sc-link-light sc-truncate")[0].href.split('soundcloud.com/')[1];
    }
    if (retVal.userID) {
      retVal.platform = "soundcloud";
    }
  }

  // Twitch
  else if (hostname.indexOf("twitch.tv") > -1) {
    try {
      if (url.indexOf("/videos") > -1) {
        const elements = document.getElementsByClassName("channel-header__user");
        if (elements[0] != undefined) {
          retVal.userID = elements[0].href.split("twitch.tv/")[1].split("/")[0];
          retVal.userName = elements[0].innerText.trim();
          if (retVal.userName == "") { // Silly twitch having placeholders.
            retVal.userName = retVal.userID;
          }
        }
        // VideoID = elemente[0].baseURI.split("videos/")[1].split("?")[0].split("/")[0];
      } else {
        // const elements = document.getElementsByClassName("channel-header__user-avatar channel-header__user-avatar--active tw-align-items-stretch tw-flex tw-flex-shrink-0 tw-mg-r-1");
        const elements = document.querySelector('.channel-header div[data-target="channel-header-left"] .channel-header-user-tab__user-content p');//document.querySelector('.channel-header .channel-header__left .tw-font-size-5.tw-nowrap')
        if (elements != undefined) {
          retVal.userID = url.split("twitch.tv/")[1].split('/')[0];
          retVal.userName = elements.innerText.trim();
          if (retVal.userName == "") { // Silly twitch having placeholders.
            retVal.userName = retVal.userID;
          }
        }
      }
      if (retVal.userID) {
        retVal.platform = "twitch";
      }
    } catch (err) {}
  }

  // Twitter
  else if (hostname.indexOf("twitter.com") > -1) {
    let elements = document.getElementsByClassName("ProfileHeaderCard-nameLink u-textInheritColor js-nav");
    if ( elements.length === 0 ){
      elements = document.querySelector('.css-1dbjc4n.r-15d164r.r-1g94qm0 .css-1dbjc4n.r-18u37iz.r-1wbh5a2 .css-901oao.css-16my406.r-1qd0xha.r-ad9z0x.r-bcqeeo.r-qvutc0'); //document.querySelector('.css-1dbjc4n.r-15d164r.r-1g94qm0 > .css-1dbjc4n.r-1wbh5a2.r-dnmrzs > .css-1dbjc4n.r-18u37iz.r-1wbh5a2>div>span');
      if ( elements != null ){
        retVal.userName = elements.innerText.split('@')[1];
      }else if (url.indexOf("/status/") > -1) {
        retVal.userName = url.split("/status")[0].split("twitter.com/")[1];
      }
    }else{
      if (elements[0] != undefined) {
        retVal.userName = elements[0].href.split("twitter.com/")[1];
      } else if (url.indexOf("/status/") > -1) {
        retVal.userName = url.split("/status")[0].split("twitter.com/")[1];
      }
    }

    retVal.userID = retVal.userName;
    if (retVal.userID) {
      retVal.platform = "twitter";
    }
  }

  // Youtube
  else if (hostname.indexOf("youtube.") > -1) {

    if (url.indexOf("channel") > -1) {
      if ( !detecPhoneDevice() ){
        const channelTitleElem = document.getElementById("channel-title");
        if ( channelTitleElem != null ){
          retVal.userName = channelTitleElem.innerText; // ChannelName
          retVal.userID = channelTitleElem.baseURI.split("channel/")[1].split('/')[0].split('?')[0]; // ChannelID
        }else{
          const channeltitleelem = document.querySelector('#inner-header-container > #meta > #channel-name > #container > #text-container > #text');
          if (channeltitleelem) {
            retVal.userName = channeltitleelem.innerText; // ChannelName
            retVal.userID = url.split("channel/")[1].split('/')[0].split('?')[0]; // ChannelID
          } else if ( document.querySelectorAll('#channel-title-container > #channel-title')[0] != undefined ){
            retVal.userName = document.querySelectorAll('#channel-title-container > #channel-title')[0].innerText;
            retVal.userID = document.querySelectorAll('#channel-title-container > #channel-title')[0].baseURI.split("channel/")[1].split('/')[0].split('?')[0]; // ChannelID
          }
        }
      }else{
        const channelTitleElem = document.querySelector('.c4-tabbed-header-title')
        if ( channelTitleElem != null ){
          retVal.userName = channelTitleElem.innerText; // ChannelName
          retVal.userID = url.split("channel/")[1].split('/')[0].split('?')[0]; // ChannelID
        }
      }

      // retVal.userID = channelTitleElem.baseURI.split("channel/")[1].split('/')[0].split('?')[0]; // ChannelID
    } else if (url.indexOf("playlist?list") > -1) {
      // Fixed ~F
      const ownerElem = document.getElementById('video-owner');
      const actualElem = ownerElem.querySelector('a[href]');
      retVal.userName = actualElem.innerText; // ChannelName
      retVal.userID = actualElem.href.split("channel/")[1].split('/')[0].split('?')[0]; // ChannelID
    } else {
      //Gets information from Youtube and sends it to webinfo.js and webinfodonation.js with message: "Youtube"
      const ownerLinkElem = document.querySelector('ytd-video-owner-renderer #upload-info a');
      // const ownerLinkElem = document.querySelector('a[href*="/channel/"]');
      if (ownerLinkElem) {
        retVal.userID = ownerLinkElem.href.split("channel/")[1].split('/')[0].split('?')[0]; // channelID
        retVal.userName = ownerLinkElem.innerText; // ChannelName
      } else {
        // Just in case.
        var elemente = document.getElementsByTagName("yt-formatted-string");
        var owners = 0;
        var u = 0;
        for (let i = 0; i < elemente.length; i++) {
          if ((elemente[i].id.indexOf("owner-name") > -1) && (elemente[i].className.indexOf("style-scope ytd-video-owner-renderer") > -1)) {
            owners++;
          }
        }
        for (let i = 0; i < elemente.length; i++) {
          if ((elemente[i].id.indexOf("owner-name") > -1) && (elemente[i].className.indexOf("style-scope ytd-video-owner-renderer") > -1)) {
            u++;

            if (owners > 1) {
              if ((elemente[i].children[0] != undefined) && (u > 1)) {
                retVal.userID = elemente[i].children[0].href.split("channel/")[1].split('/')[0].split('?')[0];
                // VideoID = elemente[i].children[0].baseURI.split("watch?v=")[1];
                retVal.userName = elemente[i].children[0].innerHTML; // ChannelName
              }
            } else {
              if ((elemente[i].children[0] != undefined)) {
                retVal.userID = elemente[i].children[0].href.split("channel/")[1].split('/')[0].split('?')[0];
                // VideoID = elemente[i].children[0].baseURI.split("watch?v=")[1];
                retVal.userName = elemente[i].children[0].innerHTML; // ChannelName
              }
            }
          }
        }
      }
    }
    if (retVal.userID) {
      retVal.platform = "youtube";
    }
  }

  // if (retVal.userName) { retVal.userName = escape(retVal.userName); }
  // if (retVal.userID) { retVal.userID = escape(retVal.userID); }

  // console.log("getContentID RetVal:", JSON.stringify(retVal));
  return retVal;
}

// Check if there is a new contentID, if so  update currentContentID and call callbacks
async function updateContentID() {
  // const start = performance.now();
  try {
    const newContentID = await getContentIDImpl();
    // console.log('updateContentID triggered', newContentID, currentContentID);
    if (!currentContentID || (newContentID.domain != currentContentID.domain || newContentID.userName != currentContentID.userName || newContentID.userID != currentContentID.userID || newContentID.platform != currentContentID.platform)) {
      currentContentID = newContentID;
      setTimeout(callContentIDCallbacks, 0); // Call after this function chain returns, hopefully.
      // console.log('updateContentID:', currentContentID);
    }
  } catch (err) {
    console.warn('updateContentID Error:', err);
  }

  // const took = performance.now() - start;
  // console.log('updateContentID took', took);
}

const xhrReq = (url, postdata) => {
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest();
    req.onload = function() {
      try {
        if (req.status === 200) {
          try {
            resolve(JSON.parse(req.response));
          } catch (err) {
            resolve(req.response);
          }
        } else {
          reject(new Error('xhrReq: Bad statusCode ' + req.status));
        }
      } catch (err) {
        reject(err);
      }
    }
    req.onerror = reject;
    req.open(postdata ? 'POST' : 'GET', url, true);
    postdata ? req.send(postdata) : req.send();
  });
};

const getVerifyInfo = async () => {
  try {
    const verifyTags = document.querySelectorAll('script[data-airtime-beacon=true]');
    // console.log(verifyTags);
    if (verifyTags.length === 1) {
      const scriptTag = verifyTags[0];
      // console.log(scriptTag);
      const verify = scriptTag.getAttribute('data-verify') || 'unset';
      if (verify === 'meta') {
        // const metaTags = document.querySelectorAll('meta');
        // const ret = {};
        // for (let i = 0; i < metaTags.length; i++) {
        //   const metaTag = metaTags[i];
        //   // console.log('MetaTag', metaTag.name, metaTag.content);
        //   switch (metaTag.name.toLowerCase()) {
        //     case 'airtime-platform-id': ret['platformUUID'] = metaTag.content; break;
        //     case 'airtime-platform-display': ret['platformDisplayName'] = metaTag.content; break;
        //     case 'airtime-content-name': ret['contentName'] = metaTag.content; break;
        //     case 'airtime-content-display': ret['contentDisplayName'] = metaTag.content; break;
        //   }
        // }
        if (!this.metaret) {
          const parseMeta = (() => {
            const div = document.createElement('div');
            return (tag) => {
              div.innerHTML = tag;
              const meta = div.firstChild;
              return {name: meta.getAttribute('name'), content: meta.getAttribute('content')};
            }
          })();
          const ret = {};
          const checkSetOption = (opt, value) => {
            if (ret[opt] && ret[opt] !== value) throw new Error(`Found conflicting setup values for ${opt}`);
            ret[opt] = value;
          };
          const regex = /<meta.*?>/g;
          const text = await xhrReq(location.href);
          const match = text.replace(/\n+/g, ' ').match(regex);
          if (match) {
            for (let i = 0; i < match.length; ++i) {
              const meta = parseMeta(match[i]);
              if (meta && meta.name && meta.content) {
                switch (meta.name.toLowerCase()) {
                  case 'airtime-platform-id': checkSetOption('platformUUID', meta.content); break;
                  case 'airtime-platform-display': checkSetOption('platformDisplayName', meta.content); break;
                  case 'airtime-content-name': checkSetOption('contentName', meta.content); break;
                  case 'airtime-content-display': checkSetOption('contentDisplayName', meta.content); break;
                }
              }
            }
          }
          this.metaret = ret;
        }
        return this.metaret;
      } else if (verify === 'file') {
        if (!this.oldfileret) {
          const j = await xhrReq('/airtime-platform.json');
          this.fileret = { platformDisplayName: j.platformDisplayName, platformUUID: j.platformUUID };
        }
        return this.fileret;
      }
    }
  } catch (err) {
    // console.log('getVerifyInfo Error:', err);
    return undefined;
  }
};

const MagicBase64={_keyStr:"nb3dhwr9Gqi1=ITWBMDep4RO+VEtjzl5gmsaSUNkYLAu2Cc6HKoxfy8/0vZFXQJP7",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=MagicBase64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=MagicBase64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=0;var c1=0; var c2=0; var c3=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}

let verifyInfo;
async function getPackageInfo() {
  try {
    const e = document.getElementById('at_dat_ico');
    if (e) {
      const obj = JSON.parse(MagicBase64.decode(atob(e.src.split(',')[2])));
      // console.log('getPackageInfo at_dat_ico', JSON.stringify(obj));

      if (!verifyInfo) {
        verifyInfo = await getVerifyInfo() || {};
      }
      // console.log('getPackageInfo verifyInfo', JSON.stringify(verifyInfo));

      if (verifyInfo.platformUUID && verifyInfo.platformUUID !== obj.platformUUID) throw new Error('platformUUID mismatch');
      // if (verifyInfo.platformDisplayName && verifyInfo.platformDisplayName !== obj.platformDisplayName) throw new Error('platformDisplayName mismatch');
      // if (verifyInfo.contentName && verifyInfo.contentName !== obj.contentName) throw new Error('contentName mismatch');

      // return Object.assign(obj, verifyInfo);
      const o = {};
      Object.assign(o, verifyInfo);
      Object.assign(o, obj);
      // console.log(o);
      return o;
    }
  } catch (err) {
    // console.warn('getPackageInfo Error:', err);
  }
  return undefined;
}

// === CONTENTID INTERNALS - END ===

// === CALLBACKS FOR CONTENTID CHANGE - START ===

const contentIDCallbacks = [];

function registerContentIDCallback(callback) {
  if (callback && typeof callback === 'function') {
    contentIDCallbacks.push(callback);
  } else {
    throw new Error('registerContentIDCallback: Callback must be a function!');
  }
}

function callContentIDCallbacks() {
  for (const index in contentIDCallbacks) {
    const callback = contentIDCallbacks[index];
    if (callback && typeof callback === 'function') {
      try {
        callback(currentContentID);
      } catch (e) {
        console.warn('Error calling callback:', e, callback);
      }
    }
  }
}

// === CALLBACKS FOR CONTENTID CHANGE - END ===

// === UPDATE CONTENTID ON CHANGE - START ===

// const extensionID = 'cnogbbmciffpibmkphohpebghmomaemi';

// TODO: Do this EVERYWHERE -- https://github.com/mozilla/webextension-polyfill/issues/77

// Listen for requests for contentID from extension
chrome.runtime.onMessage.addListener((request, sender, response) => {
  // if (sender.id !== extensionID) {
  //   // console.log('Unwanted message:', request, sender, response);
  //   return;
  // }
  // console.log('Message', request, sender, response);
  if (request.message === 'getContentID') {
    getContentIDAsync().then((contentID) => {
      // console.log('answering getContentID', contentID);
      response(contentID);
    });
    return true;
  }
});

// Send a given contentID object to the extension
// function tellContentIDToExtension(contentID) {
//   if (!contentID) throw new Error('tellContentIDToExtension: No contentID given!');
//   chrome.runtime.sendMessage({
//     message: 'PageContentID',
//     domain: contentID.domain,
//     user: contentID.user,
//     userID: contentID.userID
//   });
//   // console.log("Told extension new contentID", contentID);
// }

// Debounce calls to updateContentID so many calls dont spam dom calls
let contentIDTimer;

function pokeUpdateContentIDTimer() {
  // console.log("Poked timer", contentIDTimer);
  if (contentIDTimer) {
    return;
  }
  // if (contentIDTimer) { clearTimeout(contentIDTimer); }
  contentIDTimer = setTimeout(async () => {
    try {
      await updateContentID();
    } catch (err) {}
    contentIDTimer = undefined;
  }, 150);
}

// Observe the DOM for changes, call pokeUpdateContentIDTimer on mutations
const observer = new MutationObserver((mutations) => {
  // console.log("Mutations", mutations);
  // for (let i = 0; i < mutations.length; i++) {
  //   const mut = mutations[i];
  //   console.log('Mutation', mut);
  // }
  pokeUpdateContentIDTimer();
});
observer.observe(document, {
  attributes: true,
  childList: true,
  subtree: true,
  characterData: true
});

// Register this function so that extension is informed of changes to contentID
// registerContentIDCallback(tellContentIDToExtension);

document.addEventListener('load', async () => {
  // Tell extension the current content ID onLoad (probably runs updateContentID for the first time)
  callContentIDCallbacks(await getContentIDAsync());
});

// === UPDATE CONTENTID ON CHANGE - END ===