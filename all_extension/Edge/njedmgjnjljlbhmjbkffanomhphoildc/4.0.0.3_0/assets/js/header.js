//This file contains all scripts involving the Header
//This file should be included when Airtime's header is included in a page

//Make sure the header is already loaded
document.addEventListener('DOMContentLoaded', function(){

    const pFooterLogin = document.getElementById('pFooterLogin');
    if ( pFooterLogin != null ){
        pFooterLogin.addEventListener('click', function(e){
            chrome.tabs.create({
                url: 'https://bittube.app'
            });
        })
    }
    if (checkBrowser() == 'firefox'){

        if( document.getElementById('divisionOr') != null ){
            document.getElementById('divisionOr').remove();
        }

        if( document.getElementById('divSocial') != null ){
            document.getElementById('divSocial').remove();
        }


    }
    if ( window.location.pathname == '/confirmtx.html' || window.location.pathname == '/register_number.html'){
        localStorage.setItem('lastPage', '/airtime.html');
    }else{
        localStorage.setItem('lastPage', window.location.pathname);
    }

    // buttons menu items
    const logoutButton = document.getElementById('logoutButton');
    const powerButton = document.getElementById('powerButton');
    const buttonStandBy = document.getElementById('buttonStandBy'); // button turn on / off airtime
    const buttonFlip = document.getElementById('buttonFlip'); // button flip

    //Initialize Global uBlock variables
    var popupData = {};
    var messaging = vAPI.messaging;
    var scopeToSrcHostnameMap = {
        '/': '*',
        '.': ''
    };
    let tabId = null;
    var hostnameToSortableTokenMap = new Map();
    var email;
    //event handlers

    if (logoutButton != null){
        setTimeout(function(e){
            email = firebase.auth().currentUser.email;
        }, 4000);

        //const email = firebase.auth().currentUser.email;
        logoutButton.addEventListener('click', function(e){
            e.preventDefault();
            e.stopPropagation();
            firebase.auth().signOut().then(function() {
            localStorage.removeItem('wallet_server');
            localStorage.removeItem('updateClaimsLast');
            localStorage.removeItem('userInfoAccount');
            localStorage.removeItem("firebase:host:bittube-airtime-extension.firebaseapp.com");
            localStorage.removeItem('chart');
            localStorage.removeItem("switch_state");
            localStorage.removeItem("totalUserNotifications");
            localStorage.removeItem("public_address");
            localStorage.removeItem("view_key");
            localStorage.removeItem("spend_key");
            localStorage.removeItem("user_options");
            localStorage.removeItem('deletephone');
            localStorage.removeItem('walletToDonate');
            localStorage.removeItem('userNameToDonate');
            localStorage.removeItem('userIDToDonate');
            localStorage.removeItem('platFormToDonate');
            localStorage.removeItem('userToDonate');
            localStorage.removeItem('referredbykey');
            localStorage.removeItem('userSocialId');
            localStorage.removeItem('userPlatform');
            localStorage.removeItem('lastPage');
            localStorage.removeItem('image');
            localStorage.removeItem('uuid');
            localStorage.removeItem('toRegisterPhone');
            localStorage.removeItem('goToReferral');
            localStorage.removeItem('userAccountLinked');
            localStorage.removeItem('documentsUploaded')
            localStorage.removeItem('document1');
            localStorage.removeItem('document2');
            localStorage.removeItem('documentsError');
            localStorage.removeItem('selfie');
            document.location.href = '/login.html';
            localStorage.removeItem('vpn_address');
            isProxyActive().then((isActive) => {
                if (isActive) {
                    clearProxySettings();
                    // chrome.proxy.settings.clear({}, resolve); // What the hell
                    // const opt = {
                    //     type: "basic",
                    //     title: "Vpn connection disabled",
                    //     message: "Connection successfully disabled.",
                    //     iconUrl: "./assets/images/logo.png"
                    // }
                    // chrome.notifications.create(opt);
                }
            });

            if (typeof(browser) == 'undefined'){
                const cookies = document.cookie.split(";");

                for (let i = 0; i < cookies.length; i++) {
                    let cookie = cookies[i];
                    let eqPos = cookie.indexOf("=");
                    let name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
                    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
                }
            }else{
                removeCookieFf('userLanguage');
                removeCookieFf(email);
            }


            }, function(error) {
                // An error happened.
                // console.log('Aqui!!! ')
                // console.log(error);
            })
        });
    }


    if (buttonFlip != null){
        buttonFlip.addEventListener('mouseenter', function(e){
                buttonFlip.classList.add('active');
        });

        buttonFlip.addEventListener('mouseleave', function(e){
                buttonFlip.classList.remove('active');
        })
    }

    if ( powerButton != null ){
        powerButton.addEventListener('click', function(ev){
            //Default Behavior for power button
            var action = 0;
            var cosmeticFilteringSwitchState = false;
            if (buttonStandBy.classList.value == 'active')
            {
                    checkVpnStatus();
                    buttonStandBy.classList.remove('active');
                    localStorage.setItem('switch_state', 'off');
                    action = 2;
                    var cosmeticFilteringSwitchState = true;
                    chrome.browserAction.setIcon({path: {
                        "16":  "assets/images/get_started16_red.png",
                        "32":  "assets/images/get_started32_red.png",
                        "128":  "assets/images/get_started128_red.png",
                    }});
            }
            else
            {
                    // console.log('changin icon 4')
                    buttonStandBy.classList.add('active');
                    localStorage.setItem('switch_state', 'on');
                    action = 0;
                    var cosmeticFilteringSwitchState = false;
                    chrome.browserAction.setIcon({path: {
                        "16":  "assets/images/get_started16.png",
                        "32":  "assets/images/get_started32.png",
                        "128":  "assets/images/get_started128.png",
                    }});
            }
            //uBlock switch Binding
            if ( !popupData || !popupData.pageURL ) { return; }
            messaging.send(
                'dashboard',
                {
                    what: 'userSettings',
                    name: 'noCosmeticFiltering',
                    value: cosmeticFilteringSwitchState
                },
                messaging.send(
                    'popupPanel',
                    {
                        what: 'toggleFirewallRule',
                        tabId: popupData.tabId,
                        pageHostname: popupData.pageHostname,
                        srcHostname: '*',
                        desHostname: '*',
                        requestType: '*',
                        action: action,
                        persist: false
                    },
                    response => {
                        cachePopupData(response);
                        messaging.send(
                            'popupPanel',
                            {
                                what: 'reloadTab',
                                tabId: popupData.tabId,
                                select: true,
                                bypassCache: ev.ctrlKey || ev.metaKey || ev.shiftKey
                            }
                        )
                    }
                )
            );
        });
    }

    //End of event handlers section

    //uBlock functions
    var cachePopupData = function(data) {
        popupData = {};
        scopeToSrcHostnameMap['.'] = '';
        hostnameToSortableTokenMap.clear();

        if ( typeof data !== 'object' ) {
            return popupData;
        }
        popupData = data;
        scopeToSrcHostnameMap['.'] = popupData.pageHostname || '';
        let hostnameDict = popupData.hostnameDict;
        if ( typeof hostnameDict !== 'object' ) {
            return popupData;
        }
        for ( let hostname in hostnameDict ) {
            if ( hostnameDict.hasOwnProperty(hostname) === false ) { continue; }
            let domain = hostnameDict[hostname].domain;
            let prefix = hostname.slice(0, 0 - domain.length - 1);
            // Prefix with space char for 1st-party hostnames: this ensure these
            // will come first in list.
            if ( domain === popupData.pageDomain ) {
                domain = '\u0020';
            }
            hostnameToSortableTokenMap.set(
                hostname,
                domain + ' ' + prefix.split('.').reverse().join('.')
            );
        }
        return popupData;
    };

    var getPopupData = function(tabId) {
        var onDataReceived = function(response) {
            cachePopupData(response);
        };
        messaging.send(
            'popupPanel',
            { what: 'getPopupData', tabId: tabId },
            onDataReceived
        );
    };
    //End uBlock Functions

    //Assign TabId Value
    let matches = window.location.search.match(/[\?&]tabId=([^&]+)/);
    if ( matches && matches.length === 2 ) {
        tabId = parseInt(matches[1], 10) || 0;
    }

    //Initialize uBlock state to be the same as button
    Initialize = function(){
        messaging.send('dashboard', { what: 'forceUpdateAssets' });
        getPopupData(tabId);
        var switch_state = localStorage.getItem('switch_state');
        var state;
        var action = 0;
        if(switch_state == 'on')
        {
            if(buttonStandBy && !uDom('#buttonStandBy').hasClass('active'))
                buttonStandBy.classList.add('active');
            state = true;
            action = 0;
            // console.log('changin icon 5')
            chrome.browserAction.setIcon({path: {
                "16":  "assets/images/get_started16.png",
                "32":  "assets/images/get_started32.png",
                "128":  "assets/images/get_started128.png",
            }});
        }
        else
        {
            if(buttonStandBy && uDom('#buttonStandBy').hasClass('active'))
                buttonStandBy.classList.remove('active');
            state = false;
            action = 2;
            // console.log('changin icon 6')
            chrome.browserAction.setIcon({path: {
                "16":  "assets/images/get_started16_red.png",
                "32":  "assets/images/get_started32_red.png",
                "128": "assets/images/get_started128_red.png",
            }});
        }

        messaging.send(
            'popupPanel',
            {
                what: 'toggleFirewallRule',
                tabId: popupData.tabId,
                pageHostname: popupData.pageHostname,
                srcHostname: '*',
                desHostname: '*',
                requestType: '*',
                action: action,
                persist: false
            },
            response => {
                cachePopupData(response);
            }
        );

        messaging.send(
            'dashboard',
            {
                what: 'userSettings',
                name: 'advancedUserEnabled',
                value: true
            }
        );
    }

    // read manifest JSON
    readManifes();
    // readAirtimeActive();
    Initialize();
  });

  function readManifes(){

    var xhr = new XMLHttpRequest();
    xhr.open("GET", "manifest.json", true);
    xhr.onload = function (e) {
    if (xhr.readyState === 4) {
        if (xhr.status === 200) {
            var version = JSON.parse(xhr.responseText).version;
            if (document.getElementById('pVersion') != null ){
                document.getElementById('pVersion').innerText = 'Version: ' + version;
            }
        } else {
        console.error(xhr.statusText);
        }
    }
    };
    xhr.onerror = function (e) {
    console.error(xhr.statusText);
    };
    xhr.send(null);



  }



  function removeCookieFf(name){
    browser.cookies.remove({
        url: 'https://bittubeapp.com',
        name: name
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
        // console.log('chrome');
        document.getElementsByTagName('body')[0].classList.add('chrome_browser');
        browserName = 'chrome';
      }else if(firefox){
        // console.log('firefox');
        document.getElementsByTagName('body')[0].classList.add('firefox_browser');
        browserName = 'firefox';
      }else if(safari){
        // console.log('safari')
        document.getElementsByTagName('body')[0].classList.add('safari_browser');
        browserName = 'safari';
      }else if (edge){
        // This is Microsoft Edge
        // console.log('Microsoft Edge');
        document.getElementsByTagName('body')[0].classList.add('edge_browser');
        browserName = 'edge';
      }else if (opera){
        // console.log('Browser Opera');
        document.getElementsByTagName('body')[0].classList.add('opera_browser');
        browserName = 'opera';
      }
      return browserName;
}

const checkVpnStatus = async () => {
    if (await isProxyActive()) {
    console.log('connectVpn -- Clear');
    await clearProxySettings();
    } else {
    console.log('connectVpn -- Connect');
    await connectToCountry();
    }

    document.getElementById('vpnStatus').innerText = await isProxyActive() ? i18next.t('vpnConnected') : i18next.t('vpnNotConnected');
    document.getElementById('connectVpn').innerText = await isProxyActive() ? i18next.t('vpnDisconnect') : i18next.t('vpnConnect');
    document.getElementById('connectVpn').disabled = false;
}