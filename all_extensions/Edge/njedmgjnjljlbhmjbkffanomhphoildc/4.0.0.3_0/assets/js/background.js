// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

//START creating indexed db for social media users

var dbname = 'bittube';
var dbversion = 2;
var store_domain = 'domain';
var store_twitter = 'twitter';
var store_facebook = 'facebook';
var store_youtube = 'youtube';
var store_twitch = 'twitch';
var store_amazon = 'amazon';
var store_soundcloud = 'soundcloud';
var db;

var request = indexedDB.open(dbname, dbversion);
var dbExists = true;

request.onupgradeneeded = function(e) {
  // Create a new object store if this is the first time we're using
  // this DB_NAME/DB_VERSION combo.
  if (e.oldVersion < 1) {
    request.result.createObjectStore(store_domain, {autoIncrement: true, keyPath: "name" });
    request.result.createObjectStore(store_twitter, {autoIncrement: true, keyPath: "name" });
    request.result.createObjectStore(store_facebook, {autoIncrement: true, keyPath: "name" });
    request.result.createObjectStore(store_youtube, {autoIncrement: true, keyPath: "name" });
    request.result.createObjectStore(store_twitch, {autoIncrement: true, keyPath: "name" });
    request.result.createObjectStore(store_amazon, {autoIncrement: true, keyPath: "name" });
    request.result.createObjectStore(store_soundcloud, {autoIncrement: true, keyPath: "name" });
  }

  if (e.oldVersion < 2) {
    request.result.createObjectStore('catchall', {autoIncrement: true, keyPath: "key" });
  }
};

request.onsuccess = function() {
  db = request.result;
  // Enable our buttons once the IndexedDB instance is available.
  // console.log('indexeddb created');

};

//END creating indexed db for social media users

function firstRun(filename) {
    var myid = chrome.i18n.getMessage("@@extension_id");
    chrome.windows.getCurrent(function (win) {
        chrome.tabs.query({
                'windowId': win.id
            },
            function (tabArray) {
                for (var i in tabArray) {
                    if (tabArray[i].url == "chrome-extension://" + myid + "/" + filename) { // // console.log("already opened");
                        chrome.tabs.update(tabArray[i].id, {
                            active: true
                        });
                        return;
                    }
                }
                chrome.tabs.create({
                    url: filename
                });
            });
    });
}

chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason == "install") {
        firstRun("https://pay.bittube.cash/notify/");
    } else if (details.reason == "update") {
        migrateLocalDb();
    }
});

let verifySoundCloud = false;
let userSoundCloud;
let hashSoundCloud;
let urlSoundCloud;

let verifyFacebook = false;
let userFacebook;
let hashFacebook;
let urlFacebook;

chrome.runtime.onMessageExternal.addListener((msg, sender, response) => {
    // console.log(msg)
    switch (msg.message){
        case 'checkExtension':
        response({message: true});
        break;
        case 'channel':
        localStorage.setItem('channel', msg.channel);
	    // console.log('channelid', msg.channel);
        break;
        case 'openWallet':
        //window.open(window.location.origin + '/wallet/index.html#!/overview');
        chrome.tabs.create({
            url: "https://pay.bittube.cash/wallet/index.html#!/overview"
          });
        break;
        case 'setReferral':
        localStorage.setItem('referredbykey', msg.referredbykey);
        response({message: true});
        break;
        case 'refreshImage':
        localStorage.removeItem('image');
        break;
        case 'getSoundcloudCode':
            // console.log('************ getSoundcloudCode ************');
            // console.log(msg);
            urlSoundCloud ="https://soundcloud.com/"+msg.user
            userSoundCloud  = msg.user;
            hashSoundCloud = msg.code;
            verifySoundCloud = true;
            // console.log('************ End getSoundcloudCode ************');
        break;
        case 'getFacebookCode':
            // console.log('************ getFacebookCode ************');
            // console.log(msg);
            urlFacebook ="https://www.facebook.com/"+msg.user
            userFacebook  = msg.user;
            hashFacebook = msg.code;
            verifyFacebook = true;
            // console.log('************ End getFacebookCodeCode ************');
        break;

    }
});


