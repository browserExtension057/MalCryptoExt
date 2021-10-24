mobiscroll.nav('#tabsDonate', {
  onItemTap: function (event, inst) {
    // getDomain(event.target.getAttribute('data-tab'));
    getInfoFromLocalStorage(event.target.getAttribute('data-tab'));
  }
});

document.addEventListener('DOMContentLoaded', () => {
  getInfoFromLocalStorage('onetime');
}, false);

function getInfoFromLocalStorage(where) {
  const platform = localStorage.getItem('platFormToDonate');
  const userName = localStorage.getItem('userNameToDonate');
  const userID = localStorage.getItem('userIDToDonate');
  const amount = localStorage.getItem('ammontToDonate');
  const isMonthly = (where !== 'onetime');
  setDonationInfo(platform, userName, userID, amount, isMonthly);
}

function setDonationInfo(platform, userName, userID, amount, isMonthly) {
  // console.log('setDonationInfo', platform, userName, userID, amount, isMonthly);
  const headerTitleElem = document.getElementById('headerTitle');
  headerTitleElem.setAttribute('data-platform', platform);
  headerTitleElem.setAttribute('data-userinfo', userName);
  if (isMonthly) {
    headerTitleElem.innerHTML = 'Current monthly donation for <span id="publisherName" id="bolder">' + userName + '</span> ';
  } else {
    headerTitleElem.innerHTML = i18next.t('donate') + ' ' + '<span class="bolder"><i class="icon-font-tube tubeFont"></i>' + amount + '</span> ' + i18next.t('to') + ' ' + ' <span class="bolder">' + userName + '</span>';
  }
}

// getDomain('onetime');

// function getDomain(where) {
//   console.log('getDomain', where);
//   getPageInfo((where !== 'onetime'));
// }

// function getPageInfo(isMonthy) {
//   chrome.tabs.query({
//     active: true,
//     currentWindow: true
//   }, function (tabs) {
//     console.log('getPageInfo Tab', tabs[0]);
//     chrome.tabs.sendMessage(tabs[0].id, {
//       message: 'getContentID'
//     }, function (response) {
//       if (response != undefined) {
//         const userName = response.userName || response.userID || response.domain;
//         const userID = response.userID || response.userName || response.domain;
//         console.log('getPageInfo Response', response);
//         setDonationInfo(response.platform, userName, userID, localStorage.getItem('ammontToDonate'), isMonthy);
//       }
//     });
//   })
// }