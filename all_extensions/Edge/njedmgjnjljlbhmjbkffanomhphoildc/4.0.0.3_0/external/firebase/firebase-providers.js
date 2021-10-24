/**
 * initApp handles setting up the Firebase context and registering
 * callbacks for the auth status.
 *
 * The core initialization is in firebase.App - this is the glue class
 * which stores configuration. We provide an app name here to allow
 * distinguishing multiple app instances.
 *
 * This method also registers a listener with firebase.auth().onAuthStateChanged.
 * This listener is called when the user is signed in or out, and that
 * is where we update the UI.
 *
 * When signed in, we also authenticate to the Firebase Realtime Database.
 */
let photoURL;
let airtimeActive = false;
let totalUserEarnings = 0;
let gotTotalEarnings = false;

let require2FATokenTimer = null;
const require2FAToken = () => {
  return new Promise((resolve) => {
    const div = document.createElement('div');
    div.style = "position: absolute; top: 0px; left: 0px; right: 0px; bottom: 0px;  background: rgba(43, 50, 56, 0.85); z-index: 2000000";
    div.className = 'mbsc-mobiscroll';
    div.innerHTML = `
        <div id="require2fa-modal">
        <form mobiscroll-form="settings" class="md-login-form mbsc-comp ng-pristine mbsc-form mbsc-no-touch mbsc-mobiscroll mbsc-ltr ng-invalid ng-invalid-required ng-valid-maxlength" mbsc-enhance="" mbsc-form="" mbsc-form-opt="">
        <div class="mbsc-form-group no-margin">
          <label for="secret-2fa" class="labelFormDonate translate mbsc-control-w mbsc-input-outline mbsc-input">
            <span class="mbsc-label ng-binding">${i18next.t('enter6Digits')}</span>
            <span class="mbsc-input-wrap">
              <input maxlength="6" class="w-input ng-pristine mbsc-control ng-empty ng-invalid ng-invalid-required ng-valid-maxlength ng-touched" type="text" placeholder="${i18next.t('code6digits')}" name="verifySecret" autocomplete="off" required="required" ng-model="verifySecret" data-input-style="outline">
              <span class="mbsc-input-fill"></span>
              <span class="mbsc-err-msg"></span>
            </span>
          </label>
        </div>
        <div class="mbsc-form-group-inset mbsc-padding translate">
          <button type="submit" class="mbsc-btn mbsc-control">
              <div class="loadingButton">
                  <i class="fa fa-spinner fa-spin mbsc-ic mbsc-ic-fa-spinner"></i>
              </div>
              <span class="textButton ng-binding">${i18next.t('verify')}</span>
          </button>
        </div>
      </form>
      </div>`;
    document.documentElement.appendChild(div);
    const input = div.getElementsByTagName('input')[0];
    const button = div.getElementsByTagName('button')[0];
    const form = div.getElementsByTagName('form')[0];
    const error = div.getElementsByClassName('mbsc-err-msg')[0];
    const spinner = div.getElementsByClassName('loadingButton')[0];
    const text = div.getElementsByClassName('textButton')[0];
    spinner.style.display = 'none';
    let submitting = false;
    const on_submit = async () => {
      if (submitting) return;
      try {
        submitting = true;
        error.innerHTML = spinner.style.display = '';
        text.style.display = 'none';
        button.setAttribute('disabled', 'disabled');
        await new Promise(resolve => setTimeout(resolve, 1000));
        const time = await update2FAToken(input.value);
        document.documentElement.removeChild(div);
        require2FATokenTimer = setTimeout(require2FAToken, (time + TOKEN_2FA_MAX_AGE) - Date.now());
        resolve();
      } catch (err) {
        console.error(err);
        error.innerHTML = err.message;
      } finally {
        button.removeAttribute('disabled');
        submitting = false;
        spinner.style.display = 'none';
        text.style.display = '';
      }
    };
    form.addEventListener('submit', event => {
      on_submit();
      event.preventDefault();
      return false;
    })
    button.addEventListener('click', on_submit);
  });
}




function initApp() {
  // Detect if is mobile device
  const body = document.getElementsByTagName('body')[0];
  if (body.getAttribute('data-mobileDevice') == null || body.getAttribute('data-mobileDevice') == undefined) {
    if (detecPhoneDevice()) {
      console.log('location !!! ', window.location.pathname)
      if ( window.location.pathname.indexOf('/wallet') == -1 ){
        body.addEventListener("touchstart", startTouch, {passive: true});
        body.addEventListener("touchmove", moveTouch, {passive: true});
        body.setAttribute('data-mobileDevice', 'true')
        loadjscssfile('assets/css/mobile.css', 'css');
        if ( document.querySelectorAll('.footerElem > a[href="/vpn.html"]')[0] !== null && document.querySelectorAll('.footerElem > a[href="/vpn.html"]')[0] !== undefined ){
          document.querySelectorAll('.footerElem > a[href="/vpn.html"]')[0].parentElement.classList.add('displayNone')

        }
      }
    } else {
      body.setAttribute('data-mobileDevice', 'false')
    }
  }

  // Set language
  firebase.auth().useDeviceLanguage();
  // Listen for auth state changes.
  // [START authstatelistener]
  firebase.auth().onAuthStateChanged(async (user) => {
    if (!user && document.location.pathname == '/index.html') {
      // Redirect to login when user not logged in
      setTimeout(function (e) {
        document.location.href = '/login.html';
      }, 250);
    } else if (user) {
      // User is signed in.
      const displayName = user.displayName;
      const email = user.email;
      const emailVerified = user.emailVerified;
      photoURL = user.photoURL;
      const isAnonymous = user.isAnonymous;
      const uid = user.uid;
      const providerData = user.providerData;
      const defaultPic = 'assets/images/logo-header.svg';
      /*
      const token = await user.getIdTokenResult();
      if (token.claims.has2FA && document.location.pathname !== '/wallet/index.html') { // wallet checks 2fa on load always
        const age = Date.now() - (localStorage.getItem('Token2FAUpdated') || 0);
        const max_age = TOKEN_2FA_MAX_AGE;
        if (!token.claims.ts2FA || age >= max_age) await require2FAToken();
        else require2FATokenTimer = setTimeout(require2FAToken, max_age - age);
      }
      */
      //Add a switch state to localstorage upon sign in
      if (!localStorage.getItem("switch_state"))
        localStorage.setItem("switch_state", "on");
      // Define an array of pages which uses username and profile picture
      var username_display_pages = [
        '/airtime.html',
        '/confirmtx.html',
        '/buytubes.html',
        '/ublock.html',
        '/account.html',
        '/link_account.html',
        '/history.html',
        '/notifications.html',
        '/about.html',
        '/vpn.html'
      ];

      if (displayName == null) {
        user.updateProfile({
          displayName: localStorage.getItem('username'),
        });

      }
      if (photoURL == null) {
        user.updateProfile({
          photoURL: defaultPic
        });
      }

      if( !localStorage.getItem('wallet_server') ){
        const urlRequest = functionBaseURL + '/app/getWalletServer';
        const token = await getFirebaseToken();
        sendGetRequest(urlRequest, token, async (user, response) => {
          const resultRequest = JSON.parse(response);
          if ( resultRequest.success && resultRequest.data){
            localStorage.setItem('wallet_server', resultRequest.data);
          }
        })
      }

      if (document.location.pathname == '/index.html') {
        // redirect to airtime if user logged in
        setTimeout(function (e) {
          if (localStorage.getItem('lastPage') != null) {
            document.location.href = localStorage.getItem('lastPage');
          } else {
            document.location.href = '/airtime.html';
          }
        }, 250);
      } else if (username_display_pages.indexOf(document.location.pathname) != -1) {
        // Add username and profile picture to airtimeStats
        // read user data once
        readAirtimeActive();
        readUserData();
        checkUserWallet(uid);
        checkUserIsVerified();
        getTotalUserNotifications();

        if (document.getElementById('username') != null) {
          document.getElementById('username').textContent = displayName;
        }
        if (!emailVerified && user.providerData[0].providerId == 'password') {
          document.getElementById('userEmail').textContent = email;
          user.sendEmailVerification();
          showModalResendActivationEmail(user);
        }
        if (emailVerified) {
          const buttonHasFlip = localStorage.getItem('buttonFlip');
          if (buttonHasFlip == null || buttonHasFlip == undefined) {
            document.getElementById('buttonFlip').classList.add('active');

            setTimeout(function (e) {
              document.getElementById('buttonFlip').classList.remove('active');
              localStorage.setItem('buttonFlip', 'true');
            }, 800)
          }
        }

        if (localStorage.getItem('image') != null && localStorage.getItem('image') != 'null') {
          document.getElementById('logoheader').src = localStorage.getItem('image');
          if (document.getElementById('imageUserProfile') != null) {
            document.getElementById('imageUserProfile').src = localStorage.getItem('image');
          }
        } else {
          document.getElementById('logoheader').onload = function (e) {
            document.getElementById('logoheader').onload = null;
            getBase64Image(document.getElementById('logoheader'));
          };
          document.getElementById('logoheader').src = photoURL;
          if (document.getElementById('imageUserProfile') != null) {
            document.getElementById('imageUserProfile').src = photoURL;
          }
        }

      } else if (document.location.pathname == '/login.html' || document.location.pathname == '/register.html') {
        if (!user.emailVerified && user.providerData[0].providerId == 'password') {
          user.sendEmailVerification();
        }

        if (window.location.pathname == '/register.html') {
          window.location.href = '/airtime.html';
        } else if (window.location.pathname == '/login.html') {
          window.location.href = '/airtime.html';
        }
        //Check if after social login, user exists on "airtimeTables"
        if (user.providerData[0].providerId != 'password') {
          checkUserAirtimeExists(user.providerData[0].providerId);
        }

      }

      checkUserChannelNotification();
      userInfo();
    }

    if (document.getElementById('twitter_login') != null) {
      document.getElementById('twitter_login').disabled = false;
    }
    if (document.getElementById('google_login') != null) {
      document.getElementById('google_login').disabled = false;
    }
    if (document.getElementById('facebook_login') != null) {
      document.getElementById('facebook_login').disabled = false;
    }

    if (document.location.pathname == '/account.html') {
      getUserDocuments();
      userAccount();
      showHideReferralSection();

      if (firebase.auth().currentUser != null) {
        document.getElementById('username').value = firebase.auth().currentUser.displayName;
      }
      if (localStorage.getItem('deletephone') == 'true') {
        // Show Popup confirm delete button
        document.querySelector('.md-apps-tab-sel').classList.remove('md-apps-tab-sel');
        document.querySelector('#apps-tab-security').classList.add('md-apps-tab-sel');
        setTimeout(function (e) {
          showConfirmDeleteNumberModal();
        }, 500);

      }

      let language = localStorage.getItem('i18nextLng');
      if (language.indexOf('-') > -1) {
        language = language.split('-')[0];
      }
      if (language.indexOf('_') > -1) {
        language = language.split('_')[0];
      }

      document.getElementById('changeLanguage').value = language;
      getUserSecurity();
      getUserPhoneNumber();
      userOptions();
    }
    const transmitProxyData = (obj) => {
      console.log(obj)
      return obj
    }
    if (window.location.pathname == '/vpn.html') {
      const dataIp = {};
      const cityArray = [];
      getCountry(dataIp, cityArray);
      // let haveShownNotification;
      (chrome.proxy.onProxyError || chrome.proxy.onError).addListener(async (error) => {
        const isOurProxy = await isProxyActive();
        console.log('Proxy Error:', error, 'isOurProxy:', isOurProxy);
        // Only care about our own proxy.
        if (isOurProxy) {
          document.getElementById('vpnStatus').innerText = i18next.t('vpnNotConnected');
          connectVpn.innerText = "Connect";
          clearProxySettings();
        }
      });

      const getSelectedCountryID = () => {
        return countryToId(document.getElementById("countrySelected").innerHTML);
      };
      // === UTILITY END ===

      const connectToCountry = async () => {
        if (this.busy) {
          console.warn('connectToCountry called while still busy.');
          return;
        }
        if (await isOtherExtensionControllingProxy()) {
          console.warn('connectToCountry called while other extension is controlling proxy.');
          return;
        }
        try {
          this.busy = true;
          const city = document.querySelector("#protocolSelect").value
          if (city != null) {
            localStorage.setItem("AirtimeProxyCity", city)
            console.log(dataIp)
            const ip = dataIp[city].ip
            const port = dataIp[city].port
            const servers = [ip, port]
            console.log('connectToCountry Servers:', servers);
            const requestedSettings = await applyServer(servers[0], servers[1]);
            const currentSettings = await getProxySettings();
            console.log('Requested Proxy Settings', requestedSettings, 'Current Proxy Settings:', currentSettings);
            if (use_ff_proxy && currentSettings.value && (currentSettings.value.proxyType !== requestedSettings.proxyType || currentSettings.value.http !== requestedSettings.http)) {
              document.querySelector('#vpnFirefoxWarning').classList.remove('hidden');
              document.querySelector('#connectVpn').classList.add('hidden');
            }
          }
        } catch (err) {
          console.warn('connectToCountry Error:', err);
          switch (checkBrowser()) {
            case 'chrome':
              var opt = {
                type: "basic",
                title: i18next.t('vpnTitleConnectionDown'),
                message: i18next.t('vpnConnectionDown'),
                iconUrl: "./assets/images/logo.png"
              }
              chrome.notifications.create(opt)
              break;
            case 'firefox':
              new Notification(i18next.t('vpnConnectionDisabled'), {
                body: i18next.t('vpnConnectionDisabledText'),
                icon: "./assets/images/logo.png"
              })
              break;
          }
        } finally {
          this.busy = false;
        }
      };

      const applyServer = (proxy_host, proxy_port) => {
        return new Promise((resolve, reject) => {
          let config;
          if (use_ff_proxy) {
            config = {
              proxyType: 'manual',
              http: `${proxy_host}:${proxy_port}`,
              httpProxyAll: true,
              autoLogin: true
            };
          } else {
            const proxy = "PROXY " + proxy_host + ":" + proxy_port;
            const rules = "//! DEFAULT RULE: All traffic, use below proxies\n return '" + proxy + ";'";
            const vpnRules = ''; // Dont need these. "//! If the requested website is hosted within the internal network, send direct.\nif ( shExpMatch(host, 'purevpn.com') || shExpMatch(host, 'api.purevpn.com') || shExpMatch(host, 'bi.purevpn.com') || shExpMatch(host, 'biapi.purevpn.com') || isPlainHostName(host) ) {return 'DIRECT';}\n"
            const channelProxy = ''; // TODO: Might not be needed for us. Might put rules to exclude airtime ingress here.
            const pacScript = "//!BittubeVPN\n" + "function FindProxyForURL(url, host) { " + vpnRules + channelProxy + rules + "\n}";
            config = {
              mode: 'pac_script',
              pacScript: {
                data: pacScript,
                mandatory: true
              }
            }
          }
          getVPNToken().then(() => { // ensure we have a vpn token
            chrome.proxy.settings.set({
              value: config
            }, () => {
              localStorage.setItem('vpn_address', `${proxy_host}:${proxy_port}`);
              resolve(config);
            });
            document.querySelector('#countrySelect').disabled = true
            switch (checkBrowser()) {
              case 'chrome':
                var opt = {
                  type: "basic",
                  title: i18next.t('vpnNotificationConnectedTile'),
                  message: i18next.t('vpnNotificationConnected') + proxy_host,
                  iconUrl: "./assets/images/logo.png"
                }
                chrome.notifications.create(opt);
                break;
              case 'firefox':
                break;
            }
          });
        });
      };

      // === NAVIGATION START ===

      const connectVpn = document.getElementById("connectVpn");
      const selectCountry = document.querySelector('#countrySelect');
      const backToVpn = document.querySelector('#backToVpn');
      const vpnContainer = document.querySelector(".vpnContainer");
      const protocolSelect = document.querySelector("#protocolSelect");
      const countryselectContainer = document.querySelector(".countryselectContainer");

      selectCountry.addEventListener("click", () => {
        vpnContainer.style.display = 'none';
        countryselectContainer.style.display = 'block';
      });

      backToVpn.addEventListener("click", () => {
        vpnContainer.style.display = 'block';
        vpnContainer.style.animationName = 'panelRight';
        countryselectContainer.style.display = 'none';
      });




      const updateConnectUpdate = async () => {
        // console.log('updateConnectUpdate');
        if (await isOtherExtensionControllingProxy()) {
          document.getElementById('vpnStatus').innerText = i18next.t('vpnNotConnected');
          connectVpn.innerText = 'Other Extension Has Control';
          connectVpn.disabled = true;
        } else {
          document.getElementById('vpnStatus').innerText = await isProxyActive() ? i18next.t('vpnConnected') : i18next.t('vpnNotConnected');
          connectVpn.innerText = await isProxyActive() ? i18next.t('vpnDisconnect') : i18next.t('vpnConnect');
          connectVpn.disabled = false;
        }
      };

      connectVpn.addEventListener("click", async () => {
        connectVpn.innerText = i18next.t('vpnBusy');
        if (await isProxyActive()) {
          console.log('connectVpn -- Clear');
          await clearProxySettings();
        } else {
          console.log('connectVpn -- Connect');
          await connectToCountry();
        }
        updateConnectUpdate();
      });


      const closeModalProxyAuth = document.getElementById('closeModalProxyAuth');
      if (closeModalProxyAuth != null) {
        closeModalProxyAuth.addEventListener('click', function (e) {
          document.querySelector(".notConnectedPopup").style.display = "none"
          localStorage.setItem('vpn_warning', true)
        })
      }

      // === NAVIGATION END ===

      // === RUN START ===

      setTimeout(function (e) {
        updateConnectUpdate();
      }, 350);
      // === RUN END ===
    }

    if (window.location.pathname == '/login.html') {
      if (localStorage.getItem('cookieStatus') == null) {
        document.querySelector(".notConnectedPopup").style.display = "block"
      }
      const closeModalProxyAuth = document.getElementById('closeModalProxyAuth');
      if (closeModalProxyAuth != null) {
        closeModalProxyAuth.addEventListener('click', function (e) {
          document.querySelector(".notConnectedPopup").style.display = "none"
          localStorage.setItem('cookieStatus', true)
        })
      }
    }

  });

  // [END authstatelistener]
  addEventListenerToElements();
}

let $uploadCrop;
let rawImg;

function readFile(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      $uploadCrop.croppie('bind', {
        url: e.target.result
      }).then(function () {
        document.getElementById('cropImageBtn').classList.remove('displayNone');
        document.getElementById('cancelCrop').classList.remove('displayNone');
        document.getElementById('divMainProfile').classList.add('displayNone');
      });
    }
    reader.readAsDataURL(input.files[0]);
  } else {
    alert("Sorry - you're browser doesn't support the FileReader API");
  }

  $uploadCrop = $('#upload-picture').croppie({
    viewport: {
      width: 60,
      height: 60,
      type: 'circle'
    },
    boundary: {
      width: 100,
      height: 100
    }
  });

}

function getBase64Image(img) {
  var canvas = document.createElement("canvas");

  canvas.height = img.height;
  canvas.width = img.width;

  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  try {
    var dataURL = canvas.toDataURL("image/jpeg");
    localStorage.setItem('image', dataURL);
  } catch (err) {
    console.warn('getBase64Image', err);
  }
}

function showUserImageProfile() {
  document.getElementById('cropImageBtn').classList.add('displayNone');
  document.getElementById('cancelCrop').classList.add('displayNone');
  document.getElementById('divMainProfile').classList.remove('displayNone');
  document.getElementById('headerProfilePicture').classList.add('displayNone');
  document.getElementById('divCroppieImage').classList.remove('cropping');
}

const fillMarketData = async () => {
  const priceContainer = document.querySelector(".priceContainer");
  const percent_change_24h = document.querySelector('.percent_change_24h');
  const marketcapContainer = document.querySelector(".marketcapContainer");
  const volumeContainer = document.querySelector(".volumeContainer");
  const totalContainer = document.querySelector(".totalContainer");
  const marketDataContainer = document.getElementById('marketDataContainer');
  const loaderCurrentPrice = document.getElementById('loaderCurrentPrice');
  let preferredFiat = localStorage.getItem('currencySelected');
  if (preferredFiat == null) {
    preferredFiat = 'USD';
    localStorage.setItem('currencySelected', 'USD');
  }
  const result = await getMarketData(preferredFiat);
  if (marketcapContainer != null) {
    let currencySymb = preferredFiat;
    switch (preferredFiat) {
      case 'USD':
        currencySymb = '&dollar;'
        break;
      case 'AUD':
        currencySymb = 'A&dollar;'
        break;
      case 'GBP':
        currencySymb = '&pound;'
        break;
      case 'NZD':
        currencySymb = 'N&dollar;'
        break;
      case 'EUR':
        currencySymb = '&euro;'
        break;
    }
    loaderCurrentPrice.classList.add('displayNone');
    marketDataContainer.classList.remove('displayNone');

    marketcapContainer.innerHTML = formatAmount(parseInt(result.data.quotes[preferredFiat].market_cap)) + " " + currencySymb
    priceContainer.innerHTML = parseFloat(result.data.quotes[preferredFiat].price).toFixed(5) + currencySymb;
    percent_change_24h.innerHTML = '( ' + result.data.quotes[preferredFiat].percent_change_24h + '% )';
    volumeContainer.innerHTML = formatAmount(parseInt(result.data.quotes[preferredFiat].volume_24h)) + " " + currencySymb
    totalContainer.innerHTML = formatAmount(parseInt(result.data.total_supply))
    document.getElementById('maxSupplySpan').innerHTML = formatAmount(parseInt(result.data.max_supply))
  }
}

function formatAmount(num) {
  var str = num.toString().split('.');
  if (str[0].length >= 5) {
    str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1 ');
  }
  if (str[1] && str[1].length >= 5) {
    str[1] = str[1].replace(/(\d{3})/g, '$1 ');
  }
  return str.join('.');
}

let marketData = {};
const getMarketData = (currency) => {
  const cached = marketData[currency];
  if (!cached || (Date.now() - cached.time) >= 180000) {
    const promise = firebaseFunc(`getMarketData`, {
        query: {
          currency
        }
      })
      .then(resp => resp.json())
      .catch(err => {
        delete marketData[currency];
        throw err;
      });
    marketData[currency] = {
      time: Date.now(),
      promise
    };
  }
  return marketData[currency].promise;
}

let coinGraphData = {};
const getGraphData = () => {
  const promise = firebaseFunc(`getGraphData`)
    .then(resp => resp.json())
    .catch(err => {
      delete coinGraphData;
      throw err;
    });
  coinGraphData = {
    time: Date.now(),
    promise
  };
  return coinGraphData.promise;
}

