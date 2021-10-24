// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

// === Register Plaform Start ===
const registerPlatformCall = (platformName) => {
  return new Promise(async (resolve, reject) => {
    const url = functionBaseURL + '/app/registerPlatform?platformName=' + encodeURIComponent(platformName);
    const req = new XMLHttpRequest();
    req.onload = function() {
      try {
        const response = JSON.parse(req.response);
        resolve(response);
      } catch (err) {
        reject(err);
      }
    }
    req.onerror = reject;
    req.open('GET', url, true);
    req.setRequestHeader('Authorization', 'Bearer ' + await getFirebaseToken());
    req.send();
  });
};

const showRegisterPlatformIfAllowed = async () => {
  try {
    setRegisterPlatformListeners();
  } catch (err) {
    console.warn('showRegisterPlatformIfAllowed Error:', err);
  }
};

const setRegisterPlatformListeners = () => {
  const regPlatformElem = document.getElementById('registerPlatformTabBtn');
  regPlatformElem.classList.remove('displayNone');

  const registerPlatformNameElem = document.getElementById('registerPlatformName');
  const registerPlatformConfirmElem = document.getElementById('registerPlatformConfirm');
  const registerPlatformOutputElem = document.getElementById('registerPlatformOutput');

  const registerPlatformSuccessElem = document.getElementById('registerPlatformSuccess');
  const registerPlatformErrorElem = document.getElementById('registerPlatformError');
  const registerPlatformErrorCreatorMismatchElem = document.getElementById('registerPlatformErrorCreatorMismatch');
  const registerPlatformEmailSentElem = document.getElementById('registerPlatformEmailSent');
  const registerPlatformEmailNotSentElem = document.getElementById('registerPlatformEmailNotSent');
  const registerPlatformCreatedElem = document.getElementById('registerPlatformCreated');
  const registerPlatformExistedElem = document.getElementById('registerPlatformExisted');
  const registerPlatformErrorUnspecifiedElem = document.getElementById('registerPlatformErrorUnspecified');

  registerPlatformConfirmElem.addEventListener('click', async () => {
    showHideButtonLoader('registerPlatformConfirm', 'showLoader')
    // Hide output elements
    registerPlatformOutputElem.classList.add('displayNone');
    registerPlatformSuccessElem.classList.add('displayNone');
    registerPlatformErrorElem.classList.add('displayNone');
    registerPlatformErrorCreatorMismatchElem.classList.add('displayNone');
    registerPlatformEmailSentElem.classList.add('displayNone');
    registerPlatformEmailNotSentElem.classList.add('displayNone');
    registerPlatformCreatedElem.classList.add('displayNone');
    registerPlatformExistedElem.classList.add('displayNone');
    registerPlatformErrorUnspecifiedElem.classList.add('displayNone');

    const platformName = registerPlatformNameElem.value;
    console.log('registerPlatformConfirmElem Click', platformName);
    if (platformName.length) {
      try {
        const result = await registerPlatformCall(platformName);
        console.log('registerPlatformConfirmElem Click Result:', result);
        // registerPlatformOutputElem.innerText = JSON.stringify(result, null, 2);
        if (result.success) {
          const url = `https://bittubeapp.com/platformRegistered.html?platformName=${encodeURIComponent(platformName)}&platformUUID=${result.uuid}`;
          chrome.tabs.create({url});
          /*
          // Call succeeded
          registerPlatformSuccessElem.classList.remove('displayNone');
          registerPlatformOutputElem.innerText = JSON.stringify({ platformName: platformName, uuid: result.uuid, apiSecret: result.apiSecret }, null, 2);
          registerPlatformOutputElem.classList.remove('displayNone');
          if (result.created) {
            // Platform was newly created, new info was returned
            registerPlatformCreatedElem.classList.remove('displayNone');
            if (result.emailSent) {
              // email was sent
              registerPlatformEmailSentElem.classList.remove('displayNone');
            } else {
              // error sending email
              registerPlatformEmailNotSentElem.classList.remove('displayNone');
            }
          } else {
            // Platform exists, and you are the creator, existing info was returned
            registerPlatformExistedElem.classList.remove('displayNone');
          }
          */
        } else {
          // Call Failed
          registerPlatformErrorElem.classList.remove('displayNone');
          if (result.creatorMismatchError) {
            // Platform exists, and you are not the creator
            registerPlatformErrorCreatorMismatchElem.classList.remove('displayNone');
          } else {
            // Something bad happened.
            registerPlatformErrorUnspecifiedElem.classList.remove('displayNone');
          }
        }
        showHideButtonLoader('registerPlatformConfirm', 'hideLoader')
      } catch (err) {
        console.warn('registerPlatformConfirmElem Click Error:', err);
        // registerPlatformOutputElem.innerText = err.toString();
        registerPlatformErrorUnspecifiedElem.classList.remove('displayNone');
      }
    }
  });
};
// === Register Plaform End ===