if (typeof(browser) != 'undefined'){
    browser.tabs.onUpdated.addListener(
        function(tabId, changeInfo, tab) {
            if(changeInfo.status == "complete") {
                if(tab.url!="https://soundcloud.com/home") {
                    // console.log(changeInfo)
                    browser.tabs.sendMessage( tabId, {
                        message: 'newUrl',
                        url: changeInfo.url,
                        lang: localStorage.getItem('i18nextLng')
                    })
                }

                if( verifySoundCloud && tab.url.indexOf(urlSoundCloud) != -1 ){
                    browser.tabs.sendMessage( tabId, {
                        message: 'SoundcloudVerification',
                        user: userSoundCloud,
                        hash: hashSoundCloud
                    });
                }

                if( verifyFacebook && tab.url.indexOf(urlFacebook) != -1 ){

                    browser.tabs.sendMessage( tabId, {
                        message: 'FacebookVerification',
                        user: userFacebook,
                        hash: hashFacebook
                    });
                }

            }

            return true;
    });
}else{
    chrome.tabs.onUpdated.addListener(
        function(tabId, changeInfo, tab) {
            if(changeInfo.status == "complete") {
                if(tab.url!="https://soundcloud.com/home") {
                    // console.log(changeInfo)
                    chrome.tabs.sendMessage( tabId, {
                        message: 'newUrl',
                        url: changeInfo.url,
                        lang: localStorage.getItem('i18nextLng')
                    })
                }

                if( verifySoundCloud && tab.url.indexOf(urlSoundCloud) != -1 ){
                    chrome.tabs.sendMessage( tabId, {
                        message: 'SoundcloudVerification',
                        user: userSoundCloud,
                        hash: hashSoundCloud
                    });
                }

                if( verifyFacebook && tab.url.indexOf(urlFacebook) != -1 ){

                    chrome.tabs.sendMessage( tabId, {
                        message: 'FacebookVerification',
                        user: userFacebook,
                        hash: hashFacebook
                    });
                }

            }
    });
}


let gotWallet = false;
let typeBrowser;