let dataChartResult = {};
const getDataChart = (currency) => {
  const promise = firebaseFunc(`getDataChart`, {
      query: {
        currency
      }
    })
    .then(resp => resp.json())
    .catch(err => {
      delete dataChartResult;
      throw err;
    });
  dataChartResult = {
    time: Date.now(),
    promise
  };
  return dataChartResult.promise;

}
const fillGraphCoin = async () => {
  try {
    const result = await getGraphData();
    const market_cap = result.data.market_cap_by_available_supply;
    const price_btc = result.data.price_btc;
    const price_usd = result.data.price_usd;
    const volume_usd = result.data.volume_usd;
    let converted;
    const curr = localStorage.getItem('currencySelected');
    const result2 = await getDataChart(curr);
    converted = result2.data.rates[curr]
    for (var i = (market_cap.length - 1); i > 0; i--) {
      marketCap.push((market_cap[i][1] * converted).toFixed(2));
      var date = new Date(market_cap[i][0]);
      var fullDate = date.getUTCDate() + '/' + (date.getUTCMonth() + 1);
      fullChartCoinLabels.push(fullDate);
      if (chartCoinLabels.length < 7) {
        if (chartCoinLabels.indexOf(fullDate) == -1) {
          chartCoinLabels.unshift(fullDate);
        }
        chartMarket.unshift((market_cap[i][1] * converted).toFixed(2));
      }
    }
    for (var i = (price_btc.length - 1); i > 0; i--) {
      priceBTC.push(price_btc[i][1]);
      if (chartBTC.length < 7) {
        chartBTC.unshift(price_btc[i][1].toFixed(10));
      }
    }

    for (var i = (price_usd.length - 1); i > 0; i--) {
      priceUSD.push((price_usd[i][1] * converted).toFixed(6));
      if (chartUSD.length < 7) {
        chartUSD.unshift((price_usd[i][1] * converted).toFixed(6));
      }

    }

    for (var i = (volume_usd.length - 1); i > 0; i--) {
      volumeUSD.push(volume_usd[i][1] * converted);
      if (chartVolume.length < 7) {
        chartVolume.unshift(volume_usd[i][1] * converted);
      }

    }

    var ctxCoin = document.getElementById('valueChart').getContext('2d');
    Chart.Tooltip.positioners.custom = function (elements, position) {
      return {
        x: position.x,
        y: 60
      }; // HARDCODING VALUES
    }

    var configChartCoin = createConfigCoinChart();
    chartCoin = new Chart(ctxCoin, configChartCoin);
    hideLoaderChart();
  } catch (err) {
    console.log(err)
  }


}


function hideLoaderChart() {
  document.getElementById('divLoaderCoinChart').style.opacity = "0";
  document.getElementById('divLoaderCoinChart').style.visibility = "hidden";
  document.getElementById('chartCoinContainer').style.opacity = "1"
  document.getElementById('chartCoinContainer').style.visibility = "visible";

}

function showLoaderChart() {
  document.getElementById('divLoaderCoinChart').style.opacity = "1";
  document.getElementById('divLoaderCoinChart').style.visibility = "visible";
  document.getElementById('chartCoinContainer').style.opacity = "0"
  document.getElementById('chartCoinContainer').style.visibility = "hidden";
  fullChartCoinLabels = [];
  chartCoinLabels = [];
  chartMarket = [];
  marketCap = [];
  priceBTC = [];
  chartBTC = [];
  priceUSD = [];
  chartUSD = [];
  volumeUSD = [];
  chartVolume = [];

}

function createConfigCoinChart() {
  let currencySymb;
  switch (localStorage.getItem('currencySelected')) {
    case 'USD':
      currencySymb = '$'
      break;
    case 'AUD':
      currencySymb = 'A$'
      break;
    case 'GBP':
      currencySymb = '£'
      break;
    case 'NZD':
      currencySymb = 'N$'
      break;
    case 'EUR':
      currencySymb = '€'
      break;
  }
  return {
    data: {
      datasets: [{
          data: chartUSD,
          label: 'Price ' + currencySymb,
          borderColor: '#009e73',
          backgroundColor: 'rgba(0, 158, 115, 0.5)',
          fill: true,
          pointStyle: 'dash',
          borderWidth: 2,
          type: 'line',
          yAxisID: 'y-axis-3',
          lineTension: (.17, .67, .83, .67),
        },
        {
          data: chartMarket,
          label: 'Market Cap',
          borderColor: '#00abff',
          backgroundColor: 'rgba(0,171,255,0.5)',
          fill: true,
          pointStyle: 'dash',
          borderWidth: 2,
          type: 'line',
          yAxisID: 'y-axis-1',
          lineTension: (.17, .67, .83, .67),
          cubicInterpolationMode: 'monotone',
          hidden: true
        },
        {
          data: chartBTC,
          label: 'Price BTC',
          borderColor: '#ffb707',
          backgroundColor: 'rgba(255, 183, 7, 0.5)',
          fill: true,
          pointStyle: 'dash',
          borderWidth: 2,
          type: 'line',
          yAxisID: 'y-axis-2',
          lineTension: (.17, .67, .83, .67),
          hidden: true,


        },

        {
          data: chartVolume,
          label: '24h Vol',
          borderColor: '#343434',
          backgroundColor: 'rgba(52, 52, 52, 0.5)',
          fill: true,
          pointStyle: 'dash',
          borderWidth: 2,
          type: 'line',
          yAxisID: 'y-axis-4',
          lineTension: (.17, .67, .83, .67),
          hidden: true
        }
      ],
      labels: chartCoinLabels,
    },
    options: {
      hover: {
        // mode: 'nearest',
        // intersect: true
      },
      animation: false,

      layout: {
        padding: {
          left: -100,
          right: -100,
          top: 0,
          bottom: 0
        }
      },
      responsive: true,
      legend: {
        display: true,
        labels: {
          usePointStyle: true
        }
      },
      title: {
        display: false,
      },
      tooltips: {
        // y: 500,
        // position: "custom",
        // yAlign: 'bottom',
        // enabled: true,
        mode: 'index',
        intersect: false,
        position: 'custom',
        titleMarginBottom: 5,
        xPadding: 10,
        yPadding: 10,
        callbacks: {
          label: function (tooltipItem, data) {
            var label = data.datasets[tooltipItem.datasetIndex].label || '';
            var tail;
            switch (label) {
              case 'Market Cap':
              case '24h Vol':
                tail = ' ' + localStorage.getItem('currencySelected');
                break;

              case 'Price BTC':
              case 'Price USD':
                tail = ' ';
                break;
              default:
                tail = ''
                break;
            }
            label = label + ' ' + tooltipItem.yLabel + tail;
            return label;

          }
        },
      },


      scales: {
        yAxes: [{
            type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
            display: false,
            position: 'left',
            id: 'y-axis-1',

          },
          {
            type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
            display: false,
            position: 'left',
            id: 'y-axis-2',
            ticks: {
              max: 0.0000796,
              stepSize: 0.5,
              beginAtZero: false,
            }
          },
          {
            type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
            display: false,
            position: 'left',
            id: 'y-axis-3',

          },
          {
            type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
            display: false,
            position: 'left',
            id: 'y-axis-4',
          }
        ],
        xAxes: [{
          fontColor: '#343434',
          fontFamily: 'Open Sans, sans-serif',
          // type: 'time',
          ticks: {
            min: 7,
            max: 7
          },
          time: {
            unit: 'day',
            unitStepSize: 1,
            displayFormats: {
              'hour': 'MMM DD',
              'day': 'MMM DD',
            }
          },
          afterFit: function (scale) {


          },
        }]
      }
    },
  };
}

function showCoinValueTab() {
  document.querySelector('.md-apps-tab-sel').classList.remove('md-apps-tab-sel');
  document.querySelector('#apps-tab-value').classList.add('md-apps-tab-sel');
  document.getElementById('tabAirtime').classList.remove('mbsc-ms-item-sel');
  document.getElementById('tabAirtime').setAttribute('data-selected', 'false');
  document.getElementById('tabValue').classList.add('mbsc-ms-item-sel');
  document.getElementById('tabValue').setAttribute('data-selected', 'true');
  // fillGraphCoin();
  hideLoaderChart();
}

function showAirtimeValueTab() {
  document.querySelector('.md-apps-tab-sel').classList.remove('md-apps-tab-sel');
  document.querySelector('#apps-tab-airtime').classList.add('md-apps-tab-sel');
  document.getElementById('tabAirtime').classList.add('mbsc-ms-item-sel');
  document.getElementById('tabAirtime').setAttribute('data-selected', 'true');
  document.getElementById('tabValue').classList.remove('mbsc-ms-item-sel');
  document.getElementById('tabValue').setAttribute('data-selected', 'false');

}

const initializeTabs = () => {
  mobiscroll.nav('#tabsAirtime', {
    theme: 'ios',
    type: 'tab',
    cssClass: 'divTabsPublisher',
    onItemTap: function (event, inst) {
      document.querySelector('.md-apps-tab-sel').classList.remove('md-apps-tab-sel');
      document.querySelector('#apps-tab-' + event.target.getAttribute('data-tab')).classList.add('md-apps-tab-sel');
      const id = event.target.getAttribute('id');

      if (id == 'tabValue') {
        document.getElementById("apps-tab-airtime").style.animation = "panelRight 0.4s ease";
        localStorage.setItem('chart', 'coinValue');
        // fillGraphCoin();
        hideLoaderChart();
      } else {
        document.getElementById("apps-tab-value").style.animation = "panelLeft 0.4s ease";
        if (id == 'tabAirtime') {
          localStorage.setItem('chart', 'airtimeValue');
        } else {
          localStorage.setItem('chart', 'vpnValue');
        }
        updateChart();
      }

    }
  });
}

function fillButtonDonate(amount) {
  fetchTUBEValue(localStorage.getItem('currencySelected')).then(function (responseFetch) {
    if (responseFetch != undefined) {
      let currencySymb = responseFetch.currency;
      switch (responseFetch.currency) {
        case 'USD':
          currencySymb = '&dollar;'
          break;
        case 'AUD':
          currencySymb = 'A&dollar;'
          break;
        case 'GBP':
          currencySymb = '&pound;'
          break;
        case 'NZD':
          currencySymb = 'N&dollar;'
          break;
        case 'EUR':
          currencySymb = '&euro;'
          break;
      }
      const result = (new Number(amount) * new Number(responseFetch.value)).toFixed(2) + ' ' + currencySymb;
      document.getElementById('spanDonateFiat').innerHTML = amount + ' <i class="icon-font-tube tubeFont10"></i> / ' + result;
    }
  });
}

function switchValuesCMC(element) {

  const spanBalance = document.getElementById('spanBalance');

  if (element != null) {
    // // console.log('here!!!')
    element.addEventListener('click', function (e) {

      if (localStorage.getItem('currencySelected') == null || localStorage.getItem('currencySelected') == 'null') {
        localStorage.setItem('currencySelected', 'USD');
      }

      switch (localStorage.getItem('currencySelected')) {
        case 'EUR':
          localStorage.setItem('currencySelected', 'USD');
          break;
        case 'USD':
          localStorage.setItem('currencySelected', 'EUR');
          break;
      }
      fetchTUBEValue(localStorage.getItem('currencySelected')).then(function (responseFetch) {
        let currencySymb = responseFetch.currency;
        switch (responseFetch.currency) {
          case 'USD':
            currencySymb = '&dollar;'
            break;
          case 'AUD':
            currencySymb = 'A&dollar;'
            break;
          case 'GBP':
            currencySymb = '&pound;'
            break;
          case 'NZD':
            currencySymb = 'N&dollar;'
            break;
          case 'EUR':
            currencySymb = '&euro;'
            break;
        }
        if (document.getElementById('spanPaidBalance') != null) {
          document.getElementById('spanPaidBalance').innerHTML = totalUserEarnings.toFixed(2) + ' <i class="icon-font-tube tubeFont10"></i>  / <span id="actualValueEarnings"> ' + (totalUserEarnings * responseFetch.value).toFixed(2) + ' ' + currencySymb + '</span>';
        }

        if (spanBalance != null) {
          document.getElementById('valueBalance').innerHTML = (Number(spanBalance.innerText) * responseFetch.value).toFixed(2) + ' ' + currencySymb;
        }

        if (document.getElementById('transferTUBEs') != null) {
          document.getElementById('quantityToTransfer').innerHTML = '&nbsp;' + (new Number(document.getElementById('transferTUBEs').value) * responseFetch.value).toFixed(2) + ' ' + currencySymb;
        }

        // switchValuesCMC(document.getElementById('actualValueBalance'));
        // switchValuesCMC(document.getElementById('actualValueEarnings'));
      });
    });
  }
}
// Function to add event listener on the events (inputs, buttons, etc)
function addEventListenerToElements() {
  const lessPriceData = document.getElementById('lessCoinData');
  const morePriceData = document.getElementById('moreCoinData');


  if (lessPriceData != null) {

    lessPriceData.addEventListener('click', function () {
      if (chartCoin.config.data.datasets.length > 0) {
        if (chartCoin.config.data.labels.length > 1) {

          chartCoinLabels.unshift(fullChartCoinLabels[chartCoinLabels.length]);
          chartUSD.unshift(priceUSD[chartUSD.length])
          chartVolume.unshift(volumeUSD[chartVolume.length])
          chartBTC.unshift(priceBTC[chartBTC.length])
          chartMarket.unshift(marketCap[chartMarket.length])
          chartCoin.update();
          if (chartCoinLabels.length <= 7) {
            morePriceData.setAttribute('disabled', 'disabled');
          } else {
            morePriceData.removeAttribute('disabled')
          }
        }
      }
    });
  }

  if (morePriceData != null) {
    morePriceData.addEventListener('click', function () {
      if (chartCoin.config.data.labels.length > 1) {
        chartCoin.config.data.labels.splice(0, 1); // remove the label first
        chartCoin.config.data.datasets.forEach(function (dataset) {
          dataset.data.splice(0, 1);
        });

        chartCoin.update();

        if (chartCoinLabels.length <= 8) {
          morePriceData.setAttribute('disabled', 'disabled');
        } else {
          morePriceData.removeAttribute('disabled')
        }

        if (chartCoinLabels.length == fullLabels.length) {
          lessPriceData.setAttribute('disabled', 'disabled');
        } else {
          lessPriceData.removeAttribute('disabled')
        }
      }
    });
  }

  const buttonsExchange = document.querySelectorAll('.buttonsExchange');
  if (buttonsExchange.length > 0) {
    for (var i = 0; i < buttonsExchange.length; i++) {
      buttonsExchange[i].addEventListener('click', function (e) {
        const exchange = this.getAttribute('data-exchange');
        let exchangeUrl;
        switch (exchange) {
          case 'bittrex':
            exchangeUrl = 'https://global.bittrex.com/Market/Index?MarketName=BTC-TUBE';
            break;
          case 'coinmarketCap':
            exchangeUrl = 'https://coinmarketcap.com/currencies/bit-tube/';
            break;
          case 'tradeogre':
            exchangeUrl = 'https://tradeogre.com/exchange/BTC-TUBE';
            break;
          case 'livecoin':
            exchangeUrl = 'https://www.livecoin.net/en/trading/TUBE_BTC';
            break;
          case 'qbtc':
            exchangeUrl = 'https://www.myqbtc.com/trade?symbol=TUBE_CNYT';
            break;
          case 'bitalong':
            exchangeUrl = 'https://bitalong.com/Trade/index/market/tube_btc';
            break;
        }
        chrome.tabs.create({
          url: exchangeUrl
        })
      })
    }
  }

  const inputDonateAmount = document.getElementById('inputDonateAmount');
  if (inputDonateAmount != null) {
    inputDonateAmount.addEventListener('keydown', debounce(function (e) {
      var charCode = e.which || e.keyCode;
      if (charCode == 46) {
        fillButtonDonate(inputDonateAmount.value);
      } else if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      } else {
        fillButtonDonate(inputDonateAmount.value);
      }
    }));
  }
  const plusAmount = document.getElementById('plusAmount');
  if (plusAmount != null) {
    plusAmount.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      const value = new Number(document.getElementById('inputDonateAmount').value) + 1;
      document.getElementById('inputDonateAmount').value = value;
      fillButtonDonate(value);
    })
  }
  const minusAmount = document.getElementById('minusAmount');
  if (minusAmount != null) {
    minusAmount.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      const value = new Number(document.getElementById('inputDonateAmount').value) - 1;
      if (value >= 0) {
        document.getElementById('inputDonateAmount').value = value;
        fillButtonDonate(value);
      }

    })
  }
  const uBODashboard = document.getElementById('uBODashboard');
  if (uBODashboard != null) {
    uBODashboard.addEventListener('click', function (e) {
      window.open(window.location.origin + '/plugins/uBlock/dashboard.html');
    });
  }

  const uBOLogger = document.getElementById('uBOLogger');
  if (uBOLogger != null) {
    uBOLogger.addEventListener('click', function (e) {
      window.open(window.location.origin + '/plugins/uBlock/logger-ui.html#tab_active');
    });
  }


  const closeModalVpn = document.getElementById('closeModalVpn');
  if (closeModalVpn != null) {
    closeModalVpn.addEventListener('click', function (e) {
      if (window.location.pathname == '/account.html') {
        document.getElementById('comingSoonVpn').classList.add('displayNone');
      } else {
        window.location.href = '/airtime.html';
      }

    })
  }


  if (document.getElementById('recoveryForm') != null) {
    setTimeout(function (e) {
      document.getElementById('email').placeholder = i18next.t('email');
    }, 500)

    document.getElementById('email').addEventListener('focus', function (e) {
      document.getElementById('email').placeholder = '';
      document.getElementById('labelRecoveryPassword').style.animation = "labelAppear 0.5s ease-out forwards";
    })

    document.getElementById('email').addEventListener('blur', function (e) {
      document.getElementById('email').placeholder = i18next.t('email');
      document.getElementById('labelRecoveryPassword').style.animation = "labelDisappear 0.5s ease-out forwards";
    });
    document.getElementById('email').focus();

  }
  const lessData = document.getElementById('moreData');
  const moreData = document.getElementById('lessData');

  if (lessData != null && moreData != null) {
    lessData.setAttribute('disabled', 'disabled');
    lessData.addEventListener('click', function () {
      if (chartDuration > 7) {
        chartDuration--;
        moreData.removeAttribute('disabled');
        if (chartDuration == 7) {
          lessData.setAttribute('disabled', 'disabled');
        }
        if (window.location.pathname == '/link_account.html') {
          updateChart('', '', 'module');
        } else {
          updateChart();
        }

      }
    });

    moreData.addEventListener('click', function () {
      if (chartDuration < 29) {
        chartDuration++;
        lessData.removeAttribute('disabled');
        if (chartDuration == 29) {
          moreData.setAttribute('disabled', 'disabled');
        }
        if (window.location.pathname == '/link_account.html') {
          updateChart('', '', 'module');
        } else {
          updateChart();
        }

      }
    });
  }




  const knowledgeLink = document.getElementById('knowledgeLink');
  if (knowledgeLink != null) {
    knowledgeLink.addEventListener('click', function (e) {
      chrome.tabs.create({
        url: 'https://kb.bit.tube'
      })
    })
  }

  const infoIcon = document.getElementById('infoIcon');
  if (infoIcon != null) {
    infoIcon.addEventListener('mouseenter', function (e) {
      document.getElementById('tooltipPaid').style.opacity = '1';
      document.getElementById('tooltipPaid').style.visibility = 'visible';
    });

    infoIcon.addEventListener('mouseleave', function (e) {
      document.getElementById('tooltipPaid').style.opacity = '0';
      document.getElementById('tooltipPaid').style.visibility = 'hidden';
    });
  }

  const closeSuggestions = document.getElementsByClassName('closeSuggestions');

  if (closeSuggestions != null && closeSuggestions.length > 0) {
    for (let i = 0; i < closeSuggestions.length; i++) {
      closeSuggestions[i].addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        const suggestion = this.getAttribute('data-suggestion');
        this.parentNode.classList.add('displayNone');
        localStorage.setItem(suggestion, 'closed');
        if (suggestion == 'referral') {
          document.getElementById('suggestionSecurity').classList.remove('displayNone');
          setTimeout(function (e) {
            document.getElementById('suggestionSecurity').style.opacity = '1';
            document.getElementById('suggestionSecurity').style.zIndex = '1';
          }, 500);

        }
      });
    }
  }

  if (document.getElementById('shareReferral') != null) {
    document.getElementById('shareReferral').addEventListener('click', function (e) {
      if (window.location.pathname != '/account.html') {
        localStorage.setItem('goToReferral', true);
        window.location.href = '/account.html'
      } else {
        document.getElementById('divAccountOptions').classList.add('displayNone');
        document.getElementById('divProfileReferral').classList.remove('displayNone');
        document.getElementById("divProfileReferral").style.animation = "panelLeft 0.4s ease";
        localStorage.setItem('goToReferral', false)
      }

    });
  }
  if (document.getElementById('suggestionSecurity') != null) {
    document.getElementById('suggestionSecurity').addEventListener('click', function (e) {
      if (window.location.pathname != '/account.html') {
        localStorage.setItem('goToSecurity', true);
        window.location.href = '/account.html';
      } else {
        document.getElementById('showSecurity').click();
        localStorage.setItem('goToSecurity', false)
      }
    })
  }

  if (document.getElementById('footerLink') != null) {
    document.getElementById('footerLink').addEventListener('click', function (e) {
      chrome.tabs.create({
        url: "https://bittube.app"
      })
    })
  }

  const deletePhoneNumber = document.getElementById('deletePhoneNumber');
  if (deletePhoneNumber != null) {
    deletePhoneNumber.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (this.getAttribute('data-request2fa') == 'false') {
        showConfirmDeleteNumberModal();
      } else if (this.getAttribute('data-request2fa') == 'true') {
        document.getElementById('mainDivBasicVerification').classList.add('displayNone');
        document.getElementById('divConfirm2FACode').classList.remove('displayNone');
        document.getElementById('divConfirm2FACode').style.animation = "listPop 0.7s ease";

      }
    })
  }

  const inputFile = document.getElementById('upload');
  if (inputFile != null) {
    inputFile.addEventListener('change', function () {

      document.getElementById("divCroppieImage").classList.add("cropping") // For margin
      document.getElementById('headerProfilePicture').classList.remove('displayNone');


      imageId = $(this).data('id');
      tempFilename = $(this).val()
      readFile(this);
    })
  }
  const uploadProfileImage = document.getElementById('uploadButton');
  if (uploadProfileImage != null) {
    uploadProfileImage.addEventListener('click', function (e) {
      // document.getElementById("divCroppieImage").classList.add("cropping") // For margin
      // document.getElementById('headerProfilePicture').classList.remove('displayNone');
      document.getElementById('upload').click();
    })
  }

  const cancelProfileImage = document.getElementById('cancelCrop');
  if (cancelProfileImage != null) {
    cancelProfileImage.addEventListener('click', function (e) {
      document.getElementById("divCroppieImage").classList.remove("cropping") // For margin
      document.getElementById('headerProfilePicture').classList.add('displayNone');
      $uploadCrop.croppie('destroy');
      showUserImageProfile();
      inputFile.value = '';
    })
  }

  const saveProfileImage = document.getElementById('cropImageBtn');
  if (saveProfileImage != null) {
    saveProfileImage.addEventListener('click', function (ev) {
      $uploadCrop.croppie('result', {
        type: 'base64',
        format: 'jpeg',
        size: {
          width: 200,
          height: 200
        }
      }).then(function (resp) {
        const storageRef = firebase.app().storage('gs://assets.bittube.network').ref().child('useravatars/' + firebase.auth().currentUser.uid);
        $('#logoheader').attr('src', resp);
        $('#imageUserProfile').attr('src', resp);
        localStorage.setItem('image', resp)
        storageRef.putString(resp, 'data_url').then(function (snapshot) {
          storageRef.getDownloadURL().then(function (url) {
            url = url.replace('https://firebasestorage.googleapis.com/v0/b/assets.bittube.network/o/', 'https://assets.bittube.network/').replace(/%2F/g, '/');
            firebase.auth().currentUser.updateProfile({
              photoURL: url
            }).then(() => {
              firebase.auth().currentUser.getIdToken().then((token) => {
                fetch('https://bittube.tv/api/notify-firebase-avatar-change', {
                  headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                  },
                  method: 'POST',
                  body: `token=${encodeURIComponent(token)}&photoURL=${encodeURIComponent(url)}`
                }).catch(_e => false);
                fetch('https://bittube.video/api/v1/users/firebase/avatar/sync', {
                  headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                  },
                  method: 'POST',
                  body: `token=${encodeURIComponent(token)}&photoURL=${encodeURIComponent(url)}`
                }).catch(_e => false);
              });
            });
          });
        });

        showUserImageProfile();
        $uploadCrop.croppie('destroy');
        inputFile.value = '';
      });
    });
  }
  const buttonBuyTubes = document.getElementById('buttonBuyTubes');
  if (buttonBuyTubes != null) {
    buttonBuyTubes.addEventListener('click', function () {
      //window.location.href = '/buytubes.html';
      chrome.tabs.create({
        url: "https://pay.bittube.cash/buytubes/index.html"
      });
    });
  }
  if (document.getElementById('twitter_login') != null) {
    document.getElementById('twitter_login').addEventListener('click', function (e) {
      startTwitterSignIn();
    });
  }
  if (document.getElementById('google_login') != null) {
    document.getElementById('google_login').addEventListener('click', function (e) {
      startGoogleSignIn();
    });
  }
  if (document.getElementById('facebook_login') != null) {
    document.getElementById('facebook_login').addEventListener('click', function (e) {
      startFacebookSignIn();
    });
  }

  if (document.getElementById('email') != null) {
    document.getElementById('email').addEventListener('focus', function () {
      removeErrors(this);
    });
  }


  if (document.getElementById('verifySecret') != null) {
    document.getElementById('verifySecret').addEventListener('focus', function () {
      removeErrors(this);
    });
  }

  if (document.getElementById('verifySecret') != null) {
    document.getElementById('verifySecret').addEventListener('keydown', function (e) {
      removeErrors(this);
      if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105) && e.keyCode != 8) {
        if (e.keyCode != 13) {
          e.preventDefault();
        } else if (e.keyCode == 13 && document.getElementById('verifySecret').getAttribute('data-action') == 'enable') {
          e.preventDefault();
          e.stopPropagation();
          document.getElementById('verifySecretButton').click();
        } else if (e.keyCode == 13 && document.getElementById('verifySecret').getAttribute('data-action') == 'disable') {
          e.preventDefault();
          e.stopPropagation();
          document.getElementById('disable2FA').click();
        }
      }
    });
  }

  if (document.getElementById('password') != null) {
    document.getElementById('password').addEventListener('focus', function () {
      removeErrors(this);
    });
  }

  if (document.getElementById('username') != null) {
    document.getElementById('username').addEventListener('focus', function () {
      removeErrors(this);
    });
  }

  if (document.getElementById('password') != null) {
    document.getElementById('password').addEventListener('focus', function () {
      removeErrors(this);
    });
  }

  if (document.getElementById('confirm_password') != null) {
    document.getElementById('confirm_password').addEventListener('focus', function () {
      removeErrors(this);
    });
  }

  if (document.getElementById('code') != null) {
    document.getElementById('code').addEventListener('focus', function () {
      removeErrors(this);
    });
  }
  if (document.getElementById('phone') != null) {
    document.getElementById('phone').addEventListener('focus', function () {
      removeErrors(this);
    });
  }

  if (document.getElementById('phone') != null) {
    document.getElementById('phone').addEventListener('keydown', function (e) {

      if (((e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105) && e.keyCode != 8) {
        if (e.keyCode != 13) {
          e.preventDefault();
        }

      }
    });
  }

  // MIMI !!

  // add event listener to form
  const registerButton = document.getElementById('registerButton');

  if (registerButton != null) {
    registerButton.addEventListener('click', function (e) {
      var form = document.getElementById("registerForm"),
        addedToFields = false;
      if (validateForm(e, form, addedToFields)) {
        if (checkUsername(document.getElementById('username').value)) {
          if (checkPasswords()) {
            showHideButtonLoader('registerButton', 'showLoader');
            registerUser(e);
          }
        }


      }

    });
  }

  const loginButton = document.getElementById('loginButton');
  if (loginButton != null) {
    loginButton.addEventListener('click', function (e) {
      var form = document.getElementById("loginForm"),
        addedToFields = false;
      if (validateForm(e, form, addedToFields)) {
        showHideButtonLoader('loginButton', 'showLoader');
        loginUser(e);
      }
    });
  }

  if (document.getElementById('requestCall') != null) {

    if (getCookie('buttondisable') != null) {
      disableButton60sec('requestCall');
    }
    document.getElementById('requestCall').addEventListener('click', function (e) {
      if (document.getElementById('phone').value != '') {
        setCookie60sec();
        disableButton60sec('requestCall');
        phoneVerification(e, 'call', 'requestCall');
      } else {
        const error = [i18next.t('fieldRequired')];
        const elementWithError = ['phone'];
        setErrors(error, elementWithError);
      }
    });
  }

  if (document.getElementById('verifyCodebutton') != null) {
    document.getElementById('verifyCodebutton').addEventListener('click', function (e) {
      if (document.getElementById('code').value != '') {
        showHideButtonLoader('verifyCodebutton', 'showLoader');
        verifyCode(e);
      } else {
        const error = [i18next.t('fieldRequired')];
        const elementWithError = ['code'];
        setErrors(error, elementWithError);
      }

    });
  }

  if (document.getElementById('recoveryButton') != null) {
    document.getElementById('recoveryButton').addEventListener('click', function (e) {
      var form = document.getElementById("recoveryForm"),
        addedToFields = false;
      if (validateForm(e, form, addedToFields)) {
        // showHideButtonLoader('recoveryButton', 'showLoader');
        setCookie60sec();
        disableButton60sec('recoveryPass');
        sendEmailRecoveryPass();
      }

    });
  }


  // creditCardPayment
  const creditCardPayment = document.getElementById('creditCardPayment');

  if (creditCardPayment != null) {
    creditCardPayment.addEventListener('click', function (e) {
      var form = document.getElementById("creditCarForm"),
        addedToFields = false;
      if (validateForm(e, form, addedToFields)) {
        // uncomment when we want to test it real please, this check that the number of the card is correct
        // if (checkCardNumber()){
        if (checkMinMaxAmount('coinSelect', 'selectCoin')) {
          const coinSelect = document.getElementById('coinSelect').value;
          const selectCoin = document.getElementById('selectCoin').value;
          const cryptoCoin = document.getElementById('cryptoCoin').value;
          const cardnumber = document.getElementById('cardnumber').value;
          const cardName = document.getElementById('cardName').value;
          generateBill(coinSelect, selectCoin, cryptoCoin, cardnumber, cardName);
        }

        // }

      }
    });
  }

  // input payment
  const inputPayment = document.getElementsByClassName('inputPayment');

  if (inputPayment != null && inputPayment.length > 0) {
    for (let i = 0; i < inputPayment.length; i++) {
      inputPayment[i].addEventListener('focus', function (e) {
        removeErrors(this);
      })
    }
  }


  if (document.getElementById('generateSecret') != null) {
    document.getElementById('generateSecret').addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      showHideButtonLoader('generateSecret', 'showLoader');
      generateSecret();

    });
  }


  const verifySecretButton = document.getElementById('verifySecretButton');
  if (verifySecretButton != null) {
    verifySecretButton.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      const from = 'verifySecret';
      showHideButtonLoader('verifySecretButton', 'showLoader');
      verifySecret(from);
    })
  }

  const disable2FA = document.getElementById('disable2FA');
  if (disable2FA != null) {
    disable2FA.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      const from = 'disable2FA';
      showHideButtonLoader('disable2FA', 'showLoader');
      verifySecret(from);
    })
  }


  const confirm2fa = document.getElementById('confirm2fa');
  if (confirm2fa != null) {
    confirm2fa.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      confirmDeletePhoneWith2fa();
      // const from = 'login2fa';
      // showHideButtonLoader('confirm2fa', 'showLoader');
      // verifySecret(from);
    })
  }

  // OPTIONS TABS

  const createNewMonthlyDonation = document.getElementById('createNewMonthlyDonation');
  if (createNewMonthlyDonation != null) {
    createNewMonthlyDonation.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      showNewMonthlyDonation();
    })
  }
}
/********************************************************/
/*           FUNCTIONS RELATED TO USER LOGIN            */
/********************************************************/
/**
 * Start the Twitter auth flow and authorizes to Firebase.
 * @param{boolean} interactive True if the OAuth flow should request with an interactive mode.
 */
