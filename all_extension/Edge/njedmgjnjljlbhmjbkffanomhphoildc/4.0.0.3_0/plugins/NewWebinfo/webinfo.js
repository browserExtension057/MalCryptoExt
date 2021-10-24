document.addEventListener('DOMContentLoaded', () => {
  getDomain();
}, false);

function getDomain() {
  // console.log('getDomain');
  // setButtonsDisabled(true); // Make sure the user cannot push the donate buttons before we get the wallet in localStorage.
  if (typeof (browser) != 'undefined') {
    browser.tabs.query({
      active: true,
      currentWindow: true
    }, function (tabs) {
      getForUrl(tabs[0].url);
    });
  } else {
    if (chrome != undefined) {
      chrome.tabs.getSelected(null, function (tab) {
        getForUrl(tab.url);
      });
    }
    // else {
    //   getDomain(); // ???
    // }
  }
}

function getForUrl(url) {
  // console.log('getForUrl', url);
  if (checkProtocolUrl(url)) {
    getPageInfo();
  }
}

function hideDonationElems() {
  localStorage.removeItem('walletToDonate');
  localStorage.removeItem('ammontToDonate');
  localStorage.removeItem('userNameToDonate');
  localStorage.removeItem('userIDToDonate');
  // localStorage.removeItem('userToDonate'); // Ensure compliance with old stuff?
  localStorage.removeItem('platFormToDonate');

  const sectionDonate = document.getElementsByClassName('donateSection');
  for (let i = 0; i < sectionDonate.length; i++) {
    sectionDonate[i].classList.add('displayNone');
  }

  const infoAirtimeBottom = document.getElementsByClassName('infoAirtimeBottom');
  for (let i = 0; i < infoAirtimeBottom.length; i++) {
    infoAirtimeBottom[i].classList.add('marginBottom10');
  }
}

function checkProtocolUrl(url) {
  const url_string = new URL(url);
  if (url_string.protocol != 'http:' && url_string.protocol != 'https:') {
    hideDonationElems();
    return false;
  }
  return true;
}

// function setButtonsDisabled(setTo) {
//   console.log('setButtonsDisabled', setTo);
//   const donate = document.getElementById('donate');
//   const donate1 = document.getElementById('donate1');
//   const donate2 = document.getElementById('donate2');
//   const donate5 = document.getElementById('donate5');
//   const donate10 = document.getElementById('donate10');
//   if (setTo) {
//     donate.style.cursor = 'not-allowed';
//     donate.setAttribute('disabled', true);
//     donate1.setAttribute('disabled', true);
//     donate2.setAttribute('disabled', true);
//     donate5.setAttribute('disabled', true);
//     donate10.setAttribute('disabled', true);
//   } else {
//     donate.style.cursor = 'pointer';
//     donate.removeAttribute('disabled');
//     donate1.removeAttribute('disabled');
//     donate2.removeAttribute('disabled');
//     donate5.removeAttribute('disabled');
//     donate10.removeAttribute('disabled');
//   }
// }

// function gotWallet(responsegetWallet) {
//   console.log('getPageInfo responsegetWallet', responsegetWallet);
//   localStorage.setItem('walletToDonate', responsegetWallet.wallet);
//   setButtonsDisabled(false); // Stop preventing donation, we got the wallet.
// }

// if (checkBrowser() === 'firefox') {
//   browser.runtime.onMessage.addListener((request, sender, response) =>{
//     console.log(request);
//   });
// }

function getPageInfo() {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    console.log('getPageInfo Tab', tabs[0]);
    chrome.tabs.sendMessage(tabs[0].id, {
      message: 'getContentID'
    }, function (response) {
      if (response != undefined) {
        console.log('getPageInfo Response', response);

        if (response.platform == 'domain' && response.domain.indexOf('.invalid.tld') !== -1) return hideDonationElems();

        const userName = response.userName || response.userID || response.domain;
        const userID = response.userID || response.userName || response.domain;

        // Save relevant info for webinfodonation.js in localstorage so we dont have to ask again, like we already do with the wallet.
        localStorage.setItem('userNameToDonate', userName);
        localStorage.setItem('userIDToDonate', userID);
        // localStorage.setItem('userToDonate', userID); // Ensure compliance with old stuff?
        localStorage.setItem('platFormToDonate', response.platform);

        document.getElementById('spanPublisherName').innerHTML = userName;
        // if (checkBrowser() === 'firefox') {
        //   browser.runtime.sendMessage({
        //     message: "getWallet",
        //     username: userName,
        //     userID: userID,
        //     domain: response.platform
        //   });
        // } else {
          chrome.runtime.sendMessage({
            message: "getWallet",
            username: userName,
            userID: userID,
            domain: response.platform
          });
          // }, gotWallet);
        // }
      } else {
        hideDonationElems();
      }
    });
  });
}