function handleOnMessageEvent(request, sender, response){

    switch (checkBrowser()){
        case 'chrome':
            typeBrowser = chrome;
        break;
        case 'firefox':
            typeBrowser = browser;
        break;
        default:
            typeBrowser = chrome;
        break;
    }


    if ( request.message == 'isUserLogged'){
        if( firebase.auth().currentUser == null ){
            if (checkBrowser() == 'chrome'){
                response({message: false});
            }else{
                typeBrowser.tabs.query({currentWindow: true, active: true}, function (tab) {
                    chrome.tabs.sendMessage(tab[0].id, {message: false});
                })
            }
        }else{
            if (checkBrowser() == 'chrome'){
                response({message: true});
            }else{
                typeBrowser.tabs.query({currentWindow: true, active: true}, function (tab) {
                    chrome.tabs.sendMessage(tab[0].id, {message: true});
                })
            }
        }

    }else if (request.message == 'errorCode'){
        typeBrowser.tabs.query({currentWindow: true, active: true}, function (tab) {
            chrome.tabs.sendMessage(tab[0].id, {message: 'errorCode', error: request.error});
        });
    }else if (request.message == 'correctCode'){
        typeBrowser.tabs.query({currentWindow: true, active: true}, function (tab) {
            chrome.tabs.sendMessage(tab[0].id, {message: 'correctCode', error: request.error});
        });
    }else if (request.message == 'userNotLoggedIn'){
        typeBrowser.tabs.query({currentWindow: true, active: true}, function (tab) {
            chrome.tabs.sendMessage(tab[0].id, {message: 'userNotLoggedIn'});
        });
    }else if (request.message == 'userHasSecurity'){
        typeBrowser.tabs.query({currentWindow: true, active: true}, function (tab) {
            chrome.tabs.sendMessage(tab[0].id, {message: 'userHasSecurity'});
        });
    }else if (request.message == 'errorOnDonation'){
        typeBrowser.tabs.query({currentWindow: true, active: true}, function (tab) {
            chrome.tabs.sendMessage(tab[0].id, {message: 'errorOnDonation', data: request.data});
        });
    }else if (request.message == 'donationSent'){
        typeBrowser.tabs.query({currentWindow: true, active: true}, function (tab) {
            chrome.tabs.sendMessage(tab[0].id, {message: 'donationSent', data: request.data});
        });
    }else if( request.message == 'setReferralKey'){
        localStorage.setItem('referredbykey', request.referredbykey);
    }else if(request.message == 'channel'){
        // console.log('Set Channel !!!! ', request.token)
        localStorage.setItem('channel', request.token);
    }
    // else if(request.message == "UserContentjs" || request.message == "testMessage"){
    //     var User=request.User;
    //     var Domain=request.Domain;
    //     var user_id = request.UserID;
    //     Domain = Domain.split('.')[0];
    //     checkUserExistsOnIndexedDb(Domain, User, user_id);
    // }
    // else if(request.message == "DomainContentjs") {
    //     var Domain= request.Domain
    //     if(request.status!=undefined) {
    //         if (parseDomain(Domain) != null ){
    //             Domain = parseDomain(Domain).domain + "." +  parseDomain(Domain).tld;
    //         }
    //     }
    //     checkUserExistsOnIndexedDb('domain', Domain, '');
    // }
    else if (request.message == "getCookie"){
        getCookies(functionBaseURL, "__session", function(cookie) {
            response({response: cookie});
        });
    }else if(request.message == "getWallet") {
        if( firebase.auth().currentUser == null ){
            if (checkBrowser() == 'chrome'){
                response({message: 'noAllow'});
            }else{
                typeBrowser.tabs.query({currentWindow: true, active: true}, function (tab) {
                    chrome.tabs.sendMessage(tab[0].id, {message: 'noAllow'});
                })
            }
        }else{
            checkUserExistsOnIndexedDb(request.domain, request.userID, request.username, function(responsGetWallet){
                console.log('GotWallet -- Domain:', request.domain, 'UserID:', request.userID, 'UserName:', request.username, 'Wallet:', responsGetWallet);
                if (checkBrowser() == 'chrome'){
                    try {
                        response({message: 'gotWallet', wallet: localStorage.getItem('walletToDonate')});
                    } catch (err) {
                        // console.warn('Broken Response:', err);
                    }
                }else{
                    typeBrowser.tabs.query({currentWindow: true, active: true}, function (tab) {
                        chrome.tabs.sendMessage(tab[0].id, {message: 'gotWallet', wallet: localStorage.getItem('walletToDonate'), platform: request.domain});
                    })
                }

            });

        }
    }
    // else if(request.message == "fillDonation") { // Unused??
    //     checkUserExistsOnIndexedDb(request.platform, request.userID, request.username || '');
    //     response({wallet: localStorage.getItem('walletToDonate')});
    // }
    else if(request.message=="SoundcloudVerification" || request.message=="FacebookVerification") {

        if((verifySoundCloud && request.hash.indexOf(hashSoundCloud)>-1) ||
        (verifyFacebook && request.hash.indexOf(hashFacebook)>-1)) {
        if(hashSoundCloud){
            typeBrowser.cookies.set({
                "name": "code",
                "url": functionBaseURL,
                "value": "#bittube-"+hashSoundCloud
            }, function (cookie) {
            });
        }
        else if(hashFacebook) {
            typeBrowser.cookies.set({
                "name": "code",
                "url": functionBaseURL,
                "value": "#bittube-"+ hashFacebook
            }, function (cookie) {
            });
        }

            typeBrowser.tabs.query({currentWindow: true, active: true}, function (tab) {
                chrome.tabs.update(tab.id, {url: functionBaseURL + '/verificationSuccess'});
            })

        } else {
            typeBrowser.cookies.set({
                "name": "code",
                "url": functionBaseURL,
                "value": ''
            }, function (cookie) {
            });
            typeBrowser.tabs.query({currentWindow: true, active: true}, function (tab) {
                typeBrowser.tabs.update(tab.id, {url: functionBaseURL + '/verificationSuccess'});
            })
        }
        verifyFacebook = false;
        verifySoundCloud = false;
    }else if( request.message == 'twitterLogin'){
        console.log('on message TwitterLogin');
        startTwitterAuth((responseLogin) =>{
            const result = JSON.parse(responseLogin);
            if(result.result == 'Error'){
                response(responseLogin)
            }
        });
    }else if( request.message == 'facebookLogin'){
        startFacebookAuth(function(responseLogin){
            const result = JSON.parse(responseLogin)
            if(result.result == 'Error'){
                response(responseLogin)
            }
        });
    }else if (request.message == 'googleLogin'){
        googleAuth(request.interactive, function(responseLogin){
            const result = JSON.parse(responseLogin)
            if(result.result == 'Error'){
                response(responseLogin)
            }
        });
    }else if(request.message == "ApiSocial"){
        var User=request.User;
        var Domain=request.Domain;
        var videoId=request.videoId
        var amount= request.amount
        var url;
        var callType;
        console.log("ApiSocial ===> " + User, Domain);
        if(Domain=="https://www.youtube.com" || Domain=="youtube.com" || Domain == 'youtube') {
            callType = "Comment";
            url = functionBaseURL + '/app/youtubeApi?user='+User+'&video='+videoId+'&amount='+amount+'&callType='+callType;
            userDataRequest(url, "youtubeApiComment", (responseComment) =>{
                console.log('Response User Data request youtubeApiComment', responseComment);
            });
        }else if (Domain == 'twitter.com/' || Domain == 'twitter.com' || Domain == 'twitter'){
            url = functionBaseURL + '/app/sendTwitterMessage?user=' + User + '&amount=' + amount;
            userDataRequest(url, "sendTwitterMessage", (responseTwitterMessage) =>{
                console.log('Response User Data request sendTwitterMessage', responseTwitterMessage);
            });
        }else if (Domain == 'twitch.tv' || Domain == 'twitch'){
            url = functionBaseURL + '/app/twitchApi?user=' + User + '&amount=' + amount;
            userDataRequest(url, "sendTwitchMessage", (responseTwitchMessage) =>{
                console.log('Response User Data request sendTwitchMessage', responseTwitchMessage);
            });
        }
    }
    else if(request.message=="UserToChannelID") {
        console.log('REQUEST USER TO CHANNEL ID !!! => ', request.User);
        callType = "getChannelID";
        url = functionBaseURL + '/app/youtubeApi?user='+request.User+'&callType='+callType;
        // url = 'http://localhost:9001/bittube-airtime-extension/us-central1/app/youtubeApi?user='+request.User+'&callType='+callType;
        userDataRequest(url, "youtubeApiChannelID");
    }
    return true;
}