function startTwitterAuth(interactive) {
  chrome.runtime.sendMessage({
    message: "twitterLogin"
  }, function (response) {
    const resultLogin = JSON.parse(response);
    if (resultLogin.result == 'Error') {
      displarModalErrorLogin(resultLogin.email);
    }
  });
}

/**
 * Starts the Twitter sign-in process.
 */
function startTwitterSignIn() {
  document.getElementById('twitter_login').disabled = true;
  if (firebase.auth().currentUser) {
    firebase.auth().signOut();
  } else {

    if (typeof (browser) != 'undefined') {
      browser.runtime.sendMessage({
        message: "twitterLogin"
      }).then((response) => {
        // // console.log('SEND MESSAGE TWITTER LOGIN')
        // const resultLogin = JSON.parse(response);
        // if (resultLogin.result == 'Error'){
        //   displarModalErrorLogin(resultLogin.email);
        // }
      });
    } else {
      chrome.runtime.sendMessage({
        message: "twitterLogin"
      }, function (response) {
        const resultLogin = JSON.parse(response);
        if (resultLogin.result == 'Error') {
          displarModalErrorLogin(resultLogin.email);
        }
      });
    }

  }
}

/**
 * Start the Google auth flow and authorizes to Firebase.
 * @param{boolean} interactive True if the OAuth flow should request with an interactive mode.
 */
function startGoogleAuth(interactive) {

  chrome.runtime.sendMessage({
    message: "googleLogin",
    interactive: interactive
  }, function (response) {
    const resultLogin = JSON.parse(response);
    if (resultLogin.result == 'Error') {
      displarModalErrorLogin(resultLogin.email);
    }
  });
}

/**
 * Starts the Google sign-in process.
 */
function startGoogleSignIn() {
  document.getElementById('google_login').disabled = true;
  if (firebase.auth().currentUser) {
    firebase.auth().signOut();
  } else {
    startGoogleAuth(true);
  }
}

/**
 * Start the Facebook auth flow and authorizes to Firebase.
 * @param{boolean} interactive True if the OAuth flow should request with an interactive mode.
 */
function startFacebookAuth(interactive) {
  chrome.runtime.sendMessage({
    message: "facebookLogin"
  }, function (response) {
    const resultLogin = JSON.parse(response);
    if (resultLogin.result == 'Error') {
      displarModalErrorLogin(resultLogin.email);
    }
  });
}

/**
 * Starts the Facebook sign-in process.
 */
function startFacebookSignIn() {
  document.getElementById('facebook_login').disabled = true;
  if (firebase.auth().currentUser) {
    firebase.auth().signOut();
  } else {
    // startFacebookAuth(true);
    chrome.runtime.sendMessage({
      message: "facebookLogin"
    }, function (response) {
      const resultLogin = JSON.parse(response);
      if (resultLogin.result == 'Error') {
        displarModalErrorLogin(resultLogin.email);
      }
    });
  }
}

// Function fires a popup to inform the user that the email has been registered with another credentials or another social login
// Param email => To fill the information about the email inside of the modal
function displarModalErrorLogin(email) {
  const instanceModalLogin = mobiscroll.popup('#errorLogin', {
    display: 'center',
    closeOnOverlayTap: false,
    cssClass: 'popUpResendEmail',
    buttons: [{
      text: 'OK',
      cssClass: 'buttonModdal',
      handler: function (event, inst) {
        stop_counter = true;
        inst.hide();
      }
    }],
    onBeforeShow: function (ev, inst) {
      document.getElementById('userLoginEmail').textContent = email;
    }
  });

  instanceModalLogin.show();
}


// function to login user by credentials email and password
function loginUser(event) {
  event.preventDefault();
  event.stopPropagation();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // As httpOnly cookies are to be used, do not persist any state client side.
  // firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);

  firebase.auth().signInWithEmailAndPassword(email, password).then(function (res) {
    // console.log('signInWithEmailAndPassword ******************')
    // console.log(res);
  }).catch(function (error) {
    if (error.code == 'auth/user-not-found' || error.code == 'auth/wrong-password' || error.code == 'auth/invalid-email') {
      const errorsTranslate = i18next.t('validateForm.emailPasswordWrong');
      const errors = [errorsTranslate, errorsTranslate];
      const elementsWithErrors = ['email', 'password'];
      setErrors(errors, elementsWithErrors)
    }
    showHideButtonLoader('loginButton', 'hideLoader');
  });
}

function sendRequest(idToken, csrfToken) {
  // https://us-central1-bittube-airtime-extension.cloudfunctions.net/app/
  // http://localhost:5001/bittube-airtime-extension/us-central1/app/sessionLogin
  const url = functionBaseURL + '/app/sessionLogin';
  const data = 'idToken=' + idToken + '&csrfToken=' + encodeURIComponent(csrfToken.toString());
  sendPostRequest(url, data, null, idToken, function (user, response) {
    const result = JSON.parse(response);
    // console.log("response:", result);
    if (result.status == 'success') {
      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
      window.location.href = '/airtime.html';
    }
  });
}

function checkUserChannelNotification() {
  // GET CHANNEL ID FOR NOTIFICATIONS AND SAVE IT TO DB
  const channel = localStorage.getItem('channel');
  if (channel != null && channel != 'null') {
    const url = functionBaseURL + '/app/saveNotificationChannel?uid=' + firebase.auth().currentUser.uid + '&channelid=' + channel;
    const from = 'updateChannel';
    userDataRequest(url, from);
  }

}

const userInfo = async () => {
  try {
    const token = await getFirebaseToken();
    const url = functionBaseURL + '/app/userinfo';
    sendGetRequest(url, token, function (user, response) {
      const userInfo = JSON.parse(response);

      if (userInfo.result == true) {
        localStorage.setItem('uuid', userInfo.uuid);
        getBotScore(userInfo.uuid);
        if (window.location.pathname == '/confirmtx.html') {
          fetchTUBEValue(localStorage.getItem('currencySelected')).then(function (responseFetch) {
            if (responseFetch != undefined) {
              let currencySymb = responseFetch.currency;
              switch (responseFetch.currency) {
                case 'USD':
                  currencySymb = '&dollar;'
                  break;
                case 'AUD':
                  currencySymb = 'A&dollar;'
                  break;
                case 'GBP':
                  currencySymb = '&pound;'
                  break;
                case 'NZD':
                  currencySymb = 'N&dollar;'
                  break;
                case 'EUR':
                  currencySymb = '&euro;'
                  break;
              }
              const result = (new Number(localStorage.getItem('ammontToDonate')) * new Number(responseFetch.value)).toFixed(2) + ' ' + currencySymb;
              document.getElementById('spanFiatAmountConfirm').innerHTML = result;
              document.getElementById('spanFiatAmountConfirmMonthly').innerHTML = result;
            }
          });
        } else if (window.location.pathname == '/airtime.html') {
          // document.getElementById('userGUID').innerText = localStorage.getItem('uuid').toUpperCase();
          fillButtonDonate(10);
          fillMarketData();

          if (localStorage.getItem('chart') != null && localStorage.getItem('chart') != 'airtimeValue') {
            // showCoinValueTab();
            hideLoaderChart();
          } else {
            showAirtimeValueTab();
          }

          if (localStorage.getItem('dataChart') == null || localStorage.getItem('dataChart') == undefined) {
            localStorage.setItem('dataChart', '7days');
          }

          firebase.auth().currentUser.getIdToken().then(function (token) {
            sendGetRequest(functionBaseURL + '/app/getTotalEarnings', token, function (user, response) {
              const totalEarnings = JSON.parse(response);
              if (totalEarnings.result == 'Success') {
                for (var i = 0; i < totalEarnings.total.length; i++) {
                  totalUserEarnings += convert(totalEarnings.total[i]); //parseFloat(convert(totalEarnings.total[i])).toFixed(2);
                }
                fetchTUBEValue(localStorage.getItem('currencySelected')).then(function (responseFetch) {
                  if (responseFetch != undefined) {
                    let currencySymb = responseFetch.currency;
                    switch (responseFetch.currency) {
                      case 'USD':
                        currencySymb = '&dollar;'
                        break;
                      case 'AUD':
                        currencySymb = 'A&dollar;'
                        break;
                      case 'GBP':
                        currencySymb = '&pound;'
                        break;
                      case 'NZD':
                        currencySymb = 'N&dollar;'
                        break;
                      case 'EUR':
                        currencySymb = '&euro;'
                        break;
                    }
                    document.getElementById('spanPaidBalance').innerHTML = totalUserEarnings.toFixed(2) + ' <i class="icon-font-tube tubeFont10"></i> / <span id="actualValueEarnings"> ' + (totalUserEarnings * responseFetch.value).toFixed(2) + ' ' + currencySymb + '</span>';
                    document.getElementById('loadingPaid').classList.add('displayNone');
                    document.getElementById('spanPaidBalance').classList.remove('displayNone');
                  }
                });
                gotTotalEarnings = true;
              } else {
                gotTotalEarnings = true;
                totalUserEarnings = 0;
              }
            });
          });
          if (airtimeActive == true) {
            getAirtimeStatistics(userInfo.uuid)
          } else {
            fillData(['0', '0', '0', '0', '0', '0', '0']);
            fillChart();
          }

        }

      } else {
        localStorage.setItem('uuid', '');
      }
    })
  } catch (err) {
    console.error('Error getting user info ', err)
  }
}

function checkUserAirtimeExists(provider) {
  // https://us-central1-bittube-airtime-extension.cloudfunctions.net/app/
  switch (provider) {
    case 'twitter.com':
      const from = 'checkUserAirtimeExists'
      const url = functionBaseURL + '/app/checkLogedInOnUserAirtime?username=' + localStorage.getItem('aditional_info') + '&domain=twitter';
      userDataRequest(url, from);
      break;
    case 'facebook.com':
      // const from = 'checkUserAirtimeExists'
      // const url = 'http://localhost:5001/bittube-airtime-extension/us-central1/app/checkLogedInOnUserAirtime?username='+localStorage.getItem('aditional_info') + '&domain=facebook';
      // userDataRequest(url, from);
      break;
  }
}

/********************************************************/
/*         END FUNCTIONS RELATED TO USER LOGIN          */
/********************************************************/

// Function to register the user.
function registerUser(event) {
  event.preventDefault();
  event.stopPropagation();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const username = document.getElementById('username').value;
  localStorage.setItem('username', username)
  // create user with email and password
  firebase.auth().createUserWithEmailAndPassword(email, password).then(function (response) {

    if (response.operationType == 'signIn') {
      showHideButtonLoader('registerButton', 'hideLoader');
      // saveUserDataToDB();
      // window.location.href = '/airtime.html';
    }
  }).catch(function (error) {
    if (error.code == 'auth/email-already-in-use') {
      const errorsTranslate = i18next.t('validateForm.emailInUse');
      const errors = [errorsTranslate];
      const elementsWithErrors = ['email'];
      setErrors(errors, elementsWithErrors);
      showHideButtonLoader('registerButton', 'hideLoader');
    }
  });


}

// const saveUserDataToDB = async () => {
//   const url = functionBaseURL + '/app/saveUserData';
//   const data = {
//     displayname: localStorage.getItem('username'),
//     referredbykey: (localStorage.getItem('referredbykey') ? localStorage.getItem('referredbykey') : ''),
//   }
//   console.log('Calling saveUserData !!! ', data)
//   await firebaseXhr(url, encodeURIComponent(JSON.stringify(data)));
// }

// function setErrors
// Param errors =>  array with the error text.
// Param elemenstWithErros => Array with the elements which has an error and need to append the message
function setErrors(errors, elementsWithErrors) {
  if (errors.length == elementsWithErrors.length) {
    for (let i = 0; i < errors.length; i++) {
      errorMsg = document.createElement('span');
      errorMsg.className = 'mbsc-err-msg';
      errorMsg.innerHTML = errors[i];

      document.getElementById(elementsWithErrors[i]).parentNode.appendChild(errorMsg);
      document.getElementById(elementsWithErrors[i]).parentNode.parentNode.classList.add('mbsc-err');

    }
  }
}

// Function remove the errors when the element has focus.
// Params element -> to remove the errors from the right element.
function removeErrors(element) {
  element.classList.remove('errorInput');
  element.parentNode.parentNode.classList.remove('mbsc-err');
  const errorMsg = element.parentNode.querySelector('.mbsc-err-msg');
  if (errorMsg != null) {
    element.parentNode.removeChild(errorMsg);
  }
}

const userOptions = async () => {
  try {
    const url = functionBaseURL + '/app/getUserOptions';
    let userOptions = await firebaseXhr(url);
    userOptions = JSON.parse(userOptions)
    if (userOptions.success) {
      localStorage.setItem("user_options", userOptions);
      showUserOptions(userOptions);
    }
  } catch (err) {
    console.log('Error getting user options', err)
  }
}


function userAccount() {
  try {
    const url = functionBaseURL + '/app/getUserAccount';
    firebase.auth().currentUser.getIdToken().then(function (token) {
      sendGetRequest(url, token, function (user, response) {
        const userAccountResult = JSON.parse(response);
        if (userAccountResult.result == 'Success') {
          if (userAccountResult.data.length > 0) {
            if (userAccountResult.data[0].markForDelete == undefined || userAccountResult.data[0].markForDelete == false) {
              if (userAccountResult.data[0].status == 'complete') {
                localStorage.setItem('userAccountLinked', true);
                document.getElementById('bankName').innerText = userAccountResult.data[0].account_name;
                document.getElementById('accountUserName').innerText = userAccountResult.data[0].first_name + ' ' + userAccountResult.data[0].last_name;
                document.getElementById('bankIBAN').innerText = userAccountResult.data[0].IBAN; //maskIBAN(userAccountResult.data.IBAN);
              }
            } else {
              localStorage.setItem('userAccountLinked', false);
            }

          } else {
            localStorage.setItem('userAccountLinked', false);
          }
        } else {
          localStorage.setItem('userAccountLinked', false);
        }

      });
    });

  } catch (ex) {
    // console.log('Execption getting user Account ==> ', ex);
  }
}

const getUserSecurity = async () => {
  const claims = await getFirebaseClaims();
  if (claims.has2FA) {
    document.getElementById('verifySecret').setAttribute('data-action', 'disable');
    document.getElementById('divGenerateSecret').classList.add('displayNone');
    document.getElementById('divInput2FA').classList.remove('displayNone');
    document.getElementById('textDisable2FA').classList.remove('displayNone');
    document.getElementById('titleSecurityPage').classList.remove('displayNone');
    document.getElementById('divInput2FA').classList.remove('marginTop45');
    document.getElementById('divInput2FA').classList.add('marginTop12');
    document.getElementById('disable2FA').classList.remove('displayNone');
    document.getElementById('divQRCode').classList.add('displayNone');
    document.getElementById('divProfileQR').classList.remove('displayNone');
    document.getElementById('verifySecretButton').classList.add('displayNone');
    document.getElementById('deletePhoneNumber').setAttribute('data-request2fa', 'true');
  } else {
    document.getElementById('verifySecret').setAttribute('data-action', 'enable');
    document.getElementById('divGenerateSecret').classList.remove('displayNone');
    document.getElementById('divInput2FA').classList.add('displayNone');
    document.getElementById('textDisable2FA').classList.add('displayNone');
    document.getElementById('titleSecurityPage').classList.add('displayNone');
    document.getElementById('disable2FA').classList.add('displayNone');
    document.getElementById('verifySecretButton').classList.remove('displayNone');
    document.getElementById('deletePhoneNumber').setAttribute('data-request2fa', 'false');
  }
}

