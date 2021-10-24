// === Utility Functions Start ===

let fullWallet; // FIXME !

// Check that an event is actually an event and the isTrusted property is true, ensuring that only user spawned events can pass.
// Prevents stuff like 'elem.click()' for security purposes.
const eventIsTrusted = (event) => {
  if (!(event instanceof Event)) return false;
  if (event.isTrusted !== true) return false;
  return true;
};

function createCSSRule(name, rule) {
  if (!this.sheet) {
    // Create and insert the style sheet element.
    const insertedStyleElement = document.createElement('style');
    insertedStyleElement.type = 'text/css';
    const headElem = document.getElementsByTagName('head')[0];
    if (!headElem) throw new Error('createCSSRule: No head element!');
    headElem.appendChild(insertedStyleElement);

    // Check which sheet property to use.
    this.sheet = insertedStyleElement.sheet || insertedStyleElement.styleSheet;
  }

  // Add rule to sheet.
  if (this.sheet.insertRule) { // Most modern browsers
    this.sheet.insertRule(name + '{' + rule + '}', 0);
  } else { // Old style (IE <9?)
    this.sheet.addRule(name, rule, 0);
  }
}

function calculateModalHeight(type = undefined) {
  const url = window.location.hostname;
  if (url.match(/twitter.[a-zA-Z]{1,3}$/) !== null) {
    if (document.getElementsByTagName('body')[0].classList.length != 0) {
      // document.querySelectorAll('.bittube-arrow-down')[0].style.bottom = '0px';
      // document.querySelectorAll('.bittube-arrow-down')[0].style.top = '-7px';
      // document.querySelectorAll('.bittube-arrow-down')[0].style.transform = 'rotate(180deg)';
      document.querySelectorAll('.bittube-arrow-down')[0].style = 'display: none !important;'
      setTimeout(function () {
        document.querySelector(".bittube").style.top = "37px"
      }, 400)
    } else {
      setTimeout(function () {
        if ( document.querySelector(".bittube") !== null ){
          document.querySelector(".bittube").style.top = "-154px"
          // document.querySelector(".bittube").style.top = "-405px"
          document.querySelector(".bittube").style.left = "-140px !important"
        }
      }, 400);
    }
  } else if (url.match(/facebook.[a-zA-Z]{1,3}$/) !== null) {
    document.querySelectorAll('.bittube-arrow-down')[0].style.bottom = '0px';
    document.querySelectorAll('.bittube-arrow-down')[0].style.top = '-7px';
    document.querySelectorAll('.bittube-arrow-down')[0].style.transform = 'rotate(180deg)';
    setTimeout(function () {
      document.querySelector(".bittube").style.top = "37px"
    }, 400)
  } else if (url.match(/twitch.[a-zA-Z]{1,3}$/) !== null) {
    document.querySelectorAll('.bittube-arrow-down')[0].style.bottom = '';
    document.querySelectorAll('.bittube-arrow-down')[0].style.top = '';
    document.querySelectorAll('.bittube-arrow-down')[0].style.transform = '';
    setTimeout(function () {
      document.querySelector(".bittube").style.top = "39px"
    }, 400);
  } else if (document.querySelector(".bittube").parentElement.className == "modalContainer") {
    document.querySelectorAll('.bittube-arrow-down')[0].style.bottom = '';
    document.querySelectorAll('.bittube-arrow-down')[0].style.top = '';
    document.querySelectorAll('.bittube-arrow-down')[0].style.transform = '';
    setTimeout(function () {
      document.querySelector(".bittube").style.top = ("-" + (document.querySelector(".bittube").clientHeight) - 50 + "px");
    }, 40);
  } else {
    document.querySelectorAll('.bittube-arrow-down')[0].style.bottom = '';
    document.querySelectorAll('.bittube-arrow-down')[0].style.top = '';
    document.querySelectorAll('.bittube-arrow-down')[0].style.transform = '';
    setTimeout(function () {
      document.querySelector(".bittube").style.top = ("-" + document.querySelector(".bittube").clientHeight - 10 + "px");
    }, 400)
  }
}

const debounce = (func, ms = 333) => {
  let timer = null;
  return function () {
    const args = arguments;
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), ms);
  }
}

const onElementHeightChange = (elm, callback) => {
  let lastHeight = elm.clientHeight,
    newHeight;
  (function run() {
    newHeight = elm.clientHeight;
    if (lastHeight != newHeight)
      callback();
    lastHeight = newHeight;

    if (elm.onElementHeightChangeTimer)
      clearTimeout(elm.onElementHeightChangeTimer);

    elm.onElementHeightChangeTimer = setTimeout(run, 200);
  })();
}

function applyClass(element, name, doRemove) {
  // If element is a string, get element by that ID.
  let actualElement;
  if (typeof element === 'string') {
    actualElement = document.getElementById(element);
  } else {
    actualElement = element;
  }
  // Error out if element is missing.
  if (!actualElement) {
    // throw new Error('Element not found! ' + element);
    console.warn('applyClass - Element not found!', element, name, doRemove, actualElement);
    return;
  }
  // Add or remove class from element.
  if (doRemove) {
    actualElement.className = actualElement.className.replace(new RegExp('\\b' + name + '\\b', 'g'));
  } else {
    actualElement.className += ' ' + name;
  }
}

function randHex(length) {
  const maxLen = 8;
  const bound = Math.min(length, maxLen);
  const min = Math.pow(16, bound - 1);
  const max = Math.pow(16, bound) - 1;
  const n = Math.floor(Math.random() * (max - min + 1)) + min;
  let r = n.toString(16);
  while (r.length < length) {
    r += randHex(length - maxLen);
  }
  return r;
}

function setTranslations(lang, callback) {
  try {
    if (this.setLang === lang) {
      if (callback) callback();
      return;
    } // Prevent setting to same language twice, just to avoid redundant running.
    this.setLang = lang;
    // console.log(window.location.origin);
    // console.log(chrome.runtime.getURL('/_locales/{{lng}}/extension.json'));

    let path;
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL) {
      path = chrome.runtime.getURL('/_locales/{{lng}}/extension.json'); // For chrome, Gets url based on manifest root dynamically
    } else if (typeof browser !== 'undefined' && browser.runtime && browser.runtime.getURL) {
      path = browser.runtime.getURL('/_locales/{{lng}}/extension.json'); // For firefox, Gets url based on manifest root dynamically
    } else {
      switch (checkBrowser()) { // Original, as fallback of sorts.
        case 'chrome':
          path = 'chrome-extension://cnogbbmciffpibmkphohpebghmomaemi/_locales/{{lng}}/extension.json';
          break;
        default:
          path = window.location.origin + '/_locales/{{lng}}/extension.json'; // Does this actually work anywhere?
          break;
      }
    }
    // console.log("setTranslations Path:", path, lang);

    localStorage.setItem('i18nextLng', lang);

    i18next
      .use(i18nextXHRBackend)
      .use(i18nextBrowserLanguageDetector)
      .init({
        detection: {
          // order and from where user language should be detected
          order: ['localStorage', 'navigator'],
          // keys or params to lookup language from
          lookupLocalStorage: 'i18nextLng',
          // cache user language on
          caches: ['localStorage'],
          excludeCacheFor: ['cimode'], // languages to not persist (cookie, localStorage)
        },
        fallbackLng: 'en',
        load: 'languageOnly',
        backend: {
          loadPath: path, //'/_locales/{{lng}}/extension.json',
        }
      }, (err, t) => {
        // localize = locI18next.init(i18next);
        // localize('.translate');
        // console.log('SetLang Err:', err, 't:', t);
        if (callback) callback();
      });
  } catch (err) {
    console.warn('setTranslations Err:', err, lang);
    if (callback) callback();
  }
}

function checkBrowser() {
  const google_chrome = navigator.userAgent.indexOf('Chrome') > -1;
  const edge = (/Edge\/\d./i.test(navigator.userAgent));
  const firefox = navigator.userAgent.indexOf('Firefox') > -1;
  const safari = navigator.userAgent.indexOf('Safari') > -1;
  const opera = navigator.userAgent.indexOf(' OPR/') > -1;

  if ((google_chrome) && (safari)) safari = false;
  if ((google_chrome) && (edge)) google_chrome = false;
  if ((google_chrome) && (opera)) google_chrome = false;

  let browserName;
  if (google_chrome) {
    browserName = 'chrome';
  } else if (firefox) {
    browserName = 'firefox';
  } else if (safari) {
    browserName = 'safari';
  } else if (edge) {
    browserName = 'edge';
  } else if (opera) {
    browserName = 'opera';
  }
  return browserName;
}

function getModalElement() {
  const modalElem = document.getElementById('bittube-modal');
  if (!modalElem) throw new Error('No donation modal element!');
  return modalElem;
}
// Fetching value

let fetching = null;
let timerPriceRefresh = null;