if (typeof(browser) != 'undefined'){
    browser.runtime.onMessage.addListener((request, sender, response) =>{
        handleOnMessageEvent(request, sender, response);
        // return true;
    });
}else{
    chrome.runtime.onMessage.addListener(function(request, sender, response) {
        handleOnMessageEvent(request, sender, response);
        // return true;
    });
}
// function to check if the user exists on the indexedDb.
// Param username ===> username to look for.
// Param domain ===> to know in which db look for usename
function checkUserExistsOnIndexedDb(domain, username, socialid = '', callback){
    console.log("checkUserExistsOnIndexedDb -- Domain:", domain, 'UserName:', username, 'SocialID:', socialid);
    try {
        db.transaction(domain).objectStore(domain).get(username).onsuccess = function(event) {
            if ( event.target.result != undefined){
                event.target.result.wallet = convertAddress(event.target.result.wallet);
                localStorage.setItem('walletToDonate', event.target.result.wallet);
                localStorage.setItem('userSocialId', event.target.result.name);
                localStorage.setItem('userPlatform', domain);
                if (callback){
                    callback(event.target.result.wallet);
                }
            }else {
                if (username != undefined && username != 'undefined'){
                    const url = functionBaseURL + '/app/checkUserAirtime?username=' + encodeURIComponent(username) +'&domain=' + encodeURIComponent(domain) + '&socialid=' + encodeURIComponent(socialid);
                    const from = 'checkUserAirtime';
                    userDataRequest(url, from, function(wallet) {
                        if (callback){
                            callback(wallet);
                        }
                    });
                }
            }
        };
    } catch (err) {
        // console.warn('checkUserExistsOnIndexedDb ERR:', err);
        db.transaction('catchall').objectStore('catchall').get(domain + '_' + username).onsuccess = function(event) {
            if ( event.target.result != undefined){
                event.target.result.wallet = convertAddress(event.target.result.wallet);
                localStorage.setItem('walletToDonate', event.target.result.wallet);
                localStorage.setItem('userSocialId', event.target.result.name);
                localStorage.setItem('userPlatform', domain);
                if (callback){
                    callback(event.target.result.wallet);
                }
            }else {
                if (username != undefined && username != 'undefined'){
                    const url = functionBaseURL + '/app/checkUserAirtime?username=' + encodeURIComponent(username) +'&domain=' + encodeURIComponent(domain) + '&socialid=' + encodeURIComponent(socialid);
                    const from = 'checkUserAirtime';
                    userDataRequest(url, from, function(wallet) {
                        if (callback){
                            callback(wallet);
                        }
                    });
                }
            }
        };
    }
}