function getUserPhoneNumber() {
  const url = functionBaseURL + '/app/getUserPhoneNumber';
  const from = 'getUserPhoneNumber'
  userDataRequest(url, from);
}


function showUserOptions(data) {
  showHideReferralSection();
  const element = document.getElementById('referral_link');
  if (element) {
    document.getElementById('loadingReferral').classList.add('displayNone');
    if (data.referralkey == undefined || data.referralkey == 'undefined') {
      userOptions();
    } else {
      element.value = 'bittube.app/?ref?' + data.referralkey;
    }
  }
  const buttonCopyRefLink = document.getElementById('buttonCopyRefLink');
  if (buttonCopyRefLink) {
    buttonCopyRefLink.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      const url = 'https://' + element.value;
      const selBox = document.createElement('textarea');
      selBox.style.position = 'fixed';
      selBox.style.left = '0';
      selBox.style.top = '0';
      selBox.style.opacity = '0';
      selBox.value = url;
      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      document.execCommand('copy');
      document.body.removeChild(selBox);

      showHideButtonLoader('buttonCopyRefLink', 'showLoader');
      setTimeout(function (e) {
        showHideButtonLoader('buttonCopyRefLink', 'hideLoader');
      }, 500);

    });
  }
}

const firebaseFunc = (method, options = {}) => {
  const api = functionBaseURL + '/app';
  return firebase.auth().currentUser.getIdToken().then(token => {
    const url = new URL(`${api}/${method}`);
    if (options.query) Object.keys(options.query).forEach(k => url.searchParams.append(k, options.query[k]));
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    return fetch(url, Object.assign({
      headers
    }, options));
  })
}

function userDataRequest(url, from, platform = '') {

  if (firebase.auth().currentUser != undefined) {
    firebase.auth().currentUser.getIdToken().then(function (token) {
      // // console.log('Sending request to', url , 'with ID token in Authorization header.');
      // // console.log(token);
      var req = new XMLHttpRequest();
      req.onload = function () {
        //// console.log('from ==> ' + from);
        //// console.log(req.responseText);

        const uid = firebase.auth().currentUser.uid;
        const email = firebase.auth().currentUser.email;
        let phoneNumber;
        let countrycode;
        if (document.getElementById('phone') != null && window.location.pathname == '/account.html') {
          phoneNumber = document.getElementById('phone').value;
          countrycode = document.getElementById('countryExtension').textContent.replace(' ', '').replace('+', '');
        }

        let error;
        let elementWithError;

        switch (from) {

          case 'checkNumberExists':
            if (req.responseText == 'phoneAlreadyInUse') {
              error = [i18next.t('phoneAlreadyUse')];
              elementWithError = ['phone'];
              setErrors(error, elementWithError);
              // stop_counter = true;
            } else if (req.responseText == 'phoneDoesntExist') {

              sendCode(countrycode, phoneNumber, 'sms');
              // stop_counter = true;
            }

            break;
          case 'sendCode':
            if (req.responseText == 'invalidPhone') {
              stop_counter = true;
              error = [i18next.t('phoneNumberInvalid')];
              elementWithError = ['phone'];
              setErrors(error, elementWithError);
              showHideButtonLoader('requestCall', 'hideLoader');
            } else if (req.responseText == 'processComplete') {
              document.getElementById('divRegisterPhoneNumber').classList.add('displayNone');
              document.getElementById('verifyCode').classList.remove('displayNone');
              document.getElementById('verifyCode').style.animation = "listPop 0.7s ease";
              document.getElementById('userNumber').innerText = '+' + countrycode + phoneNumber
              showHideButtonLoader('requestCall', 'hideLoader');
            }

            break;
          case 'getUserWallet':
            try {
              const bytes = CryptoJS.AES.decrypt(req.responseText, token);
              const walletInfo = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
              var onlinewallet = walletInfo.wallets.onlinewallet;
              //// console.log(onlinewallet);
              onlinewallet.public_addr = cnUtil.pubkeys_to_string(onlinewallet.spend.pub, onlinewallet.view.pub);
              getAddressInfo(onlinewallet.public_addr, onlinewallet.view.sec);
            } catch (ex) {
              // // console.log(req.responseText);
            }
            break;
          case 'updateChannel':
            if (req.responseText == 'channelHasBeenSave' && window.location.pathname == '/register.html') {
              window.location.href = '/airtime.html';
            }
            break;
          case 'saveUserNotify':
            if (req.responseText == 'userNotifySaveSuccess') {
              stop_counter = true;
            }
            break;
          case 'saveUserSocialLoginNotify':
            if (req.responseText == 'userNotifySaveSuccess') {
              //localStorage.removeItem('aditional_info');
            }
            break;
          case 'checkUserAirtime':
            const response = JSON.parse(req.response);
            if (response.message == 'saveUserToLocalDB') {
              chrome.runtime.sendMessage({
                message: 'SaveUserToLocalDB',
                username: response.username,
                domain: response.domain
              });
            }
            break;
          case 'purchaseWithPayPal':
            if (req.responseText != 'error') {
              chrome.tabs.create({
                url: req.responseText
              });
            } else {

            }
            break;
          case 'purchaseCrypto':
            // console.log(req.responseText);
            if (req.responseText != 'error') {
              chrome.tabs.create({
                url: req.responseText
              });
            } else {

            }
            break;
            // case 'disable2FA':
            //   showHideButtonLoader('disable2FA', 'hideLoader');
            //   if (req.responseText == 'Verfied status false') {
            //     const error = [i18next.t('the2FANotCorrect')];
            //     const inputWithError = ['verifySecret'];
            //     setErrors(error, inputWithError);
            //   } else if (req.responseText == 'SecurityDisable') {
            //     document.getElementById('deletePhoneNumber').setAttribute('data-request2fa', 'false');
            //     document.getElementById('divGenerateSecret').classList.remove('displayNone');
            //     document.getElementById('divProfileQR').classList.add('displayNone');
            //     document.getElementById('divInput2FA').classList.add('displayNone');
            //     document.getElementById('textDisable2FA').classList.add('displayNone');
            //     document.getElementById('divInput2FA').classList.remove('marginTop20');
            //     document.getElementById('divInput2FA').classList.add('marginTop45');
            //     document.getElementById('disable2FA').classList.add('displayNone');
            //     document.getElementById('verifySecretButton').classList.remove('displayNone');
            //     document.getElementById('verifySecret').value = '';
            //     document.getElementById('divQRCode').classList.remove('displayNone');
            //     document.getElementById('divProfileQR').classList.remove('displayNone');
            //     // document.getElementById('2faqrcode').classList.remove('displayNone');

            //   }
            //   break;

          case 'login2fa':
            showHideButtonLoader('confirm2fa', 'hideLoader');
            if (req.responseText == 'correctCode') {
              localStorage.setItem('deletephone', 'true');
              window.location.href = '/account.html';
            } else if (req.responseText == 'Verfied status false') {
              const error = [i18next.t('the2FANotCorrect')];
              const inputWithError = ['verifySecretDeletePhone'];
              setErrors(error, inputWithError);
            }
            break;
          case 'getUserPhoneNumber':
            populateUserHasPhoneNumber(req.responseText);
            break;

          case 'verifyAccount':
            const result = JSON.parse(req.responseText);
            // console.log(result);
            if (result.success == 'newToken') {
              chrome.cookies.set({
                "name": "uid",
                "url": functionBaseURL,
                "value": result.uid
              }, function (cookie) {
                // console.log(JSON.stringify(cookie));
                // console.log(chrome.extension.lastError);
                // console.log(chrome.runtime.lastError);
              });

              chrome.cookies.set({
                "name": "channelId",
                "url": functionBaseURL,
                "value": result.channel_id
              }, function (cookie) {
                // console.log(JSON.stringify(cookie));
                // console.log(chrome.extension.lastError);
                // console.log(chrome.runtime.lastError);
              });

              chrome.cookies.set({
                "name": "platform",
                "url": functionBaseURL,
                "value": platform
              }, function (cookie) {
                // console.log(JSON.stringify(cookie));
                // console.log(chrome.extension.lastError);
                // console.log(chrome.runtime.lastError);
              });

              chrome.tabs.create({
                url: result.link
              });
            } else if (result.success == 'tokenExists') {
              chrome.tabs.create({
                url: result.link
              });
            }

            break;

          case 'getLinkedAccounts':
            // console.log(req.responseText)
            const resultGetLinkedAccounts = JSON.parse(req.responseText);
            if (resultGetLinkedAccounts.message == 'success') {
              document.getElementById('ulLinkedAccounts').innerHTML = '';
              fillUserLinkedAccounts(resultGetLinkedAccounts.data);
            } else if (resultGetLinkedAccounts.message == 'No linked accounts') {
              document.getElementById('loaderAccounts').classList.add('displayNone');
              document.getElementById('divNoLinkedAccounts').classList.remove('displayNone');
            }
            break;

          case 'confirmUnlinkAccount':
            const resultUnlinkAccount = JSON.parse(req.responseText);
            if (resultUnlinkAccount.message == 'success') {
              getUserLinkedAccounts();
              instancePopupConfirm.hide();
            }
            break;
          default:
            break;
        }
      }.bind(this);
      req.onerror = function () {
        // console.log('There was an error');
      }.bind(this);
      req.open('GET', url, true);
      req.setRequestHeader('Authorization', 'Bearer ' + token);
      req.send();
    }.bind(this));
  }

};

const populateUserHasPhoneNumber = async (response) => {
  const claims = await getFirebaseClaims();
  if (response != 'userHasNotPhoneNumber') {
    document.getElementById('userPhone').value = '+' + response;
    if (!claims.hasPhone) {
      document.getElementById('deletePhoneNumber').classList.add('displayNone');
      document.getElementById('verifyByPhoneNumber').classList.remove('displayNone');
      if (claims.verified) {
        if (document.getElementById('showReferral') != null) {
          document.getElementById('showReferral').classList.remove('displayNone')
        }
      }
    } else {
      if (document.getElementById('showReferral') != null) {
        document.getElementById('showReferral').classList.remove('displayNone')
      }
    }
  } else {
    if (!claims.hasPhone) {
      document.getElementById('deletePhoneNumber').classList.add('displayNone');
      document.getElementById('verifyByPhoneNumber').classList.remove('displayNone');
      if (claims.verified) {
        if (document.getElementById('showReferral') != null) {
          document.getElementById('showReferral').classList.remove('displayNone')
        }
      }
    } else {
      if (document.getElementById('showReferral') != null) {
        document.getElementById('showReferral').classList.remove('displayNone')
      }
    }


    if (document.getElementById('showReferral') != null) {
      if (!claims.verified) {
        document.getElementById('showReferral').classList.add('displayNone');
      } else {
        document.getElementById('showReferral').classList.remove('displayNone');
      }
    }
  }
}

function flagBotResult(result) {
  var suspicionFlagDiv = document.getElementById('suspicionFlag');
  if (result) {
    if (!suspicionFlagDiv)
      document.getElementById('airtimeMessagesContainer').innerHTML += '<div class="airtimeMessage" id="suspicionFlag"></div>';
    suspicionFlagDiv = document.getElementById('suspicionFlag');
    suspicionFlagDiv.innerHTML = i18next.t('suspiciousText1') + ' <br> ' + i18next.t('suspiciousText2');
    suspicionFlagDiv.style.backgroundColor = '#F77211';

    if (document.getElementById('airtimeMessagesContainer').style.top == '70px' || document.getElementById('airtimeMessagesContainer').style.top == '') {
      document.getElementById('airtimeMessagesContainer').style.top = '96px';
      document.getElementById('airtimeMessagesContainer').style.opacity = '1';
    }
    suspicionFlagDiv.style.opacity = '1';
    document.getElementById('logoheader').src = 'assets/images/suspiciousActivity.svg ';
  } else {
    if (suspicionFlagDiv)
      suspicionFlagDiv.style.opacity = '0';

    let imageSrc;
    if (localStorage.getItem('image') != null && localStorage.getItem('image') != 'null') {
      imageSrc = localStorage.getItem('image')
    } else {
      imageSrc = firebase.auth().currentUser.photoURL;
    }

    if (document.getElementById('logoheader') != null) {
      document.getElementById('logoheader').onload = function (e) {
        document.getElementById('logoheader').onload = null;
        getBase64Image(document.getElementById('logoheader'));
      };
      document.getElementById('logoheader').src = imageSrc;
    }

    if (document.getElementById('imageUserProfile') != null) {
      document.getElementById('imageUserProfile').src = imageSrc;
    }

  }
}

function getBotScore(uuid) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `${airtimeBaseURL}/airtime-stats/botScore?uuid=${uuid}`);
  xhr.onload = function (error, response) {
    var result = JSON.parse(xhr.responseText).isBot;
    if (result)
      flagBotResult(true);
    else
      flagBotResult(false);
  }
  xhr.send()
}

function getAddressInfo(public_address, view_key) {
  var data = {}
  data.address = public_address;
  data.view_key = view_key;
  delay_seconds = 3;
  sendPostRequest(`${localStorage.getItem('wallet_server')}/tube4/get_address_info`, JSON.stringify(data), 'application/json;charset=UTF-8', null, function (user, response) {
    var response_data = JSON.parse(response);
    var dheight = response_data.blockchain_height - response_data.scanned_block_height;
    var syncWalletDiv = document.getElementById('syncWallet');
    // if (dheight > 0)
    // {
    //   if(!syncWalletDiv)
    //   document.getElementById('airtimeMessagesContainer').innerHTML += '<div class="airtimeMessage" id="syncWallet"></div>';
    //   syncWalletDiv = document.getElementById('syncWallet');
    //   syncWalletDiv.innerHTML =  i18next.t('yourAccountCatching')+ ' ( ' +`${dheight}` + ' ' +  i18next.t('blocksBehind') + ' ).';
    //   // syncWalletDiv.style.display ='block';
    //   syncWalletDiv.style.backgroundColor = '#00abff';

    //   if ( document.getElementById('airtimeMessagesContainer').style.top == '70px' || document.getElementById('airtimeMessagesContainer').style.top == ''){
    //     document.getElementById('airtimeMessagesContainer').style.top = '95px';
    //     document.getElementById('airtimeMessagesContainer').style.opacity = '1';
    //   }
    //   syncWalletDiv.style.opacity = '1';

    //   setTimeout(function(){
    //     getAddressInfo(public_address, view_key);
    //   },delay_seconds*1000);
    // }
    // else
    // {
    //   if(document.getElementById('syncWallet'))
    //     document.getElementById('syncWallet').style.opacity ='0';

    //   if (typeof(browser) == 'undefined'){
    //     if ( document.getElementById('airtimeMessagesContainer').style.top == '95px' && (getCookie(firebase.auth().currentUser.email) == null || getCookie(firebase.auth().currentUser.email) == 'true')){
    //       document.getElementById('airtimeMessagesContainer').style.top = '70px';
    //       document.getElementById('airtimeMessagesContainer').style.opacity = '0';
    //     }
    //   }else{

    //     getCookieFf(firebase.auth().currentUser.email, function(cookieValue){
    //       if ( document.getElementById('airtimeMessagesContainer').style.top == '95px' && (cookieValue == null || cookieValue == 'true')){
    //         document.getElementById('airtimeMessagesContainer').style.top = '70px';
    //         document.getElementById('airtimeMessagesContainer').style.opacity = '0';
    //       }
    //     })

    //   }


    // }
  });
}

const checkUserSuggestions = async () => {
  const referralSugestion = localStorage.getItem('referral');
  const suggestion2fa = localStorage.getItem('2FA');
  const claims = await getFirebaseClaims();
  if (referralSugestion != 'closed') {
    document.getElementById('shareReferral').style.opacity = '1';
    document.getElementById('shareReferral').style.zIndex = '1';
    document.getElementById('userSuggestions').style.zIndex = '2';
    document.getElementById('shareReferral').classList.remove('displayNone');
  } else {
    document.getElementById('shareReferral').classList.add('displayNone');
    if (suggestion2fa != 'closed' && !claims.has2FA) {
      document.getElementById('suggestionSecurity').classList.remove('displayNone');
      document.getElementById('userSuggestions').style.zIndex = '2';
      setTimeout(function (e) {
        document.getElementById('suggestionSecurity').style.opacity = '1';
        document.getElementById('suggestionSecurity').style.zIndex = '1';
      }, 500);
    } else {
      document.getElementById('suggestionSecurity').classList.add('displayNone');
    }
  }
}

function checkUserWallet(uid) {
  firebase.auth().currentUser.getIdToken().then(function (token) {
    sendGetRequest(functionBaseURL + '/app/checkWallet', token, function (user, response) {
      if (response.startsWith("No")) {
        createUserWallet(uid);
      } else {
        getUserWallet(uid);
      }
    });
  });

}

function createUserWallet(uid) {
  firebase.auth().currentUser.getIdToken().then((token) => {
    //Generate Seed and Keys for online wallet
    var online_seed = cnUtil.rand_32();
    var online_params = cnUtil.create_address(online_seed);
    online_params.seed = mn_encode(online_seed);
    //Generate Seed and Keys for card wallet
    var card_seed = cnUtil.rand_32();
    var card_params = cnUtil.create_address(card_seed);
    card_params.seed = mn_encode(card_seed);
    //make a new object containing both wallets
    var params = {};
    params.cardwallet = card_params;
    params.onlinewallet = online_params;
    var encrypted = CryptoJS.AES.encrypt(JSON.stringify(params), token);
    const url = functionBaseURL + '/app/createWallet';
    var data = 'encryptedWallet=' + encodeURIComponent(encrypted.toString());
    sendPostRequest(url, data, null, token, function (user, response) {
      //// console.log("response:", response);
      getUserWallet(user.uid);
    });
  });
}

function getUserWallet() {
  const url = functionBaseURL + '/app/returnWallet';
  const from = 'getUserWallet';
  userDataRequest(url, from);
}

const generateSecret = async (uid) => {
  const url = functionBaseURL + '/app/generateSecret';
  const token = await getFirebaseToken();
  const claims = await getFirebaseClaims();
  sendGetRequest(url, token, async (user, response) => {
    const data = JSON.parse(response);
    showHideButtonLoader('generateSecret', 'hideLoader');
    if (!claims.hasPhone) {
      if (!claims.verified) {
        document.getElementById('deletePhoneNumber').classList.add('displayNone');
        document.getElementById('verifyByPhoneNumber').classList.remove('displayNone');
      }
    }
    document.getElementById('deletePhoneNumber').classList.add('displayNone');
    document.getElementById('verifyByPhoneNumber').classList.remove('displayNone');
    document.getElementById('2faqrcode').src = data.qrcode;
    document.getElementById('hashQRCode').textContent = data.base32;
    document.getElementById('divProfileQR').classList.remove('displayNone');
    document.getElementById('divQRCode').classList.remove('displayNone');
    document.getElementById('divGenerateSecret').classList.add('displayNone');
    document.getElementById('divInput2FA').classList.remove('displayNone');
    document.getElementById('textDisable2FA').classList.add('displayNone');
    document.getElementById('titleSecurityPage').classList.add('displayNone');
    document.getElementById('divInput2FA').classList.add('marginTop45');
    document.getElementById('divInput2FA').classList.remove('marginTop12');
    document.getElementById('disable2FA').classList.add('displayNone');
    document.getElementById('verifySecretButton').classList.remove('displayNone');
  })

}





const verifySecret = async (from) => {
  const userToken = document.getElementById('verifySecret').value;
  const url = functionBaseURL + '/app/verifySecret?userToken=' + userToken + '&action=' + from;
  const token = await getFirebaseToken();
  const claims = await getFirebaseClaims();
  sendGetRequest(url, token, async (user, response) => {
    showHideButtonLoader('verifySecretButton', 'hideLoader');
    if (response == 'Verfied status false') {
      const error = [i18next.t('the2FANotCorrect')];
      const inputWithError = ['verifySecret'];
      setErrors(error, inputWithError);
    } else if (response == 'SecurityEnable') {
      if (!claims.hasPhone) {
        if (!claims.verified) {
          document.getElementById('deletePhoneNumber').classList.remove('displayNone');
          document.getElementById('verifyByPhoneNumber').classList.add('displayNone');
        } else {
          document.getElementById('deletePhoneNumber').classList.remove('displayNone');
          document.getElementById('verifyByPhoneNumber').classList.add('displayNone');
        }
      } else {
        document.getElementById('deletePhoneNumber').classList.remove('displayNone');
        document.getElementById('verifyByPhoneNumber').classList.add('displayNone');
      }

      document.getElementById('deletePhoneNumber').setAttribute('data-request2fa', 'true');
      document.getElementById('divGenerateSecret').classList.add('displayNone');
      document.getElementById('divProfileQR').classList.remove('displayNone');
      document.getElementById('divQRCode').classList.add('displayNone');
      document.getElementById('2faqrcode').removeAttribute('src');
      document.getElementById('hashQRCode').textContent = '';
      document.getElementById('verifySecret').value = '';
      document.getElementById('divInput2FA').classList.remove('displayNone');
      document.getElementById('textDisable2FA').classList.remove('displayNone');
      document.getElementById('titleSecurityPage').classList.remove('displayNone');
      document.getElementById('divInput2FA').classList.remove('marginTop45');
      document.getElementById('divInput2FA').classList.add('marginTop12');
      document.getElementById('disable2FA').classList.remove('displayNone');
      document.getElementById('verifySecretButton').classList.add('displayNone');
    } else if (response === 'SecurityDisable') {
      document.getElementById('deletePhoneNumber').setAttribute('data-request2fa', 'false');
      document.getElementById('divGenerateSecret').classList.remove('displayNone');
      document.getElementById('divProfileQR').classList.add('displayNone');
      document.getElementById('verifySecret').value = '';
      document.getElementById('verifySecret').blur();
    }
    await updateCustomClaims();
  });
}
// check if the user has verified his phone number
const readUserData = async () => {
  const claims = await getFirebaseClaims();
  const email_verified = firebase.auth().currentUser.emailVerified;
  const user_provider = firebase.auth().currentUser.providerData[0].providerId;
  if (claims.hasPhone || claims.verified) {
    checkUserSuggestions();
  } else {
    if (!claims.hasPhone) {
      if (!claims.verified) {
        getUserData();
      }
    } else if ((email_verified && !claims.hasPhone) || (user_provider != 'password' && !claims.hasPhone) ||
      (email_verified && !claims.verified) || (user_provider != 'password' && !claims.verified)) {
      showVerifyPhone();
      document.getElementById('airtimeMessagesContainer').style.top = '96px';
      document.getElementById('airtimeMessagesContainer').style.opacity = '1';
    } else {
      if (document.getElementById('showReferral') != null) {
        document.getElementById('showReferral').classList.remove('displayNone')
      }
    }
  }
}

const getUserData = async () => {
  const url = functionBaseURL + '/app/getUserdetails';
  const token = await getFirebaseToken();

  sendGetRequest(url, token, function (user, response) {
    if (response == 'phone not verified') {
      showVerifyPhone();
    } else {
      if (document.getElementById('showReferral') != null) {
        document.getElementById('showReferral').classList.remove('displayNone')
      }
    }
  })
}