const fetchTUBEValue = async (currency, amount) => {

  if (document.querySelector(".donationTitle") != null) {
    document.querySelector(".donationTitle").style.display = "none"
    document.querySelector(".donationRate").style.display = "none"
    document.querySelector(".donationSpinner").style.display = "inline-block"
  }
  if (currency == null) {
    currency = 'USD';
  }
  if (fetching == currency) return;
  fetching = currency;
  let actualPrice
  try {
    // const priceToken = await getConversionRate(currency);
    chrome.runtime.sendMessage({
      message: 'getTubePrice',
      currency: currency,
      amount: amount
    }, function (response) {
      if (checkBrowser() == 'chrome') {
        actualPrice = response.value
        const resultFetch = {}
        resultFetch.currency = currency;
        resultFetch.value = actualPrice.toFixed(3);
        if (resultFetch != undefined) {
          let currencySymb = resultFetch.currency;
          switch (resultFetch.currency) {
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
          const result = (new Number(amount) * new Number(resultFetch.value)).toFixed(2) + ' ' + currencySymb;
          if (amount != undefined) {
            if ( document.querySelector(".donationTitle") !== null ){

              document.querySelector(".donationTitle").style.display = "block"
              document.querySelector(".donationRate").style.display = "block"
              document.querySelector(".donationSpinner").style.display = "none"
              const svg = '<svg style="height: 8px; width: 8px; vertical-align: middle; fill: white; margin-left: 2px;" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="125.805px" height="125.805px" viewBox="0 0 125.805 125.805" enable-background="new 0 0 125.805 125.805" xml:space="preserve"> <rect x="26.835" y="44.985" width="72" height="9"/> <rect x="26.835" y="62.985" width="72" height="9"/> <rect x="53.835" y="12.279" width="18" height="113.526"/> <rect x="8.835" y="-0.015" width="108" height="18"/> </svg>';
              // svg.style.height = '8px';
              // svg.style.width = '8px';
              // svg.verticalAlign = 'middle';
              // svg.style.fill = '#ffffff';
              // svg.style.marginLeft = '2px';
              document.querySelector('.donationRate').innerHTML = amount + svg + ' / ' + result;
            }
          } else {
            if ( document.querySelector('.donationRate') !== null ){
              document.querySelector('.donationRate').innerHTML = 'Error'
            }
          }

        }
      }

    });
  } catch (error) {
    console.log(error);
  } finally {
    clearTimeout(timerPriceRefresh);
    timerPriceRefresh = setTimeout(() => fetchTUBEValue(currency), 240000);
    fetching = null;
  }
}
// const getConversionRate = (currency) => {
//   const cached = conversionRateToken[currency];
//   if (!cached || (Date.now() - cached.time) >= 180000) {
//     const promise = firebaseFunc(`conversionRate`, {query: {currency}})
//         .then(resp => resp.json())
//         .catch(err => {
//             delete conversionRateToken[currency];
//             throw err;
//         });
//     conversionRateToken[currency] = {time: Date.now(), promise};
//   }
//   return conversionRateToken[currency].promise;
// }
// === Utility Functions End ===

// TODO: Prefix all the element IDs and classes.

// === Donation Modal Start ===

function createDonationModal(platform = '') {
  // if (document.getElementById('bittube-modal')) throw new Error('Donation modal already exists!');
  // FIXME: Stuff might call this more than once?
  const existingModal = document.getElementById('bittube-modal');
  const existingPanel = document.querySelector('.BitTube-panelContainer');
  if (existingModal || existingModal != null) {
    document.body.appendChild(existingModal)
    // console.warn('Donation modal already exists!', existingModal);
    return existingModal;

  }

  if (existingPanel) {
    document.body.removeChild(existingPanel)
  }
  // const fontLink=document.createElement("link")
  // fontLink.rel="stylesheet"
  // fontLink.href="https://fonts.googleapis.com/css?family=Open+Sans"
  // document.querySelectorAll("head")[0].appendChild(fontLink)
  // Header Title Span
  const spanDonationText = document.createElement('span');
  spanDonationText.className = 'translate';
  spanDonationText.id = 'spanTitleModal';
  spanDonationText.innerHTML = i18next.t('donate') + " <span id='ammountToDonate'></span> <span id='spanTube'></span><span id='spanTube'></span> " + i18next.t('to') + ' '; // FIXME

  // Header Div
  const divSectionSeparator = document.createElement('div');
  divSectionSeparator.className = 'sectionSeparator';
  divSectionSeparator.appendChild(spanDonationText);

  // Wallet Addr Holder
  const spanTitleWalletAddress = document.createElement('span');
  spanTitleWalletAddress.id = 'titleWallet';
  spanTitleWalletAddress.className = 'translate';
  spanTitleWalletAddress.innerHTML = i18next.t('walletAddress');
  // spanTitleWalletAddress.setAttribute('data-i18n', 'walletAddress');

  const breakLineWallet = document.createElement('br');

  const spanWalletAddress = document.createElement('span');
  spanWalletAddress.id = 'spanWalletAddress';
  spanWalletAddress.className = 'breakAll';

  const pWallet = document.createElement('p');
  pWallet.className = 'font13 pDonateToPublisher breakWord noMarginTop';
  pWallet.appendChild(spanTitleWalletAddress);
  pWallet.appendChild(breakLineWallet);
  pWallet.appendChild(spanWalletAddress);

  const buttonDonate = document.createElement('button');
  const donationTitle = document.createElement('span')
  donationTitle.classList.add("donationTitle")
  const donationRate = document.createElement('span')
  donationRate.classList.add("donationRate")
  donationRate.innerHTML = fillButtonDonate(1)
  donationTitle.innerHTML = i18next.t('donate');
  buttonDonate.id = 'donate';
  const donationSpinner = document.createElement("img")
  donationSpinner.src = "https://bittubeapp.com/assets/images/spinnerModal2.png"
  donationSpinner.classList.add("donationSpinner")

  buttonDonate.className = 'customButtonStyle customButtonStyleSelected buttonInput translate';
  buttonDonate.appendChild(donationTitle)
  buttonDonate.appendChild(donationRate)
  buttonDonate.appendChild(donationSpinner)
  buttonDonate.onclick = (event) => {
    if (!eventIsTrusted(event)) return;
    buttonDonateClick(platform)
  }

  function fillButtonDonate(amount) {

    chrome.runtime.sendMessage({
      message: 'getFavCurrency',
      value: amount,
    }, function (response) {
      if (checkBrowser() == 'chrome') {
        fetchTUBEValue(response.currency, amount) // This will fetch value
      }

    });

  }

  const inputDonation = document.createElement('input');
  inputDonation.className = 'inputDonation';
  inputDonation.id = 'inputDonation';
  inputDonation.value = '1';
  inputDonation.addEventListener('keyup', debounce(function (event) {
    if (!eventIsTrusted(event)) return;
    event.stopPropagation(); // Prevent twitter and other hotkeys for '.' key
    fillButtonDonate(document.querySelector(".inputDonation").value);
  }));
  const minusAmount = document.createElement("img")
  minusAmount.id = "minusAmount"
  minusAmount.src = "https://bittubeapp.com/assets/images/minusModal.png"
  minusAmount.classList.add("iconInput")
  minusAmount.addEventListener('click', function (e) {
    if (!eventIsTrusted(e)) return;
    e.preventDefault();
    e.stopPropagation();
    const value = new Number(document.getElementById('inputDonation').value) - 1;
    if (value >= 0) {
      document.getElementById('inputDonation').value = value;
      fillButtonDonate(value);
    }
  })
  const plusAmount = document.createElement("img")
  plusAmount.id = "plusAmount"
  plusAmount.src = "https://bittubeapp.com/assets/images/plusModal.png"
  plusAmount.classList.add("iconInput")
  plusAmount.addEventListener('click', function (e) {
    if (!eventIsTrusted(e)) return;
    e.preventDefault();
    e.stopPropagation();
    const value = new Number(document.getElementById('inputDonation').value) + 1;
    document.getElementById('inputDonation').value = value;
    fillButtonDonate(value);
  })

  // Panel
  const panelOpen = () => {
    document.body.appendChild(panelContainer)
    createAccPayment("crypto")
    createAccPayment("credit")
  }
  const panelClose = (event) => {
    if (!eventIsTrusted(event)) return;
    document.body.removeChild(panelContainer)
  }
  const createPopupInModal = (dataObj) => {
    const popupContainer = document.createElement("div")
    const popupCard = document.createElement("div")
    const popupHeader = document.createElement("div")

    const popupIntro = document.createElement("div")
    const popupRefWarning = document.createElement("div")
    const popupBottomText = document.createElement("div")
    const popupHeaderSpan = document.createElement("span")
    const popupClose = document.createElement("button")

    const allData = document.createElement("p")
    const createField = (label, data, size) => {
      const container = document.createElement("div")
      const labelC = document.createElement("div")
      const dataC = document.createElement("div")
      container.classList.add("dataContainer")
      labelC.classList.add("popupLabel")
      dataC.classList.add("dataLabel")
      container.classList.add(size)
      labelC.innerHTML = label
      dataC.innerHTML = data
      container.appendChild(labelC)
      container.appendChild(dataC)
      allData.appendChild(container)
    }
    createField("Amount", dataObj.tubeamount + '/' + dataObj.amount + ' ' + dataObj.currency, 'midIn')
    createField("Reference Id", dataObj.referenceId, 'midIn')
    allData.appendChild(popupRefWarning)
    switch (dataObj.currency) {
      case 'USD':
        createField("Beneficiary", 'TransferWise FBO BitTubeInt OÜ', 'fullIn');
        createField("Bank Name", 'TransferWise', 'midIn');
        createField("BIC/SWIFT", 'CMFGUS33', 'midIn');
        createField("Account Number", '8310274544', 'midIn');
        createField("Transfer Number", '026073008', 'midIn');
        createField("Routing Number (ACH or ABA)", '026073150', 'fullIn');
        break;
      case 'EUR':
        createField("Beneficiary", 'BitTubeInt OÜ', 'fullIn');
        createField("Bank Name", 'Handelsbank', 'midIn');
        createField("BIC/SWIFT", 'DEKTDE7GXXX', 'midIn');
        createField("IBAN", 'DE60 7001 1110 6055 7355 63', 'fullIn');
        break
      case 'GBP':
        createField("Beneficiary", 'BitTubeInt OÜ', 'fullIn');
        createField("Bank Name", 'TransferWise', 'midIn');
        createField("UK Sort Code", '23-14-70', 'midIn');
        createField("Account Number", '71808293', 'fullIn');
        break;
      case 'AUD':
        createField("Beneficiary", 'BitTubeInt OÜ', 'fullIn');
        createField("Bank Name", 'TransferWise', 'midIn');
        createField("BSB-Code", '082-182', 'midIn');
        createField("Account Number", '494559747', 'fullIn');
        break;
      case 'NZD':
        createField("Beneficiary", 'BitTubeInt OÜ', 'fullIn');
        createField("Bank Name", 'TransferWise', 'midIn');
        createField("Account Number", '02-1291-0249416-000', 'midIn');
        break;
    }

    popupContainer.classList.add("popupContainer")
    popupCard.classList.add("popupCard")
    popupHeader.classList.add("popupHeader")
    popupIntro.classList.add("popupIntro")
    popupHeaderSpan.classList.add("popupHeaderSpan")
    popupClose.classList.add("popupClose")
    popupIntro.classList.add("popupIntro")
    popupRefWarning.classList.add("popupRefWarning")
    popupBottomText.classList.add("popupBottomText")
    allData.classList.add("allData")

    popupClose.innerHTML = "Close"
    popupIntro.innerHTML = "To finish the process do a <b> bank transfer  in the next 72h </b> using the data bellow:"
    popupRefWarning.innerHTML = "Don't forget to include the Reference ID</span> to link yout payment to your account"
    popupBottomText.innerHTML = "Important! Bank transfer takes approximatively <b>3 to 7 days to process</b> although <b>sometimes it may be longer</b> "

    popupHeaderSpan.innerHTML = "Order Created"
    popupClose.addEventListener("click", (event) => {
      if (!eventIsTrusted(event)) return;
      panelSide.removeChild(popupContainer)
    })

    const termsDiv = document.createElement('a');
    termsDiv.innerHTML = 'Terms';
    termsDiv.setAttribute('href', 'https://kb.bittubeapp.com/article/118-how-to-purchase-tube-via-wire-transfer');
    termsDiv.setAttribute('target', '_blank');
    termsDiv.classList.add('termsDiv');
    popupContainer.appendChild(popupCard)
    popupCard.appendChild(popupHeader)
    popupCard.appendChild(popupIntro)
    popupCard.appendChild(allData)
    popupCard.appendChild(popupBottomText)
    popupCard.appendChild(popupClose);
    popupCard.appendChild(termsDiv);
    popupHeader.appendChild(popupHeaderSpan)
    panelSide.appendChild(popupContainer)
  }
  const createPopupError = (content) => {
    const popupContainer = document.createElement("div")
    const popupCard = document.createElement("div")
    const popupHeader = document.createElement("div")
    const popupHeaderSpan = document.createElement("div")
    const popupMessage = document.createElement("div")
    const popupClose = document.createElement("button")

    popupContainer.classList.add("popupContainer")
    popupCard.classList.add("popupCard2")
    popupHeader.classList.add("popupHeader")
    popupHeaderSpan.classList.add("popupHeaderSpan")
    popupClose.classList.add("popupClose")
    popupMessage.classList.add("popupMessage")

    popupHeaderSpan.innerHTML = "Warning"
    popupMessage.innerHTML = content
    popupClose.innerHTML = "Close"
    popupClose.addEventListener("click", (event) => {
      if (!eventIsTrusted(event)) return;
      panelSide.removeChild(popupContainer)
    })
    popupContainer.appendChild(popupCard)
    popupCard.appendChild(popupHeader)
    popupHeader.appendChild(popupHeaderSpan)
    popupCard.appendChild(popupMessage)
    popupCard.appendChild(popupClose)
    panelSide.appendChild(popupContainer)
  }
  const closePanel = document.createElement('span');
  closePanel.id = 'closeBitTubePanel'; // closeBitTubeModal
  closePanel.innerText = 'x';
  closePanel.className = 'BitTube-close BitTube-closePanel'; // close
  closePanel.onclick = panelClose;

  const panelHeader = document.createElement("div")
  panelHeader.classList.add("BitTube-panelHeader")
  const panelHeaderImg = document.createElement("img")
  panelHeaderImg.classList.add("BitTube-panelHeaderImg")
  panelHeaderImg.src = "https://bittubeapp.com/assets/images/earn-tube.svg"
  const panelContainer = document.createElement("div")
  panelContainer.classList.add("BitTube-panelContainer")

  const panelSide = document.createElement("div")
  panelSide.classList.add("BitTube-panelSlide")

  const panelHeaderTitle = document.createElement("div")
  const backArrow = document.createElement("img");
  backArrow.classList.add("BitTube-backArrow");
  backArrow.src = "https://bittubeapp.com/assets/images/arrow-left.svg";
  backArrow.id = "BitTube-backArrow";
  backArrow.onclick = function (event) {
    if (!eventIsTrusted(event)) return;
    backArrow.style.display = 'none';
    document.querySelector(".BitTube-panelSlide").removeChild(document.querySelector(".headIntro"))
    document.querySelector(".BitTube-panelSlide").appendChild(buttonsContainer)
    document.querySelector(".BitTube-panelSlide").removeChild(backContainer)
  }

  const spanTitleBuy = document.createElement('span');
  spanTitleBuy.innerHTML = i18next.t('html.buy');
  panelHeaderTitle.classList.add("BitTube-panelHeaderTitle");
  panelHeaderTitle.appendChild(backArrow);
  panelHeaderTitle.appendChild(spanTitleBuy);

  const panelIntro = document.createElement("div")
  panelIntro.innerHTML = i18next.t('selectPaymentMethod') //"Select a payment method."
  panelIntro.classList.add("BitTube-panelIntro")

  let userAuth = true
  let disabledMethods = []
  let disabledMessage = ''
  const getBuyTubeStatus = () => {
    chrome.runtime.sendMessage({
      message: 'getBuyTubeStatus',

    }, function (response) {
      if (checkBrowser() == 'chrome') {
        if ( response !== undefined ){

          disabledMethods = response.disabled;
          disabledMessage = response.message;
          if (response.error == "token") {
            userAuth = false
          }
        }
      }
    });
  }
  getBuyTubeStatus();

  // Button payment functions
  function isUserLogged(action) {
    chrome.runtime.sendMessage({
      message: 'isUserLogged',
    }, function (response) {
      if (checkBrowser() == 'chrome') {
        if (response.message == true) {
          switch (action) {
            case 'wire':
              triggerWireButton();
              break;
            case 'crypto':
              triggerCryptoButton();
              break;
            case 'cc':
              triggerCreditButton();
              break;
          }
        } else {
          createPopupError("To use this service please login in the extension.")
        }
      }
    });
  }

  const triggerWireButton = () => {
    if (!disabledMethods.includes("wire")) {
      clearCurrentPayment();
      const headIntro = document.createElement("span")
      const headIntroSpan = document.createElement("span")
      const wireIntro = document.createElement("span")
      const wireIntroStep1 = document.createElement("p")
      const wireIntroStep2 = document.createElement("p")

      headIntro.classList.add("headIntro")
      wireIntro.classList.add("wireIntro")

      headIntroSpan.innerHTML = i18next.t('html.buy') + ' ' + i18next.t('in2steps') //"Buy TUBEs in 2 steps :"
      wireIntroStep1.innerHTML = i18next.t('step1buytubes'); //"1. Order the amount you want to buy"
      wireIntroStep2.innerHTML = i18next.t('step2buytubes'); //"2. Make a bank transfer using the provided data after creating the order."

      headIntro.appendChild(headIntroSpan)
      wireIntro.appendChild(wireIntroStep1)
      wireIntro.appendChild(wireIntroStep2)
      headIntro.appendChild(wireIntro)
      panelSide.appendChild(headIntro)
      document.getElementById('BitTube-backArrow').style.display = 'inline-block';
      generateConversionInputs("wire")
    } else {
      createPopupError(disabledMessage)
    }
  }
  const triggerCryptoButton = () => {
    if (!disabledMethods.includes("crypto")) {
      clearCurrentPayment();
      const headIntro = document.createElement("span")
      const headIntroSpan1 = document.createElement("span")
      const headIntroSpan2 = document.createElement("span")
      const headIntroSpan3 = document.createElement("span")

      headIntro.classList.add("headIntro")

      headIntroSpan1.innerHTML = i18next.t('purchaseWithCryptoText1'); //"To purchase TUBEs follow the process. "
      headIntroSpan2.innerHTML = i18next.t('purchaseWithCryptoText2'); // "Pay with Bitcoin, Bitcoin cash, Ethereum and Litecoin. "
      headIntroSpan3.innerHTML = i18next.t('purchaseWithCryptoText3'); // "* Payment details will open in a new tab."

      headIntro.appendChild(headIntroSpan1)
      headIntro.appendChild(headIntroSpan2)
      headIntro.appendChild(headIntroSpan3)

      panelSide.appendChild(headIntro)
      document.getElementById('BitTube-backArrow').style.display = 'inline-block';
      generateConversionInputs("crypto")
    } else {
      createPopupError(disabledMessage)
    }

  }
  const triggerCreditButton = () => {
    if (!disabledMethods.includes("cc")) {
      clearCurrentPayment();
      const headIntro = document.createElement("span")
      const headIntroSpan1 = document.createElement("span")
      const headIntroSpan2 = document.createElement("span")
      const headIntroSpan3 = document.createElement("span")
      headIntro.classList.add("headIntro")
      headIntroSpan1.innerHTML = i18next.t('buyTUBEsWithCC');
      headIntro.appendChild(headIntroSpan1)
      panelSide.appendChild(headIntro)

      document.getElementById('BitTube-backArrow').style.display = 'inline-block';
      generateConversionInputs("credit")
    } else {
      createPopupError(disabledMessage)
    }
  }
  const clearCurrentPayment = () => {
    document.querySelector(".BitTube-panelSlide").removeChild(document.querySelector(".BitTube-buttonsContainer"))
    const headIntro = document.querySelector(".headIntro")
    if (headIntro) {
      document.querySelector(".BitTube-panelSlide").removeChild(headIntro)
    }

    const backContainer = document.createElement("div")
    const backTextModal = document.createElement("div")

    backTextModal.classList.add("backTextModal")
    backContainer.classList.add("backContainer")
    // backTextModal.innerHTML="Select payment method."

    document.querySelector(".BitTube-panelSlide").appendChild(backContainer)

    backContainer.appendChild(backTextModal)

    // backContainer.addEventListener("click",(e) => {
    //   document.querySelector(".BitTube-panelSlide").removeChild(document.querySelector(".headIntro"))
    //   document.querySelector(".BitTube-panelSlide").appendChild(buttonsContainer)
    //   document.querySelector(".BitTube-panelSlide").removeChild(backContainer)
    // })
  }
  // Utility
  const checkMinMaxAmountCreditCard = () => {
    const fiatAmount = new Number(document.querySelector('.wireFiatInputField ').value);
    const objChecks = {
      minAmount: false,
      maxAmount: false
    }
    switch (document.querySelector(".wireFiatSelect").value) {
      case 'EUR':
      case 'USD':
      case 'GBP':
      case 'NZD':
      case 'AUD':
        if (fiatAmount >= 1 && fiatAmount <= 1000) {
          objChecks.minAmount = true;
          objChecks.maxAmount = true;
        } else if (fiatAmount < 1 && fiatAmount <= 1000) {
          objChecks.minAmount = false;
          objChecks.maxAmount = true;
        } else if (fiatAmount >= 1 && fiatAmount > 1000) {
          objChecks.minAmount = true;
          objChecks.maxAmount = false;
        }

        return objChecks;
    }
  }

  const generateConversionInputs = (type) => {
    const headIntro = document.querySelector(".headIntro")
    const generateConversionDom = () => {
      const inputsBuyTube = document.createElement("div")
      const inputWireFiat = document.createElement("div")
      const inputWireTube = document.createElement("div")
      const convertIcon = document.createElement("div")
      const convertIconImg = document.createElement("img")
      //WireFiat

      const wireFiatInput = document.createElement("div")
      const wireFiatBtn = document.createElement("div")
      const wireFiatSelect = document.createElement("select")
      switch (type) {
        case "wire":
        case "credit":
          const basisFiat = ["USD", "EUR", "GBP", "NZD", "AUD"]
          for (let i = 0; i < basisFiat.length; i++) {
            const newOpt = document.createElement("option")
            newOpt.value = basisFiat[i]
            newOpt.innerHTML = basisFiat[i]
            wireFiatSelect.appendChild(newOpt)
          }
          break;
        case "crypto":
          const basisCrypto = ["BTC", "ETH", "BCH", "LTC"]
          for (let i = 0; i < basisCrypto.length; i++) {
            const newOpt = document.createElement("option")
            newOpt.value = basisCrypto[i]
            newOpt.innerHTML = basisCrypto[i]
            wireFiatSelect.appendChild(newOpt)
          }
      }

      const wireFiatInputField = document.createElement("input")
      const wireFiatInputLoader = document.createElement("div")
      //WireTube
      const wireTubeInput = document.createElement("div")
      const wireTubeBtn = document.createElement("div")
      const wireTubeBtnContent = document.createElement("span")
      const wireTubeInputField = document.createElement("input")
      const wireTubeInputLoader = document.createElement("div")
      //ConfirmBtn
      const buttonConfirm = document.createElement("button")
      const spinnerIcon = document.createElement("img")

      //SRC / Text content / Interactions
      spinnerIcon.src = "https://bittubeapp.com/assets/images/spinnerModal.png"
      const spinnerIconBis = spinnerIcon.cloneNode(true)
      convertIconImg.src = "https://bittubeapp.com/assets/images/convertModal.svg"
      switch (type) {
        case "wire":
          buttonConfirm.innerHTML = i18next.t('createOrder'); //"Create order"
          buttonConfirm.id = "createTransferOrder"
          buttonConfirm.setAttribute("disabled", true)
          inputsBuyTube.id = "buyWithWire"
          buttonConfirm.addEventListener("click", (event) => {
            if (!eventIsTrusted(event)) return;
            chrome.runtime.sendMessage({
              message: 'createTransferOrder',
              tubeAmount: document.querySelector(".wireTubeInputField").value,
              amount: document.querySelector(".wireFiatInputField").value,
              currency: document.querySelector(".wireFiatSelect").value,
              purchaseData: localStorage.getItem('purchaseData')
            }, function (response) {
              console.log(response)
              if (checkBrowser() == 'chrome') {
                if (response.message.payment_url == "https://bittubeapp.com/errorPurchase.html") {
                  window.open("https://bittubeapp.com/errorPurchase.html")
                } else if (response.message.message == "success") {
                  createPopupInModal(response.data)
                }
              }
            });
          })
          break;
        case "crypto":
          buttonConfirm.innerHTML = i18next.t('payWithCrypto'); //"Pay with crypto"
          inputsBuyTube.id = "buyWithCrypto"
          buttonConfirm.addEventListener("click", (event) => {
            if (!eventIsTrusted(event)) return;
            chrome.runtime.sendMessage({
              message: 'createCryptoOrder',
              purchaseData: localStorage.getItem('purchaseData')
            }, function (response) {
              if (checkBrowser() == 'chrome') {
                // I used window.open because content scripts can't open chrome.tabs...
                window.open(response.message.payment_url)

              }
            });
          })
          break;
        case "credit":
          buttonConfirm.innerHTML = i18next.t('continue');
          inputsBuyTube.id = "buyWithCredit"

          break;
      }
      const svg = '<svg style="height: 12px; width: 12px; vertical-align: middle; fill: white; margin-left: 2px;" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="125.805px" height="125.805px" viewBox="0 0 125.805 125.805" enable-background="new 0 0 125.805 125.805" xml:space="preserve"> <rect x="26.835" y="44.985" width="72" height="9"/> <rect x="26.835" y="62.985" width="72" height="9"/> <rect x="53.835" y="12.279" width="18" height="113.526"/> <rect x="8.835" y="-0.015" width="108" height="18"/> </svg>';
      wireTubeBtnContent.innerHTML = svg; //"TUBEs"
      wireFiatInputField.addEventListener("keyup", debounce(function (e) {
        if (!eventIsTrusted(e)) return;

        if (((e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105) && e.keyCode != 8 && e.keyCode != 16 && e.keyCode != 190) {

          if (e.keyCode != 13) {
            e.preventDefault();
          }
        } else {
          let inputVal
          if (wireFiatInputField.value == "") {
            inputVal = 0
          } else {
            inputVal = wireFiatInputField.value
          }
          document.querySelector(".wireTubeInputField").value = ""
          document.querySelector(".wireTubeInputField").setAttribute("disabled", true)
          document.getElementById("inputTubeLoader").style.display = "block"
          chrome.runtime.sendMessage({
            message: 'getTubeRate',
            type: inputsBuyTube.id,
            target: 'getTubes',
            value: inputVal,
            currency: wireFiatSelect.value
          }, function (response) {
            if (checkBrowser() == 'chrome') {
              document.getElementById("inputTubeLoader").style.display = "none"
              document.querySelector(".wireTubeInputField").value = response.message
              document.querySelector(".buttonConfirm").removeAttribute("disabled")
              document.querySelector(".wireTubeInputField").removeAttribute("disabled")
              localStorage.setItem("purchaseData", response.token)

            }
          });

        }

      }));
      wireTubeInputField.addEventListener("keyup", debounce(function (e) {
        if (!eventIsTrusted(e)) return;
        if (((e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105) && e.keyCode != 8 && e.keyCode != 16 && e.keyCode != 190) {
          if (e.keyCode != 13) {
            e.preventDefault();
          }
        } else {
          let inputVal
          if (wireTubeInputField.value == "") {
            inputVal = 0
          } else {
            inputVal = wireTubeInputField.value
          }
          document.querySelector(".wireFiatInputField").value = ""
          document.querySelector(".wireFiatInputField").setAttribute("disabled", true)
          document.getElementById("inputFiatLoader").style.display = "block"
          chrome.runtime.sendMessage({
            message: 'getTubeRate',
            type: inputsBuyTube.id,
            target: 'getFiat',
            value: inputVal,
            currency: wireFiatSelect.value,
          }, function (response) {
            if (checkBrowser() == 'chrome') {
              document.getElementById("inputFiatLoader").style.display = "none"
              document.querySelector(".wireFiatInputField").value = response.message
              document.querySelector(".buttonConfirm").removeAttribute("disabled")
              document.querySelector(".wireFiatInputField").removeAttribute("disabled")
              localStorage.setItem("purchaseData", response.token)

            }
          });
        }

      }));

      wireFiatSelect.addEventListener('change', function (e) {
        if (!eventIsTrusted(e)) return;
        document.querySelector('.wireTubeInputField ').value = '';
        localStorage.setItem('currencySelected', this.value);
        if (wireFiatInputField.value != '') {
          inputVal = wireFiatInputField.value;
          document.querySelector(".wireTubeInputField").setAttribute("disabled", true)
          document.getElementById("inputTubeLoader").style.display = "block"
          chrome.runtime.sendMessage({
            message: 'getTubeRate',
            type: inputsBuyTube.id,
            target: 'getTubes',
            value: inputVal,
            currency: wireFiatSelect.value
          }, function (response) {
            if (checkBrowser() == 'chrome') {
              document.getElementById("inputTubeLoader").style.display = "none"
              document.querySelector(".wireTubeInputField").value = response.message
              document.querySelector(".buttonConfirm").removeAttribute("disabled")
              localStorage.setItem("purchaseData", response.token)

            }
          });
        }
      })

      //Classlist
      inputsBuyTube.classList.add("inputsBuyTube")
      inputWireFiat.classList.add("inputWireFiat")
      inputWireTube.classList.add("inputWireTube")
      convertIcon.classList.add("convertIcon")
      convertIconImg.classList.add("convertIconImg")
      wireFiatInput.classList.add("wireFiatInput")
      wireFiatBtn.classList.add("wireFiatBtn")
      wireFiatSelect.classList.add("wireFiatSelect")
      wireFiatBtn.classList.add("wireBtn")
      wireFiatInputField.classList.add("wireFiatInputField")
      wireFiatInputField.classList.add("wireInput")
      wireFiatInputLoader.classList.add("inputLoader")
      wireFiatInputLoader.id = "inputFiatLoader"
      wireTubeInput.classList.add("wireTubeInput")
      wireTubeBtn.classList.add("wireTubeBtn")
      wireTubeBtn.classList.add("wireBtn")
      wireTubeBtnContent.classList.add("wireTubeBtnContent")
      wireTubeInputField.classList.add("wireTubeInputField")
      wireTubeInputField.classList.add("wireInput")
      wireTubeInputLoader.classList.add("inputLoader")
      wireTubeInputLoader.id = "inputTubeLoader"
      buttonConfirm.classList.add("buttonConfirm")
      //Append wireTube
      wireTubeInput.appendChild(wireTubeInputField)
      wireTubeInputLoader.appendChild(spinnerIcon)
      wireTubeInput.appendChild(wireTubeInputLoader)
      inputWireTube.appendChild(wireTubeInput)
      wireTubeBtn.appendChild(wireTubeBtnContent)
      inputWireTube.appendChild(wireTubeBtn)
      //Append wireFiat
      wireFiatInput.appendChild(wireFiatInputField)
      wireFiatInputLoader.appendChild(spinnerIconBis)
      wireFiatInput.appendChild(wireFiatInputLoader)
      inputWireFiat.appendChild(wireFiatInput)
      wireFiatBtn.appendChild(wireFiatSelect)
      inputWireFiat.appendChild(wireFiatBtn)
      //Append convertIcon
      convertIcon.appendChild(convertIconImg)
      //Final Append
      inputsBuyTube.appendChild(inputWireFiat)
      inputsBuyTube.appendChild(convertIcon)
      inputsBuyTube.appendChild(inputWireTube)
      headIntro.appendChild(inputsBuyTube)
      if (type != "credit") {
        inputsBuyTube.appendChild(buttonConfirm)
      }

    }
    const generateCreditForm = () => {
      const formCreditContainer = document.createElement("div")
      const firstNameInput = document.createElement("input")
      const lastNameInput = document.createElement("input")
      const cardNumberInput = document.createElement("input")

      const expirationMonthInput = document.createElement("input")
      const expirationYearInput = document.createElement("input")
      const cardTypeInput = document.createElement("select")
      const cardProviders = ["Amex", "Visa", "Mastercard", "Discover"]
      for (let i = 0; i < cardProviders.length; i++) {
        const newOpt = document.createElement("option")
        newOpt.value = cardProviders[i]
        newOpt.innerHTML = cardProviders[i]
        cardTypeInput.appendChild(newOpt)
      }
      const cvInput = document.createElement("input")
      cvInput.setAttribute('type', 'password');
      const buttonConfirm = document.createElement("button")

      buttonConfirm.addEventListener("click", (e) => {
        if (!eventIsTrusted(e)) return;
        e.preventDefault();
        e.stopPropagation();
        if (firstNameInput.value != '' && lastNameInput.value != '' && cardNumberInput.value != '' && expirationMonthInput.value != '' && expirationYearInput.value != '' && cvInput.value != '') {
          if (checkMinMaxAmountCreditCard().minAmount && checkMinMaxAmountCreditCard().maxAmount) {
            if (expirationYearInput.value.length < 2 && expirationYearInput.value.length < 2) {
              createPopupError("Incorrecy format on expirity year !")
            } else {
              document.querySelector('.formCreditContainer').style.display = "none"
              document.querySelector('.formAddressContainer').style.display = "block"
              document.querySelector(".formAddressContainer").style.animation = "listPop 0.7s ease";
            }

          } else {
            if (!checkMinMaxAmountCreditCard().minAmount) {
              createPopupError("The minimun amount is 1 " + localStorage.getItem('currencySelected'))
            }
            if (!checkMinMaxAmountCreditCard().maxAmount) {
              createPopupError("The maximum amount is 1000 " + localStorage.getItem('currencySelected'))
            }
          }
        } else {
          createPopupError("Please fill all inputs !")

        }

      })

      firstNameInput.placeholder = i18next.t('firstName');
      lastNameInput.placeholder = i18next.t('lastName');
      cardNumberInput.placeholder = i18next.t('cardNumber');
      expirationMonthInput.placeholder = i18next.t('expirtyMonth');
      expirationYearInput.placeholder = i18next.t('expirityYear');
      cvInput.placeholder = i18next.t('cvv');
      buttonConfirm.innerHTML = i18next.t('continue');
      formCreditContainer.className = "formCreditContainer"
      firstNameInput.className = "BitTube-creditInput firstNameInput BitTube-halfInput"
      lastNameInput.className = "BitTube-creditInput lastNameInput BitTube-halfInput BitTubeMarginLeft5"
      cardNumberInput.className = "BitTube-creditInput cardNumberInput"
      expirationMonthInput.className = "BitTube-creditInput expirationMonthInput BitTube-halfInput"
      expirationYearInput.className = "BitTube-creditInput expirationYearInput BitTube-halfInput BitTubeMarginLeft5"
      // cardTypeInput.className = "BitTube-creditInput cardTypeInput BitTube-halfInput"
      cvInput.className = "BitTube-creditInput cvInput BitTube-halfInput BitTubeMarginLeft5"
      buttonConfirm.classList.add("buttonConfirm")

      formCreditContainer.appendChild(firstNameInput)
      formCreditContainer.appendChild(lastNameInput)
      formCreditContainer.appendChild(cardNumberInput)
      formCreditContainer.appendChild(expirationMonthInput)
      formCreditContainer.appendChild(expirationYearInput)
      // formCreditContainer.appendChild(cardTypeInput)
      formCreditContainer.appendChild(cvInput)
      formCreditContainer.appendChild(buttonConfirm)
      headIntro.appendChild(formCreditContainer)

      // Address
      const formAddressContainer = document.createElement("div")
      const formAddressIntro = document.createElement("div")
      const formAddressInput = document.createElement("input")
      const formAddressCountry = document.createElement("input")
      // const formAddressState = document.createElement("input")
      const formAddressCity = document.createElement("input")
      const formAddressZip = document.createElement("input")
      const buttonConfirm2 = document.createElement("button")

      formAddressContainer.className = "formAddressContainer"
      formAddressInput.className = "formAddressInput BitTube-creditInput"
      formAddressCountry.className = "formAddressCountry BitTube-creditInput BitTube-halfInput"
      // formAddressState.className = "formAddressState BitTube-creditInput BitTube-halfInput BitTubeMarginLeft5"
      formAddressCity.className = "formAddressCity BitTube-creditInput BitTube-halfInput"
      formAddressZip.className = "formAddressZip BitTube-creditInput BitTube-halfInput BitTubeMarginLeft5"
      buttonConfirm2.classList.add("buttonConfirm")

      formAddressIntro.innerHTML = "To complete your order please fill out the following data"
      buttonConfirm2.id = "payWithCC"
      buttonConfirm2.innerHTML = i18next.t('buyWithCC');
      buttonConfirm2.addEventListener("click", (e) => {
        if (!eventIsTrusted(e)) return;
        e.preventDefault();
        e.stopPropagation();
        const ccInfo = {
          first_name: document.querySelector(".firstNameInput").value,
          last_name: document.querySelector(".lastNameInput").value,
          card_no: document.querySelector(".cardNumberInput").value,
          ccExpiryMonth: document.querySelector(".expirationMonthInput").value,
          ccExpiryYear: document.querySelector(".expirationYearInput").value,
          // card_type: document.querySelector(".cardTypeInput").value,
          cvvNumber: document.querySelector(".cvInput").value,
          address: document.querySelector(".formAddressInput").value,
          country: document.querySelector(".formAddressCountry").value,
          city: document.querySelector(".formAddressCity").value,
          // state: document.querySelector(".formAddressState").value,
          zip: document.querySelector(".formAddressZip").value,

        }
        if (formAddressInput.value != "" && formAddressCountry.value != "" && formAddressCity.value != "" &&  formAddressZip.value != "") {
          chrome.runtime.sendMessage({
            message: 'buyWithCreditCard',
            data: ccInfo,
            purchaseData: localStorage.getItem('purchaseData')
          }, function (response) {
            if (checkBrowser() == 'chrome') {
              console.log(response)
              window.open(response.message.payment_url)
            }
          });
        }
      })
      formAddressInput.placeholder = "Address of the card holder"
      formAddressCountry.placeholder = "Country"
      // formAddressState.placeholder = "State"
      formAddressCity.placeholder = "City"
      formAddressZip.placeholder = "Zip"

      formAddressContainer.appendChild(formAddressIntro)
      formAddressContainer.appendChild(formAddressInput)
      formAddressContainer.appendChild(formAddressCountry)
      // formAddressContainer.appendChild(formAddressState)
      formAddressContainer.appendChild(formAddressCity)
      formAddressContainer.appendChild(formAddressZip)
      formAddressContainer.appendChild(buttonConfirm2)
      headIntro.appendChild(formAddressContainer)

    }

    generateConversionDom()
    if (type == "credit") {
      generateCreditForm()
    }
  }

  // Payment buttons
  const cryptoAcc = ["bitcoin", "bitcoin-cash", "ethereum", "litecoin"]
  const creditAcc = ["american-express", "visa", "mastercard", "discover"]
  const createAccPayment = (target) => {
    if (!document.querySelector(".BitTube-buttonsContainer .acc" + target)) {
      const accContainer = document.createElement("div")
      const accCaption = document.createElement("div")
      const accGroup = document.createElement("div")
      accContainer.classList.add("accContainer")
      accContainer.classList.add("acc" + target)
      accCaption.classList.add("accCaption")
      accGroup.classList.add("accGroup")

      accCaption.innerHTML = i18next.t('acceptedImages') //"Accepted :"
      switch (target) {
        case 'crypto':
          cryptoAcc.forEach(element => {
            const accElem = document.createElement("div")
            const accImg = document.createElement("img")
            accElem.classList.add("accElem")
            accImg.classList.add("accImg")
            accImg.src = 'https://bittubeapp.com/assets/images/' + 'BT__' + element + '.svg'
            accElem.appendChild(accImg)
            accGroup.appendChild(accElem)
          });
          break;
        case 'credit':
          creditAcc.forEach(element => {
            const accElem = document.createElement("div")
            const accImg = document.createElement("img")
            accElem.classList.add("accElem")
            accImg.classList.add("accImg")
            accImg.src = 'https://bittubeapp.com/assets/images/' + 'BT__' + element + '.svg'
            accElem.appendChild(accImg)
            accGroup.appendChild(accElem)
          });
          break;
      }
      accContainer.appendChild(accCaption)
      accContainer.appendChild(accGroup)
      document.querySelector("#" + target + "BuyBtn").parentNode.insertBefore(accContainer, document.querySelector("#" + target + "BuyBtn").nextSibling);
    }

  }

  const buttonsContainer = document.createElement("div")
  buttonsContainer.classList.add("BitTube-buttonsContainer")

  const wireBuyBtn = document.createElement("button")
  wireBuyBtn.innerHTML = '<img src="https://bittubeapp.com/assets/images/BT_wire-transfer.svg" class="BitTube-iconButton"> <p class="BitTube-textButton">' + i18next.t('wireTransferTitle') + '</p>';

  wireBuyBtn.classList.add("BitTube-buyBtn")
  wireBuyBtn.id = "wireBuyBtn"
  wireBuyBtn.addEventListener("click", (event) => {
    if (!eventIsTrusted(event)) return;
    isUserLogged('wire')
  })

  const cryptoBuyBtn = document.createElement("button")
  cryptoBuyBtn.innerHTML = '<img src="https://bittubeapp.com/assets/images/BT_bitcoin.svg" class="BitTube-iconButton"> <p class="BitTube-textButton">' + i18next.t('cryptoTab') + '</p>';
  cryptoBuyBtn.classList.add("BitTube-buyBtn")
  cryptoBuyBtn.id = "cryptoBuyBtn"
  cryptoBuyBtn.addEventListener("click", (event) => {
    if (!eventIsTrusted(event)) return;
    isUserLogged('crypto')
  })

  const creditBuyBtn = document.createElement("button")
  creditBuyBtn.innerHTML = '<img src="https://bittubeapp.com/assets/images/BT_credit-card.svg" class="BitTube-iconButton"> <p class="BitTube-textButton">' + i18next.t('creditCard') + '</p>';
  creditBuyBtn.classList.add("BitTube-buyBtn")
  creditBuyBtn.id = "creditBuyBtn"
  creditBuyBtn.addEventListener("click", (event) => {
    if (!eventIsTrusted(event)) return;
    isUserLogged('cc')
  })

  panelContainer.appendChild(panelSide)
  //PanelSide
  panelSide.appendChild(panelHeader)

  const panelFooter = document.createElement("div")
  panelFooter.classList.add("BitTube-panelFooter")
  panelFooter.innerHTML = "Powered by BitTube"
  panelSide.appendChild(panelFooter)
  // Panel buy btn
  panelSide.appendChild(buttonsContainer)
  buttonsContainer.appendChild(panelIntro)
  buttonsContainer.appendChild(wireBuyBtn)
  buttonsContainer.appendChild(cryptoBuyBtn)

  buttonsContainer.appendChild(creditBuyBtn)

  panelHeader.appendChild(closePanel)
  panelHeader.appendChild(panelHeaderImg)
  panelHeader.appendChild(panelHeaderTitle)

  const panelTrigger = document.createElement("div")
  panelTrigger.classList.add("panelTrigger")
  // panelTrigger.innerHTML = "Buy TUBE"
  panelTrigger.innerHTML = i18next.t('html.buy');

  panelTrigger.addEventListener("click", (event) => {
    if (!eventIsTrusted(event)) return;
    panelOpen()
  })

  const spanWrap = document.createElement('span');
  spanWrap.className = 'spanWrap';
  spanWrap.appendChild(inputDonation);
  spanWrap.appendChild(plusAmount)
  spanWrap.appendChild(minusAmount)

  const labelInput = document.createElement('label');
  labelInput.className = 'labelInput';
  labelInput.id = 'labelInput';
  // labelInput.appendChild(spanInput);
  labelInput.appendChild(spanWrap);
  labelInput.appendChild(buttonDonate);

  // Custom Donation Amount Form
  const divCustomFormGroup = document.createElement('div');
  divCustomFormGroup.className = 'customFormGroup';
  divCustomFormGroup.appendChild(labelInput);
  divCustomFormGroup.appendChild(panelTrigger);

  const divPadding10 = document.createElement('div');
  // divPadding10.className = 'padding10';

  divPadding10.appendChild(divCustomFormGroup);

  const divDonateSection = document.createElement('div');
  divDonateSection.className = 'donateSection';
  divDonateSection.id = 'donationSection';
  // divDonateSection.appendChild(divDonateSection); // ??? Where did I get this from?
  divDonateSection.appendChild(divPadding10);

  // Amount Holder
  const breakLineAmount = document.createElement('br');

  const feesTitle = document.createElement('span');
  feesTitle.className = 'translate';
  feesTitle.innerHTML = i18next.t('amount');
  // feesTitle.setAttribute('data-i18n', 'amount');

  const spanFees = document.createElement('span');
  spanFees.id = 'spanFees';
  spanFees.className = 'translate';
  spanFees.innerHTML = i18next.t('calculating');
  // spanFees.setAttribute('data-i18n', 'calculating');

  const pAmountPlusFees = document.createElement('p');
  pAmountPlusFees.className = 'font13 pDonateToPublisher breakWord noMarginTop';
  pAmountPlusFees.appendChild(feesTitle);
  pAmountPlusFees.appendChild(breakLineAmount);
  pAmountPlusFees.appendChild(spanFees);

  // Payment ID Holder
  const spanTitlePaymentId = document.createElement('span');
  spanTitlePaymentId.innerText = i18next.t('paymentID');
  // spanTitlePaymentId.setAttribute('data-i18n', 'paymentID');

  const breakLine = document.createElement('br');

  const spanPaymentId = document.createElement('span');
  spanPaymentId.id = 'spanPaymentId';

  const pPaymentId = document.createElement('p');
  pPaymentId.className = 'font13 pDonateToPublisher breakWord noMarginTop translate';
  pPaymentId.appendChild(spanTitlePaymentId);
  pPaymentId.appendChild(breakLine);
  pPaymentId.appendChild(spanPaymentId);

  // Donation Result Holder
  const pTitleResult = document.createElement('p');
  pTitleResult.id = 'pTitleResult';
  pTitleResult.align = 'center';
  pTitleResult.className = 'translate';
  pTitleResult.style = 'font-size: 12px; margin-top: 0px; margin-bottom: 10px;';

  const divContent = document.createElement('div');
  divContent.id = 'contentResult';
  divContent.align = 'center';

  const labelResult = document.createElement('label');
  labelResult.className = 'labelResult translate';
  labelResult.innerText = i18next.t('transactionInfo');
  // labelResult.setAttribute('data-i18n', 'transactionInfo');

  const divResult = document.createElement('div');
  divResult.className = 'divResult';
  divResult.appendChild(labelResult);
  divResult.appendChild(divContent);

  const divResultDonation = document.createElement('div');
  divResultDonation.id = 'divResultDonation';
  divResultDonation.style.display = 'none';
  divResultDonation.className = 'padding10';
  divResultDonation.appendChild(pTitleResult);
  divResultDonation.appendChild(divResult);

  const needsLoginButton = document.createElement('button');
  needsLoginButton.className = 'confirmCancelButton buttonGreen marginRight10';
  needsLoginButton.innerHTML = 'OK';
  needsLoginButton.style.width = '23%';
  needsLoginButton.style.margin = '10px auto';
  needsLoginButton.onclick = closeDonationModal;

  const needsLogin10 = document.createElement('div');
  needsLogin10.className = 'padding10';
  needsLogin10.innerText = i18next.t('needsExtensionLogin');
  needsLogin10.align = 'center';
  needsLogin10.style.display = 'grid';
  needsLogin10.style.fontSize = '13px';
  needsLogin10.appendChild(needsLoginButton);

  const needsLogin = document.createElement('div');
  needsLogin.id = 'needsLogin';
  needsLogin.style.display = 'none';
  needsLogin.appendChild(needsLogin10);

  // CREATE DIV 2FA CODE !
  const spanInput2fa = document.createElement('span');
  spanInput2fa.className = 'FAInput';
  spanInput2fa.innerText = '2FA Code';

  const input2fa = document.createElement('input');
  input2fa.className = 'inputDonation';
  input2fa.id = 'input2fa';
  input2fa.setAttribute('data-platform', platform);
  input2fa.maxLength = '6';
  input2fa.placeholder = i18next.t('type6Digits');
  input2fa.type = 'text';
  input2fa.onkeypress = input2faOnKey;
  input2fa.onfocus = input2faOnFocus;

  const spanWrapInfo2fa = document.createElement('span');
  spanWrapInfo2fa.id = 'spanWrapInfo2fa';
  spanWrapInfo2fa.className = 'spanWrap';
  spanWrapInfo2fa.appendChild(input2fa);

  const label2faInput = document.createElement('label');
  label2faInput.className = 'labelInput';
  label2faInput.appendChild(spanInput2fa);
  label2faInput.appendChild(spanWrapInfo2fa);

  const div2faCustomFormGroup = document.createElement('div');
  div2faCustomFormGroup.className = 'customFormGroup';
  div2faCustomFormGroup.appendChild(label2faInput);

  const buttonVerify2fa = document.createElement('button');
  buttonVerify2fa.className = 'customButtonStyle customButtonStyleSelected';
  buttonVerify2fa.id = 'verify2fa';
  buttonVerify2fa.innerText = i18next.t('verify'); //'Verify';
  buttonVerify2fa.style.width = '90%';
  buttonVerify2fa.onclick = Verify2FA.bind(buttonVerify2fa, platform);

  const div2faPadding = document.createElement('div');
  div2faPadding.className = 'padding10';
  div2faPadding.align = 'center';
  div2faPadding.appendChild(div2faCustomFormGroup);
  div2faPadding.appendChild(buttonVerify2fa);

  const div2faSection = document.createElement('div');
  div2faSection.className = 'donateSection';
  div2faSection.id = 'div2FA';
  div2faSection.style.height = '130px';
  div2faSection.style.display = 'none';
  div2faSection.appendChild(div2faPadding);

  // Confirm donation button
  const buttonConfirmDonation = document.createElement('button');
  buttonConfirmDonation.id = 'buttonConfirm';
  buttonConfirmDonation.className = 'confirmCancelButton buttonGreen marginRight10 translate';
  buttonConfirmDonation.innerHTML = i18next.t('confirm');
  buttonConfirmDonation.setAttribute('data-action', 'sendDonation');
  buttonConfirmDonation.setAttribute('data-platform', platform);
  // buttonConfirmDonation.onclick = buttonConfirmDonationClick.bind(buttonConfirmDonation, platform);
  buttonConfirmDonation.onclick = (event) => {
    if (!eventIsTrusted(event)) return;
    buttonConfirmDonationClick();
  };
  // buttonConfirmDonation.setAttribute('data-i18n', 'confirm');

  // Cancel donation button
  const buttonCancelDonation = document.createElement('button');
  buttonCancelDonation.id = 'buttonCancel';
  buttonCancelDonation.className = 'confirmCancelButton buttonGray translate';
  buttonCancelDonation.innerHTML = i18next.t('cancel');
  buttonCancelDonation.onclick = buttonCancelDonationClick;
  // buttonCancelDonation.setAttribute('data-i18n', 'cancel');

  // Donation confirm/cancel holder div
  const divButtonsConfirmDonation = document.createElement('div');
  divButtonsConfirmDonation.className = 'divButtonsConfirmCancel marginTop20 marginBottom20';
  divButtonsConfirmDonation.align = 'center';
  divButtonsConfirmDonation.appendChild(buttonConfirmDonation);
  divButtonsConfirmDonation.appendChild(buttonCancelDonation);

  // Confirm Donation div
  const divConfirmDonation = document.createElement('div');
  divConfirmDonation.id = 'divConfirmDonation';
  divConfirmDonation.style.display = 'none';
  divConfirmDonation.className = 'padding10';
  divConfirmDonation.align = 'center';
  divConfirmDonation.appendChild(pWallet);
  divConfirmDonation.appendChild(pAmountPlusFees);
  divConfirmDonation.appendChild(pPaymentId);
  divConfirmDonation.appendChild(divButtonsConfirmDonation);

  // Triangle div
  const triangleDiv = document.createElement("div")
  triangleDiv.classList.add("bittube-arrow-down")

  // Main Div
  const bittube = document.createElement('div');
  bittube.id = 'bittube-modal'; // myBittube
  bittube.className = 'bittube'; // bittube

  // Close Button Span
  const close = document.createElement('span');
  close.id = 'closeBitTubeModal'; // closeBitTubeModal
  close.innerText = 'x';
  close.className = 'BitTube-close'; // close
  close.onclick = closeDonationModal;

  // Content Div
  const bittubecontent = document.createElement('div');
  bittubecontent.className = 'bittube-content'; // bittube-content
  bittubecontent.appendChild(close);
  bittubecontent.appendChild(divSectionSeparator);
  bittubecontent.appendChild(divDonateSection);
  bittubecontent.appendChild(divConfirmDonation);
  bittubecontent.appendChild(divResultDonation);
  bittubecontent.appendChild(div2faSection);
  bittubecontent.appendChild(needsLogin);
  bittubecontent.appendChild(triangleDiv)
  bittube.appendChild(bittubecontent);

  // console.log('Translate Timing Test', i18next.t('cancel'), i18next.t('confirm'), i18next.t('verify'));

  // STYLE DONATION IN MODAL

  // FIXME - Give these classnames proper prefixes.
  // CLASSES MAIN DIV
  createCSSRule('.translate', 'font-weight: normal;');
  createCSSRule('@keyframes listPop', 'from {opacity: 0.4;transform: translateY(40%)}to {opacity: 1;transform: translateY(0)}');
  createCSSRule('@keyframes panelPop', 'from {opacity: 0.4;transform: translateX(40%)}to {opacity: 1;transform: translateX(0)}');
  createCSSRule('.divButtonsConfirmCancel', 'display: inline; margin: 0 auto; width: 60%;')
  createCSSRule('.loader', 'position: absolute; width:10px; height: 10px; left: 40px; top: 7px; border: 2px dotted #ffffff;border-radius: 50%;border-top: 2px dotted #ffffff;');

  if (platform == 'twitch') {
    createCSSRule('.bittube', '-moz-appearance:none;font-family:"Open Sans","Arial" !important;animation:listPop 0.4s ease-out; overflow: visible;color: #343434; display: none; position: absolute !important; z-index: 10000; padding-top:0px;left: calc(50% - 125px) !important;border-radius:5px;  top: 45px; margin:0 !important; overflow: visible;box-shadow:0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);');

  } else if (platform == 'twitter') {
    createCSSRule('.bittube', '-moz-appearance:none;font-family:"Open Sans","Arial" !important;animation:listPop 0.4s ease-out; overflow: visible;color: #343434; display: none; position: absolute !important; z-index: 10000; padding-top:0px;left: -145px !important;border-radius:5px; margin:0 !important; overflow: visible;box-shadow:0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);');
  } else {
    createCSSRule('.bittube', '-moz-appearance:none;font-family:"Open Sans","Arial" !important;animation:listPop 0.4s ease-out; overflow: visible;color: #343434; display: none; position: absolute !important; z-index: 10000; padding-top:0px;left: calc(50% - 125px) !important;border-radius:5px; margin:0 !important; overflow: visible;box-shadow:0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);');
  }
  createCSSRule('.bittube-content', 'z-index:1000;white-space: pre-line;background-color: #ffffff; margin: 0 auto; padding: 0px; border:none;width: 250px; position: relative;border-radius:6px');
  if (platform == 'twitch') {
    createCSSRule('.bittube-arrow-down', 'top: -7.5px;bottom: none;position: absolute;width: 0px;left: calc(50% - 7.5px);height: 0px;border-left: 7.5px solid transparent;border-right: 7.5px solid transparent;border-bottom: 7.5px solid rgb(255, 255, 255);border-top: none;');
  } else {
    createCSSRule('.bittube-arrow-down', 'position: absolute;width: 0;bottom:-7.5px;left:calc(50% - 7.5px); height: 0; border-left: 7.5px solid transparent;border-right: 7.5px solid transparent;border-top: 7.5px solid #fff;');
  }

  createCSSRule('.donationTitle', 'font-size: 10px;line-height:10px !important;height: 50%;display: block;vertical-align: top;text-transform:initial;');
  createCSSRule('.donationRate', 'line-height:10px;font-size: 10px;height: 50%;display: block;vertical-align: bottom;text-transform:initial;');
  createCSSRule('.donationSpinner', 'animation:spin infinite 0.7s linear;height:12px;display:none;');
  createCSSRule('.panelTrigger', 'line-height:10px !important;text-align: center;margin-top: 10px;font-size: 12px;display: inline-block;color: rgb(0, 171, 255);text-decoration: underline;cursor: pointer;');
  createCSSRule('#userToDonate', 'vertical-align:top;overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 120px; display: inline-block;');
  createCSSRule('#spanWrapInfo2fa', 'padding-top:0px !important;width:100% !important;margin-bottom: 15px;text-align:left;');
  createCSSRule('#spanWrapInfo2fa > .inputDonation', 'text-align: left; padding: 0px;font-size: 13px !important;font-weight: normal !important;border-top: none !important;border-left: none !important;border-right: none !important;border-radius: 0px !important;width: 100%;border-color: #343434;');
  createCSSRule('.FAInput', 'display:block;text-align:left; font-size: 10px; ');
  createCSSRule('div#divConfirmDonation > p > span', 'font-weight: normal !important; line-height: 1.4 !important;')
  //Plus/Minus/Icon
  if (platform == 'youtube') {
    createCSSRule('.iconInput', 'position: absolute;top: 18px;cursor: pointer;');
  } else if (platform == "twitch") {
    createCSSRule('.iconInput', 'top:20px;position: absolute;cursor: pointer;');
  } else {
    createCSSRule('.iconInput', 'position: absolute;top: 21px;cursor: pointer;');
  }

  createCSSRule('#plusAmount', 'right:6px');
  createCSSRule('#minusAmount', 'left:6px');
  //Panel
  createCSSRule('.BitTube-panelContainer', 'color:#1A1A1A;z-index: 1000000000000000;font-family:"Open Sans","Arial";width:100%;position:fixed;height:100%;background: rgba(0, 0, 0, 0.5);left:0;top:0');
  createCSSRule('.BitTube-panelSlide', 'padding-bottom: 20px;text-align: center;width: 320px;position: fixed;right: 0px;top: 0px;height: 100%;font-size: 14px;overflow: auto;animation: 0.4s ease-out 0s 1 normal none running panelPop;background: white;');
  createCSSRule('.BitTube-panelSlide hr', 'height: 0.5px;border: none;border-bottom: 0.5px #dfdfdf solid;');
  createCSSRule('.BitTube-panelHeader', 'height: 52px;background-color: rgb(52, 52, 52);margin-top: 31px;text-align: center;width: 100%;padding-bottom: 0px;padding-top: 0px;box-sizing: initial !important;border-bottom: 0.5px solid rgb(223, 223, 223);');
  createCSSRule('.BitTube-panelHeaderImg', 'position: absolute;z-index:2;left: calc(50% - 22.5px);top: 17px;min-height: 50px;height: 50px;margin-top: -10px;');
  createCSSRule('.BitTube-closePanel', '    color: white;right: 5px;top: 35px;');
  createCSSRule('.BitTube-closePanel:hover', 'color:rgb(198, 198, 198)');
  createCSSRule('.BitTube-panelHeader::before', 'content: "";display: inline-block;vertical-align: middle;height: 100%;');
  createCSSRule('.BitTube-panelHeaderTitle', 'font-size: 16px !important;display:inline-block;color: white;font-size: 22px;display: inline-block;text-align: center;position: absolute;left: 0;top: 56px;font-size: 14px;width: 100%;color: white;background: #343434;border-bottom:none;');
  createCSSRule('.BitTube-panelHeaderTitle span', 'font-size: 16px !important;');

  createCSSRule('.BitTube-panelIntro', 'width: calc(100% - 30px);font-family: "Open Sans", Arial;color: rgb(135, 135, 135);font-weight: normal;font-size: 14px;display: inline-block;text-align: center;margin-top: 10px;padding: 0px 15px;margin-bottom:20px;');
  createCSSRule('.BitTube-panelFooter', 'text-align: center;position: absolute;width: 100%;bottom: 0px;height: 40px;color: rgb(198, 198, 198);border-top: 1px solid rgb(240, 239, 239);padding: 5px;line-height:35px;');
  //Panel buy Btn
  createCSSRule('.BitTube-buttonsContainer', 'margin-top: 0px;display: inline-block;text-align: center;width: calc(100% - 38px);padding: 0px;');
  createCSSRule('.BitTube-buyBtn', 'position: relative;font-size: 14px;height: 49.33px;text-align: center;margin-bottom: 20px;color: white;display: inline-block;cursor: pointer;width: 272px;background: rgb(0, 171, 255);border-width: initial;border-style: none;border-color: initial;border-image: initial;border-radius: 4px;padding: 0px 10px;');
  createCSSRule('.BitTube-buyBtn:hover', 'opacity:0.8');
  createCSSRule('.BitTube-buyBtn:focus', 'box-shadow:none;border:none;');
  createCSSRule('.BitTube-buyBtn:active', 'box-shadow:none;border:none;');
  createCSSRule('.BitTube-buyBtn:disabled', 'cursor:not-allowed;opacity:0.8;');

  // Panel buy tunnel
  createCSSRule('.headIntro', 'color:#878787;animation:listPop 0.7s ease;font-size:14px;text-align:center;width:272px;text-align: left;margin-top: 20px;padding:0px;display: inline-block;font-family: "Open Sans","Arial", sans-serif;');
  createCSSRule('.headIntro span', 'display:block;text-align:left;');
  createCSSRule('.headIntro span.font13', 'display:inline;text-align:left;');
  //Conversion inputs
  createCSSRule('.inputsBuyTube', 'text-align:center;margin-top:10px;width:100%;display:inline-block;padding:0px;');
  createCSSRule('.inputsBuyTube:disabled', 'cursor: not-allowed;');
  createCSSRule('.inputWireFiat', 'height:32px;display:inline-block;position:relative;width:42%;');
  createCSSRule('.inputWireTube', 'height:32px;display:inline-block;position:relative;width:42%;');
  createCSSRule('.convertIcon', 'text-align:center;display:inline-block;position:relative;width:15%;');
  createCSSRule('.convertIconImg', 'height: 13px; display:inline-block;text-align:center;');
  createCSSRule('.wireFiatInput', 'height:100%;border:none;width:100%;');
  // createCSSRule('.tube-donate :active', 'border:none');
  createCSSRule('.tube-donate :focus', 'outline:none !important');
  createCSSRule('.wireFiatBtn.wireBtn', 'border: 1px solid #00abff; width: 50px;')
  createCSSRule('.wireTubeBtn.wireBtn', 'width: 32px;, line-height: 0; border: 1px solid #00abff;')
  createCSSRule('.wireFiatSelect', '-moz-appearance:none;border:none;height:100%;width:100%;display:inline-block;color:white;background:none;font-size: 11px !important;line-height:15px !important;');
  createCSSRule('.wireFiatSelect option', 'color:black');
  createCSSRule('.wireInput', 'color:black;background: none;border: 1px solid #DFDFDF;border-radius:4px;width:calc(100% - 10px);padding:4px 0;padding-left:10px;height:32px;padding-bottom: 0px; padding-top: 0px;');
  createCSSRule('.wireInput:disabled', '    background: none;border-color: #dfdfdf;');
  createCSSRule('.wireInput:focus', 'color:black;box-shadow:none');
  createCSSRule('.wireTubeInput', 'height:100%;border:none;width:100%;');
  createCSSRule('.wireTubeBtn', '');
  createCSSRule('.wireTubeBtnContent', 'font-size: 11px !important;line-height:15px !important;color:white;padding-top: 8px;text-align: center !important;');
  createCSSRule('@keyframes spin', 'from {transform: rotate(0deg);}to {transform: rotate(360deg);}');
  createCSSRule('.inputLoader', 'animation:spin infinite 0.7s linear;display:none;text-align:center;height:14px;position: absolute;top: 30%;left: 30%;');
  createCSSRule('.inputLoader img', 'height:100%');
  createCSSRule('.buttonConfirm', 'border:none;color:white;display:inline-block;margin-top:30px;width:100%;background:#00abff;height:32px;border-radius:4px;font-size: 14px !important;');
  createCSSRule('.buttonConfirm:focus', 'box-shadow:none;');
  createCSSRule('.buttonConfirm:disabled', 'cursor:not-allowed;color:white !important;');
  createCSSRule('#loaderDonation', 'position:absolute;');
  createCSSRule('.buttonConfirm:hover', 'opacity:0.8');
  createCSSRule('.wireBtn', 'border: 1px solid: #00abff; vertical-align:middle;height:32px;background:#00abff;width:40%;right:-2px;color:white;    position: absolute;top: 0;border-bottom-right-radius: 4px;border-top-right-radius: 4px;');
  // Credit form
  createCSSRule('.formCreditContainer', 'animation:listPop 0.7s ease;text-align:center;margin-top:20px;display:inline-block;width: 100%;padding:0px;');
  createCSSRule('.formAddressContainer', 'text-align:center;margin-top:20px;display:none;width:272px;padding:0px;');
  createCSSRule('.BitTube-creditInput', 'color:black;background: none;width:97%;font-size:14px !important;line-height:15px;display:inline-block;border:none !important;border-bottom:1px solid #787878 !important;height:25px;border-radius:0px;margin:5px 0; margin-left: 0px;');
  createCSSRule('.lastNameInput', 'margin-left: 10px !important;');
  createCSSRule('.cvInput', 'margin-left: 10px !important;');
  createCSSRule('.formAddressZip', 'margin-left: 10px !important;');
  createCSSRule('.formAddressState', 'margin-left: 10px !important;');
  createCSSRule('.expirationYearInput', 'margin-left: 10px !important;');
  createCSSRule('.BitTube-creditInput:focus', 'color:black;border-color:rgb(223, 223, 223);');
  createCSSRule('.cardTypeInput', 'height:32px !important;padding: 4px;');
  createCSSRule('.BitTube-creditInput:focus', 'box-shadow:none;');
  createCSSRule('.BitTube-halfInput', 'margin: 10px 0;width: 47% !important;');
  createCSSRule('.BitTubeMarginLeft5', 'margin-left: 5% !important');
  // Panel accepted methods
  createCSSRule('.accContainer', 'display:block;text-align:left;color:#878787;display: block;width: 272px;margin-top:0;margin-bottom:25px;');
  createCSSRule('.accCaption', 'display:block;font-size:12px;');
  createCSSRule('.accElem', 'display: inline-block;margin-left: 5px;');
  createCSSRule('.accElem:nth-child(1)', 'margin-left: 0px;');
  createCSSRule('.accGroup', 'margin-top:5px;');
  createCSSRule('.accImg', 'height: 45px;margin-top: 5px;border-width: 1px;border-style: solid;border-color: rgb(223, 223, 223);border-image: initial;');
  createCSSRule('.backContainer', 'display:inline-block;text-align:center;margin-top:10px;');
  createCSSRule('.backTextModal', 'display:inline-block;color:rgb(135, 135, 135);');
  createCSSRule('.BitTube-backArrow', 'display:none;cursor:pointer;margin-left:0px;margin-top: -3px;height: 20px;margin-right: 5px;vertical-align: middle;');

  //PopupPanel
  createCSSRule('.popupContainer', 'height:100%;width:420px;background:rgba(0,0,0,0.6);position:fixed;top:0;');
  createCSSRule('.popupCard', 'position:absolute;border-radius:4px;background:white;width: calc(320px - 48px);left:5%;top:8%;height:auto;padding-bottom: 20px;');
  createCSSRule('.popupCard2', 'position:absolute;border-radius:4px;background:white;width: calc(320px - 35px);left:5%;top:8%;height:250px;');
  createCSSRule('.popupHeader', 'border-top-right-radius:4px;border-top-left-radius:4px;background:#343434;width:100%;height:50px;');
  createCSSRule('.popupHeaderSpan', 'color:white;text-align:center;display:inline-block;font-size:14px;font-weight:bold;margin:15px;');
  createCSSRule('.popupMessage', 'margin-top:40px;font-size: 14px;');
  createCSSRule('.popupClose', 'border:none;color:white;display:inline-block;margin-top:10px;width: calc(100% - 45px);background:#00abff;height:32px;border-radius:4px; font-size: 14px !important;');
  createCSSRule('.allData', 'width:calc(100% - 20px);display:inline-block;padding-bottom:5px;');
  createCSSRule('.dataContainer', 'text-align:left;display:inline-block;margin:10px 0;border-bottom:0.5px #343434 solid; padding:3px;');
  createCSSRule('.popupLabel', 'font-weight:bold;display:block;margin-bottom:5px;color:#00ABFF');
  createCSSRule('.dataLabel', 'display:inline-block;');
  createCSSRule('.midIn', 'width:40%;margin:10px 2% !important;');
  createCSSRule('.fullIn', 'width:84%;');
  createCSSRule('.popupIntro', 'font-size: 13px !important; width:84%;display:inline-block;margin-top:10px;text-align:center;');
  createCSSRule('.popupIntro b', 'font-weight:bold;');
  createCSSRule('.popupRefWarning', 'width:84%;display:inline-block;text-align:left;margin-top:5px;');
  createCSSRule('.popupRefWarning span', 'color:#00ABFF');
  createCSSRule('.popupBottomText', 'width:84%;display:inline-block;text-align:left;margin-top:5px;color:#00ABFF');
  createCSSRule('.popupBottomText b', 'font-weight:bold');
  createCSSRule('.BitTube-iconButton', '    height: 35px;position: absolute;left: 15px;top: 7px;');
  createCSSRule('.BitTube-textButton', 'font-size: 14px !important;vertical-align: middle;margin-top: -3px; display: inline-block; margin-bottom: 0px;');

  // CLASSES CLOSE BUTTON
  if (platform == 'twitch') {
    createCSSRule('.BitTube-close', 'position: absolute; font-size: 20px;line-height:20px !important; font-weight: normal;right: 10px;color:#ffffff;z-index: 99;top: 1px;');
  } else if (platform == 'soundcloud') {
    createCSSRule('.BitTube-close', 'position: absolute; font-size: 20px;line-height:20px !important; font-weight: normal;right: 10px;color:#ffffff;z-index: 99;top: 3px;');
  } else {
    createCSSRule('.BitTube-close', 'position: absolute; font-size: 20px;line-height:20px !important; font-weight: normal;right: 10px;color:#ffffff;z-index: 99;top: 5px;');
  }

  createCSSRule('.BitTube-close:hover', 'color:#ffffff;opacity: 0.8; cursor: pointer;');
  createCSSRule('.BitTube-close:focus', 'color:#ffffff;opacity: 0.8; cursor: pointer;');
  createCSSRule('.margin5', 'margin: 5px !important');
  // CLASSES FOR STYLE DONATE FORM
  if (platform == 'twitch' || platform == 'amazon') {
    createCSSRule('.sectionSeparator', "box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3), 0 0 40px rgba(0, 0, 0, 0.1) inset;float: none;margin: 0;overflow: hidden;position: relative;text-align: center;width: 100%;background-color: #343434;color: white;z-index: 0;height: 25px;padding-top: 2px;font-family: 'Open Sans','Arial',sans-serif !important;font-size: 13px !important;border-top-right-radius:6px;border-top-left-radius:6px;");
  } else {
    createCSSRule('.sectionSeparator', "box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3), 0 0 40px rgba(0, 0, 0, 0.1) inset;float: none;margin: 0;overflow: hidden;position: relative;text-align: center;width: 100%;background-color: #343434;color: white;z-index: 0;height: 25px;padding-top: 5px;font-family: 'Open Sans','Arial',sans-serif !important;font-size: 13px !important;border-top-right-radius:6px;border-top-left-radius:6px;");
  }
  createCSSRule('.sectionSeparator span', '');
  createCSSRule('.donateSection', 'height: 85px;background: transparent;position: relative;');
  createCSSRule('.padding10', 'padding: 10px;');
  createCSSRule('.overflowHidden', 'overflow: hidden;');
  createCSSRule('.customButtonStyle', 'display:inherit;right:0 !important;min-width:100px;outline: none !important; text-align: center; height: 28px;font-weight: normal !important;font-size: 13px;padding: 3px;background: transparent;width: 23%;text-decoration: none;margin: 0;outline: 0;overflow: visible;cursor: pointer;color: #333333;border: 1px solid #dfdfdf;border-radius: 4px;font-family:"Open Sans","Arial" !important;');
  createCSSRule('.customButtonStyle:hover', 'outline: none !important; box-shadow: none; border-color: #dfdfdf;');
  createCSSRule('.customButtonStyle:focus', 'outline: none !important; box-shadow: none; border-color: #dfdfdf;');
  createCSSRule('.floatLeft', 'float: left;');
  createCSSRule('.customButtonStyleSelected', 'outline: none !important; background: #00abff !important; color: #ffffff !important; cursor: pointer;border-color: #00abff !important;border-radius: 4px;');
  createCSSRule('.customButtonStyle:hover', 'outline: none !important; box-shadow: none; border-color: #00abff !important;');
  createCSSRule('.customButtonStyle:focus', 'outline: none !important; box-shadow: none; border-color: #00abff !important;');
  createCSSRule('.customFormGroup', 'float: left;width: 100%;text-align:center;padding-top:5px;');
  createCSSRule('.labelInput', 'float: initial;width: 90%;display: block;margin: 0 5%;width: 90%;position: relative;');
  if (platform == 'twitter' || platform == 'amazon') {
    createCSSRule('.spanInput', 'color: #343434; left: 1.083334em;right: auto;position: absolute;top: 6px;z-index: 1;background: #ffffff;padding: 0 .333334em;font-size: .75em;');
  } else if (platform == 'soundcloud' || platform == 'twitch') {
    createCSSRule('.spanInput', 'color: #343434; left: 1.083334em;right: auto;position: absolute;top: 8px;z-index: 1;background: #ffffff;padding: 0 .333334em;font-size: .75em;');
  } else {
    createCSSRule('.spanInput', 'color: #343434; left: 1.083334em;right: auto;position: absolute;top: .833334em;z-index: 1;background: #ffffff;padding: 0 .333334em;font-size: .75em;');
  }

  // if ( platform == 'twitter' ){
  //   createCSSRule('#spanTitleModal', 'position: absolute; width: 100%; left: 0px; top: 8px');
  // }

  createCSSRule('.inputDonation:hover', 'box-shadow: none !important; border-color: #dfdfdf !important; outline: none !important; color:#343434;');
  createCSSRule('.inputDonation:focus', 'box-shadow: none !important; border-color: #dfdfdf !important; outline: none !important; color:#343434;');
  if (platform == 'youtube') {
    createCSSRule('.spanWrap', 'width:calc(100% - 100px);padding-top: 10px;position: relative;display: block;');
  } else if (platform == 'twitch' || platform == 'facebook') {
    createCSSRule('.spanWrap', 'width:calc(100% - 100px);padding-top: 12px;position: relative;display: block;');
  } else {
    createCSSRule('.spanWrap', 'width:calc(100% - 100px);padding-top: 14px;position: relative;display: block;');
  }

  createCSSRule('.inputDonation', 'outline: none !important; background: #ffffff; color: #343434; outline: 0;height: 32px;border-radius: 4px !important;padding:0 25px;border: 1px solid #dfdfdf;box-sizing: border-box;line-height: 20px;font-size: 13px !important;text-align: center;width: 100%;');

  if (platform == 'facebook' || platform == 'twitch' || platform == 'soundcloud') {
    createCSSRule('.buttonInput', 'outline: none !important; text-transform: uppercase;position: absolute !important;top: 12px;right: -7px;width: auto !important;border-top-left-radius: 0px !important;border-bottom-left-radius: 0px !important;z-index: 9 !important;cursor: pointer;min-width: 55px;border-radius: 4px;');
  } else if (platform == 'twitter') {
    createCSSRule('.buttonInput', 'outline: none !important; text-transform: uppercase;position: absolute !important;top: 14px;right: -7px;width: auto !important;border-top-left-radius: 0px !important;border-bottom-left-radius: 0px !important;z-index: 9 !important;cursor: pointer;min-width: 55px;border-radius: 4px;');
  } else if (platform == 'amazon') {
    createCSSRule('.buttonInput', 'outline: none !important; text-transform: uppercase;position: absolute !important;top: 13px;right: 0px;width: auto !important;border-top-left-radius: 0px !important;border-bottom-left-radius: 0px !important;z-index: 9 !important;cursor: pointer;min-width: 55px;border-radius: 4px;');
  } else {
    createCSSRule('.buttonInput', 'outline: none !important; text-transform: uppercase;position: absolute !important;top: 10px;right: -7px;width: auto !important;border-top-left-radius: 0px !important;border-bottom-left-radius: 0px !important;z-index: 9 !important;cursor: pointer;min-width: 55px;border-radius: 4px;');
  }

  createCSSRule('.buttondonate2', 'margin: 0 2.3% !important;');
  createCSSRule('.buttondonate5', 'margin: 0 2.3% 0 0 !important;');
  createCSSRule('.error', 'position: absolute;left: 0px;top: 26px;color: red; font-size: 10px;')

  // CREATE CLASS FOR CONFIRM DONATION SECTION
  createCSSRule('.divConfirmDonation', 'padding-left: 10px;padding-right: 10px;');
  createCSSRule('.textConfirmDonation', 'font-size: 13px;word-break: break-word;margin-bottom: 10px; margin-top: 10px');
  createCSSRule('.noMarginBottom', 'margin-bottom: 0px !important;');
  createCSSRule('.noMarginTop', 'margin-top: 0px !important;');
  createCSSRule('.margin20', 'margin-top: 20px !important; margin-bottom: 20px !important;');
  createCSSRule('.marginRight10', 'margin-right: 10px;');

  createCSSRule('.breakAll', 'word-break: break-all;');

  createCSSRule('.font13', 'font-size: 13px;');
  createCSSRule('.pDonateToPublisher', 'margin-bottom: 10px; margin-top: 10px;');
  createCSSRule('.breakWord', 'word-break: break-all');
  createCSSRule('.marginTop20', 'margin-top: 20px !important;');
  createCSSRule('.padding20', 'padding: 20px !important;');

  createCSSRule('.confirmCancelButton', 'vertical-align: top;position: relative; outline: none !important; font-size: 14px; height: 32px; width: auto; outline: none; cursor: pointer; min-width: 100px');
  createCSSRule('.buttonGray', 'outline: none !important; background: #ffffff; color: #343434; border: 1px solid #dfdfdf; height: 32px; cursor: pointer; border-radius: 4px;');
  createCSSRule('.buttonGreen', 'outline: none !important; min-width: 70px; background: #00baff; color: #ffffff; border: 1px solid #00abff; height: 28px; cursor: pointer; border-radius: 4px;');
  createCSSRule('.labelResult', 'position: absolute; top: -6px; font-size: 11px; padding-left: 5px; padding-right: 5px; background: transparentt; font-weight: bold; left: 0px;');
  createCSSRule('.divResult', 'min-height: 140px;border:none;padding: 10px 0px 10px 0px;font-size: 13px;font-weight: normal;position: relative;line-height: 1.4; margin-top: 20px;')
  createCSSRule('.termsDiv', 'width: 84%;display: block;margin: 10px auto;color: #00abff;margin-bottom: 0px;text-align: left;')
  return bittube;
}

function buttonCancelDonationClick() {
  const modalElem = getModalElement();

  const error2fa = modalElem.querySelector('#error2fa');
  if (error2fa != null) {
    error2fa.remove();
  }

  const inputDonation = modalElem.querySelector('#inputDonation');
  inputDonation.style.borderColor = '#dfdfdf';
  inputDonation.value = '1';

  const buttonConfirm = modalElem.querySelector('#buttonConfirm');
  buttonConfirm.innerHTML = i18next.t('confirm') //'Confirm';
  buttonConfirm.removeAttribute('disabled');
  buttonConfirm.setAttribute('data-action', 'sendDonation');

  modalElem.querySelector('#donationSection').style.display = 'block';
  modalElem.querySelector('#divConfirmDonation').style.display = 'none';
  modalElem.querySelector('#ammountToDonate').innerText = '';
  modalElem.querySelector('#spanTube').innerText = '';
  calculateModalHeight()
}

// FIXME?
function buttonDonateClick(platform) {

  const modalElem = getModalElement();

  const user = getUser(platform);

  const inputDonation = document.getElementById('inputDonation');
  const amount = parseFloat(inputDonation.value); //.toFixed(2);

  if (amount == 0) {
    inputDonation.style.borderColor = '#ff0000';
    const labelInput = modalElem.querySelector('#labelInput');

    const spanError = document.createElement('span');
    spanError.id = 'error2fa';
    spanError.innerText = 'The minimun amount is 0.01';
    spanError.className = 'error';
    spanError.style.top = '44px';
    document.querySelector(".panelTrigger").style.marginTop = "18px"
    labelInput.appendChild(spanError);
  } else {
    const error2fa = modalElem.querySelector('#error2fa');
    if (error2fa != null) {
      error2fa.remove();
    }

    inputDonation.style.borderColor = '#dfdfdf';

    chrome.runtime.sendMessage({
      message: 'getWallet',
      userID: user,
      username: user,
      domain: platform
    }, function (response) {
      if (checkBrowser() == 'chrome') {
        if (response.message == 'gotWallet') {
          document.querySelector(".bittube").style.top = "-405px"
          const spanPaymentId = modalElem.querySelector('#spanPaymentId');
          const spanWalletAddress = modalElem.querySelector('#spanWalletAddress');

          modalElem.querySelector('#donationSection').style.display = 'none';
          modalElem.querySelector('#divConfirmDonation').style.display = 'block';

          fullWallet = convertAddress(response.wallet); // FIXME
          spanWalletAddress.innerText = fullWallet;
          spanPaymentId.innerText = randHex(64);

          sendDonationMessage('ammountToDonate', platform); // FIXME

          const ammountToDonate = modalElem.querySelector('#ammountToDonate');
          const spanTube = modalElem.querySelector('#spanTube');

          if (amount <= 1) {
            ammountToDonate.innerText = amount;
            spanTube.innerText = 'TUBE';
          } else if (amount > 1) {
            ammountToDonate.innerText = amount;
            spanTube.innerText = 'TUBEs';
          }
        } else if (response.message == 'noAllow') {
          showNeedsLogin();
        }
      } else {
        const ammountToDonate = modalElem.querySelector('#ammountToDonate');
        const spanTube = modalElem.querySelector('#spanTube');

        if (amount <= 1) {
          ammountToDonate.innerText = amount;
          spanTube.innerText = 'TUBE';
        } else if (amount > 1) {
          ammountToDonate.innerText = amount;
          spanTube.innerText = 'TUBEs';
        }
        localStorage.setItem('buttonDonate', 'ammountToDonate');
      }
    });
    calculateModalHeight()
  }
}

function Verify2FA(platform, event) {
  if (!eventIsTrusted(event)) return;
  const modalElem = getModalElement();

  const error2faElem = modalElem.querySelector('#error2fa')
  if (error2faElem) error2faElem.remove();

  const code = modalElem.querySelector('#input2fa').value;
  const amount = modalElem.querySelector('#divResultDonation').getAttribute('data-amount'); //modalElem.querySelector('#ammountToDonate').innerText
  const userToDonate = modalElem.querySelector('#userToDonate').innerText;
  const paymentID = modalElem.querySelector('#spanPaymentId').innerText;

  chrome.runtime.sendMessage({
    message: 'sendDonation',
    action: 'verifyCode',
    code: code,
    amount: amount,
    wallet: fullWallet, // FIXME
    paymentid: paymentID,
    usertodonate: userToDonate,
    platform: platform // FIXME?
  }, function (responseDonation) {
    if (checkBrowser() == 'chrome') {
      if (responseDonation.message == 'errorCode') {
        handleErrorCode(responseDonation.error);
      } else if (responseDonation.message == 'correctCode') {
        handleCorrectCode();
      }
    }
  });
}

// FIXME?
const input2faOnFocus = (e) => {
  const modalElem = getModalElement();
  const input2fa = modalElem.querySelector('#input2fa');
  const error2fa = modalElem.querySelector('#error2fa');
  input2fa.style.borderColor = '';
  if (error2fa != null) {
    error2fa.remove();
  }

}

function input2faOnKey(e) {
  console.log('KEY !!!!!! ', e.keyCode)
  if (e.keyCode == 13) {
    const modalElem = getModalElement();
    const input2fa = modalElem.querySelector('#input2fa');
    const platform = input2fa.getAttribute('data-platform');
    if (input2fa.value == '') {
      input2fa.style.borderColor = '#ff0000';
      const spanError = document.createElement('span');
      spanError.id = 'error2fa';
      spanError.innerText = 'The code is required';
      spanError.className = 'error';
      modalElem.querySelector('#spanWrapInfo2fa').appendChild(spanError);
    } else {
      const error2faElem = modalElem.querySelector('#error2fa')
      if (error2faElem) error2faElem.remove();

      const code = modalElem.querySelector('#input2fa').value;
      const amount = modalElem.querySelector('#divResultDonation').getAttribute('data-amount'); //modalElem.querySelector('#ammountToDonate').innerText
      const userToDonate = modalElem.querySelector('#userToDonate').innerText;
      const paymentID = modalElem.querySelector('#spanPaymentId').innerText;

      chrome.runtime.sendMessage({
        message: 'sendDonation',
        action: 'verifyCode',
        code: code,
        amount: amount,
        wallet: fullWallet, // FIXME
        paymentid: paymentID,
        usertodonate: userToDonate,
        platform: platform // FIXME?
      }, function (responseDonation) {
        if (checkBrowser() == 'chrome') {
          if (responseDonation.message == 'errorCode') {
            handleErrorCode(responseDonation.error);
          } else if (responseDonation.message == 'correctCode') {
            handleCorrectCode();
          }
        }
      });
    }
  }
}

// FIXME?
function buttonConfirmDonationClick() {
  const modalElem = getModalElement();
  const spanPaymentId = modalElem.querySelector('#spanPaymentId');
  const buttonConfirmDonation = modalElem.querySelector('#buttonConfirm');
  const action = buttonConfirmDonation.getAttribute('data-action');
  const platform = buttonConfirmDonation.getAttribute('data-platform');

  const donationSpinner = document.createElement("img")
  donationSpinner.src = "https://bittubeapp.com/assets/images/spinnerModal2.png"
  donationSpinner.classList.add("donationSpinner");
  donationSpinner.style.display = 'block';
  donationSpinner.style.margin = 'auto';
  buttonConfirmDonation.innerHTML = '';
  buttonConfirmDonation.appendChild(donationSpinner)
  // buttonConfirmDonation.innerHTML = donationSpinner;//"<i id='loaderDonation' class='loader'></i>";
  buttonConfirmDonation.setAttribute('disabled', 'disabled');
  modalElem.querySelector('#contentResult').innerHTML = '';

  chrome.runtime.sendMessage({
    message: 'sendDonation',
    action: action,
    amount: modalElem.querySelector('#divResultDonation').getAttribute('data-amount'), //modalElem.querySelector('#ammountToDonate').innerText,
    wallet: fullWallet, // FIXME
    paymentid: spanPaymentId.innerText,
    usertodonate: modalElem.querySelector('#userToDonate').innerText,
    platform: platform
  }, function (responseDonation) {
    console.log('Response Send Donation', responseDonation)
    if (checkBrowser() == 'chrome') {
      if (responseDonation.message == 'userNotLoggedIn') {
        handleUserNotLoggedIn();
      } else if (responseDonation.message == 'userHasSecurity') {
        handleUserHasSecurity();
      } else if (responseDonation.message == 'errorOnDonation') {
        handleErrorOnDonation(responseDonation.data);
      } else if (responseDonation.message == 'donationSent') {
        handleDonationSent(responseDonation.data);
      }
    }
  });
}

function closeDonationModal() { // for closeBtn and needsLoginButton in createDonationModal
  const modalElem = getModalElement();
  modalElem.removeAttribute('data-profile');
  modalElem.style.display = 'none';
  modalElem.dataset.userinfo = '';
  modalElem.querySelector('#spanTitleModal').innerHTML = innerHTML = i18next.t('donate') + " <span id='ammountToDonate'></span> <span id='spanTube'></span><span id='spanTube'></span> " + i18next.t('to') + ' '; // FIXME
  modalElem.querySelector('#donationSection').style.display = 'block';
  modalElem.querySelector('#divConfirmDonation').style.display = 'none';
  modalElem.querySelector('#divResultDonation').style.display = 'none';
  modalElem.querySelector('#div2FA').style.display = 'none';
  modalElem.querySelector('#needsLogin').style.display = 'none';
  modalElem.querySelector('#spanTube').innerText = '';
  modalElem.querySelector('#inputDonation').value = '1';

  const verify2faElem = modalElem.querySelector('#verify2fa')
  verify2faElem.innerText = i18next.t('verify'); // was 'Verify'
  verify2faElem.removeAttribute('disabled');

  const input2faElem = modalElem.querySelector('#input2fa');
  input2faElem.value = '';
  input2faElem.innerText = i18next.t('confirm'); // was 'Confirm'
  input2faElem.removeAttribute('disabled');
  calculateModalHeight()
  const confirmBtnElem = modalElem.querySelector('#buttonConfirm');
  confirmBtnElem.innerHTML = i18next.t('confirm'); // was 'Confirm'
  confirmBtnElem.removeAttribute('disabled');
  confirmBtnElem.setAttribute('data-action', 'sendDonation');
}

function setDonateToSpan(user) {
  const bittube = getModalElement();
  // console.log('setDonateToSpan', user);
  if (user) {
    bittube.querySelector('#spanTitleModal').innerHTML = i18next.t('donate') + " <span id='ammountToDonate'></span> <span id='spanTube'></span> " + i18next.t('to') + " <span id='userToDonate' data-user='" + user + "'>" + user + '</span>';
  } else {
    bittube.querySelector('#spanTitleModal').innerHTML = i18next.t('donate') + " <span id='ammountToDonate'></span> <span id='spanTube'></span> " + i18next.t('to') + " <span id='userToDonate'></span>";
  }
}

// === Donation Modal End ===

// === Message Handler Start ===

chrome.runtime.onMessage.addListener(function (request, sender, response) {
  // fbhash = request.hash; // FIXME
  // console.log('donation.js onMessage', request.message, request);

  if (request.message == 'errorCode') {
    handleErrorCode(request.error)
  } else if (request.message == 'correctCode') {
    handleCorrectCode();
  } else if (request.message == 'userNotLoggedIn') {
    handleUserNotLoggedIn();
  } else if (request.message == 'userHasSecurity') {
    handleUserHasSecurity();
  } else if (request.message == 'errorOnDonation') {
    handleErrorOnDonation(request.data);
  } else if (request.message == 'donationSent') {
    handleDonationSent(request.data);
  } else if (request.message == 'gotWallet') {
    if (document.getElementById('bittube-modal').style.display == 'block') {
      responseGotWallet(request, localStorage.getItem('buttonDonate'), request.platform);
    }
  } else if (request.message == 'favCur') {
    fetchTUBEValue(request.currency, request.amount) // This will fetch value
  } else if (request.message == 'getTubePrice') {
    actualPrice = request.value
    const resultFetch = {}
    resultFetch.currency = request.currency;
    resultFetch.value = actualPrice.toFixed(3);
    if (resultFetch != undefined) {

      const result = (new Number(request.amount) * new Number(resultFetch.value)).toFixed(2) + ' ' + resultFetch.currency;
      if (request.amount != undefined) {
        document.querySelector(".donationTitle").style.display = "block"
        document.querySelector(".donationRate").style.display = "block"
        document.querySelector(".donationSpinner").style.display = "none"
        const svg = '<svg style="height: 8px; width: 8px; vertical-align: middle; fill: white; margin-left: 2px;" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="125.805px" height="125.805px" viewBox="0 0 125.805 125.805" enable-background="new 0 0 125.805 125.805" xml:space="preserve"> <rect x="26.835" y="44.985" width="72" height="9"/> <rect x="26.835" y="62.985" width="72" height="9"/> <rect x="53.835" y="12.279" width="18" height="113.526"/> <rect x="8.835" y="-0.015" width="108" height="18"/> </svg>';
        // svg.style.height = '8px';
        // svg.style.width = '8px';
        // svg.verticalAlign = 'middle';
        // svg.style.fill = '#ffffff';
        // svg.style.marginLeft = '2px';
        document.querySelector('.donationRate').innerHTML = request.amount + svg + ' / ' + result;
      } else {
        document.querySelector('.donationRate').innerHTML = 'Error'
      }
    }
  } else if (request.message == 'getTubeValue') {
    if (request.type == 'getFiat') {
      document.getElementById("inputFiatLoader").style.display = "none"
      document.querySelector(".wireFiatInputField").value = request.value
      document.querySelector(".buttonConfirm").removeAttribute("disabled")
      localStorage.setItem("purchaseData", request.token)
    } else {
      document.getElementById("inputTubeLoader").style.display = "none"
      document.querySelector(".wireTubeInputField").value = request.value
      document.querySelector(".buttonConfirm").removeAttribute("disabled")
      localStorage.setItem("purchaseData", request.token)
    }
  } else if (request.message == "getBuyTubeStatus") {
    disabledMethods = request.disabled
    disabledMessage = request.error
    console.log('OR Here !?????? ', disableMessage)
    if (response.error == "token") {
      userAuth = false
    }
  } else if (request.message == "createTransferOrder") {

    if (request.error == "email") {
      createPopupError("You have to verify oyur phone number to pay by wire transfer")
    } else if (request.result.payment_url == "https://bittubeapp.com/errorPurchase.html") {
      window.open("https://bittubeapp.com/errorPurchase.html")
    } else if (request.result.message == "success") {
      const createPopupInModal = (dataObj) => {
        const popupContainer = document.createElement("div")
        const popupCard = document.createElement("div")
        const popupHeader = document.createElement("div")
        const panelSide = document.querySelector(".BitTube-panelSlide")
        const popupIntro = document.createElement("div")
        const popupRefWarning = document.createElement("div")
        const popupBottomText = document.createElement("div")
        const popupHeaderSpan = document.createElement("span")
        const popupClose = document.createElement("button")

        const allData = document.createElement("p")
        const createField = (label, data, size) => {
          const container = document.createElement("div")
          const labelC = document.createElement("div")
          const dataC = document.createElement("div")
          container.classList.add("dataContainer")
          labelC.classList.add("popupLabel")
          dataC.classList.add("dataLabel")
          container.classList.add(size)
          labelC.innerHTML = label
          dataC.innerHTML = data
          container.appendChild(labelC)
          container.appendChild(dataC)
          allData.appendChild(container)
        }
        createField("Amount", dataObj.tubeamount + '/' + dataObj.amount + ' ' + dataObj.currency, 'midIn')
        createField("Reference Id", dataObj.referenceId, 'midIn')
        allData.appendChild(popupRefWarning)
        console.log('Currency ===> ', dataObj.currency)
        switch (dataObj.currency) {
          case 'USD':
            createField("Beneficiary", 'TransferWise FBO BitTube OU', 'fullIn');
            createField("Bank Name", 'TransferWise', 'midIn');
            createField("BIC/SWIFT", 'CMFGUS33', 'midIn');
            createField("Account Number", '8310274544', 'midIn');
            createField("Transfer Number", '026073008', 'midIn');
            createField("Routing Number (ACH or ABA)", '026073150', 'fullIn');
            break;
          case 'EUR':
            createField("Beneficiary", 'BitTubeInt OÜ', 'fullIn');
            createField("Bank Name", 'Handelsbank', 'midIn');
            createField("BIC/SWIFT", 'DEKTDE7GXXX', 'midIn');
            createField("IBAN", 'DE60 7001 1110 6055 7355 63', 'fullIn');
            break
          case 'GBP':
            createField("Beneficiary", 'BitTubeInt OÜ', 'fullIn');
            createField("Bank Name", 'TransferWise', 'midIn');
            createField("UK Sort Code", '23-14-70', 'midIn');
            createField("Account Number", '71808293', 'fullIn');
            break;
          case 'AUD':
            createField("Beneficiary", 'BitTubeInt OÜ', 'fullIn');
            createField("Bank Name", 'TransferWise', 'midIn');
            createField("BSB-Code", '082-182', 'midIn');
            createField("Account Number", '494559747', 'fullIn');
            break;
          case 'NZD':
            createField("Beneficiary", 'BitTubeInt OÜ', 'fullIn');
            createField("Bank Name", 'TransferWise', 'midIn');
            createField("Account Number", '02-1291-0249416-000', 'midIn');
            break;
        }

        popupContainer.classList.add("popupContainer")
        popupCard.classList.add("popupCard")
        popupHeader.classList.add("popupHeader")
        popupIntro.classList.add("popupIntro")
        popupHeaderSpan.classList.add("popupHeaderSpan")
        popupClose.classList.add("popupClose")
        popupIntro.classList.add("popupIntro")
        popupRefWarning.classList.add("popupRefWarning")
        popupBottomText.classList.add("popupBottomText")
        allData.classList.add("allData")

        popupClose.innerHTML = "Close"
        popupIntro.innerHTML = "To finish the process do a <b> bank transfer  in the next 24h </b> using the data bellow:"
        popupRefWarning.innerHTML = "Don't forget to include the Reference ID</span> to link yout payment to your account"
        popupBottomText.innerHTML = "Important! Bank transfer takes approximatively <b>3 to 7 days to process</b> although <b>sometimes it may be longer</b> "

        popupHeaderSpan.innerHTML = "Order Created"
        popupClose.addEventListener("click", (event) => {
          if (!eventIsTrusted(event)) return;
          panelSide.removeChild(popupContainer)
        });

        const termsDiv = document.createElement('a');
        termsDiv.innerHTML = 'Terms';
        termsDiv.setAttribute('href', 'https://kb.bittubeapp.com/article/118-how-to-purchase-tube-via-wire-transfer');
        termsDiv.setAttribute('target', '_blank');
        termsDiv.classList.add('termsDiv');
        popupContainer.appendChild(popupCard);
        popupCard.appendChild(popupHeader);
        popupCard.appendChild(popupIntro);
        popupCard.appendChild(allData);
        popupCard.appendChild(popupBottomText);
        popupCard.appendChild(popupClose);
        popupCard.appendChild(termsDiv);
        popupHeader.appendChild(popupHeaderSpan);
        panelSide.appendChild(popupContainer);
      }
      createPopupInModal(request.data)
    }
  } else if (request.message == "createCryptoOrder") {
    window.open(request.data.payment_url, '_blank')
  } else if (request.message == "buyWithCreditCard") {
    window.open(request.data.payment_url, '_blank')
  } else if (request.message == 'newUrl') {
    newUrlHandler(request);
  } else if (request.message == 'SoundcloudVerification') {
    const descriptionElem = document.getElementsByClassName('truncatedUserDescription__content')[0];
    let hash = '';
    if (descriptionElem !== undefined) {
      hash = document.getElementsByClassName('truncatedUserDescription__content')[0].children[0].innerText;
    }
    chrome.runtime.sendMessage({
      message: 'SoundcloudVerification',
      hash: hash
    });
  } else if (request.message == 'FacebookVerification') {
    const descriptionElem = document.getElementsByClassName('_4ihn _2ph-')[0];
    if (descriptionElem !== undefined) {
      const hash = descriptionElem.children[0].children[0].innerText;
      chrome.runtime.sendMessage({
        message: 'FacebookVerification',
        hash: hash
      });
    } else {
      document.addEventListener('DOMNodeInserted', facebookVerifyPage);
    }
  }
  return true;
});

function facebookVerifyPage(e) {
  if (e.target.className != undefined) {
    let found = false;
    let elements = document.getElementsByClassName('_5pbx userContent _3ds9 _3576');
    if (elements[0] != undefined) {
      found = true;
    } else if (e.target.className == '_6shg _3-91') {
      elements = document.getElementsByClassName('_5pbx userContent _3576');
      if (elements[0] != undefined) {
        found = true;
      }
    }
    if (found) {
      let hash = '';
      for (i = 0; i < elements.length; i++) {
        if (elements[i].innerText.indexOf(fbhash) > -1) {
          hash = elements[i].innerText;
          break;
        }
      }
      chrome.runtime.sendMessage({
        message: 'FacebookVerification',
        hash: hash
      });
      document.removeEventListener('DOMNodeInserted', facebookVerifyPage);
    }
  }
}

function responseGotWallet(response, elementWithAmount, platform) {
  const modalElem = getModalElement();

  if (response.message == 'gotWallet') {
    fullWallet = convertAddress(response.wallet); // FIXME

    const buttonConfirm = modalElem.querySelector('#buttonConfirm');
    const donationSpinner = document.createElement("img")
    donationSpinner.src = "https://bittubeapp.com/assets/images/spinnerModal2.png"
    donationSpinner.classList.add("donationSpinner");
    donationSpinner.style.height = '15px';
    donationSpinner.style.width = '15px';
    donationSpinner.style.display = 'block';
    donationSpinner.style.margin = '0 auto';

    buttonConfirm.innerHTML = '';
    buttonConfirm.appendChild(donationSpinner); //"<i id='loaderDonation' class='loader'></i>";
    //buttonConfirm.innerHTML = "<i id='loaderDonation' class='loader'></i>";
    buttonConfirm.setAttribute('disabled', 'disabled');

    const spanWalletAddress = modalElem.querySelector('#spanWalletAddress');
    spanWalletAddress.innerText = localStorage.getItem('walletToDonate');
    spanWalletAddress.innerHTML = convertAddress(response.wallet);

    modalElem.querySelector('#donationSection').style.display = 'none';
    modalElem.querySelector('#divConfirmDonation').style.display = 'block';
    modalElem.querySelector('#spanPaymentId').innerText = randHex(64);
    modalElem.querySelector('#ammountToDonate').innerText = modalElem.querySelector('#' + elementWithAmount).innerText;
    modalElem.querySelector('#spanTube').innerText = 'TUBE';
    modalElem.querySelector('#spanFees').innerText = i18next.t('calculating');
    requestFees();
  } else if (response.message == 'noAllow') {
    showNeedsLogin();
  }
}

function requestFees() {
  const modalElem = getModalElement();
  const svg = '<svg style="height: 10px; width: 10px; vertical-align: middle; fill: #343434; margin-left: 2px; margin-top: -2px;" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="125.805px" height="125.805px" viewBox="0 0 125.805 125.805" enable-background="new 0 0 125.805 125.805" xml:space="preserve"> <rect x="26.835" y="44.985" width="72" height="9"/> <rect x="26.835" y="62.985" width="72" height="9"/> <rect x="53.835" y="12.279" width="18" height="113.526"/> <rect x="8.835" y="-0.015" width="108" height="18"/> </svg>';
  // svg.style.height = '8px';
  // svg.style.width = '8px';
  // svg.verticalAlign = 'middle';
  // svg.style.marginLeft = '2px';
  modalElem.querySelector('#spanFees').innerHTML = modalElem.querySelector('#ammountToDonate').innerText + svg + ' + ' + i18next.t('fee') + '';
  modalElem.querySelector('#divResultDonation').setAttribute('data-amount', modalElem.querySelector('#ammountToDonate').innerText);
  setTimeout(() => {
    const buttonConfirm = modalElem.querySelector('#buttonConfirm');

    buttonConfirm.innerHTML = i18next.t('confirm');
    buttonConfirm.removeAttribute('disabled');
  }, 1000);
}

function sendDonationMessage(buttonDonate, platform) {
  const user = getUser(platform);
  localStorage.setItem('buttonDonate', buttonDonate);
  chrome.runtime.sendMessage({
    message: 'getWallet',
    username: user,
    userID: user,
    domain: platform
  }, function (response) {
    if (checkBrowser() == 'chrome') {
      responseGotWallet(response, buttonDonate, platform);
    }
  });
}

function showNeedsLogin() {
  const modalElem = getModalElement();
  modalElem.querySelector('#needsLogin').style.display = 'block';
  modalElem.querySelector('#donationSection').style.display = 'none';
}

function showErrorOnDonation(response) {
  const modalElem = getModalElement();

  modalElem.querySelector('#buttonConfirm').setAttribute('data-action', 'sendDonation');

  const buttonOk = document.createElement('button');
  buttonOk.align = 'left';
  buttonOk.className = 'buttonGreen';
  buttonOk.innerText = 'Ok';
  buttonOk.style.textTransform = 'uppercase';
  buttonOk.style.marginTop = '10px';

  const pResponseError = document.createElement('p');
  pResponseError.align = 'left';
  pResponseError.className = 'margin5';
  pResponseError.innerText = response.data;

  const pTitleResult = modalElem.querySelector('#pTitleResult');
  pTitleResult.innerHTML = i18next.t('anErrorOccurredDonation') + '<br>' + i18next.t('tryAgainLater'); // 'An error has occurred and the donation has not been sent.<br>Please try again later';
  pTitleResult.style.color = '#ff0000';

  const contentResult = modalElem.querySelector('#contentResult');
  contentResult.appendChild(pResponseError);
  contentResult.appendChild(buttonOk);

  buttonOk.onclick = function (event) {
    if (!eventIsTrusted(event)) return;
    modalElem.querySelector('#donationSection').style.display = 'block';
    modalElem.querySelector('#divConfirmDonation').style.display = 'none';
    modalElem.querySelector('#divResultDonation').style.display = 'none';
    modalElem.querySelector('#spanTube').innerText = '';
    modalElem.querySelector('#ammountToDonate').innerText = '';
  };

  const buttonConfirm = modalElem.querySelector('#buttonConfirm');
  buttonConfirm.innerHTML = i18next.t('confirm'); //'Confirm';
  buttonConfirm.removeAttribute('disabled');

  const verify2fa = modalElem.querySelector('#verify2fa');
  verify2fa.innerText = i18next.t('verify'); // 'Verify';
  verify2fa.removeAttribute('disabled');

  modalElem.querySelector('#divConfirmDonation').style.display = 'none';
  modalElem.querySelector('#divResultDonation').style.display = 'block';
  modalElem.querySelector('#input2fa').value = '';
  modalElem.querySelector('#div2FA').style.display = 'none';

  const error2fa = modalElem.querySelector('#error2fa');
  if (error2fa) {
    error2fa.remove();
  }

  const inputDonation = modalElem.querySelector('#inputDonation');
  inputDonation.style.borderColor = '#dfdfdf';
  inputDonation.value = '1';
}

// FIXME
function getUser(platform) {
  let user;

  if (document.getElementById('bittube-modal').getAttribute('data-userid') != null && document.getElementById('bittube-modal').getAttribute('data-userid') != 'null') {
    user = document.getElementById('bittube-modal').getAttribute('data-userid');
  } else if (document.getElementById('bittube-modal').getAttribute('data-profile') != null && document.getElementById('bittube-modal').getAttribute('data-profile') != 'null') {
    user = document.getElementById('bittube-modal').getAttribute('data-profile');
  } else {
    user = document.getElementById('userToDonate').innerText;
  }

  // if (platform == 'youtube') {
  //   if (document.getElementById('bittube-modal').getAttribute('data-userid') != null && document.getElementById('bittube-modal').getAttribute('data-userid') != 'null') {
  //     user = document.getElementById('bittube-modal').getAttribute('data-userid');
  //   } else {
  //     user = document.getElementById('userToDonate').innerText;
  //   }
  // } else if (platform == 'facebook') {
  //   if (document.getElementById('bittube-modal').getAttribute('data-profile') != null && document.getElementById('bittube-modal').getAttribute('data-profile') != 'null') {
  //     user = document.getElementById('bittube-modal').getAttribute('data-profile');
  //   } else {
  //     user = document.getElementById('userToDonate').innerText;
  //   }
  // } else {
  //   user = document.getElementById('userToDonate').innerText;
  // }

  return user;
}

function handleErrorCode(data) {
  const modalElem = getModalElement();
  modalElem.querySelector('#input2fa').style.borderColor = '#ff0000';
  const spanError = document.createElement('span');
  spanError.id = 'error2fa';
  spanError.innerText = data;
  spanError.className = 'error';
  modalElem.querySelector('#spanWrapInfo2fa').appendChild(spanError);
}

function handleCorrectCode() {
  const modalElem = getModalElement();
  const buttonConfirm = modalElem.querySelector('#buttonConfirm');
  buttonConfirm.removeAttribute('disabled');
  buttonConfirm.setAttribute('data-action', 'sendCoins');
  buttonConfirm.innerHTML = i18next.t('confirm'); //'Confirm';
  modalElem.querySelector('#verify2fa').innerHTML = i18next.t('verify'); //'Verify';
  modalElem.querySelector('#div2FA').style.display = 'none';
  modalElem.querySelector('#divConfirmDonation').style.display = 'block';

  // modalElem.querySelector('#buttonConfirm').click();
  buttonConfirmDonationClick();
  calculateModalHeight()
}

function handleUserNotLoggedIn() {
  const modalElem = getModalElement();
  modalElem.querySelector('#needsLogin').style.display = 'block';
  modalElem.querySelector('#divConfirmDonation').style.display = 'none';
  calculateModalHeight()
}

function handleUserHasSecurity() {
  const modalElem = getModalElement();
  modalElem.querySelector('#div2FA').style.display = 'block';
  modalElem.querySelector('#divConfirmDonation').style.display = 'none';
  calculateModalHeight()
}

// FIXME
function handleDonationSent(data) {
  const modalElem = getModalElement();

  var userNotification;
  var domainNotification = modalElem.getAttribute('data-domaininfo');
  var userWillGetNotification = false;
  switch (domainNotification) {
    case 'https://www.youtube.com':
    case 'youtube.com':
    case 'twitter.com/':
    case 'twitter.com':
    case 'twitch.tv':
      userWillGetNotification = true;
      break;
  }

  if (modalElem.getAttribute('data-userid') != undefined) {
    userNotification = modalElem.getAttribute('data-userid');
  } else {
    userNotification = modalElem.getAttribute('data-userinfo');
  }

  if (userWillGetNotification) {
    chrome.runtime.sendMessage({
      message: 'ApiSocial',
      Domain: domainNotification,
      User: userNotification,
      videoId: modalElem.getAttribute('data-videoId'),
      amount: modalElem.querySelector('#divResultDonation').getAttribute('data-amount')
    }, function (response) {
      // if (checkBrowser() == 'chrome') {
      //   console.log('Response API SOCIAL ===> ', response);
      // }
    });
  }

  const error2fa = modalElem.querySelector('#error2fa');
  if (error2fa) {
    error2fa.remove();
  }

  const inputDonation = document.getElementById('inputDonation');
  inputDonation.style.borderColor = '#dfdfdf';
  inputDonation.value = '1';

  modalElem.querySelector('#buttonConfirm').setAttribute('data-action', 'sendDonation');

  const pResponseAmount = document.createElement('p');
  pResponseAmount.align = 'left';
  pResponseAmount.className = 'margin5';
  const svg = '<svg style="height: 10px; width: 10px; vertical-align: middle; fill: #343434; margin-left: 2px; margin-top: -1px;" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="125.805px" height="125.805px" viewBox="0 0 125.805 125.805" enable-background="new 0 0 125.805 125.805" xml:space="preserve"> <rect x="26.835" y="44.985" width="72" height="9"/> <rect x="26.835" y="62.985" width="72" height="9"/> <rect x="53.835" y="12.279" width="18" height="113.526"/> <rect x="8.835" y="-0.015" width="108" height="18"/> </svg>';
  pResponseAmount.innerHTML = i18next.t('amount') + ': ' + data.amount + svg;

  const pResponseWallet = document.createElement('p');
  pResponseWallet.align = 'left';
  pResponseWallet.className = 'margin5 translate breakWord';
  pResponseWallet.innerHTML = i18next.t('wallet') + ": <span class='breakAll'>" + data.address + '</span';

  const pResponseTransactionHash = document.createElement('p');
  pResponseTransactionHash.align = 'left';
  pResponseTransactionHash.className = 'margin5 translate breakWord';
  pResponseTransactionHash.innerHTML = i18next.t('transactionHash') + ": <span class='breakAll'>" + data.tx_hash + '</span';

  if (data.tx_key != undefined) {
    const pTransactionKey = document.createElement('p');
    pTransactionKey.align = 'left';
    pTransactionKey.className = 'margin5 translate breakWord';
    pTransactionKey.innerHTML = i18next.t('transactionKey') + ": <span class='breakAll'>" + data.tx_key + '</span';
  }

  const pResponsePaymentId = document.createElement('p');
  pResponsePaymentId.align = 'left';
  pResponsePaymentId.className = 'margin5 translate breakWord';
  pResponsePaymentId.innerHTML = i18next.t('paymentID') + ": <span class='breakAll'>" + data.paymentId + '</span';

  const buttonOpenInExplorer = document.createElement('button');
  buttonOpenInExplorer.setAttribute('disabled', 'disabled');
  buttonOpenInExplorer.className = 'buttonGreen translate';
  buttonOpenInExplorer.innerHTML = i18next.t('openExplorer');
  buttonOpenInExplorer.id = 'buttonOpenExplorer';
  buttonOpenInExplorer.style.textTransform = 'none';
  // buttonOpenInExplorer.style.marginTop = '10px';
  buttonOpenInExplorer.style.marginLeft = '10px';
  buttonOpenInExplorer.style.paddingLeft = '5px';
  buttonOpenInExplorer.style.paddingRight = '5px';
  buttonOpenInExplorer.onclick = function (event) {
    if (!eventIsTrusted(event)) return;
    window.open('https://explorer.bittube.cash/tx/' + data.tx_hash, '_blank');
  }

  const buttonOk = document.createElement('button');
  buttonOk.align = 'left';
  buttonOk.className = 'buttonGreen';
  buttonOk.innerText = 'Ok';
  buttonOk.style.textTransform = 'uppercase';
  buttonOk.style.marginTop = '10px';
  buttonOk.onclick = function (event) {
    if (!eventIsTrusted(event)) return;
    document.getElementById('closeBitTubeModal').click();
  }

  const pTitleResult = modalElem.querySelector('#pTitleResult');
  pTitleResult.innerHTML = i18next.t('yourDonationSuccessfully') + ' ' + modalElem.querySelector('#userToDonate').innerText;
  pTitleResult.style.color = '#00abff';

  const contentResult = modalElem.querySelector('#contentResult');
  contentResult.appendChild(pResponseAmount);
  contentResult.appendChild(pResponseWallet);
  contentResult.appendChild(pResponsePaymentId);
  contentResult.appendChild(pResponseTransactionHash);
  if (data.tx_key != undefined) {
    contentResult.appendChild(pTransactionKey);
  }

  contentResult.appendChild(buttonOk);
  contentResult.appendChild(buttonOpenInExplorer);

  const verify2fa = document.getElementById('verify2fa');
  verify2fa.innerText = i18next.t('verify'); // 'Verify';
  verify2fa.removeAttribute('disabled');

  modalElem.querySelector('#div2FA').style.display = 'none';
  modalElem.querySelector('#divConfirmDonation').style.display = 'none';
  modalElem.querySelector('#divResultDonation').style.display = 'block';
  document.getElementById('input2fa').value = '';
  calculateModalHeight()
  setTimeout(function (e) {
    document.getElementById('buttonConfirm').innerHTML = i18next.t('confirm'); //'Confirm';
    document.getElementById('buttonConfirm').removeAttribute('disabled');
  }, 3000);

  setTimeout(function (e) {
    document.getElementById('buttonOpenExplorer').removeAttribute('disabled');
  }, 3000);
}

function handleErrorOnDonation(data) {
  const modalElem = getModalElement();
  modalElem.querySelector('#buttonConfirm').setAttribute('data-action', 'sendDonation');

  const buttonOk = document.createElement('button');
  buttonOk.align = 'left';
  buttonOk.className = 'buttonGreen';
  buttonOk.innerText = 'Ok';
  buttonOk.style.textTransform = 'uppercase';
  buttonOk.style.marginTop = '10px';
  buttonOk.onclick = function (event) {
    if (!eventIsTrusted(event)) return;
    modalElem.querySelector('#donationSection').style.display = 'block';
    modalElem.querySelector('#divConfirmDonation').style.display = 'none';
    modalElem.querySelector('#divResultDonation').style.display = 'none';
    modalElem.querySelector('#spanTube').innerText = '';
    modalElem.querySelector('#ammountToDonate').innerText = '';
  }

  const pResponseError = document.createElement('p');
  pResponseError.align = 'left';
  pResponseError.className = 'margin5';
  pResponseError.innerText = data;

  const pTitleResult = modalElem.querySelector('#pTitleResult');
  pTitleResult.innerHTML = i18next.t('anErrorOccurredDonation') + '<br>' + i18next.t('tryAgainLater'); // 'An error has occurred and the donation has not been sent.<br>Please try again later';
  pTitleResult.style.color = '#ff0000';

  const contentResult = modalElem.querySelector('#contentResult');
  contentResult.appendChild(pResponseError);
  contentResult.appendChild(buttonOk);

  modalElem.querySelector('#divConfirmDonation').style.display = 'none';
  modalElem.querySelector('#div2FA').style.display = 'none';
  modalElem.querySelector('#divResultDonation').style.display = 'block';
  modalElem.querySelector('#input2fa').value = '';

  const verify2fa = modalElem.querySelector('#verify2fa');
  verify2fa.innerText = i18next.t('verify'); // 'Verify';
  verify2fa.removeAttribute('disabled');

  const error2fa = modalElem.querySelector('#error2fa');
  if (error2fa) {
    error2fa.remove();
  }

  const inputDonation = modalElem.querySelector('#inputDonation');
  inputDonation.style.borderColor = '#dfdfdf';
  inputDonation.value = '1';
  calculateModalHeight()
  setTimeout(function (e) {
    const buttonConfirm = modalElem.querySelector('#buttonConfirm');
    buttonConfirm.innerHTML = i18next.t('confirm'); //'Confirm';
    buttonConfirm.removeAttribute('disabled');
  }, 3000);
}

// === Message Handler End ===

// === New Url Handler Start ===

function newUrlTwitter() {
  const bittube = createDonationModal('twitter');
  let newDesign = false;
  let newDesignTweets = false;

  if (document.getElementById('doc') != undefined) {
    document.getElementById('doc').appendChild(bittube);
  } else if (document.getElementById('react-root') != null) {
    document.getElementById('react-root').appendChild(bittube);
  } else {
    throw new Error('Could not insert bittube modal, "doc" element missing.');
  }

  if (!this.addedDomListener) {
    this.addedDomListener = true;
    document.addEventListener('DOMNodeInserted', function (e) {
      let profileHeaderElem;
      if (window.location.pathname != '/' && window.location.pathname != '/home') {
        setTimeout(function (e) {
          if (document.getElementsByClassName('BittubeButtonDonate').length == 0) {
            if (document.getElementsByTagName('body')[0].className.indexOf('ProfilePage') != -1) {
              profileHeaderElem = document.getElementsByClassName('ProfileHeading-toggle')[0];
            } else {
              newDesign = true;
              profileHeaderElem = document.querySelectorAll('nav.css-1dbjc4n.r-1awozwy.r-1ila09b.r-rull8r.r-qklmqi.r-18u37iz>div.css-1dbjc4n.r-18u37iz.r-16y2uox.r-1wbh5a2.r-tzz3ar.r-16l9doz.r-hbs49y')[0];
            }
            if ((profileHeaderElem && window.location.href != "https://twitter.com/i/notifications")) {
              if (!profileHeaderElem.dataset.bitTube) {
                profileHeaderElem.dataset.bitTube = 'true'
                const button = document.createElement('button')
                if (!newDesign) {
                  button.className = 'ProfileHeading-toggleLink js-nav BittubeButtonDonate';
                  button.style.outline = 'none';
                  button.innerHTML = '<image src="https://bittubeapp.com/assets/images/font-tube-blue.svg" style="height: 15px; width: auto" width: auto" />'
                  button.style.position = 'relative'
                } else {
                  button.className = 'css-76zvg2 css-16my406 r-1qd0xha r-ad9z0x r-bcqeeo r-qvutc0 BittubeButtonDonate';
                  button.style.outline = 'none';
                  button.innerHTML = '<image src="https://bittubeapp.com/assets/images/font-tube-blue.svg" style="height: 15px; width: auto" width: auto" />';
                  button.style.position = 'relative'
                  button.style.background = 'transparent';
                  button.style.border = 'none';
                  button.style.height = '100%';
                }

                button.onclick = async function (e) {
                  if (!eventIsTrusted(e)) return;
                  if (e.target.tagName == "BUTTON") {
                    const contentID = await getContentIDAsync();
                    console.log(contentID)
                    const User = contentID.userName;
                    const UserId = contentID.userID;
                    bittube.setAttribute('data-userinfo', User);
                    bittube.setAttribute('data-userid', UserId);
                    bittube.setAttribute('data-domaininfo', 'twitter.com');
                    bittube.style.display = 'block';
                    if (this) {
                      if (!this.contains(bittube)) {
                        this.appendChild(bittube);
                        setTimeout(function () {
                          calculateModalHeight()
                        }, 300)
                        onElementHeightChange(document.querySelector(".bittube"), function () {
                          calculateModalHeight()

                        });
                      }
                    }

                    setDonateToSpan(User);

                  }

                };
                let div;
                if (!newDesign) {
                  div = document.createElement('li')
                  div.className = 'ProfileHeading-toggleItem u-textUserColor';
                  div.appendChild(button);
                } else {
                  div = document.createElement('div');
                  div.style.cursor = 'pointer';
                  div.className = 'css-1dbjc4n r-16y2uox r-1guxwsk';
                  const div2 = document.createElement('div');
                  div2.className = 'r-1awozwy r-oucylx r-rull8r r-wgabs5 r-1loqt21 r-6koalj r-eqz5dr r-16y2uox r-1777fci r-1ny4l3l r-1oqcu8e r-o7ynqc r-6416eg css-4rbku5 css-18t94o4 css-1dbjc4n';
                  const div3 = document.createElement('div');
                  div3.className = 'css-76zvg2 r-111h2gw r-1qd0xha r-a023e6 r-vw2c0b r-ad9z0x r-bcqeeo r-qvutc0';
                  div3.appendChild(button)
                  div2.appendChild(div3);
                  div.appendChild(div2);
                }

                profileHeaderElem.insertBefore(div, profileHeaderElem.children[4]);
              }
            }
          }

        }, 500);

      }
      let tweetElems = document.getElementsByClassName('ProfileTweet-actionList js-actions');
      if (tweetElems.length == 0) {
        tweetElems = document.getElementsByClassName('css-1dbjc4n r-18u37iz r-1wtj0ep r-156q2ks r-1mdbhws');
        newDesignTweets = true;
      }

      for (i = 0; i < tweetElems.length; i++) {
        if (((tweetElems[i].dataset.bitTube == undefined) && (tweetElems[i].clientHeight != '0')) || (tweetElems[i].clientHeight != '0')) {
          tweetElems[i].dataset.bitTube = 'true';
          let User, ItemId;
          if (newDesignTweets === false) {
            User = tweetElems[i].parentElement.parentElement.parentElement.dataset.screenName;
            ItemId = tweetElems[i].parentElement.parentElement.parentElement.dataset.itemId;
            if (!User && !ItemId) {
              User = tweetElems[i].parentElement.parentElement.parentElement.parentElement.dataset.screenName;
              ItemId = tweetElems[i].parentElement.parentElement.parentElement.parentElement.dataset.itemId;
            }
          } else {
            // User = tweetElems[i].parentNode.querySelector('.css-1dbjc4n.r-19i43ro > div.css-1dbjc4n.r-18u37iz.r-1wtj0ep.r-zl2h9q > div.css-1dbjc4n.r-1d09ksm.r-18u37iz.r-1wbh5a2 > div.css-1dbjc4n.r-1wbh5a2 > a.css-4rbku5.css-18t94o4.css-1dbjc4n.r-1loqt21.r-1wbh5a2.r-dnmrzs').getAttribute('href').split('/')[1];
            //tweetElems[i].parentNode.querySelector('.css-1dbjc4n.r-19i43ro>div.css-1dbjc4n.r-18u37iz.r-1wtj0ep.r-zl2h9q>div.css-1dbjc4n.r-1d09ksm.r-18u37iz.r-1wbh5a2>div.css-1dbjc4n.r-1wbh5a2>a.css-18t94o4.r-6koalj.r-1wbh5a2.r-bcqeeo.r-13wfysu').getAttribute('href').split('/')[1];
            User = tweetElems[i].parentNode.querySelector('.css-1dbjc4n > a').getAttribute('href').split('/')[1];
          }

          // console.log(User, ItemId)
          if (!User) {
            continue;
          }

          const button = document.createElement('button');
          button.style.position = 'absolute'
          button.style.width = '150px';
          button.style.height = '20px';
          button.style.right = '50px'
          button.style.fontSize = '13px'
          button.style.fontWeight = 'bold';
          button.style.paddingRight = '6px'
          button.style.paddingLeft = '6px';
          button.style.lineHeight = '2';
          button.style.color = '#657786'
          button.style.left = '65%'
          button.style.cursor = 'pointer';
          if (newDesignTweets) {
            button.style.background = 'transparent';
            button.style.border = 'none';
          }
          const modalContainer = document.createElement("div")
          modalContainer.classList.add("modalContainer")
          modalContainer.style.width = "100%"
          modalContainer.style.height = "100%"
          modalContainer.style.position = "relative"

          button.innerHTML = '<image src="https://bittubeapp.com/assets/images/font-tube-blue.svg" style="height: 15px; width: auto" width: auto" />';
          button.onclick = function (e) {
            if (!eventIsTrusted(e)) return;
            if (e.target.tagName == "BUTTON") {

              bittube.setAttribute('data-userinfo', User);
              bittube.setAttribute('data-userid', User);
              // bittube.setAttribute('data-iteminfo', ItemId);
              bittube.setAttribute('data-domaininfo', 'twitter.com');
              bittube.style.display = 'block';
              if (checkBrowser() == "chrome") {
                if (modalContainer) {
                  if (!modalContainer.contains(bittube)) {
                    modalContainer.appendChild(bittube);
                    setTimeout(function () {
                      calculateModalHeight()
                    }, 300)
                    onElementHeightChange(document.querySelector(".bittube"), function () {
                      calculateModalHeight()

                    });
                  }
                }
              } else {
                if (this) {
                  if (!this.contains(bittube)) {
                    this.appendChild(bittube);
                    setTimeout(function () {
                      calculateModalHeight()
                    }, 300)
                    onElementHeightChange(document.querySelector(".bittube"), function () {
                      calculateModalHeight()

                    });
                  }
                }
              }
              setDonateToSpan(User);
            }

          };

          const div = document.createElement('div');
          div.className = 'css-1dbjc4n r-1iusvr4 r-18u37iz r-16y2uox r-1h0z5md bittubeSomething'
          div.style.display = 'inline-block';
          div.style.minWidth = '80px';
          div.style.verticalAlign = 'top';
          try {
            if (tweetElems[i].querySelector('.bittubeSomething') == null) {
              div.appendChild(button)
              button.appendChild(modalContainer)
              tweetElems[i].appendChild(div);
            }

          } catch (e) {
            console.log('Error Appending childs!=> ', e)
          }
        }
      }

    });
  }
}

function newUrlFacebook() {
  // Create and append modal to document, or just get it if it already exists.
  let bittube = document.getElementById('bittube-modal');

  let createdModal = false;
  if (!bittube) {
    console.log('Before call create donation modal')
    bittube = createDonationModal('facebook');
    createdModal = true;
  }

  // Add dom listener if not already added
  if (!this.addedDomListener) {
    this.addedDomListener = true;

    // Donates to current profile
    async function profileDonateClick() {
      const contentID = await getContentIDAsync();
      const User = contentID.userName;
      const UserId = contentID.userID;
      console.log('profileDonateClick', contentID);
      // const contentDonate = i18next.t('donate') + " <span id='ammountToDonate'></span> <span id='spanTube'></span> " + i18next.t('to') + " <span id='userToDonate' data-user='" + User + "'>" + User + '</span>';
      // const elementDonate = bittube.querySelector('#spanTitleModal');
      // elementDonate.innerHTML = contentDonate;
      setDonateToSpan(User);
      bittube.setAttribute('data-userinfo', User);
      bittube.setAttribute('data-userid', UserId);
      bittube.setAttribute('data-profile', User);
      bittube.style.display = 'block';
      // createCSSRule('#facebook ._-kb div', 'z-index:10');
      document.querySelector("#facebook ._-kb div").style.zIndex = "2"
      if (document.querySelectorAll("body")[0].contains(bittube) && !document.querySelector('.tube-donate').contains(bittube)) {
        document.querySelectorAll("body")[0].removeChild(bittube)
      }
      const tubeDonate = document.querySelector('.tube-donate');
      if (tubeDonate) {
        if (!tubeDonate.contains(bittube)) {

          tubeDonate.appendChild(bittube);

        }
      }

    }

    document.addEventListener('DOMNodeInserted', function (e) {
      // Donate button for profile
      const element = document.getElementsByClassName('_6_7 clearfix')[0];
      if (element) {
        if ((element.dataset.bitTube == undefined) && (element.clientHeight != '0')) {
          element.dataset.bitTube = 'true';

          const logo = document.createElement('img'); // ???
          const button = document.createElement('button');
          button.classList.add("tube-donate")
          button.style.position = 'relative'
          button.style.width = '110px';
          button.style.height = '20px';
          button.style.top = '0px';
          button.style.left = '-6px';
          button.style.fontSize = '12px';
          button.style.fontWeight = 'bold';
          button.style.border = 'none';
          button.style.background = 'transparent';
          button.style.lineHeight = '26px';
          button.style.color = '#4b4f56'
          button.style.cursor = 'pointer';
          button.innerText = 'Donate TUBEs';
          button.addEventListener("click", (e) => {
            if (!eventIsTrusted(e)) return;
            if (e.target.tagName == "BUTTON") {
              profileDonateClick()
              calculateModalHeight('facebookProfile')
            }
          })

          const div = document.createElement('div');
          div.style.position = 'absolute';
          div.style.left = '200px';
          div.style.bottom = '120px';
          div.style.background = '#f5f6f7';
          div.style.height = '26px';
          div.style.border = '1px solid #5a5a5a';
          div.appendChild(logo);
          div.appendChild(button);

          element.appendChild(div);
        }
      } else {
        const element = document.getElementsByClassName('_4-u2 _hoc clearfix _4-u8')[0];
        if (element) {
          if ((element.dataset.bitTube == undefined) && (element.clientHeight != '0')) {
            element.dataset.bitTube = 'true';

            const button = document.createElement('button');
            button.className = '_rfh _4jy0 _4jy4 _517h _51sy _42ft';
            button.style.marginLeft = '5px';
            button.classList.add("tube-donate")
            button.style.position = 'relative';
            button.innerText = 'Donate TUBEs';
            button.addEventListener("click", (e) => {
              if (!eventIsTrusted(e)) return;
              if (e.target.tagName == "BUTTON" || e.target.classList == "_4adk") {
                profileDonateClick()
                calculateModalHeight()
              } else {
                console.log(e.target)
              }

            })

            element.children[0].insertBefore(button, element.children[0].children[1]);
          }
        }
      }

      // Donate button for posts
      let shouldAddButtons = false;
      if (e.target.className != undefined) {
        if (e.target.className.indexOf('_4ikz') > -1 || e.target.className == 'label' || e.target.className == 'bittube' || e.target.className == '_zbd _400z _1vek _42ft' ||
          e.target.className == '_3t5i' || e.target.className == ' _3qry _4ubd _2lwf _3rno _6xrt' || e.target.className == '_4-u2 mbm _4mrt _5v3q _4-u8' || e.target.className == '_3a-4' ||
          e.target.className == '_5qth _5vm9 uiPopover _6a _6e' || e.target.className == '_1dnh' || e.target.className == '_1xnd') {
          shouldAddButtons = true;
        }
      }
      // console.log('shouldAddButtons', shouldAddButtons, e.target.className);
      if (shouldAddButtons) {
        function postDonationClick(e) {
          if (!eventIsTrusted(e)) return;
          if (e.target.tagName == "BUTTON") {
            e.preventDefault();
            let User;
            let UserID;
            const wrapperElem = this.closest(".userContentWrapper");
            const nameElem = wrapperElem.querySelector(".fwb[data-ft] > a");
            const wrapperBtn = wrapperElem.querySelector(".tube-doante")

            if (nameElem) {
              User = nameElem.innerText;
              UserID = nameElem.href.split('facebook.com/')[1].split('/')[0];
            }
            // console.log("CLICK", User, UserID);
            if (User && UserID) {
              setDonateToSpan(User);
              bittube.setAttribute('data-userinfo', User);
              bittube.setAttribute('data-userid', UserID);
              bittube.setAttribute('data-domaininfo', 'facebook.com');
              bittube.style.display = 'block';
              // if(document.querySelectorAll("body")[0].contains(bittube)){
              //   document.querySelectorAll("body")[0].removeChild(bittube)
              // }

              if (this) {
                if (!this.contains(bittube)) {
                  this.appendChild(bittube);
                  calculateModalHeight()
                } else {
                  calculateModalHeight()
                }
              }

            }
          }

        }

        let elements = document.getElementsByClassName('_sa_ _gsd _fgm _5vsi _192z _1sz4 _1i6z');
        if (elements.length == 0) {
          elements = document.getElementsByClassName('_78bu');
        }
        if (elements.length == 0) {
          elements = document.getElementsByClassName('_sa_ _gsd _fgm _5vsi _192z');
        }
        // console.log('Elements', elements);
        for (i = 0; i < elements.length; i++) {
          if ((elements[i].dataset.bitTube == undefined) && (elements[i].clientHeight != '0')) {
            elements[i].dataset.bitTube = 'true';

            const button = document.createElement('button');
            button.style = 'color: #616770;' +
              'font-size: 13px;' +
              'font-weight: 600;' +
              'height: 32px;' +
              'position: relative;' +
              'justify-content: center;' +

              'margin: 0;' +
              'padding: 0;' +
              'white-space: nowrap;' +
              'width: calc(100% - 20px);' +
              'border-top: 1px solid #e5e5e5;' +
              'border-bottom: none;' +
              'border-left: none;' +
              'border-right: none;' +
              'margin-left: 10px;' +
              'margin-right: 10px;' +
              'padding-top: 3px;' +
              'font-family: inherit;' +
              'background-color: inherit;' +
              'text-align: center;' +
              'cursor: pointer;';
            button.innerText = 'Donate TUBEs';
            button.classList.add("tube-donate")
            button.onclick = postDonationClick

            elements[i].appendChild(button);
          }
        }
      }
    });
  }

  if (createdModal) {
    const body = document.querySelectorAll('body')[0];
    if (body) {
      if (!body.contains(bittube)) {

        body.appendChild(bittube);
        setTimeout(function () {
          calculateModalHeight()
        }, 300)

      }
    }
  }
}

// FIXME
function newUrlYoutube() {
  const bittube = createDonationModal('youtube');
  const url = window.location.href;
  const body = document.getElementsByTagName('body')[0];

  if (body && !body.contains(bittube)) {
    body.appendChild(bittube);
  }
  if (url.indexOf('channel') > -1 || url.indexOf('user') > -1) {

    // FIXME
    if (document.getElementById('channel-title')) {
      const element = document.getElementById('channel-header-container');

      if (element.dataset.bitTube == undefined) {
        element.dataset.bitTube = 'true'
        const button = document.createElement('button');
        const render = document.createElement('div');
        const string = document.createElement('span');
        const div = document.createElement('div');

        // START THE MAGIC
        div.className = 'style-scope ytd-video-secondary-info-renderer tube-donate';
        div.style.display = 'flex';
        div.style.position = 'relative';
        div.style.flexDirection = 'column';
        div.style.justifyContent = 'center';
        render.style = '--yt-formatted-string-deemphasize_-_color: hsla(0, 0%, 100%, .85);' +
          ' --yt-formatted-string-deemphasize_-_margin-left: 4px;' +
          '--yt-formatted-string-deemphasize_-_display: initial;' +
          'display: flex;' +
          '-ms-flex-direction: row;' +
          '-webkit-flex-direction: row;' +
          'flex-direction: row;';
        render.style.color = 'hsl(0, 0%, 100%)';

        button.style = 'background-color: var(--yt-spec-brand-button-background);' +
          'border-radius: 2px;' +
          'color: var(--yt-subscribe-button-text-color);' +
          'padding: 10px 16px;' +
          'margin: auto var(--ytd-subscribe-button-margin, 4px);' +
          'white-space: nowrap;' +
          'font-size: 1.4rem;' +
          'font-weight: 500;' +
          'letter-spacing: 0.007px;' +
          'display: flex;' +
          'flex-direction: row;' +
          'border: none;' +
          'transition: box-shadow 0.28s cubic-bezier(0.4, 0, 0.2, 1);' +
          '--yt-formatted-string-deemphasize_-_color: hsla(0, 0%, 100%, .85);' +
          '--yt-formatted-string-deemphasize_-_margin-left: 4px;' +
          '--yt-formatted-string-deemphasize_-_display: initial;' +
          '-webkit-tap-highlight-color: transparent;' +
          'font: inherit;' +
          'justify-content: center;' +
          'position: relative;' +
          'box-sizing: border-box;' +
          'min-width: 5.14em;' +
          "font-family: 'Roboto', 'Noto', sans-serif;" +
          '-webkit-font-smoothing: antialiased;' +
          'border: var(--paper-button_-_border);' +
          'color: var(--paper-button_-_color);' +
          'width: var(--paper-button_-_width);' +
          'margin: var(--paper-button_-_margin, 0 0.29em);' +
          'text-transform: var(--paper-button_-_text-transform, uppercase);' +
          'font-size: 1.4rem;' +
          'font-weight: 500;' +
          'letter-spacing: .007px;' +
          'text-transform: uppercase;' +
          'display: flex;';
        // button.classList.add("tube-donate")
        string.style = 'white-space: nowrap;' +
          'font-size: 1.4rem;' +
          'font-weight: 500;' +
          'letter-spacing: .007px;' +
          'text-transform: uppercase;' +
          '-webkit-tap-highlight-color: transparent;' +
          'font: inherit;' +
          'user-select: none;' +
          'cursor: pointer;' +
          'z-index: 0;' +
          "font-family: 'Roboto', 'Noto', sans-serif;" +
          '-webkit-font-smoothing: antialiased;';
        string.textContent = 'Donate TUBEs';

        // FIXME Wut
        button.onclick = async function (event) {
          if (!eventIsTrusted(event)) return;
          document.querySelector("#masthead-container").style.zIndex = "1000"
          const contentID = await getContentIDAsync();
          const userName = contentID.userName;
          const userID = contentID.userID;
          calculateModalHeight()
          if (document.querySelector(".tube-donate .bittube")) {
            document.querySelector(".tube-donate").removeChild(bittube)
          } else {
            body.removeChild(bittube)
          }

          // if(document.querySelectorAll(".tube-donate > div > button > .bittube")[0]){
          //   document.querySelectorAll(".tube-donate > div > button")[0].removeChild(bittube)
          // }
          // else{
          //   body.removeChild(bittube)
          // }

          div.appendChild(bittube)
          document.getElementById("primary").style.overflowX = "hidden"
          if (userID) {
            bittube.style.display = 'block';
            setDonateToSpan(userName);
            // bittube.children[0].children[1].children[0].innerHTML = i18next.t('donate') + " <span id='ammountToDonate'></span> <span id='spanTube'></span> " + i18next.t('to') + " <span id='userToDonate' data-user='" + userName + "'>" + userName + '</span>';
            bittube.setAttribute('data-userinfo', userName);
            bittube.setAttribute('data-userid', userID);
            bittube.setAttribute('data-domaininfo', 'youtube.com');
            bittube.style.display = 'block';
            // if (this) {
            //   if (!this.contains(bittube)) {
            //     this.appendChild(bittube);
            //   }
            //   else{
            //     calculateModalHeight()
            //   }
            // }
          }
        }

        button.appendChild(string);
        render.appendChild(button);
        div.appendChild(render);
        element.insertBefore(div, element.children[4]);
      }
    }
  } else if (window.location.href.indexOf('playlist?list') > -1) {
    // FIXME - Playlist button?
  } else if (window.location.href.indexOf('watch?') > -1) {
    // const content = document.getElementById('content');
    // if (content && !content.contains(bittube)) { content.appendChild(bittube); }

    // Adds donation buttons to every new thing when added?
    if (!this.addedDonationWatcher) {
      this.addedDonationWatcher = true; // Prevent adding listener twice.
      document.addEventListener('DOMNodeInserted', function (e) {
        if (e.target.tagName != undefined) {
          if (e.target.tagName.indexOf('YTD-THUMBNAIL-OVERLAY-TIME-STATUS-RENDERER') > -1) {
            const elements = document.getElementsByClassName('style-scope ytd-video-secondary-info-renderer');
            for (i = 0; i < elements.length; i++) {
              if (elements[i].dataset.bitTube == undefined && elements[i].id == 'top-row') {
                elements[i].dataset.bitTube = 'true';
                const div = document.createElement('div');
                const button = document.createElement('button');
                const logo = document.createElement('img');
                const render = document.createElement('div');
                const string = document.createElement('span');

                // START THE MAGIC
                div.className = 'style-scope ytd-video-secondary-info-renderer tube-donate';
                div.style.display = 'flex';
                div.style.position = 'relative';
                div.style.flexDirection = 'column';
                div.style.justifyContent = 'center';

                render.style = '--yt-formatted-string-deemphasize_-_color: hsla(0, 0%, 100%, .85);' +
                  ' --yt-formatted-string-deemphasize_-_margin-left: 4px;' +
                  '--yt-formatted-string-deemphasize_-_display: initial;' +
                  'display: flex;' +
                  '-ms-flex-direction: row;' +
                  '-webkit-flex-direction: row;' +
                  'flex-direction: row;';

                render.style.color = 'hsl(0, 0%, 100%)';

                button.style = 'background-color: var(--yt-spec-brand-button-background);' +
                  'border-radius: 2px;' +
                  'color: var(--yt-subscribe-button-text-color);' +
                  'padding: 10px 16px;' +
                  'margin: auto var(--ytd-subscribe-button-margin, 4px);' +
                  'white-space: nowrap;' +
                  'font-size: 1.4rem;' +
                  'font-weight: 500;' +
                  'letter-spacing: 0.007px;' +
                  'display: flex;' +
                  'flex-direction: row;' +
                  'border: none;' +
                  'transition: box-shadow 0.28s cubic-bezier(0.4, 0, 0.2, 1);' +
                  '--yt-formatted-string-deemphasize_-_color: hsla(0, 0%, 100%, .85);' +
                  '--yt-formatted-string-deemphasize_-_margin-left: 4px;' +
                  '--yt-formatted-string-deemphasize_-_display: initial;' +
                  '-webkit-tap-highlight-color: transparent;' +
                  'font: inherit;' +
                  'justify-content: center;' +
                  'position: relative;' +
                  'box-sizing: border-box;' +
                  'min-width: 5.14em;' +
                  "font-family: 'Roboto', 'Noto', sans-serif;" +
                  '-webkit-font-smoothing: antialiased;' +
                  'border: var(--paper-button_-_border);' +
                  'color: var(--paper-button_-_color);' +
                  'width: var(--paper-button_-_width);' +
                  'margin: var(--paper-button_-_margin, 0 0.29em);' +
                  'text-transform: var(--paper-button_-_text-transform, uppercase);' +
                  'font-size: 1.4rem;' +
                  'font-weight: 500;' +
                  'letter-spacing: .007px;' +
                  'text-transform: uppercase;' +
                  'display: flex;';

                string.style = 'white-space: nowrap;' +
                  'font-size: 1.4rem;' +
                  'font-weight: 500;' +
                  'letter-spacing: .007px;' +
                  'text-transform: uppercase;' +
                  '-webkit-tap-highlight-color: transparent;' +
                  'font: inherit;' +
                  'user-select: none;' +
                  'cursor: pointer;' +
                  'z-index: 0;' +
                  "font-family: 'Roboto', 'Noto', sans-serif;" +
                  '-webkit-font-smoothing: antialiased;';
                string.textContent = 'Donate TUBEs';

                logo.src = 'https://bittubeapp.com/assets/images/logo.png';
                logo.style.position = 'relative'
                logo.width = '17';
                logo.style.color = '#657786'
                logo.height = '17';
                logo.style.paddingRight = '6px'
                logo.style.paddingLeft = '6px';
                logo.style.right = '70px'
                logo.style.bottom = '22px';

                button.onclick = function (event) {
                  if (!eventIsTrusted(event)) return;
                  console.log('Click Here !!! !');
                  const videoId = window.location.href.split('?v=')[1].split('&')[0].split('?')[0];
                  let User;
                  calculateModalHeight()
                  let UserName;
                  if (document.querySelector(".tube-donate .bittube")) {
                    document.querySelector(".tube-donate").removeChild(bittube)
                  } else {
                    body.removeChild(bittube)
                  }

                  document.querySelector(".tube-donate").appendChild(bittube)
                  document.getElementById("primary").style.overflowX = "hidden"
                  for (i = 0; i < document.getElementsByClassName('style-scope ytd-video-owner-renderer').length; i++) {
                    if (document.getElementsByClassName('style-scope ytd-video-owner-renderer')[i].id == 'channel-name') {
                      User = document.getElementsByClassName('style-scope ytd-video-owner-renderer')[i].children[0].children[0].children[0].children[0].href.split('channel/')[1];
                      // User = document.getElementsByClassName('style-scope ytd-video-owner-renderer')[i].children[0].href.split('channel/')[1];
                      UserName = document.getElementsByClassName('style-scope ytd-video-owner-renderer')[i].children[0].children[0].children[0].children[0].innerHTML
                      // UserName = document.getElementsByClassName('style-scope ytd-video-owner-renderer')[i].children[0].innerHTML;
                      break;
                    }
                  }

                  console.log('User', User, 'UserName', UserName)
                  if (User && UserName) {
                    setDonateToSpan(UserName);
                    // bittube.children[0].children[1].children[0].innerHTML = i18next.t('donate') + " <span id='ammountToDonate'></span> <span id='spanTube'></span> " + i18next.t('to') + " <span id='userToDonate' data-user='" + UserName + "'>" + UserName + '</span>'
                    bittube.setAttribute('data-videoid', videoId);
                    bittube.setAttribute('data-userid', User);
                    bittube.setAttribute('data-userinfo', UserName);
                    bittube.setAttribute('data-domaininfo', 'youtube.com');
                    bittube.style.display = 'block';
                  }
                };

                button.appendChild(string);
                render.appendChild(button);
                div.appendChild(render)
                elements[i].insertBefore(div, elements[i].children[1]);
              }
            }
          }
        }
      });
    }

  }

  // Dynamic position

}

// FIXME
function newUrlTwitch() {

  // var currentUserTwitch;
  // var twitchhasname = false;

  const url = window.location.href;

  if (url.indexOf('/videos') > -1) {
    // CALL FUNCTION TO CREATE MODAL;
    const bittube = createDonationModal('twitch');
    const rootElem = document.getElementById('root');
    if (document.body.contains(bittube)) {
      bittube.style.display = 'none'
    }

    if (rootElem) {
      rootElem.appendChild(bittube);
    } else {
      throw new Error('Failed to find root element!');
    }

    const element = document.getElementsByClassName('channel-header__right tw-align-items-center tw-flex tw-flex-nowrap tw-flex-shrink-0')[0];
    if (element) {
      if (element.dataset.bitTube == undefined) {
        element.dataset.bitTube = 'true';

        const text = document.createElement('p');
        text.className = 'tw-button__text';
        text.textContent = 'Donate TUBEs';

        const button = document.createElement('button');
        button.className = 'tw-interactive tube-donate tw-button';
        button.onclick = async function (e) {
          if (!eventIsTrusted(e)) return;
          if (e.target.tagName == "P") {
            const contentID = await getContentIDAsync();
            const ChannelName = contentID.userName;
            const channelID = contentID.userID;
            bittube.style.display = 'block';
            bittube.setAttribute('data-userid', channelID);
            bittube.setAttribute('data-userinfo', ChannelName);
            bittube.setAttribute('data-domaininfo', 'twitch.tv');
            setDonateToSpan(ChannelName);
            if (this) {
              if (!this.contains(bittube)) {
                this.appendChild(bittube);
              } else {
                calculateModalHeight()
              }
            }
            // bittube.querySelector('#spanTitleModal').innerHTML = i18next.t('donate') + " <span id='ammountToDonate'></span> <span id='spanTube'></span> " + i18next.t('to') + " <span id='userToDonate' data-user='" + ChannelName + "'>" + ChannelName + '</span>';
          }

        };
        button.appendChild(text);

        const div = document.createElement('div');
        div.className = 'tw-align-items-stretch tw-flex tw-mg-l-1';
        div.appendChild(button);

        element.insertBefore(div, element.children[0]);
      }
    }
  } else if (url.split('twitch.tv/')[1] != '' && url.indexOf('directory/') < 0) {
    const bittube = createDonationModal('twitch');
    if (document.body.contains(bittube)) {
      bittube.style.display = 'none'
    }
    if (document.getElementById('root') != null && document.getElementById('bittube-modal') == null) {
      document.getElementById('root').appendChild(bittube);
    }
    document.addEventListener('DOMNodeInserted', function (e) {
      let elemente2;
      if (document.getElementsByClassName('channel-header__right tw-align-items-center tw-flex tw-flex-nowrap tw-flex-shrink-0')[0] != undefined) {
        elemente2 = document.getElementsByClassName('channel-header__right tw-align-items-center tw-flex tw-flex-nowrap tw-flex-shrink-0')[0];
      } else {
        elemente2 = document.getElementsByClassName('channel-header__follow-btn-container tw-align-items-center tw-flex tw-full-height tw-overflow-hidden tw-pd-x-1')[0];
      }
      if (elemente2 != undefined) {
        if (elemente2.dataset.bitTube == undefined) {
          elemente2.dataset.bitTube = 'true';

          const text = document.createElement('p');
          text.className = 'tw-button__text';
          text.textContent = 'Donate TUBEs';

          const button = document.createElement('button');
          button.className = 'tw-interactive tube-donate tw-button';
          button.onclick = async function (e) {
            if (!eventIsTrusted(e)) return;
            if (e.target.tagName == "P") {
              const contentID = await getContentIDAsync();
              const ChannelName = contentID.userName;
              const channelID = contentID.userID;
              bittube.style.display = 'block';
              bittube.setAttribute('data-userinfo', ChannelName);
              bittube.setAttribute('data-userid', channelID);
              bittube.setAttribute('data-domaininfo', 'twitch.tv');
              setDonateToSpan(ChannelName);
              // bittube.querySelector('#spanTitleModal').innerHTML = i18next.t('donate') + " <span id='ammountToDonate'></span> <span id='spanTube'></span> " + i18next.t('to') + " <span id='userToDonate' data-user='" + ChannelName + "'>" + ChannelName + '</span>';
              if (this) {
                if (!this.contains(bittube)) {
                  this.appendChild(bittube);
                } else {
                  calculateModalHeight()
                }
              }
            }

          }
          button.appendChild(text);

          const div = document.createElement('div');
          div.className = 'tw-align-items-stretch tw-flex tw-mg-l-1';
          div.appendChild(button);

          elemente2.insertBefore(div, elemente2.children[0]);
        }
      }

    });

  }

}

// FIXME
function newUrlSoundcloud() {
  const bittube = createDonationModal('soundcloud');
  const appElem = document.getElementById('app');
  if (appElem) {
    if (!appElem.contains(bittube)) {
      appElem.appendChild(bittube);
    }
  } else {
    throw new Error('Could not find app element!');
  }

  if (!this.addedDomListener) {
    this.addedDomListener = true; // prevent adding same listener multiple times.

    document.addEventListener('DOMNodeInserted', function (e) {
      if (e.target.className) {
        if (e.target = 'div' || e.target.className == 'sc-list-nostyle sc-clearfix' || e.target.className == 'sc-visuallyhidden' || e.target.className == 'waveform__layer waveform__scene' || e.target.className == 'commentPopover__scrub' || e.target.className == 'soundTitle__titleContainer') {
          if (document.getElementsByClassName('sidebarModule g-all-transitions-200-linear relatedSoundsModule').length < 1) {
            const elemente3 = document.getElementsByClassName('sc-button-more sc-button sc-button-medium sc-button-icon sc-button-responsive');
            const elemente2 = document.getElementsByClassName('sc-button-like sc-button sc-button-small sc-button-responsive');
            for (i = 0; i < elemente2.length; i++) {
              if (elemente2[i].dataset.bitTube == undefined) {
                // Button donate on User list
                elemente2[i].dataset.bitTube = 'true';
                const button = document.createElement('button');
                button.innerText = 'Donate TUBEs';
                button.className = 'tube-donate sc-button sc-button-small sc-button-responsive';
                button.style.position = 'relative';
                button.onclick = function (e) {
                  if (!eventIsTrusted(e)) return;
                  if (e.target.tagName == "BUTTON") {

                    bittube.style.display = 'block';
                    let User;
                    let Title;
                    try {
                      User = this.parentElement.parentElement.parentElement.parentElement.parentElement.children[0].children[0].children[0].children[1].children[0].children[0].href.split('.com/')[1];
                      Title = this.parentElement.parentElement.parentElement.parentElement.parentElement.children[0].children[0].children[0].children[1].children[1].innerText;
                    } catch (e) {

                    }
                    if (User == undefined || User == 'groups') {
                      try {
                        User = this.parentElement.parentElement.parentElement.parentElement.parentElement.children[0].children[1].children[0].children[0].children[1].children[1].children[0].children[0].children[1].children[0].children[0].children[0].children[1].href.split('?')[0].split('.com/')[1].split('/')[0];
                      } catch (e) {}
                    }
                    if (User == undefined || User == 'groups') {
                      try {
                        User = this.parentElement.parentElement.children[1].children[0].href.split('.com/')[1];
                      } catch (e) {

                      }
                    }
                    if (User) {
                      console.log('user')
                      bittube.setAttribute('data-userinfo', User);
                      bittube.setAttribute('data-userid', User);
                      bittube.setAttribute('data-Title', Title);
                      setDonateToSpan(User);

                      // if(document.querySelectorAll("body")[0].contains(bittube)){
                      //   document.querySelectorAll("body")[0].removeChild(bittube)
                      // }
                      //sound__soundActions
                      this.parentElement.parentElement.parentElement.style.overflow = 'visible'
                      if (this) {
                        if (!this.contains(bittube)) {
                          this.appendChild(bittube);
                          calculateModalHeight()
                        } else {
                          calculateModalHeight()
                        }
                      }

                      // bittube.children[0].children[1].children[0].innerHTML = i18next.t('donate') + " <span id='ammountToDonate'></span> <span id='spanTube'></span> " + i18next.t('to') + " <span id='userToDonate' data-user='" + User + "'>" + User + '</span>'
                    } else {
                      if (this) {
                        if (!this.contains(bittube)) {
                          this.appendChild(bittube);
                          calculateModalHeight()
                        } else {
                          calculateModalHeight()

                        }
                      }
                    }
                  }

                }
                elemente2[i].parentElement.appendChild(button);
              }
            }

            if (elemente3[0]) {
              // Button donate on User
              if (elemente3[0].dataset.bitTube == undefined) {
                elemente3[0].dataset.bitTube = 'true';

                const button = document.createElement('button');
                button.innerText = 'Donate TUBEs';
                button.style.position = 'relative';
                button.className = 'tube-donate sc-button sc-button-small sc-button-responsive';
                button.style.height = '26px';
                button.onclick = function (e) {
                  if (!eventIsTrusted(e)) return;
                  if (e.target.tagName == "BUTTON") {
                    bittube.style.display = 'block';
                    const User = document.getElementsByClassName('profileHeaderInfo__userName g-type-shrinkwrap-block g-type-shrinkwrap-large-primary')[0].baseURI.split('.com/')[1]
                    if (User) {
                      bittube.setAttribute('data-userinfo', User);
                      bittube.setAttribute('data-userid', User);
                      setDonateToSpan(User);
                      // style.children[0].children[1].children[0].innerHTML = i18next.t('donate') + " <span id='ammountToDonate'></span> <span id='spanTube'></span> " + i18next.t('to') + " <span id='userToDonate' data-user='" + User + "'>" + User + '</span>'
                      // if(document.querySelectorAll("body")[0].contains(bittube)){
                      //   document.querySelectorAll("body")[0].removeChild(bittube)
                      // }
                      // if(document.querySelectorAll("body")[0].contains(bittube) && !this.contains(bittube)){
                      //   document.querySelectorAll("body")[0].removeChild(bittube)
                      // }
                      if (this) {
                        if (!this.contains(bittube)) {
                          this.appendChild(bittube);
                          calculateModalHeight()
                        } else {
                          calculateModalHeight()

                        }
                      } else {

                      }
                    }

                  }
                }
                elemente3[0].parentElement.insertBefore(button, elemente3[0].parentElement.children[0]);
              }
            }
          } else {
            const elemente2 = document.getElementsByClassName('sc-button-group sc-button-group-medium');
            if (elemente2[0].dataset.bitTube == undefined) {
              // On single music
              elemente2[0].dataset.bitTube = 'true';
              const button = document.createElement('button');
              button.innerText = 'Donate TUBEs';
              button.className = 'donate-tube sc-button sc-button-medium sc-button-responsive';
              button.style.position = 'relative';
              button.onclick = function (e) {
                if (!eventIsTrusted(e)) return;
                if (e.target.tagName == "BUTTON") {
                  let User;
                  let Title;
                  try {
                    User = document.getElementsByClassName('soundTitle__usernameHeroContainer')[0].children[0].href.split('.com/')[1];
                    Title = document.getElementsByClassName('soundTitle__title sc-font g-type-shrinkwrap-inline g-type-shrinkwrap-large-primary')[0].innerText;
                  } catch (e) {}
                  if (User == undefined || User == 'groups') {
                    try {
                      User = this.parentElement.parentElement.parentElement.parentElement.parentElement.children[0].children[1].children[0].children[0].children[1].children[1].children[0].children[0].children[1].children[0].children[0].children[0].children[1].href.split('?')[0].split('.com/')[1].split('/')[0];
                    } catch (e) {}
                  }
                  if (User) {
                    bittube.setAttribute('data-userinfo', User);
                    bittube.setAttribute('data-userid', User);
                    bittube.setAttribute('data-Title', Title);
                    setDonateToSpan(User);
                    // bittube.children[0].children[1].children[0].innerHTML = i18next.t('donate') + " <span id='ammountToDonate'></span> <span id='spanTube'></span> " + i18next.t('to') + " <span id='userToDonate' data-user='" + User + "'>" + User + '</span>'
                    bittube.style.display = 'block';
                    if (this) {
                      if (!this.contains(bittube)) {
                        this.appendChild(bittube);
                        calculateModalHeight()
                      } else {
                        calculateModalHeight()
                      }
                    }
                  }
                }

              }
              elemente2[0].appendChild(button);

            }
          }
        }
      }
    });
  }

}

function newUrlAmazon() {
  // FIXME - Nothing to do for amazon?
}

// FIXME
function newUrlBittubeapp() {
  if (checkBrowser() == 'firefox') {
    if (['https://bittubeapp.com/notify/index.html', 'https://bittubeapp.com/notify/', 'https://bittube.app/notify/index.html', 'https://bittube.app/notify/', 'https://pay.bittube.cash/notify/index.html', 'https://pay.bittube.cash/notify/'].indexOf(window.location.href) !== -1) {
      let timesRun = 0;
      const interval = setInterval(() => {
        timesRun += 1;
        if (timesRun === 100) {
          clearInterval(interval);
        }
        if (localStorage.getItem('channel') && localStorage.getItem('channel')) {
          chrome.runtime.sendMessage({
            message: 'channel',
            token: localStorage.getItem('channel')
          });
          clearInterval(interval);
        }
      }, 1000);
    } else {
      if (['https://bittubeapp.com/', 'https://bittubeapp.com', 'https://bittube.app/', 'https://bittube.app', 'https://pay.bittube.cash/', 'https://pay.bittube.cash'].indexOf(window.location.href) !== -1) {
        let timesRun = 0;
        const interval = setInterval(() => {
          timesRun += 1;
          if (timesRun === 100) {
            clearInterval(interval);
          }
          if (localStorage.getItem('referredbykey') && localStorage.getItem('referredbykey')) {
            chrome.runtime.sendMessage({
              message: 'setReferralKey',
              referredbykey: localStorage.getItem('referredbykey')
            });
            clearInterval(interval);
          }
        }, 1000);
      }
    }
  }
}

// function newUrlDefault() {
// Nothing to do for normal domains, contentID handles everything.
// }

function newUrlHandler(request) {
  setTranslations(request.lang, () => {
    const url = window.location.hostname;
    if (url.match(/twitter.[a-zA-Z]{1,3}$/) !== null) {
      // newUrlTwitter();
    } else if (url.match(/facebook.[a-zA-Z]{1,3}$/) !== null) {
      // newUrlFacebook();
    } else if (url.match(/youtube.[a-zA-Z]{1,3}$/) !== null) {
      // newUrlYoutube();
    } else if (url.match(/twitch.[a-zA-Z]{1,3}$/) !== null) {
      // newUrlTwitch();
    } else if (url.match(/soundcloud.[a-zA-Z]{1,3}$/) !== null) {
      // newUrlSoundcloud();
    } else if (url.match(/amazon.[a-zA-Z]{1,3}$/) !== null) {
      // newUrlAmazon();
    } else if (url.match(/bittubeapp.com$/) !== null) {
      // newUrlDefault();
      newUrlBittubeapp();
    }
    // else {
    //   newUrlDefault();
    // }
  });
}

// function newUrlHandler(request) {
//   setTranslations(request.lang, () => {
//     const url = window.location.href;
//     if (url.indexOf('twitter.com') > -1) {
//       newUrlTwitter();
//     } else if (url.indexOf('facebook.com') > 1) {
//       newUrlFacebook();
//     } else if (url.indexOf('youtube.com') != -1) {
//       newUrlYoutube();
//     } else if (url.indexOf('twitch.com') > -1) {
//       newUrlTwitch();
//     } else if (url.indexOf('soundcloud.com') > -1) {
//       newUrlSoundcloud();
//     } else if (url.indexOf('amazon.com') > -1) {
//       newUrlAmazon();
//     } else if (url.indexOf('bittubeapp.com') > -1) {
//       // newUrlDefault();
//       newUrlBittubeapp();
//     }
//     // else {
//     //   newUrlDefault();
//     // }
//   });
// }

window.addEventListener('click', function (event) {
  if (!eventIsTrusted(event)) return;
  if (event.target.classList[0] == 'BitTube-panelContainer') {
    document.getElementsByClassName('BitTube-panelContainer')[0].remove();
  }
});
// === New Url Handler End ===