function userDataRequest(url, from, callback) {
    if (firebase.auth().currentUser != null ){
        firebase.auth().currentUser.getIdToken().then(function(token) {
            var req = new XMLHttpRequest();
            let response;
            req.onload = function() {
              switch(from){
                  case 'checkUserAirtime':
                  response = JSON.parse(req.response);
                  if (response.message == 'saveUserToLocalDB'){
                      createUserOnIndexedDB(response.domain, response.username, response.socialid, response.wallet, response.uid);
                      response.wallet = convertAddress(response.wallet);
                      localStorage.setItem('walletToDonate',response.wallet);
                      localStorage.setItem('userSocialId', response.username);
                      localStorage.setItem('userPlatform',response.domain);
                      if (callback){
                          callback(response.wallet);
                      }
                        gotWallet = true;
                  }
                  break;

                  case 'youtubeApiComment':
                  response = JSON.parse(req.response);
                  if(response.message=="success"){
                      if (callback){
                        return callback(response);
                      }
                  }
                  break;

                case 'youtubeApiChannelID':
                    response = JSON.parse(req.response);
                    console.log('This is the response to the call for get the channel id what we want to do with it !??? no idea!! ')
                    console.log(response);

                  break;

                case 'sendTwitterMessage':
                    response = JSON.parse(req.response);
                    if (callback){
                        return callback(response);
                      }
                  break;

                case 'sendTwitchMessage':
                  response = JSON.parse(req.response);
                  if (callback){
                    return callback(response);
                  }
                break;
                default:
                break;
              }
            }.bind(this);
            req.onerror = function() {
              // console.log('There was an error');
            }.bind(this);
            req.open('GET', url, true);
            req.setRequestHeader('Authorization', 'Bearer ' + token);
            req.send();
          }.bind(this));
    }
  };

function createUserOnIndexedDB(domain, username, socialid,  wallet, uid) {
    let userData = { "name": username, "creationDate":  new Date().getTime(), "socialid": socialid, "wallet": wallet, "uid": uid };

    try {
        var transaction = db.transaction(domain, 'readwrite');
        var objectStore = transaction.objectStore(domain);
        var requestsave = objectStore.put(userData);
    } catch (err) {
        userData.key = domain + '_' + username;
        var transaction = db.transaction('catchall', 'readwrite');
        var objectStore = transaction.objectStore('catchall');
        var requestsave = objectStore.put(userData);
    }
}