function showVerifyPhone() {
  if ((window.location.pathname != '/account.html') || (window.location.pathname == '/account.html' && document.getElementById('divGetVerified').className.indexOf('displayNone') > -1)) {
    var verifyPhoneDiv = document.getElementById('verifyPhone');
    if (verifyPhoneDiv == null) {
      document.getElementById('airtimeMessagesContainer').innerHTML += '<div class="airtimeMessage" id="verifyPhone"></div>';
      verifyPhoneDiv = document.getElementById('verifyPhone');
      verifyPhoneDiv.innerHTML = i18next.t('registerPhone') + '<span>&nbsp;</span><span id="registerHere">' + i18next.t('here') + '</span>';
      verifyPhoneDiv.style.backgroundColor = '#ff9c00';
      document.getElementById('airtimeMessagesContainer').style.top = '96px';
      document.getElementById('airtimeMessagesContainer').style.opacity = '1';

      verifyPhoneDiv.addEventListener('click', function (e) {
        if (window.location.pathname != '/account.html') {
          localStorage.setItem('toRegisterPhone', true);
          window.location.href = 'account.html';
        } else if (window.location.pathname == '/account.html') {
          document.getElementById('airtimeMessagesContainer').style.top = '70px';
          document.getElementById('airtimeMessagesContainer').style.opacity = '0';
          document.getElementById('divAccountOptions').classList.add('displayNone');
          const divsAccountView = document.querySelectorAll('.divsAccountView');
          if (divsAccountView.length > 0) {
            for (let i = 0; i < divsAccountView.length; i++) {
              divsAccountView[i].classList.add('displayNone');
            }
          }
          document.getElementById('divGetVerified').classList.remove('displayNone');
          document.getElementById("divGetVerified").style.animation = "panelLeft 0.4s ease";
        }
      })
    } else {
      if (document.getElementById('airtimeMessagesContainer').style.top == '70px' || document.getElementById('airtimeMessagesContainer').style.top == '') {
        document.getElementById('airtimeMessagesContainer').style.top = '96px';
        document.getElementById('airtimeMessagesContainer').style.opacity = '1';
      }
    }
    if (document.getElementById('showReferral') != null) {
      document.getElementById('showReferral').classList.add('displayNone');
    }
  }


}

function setCookieFf(name, value) {
  browser.cookies.set({
    name: name,
    value: value,
    url: 'https://bittubeapp.com'
  });
}

function setCookie(name, verify) {
  var now = new Date();
  now.setTime(now.getTime() + (1 * 24 * 60 * 60 * 1000));
  const expires = "; expires=" + now.toGMTString();
  document.cookie = name + '=' + verify + ';expires=' + expires + '; path=/';
}

function setCookieSession(name, value) {
  document.cookie = name + '=' + value + ';';
}

var getCookieFf = (name, callback) => {
  browser.cookies.get({
    name: name,
    url: 'https://bittubeapp.com',
  }).then(function (cookieValue) {
    if (callback) {
      callback(cookieValue.value);
    }

  }).catch(function (error) {
    if (callback) {
      callback(null);
    }
  });
}

function getCookie(name) {
  const dc = document.cookie;
  const prefix = name + "=";
  let begin = dc.indexOf("; " + prefix);
  if (begin == -1) {
    begin = dc.indexOf(prefix);
    if (begin != 0) return null;
  } else {
    begin += 2;
    var end = document.cookie.indexOf(";", begin);
    if (end == -1) {
      end = dc.length;
    }
  }
  // because unescape has been deprecated, replaced with decodeURI
  //return unescape(dc.substring(begin + prefix.length, end));
  return decodeURI(dc.substring(begin + prefix.length, end));
}

// function to validate forms
// Params: Event, form (id of form), addedtofields
function validateForm(event, form, addedToFields) {
  event.preventDefault();
  event.stopPropagation();
  var f,
    formvalid = true;

  if (form != undefined) {
    for (f = 0; f < form.elements.length; f++) {

      var field = form.elements[f],
        name = field.name.charAt(0).toUpperCase() + field.name.slice(1),
        parent = field.parentNode,
        errorMsg = parent.querySelector('.mbsc-err-msg');
      if (name && field.validity.valid) {
        parent.parentNode.classList.remove('mbsc-err');

        if (errorMsg) {
          parent.removeChild(errorMsg);
        }
      } else if (name) {
        if (!errorMsg) {
          errorMsg = document.createElement('span');
          errorMsg.className = 'mbsc-err-msg';
          parent.appendChild(errorMsg);
        }

        var firstError = null;
        for (var key in field.validity) {
          if (!firstError && key !== 'valid' && field.validity[key]) {
            firstError = key;
          }
        }


        switch (firstError) {
          case 'tooShort': {
            validateTranslate(errorMsg, name, 'tooShort');
            break;
          }
          case 'typeMismatch': {
            validateTranslate(errorMsg, name, 'typeMismatch');
            break;
          }
          case 'valueMissing':
          default: {
            //// console.log(name);
            validateTranslate(errorMsg, name, 'valueMissing');
            break;
          }
        }

        parent.parentNode.classList.add('mbsc-err');
        formvalid = false;
      }

      if (!addedToFields) {
        //field.onchange = validateForm;
        field.oninput = validateForm;
      }
    }
  }
  if (!addedToFields) {
    addedToFields = true;
  }

  return formvalid;
}

// function to set translate msg  in validate form
function validateTranslate(errorMsg, name, type) {
  console.log('Name ===> ', name)
  switch (name) {
    case 'Password': {
      if (type === 'valueMissing') {
        errorMsg.innerHTML = i18next.t('validateForm.passwordRequired');
      } else if (type === 'typeMismatch') {
        errorMsg.innerHTML = i18next.t('validateForm.passwordInvalid');
      } else if (type === 'tooShort') {
        errorMsg.innerHTML = i18next.t('validateForm.passwordTooShort');
      }
      break;
    }
    case 'Email': {
      if (type === 'valueMissing') {
        errorMsg.innerHTML = i18next.t('validateForm.emailRequired');
      } else if (type === 'typeMismatch') {
        errorMsg.innerHTML = i18next.t('validateForm.emailInvalid');
      } else if (type === 'tooShort') {
        errorMsg.innerHTML = i18next.t('validateForm.emailTooShort');
      }
      break;
    }
    case 'Username': {
      if (type === 'valueMissing') {
        errorMsg.innerHTML = i18next.t('validateForm.usernameRequired');
      } else if (type === 'typeMismatch') {
        errorMsg.innerHTML = i18next.t('validateForm.usernameInvalid');
      } else if (type === 'tooShort') {
        errorMsg.innerHTML = i18next.t('validateForm.usernameTooShort');
      }
      break;
    }
    case 'Confirm password': {
      if (type === 'valueMissing') {
        errorMsg.innerHTML = i18next.t('validateForm.confirmPasswordRequired');
      } else if (type === 'typeMismatch') {
        errorMsg.innerHTML = i18next.t('validateForm.confirmPasswordInvalid');
      } else if (type === 'tooShort') {
        errorMsg.innerHTML = i18next.t('validateForm.confirmPasswordTooShort');
      }
      break;
    }
    case 'Amount': {
      if (type === 'valueMissing') {
        errorMsg.innerHTML = i18next.t('validateForm.amountRequired');
      } else if (type === 'typeMismatch') {
        errorMsg.innerHTML = i18next.t('validateForm.amountInvalid');
      } else if (type === 'tooShort') {
        errorMsg.innerHTML = i18next.t('validateForm.amountTooShort');
      }
      break;
    }
    case 'Card digits': {
      if (type === 'valueMissing') {
        errorMsg.innerHTML = i18next.t('validateForm.cardDigitRequired');
      } else if (type === 'typeMismatch') {
        errorMsg.innerHTML = i18next.t('validateForm.cardDigitInvalid');
      } else if (type === 'tooShort') {
        errorMsg.innerHTML = i18next.t('validateForm.cardDigitTooShort');
      }
      break;
    }
    case 'Name on card': {
      if (type === 'valueMissing') {
        errorMsg.innerHTML = i18next.t('validateForm.nameOnCardRequired');
      } else if (type === 'typeMismatch') {
        errorMsg.innerHTML = i18next.t('validateForm.nameOnCardInvalid');
      } else if (type === 'tooShort') {
        errorMsg.innerHTML = i18next.t('validateForm.nameOnCardTooShort');
      }
      break;
    }
    case 'Security code': {
      if (type === 'valueMissing') {
        errorMsg.innerHTML = i18next.t('validateForm.securityCodeRequired');
      } else if (type === 'typeMismatch') {
        errorMsg.innerHTML = i18next.t('validateForm.securityCodeInvalid');
      } else if (type === 'tooShort') {
        errorMsg.innerHTML = i18next.t('validateForm.securityCodeTooShort');
      }
      break;
    }
    case 'Expiry date': {
      if (type === 'valueMissing') {
        errorMsg.innerHTML = i18next.t('validateForm.expiryDateRequired');
      } else if (type === 'typeMismatch') {
        errorMsg.innerHTML = i18next.t('validateForm.expiryDateInvalid');
      } else if (type === 'tooShort') {
        errorMsg.innerHTML = i18next.t('validateForm.expiryDateTooShort');
      }
      break;
    }
    case 'Accept terms and conditions': {
      if (type === 'valueMissing') {
        errorMsg.innerHTML = i18next.t('validateForm.acceptTermsRequired');
      } else if (type === 'typeMismatch') {
        errorMsg.innerHTML = i18next.t('validateForm.acceptTermsInvalid');
      } else if (type === 'tooShort') {
        errorMsg.innerHTML = i18next.t('validateForm.acceptTermsTooShort');
      }
      break;

    }

    case 'Channellink': {
      if (type === 'valueMissing') {
        if (document.getElementById('inputVerifyUserName') != null) {
          if (document.getElementById('inputVerifyUserName').getAttribute('data-type-account') == 'channelLink') {
            errorMsg.innerHTML = i18next.t('channelLinkRequired');
          } else {
            errorMsg.innerHTML = i18next.t('AccountLinkRequired');
          }
        } else {
          errorMsg.innerHTML = i18next.t('AccountLinkRequired');
        }
        //i18next.t('validateForm.acceptTermsRequired');
      }
      break;
    }


    case 'VerifySecret': {
      // console.log(type)
      if (type === 'valueMissing') {
        errorMsg.innerHTML = i18next.t('fieldRequired');
      } else if (type === 'typeMismatch') {
        errorMsg.innerHTML = i18next.t('validateForm.acceptTermsInvalid');
      } else if (type === 'tooShort') {
        errorMsg.innerHTML = i18next.t('tooShort');
      }
      break;
    }


    case 'FirstName':
    case 'LastName':
    case 'UserIBAN':
    case 'Bic-swift':
    case 'VerificationCode':
    case 'First_name':
    case 'Last_name':
    case 'CardNumber':
    case 'CardExpirityMonth':
    case 'CardExpirityYear':
    case 'CvvNumber':
    case 'Address':
    case 'Country':
    case 'State':
    case 'City':
    case 'Zip': {
      if (type === 'valueMissing') {
        errorMsg.innerHTML = i18next.t('fieldRequired');
      }
      break;
    }



  }
}

// Function to check if both password are equal, when not, return false and show errors
function checkPasswords() {
  const password = document.getElementById('password').value;
  const confirm_password = document.getElementById('confirm_password').value;
  let result = true;
  if (password != confirm_password) {
    const errorsTranslate = i18next.t('validateForm.emailPasswordMatch');
    const errors = [errorsTranslate, errorsTranslate];
    const elementsWithErrors = ['password', 'confirm_password'];
    setErrors(errors, elementsWithErrors);
    showHideButtonLoader('registerButton', 'hideLoader');
    result = false;
  }

  return result;
}

// function phoneVerification, sends the user a sms or call with the code to verify his phone number.
// Param action => 'sms' or 'call' to specify which action the user has choose.
// Param elemnt => to call the function showHideLoaderButton on the element which was clicked by the user
function phoneVerification(event, action, element) {
  event.preventDefault();
  event.stopPropagation();

  const phoneNumber = document.getElementById('phone').value;
  const countrycode = document.getElementById('countryExtension').textContent.replace(' ', '').replace('+', '');
  const fullPhoneNumber = countrycode + phoneNumber;

  checkNumberExists(fullPhoneNumber);
}

function checkNumberExists(fullPhoneNumber) {
  const url = functionBaseURL + '/app/checkPhoneNumber?phonenumber=' + fullPhoneNumber;
  const from = 'checkNumberExists';
  userDataRequest(url, from);
}


function sendCode(countrycode, phone, action) {
  let userLanguage = i18next.language;
  const url = functionBaseURL + '/app/sendSMS?phonenumber=' + phone + '&countrycode=' + countrycode + '&locale=' + userLanguage + '&via=' + action;
  const from = 'sendCode'
  userDataRequest(url, from);
}
// function verifyCode, takes the value that the user has type on the field and verify if the code is right or not.
const verifyCode = async (event) => {
  event.preventDefault();
  event.stopPropagation();
  try {
    const phoneNumber = document.getElementById('phone').value;
    const countrycode = document.getElementById('countryExtension').textContent.replace(' ', '').replace('+', '');
    const code = document.getElementById('code').value;

    let url = functionBaseURL + '/app/verifySMS?phonenumber=' + phoneNumber + '&countrycode=' + countrycode + '&code=' + code;
    url = url + (localStorage.getItem('referredbykey') ? ('&referredbykey=' + localStorage.getItem('referredbykey')) : '');
    const token = await getFirebaseToken();
    sendGetRequest(url, token, async (user, response) => {
      if (response == 'incorrectCode') {
        const error = [i18next.t('theCodeNotValid')];
        const elementWithError = ['code'];
        setErrors(error, elementWithError);
        showHideButtonLoader('verifyCodebutton', 'hideLoader');
      } else if (response == 'codeCorrect') {
        await updateCustomClaims();
        userOptions();
        fetch('https://bittube.tv/api/notify-firebase-user-registration', {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          method: 'POST',
          body: `token=${encodeURIComponent(token)}`
        }).then((res) => {
          showHideButtonLoader('verifyCodebutton', 'hideLoader');
          window.location.href = '/airtime.html';
        });
      }
    })
  } catch (err) {
    console.error('Error veriying SMS code ', err);
  }


  // const from = 'verifyCode'
  // userDataRequest(url, from);
}

// function showHideButtonLoader, to show a loader on the button when the user needs to wait for some process.
// Param element => where the loader needs to be shown.
// Param action => 'show' or 'hide' the loader.
function showHideButtonLoader(element, action) {
  if (action == 'showLoader') {
    document.getElementById(element).children[0].classList.remove('displayNone');
    document.getElementById(element).children[1].classList.add('displayNone');
    document.getElementById(element).setAttribute('disabled', 'disabled');
  } else if (action == 'hideLoader') {
    document.getElementById(element).children[0].classList.add('displayNone');
    document.getElementById(element).children[1].classList.remove('displayNone');
    document.getElementById(element).removeAttribute('disabled');
  }

}

function checkUsername(username) {
  const result = /^[\w&.\-]*$/.test(username);
  //const result = /^[A-Za-z0-9]+(?:[._-][A-Za-z0-9])*$/.test(username);
  if (!result) {
    const errorsTranslate = i18next.t('validateForm.invalidCharacters');
    const errors = [errorsTranslate];
    const inputWithError = ['username'];
    setErrors(errors, inputWithError);
    return false;
  } else {
    return true;
  }

}

let stop_counter = false;

function disableButton60sec(from) {
  var timer = 60,
    seconds;
  var x = setInterval(function () {
    seconds = parseInt(timer % 60, 10);
    seconds = seconds < 10 ? "0" + seconds : seconds;

    switch (from) {
      case 'requestCall':
        document.getElementById('requestCall').children[0].classList.remove('displayNone');
        document.getElementById('requestCall').children[1].classList.add('displayNone');
        document.getElementById('requestCall').setAttribute('disabled', 'disabled');
        break;
      case 'resendEmail':
        document.getElementsByClassName('buttonModdal')[0].setAttribute('data-disabled', 'disabled');
        document.getElementsByClassName('buttonModdal')[0].innerHTML = seconds + ' sec';
        break;
      case 'purchase':
        document.getElementsByClassName('buttonModdal')[0].setAttribute('data-disabled', 'disabled');
        document.getElementsByClassName('buttonModdal')[0].innerHTML = seconds + ' sec';
        break;
      case 'recoveryPass':
        document.getElementById('recoveryButton').setAttribute('data-disabled', 'disabled');
        document.getElementById('recoveryButton').innerHTML = seconds + ' sec';
        break;
      case 'DonationOne':
        document.getElementById('buttonConfirm').setAttribute('data-disabled', 'disabled');
        document.getElementById('buttonConfirm').innerHTML = seconds + ' sec';
        break;

    }
    // console.log(timer)
    // console.log((from +  getCookie('buttondisable')));
    if (--timer < 0 || stop_counter || getCookie('buttondisable') == null) {

      if ((from == 'requestCall' && getCookie('buttondisable') == null) || (from == 'resendEmail' && getCookie('buttondisable') == null) || (from == 'recoveryPass' && getCookie('buttondisable') == null)) {
        // console.log('here')
        clearInterval(x);
      }

      switch (from) {
        case 'requestCall':
          document.getElementById('requestCall').children[0].classList.add('displayNone');
          document.getElementById('requestCall').children[1].classList.remove('displayNone');
          document.getElementById('requestCall').removeAttribute('disabled');
          break;
        case 'resendEmail':
          document.getElementsByClassName('buttonModdal')[0].innerHTML = i18next.t('resendEmail');
          document.getElementsByClassName('buttonModdal')[0].removeAttribute('data-disabled');
          break;
        case 'purchase':
          document.getElementsByClassName('buttonModdal')[0].innerHTML = 'OK';
          document.getElementsByClassName('buttonModdal')[0].removeAttribute('data-disabled');
          break;
        case 'recoveryPass':
          document.getElementById('recoveryButton').innerHTML = i18next.t('recoveryPassword');
          document.getElementById('recoveryButton').removeAttribute('data-disabled');
          break;
        case 'DonationOne':
          document.getElementById('buttonConfirm').removeAttribute('data-disabled');
          document.getElementById('buttonConfirm').innerHTML = i18next.t('confirm');
          break;
      }

    }
  }, 1000);

}

function sendEmailRecoveryPass() {

  const email = document.getElementById('email').value;
  firebase.auth().sendPasswordResetEmail(email).then(function () {
    // Email sent.
    //// console.log('email sent');
    document.getElementById('recoveryPassSent').classList.remove('displayNone');
    document.getElementById('spanUserEmail').textContent = email;
    showHideButtonLoader('recoveryButton', 'hideLoader');
  }).catch(function (error) {
    // An error happened.
    // console.log('error')
    // console.log(error)

    if (error.code == 'auth/invalid-email') {
      const error = [i18next.t('theEmailInvalid')];
      const inputWithError = ['email'];
      setErrors(error, inputWithError);
      //showHideButtonLoader('recoveryButton', 'hideLoader');
    }
    if (error.code == 'auth/user-not-found') {
      const error = [i18next.t('theUserNotExist')];
      const inputWithError = ['email'];
      setErrors(error, inputWithError);
      //showHideButtonLoader('recoveryButton', 'hideLoader');
    }
    stop_counter = true;

  });

}

function setCookie60sec() {
  var date = new Date();
  date.setTime(date.getTime() + (60 * 1000));
  var expires = "; expires=" + date.toGMTString();

  document.cookie = "buttondisable=true" + expires + "; path=/";
}


function generateBill(coinSelect, selectCoin, cryptoCoin, cardnumber, cardName) {
  const instanceBill = mobiscroll.popup('#popupBill', {
    display: 'center',
    closeOnOverlayTap: false,
    cssClass: 'popUpResendEmail',
    buttons: [{
        text: i18next.t('confirm'),
        cssClass: 'buttonModdal',
        handler: function (event, inst) {
          //// console.log('Process Purchase');
          const securty_code = document.getElementById('securty_code').value;
          const expirity_date = document.getElementById('expire_date').value;
          disableButton60sec('purchase');

          setTimeout(function (e) {
            processPurchase(inst, coinSelect, selectCoin, cryptoCoin, cardnumber, cardName, securty_code, expirity_date);
          }, 2000);


        }
      },

      {
        text: i18next.t('cancel'),
        cssClass: 'buttonModdalGrey',
        handler: function (event, inst) {
          inst.hide();

        }
      }
    ],
    onBeforeShow: function (ev, inst) {
      document.getElementById('paymentBill').textContent = coinSelect;
      document.getElementById('currencyBill').textContent = selectCoin;
      document.getElementById('paymentBillTotal').textContent = coinSelect;
      document.getElementById('currencyBillTotal').textContent = selectCoin;
      document.getElementById('tubeBill').textContent = cryptoCoin;
      document.getElementById('cardBill').textContent = cardnumber;
      document.getElementById('nameBill').textContent = cardName;

      // Apply fee to TUBE AMOUNT
      const TUBE_amount = parseFloat(document.getElementById('cryptoCoin').value);
      const fee = 1.8;
      const amountWithFee = TUBE_amount - ((TUBE_amount * fee) / 100);
      document.getElementById('amountApplyFee').textContent = amountWithFee;


    }
  });

  instanceBill.show();
}

// function to check if the card number is correct
function checkCardNumber() {
  const card_Am = /^(?:3[47][0-9]{13})$/; //Amercican Express credit card number
  const card_Visa = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/; // Visa credit card
  const card_master = /^(?:5[1-5][0-9]{14})$/; //Mastercard
  const card_discover = /^(?:6(?:011|5[0-9][0-9])[0-9]{12})$/; //Discover card
  const card_dinners = /^(?:3(?:0[0-5]|[68][0-9])[0-9]{11})$/; //Dinnes club

  const cardNumber = document.getElementById('cardnumber').value;
  if (!cardNumber.match(card_Am) &&
    !cardNumber.match(card_Visa) &&
    !cardNumber.match(card_master) &&
    !cardNumber.match(card_discover) &&
    !cardNumber.match(card_dinners)) {
    const error = [i18next.t('theCardNumberInvalid')];
    const inputWithError = ['cardnumber'];
    setErrors(error, inputWithError);
    return false;
  } else {
    return true;
  }
  // END IF CHECK CARD
}


function processPurchase(instanceBill, coinSelect, selectCoin, cryptoCoin, cardnumber, cardName, securty_code, expirity_date) {
  showSuccesPurchase(instanceBill);

}

function showSuccesPurchase(instanceBill) {
  instanceBill.hide();
  stop_counter = true;
  const instanceSuccess = mobiscroll.popup('#popupPurchase', {
    display: 'center',
    closeOnOverlayTap: false,
    cssClass: 'popUpResendEmail',
    buttons: [{
      text: 'OK',
      cssClass: 'buttonModdal',
      handler: function (event, inst) {
        stop_counter = true;
        inst.hide();
      }
    }],
    onBeforeShow: function (ev, inst) {}
  });

  instanceSuccess.show();
}


function randomReferenceNumber() {
  return (Math.floor((Math.random() * 982451653) + 982451653).toString(36) + Date.now().toString(36)).toUpperCase();
}


function confirmDonation() {
  disableButton60sec('DonationOne')
}

// function to check the minimun or maximun amount of purchase
function checkMinMaxAmount(inputAmount, selectCoin) {
  const amount = inputAmount // parseFloat(document.getElementById(inputAmount).value).toFixed(2);
  const currency = document.getElementById(selectCoin).value;
  let result = true;

  if (amount < 1) {
    const errors = [i18next.t('amountMin1') + ' ' + currency];
    const elementsWithErrors = [inputAmount];
    setErrors(errors, elementsWithErrors);
    result = false;
  }

  if (amount > 100) {
    const errors = [i18next.t('amountMax100') + ' ' + currency];
    const elementsWithErrors = [inputAmount];
    setErrors(errors, elementsWithErrors);
    result = false;
  }

  return result;
}