document.addEventListener('DOMContentLoaded', function() {
  showRegisterPlatformIfAllowed();

  const buttonCancelVerify = document.getElementById('buttonCancelVerify');
  const buttonVerifyAccount = document.querySelector('#linkAccount');
  const inputVerifyUserName = buttonVerifyAccount.parentElement.querySelector(".platformInput input");
  const buttonLinkAccount = document.getElementById('buttonLinkAccount');
  let errors = [];
  let elementsWithErrors= [];
  function linkCheck(e){

    // TODO VERIFY ACCOUNT
    e.preventDefault();
    e.stopPropagation();
    let accountToVerify
    if ( inputVerifyUserName.value != '' ){
      if(inputVerifyUserName.value.indexOf('facebook')!=-1){
        accountToVerify="facebook";
      }
      else if(inputVerifyUserName.value.indexOf('twitter')!=-1){
        accountToVerify="twitter";
      }
      else if(inputVerifyUserName.value.indexOf('soundcloud')!=-1){
        accountToVerify="soundcloud";
      }
      else if(inputVerifyUserName.value.indexOf('youtube')!=-1){
        accountToVerify="youtube";
      }
      else if(inputVerifyUserName.value.indexOf('twitch')!=-1){
        accountToVerify="twitch";
      }
      else {
        accountToVerify="domain"

        if(inputVerifyUserName.value.indexOf('https://') == -1 && inputVerifyUserName.value.indexOf('http://') == -1 ){
            errors = [i18next.t('pleaseProtocolDomain')];
            elementsWithErrors = ['platformWeb'];
            setErrors(errors, elementsWithErrors);
            return;
          }
      }
      verifyAccount(accountToVerify,inputVerifyUserName);
    }else{
        errors = [i18next.t('fieldRequired')];
        elementsWithErrors = ['platformWeb'];
        setErrors(errors, elementsWithErrors);
        return;
    }

  }

  if (buttonLinkAccount != null){
    buttonLinkAccount.addEventListener("click",function(e){
      removeErrors(inputVerifyUserName)
      linkCheck(e)
    })
  }
  if (buttonCancelVerify != null){
    buttonCancelVerify.addEventListener('click', function(e){
      document.getElementById('platformOptions').classList.remove('displayNone');
      document.getElementById('verifyAccountDiv').classList.add('displayNone');
      document.getElementById('buttonVerifyAccount').setAttribute('data-platform', '');
    });
  }

  if ( inputVerifyUserName != null ){
    inputVerifyUserName.addEventListener('focus', function(e){
      removeErrors(this);
    });
    inputVerifyUserName.addEventListener('keydown', function(e){
      if (e.keyCode == 13){
        buttonLinkAccount.click();
      }
    })
  }

  mobiscroll.nav('#tabsLinkAccount', {
    theme: 'ios',
    type: 'tab',
    cssClass: 'divTabsPublisher',
    onItemTap: function (event, inst) {
      document.querySelector('.md-apps-tab-sel').classList.remove('md-apps-tab-sel');
      document.querySelector('#apps-tab-' + event.target.getAttribute('data-tab')).classList.add('md-apps-tab-sel');
      document.getElementById('chartContainer').style.opacity = "0"
      document.getElementById('chartContainer').style.visibility = "hidden";
      document.getElementById('divStatsModule').classList.add('displayNone');
      document.getElementById('moduleName').innerText = '';
      document.getElementById('imageStatsModule').src = '';
      if (event.target.getAttribute('data-tab') == 'linkedaccounts'){
        getUserLinkedAccounts();
        document.getElementById("apps-tab-linkedaccounts").style.animation="panelRight 0.4s ease"
        if (document.getElementById('inputVerifyUserName') != null) {
          removeErrors(document.getElementById('inputVerifyUserName'));
        }

      } else if (event.target.getAttribute('data-tab') == 'newaccount') {
        document.getElementById("apps-tab-newaccount").style.animation="panelLeft 0.4s ease"
      }
    }
  });

  const closeStatsModule = document.getElementById('closeStatsModule');
  if ( closeStatsModule != null ){
    closeStatsModule.addEventListener('click', function(e){
      e.preventDefault();
      e.stopPropagation();
      document.getElementById('chartContainer').style.opacity = "0"
      document.getElementById('chartContainer').style.visibility = "hidden";
      document.getElementById('divStatsModule').classList.add('displayNone');
      document.getElementById('statsModule').classList.add('displayNone');
      document.getElementById('moduleName').innerText = '';
      document.getElementById('imageStatsModule').src = '';
      document.getElementById('divLinkedAccounts').classList.remove('displayNone');
    })
  }

  /*************************************************************/
  /************       END ADD EVENT LISTENERS       ************/
  /*************************************************************/


  /*************************************************************/
  /************             FUNCTIONS               ************/
  /*************************************************************/

  function verifyAccount(accountToVerify,inputToVerify){
    let url;

    let from = 'verifyAccount';
    let channelId;
    switch(accountToVerify){
      case 'facebook':
      case 'youtube':
      case 'twitter':
      {
        let channelId;
        if (inputToVerify.value.indexOf('?') > -1 && accountToVerify != 'facebook' ){
          channelId = inputToVerify.value.split('?')[0];
        }else{
          channelId = inputToVerify.value;
        }
        url = functionBaseURL + '/app/linkAccount?channelId=' + channelId + '&platform=' + accountToVerify;
        userDataRequest(url, from, accountToVerify);
      }
      break;

      case 'twitch':
      case 'soundcloud':
      case 'domain':
        // channelId = document.getElementById('inputVerifyUserName').value;
        channelId = inputToVerify.value;
        url = functionBaseURL + '/app/linkAccount?channelId=' + channelId + '&platform=' + accountToVerify;
        // url = 'http://localhost:5001/bittube-airtime-extension/us-central1/app/linkAccount?channelId=' + channelId + '&platform=' + accountToVerify;
        userDataRequest(url, from, accountToVerify);
      break;
    }
  }
  // Input placeholder
  const allPlat = document.querySelector('.platformInput input').placeholder="https://"


  /*************************************************************/
  /************           END FUNCTIONS             ************/
  /*************************************************************/

});