function getCookies(domain, name, callback) {
    chrome.cookies.get({"url": domain, "name": name}, function(cookie) {
        if(callback) {
            callback(cookie.value);
        }
    });
}
// SOCIAL LOGIN FUNCTIONS
function startTwitterAuth(callback){
    console.log('startTwitterAuth')
    var provider = new firebase.auth.TwitterAuthProvider();

    firebase.auth().signInWithPopup(provider).then((result) => {
        localStorage.setItem('aditional_info', result.additionalUserInfo.username);
        var token = result.credential.accessToken;
        if (token) {
        } else {
          console.error('The OAuth Token was null');
        }
    }, (error) => {
        console.log(error)
        if(callback){
            const result = {
                result: 'Error',
                message: 'auth/account-exists-with-different-credential',
                email: error.email
            }
            if (error.code == 'auth/account-exists-with-different-credential'){
                callback(JSON.stringify(result));
            }

        }
    });
}

function startFacebookAuth(callback){
    var provider = new firebase.auth.FacebookAuthProvider();
    // Request an OAuth token from Facebook.
    firebase.auth().signInWithPopup(provider).then(function(result) {
      //console.log(result);
      var token = result.credential.accessToken;
      if (token) {
      } else {
        console.error('The OAuth Token was null');
      }
    }).catch(function(error){
        if(callback){
            const result = {
                result: 'Error',
                message: 'auth/account-exists-with-different-credential',
                email: error.email
            }
            if (error.code == 'auth/account-exists-with-different-credential'){
                callback(JSON.stringify(result));
            }

        }
    });
}


function googleAuth(interactive, callback){
    var provider = new firebase.auth.GoogleAuthProvider();
    // Request an OAuth token from Google.
    firebase.auth().signInWithPopup(provider).then(function(result) {
        var token = result.credential.accessToken;
    if (token) {
    } else {
        console.error('The OAuth Token was null');
    }
    }).catch(function(error){
        if(callback){
            const result = {
                result: 'Error',
                message: 'auth/account-exists-with-different-credential',
                email: error.email
            }
            if (error.code == 'auth/account-exists-with-different-credential'){
                callback(JSON.stringify(result));
            }

        }
    });
}


function checkBrowser(){

    var google_chrome   = navigator.userAgent.indexOf('Chrome') > -1;
    var edge = (/Edge\/\d./i.test(navigator.userAgent))
    var firefox  = navigator.userAgent.indexOf('Firefox') > -1;
    var safari   = navigator.userAgent.indexOf("Safari") > -1;
    var opera    = navigator.userAgent.indexOf(' OPR/') > -1;

    var browserName;

      if ((google_chrome) && (safari)) safari = false;

      if((google_chrome) && (edge)){
          google_chrome = false;
      }

      if( (google_chrome) && (opera)) google_chrome = false;

      if (google_chrome){
        browserName = 'chrome';
      }else if(firefox){
        browserName = 'firefox';
      }else if(safari){
        browserName = 'safari';
      }else if (edge){
        browserName = 'edge';
      }else if (opera){
        browserName = 'opera';
      }
      return browserName;
  }

function checkRequiredPermissions() {
    const browser = checkBrowser();
    if (browser !== 'chrome') return; // afaik only chrome can disable the all_urls permission

    const check = () => {
        chrome.permissions.getAll(perms => {
            const all_urls = perms.origins && perms.origins.indexOf("<all_urls>") !== -1;
            if (all_urls) {
                if( localStorage.getItem('switch_state') == 'on' || localStorage.getItem('switch_state') == null ){
                    chrome.browserAction.setIcon({path: {
                        "16":  "assets/images/get_started16.png",
                        "32":  "assets/images/get_started32.png",
                        "128":  "assets/images/get_started128.png",
                    }});
                }else{
                    chrome.browserAction.setIcon({path: {
                        "16":  "assets/images/get_started16_red.png",
                        "32":  "assets/images/get_started32_red.png",
                        "128":  "assets/images/get_started128_red.png",
                    }});
                }
            } else {
                chrome.notifications.create({
                    type: 'basic',
                    title: 'BitTube Browser Extension',
                    message: 'BitTube Browser Extension requires permission to access all sites for correct AirTime calculation.',
                    iconUrl: 'assets/images/get_started128.png'
                });
                chrome.browserAction.setIcon({path: {
                    "16":  "assets/images/disabled_16.png",
                    "32":  "assets/images/disabled_32.png",
                    "128":  "assets/images/get_started128.png",
                }});
            }
        });
    }

    check();
    chrome.permissions.onAdded.addListener(check);
    chrome.permissions.onRemoved.addListener(check);
}