// function to pruchase tubes with paypal
function purchaseWithPayPal() {
  const currency = document.getElementById('selectCoinPayPal').value;
  const amount = document.getElementById('coinSelectPayPal').value;
  // const tubeamount = document.getElementById('cryptoCoinPayPal').value;
  const tubeamount = localStorage.getItem('totalTubesPaypal');
  let countrycode = localStorage.getItem('i18nextLng');

  const token = encodeURIComponent(localStorage.getItem('conversionRateToken'));
  // if (countrycode == null){
  // countrycode = navigator.language || navigator.userLanguage;

  if (countrycode.indexOf('-') > -1) {
    countrycode = countrycode.replace('-', '_');
  }

  if (countrycode.indexOf('_') > -1) {
    countrycode = countrycode.split('_')[0];
  }


  if (countrycode == 'en') {
    countrycode = 'en_US';
  }
  const url = functionBaseURL + '/app/createOrder?amount=' + amount + '&currency=' + currency + '&countrycode=' + countrycode + '&tubeamount=' + tubeamount + '&token=' + token;
  const from = 'purchaseWithPayPal'
  userDataRequest(url, from);
}

function purchaseWithCrypto() {
  const currency = document.getElementById('selectCurrencyCrypto').value;
  const amount = document.getElementById('cryptoSelect').value;
  // const tubeamount = document.getElementById('cryptoCoinPayPal').value;
  const tubeamount = localStorage.getItem('totalTUBEsCrypto');
  const token = encodeURIComponent(localStorage.getItem('conversionRateToken'));

  const url = functionBaseURL + '/app/purchaseCrypto?amount=' + amount + '&currency=' + currency + '&tubeamount=' + tubeamount + '&token=' + token;
  const from = 'purchaseCrypto'
  userDataRequest(url, from);

}

const showModalTerms = (purchaseType) => {
  const popUpAcceptTerms = mobiscroll.popup('#popUpAcceptTerms', {
    display: 'center',
    closeOnOverlayTap: false,
    cssClass: 'popUpResendEmail',
    buttons: [{
      text: i18next.t('continue'),
      cssClass: 'buttonModdal',
      handler: function (event, inst) {
        if (document.getElementById('checkTerms').checked) {
          switch (purchaseType) {
            case 'wire':
              document.getElementById('spanReference').innerHTML = 'TUBE-' + randomReferenceNumber();
              firebase.auth().currentUser.getIdToken().then(function (token) {
                var params = {};
                params.referenceId = document.getElementById('spanReference').innerHTML;
                params.tubeamount = document.getElementById('cryptoCoinCrypto').value;
                params.amount = document.getElementById('cryptoSelect').value;
                params.currency = document.getElementById('selectCurrencyCrypto').value;
                params.tubeValue = document.getElementById('cryptoCoinCrypto').getAttribute('data-actualprice');
                params.timeTube = Date.now();
                params.token = encodeURIComponent(localStorage.getItem('purchaseData'))

                const url = functionBaseURL + '/app/createOrderTransferNew';
                var data = 'data=' + encodeURIComponent(JSON.stringify(params));
                sendPostRequest(url, data, null, token, function (user, response) {
                  console.log('Response !!!!! ', response)
                  const resultOrder = JSON.parse(response);
                  showModalOrder(resultOrder.message, resultOrder.data);
                });
              });
              break;
            case 'crypto':
              startBuyCryptoProcess();
              break;
            case 'cc':
              startProcessBuyWithCC();
              break;
          }
          inst.hide();
        }
      }
    }, {
      text: i18next.t('close'),
      cssClass: 'buttonModdal marginLeft10px',
      handler: function (event, inst) {
        switch (purchaseType) {
          case 'wire':
            showHideButtonLoader('createTransferOrder', 'hideLoader');
            break;
          case 'crypto':
            showHideButtonLoader('payWithCryptoButton', 'hideLoader');
            break;
          case 'cc':
            showHideButtonLoader('payWithCC', 'hideLoader');
            break;
        }

        inst.hide();
      }
    }],
    onBeforeShow: () => {
      document.getElementById('linkTermsAndConditions').addEventListener('click', () => {
        chrome.tabs.create({
          url: 'https://bittube.app/terms.html'
        });
      });
    }
  });

  popUpAcceptTerms.show();
}


const startProcessBuyWithCC = async () => {
  try {
    const token = await getFirebaseToken();
    let params = {};
    if (localStorageEx.get('buyTubesInfo') != null) {
      params.data = localStorageEx.get('buyTubesInfo');
      params.token = encodeURIComponent(localStorage.getItem('purchaseData'))
    }
    const url = functionBaseURL + '/app/buyWithCreditCard';
    var data = 'data=' + encodeURIComponent(JSON.stringify(params));
    sendPostRequest(url, data, null, token, function (user, response) {
      showHideButtonLoader('payWithCC', 'hideLoader');
      const result = JSON.parse(response);

      if (result.success) {
        if (result.redirect_link) {
          chrome.tabs.create({
            url: result.redirect_link
          });
        }

      } else if (result.error) {
        showModalErrorBuyingWithCC(result.message);
      }
    });
  } catch (err) {
    console.error('Error starting buy with cc process ', err);
  }
}

const startBuyCryptoProcess = async () => {
  try {
    showHideButtonLoader('payWithCryptoButton', 'showLoader');
    const token = await getFirebaseToken();
    const url = functionBaseURL + '/app/createCharge?token=' + encodeURIComponent(localStorage.getItem('purchaseData'));
    sendGetRequest(url, token, function (user, response) {
      showHideButtonLoader('payWithCryptoButton', 'hideLoader');
      const resultOrder = JSON.parse(response);
      if (resultOrder.message == 'success') {
        chrome.tabs.create({
          url: resultOrder.payment_url
        });
      }
    });
  } catch (err) {
    console.log('Error starting process to buy with crypto => ', err);
  }

}

function showPopupVerificationPhone() {
  const popUpPhoneVerification = mobiscroll.popup('#popUpPhoneVerification', {
    display: 'center',
    closeOnOverlayTap: false,
    cssClass: 'popUpResendEmail',
    buttons: [{
        text: i18next.t('verifyYourPhone'),
        cssClass: 'buttonModdal',
        handler: function (event, inst) {
          localStorage.setItem('toRegisterPhone', true);
          window.location.href = 'account.html';
          //inst.hide();
        }
      },
      {
        text: i18next.t('cancel'),
        cssClass: 'buttonModdalGrey',
        handler: function (event, inst) {
          window.location.href = '/airtime.html';
          //   inst.hide();

        }
      }
    ]
  });

  popUpPhoneVerification.show();
}

function formatDateChart(date) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}

function formatDateHistory(date) {
  var monthNames = [
    "JAN", "FEB", "MAR",
    "APR", "MAY", "JUN", "JUL",
    "AUG", "SEP", "OCT",
    "NOV", "DEC"
  ];

  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();
  return '<span>' + day + '</span>' + ' ' + monthNames[monthIndex] + ' ';
}


function fillUserLinkedAccounts(userLinkedAccounts) {
  let arrayLinkedAccounts = Object.entries(userLinkedAccounts).map(([key, value]) => ({
    key,
    value
  }));
  if (arrayLinkedAccounts.length > 0) {


    for (let j = 0; j < arrayLinkedAccounts.length; j++) {
      if (arrayLinkedAccounts[j].value == '') {
        arrayLinkedAccounts.splice(j, 1);
      }
    }

    if (arrayLinkedAccounts.length > 0) {
      for (let i = 0; i < arrayLinkedAccounts.length; i++) {
        if (arrayLinkedAccounts[i].value != '') {
          var li = document.createElement('li');
          li.classList.add("linkedContainer")
          li.classList.add('positionRelative');
          li.style.opacity = "0"
          li.style.animation = "listPop 0.4s ease forwards"
          li.style.animationDelay = i * 0.05 + 's'
          var platformName = document.createElement('img');
          let platform = arrayLinkedAccounts[i].key;
          const platformUUID = '63ff7c11-1026-eb89-a3a7-ba058592453e';

          if ( platform.indexOf(platformUUID) == -1 ){
            platform = arrayLinkedAccounts[i].key.split('-')[0];
          }
          if (platform == '310b0774') {
            platformName.src = "./assets/images/linksLogo/bittube.png"
          } else if (platform.indexOf(platformUUID) != -1 ) {
            platformName.src = "./assets/images/linksLogo/bittube-platform.svg"
          } else {
            platformName.src = "./assets/images/linksLogo/" + platform + ".svg"
          }

          var accountName = document.createElement('h3');
          accountName.classList.add('leftSideHistory');
          accountName.classList.add('linkedInfo');
          if (platform == '310b0774') {
            accountName.textContent = 'BitTubers - ' + arrayLinkedAccounts[i].value.channelTitle;
          } else if (platform.indexOf(platformUUID) != -1) {
            accountName.textContent = 'Bit.tube - ' + arrayLinkedAccounts[i].value.channelTitle;
          } else {
            accountName.textContent = arrayLinkedAccounts[i].value.channelTitle;
          }

          var accountId = document.createElement('p');
          accountId.classList.add('linkedInfo');
          let linkplatform = arrayLinkedAccounts[i].key;
          if ( linkplatform.indexOf(platformUUID) == -1 ){
            linkplatform = arrayLinkedAccounts[i].key.split('-')[0];
          }else{
            linkplatform = platformUUID
          }
          if (linkplatform === 'module') {
            const url = `https://bittubeapp.com/platformRegistered.html?platformName=${encodeURIComponent(arrayLinkedAccounts[i].value.channelTitle)}&platformUUID=${encodeURIComponent(arrayLinkedAccounts[i].value.channeldId)}`;
            accountId.innerHTML = `<a href="${url}" target="_blank">${arrayLinkedAccounts[i].value.channeldId}</a>`;
          } else {
            accountId.textContent = arrayLinkedAccounts[i].value.channeldId;
          }


          var buttonDelete = document.createElement('button');
          buttonDelete.classList.add('mbsc-ic');
          buttonDelete.setAttribute('data-platform', linkplatform);
          buttonDelete.setAttribute('data-accountid', arrayLinkedAccounts[i].value.channeldId);
          buttonDelete.setAttribute('data-accountname', arrayLinkedAccounts[i].value.channelTitle);
          // buttonDelete.classList.add('mbsc-ic-ion-ios7-close-outline');
          var iconDelete = document.createElement('img');
          iconDelete.src = './assets/images/trashIcon.svg';
          buttonDelete.appendChild(iconDelete)
          buttonDelete.classList.add('buttonRemoveAccount');
          buttonDelete.addEventListener('click', function (e) {
            showModalConfirmRemoveAccount(this);
          });

          var buttonStats = document.createElement('button');
          buttonStats.classList.add('mbsc-ic');
          buttonStats.setAttribute('data-platform', linkplatform);
          buttonStats.setAttribute('data-moduleid', arrayLinkedAccounts[i].value.channeldId);
          var iconStats = document.createElement('img');
          iconStats.src = './assets/images/statsIcon.svg';
          buttonStats.appendChild(iconStats)
          // buttonStats.classList.add('mbsc-ic-ion-stats-bars');
          buttonStats.classList.add('buttonSeeStatsModule');
          buttonStats.addEventListener('click', function (e) {
            localStorage.setItem('chart', 'airtimeValue');
            if (platform == '310b0774') {
              document.getElementById('imageStatsModule').src = './assets/images/linksLogo/bittube.png';
            } else if (platform.indexOf(platformUUID) != -1 ) {
              document.getElementById('imageStatsModule').src = './assets/images/linksLogo/bittube-platform.svg';
            } else {
              document.getElementById('imageStatsModule').src = './assets/images/linksLogo/' + platform + '.svg';
            }


            document.getElementById('statsModule').classList.remove('displayNone')
            if (platform == '310b0774') {
              document.getElementById('moduleName').innerText = 'BitTubers - ' + arrayLinkedAccounts[i].value.channelTitle;
            } else if (platform == platformUUID) {
              document.getElementById('moduleName').innerText = 'Bit.tube - ' + arrayLinkedAccounts[i].value.channelTitle;
            } else {
              document.getElementById('moduleName').innerText = arrayLinkedAccounts[i].value.channelTitle;
            }

            fullLabels = [];
            fullRewards = [];
            fullCounted = [];
            fullAirtime = [];
            airtimeDataChart = [];
            airtimeLabelsChart = [];
            countedData = [];
            rewardData = [];
            getAirtimeStatistics(arrayLinkedAccounts[i].value.uid, 'module')
          });

          li.appendChild(platformName);
          li.appendChild(accountName);
          li.appendChild(accountId);
          if (linkplatform !== 'module') {
            li.appendChild(buttonDelete);
          }

          li.appendChild(buttonStats);

          document.getElementById('ulLinkedAccounts').appendChild(li);

        }

        mobiscroll.listview('#ulLinkedAccounts', {
          theme: 'ios',
          enhance: true,
          swipe: false
        });
        document.getElementById('loaderAccounts').classList.add('displayNone');
        document.getElementById('divLinkedAccounts').classList.remove('displayNone');
      }

    } else {
      document.getElementById('loaderAccounts').classList.add('displayNone');
      document.getElementById('divNoLinkedAccounts').classList.remove('displayNone');
    }
  } else {
    document.getElementById('loaderAccounts').classList.add('displayNone');
    document.getElementById('divNoLinkedAccounts').classList.remove('displayNone');
  }
}

function convert(amount) {
  let number;
  if (typeof (amount) == 'number') {
    if (amount.toString().indexOf('.') == -1 && amount.toString().length == 9) {
      number = Number((Number(amount) / 1e8))
    } else {
      number = Number((Number(amount) / 1e8));
    }
  } else {
    number = amount;
  }
  return Number(number);

}

let instanceDeletePhone;

function showConfirmDeleteNumberModal() {
  instanceDeletePhone = mobiscroll.popup('#deleteNumber', {
    display: 'center',
    closeOnOverlayTap: false,
    cssClass: 'popUpResendEmail',
    buttons: [{
        text: i18next.t('confirm'),
        cssClass: 'buttonModdal',
        handler: async (event, inst) => {
          let phone = document.getElementById('userPhone').value;
          phone = phone.split('+')[1];
          const url = functionBaseURL + '/app/deletePhoneNumber?phone=' + phone;
          const token = await getFirebaseToken();
          sendGetRequest(url, token, async (user, response) => {
            if (response == 'phoneDeleted') {
              localStorage.removeItem('deletephone');
              showHideButtonLoader('deletePhoneNumber', 'hideLoader');
              instanceDeletePhone.hide();
              await updateCustomClaims();
              document.getElementById('deletePhoneNumber').classList.add('displayNone');
              document.getElementById('verifyByPhoneNumber').classList.remove('displayNone');

              const claims = await getFirebaseClaims();
              if (claims.verified || claims.hasPhone) {
                document.getElementById('checkBasicTab').classList.remove('displayNone');
              } else {
                document.getElementById('checkBasicTab').classList.add('displayNone');
              }
              document.getElementById('divReferralLink').classList.add('displayNone');
              readUserData(firebase.auth().currentUser.uid);
              document.getElementById('userPhone').value = '';
              document.getElementById('deletePhoneNumber').classList.add('displayNone');
              document.getElementById('verifyByPhoneNumber').classList.remove('displayNone');
            }
          })

          // const from = 'confirmDetelePhoneNumber';
          // showHideButtonLoader('deletePhoneNumber', 'showLoader');
          // userDataRequest(url, from);
        }
      },

      {
        text: i18next.t('cancel'),
        cssClass: 'buttonModdalGrey',
        handler: function (event, inst) {
          inst.hide();

        }
      }
    ],
    onBeforeShow: function (ev, inst) {}
  });

  instanceDeletePhone.show();
}

let instancePopupConfirm;

function showModalConfirmRemoveAccount(element) {
  let platform = element.getAttribute('data-platform');
  const accountId = element.getAttribute('data-accountid');
  const accountName = element.getAttribute('data-accountname');
  const bit_tube_platformuuid = '63ff7c11-1026-eb89-a3a7-ba058592453e';
  if ( platform == bit_tube_platformuuid){
    platform = 'Bit.Tube'
  }
  instancePopupConfirm = mobiscroll.popup('#deleteLinkedAccount', {
    display: 'center',
    closeOnOverlayTap: false,
    cssClass: 'popUpResendEmail',
    buttons: [{
        text: i18next.t('confirm'),
        cssClass: 'buttonModdal',
        handler: function (event, inst) {
          switch (platform) {
            case 'youtube':
              removeLinkedAccount(platform, accountId);
              break;
            case 'twitter':
            case 'soundcloud':
            case 'twitch':
            case 'domain':
            case 'facebook':
              removeLinkedAccount(platform, accountName);
              break;
            case 'Bit.Tube':
              removeLinkedAccount(bit_tube_platformuuid, accountId)
            default:
              removeLinkedAccount(platform, accountId);
            break;
          }

        }
      },

      {
        text: i18next.t('cancel'),
        cssClass: 'buttonModdalGrey',
        handler: function (event, inst) {
          inst.hide();

        }
      }
    ],
    onBeforeShow: function (ev, inst) {
      document.getElementById('accountName').innerText = accountName;
      document.getElementById('accountId').innerText = accountId;
      document.getElementById('accountPlatform').innerText = platform.charAt(0).toUpperCase() + platform.slice(1);;
    }
  });

  instancePopupConfirm.show();
}


function showModalOrder(message, data) {
  const instance = mobiscroll.popup('#orderPopup', {
    display: 'center',
    cssClass: 'popUpResendEmail orderModal',
    closeOnOverlayTap: false,
    buttons: [{
      text: i18next.t('close'),
      cssClass: 'buttonModdal',
      handler: function (event, inst) {
        inst.hide();
        document.getElementById('cryptoSelect').value = '';
        document.getElementById('cryptoCoinCrypto').value = '';
        document.getElementById('spanReference').innerHTML = 'TUBE-' + randomReferenceNumber();
        document.getElementById('infoTransfer').classList.add('displayNone');
      }
    }],
    onBeforeShow: function (ev, inst) {
      document.getElementById('wireTransferDetails').innerHTML = '';
      if (message == 'success') {
        const currency = document.getElementById('selectCurrencyCrypto').value;
        document.getElementById('titleModalOrder').innerHTML = i18next.t('orderCreated');
        document.getElementById('subHeaderModal').innerHTML = i18next.t('buy') + ' ' + document.getElementById('cryptoCoinCrypto').value + ' <i class="icon-font-tube tubeFont"></i>';
        document.getElementById('importantNoteBuyTubes').classList.remove('displayNone');
        document.getElementById('textModalOrder').innerHTML = i18next.t('toFinishTheProcess1') + '<span class="bolder">' + i18next.t('toFinishTheProcess2') + '</span> ' + i18next.t('toFinishTheProcess3');
        document.getElementById('spanAmountToTransfer').innerHTML = document.getElementById('cryptoSelect').value + ' ' + currency;
        document.getElementById('divAmountReferenceId').classList.remove('displayNone');
        document.getElementById('spanReference').innerHTML = data.referenceId
        const items = [];
        const mainDivInfoAccount = document.createElement('div');
        mainDivInfoAccount.classList.add('bankByCurrency');
        const svg = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">' +
          '<path d="M13.3333 6H7.33333C6.59695 6 6 6.59695 6 7.33333V13.3333C6 14.0697 6.59695 14.6667 7.33333 14.6667H13.3333C14.0697 14.6667 14.6667 14.0697 14.6667 13.3333V7.33333C14.6667 6.59695 14.0697 6 13.3333 6Z"' +
          'stroke="#00ABFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />' +
          '<path d="M3.33337 10.0002H2.66671C2.31309 10.0002 1.97395 9.85969 1.7239 9.60964C1.47385 9.35959 1.33337 9.02045 1.33337 8.66683V2.66683C1.33337 2.31321 1.47385 1.97407 1.7239 1.72402C1.97395 1.47397 2.31309 1.3335 2.66671 1.3335H8.66671C9.02033 1.3335 9.35947 1.47397 9.60952 1.72402C9.85956 1.97407 10 2.31321 10 2.66683V3.3335"' +
          'stroke="#00ABFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />' +
          '</svg>';

        for (const key in data) {
          if (key != 'code_html' && key != 'symbol' && key != 'currency' && key != 'referenceId') {
            const pKey = document.createElement('p');
            pKey.className = 'font13 pDonateToPublisher noMarginBottom translate';
            pKey.align = 'left';
            const spanTxtLabel = document.createElement('span');
            spanTxtLabel.className = 'txLabel';
            if (key == 'BICSWIFT') {
              spanTxtLabel.innerHTML = 'BIC/SWIFT';
            } else if (key == 'IBAN') {
              spanTxtLabel.innerHTML = 'IBAN';
            } else {
              spanTxtLabel.innerHTML = i18next.t(key);
            }
            const br = document.createElement('br');
            const spanTxInput = document.createElement('span');
            spanTxInput.className = 'txInput';
            const contentInput = document.createElement('span');
            contentInput.className = 'inputContent breakWord';

            contentInput.innerHTML = data[key];
            const spanTxCopy = document.createElement('span');
            spanTxCopy.className = 'txCopy v-align';
            spanTxInput.appendChild(contentInput);
            spanTxCopy.innerHTML = svg;
            spanTxInput.appendChild(spanTxCopy);
            pKey.appendChild(spanTxtLabel);
            pKey.appendChild(br);
            pKey.appendChild(spanTxInput);
            pKey.setAttribute('data-key', key);

            if (key != 'Beneficiary') {
              if (key == 'bankName') {
                items.splice(1, 0, pKey)
              } else {
                items.push(pKey);
              }
            } else {
              items.unshift(pKey);
            }
          }
        }
        const bankNameBic = document.createElement('div');
        bankNameBic.className = 'bankNameBic';
        const bankTransferAccountNumber = document.createElement('div');
        bankTransferAccountNumber.className = 'bankNameBic';
        items.forEach((item) => {
          if ((currency != 'GBP' && currency != 'AUD' && currency != 'NZD')) {
            if ((item.getAttribute('data-key') == 'bankName' || item.getAttribute('data-key') == 'BICSWIFT')) {
              bankNameBic.appendChild(item);
              mainDivInfoAccount.appendChild(bankNameBic);
            } else if ((item.getAttribute('data-key') == 'transferNumber' || item.getAttribute('data-key') == 'accountNumber')) {
              bankTransferAccountNumber.appendChild(item);
              mainDivInfoAccount.appendChild(bankTransferAccountNumber);
            } else {
              item.style.paddingLeft = '1px';
              item.style.paddingRight = '1px';
              mainDivInfoAccount.appendChild(item);
            }
          } else {
            mainDivInfoAccount.appendChild(item);
          }
          document.getElementById('wireTransferDetails').appendChild(mainDivInfoAccount);
        })
        addCopyListener();
      } else {
        document.getElementById('divAmountReferenceId').classList.add('displayNone');
        document.getElementById('importantNoteBuyTubes').classList.add('displayNone');
        document.getElementById('titleModalOrder').innerHTML = i18next.t('orderTransfer');
        document.getElementById('textModalOrder').innerHTML = i18next.t('orderTranferError');
      }

      showHideButtonLoader('createTransferOrder', 'hideLoader');


    }
  });
  instance.show();
}

function getUserLinkedAccounts() {
  document.getElementById('loaderAccounts').classList.remove('displayNone');
  document.getElementById('platformOptions').classList.remove('displayNone');
  document.getElementById('verifyAccountDiv').classList.add('displayNone');
  document.getElementById('divNoLinkedAccounts').classList.add('displayNone');
  document.getElementById('ulLinkedAccounts').innerHTML = '';
  // const url = 'http://localhost:5001/bittube-airtime-extension/us-central1/app/getLinkedAccounts';
  const url = functionBaseURL + '/app/getLinkedAccounts'
  const from = 'getLinkedAccounts';
  userDataRequest(url, from);
}