checkRequiredPermissions();

// === START PROXY AUTH ===
let lastRequestId = null;
chrome.webRequest.onAuthRequired.addListener(
    function(details) {
        try {
            if (!details.isProxy) return {};
            const challenger = `${details.challenger.host}:${details.challenger.port}`;
            const host = localStorage.getItem('vpn_address');
            console.log('chrome.webRequest.onAuthRequired', challenger, host, challenger == host, details);
            if (challenger == host) {
                try {
                    const token = JSON.parse(localStorage.getItem("vpn_token")).token;
                    if (lastRequestId == details.requestId) {
                        console.error('Proxy auth request failed for %s\n%s', host, token);
                        return {};
                    }
                    lastRequestId = details.requestId;
                    const mid = ~~(token.length / 2);
                    const username = token.substr(0, mid);
                    const password = token.substr(mid);
                    return {authCredentials: {username, password}};
                } catch (err) {
                    console.error('Unexpected error doing proxy auth', err);
                }
            }
        } catch (err) {
            console.error('Unexpected Error in onAuthRequired handler', err);
        }
        return {};
    },
    {urls: ["<all_urls>"]},
    ['blocking']
);

// Not needed. Doesnt help what I was trying to fix. ~F
// let lastRequestId = null;

// // Provides authentication to proxies when needed.
// function proxyAuthHandler(details) {
//     try {
//         if (!details.isProxy) return {};
//         const challenger = `${details.challenger.host}:${details.challenger.port}`;
//         const host = localStorage.getItem('vpn_address');
//         console.log('chrome.webRequest.onAuthRequired', challenger, host, challenger == host, details);
//         if (challenger == host) {
//             try {
//                 const token = JSON.parse(localStorage.getItem("vpn_token")).token;
//                 if (lastRequestId == details.requestId) {
//                     console.error('Proxy auth request failed for %s\n%s', host, token);
//                     return {};
//                 }
//                 lastRequestId = details.requestId;
//                 const mid = ~~(token.length / 2);
//                 const username = token.substr(0, mid);
//                 const password = token.substr(mid);
//                 return {authCredentials: {username, password}};
//             } catch (err) {
//                 console.error('Unexpected error doing proxy auth', err);
//             }
//         }
//     } catch (err) {
//         console.error('Unexpected Error in onAuthRequired handler', err);
//     }
//     return {};
// }

// // Add proxy auth listener if its not already set.
// const addProxyAuthListener = () => {
//     const hasListener = chrome.webRequest.onAuthRequired.hasListener(proxyAuthHandler, {urls: ["<all_urls>"]}, ['blocking']);
//     console.log('addProxyAuthListener -- Already Have Listener:', hasListener);
//     if (!hasListener) {
//         chrome.webRequest.onAuthRequired.addListener(proxyAuthHandler, {urls: ["<all_urls>"]}, ['blocking']);
//     }
// };

// // Remove proxy auth listener if it is set.
// const removeProxyAuthListener = () => {
//     const hasListener = chrome.webRequest.onAuthRequired.hasListener(proxyAuthHandler, {urls: ["<all_urls>"]}, ['blocking']);
//     console.log('removeProxyAuthListener -- Had Listener Already:', hasListener);
//     if (hasListener) {
//         chrome.webRequest.onAuthRequired.removeListener(proxyAuthHandler, {urls: ["<all_urls>"]}, ['blocking']);
//     }
// };

// // Decide if need to add or remove proxy auth listener based on control level.
// const proxyControlChanged = (newControlLevel) => {
//     console.log('proxyControlChanged', newControlLevel);
//     if (newControlLevel === 'controlled_by_this_extension') {
//         addProxyAuthListener();
//     } else {
//         removeProxyAuthListener();
//     }
// };

// // Listen to changes in proxy control
// chrome.proxy.settings.onChange.addListener((details) => {
//     console.log('chrome.proxy.settings.onChange', details);
//     proxyControlChanged(details.levelOfControl);
// });

// // Get initial proxy control
// chrome.proxy.settings.get({}, (details) => {
//     console.log('chrome.proxy.settings.get', details);
//     proxyControlChanged(details.levelOfControl);
// });
// === END PROXY AUTH ===

// === MODULE CLIENT COMMS START ===

const clientMsgHandlers = {};

clientMsgHandlers.test = (data) => {
    return data;
};

clientMsgHandlers.getUserInfo = async () => {
    try {
        return {
            src: 'extension',
            token: await getFirebaseToken(),
            claims: await getFirebaseClaims()
        };
    } catch (err) {
        return {
            src: 'extension'
        };
    }
};

clientMsgHandlers.update2FAToken = (data) => update2FAToken(data.code);

clientMsgHandlers.updateCustomClaims = () => updateCustomClaims();

const handleMsg = async (request, response) => {
    try {
        if (clientMsgHandlers[request.cmd] === undefined) throw new Error('Bad command');
        response({ payload: await clientMsgHandlers[request.cmd](request.data) });
    } catch (err) {
        response({ error: err.message });
    }
};

const allowedOrigins = [
    // Module Client Iframe
    // 'http://localhost:5000/tubepay/client.html', // Local Testing
    'https://pay.bittube.cash/tubepay/client.html', // Live
    'https://pay.bittube.cash/tubepay/client-new.html', // Live (New)
    'https://bittubeapp.com/tubepay/client.html', // Live
    'https://bittubeapp.com/tubepay/client-new.html', // Live (New)
    'https://bittube-airtime-extension.firebaseapp.com/tubepay/client.html', // Live
    'https://bittube-airtime-extension.firebaseapp.com/tubepay/client-new.html', // Live (New)
    'https://bittube-airtime-extension-dev.firebaseapp.com/tubepay/client.html', // Staging
    'https://bittube-airtime-extension-dev.firebaseapp.com/tubepay/client-new.html', // Staging (New)
    // MyWallet
    // 'http://localhost:5000/wallet/', // Local Testing
    'https://pay.bittube.cash/wallet/', // Live
    'https://bittubeapp.com/wallet/', // Live
    'https://bittube-airtime-extension.firebaseapp.com/wallet/', // Live
    'https://bittube-airtime-extension-dev.firebaseapp.com/wallet/' // Staging
];

const checkOrigin = (url) => {
    for (let x = 0; x < allowedOrigins.length; x++) {
        if (url.indexOf(allowedOrigins[x]) === 0) return true;
    }
    return false;
};

chrome.runtime.onMessage.addListener((request, sender, response) => {
    if (!checkOrigin(sender.url)) return;
    handleMsg(request, response);
    return true;
});

const sendAuthMsg = (msg) => {
    chrome.tabs.query({}, function (tabs) {
        for (let x = 0; x < tabs.length; x++) {
            const tab = tabs[x];
            chrome.webNavigation.getAllFrames({tabId: tab.id}, (frames) => {
                for (let x = 0; x < frames.length; x++) {
                    const frame = frames[x];
                    if (!checkOrigin(frame.url)) continue;
                    console.log('sendAuthMsg Sent To ClientFrame', msg, tab.id, tab.url, frame.frameId, frame.url, allowedOrigins.indexOf(frame.url) === -1);
                    chrome.tabs.sendMessage(tab.id, {
                        type: msg,
                        // user: user
                    }, { frameId: frame.frameId });
                }
            });

        }
    });
}

firebase.auth().onAuthStateChanged((user) => {
    sendAuthMsg('firebaseAuthChanged');
});

firebase.auth().onIdTokenChanged((user) => {
    sendAuthMsg('firebaseTokenChanged');
});


setTimeout(() => {
    console.log('Forcing token!');
    if (firebase.auth().currentUser) { firebase.auth().currentUser.getIdToken(true); }
}, 10000);
// === MODULE CLIENT COMMS END ===