function removeLinkedAccount(platform, accountId) {

  const url = functionBaseURL + '/app/unlinkAccount?platform=' + platform + '&accountid=' + accountId;
  // const url = 'http://localhost:5001/bittube-airtime-extension/us-central1/app/unlinkAccount?platform=' + platform + '&accountid=' + accountId;
  const from = 'confirmUnlinkAccount';
  userDataRequest(url, from);

}

function showPopupInfo(data) {
  const dataInfo = data;

  let transactionInfo = mobiscroll.popup('#transactionInfo', {
    display: 'center',
    closeOnOverlayTap: false,
    cssClass: 'popUpResendEmail transactionModal',
    buttons: [{
      text: i18next.t('close'),
      cssClass: 'buttonModdal',
      handler: function (event, inst) {
        inst.hide();
      }
    }],
    onBeforeShow: function (ev, inst) {
      document.getElementById('divInfoData').innerHTML = '';
      const divData = document.createElement('div');
      const pType = document.createElement('p');
      pType.align = 'left';
      pType.classList.add('breakAll');
      pType.classList.add('margin10');
      // console.log(dataInfo)
      if (dataInfo.data[0] != undefined) {
        if (dataInfo.data[0]['paypal'] != undefined) {
          pType.innerHTML = i18next.t('purchaseByPaypal');
        }

      } else {
        if (dataInfo.data.type != undefined) {
          if (dataInfo.data.type != 'donation') {
            if (dataInfo.data.type == 'withdraw') {
              pType.innerHTML = 'Withdrawal (' + dataInfo.data.fromWallet + ')';
            } else if (dataInfo.data.referenceId != undefined) {
              if (dataInfo.data.gateway == 'credit card') {
                pType.innerHTML = i18next.t('pruchaseWithCC');
              } else {
                pType.innerHTML = i18next.t('purchaseByWire');
              }

            } else if (dataInfo.data.purchaseType == 'crypto') {
              pType.innerHTML = i18next.t('purchaseWithCrypto');
              //h3_TUBE.innerHTML = historyArray[i].data.tubeamount + ' <i class="icon-font-tube tubeFont8"></i>'
            } else {
              pType.innerHTML = dataInfo.data.type.charAt(0).toUpperCase() + dataInfo.data.type.slice(1) + ' earning';
            }

          } else {
            if (dataInfo.data.user_sender != undefined) {
              if (dataInfo.data.userPlatorm == '310b0774-d5ef-e79d-9a7d-23bfa1c7ab95') {
                pType.innerHTML = 'Bittubers ' +
                  i18next.t('donation') + ' to <span>' + dataInfo.data.userSocialId + '</span> from <span>' + dataInfo.data.user_sender + '</span>';
              } else {
                pType.innerHTML = dataInfo.data.userPlatorm.charAt(0).toUpperCase() + dataInfo.data.userPlatorm.slice(1) + ' ' +
                  i18next.t('donation') + ' to <span>' + dataInfo.data.username + '</span> from <span>' + dataInfo.data.user_sender + '</span>';
              }

            } else {
              if (dataInfo.data.userPlatorm == '310b0774-d5ef-e79d-9a7d-23bfa1c7ab95') {
                pType.innerHTML = 'Bittubers ' +
                  i18next.t('donation') + ' to <span>' + dataInfo.data.username + '</span>';
              } else {
                pType.innerHTML = dataInfo.data.userPlatorm.charAt(0).toUpperCase() + dataInfo.data.userPlatorm.slice(1) + ' ' +
                  i18next.t('donation') + ' to <span>' + dataInfo.data.username + '</span>';
              }

            }
          }

        } else {
          if (dataInfo.data.user_sender != undefined) {
            if (dataInfo.data.userPlatorm == '310b0774-d5ef-e79d-9a7d-23bfa1c7ab95') {
              pType.innerHTML = 'Bittubers ' +
                i18next.t('donation') + ' to <span>' + dataInfo.data.userSocialId + '</span> from <span>' + dataInfo.data.user_sender + '</span>';
            } else {
              pType.innerHTML = dataInfo.data.userPlatorm.charAt(0).toUpperCase() + dataInfo.data.userPlatorm.slice(1) + ' ' +
                i18next.t('donation') + ' to <span>' + dataInfo.data.username + '</span> from <span>' + dataInfo.data.user_sender + '</span>';
            }

          } else {
            if (dataInfo.data.referenceId != undefined) {
              pType.innerHTML = i18next.t('purchaseByWire');

            } else {
              if (dataInfo.data.userPlatorm == '310b0774-d5ef-e79d-9a7d-23bfa1c7ab95') {
                pType.innerHTML = 'Bittubers ' +
                  i18next.t('donation') + ' to <span>' + dataInfo.data.userSocialId + '</span>';
              } else {
                pType.innerHTML = dataInfo.data.userPlatorm.charAt(0).toUpperCase() + dataInfo.data.userPlatorm.slice(1) + ' ' +
                  i18next.t('donation') + ' to <span>' + dataInfo.data.username + '</span>';
              }


            }

          }

        }
      }

      divData.appendChild(pType);

      const donatedAmount = document.createElement('p');
      let currencySymb;
      donatedAmount.align = 'left';
      donatedAmount.classList.add('breakAll');
      donatedAmount.classList.add('margin10');
      donatedAmount.classList.add('defaultColor');
      if (dataInfo.data[0] != undefined) {
        if (dataInfo.data[0]['paypal'] != undefined) {
          switch (dataInfo.data[0]['paypal']['payment']['transactions'][0]['amount'].currency) {
            case 'USD':
              currencySymb = '&dollar;'
              break;
            case 'AUD':
              currencySymb = 'A&dollar;'
              break;
            case 'GBP':
              currencySymb = '&pound;'
              break;
            case 'NZD':
              currencySymb = 'N&dollar;'
              break;
            case 'EUR':
              currencySymb = '&euro;'
              break;
          }
          donatedAmount.innerHTML = (dataInfo.data[0]['tube']['transaction'].amount / 1e8) + ' <i class="icon-font-tube tubeFont"></i> / <label id="fiatValue">' + dataInfo.data[0]['paypal']['payment']['transactions'][0]['amount'].total + ' ' + currencySymb + '</label>  <br><label class="modalDate"> ' + new Date(parseInt(dataInfo.time)).toLocaleString().split('GMT')[0]
        }

      } else {
        if (dataInfo.data.type == 'withdraw') {
          switch (dataInfo.data.fiat) {
            case 'USD':
              currencySymb = '&dollar;'
              break;
            case 'AUD':
              currencySymb = 'A&dollar;'
              break;
            case 'GBP':
              currencySymb = '&pound;'
              break;
            case 'NZD':
              currencySymb = 'N&dollar;'
              break;
            case 'EUR':
              currencySymb = '&euro;'
              break;
            default:
              currencySymb = dataInfo.data.fiat
              break;
          }
          donatedAmount.innerHTML = dataInfo.data.amount + ' <i class="icon-font-tube tubeFont"></i> / <label id="fiatValue">' + dataInfo.data.fiat_amount + ' ' + currencySymb + '</label>  <br><label class="modalDate"> ' + new Date(parseInt(dataInfo.time)).toUTCString().split('GMT')[0]
        } else if ((dataInfo.data.referenceId != undefined && dataInfo.data.type !== 'withdraw') || dataInfo.data.gateway !== undefined) {
          switch (dataInfo.data.currency) {
            case 'USD':
              currencySymb = '&dollar;'
              break;
            case 'AUD':
              currencySymb = 'A&dollar;'
              break;
            case 'GBP':
              currencySymb = '&pound;'
              break;
            case 'NZD':
              currencySymb = 'N&dollar;'
              break;
            case 'EUR':
              currencySymb = '&euro;'
              break;
            default:
              currencySymb = dataInfo.data.currency
              break;
          }
          donatedAmount.innerHTML = dataInfo.data.tubeamount + ' <i class="icon-font-tube tubeFont"></i> / <label id="fiatValue">' + dataInfo.data.amount + ' ' + currencySymb + '</label>  <br><label class="modalDate"> ' + new Date(parseInt(dataInfo.time)).toUTCString().split('GMT')[0]
        } else {
          donatedAmount.innerHTML = dataInfo.data.amount + '<i class="icon-font-tube tubeFont"></i> / <label id="fiatValue"></label> <br><label class="modalDate">' + new Date(parseInt(dataInfo.time)).toUTCString().split('GMT')[0];
        }
      }

      divData.appendChild(donatedAmount);

      if (dataInfo.data.referenceId === undefined && dataInfo.data.type != 'withdraw' && dataInfo.data[0] == undefined && dataInfo.data.gateway === undefined) {
        fetchTUBEValue(localStorage.getItem('currencySelected')).then(function (responseFetch) {
          if (responseFetch != undefined) {
            switch (responseFetch.currency) {
              case 'USD':
                currencySymb = '&dollar;'
                break;
              case 'AUD':
                currencySymb = 'A&dollar;'
                break;
              case 'GBP':
                currencySymb = '&pound;'
                break;
              case 'NZD':
                currencySymb = 'N&dollar;'
                break;
              case 'EUR':
                currencySymb = '&euro;'
                break;
              default:
                currencySymb = responseFetch.currency
                break;
            }
            document.getElementById('fiatValue').innerHTML = (new Number(dataInfo.data.amount) * responseFetch.value).toFixed(2) + ' ' + currencySymb
          }
        });
      }

      if (dataInfo.data.type != 'registration') {
        if (dataInfo.data.referenceId != undefined) {
          const referenceID = document.createElement('p');
          referenceID.align = 'left';
          referenceID.classList.add('breakAll');
          referenceID.classList.add('margin10');
          referenceID.innerHTML = '<span class="line">' + i18next.t('referenceID') + '</span>' + ' ' + dataInfo.data.referenceId;
          divData.appendChild(referenceID);
        }
        if (dataInfo.data.paymentId != undefined) {
          const paymentId = document.createElement('p');
          paymentId.align = 'left';
          paymentId.classList.add('breakAll');
          paymentId.classList.add('margin10');
          paymentId.innerHTML = '<span class="line">' + i18next.t('paymentID') + '</span>' + ' ' + dataInfo.data.paymentId;
          divData.appendChild(paymentId);
        }

        if (dataInfo.data.tx_hash != undefined) {
          const transactionHash = document.createElement('p');
          transactionHash.align = 'left';
          transactionHash.classList.add('breakAll');
          transactionHash.classList.add('margin10');
          transactionHash.innerHTML = '<span class="line">' + i18next.t('transactionHash') + ':</span>' + '' + '<a target="blank" href=https://explorer.bittube.cash/tx/' + dataInfo.data.tx_hash + '>' + dataInfo.data.tx_hash + '</a>';
          divData.appendChild(transactionHash);
        }

        if (dataInfo.data.tx_key != '' && dataInfo.data.tx_key != undefined) {
          const transactionKey = document.createElement('p');
          transactionKey.align = 'left';
          transactionKey.classList.add('breakAll');
          transactionKey.classList.add('margin10');
          transactionKey.innerHTML = '<span class="line">' + i18next.t('transactionKey') + ':</span>' + ' ' + dataInfo.data.tx_key;
          divData.appendChild(transactionKey);
        }
      }

      if (dataInfo.data.referenceId == undefined) {
        const qrInfo = document.createElement('p');
        qrInfo.align = 'left';
        qrInfo.classList.add('breakAll');
        qrInfo.classList.add('margin10');
        qrInfo.classList.add('marginTop20');

        // qrInfo.classList.add('qrInfo');
        new QRCode(qrInfo, {
          text: "https://explorer.bittube.cash/tx/" + dataInfo.data.tx_hash,
          width: 75,
          height: 75,
          colorDark: "#000000",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.L
        });
        const labelQR = document.createElement('label');
        labelQR.className = 'labelQR';
        labelQR.innerHTML = i18next.t('bittube') + '<br>' + i18next.t('transactionExplorer'); //'BitTube <br> transaction explorer';
        qrInfo.appendChild(labelQR);
        divData.appendChild(qrInfo);
      }

      document.getElementById('divInfoData').appendChild(divData);
    }
  });

  transactionInfo.show();
}

let airtimeData = [];
let dataAirtimeStatistics;

function getAirtimeStatistics(uuid, type = '') {
  const url = airtimeBaseURL + '/airtime-stats?uuid=' + uuid;

  firebase.auth().currentUser.getIdToken().then(function (token) {
    sendGetRequest(url, token, function (user, response) {
      try {
        const resultAirtime = JSON.parse(response);
        dataAirtimeStatistics = resultAirtime.data;
        const totals = resultAirtime.totals;
        // // console.log(totals)
        const paidAmount = totals.paid;
        const dataTime = localStorage.getItem('dataChart');

        fetchTUBEValue(localStorage.getItem('currencySelected')).then(function (responseFetch) {
          if (responseFetch != undefined) {
            var interval = setInterval(function () {
              if (gotTotalEarnings) {
                var total = convert(paidAmount) + totalUserEarnings;
                let currencySymb = responseFetch.currency;
                switch (responseFetch.currency) {
                  case 'USD':
                    currencySymb = '&dollar;'
                    break;
                  case 'AUD':
                    currencySymb = 'A&dollar;'
                    break;
                  case 'GBP':
                    currencySymb = '&pound;'
                    break;
                  case 'NZD':
                    currencySymb = 'N&dollar;'
                    break;
                  case 'EUR':
                    currencySymb = '&euro;'
                    break;
                }
                document.getElementById('spanPaidBalance').innerHTML = total.toFixed(2) + ' <i class="icon-font-tube tubeFont10"></i> / <span id="actualValueBalance"> ' + (total * responseFetch.value).toFixed(2) + ' ' + currencySymb + '</span>';

                document.getElementById('loadingPaid').classList.add('displayNone');
                document.getElementById('spanPaidBalance').classList.remove('displayNone');
                clearInterval(interval);
              }
            }, 100);

          }

        });

        if (totals.airtime == 0 && totals.counted == 0 & totals.paid == 0 && totals.reward == 0) {
          if (document.getElementById('infoText') != null) {
            document.getElementById('infoText').classList.remove('displayNone');
          }

        } else {
          if (document.getElementById('infoText') != null) {
            document.getElementById('infoText').classList.add('displayNone');
          }
        }

        fillData(dataAirtimeStatistics);
        fillChart(type);


      } catch (ex) {
        // console.log(ex);
        // console.log(response);
      }
    });
  });

}

var fullLabels = [];
var fullRewards = [];
var fullCounted = [];
var fullAirtime = [];
var date;

function fillData(data) {
  airtimeLabelsChart = [];
  airtimeData = [];
  if (airtimeActive) {
    for (var i = 29; i > 0; i--) {
      airtimeData.unshift(data[i]);

      var date = new Date(data[i].timestamp);
      var fullDate = date.getUTCDate() + '/' + (date.getUTCMonth() + 1);
      fullAirtime.push(millisToMinutesAndSeconds(data[i].airtime));
      fullCounted.push(millisToMinutesAndSeconds(data[i].counted));
      fullRewards.push(convert(data[i].reward));
      fullLabels.push(fullDate);

    }
  }

}

var chart;

var chartDuration = 7;

var airtimeDataChart = [];
var airtimeLabelsChart = [];
var countedData = [];
var rewardData = [];

var marketCap = [];
var priceBTC = [];
var priceUSD = [];
var volumeUSD = [];
var fullChartCoinLabels = [];

var chartMarket = [];
var chartBTC = [];
var chartUSD = [];
var chartVolume = [];
var chartCoinLabels = [];
var chartCoin;

function fillChart(type = '') {
  var ctx = document.getElementById('myChart').getContext('2d');
  ctx.height = 250;

  if (airtimeActive) {
    if (document.getElementById('spanSoon') != null) {
      document.getElementById('spanSoon').remove();
    }
    const vpnUsage = localStorage.getItem('chart') == 'vpnValue';
    const airtimeVar = vpnUsage ? 'proxy_airtime' : 'airtime';
    const countedVar = vpnUsage ? 'proxy_counted' : 'counted';
    const rewardVar = vpnUsage ? 'proxy_reward' : 'reward';
    for (var i = 1; i <= chartDuration; ++i) {
      const idx = airtimeData.length - i;
      var date = new Date(airtimeData[idx].timestamp);
      var fullDate = date.getUTCDate() + '/' + (date.getUTCMonth() + 1);
      airtimeDataChart.unshift(millisToMinutesAndSeconds(airtimeData[idx][airtimeVar]));
      countedData.unshift(millisToMinutesAndSeconds(airtimeData[idx][countedVar]));
      rewardData.unshift(convert(airtimeData[idx][rewardVar]));
      airtimeLabelsChart.unshift(fullDate);
    }

    var config = createConfig(airtimeDataChart, airtimeLabelsChart, countedData, rewardData, vpnUsage);

    if (chart == undefined) {
      chart = new Chart(ctx, config);
    } else {
      chart.data = config.data;
      chart.options = config.options;
      chart.update();
    }
  } else {

    var config = createConfigNoActive(['0', '0', '0', '0', '0', '0', '0', '0', '0', '0'], ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00']);
    chart = new Chart(ctx, config);

  }
  if (type == 'module') {
    document.getElementById('divLinkedAccounts').classList.add('displayNone');
    document.getElementById('divStatsModule').classList.remove('displayNone');
    document.getElementById('statsModule').classList.remove('displayNone');
  } else {
    document.getElementById('divLoaderChart').style.opacity = "0";
    document.getElementById('divLoaderChart').style.visibility = "hidden";
  }

  document.getElementById('chartContainer').style.opacity = "1"
  document.getElementById('chartContainer').style.visibility = "visible";



}

function millisToMinutesAndSeconds(millis) {
  var minutes = (millis / 60000).toFixed(0);
  return minutes;
}

function createConfigNoActive(data, labels) {
  return {
    data: {
      datasets: [{
        data: data,
        label: i18next.t('reward'),
        borderColor: '#00abff',
        borderWidth: 1,
        backgroundColor: '#00abff',
        fill: true,
        type: 'line',
        target: 'dateset0',
      }],
      labels: labels,
    },
    options: {
      responsive: true,
      legend: {
        display: false,
        labels: {
          usePointStyle: true
        }
      },
      title: {
        display: false,
      },
      scales: {
        yAxes: [{
          type: 'linear',
          position: 'left',
          stepSize: 0.5,
          fontColor: '#343434',
          fontFamily: 'Open Sans, sans-serif',
          display: true,
        }],
        xAxes: [{
          fontColor: '#343434',
          fontFamily: 'Open Sans, sans-serif'
        }]
      }
    },
  };
}

function createConfig(airtimeDataChart, airtimeLabelsChart, countedData, rewardData, vpnUsage) {
  const vpn_label = vpnUsage ? i18next.t('footerVPN') + ' ' : '';
  return {
    data: {
      datasets: [{
          id: 'reward',
          data: rewardData,
          label: vpn_label + i18next.t('reward'),
          borderColor: '#14ef1c',
          borderWidth: 1,
          backgroundColor: 'rgba(20,239,28,0.5)',
          fill: true,
          pointStyle: 'rect',
          borderWidth: 1,
          type: 'line',
          target: 'dateset0',
        },
        {
          id: 'airtime',
          type: 'line',
          data: airtimeDataChart,
          label: vpn_label + i18next.t('airtime'),
          borderColor: '#00abff',
          borderWidth: 1,
          backgroundColor: 'rgba(0,171,255,0.5)',
          fill: true,
          pointStyle: 'rect',
          borderWidth: 1,
          target: 'origin',
        }, {
          id: 'counted',
          data: countedData,
          type: 'line',
          label: vpn_label + i18next.t('countedAirtime'),
          borderColor: '#343434',
          borderWidth: 1,
          backgroundColor: 'rgba(52,52,52,0.5)',
          fill: true,
          pointStyle: 'rect',
          borderWidth: 1,
          target: 'dataset0',
        }

      ],
      labels: airtimeLabelsChart,
    },
    options: {
      maintainAspectRatio: false,
      hover: {
        mode: 'nearest',
        intersect: true
      },
      animation: false,
      layout: {

        padding: {
          left: 0,
          right: 0,
          top: -5,
          bottom: 0,

        }
      },
      responsive: true,
      legend: {
        display: true,
        labels: {
          usePointStyle: true
        }
      },
      title: {
        display: false,
      },
      tooltips: {
        // enabled: true,
        mode: 'index',
        intersect: false,
        // position: 'nearest',
        titleMarginBottom: 5,
        xPadding: 10,
        yPadding: 10,
        callbacks: {
          label: function (tooltipItem, data) {
            switch (data.datasets[tooltipItem.datasetIndex].id) {
              case 'reward':
                return ' ' + tooltipItem.yLabel + ' TUBEs';;
              case 'airtime':
                return ' ' + Math.round(tooltipItem.yLabel * 100) / 100 + ' ' + i18next.t('minutes');
              case 'counted':
                return ' ' + Math.round(tooltipItem.yLabel * 100) / 100 + ' ' + i18next.t('minutes');
              default:
                return data.datasets[tooltipItem.datasetIndex].label;
            }
          }
        },
      },
      scales: {
        yAxes: [{
          type: 'linear',
          position: 'left',
          stepSize: 0.5,
          fontColor: '#343434',
          fontFamily: 'Open Sans, sans-serif',
          display: false,
        }],
        xAxes: [{
          fontColor: '#343434',
          fontFamily: 'Open Sans, sans-serif'
        }]
      }
    },
  };
}

function updateChart(element, time, type = '') {
  if (type == '') {
    if (element) setButtonFilterActive(element);
  }

  if (airtimeActive) {
    fillData(dataAirtimeStatistics);
    fillChart(type);
    // getAirtimeStatistics(localStorage.getItem('uuid'))
  }

}

// Function to set the button filter active or not
function setButtonFilterActive(element) {
  let buttons = document.getElementsByClassName("customButtonStyleSelected");
  let i = 0;
  while (i < buttons.length) {
    buttons[i].className = buttons[i].className.replace(/\bcustomButtonStyleSelected\b/g, "customButtonStyle");
    i++;
  }
  element.classList.add('customButtonStyleSelected');
}



let fetching = null;
let timerPriceRefresh = null;

const fetchTUBEValue = async (currency) => {
  if (currency == null) {
    currency = 'USD';
  }
  // if (fetching == currency) return;
  fetching = currency;
  try {
    const priceToken = await getConversionRate(currency);
    const actualPrice = priceToken.rate;
    const resultFetch = {};
    resultFetch.currency = currency;
    resultFetch.value = actualPrice.toFixed(3);
    return resultFetch;
  } catch (error) {
    // console.log(error);
  } finally {
    clearTimeout(timerPriceRefresh);
    timerPriceRefresh = setTimeout(() => fetchTUBEValue(currency), 240000);
    fetching = null;
  }
}
const conversionRateToken = {};
const getConversionRate = (currency) => {
  const cached = conversionRateToken[currency];
  if (!cached || (Date.now() - cached.time) >= 180000) {
    const promise = firebaseFunc(`conversionRate`, {
        query: {
          currency
        }
      })
      .then(resp => resp.json())
      .catch(err => {
        delete conversionRateToken[currency];
        throw err;
      });
    conversionRateToken[currency] = {
      time: Date.now(),
      promise
    };
  }
  return conversionRateToken[currency].promise;
}


function readAirtimeActive() {
  sendGetRequest('https://pay.bittube.cash/airtime.json', null, function (user, response) {
    airtimeActive = JSON.parse(response).active;
  });
}

function maskIBAN(IBAN) {
  const myRegexp = /\w{0}(.*)\w{4}/g;
  const match = myRegexp.exec(IBAN);
  return IBAN.replace(match[1], '*********');
}

const debounce = (func, ms = 333) => {
  let timer = null;
  return function () {
    const args = arguments;
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), ms);
  }
}


var localStorageEx = {
  get: function (key) {
    var value = localStorage[key];
    if (value != null) {
      var model = JSON.parse(value);
      if (model.payload != null && model.expiry != null) {
        var now = new Date();
        if (now > Date.parse(model.expiry)) {
          localStorage.removeItem(key);
          return null;
        }
      }
      return JSON.parse(value).payload;
    }
    return null;
  },
  set: function (key, value, expirySeconds) {
    var expiryDate = new Date();
    expiryDate.setSeconds(expiryDate.getSeconds() + expirySeconds);
    localStorage[key] = JSON.stringify({
      payload: value,
      expiry: expiryDate
    });
  }
};
const addOrDeleteFavoriteCountry = async (country, action) => {
  const token = await getFirebaseToken();
  sendGetRequest(functionBaseURL + '/app/addUserFavoritesProxy?country=' + country + '&action=' + action, token, function (user, response) {
    // console.log(JSON.parse(response));
  });
}

const getFavoritesCountry = async () => {
  const token = await getFirebaseToken();
  const countriesContainer = document.querySelector(".otherCountries")
  sendGetRequest(functionBaseURL + '/app/getUserFavoritesProxy', token, function (user, response) {
    const favorites = JSON.parse(response).allFavorites;
    if (JSON.parse(response).success) {
      const starContainer = document.querySelectorAll(".starContainer");
      for (let i = 0; i < starContainer.length; i++) {
        starContainer[i].classList.remove('favorite');
      }

      for (var k in favorites) {
        if (favorites.hasOwnProperty(k)) {
          for (let i = 0; i < starContainer.length; i++) {
            if (starContainer[i].getAttribute('data-country') == k && favorites[k].active == 1) {

              starContainer[i].classList.add('favorite');
              const favorited = starContainer[i].parentElement
              countriesContainer.removeChild(starContainer[i].parentElement)
              countriesContainer.insertBefore(favorited, countriesContainer.firstChild);

            }
          }

        }
      }
    }

  });
}
const getProxyList = async () => {
  const token = await getFirebaseToken();
  return new Promise((resolve, reject) => {
    sendGetRequest(functionBaseURL + "/app/getProxylist", token, function (user, response) {
      const result = JSON.parse(response)
      resolve(result)
    })
  })
}
// VPN STUFF


const getCountry = async (arrayIp, arrayCity) => {
  let dataProxy = await getProxyList()
  fillCountry(dataProxy.data, arrayIp, arrayCity)
  let country
  if (localStorage.getItem("AirtimeProxy") != null) {
    country = localStorage.getItem("AirtimeProxy")
  } else {
    country = "Canada"
  }

  if (localStorage.getItem('vpn_warning') == null) {
    document.querySelector(".notConnectedPopup").style.display = "block"
  }

  document.getElementById("countrySelected").innerHTML = country
  const currentFlag = document.getElementById('flagContainer').classList[1];
  document.getElementById('flagContainer').classList.remove(currentFlag);
  const iso = document.querySelector('[data-country="' + country + '"] .countryInfo .spanFlag').getAttribute('data-iso')
  document.getElementById('flagContainer').classList.add("flag-" + iso);
  fillCity(country, arrayCity)
}
const fillCountry = (data, arrayIp, arrayCities) => {
  const otherCountries = document.querySelector(".otherCountries")
  const starSample = document.querySelector(".starSample")
  const countryPop = []
  const vpnContainer = document.querySelector(".vpnContainer");
  const countryselectContainer = document.querySelector(".countryselectContainer");
  data.forEach(country => {
    if (!countryPop.includes(country.country)) {
      countryPop.push(country.country)
      const newCountry = document.createElement("div")
      newCountry.classList.add("country")
      newCountry.dataset.country = country.country
      const countryContent = document.createElement("div")
      countryContent.classList.add("countryInfo")
      const countryFlag = document.createElement("span")
      countryFlag.classList.add("spanFlag")
      countryFlag.classList.add("flag-" + country.iso)
      countryFlag.dataset.iso = country.iso
      const contentName = document.createElement("div")
      contentName.classList.add("countryName")
      contentName.innerHTML = country.country
      otherCountries.appendChild(newCountry)
      const newStar = starSample.cloneNode(true)
      newStar.classList.remove("starSample")
      newStar.classList.remove("displayNone")
      newStar.dataset.country = country.country
      newCountry.appendChild(countryContent)
      countryContent.appendChild(countryFlag)
      countryContent.appendChild(contentName)
      newCountry.appendChild(newStar)
      // City array
      arrayCities[country.country] = []
      arrayCities[country.country].push(country.city)
    } else {
      arrayCities[country.country].push(country.city)
    }
    // Fill ip data
    const name = country.city
    const dataObj = {}
    dataObj.ip = country.ip
    dataObj.port = country.port
    arrayIp[name] = dataObj

  });

  // Select country navigation
  const allCountries = document.querySelectorAll(".country");
  const pickCountry = (country, iso, array) => {
    vpnContainer.style.display = 'block';
    vpnContainer.style.animationName = 'panelRight';
    countryselectContainer.style.display = 'none';
    document.getElementById("countrySelected").innerHTML = country;
    fillCity(document.getElementById("countrySelected").innerHTML, array);
    localStorage.setItem("AirtimeProxy", country)
    const currentFlag = document.getElementById('flagContainer').classList[1];
    document.getElementById('flagContainer').classList.remove(currentFlag);
    document.getElementById('flagContainer').classList.add("flag-" + iso);
  };

  for (let i = 0; i < allCountries.length; i++) {
    allCountries[i].addEventListener("click", (e) => {
      if (!e.target.classList.contains("starContainer")) {
        pickCountry(allCountries[i].getAttribute('data-country'), allCountries[i].querySelector(".countryInfo .spanFlag").getAttribute('data-iso'), arrayCities);
      }
    });
  }
  const starContainer = document.querySelectorAll(".starContainer")
  for (let i = 0; i < starContainer.length; i++) {
    starContainer[i].addEventListener("click", (e) => {
      const country = e.target.parentElement.querySelector(".countryName").innerText;
      if (!e.target.classList.contains("favorite")) {
        starContainer[i].classList.add("favorite");
        addOrDeleteFavoriteCountry(country, 'addfavorite');
      } else {
        starContainer[i].classList.remove("favorite");
        addOrDeleteFavoriteCountry(country, 'deletefavorite');
      }
    })
  }
  getFavoritesCountry();
}
const fillCity = (country, array) => {
  const protocolSelect = document.getElementById("protocolSelect")
  protocolSelect.innerHTML = ''
  let cities = array[country]

  for (let i = 0; i < cities.length; i++) {
    const newOption = document.createElement("option");
    newOption.textContent = cities[i];
    newOption.value = cities[i];
    protocolSelect.appendChild(newOption);
  }
  if (localStorage.getItem("AirtimeProxyCity") != null) {
    const allOptions = document.querySelectorAll(".protocolSelect option")
    for (let i = 0; i < allOptions.length; i++) {
      if (allOptions[i].innerText == localStorage.getItem("AirtimeProxyCity")) {
        document.getElementById("protocolSelect").value = localStorage.getItem("AirtimeProxyCity")
      }
    }

  }
}

const getNotificationsCount = async () => {
  try {
    const url = functionBaseURL + '/app/getNotifications?action=count';
    const totalNotifications = await firebaseXhr(url);
    if (totalNotifications.result == 'Success') {
      if (totalNotifications.usernoti != 0) {
        localStorageEx.set('totalUserNotifications', totalNotifications.usernoti, 3000);
        document.getElementById('notifCount').children[0].innerHTML = totalNotifications.usernoti;
        document.getElementById('notifCount').classList.remove('displayNone');
      } else {
        localStorage.removeItem('totalUserNotifications');
        document.getElementById('notifCount').children[0].innerHTML = totalNotifications.usernoti;
        document.getElementById('notifCount').classList.add('displayNone');
      }
    }
  } catch (err) {
    console.log('Error getting notifications count', err);
  }
}

function getVPNToken() {
  if (getVPNToken.promise) return getVPNToken.promise;
  try {
    const cached = localStorage.getItem('vpn_token')
    if (cached !== null) {
      const json = JSON.parse(cached);
      return getVPNToken.promise = Promise.resolve(cached);
    }
  } catch (err) {};

  const user = firebase.auth().currentUser;
  if (!user) return Promise.reject(new Error('No firebase current user?'));
  getVPNToken.promise = new Promise(async (resolve, reject) => {
    try {
      const token = await user.getIdToken();
      const headers = {
        Authorization: `Bearer ${token}`
      };
      const url = functionBaseURL + '/app/getVPNToken';
      const json = await fetch(url, {
        headers
      }).then(resp => resp.json());
      if (json.error) throw new Error(`getVPNToken error: ${json.error}`);
      resolve(json);
    } catch (err) {
      reject(err);
      delete getVPNToken.promise;
    }
  }).then(token => {
    localStorage.setItem('vpn_token', JSON.stringify(token));
    return token;
  });
  return getVPNToken.promise;
}

const getUserDocuments = async () => {
  try {
    const url = functionBaseURL + '/app/getUserDocuments';
    const claims = await getFirebaseClaims();
    if (claims.hasKYC) {
      setDivVerified('verified');
    } else {
      const result = await firebaseXhr(url);
      if (result.result) {
        if (localStorage.getItem('documentType') == 'nationalId') {
          if (result.data.document1URL && result.data.document2URL && result.data.selfie) {
            if (!result.data.errors) {
              if (result.data.verified) {
                setDivVerified('verified');
              } else {
                setDivVerified('inprocess');
              }
            } else {
              if (!result.data.errors.selfie && !result.data.errors.document1URL && !result.data.errors.document2URL && !result.data.verified) {
                localStorage.setItem('documentsUploaded', 'incomplete');
                setDivVerified('inprocess');
              } else if (!result.data.errors.selfie && !result.data.errors.document1URL && !result.data.errors.document2URL && result.data.verified) {
                setDivVerified('verified');
              } else {
                localStorage.setItem('documentsError', 'true');
                localStorage.setItem('documentsUploaded', 'incomplete');
                setImagesBackground(result);
                if (result.data.errors.selfie) {
                  showErrorImage('divImagesSelfie', 'divWrongSelfie', 'divIconWrongSelfie')
                  document.getElementById('buttonStartVerifyDocuments').setAttribute('data-step', 'selfie');
                }
                if (result.data.errors.document1URL) {
                  showErrorImage('divImageDocument1', 'divWrongImage1', 'divIconWrontImage1')
                } else {
                  showErrorImage('divImageDocument1', 'divImgVerified1', 'divIconImgVerified1')
                }
                if (result.data.errors.document2URL) {
                  showErrorImage('divImageDocument2', 'divWrongImage2', 'divIconWrontImage2')
                } else {
                  showErrorImage('divImageDocument2', 'divImgVerified2', 'divIconImgVerified2')
                }
              }

            }
          } else if (result.data.document1URL && result.data.document2URL && !result.data.selfie) {
            localStorage.setItem('documentsUploaded', 'incomplete');
            document.getElementById('divImageDocument1').classList.add('displayNone');
            document.getElementById('divImageDocument2').classList.add('displayNone');
            document.getElementById('divImage1').style.backgroundImage = 'url("' + result.data.document1URL + '")';
            document.getElementById('divImage2').style.backgroundImage = 'url("' + result.data.document2URL + '")';
            document.getElementById('buttonStartVerifyDocuments').removeAttribute('disabled');
            document.getElementById('buttonStartVerifyDocuments').setAttribute('data-step', 'selfie');
            document.querySelector('#buttonStartVerifyDocuments > .textButton').innerText = i18next.t('continue');
          }
        } else if (localStorage.getItem('documentType') == 'passport') {
          if (result.data.document1URL && result.data.selfie) {
            if (!result.data.errors) {
              document.getElementById('buttonStartVerifyDocuments').removeAttribute('data-step');
              document.getElementById('buttonStartVerifyDocuments').setAttribute('disabled', true);
              document.querySelector('#buttonStartVerifyDocuments > .textButton').innerText = i18next.t('verificationComplete');
            } else {
              if (!result.data.errors.selfie && !result.data.errors.document1URL && !result.data.verified) {
                localStorage.setItem('documentsUploaded', 'incomplete');
                setDivVerified('inprocess');
              } else if (!result.data.errors.selfie && !result.data.errors.document1URL && result.data.verified) {
                localStorage.setItem('documentsUploaded', 'incomplete');
                setDivVerified('verified');
              } else {
                setImagesBackground(result);
                if (result.data.errors.selfie) {
                  showErrorImage('divImagesSelfie', 'divWrongSelfie', 'divIconWrongSelfie')
                  document.getElementById('buttonStartVerifyDocuments').setAttribute('data-step', 'selfie');
                }
                if (result.data.errors.document1URL) {
                  showErrorImage('divImageDocument1', 'divWrongImage1', 'divIconWrontImage1')
                } else {
                  showErrorImage('divImageDocument1', 'divImgVerified1', 'divIconImgVerified1');
                }

              }

            }
          } else if (result.data.document1URL && !result.data.selfie) {
            localStorage.setItem('documentsUploaded', 'incomplete');
            document.getElementById('divImagePassport').style.backgroundImage = 'url("' + result.data.document1URL + '")';

            document.getElementById('buttonStartVerifyDocuments').removeAttribute('disabled');
            document.getElementById('buttonStartVerifyDocuments').setAttribute('data-step', 'selfie');
            document.querySelector('#buttonStartVerifyDocuments > .textButton').innerText = i18next.t('continue');
          }
        }
        if (result.data.real_name) {
          if (document.getElementById('fullName') != null) {
            document.getElementById('fullName').value = result.data.real_name;
          }
        }

      } else {
        localStorage.setItem('documentsUploaded', 'false');
        localStorage.removeItem('document1');
        localStorage.removeItem('document2');
        localStorage.removeItem('selfie');
      }
    }
    await updateCustomClaims();
  } catch (err) {
    console.log('Error getting user documents ==> ', err)
  }
}
const setImagesBackground = (result) => {
  document.getElementById('divImageDocument1').classList.add('displayNone');
  document.getElementById('divImageDocument2').classList.add('displayNone');
  if ( document.getElementById('divImageSelfie') !== null ){
    document.getElementById('divImageSelfie').classList.add('displayNone');
  }
  document.getElementById('divImage1').style.backgroundImage = 'url("' + result.data.document1URL + '")';
  document.getElementById('divImage2').style.backgroundImage = 'url("' + result.data.document2URL + '")';
  document.getElementById('divSelfie').style.backgroundImage = 'url("' + result.data.selfie + '")';
}
const showErrorImage = (element1, element2, element3) => {
  localStorage.setItem('documentsUploaded', 'errors')
  document.getElementById(element1).classList.add('displayNone');
  document.getElementById(element2).classList.remove('displayNone');
  document.getElementById(element3).classList.remove('displayNone');
}

const setDivVerified = (state) => {
  document.getElementById('buttonStartVerifyDocuments').removeAttribute('data-step');
  document.getElementById('buttonStartVerifyDocuments').setAttribute('disabled', true);
  switch (state) {
    case 'verified':
      document.querySelector('#buttonStartVerifyDocuments > .textButton').innerText = i18next.t('verificationComplete');
      break;
    case 'inprocess':
      document.querySelector('#buttonStartVerifyDocuments > .textButton').innerText = i18next.t('inProcess');
      break;
  }
}
// === VPN HELPERS START ===
const use_ff_proxy = typeof browser !== 'undefined';

const getProxySettings = () => {
  return new Promise((resolve, reject) => {
    chrome.proxy.settings.get({
      'incognito': false
    }, resolve);
  });
};

const clearProxySettings = () => {
  return new Promise((resolve, reject) => {
    localStorage.removeItem('vpn_address');
    chrome.proxy.settings.clear({}, resolve);
    switch (checkBrowser()) {
      case 'chrome':
        const opt = {
          type: "basic",
          title: i18next.t('vpnConnectionDisabled'),
          message: i18next.t('vpnConnectionDisabledText'),
          iconUrl: "./assets/images/logo.png"
        };
        chrome.notifications.create(opt);
        try {
          document.querySelector('#countrySelect').disabled = false;
        } catch (err) {}
        break;
      case 'firefox':
        new Notification(i18next.t('vpnConnectionDisabled'), {
          body: i18next.t('vpnConnectionDisabledText'),
          icon: "./assets/images/logo.png"
        });
        break;
    }
  });
};

const isProxyActive = async () => {
  const settings = await getProxySettings();
  if (use_ff_proxy) {
    const host = localStorage.getItem('vpn_address');
    return settings.value && settings.value.proxyType === 'manual' && settings.value.http === host && settings.value.httpProxyAll === true;
  } else {
    return settings.value && settings.value.mode === 'pac_script' && settings.value.pacScript && settings.value.pacScript.data.indexOf('!BittubeVPN') !== -1;
  }
};

const isOtherExtensionControllingProxy = async () => {
  const settings = await getProxySettings();
  return settings.levelOfControl === 'controlled_by_other_extensions';
};

const confirmDeletePhoneWith2fa = async () => {
  const token = await getFirebaseToken();
  const code = document.getElementById('verifySecretDeletePhone').value;
  const url = functionBaseURL + '/app/verifySecret?userToken=' + code + '&action=login2fa'

  sendGetRequest(url, token, function (user, response) {
    console.log(response)
    showHideButtonLoader('confirm2fa', 'hideLoader');
    if (response == 'correctCode') {
      document.getElementById('divConfirm2FACode').classList.add('displayNone');
      document.getElementById('mainDivBasicVerification').classList.remove('displayNone');
      document.getElementById('mainDivBasicVerification').style.animation = "listPop 0.4s ease forwards"
      document.getElementById('deletePhoneNumber').classList.remove('displayNone');
      document.getElementById('verifyByPhoneNumber').classList.add('displayNone');
      showConfirmDeleteNumberModal();
    } else if (response == 'Verfied status false') {
      const error = [i18next.t('the2FANotCorrect')];
      const inputWithError = ['verifySecretDeletePhone'];
      setErrors(error, inputWithError);
    }

  });


}
// === VPN HELPERS END ===

const showHideReferralSection = async () => {
  const claims = await getFirebaseClaims();
  if (!claims.hasPhone) {
    if (!claims.verified) {
      document.getElementById('divReferralLink').classList.add('displayNone');
      document.getElementById('deletePhoneNumber').classList.add('displayNone');
      document.getElementById('verifyByPhoneNumber').classList.remove('displayNone');
    } else {
      document.getElementById('divReferralLink').classList.remove('displayNone');
      document.getElementById('deletePhoneNumber').classList.remove('displayNone');
      document.getElementById('verifyByPhoneNumber').classList.add('displayNone');
    }
  } else {
    document.getElementById('divReferralLink').classList.remove('displayNone');
    document.getElementById('deletePhoneNumber').classList.remove('displayNone');
    document.getElementById('verifyByPhoneNumber').classList.add('displayNone');
  }
}

const checkUserIsVerified = async () => {
  const claims = await getFirebaseClaims();
  if ((!claims.hasPhone && window.location.pathname == '/buytubes.html' || (!claims.verified && window.location.pathname == '/buytubes.html')) && ((!claims.hasPhone && window.location.pathname == '/link_account.html') || (!claims.verified && window.location.pathname == '/link_account.html'))) {
    showPopupVerificationPhone();
  }
}

function getUserWalletsAsync(refresh = false) {
  if (!refresh && this.getUserWalletsPromise) return this.getUserWalletsPromise;
  this.getUserWalletsPromise = new Promise(async (resolve, reject) => {
    await firebaseAuthReadyPromise;
    const token = await firebase.auth().currentUser.getIdToken();
    const url = functionBaseURL + '/app/returnWallet';
    sendGetRequest(url, token, function (user, response) {
      try {
        const bytes = CryptoJS.AES.decrypt(response, token);
        const walletInfo = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        var wallets = cachedWallets = walletInfo.wallets;
        resolve(wallets);
      } catch (ex) {
        reject(ex);
      }
    });
  });
  return this.getUserWalletsPromise;
}

function getUserWalletInfo(callback) {
  getUserWalletsAsync().then(callback).catch(err => {
    console.error(err);
  });
}

const callStakingApi = async (method, data) => {
  await firebaseAuthReadyPromise;
  const token = await firebase.auth().currentUser.getIdToken();
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
  const resp = await fetch(`${stakingBaseURL}/${method}`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers
  }).then(resp => resp.json());
  if (!resp.success) throw new Error(`Error calling staking API: ${resp.error}`);
  return resp.result;
}


const getAvailableCurrencies = async () => {
  if (localStorageEx.get('currencies') == null) {
    try {
      const url = functionBaseURL + '/app/getCurrencies';
      const resultCurrencies = await firebaseXhr(url);
      if (resultCurrencies.success) {
        localStorageEx.set('currencies', resultCurrencies.data, 7200);
      }
    } catch (err) {
      console.log('Error getting currencies', err)
    }

  }
}

const getTotalUserNotifications = () => {
  if (document.location.pathname != '/notifications.html' && localStorageEx.get('totalUserNotifications') == null) {
    getNotificationsCount();
  } else {
    if (new Number(localStorageEx.get('totalUserNotifications')) != 0) {
      document.getElementById('notifCount').children[0].innerHTML = localStorageEx.get('totalUserNotifications');
      document.getElementById('notifCount').classList.remove('displayNone');
    } else {
      localStorage.removeItem('totalUserNotifications');
      document.getElementById('notifCount').children[0].innerHTML = 0;
      document.getElementById('notifCount').classList.add('displayNone');
    }

  }
}

const showModalResendActivationEmail = (user) => {
  const instance = mobiscroll.popup('#confirmEmail', {
    display: 'center',
    cssClass: 'popUpResendEmail',
    closeOnOverlayTap: false,
    buttons: [{
        text: i18next.t('resendEmail'),
        cssClass: 'buttonModdal',
        handler: function (event, inst) {
          if (document.getElementsByClassName('buttonModdal')[0].getAttribute('data-disabled') == null) {
            setCookie60sec();
            disableButton60sec('resendEmail');
            user.sendEmailVerification();
          }

        }
      },

      {
        text: i18next.t('cancel'),
        cssClass: 'buttonModdalGrey',
        handler: function (event, inst) {
          inst.hide();
          firebase.auth().signOut().then(function () {
            localStorage.removeItem("firebase:host:bittube-airtime-extension.firebaseapp.com");
            localStorage.removeItem("switch_state");
            document.location.href = '/login.html';
          }, function (error) {
            // An error happened.
            //// console.log(error);
          })
        }
      }
    ],
    onBeforeShow: function (ev, inst) {
      var s = inst.settings;
      if (getCookie('buttondisable') != null) {
        disableButton60sec('resendEmail');
      }
    }
  });
  instance.show();
}
const addCopyListener = () => {
  const allCopyTx = document.querySelectorAll(".txCopy")
  for (let i = 0; i < 3; i++) {
    allCopyTx[i].addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const url = e.path[1].parentElement.querySelector(".inputContent").innerHTML;
      const selBox = document.createElement('textarea');
      selBox.style.position = 'fixed';
      selBox.style.left = '0';
      selBox.style.top = '0';
      selBox.style.opacity = '0';
      selBox.value = url;
      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      document.execCommand('copy');
      document.body.removeChild(selBox);
    })
  }
}
// Function to check if the
window.addEventListener("load", initApp);