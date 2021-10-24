'use strict';

// MASTER PRODUCTION / DEV SWITCH!
const IS_PRODUCTION = true;

// !!! Please do not touch the below unless you are sure about it. Thank you. !!!

console.info('FIREBASE CONFIG -- IS_PRODUCTION:', IS_PRODUCTION);

// === CRITICAL FIREBASE SECTION START ===
var firebaseConfig;     // Config for firebase
var functionBaseURL;    // BaseURL for functions api calls
var airtimeBaseURL;     // URL for airtime ingress
let stakingBaseURL;     // URL for staking api calls

if (IS_PRODUCTION) {
  // PRODUCTION
  firebaseConfig = {
    apiKey: "AIzaSyAPp8UYTnlz28nfVColD3IXK2olX8Ztbag",
    authDomain: "bittube-airtime-extension.firebaseapp.com",
    databaseURL: "https://bittube-airtime-extension.firebaseio.com",
    projectId: "bittube-airtime-extension",
    storageBucket: "bittube-airtime-extension.appspot.com",
    messagingSenderId: "632275942486"
  };
  functionBaseURL = 'https://us-central1-bittube-airtime-extension.cloudfunctions.net';
  airtimeBaseURL = 'https://europe-west1-bittube-airtime.cloudfunctions.net';
  stakingBaseURL = 'https://staking.bittubeapp.com';
} else {
  // DEV / STAGING
  firebaseConfig = {
    apiKey: "AIzaSyD5qx8iykrMBzBbv5gzouc0jUvRcRFYRdI",
    authDomain: "bittube-airtime-extension-dev.firebaseapp.com",
    databaseURL: "https://bittube-airtime-extension-dev.firebaseio.com",
    projectId: "bittube-airtime-extension-dev",
    storageBucket: "bittube-airtime-extension-dev.appspot.com",
    messagingSenderId: "363666613461"
  };
  functionBaseURL = 'https://us-central1-bittube-airtime-extension-dev.cloudfunctions.net';
  airtimeBaseURL = 'https://europe-west1-bittube-airtime-staging.cloudfunctions.net';
  stakingBaseURL = 'http://localhost:8080'; // TODO: staging staking server
}

firebase.initializeApp(firebaseConfig);
// === CRITICAL FIREBASE SECTION END ===

// === Firebase Utils Start ===
const firebaseAuthReadyPromise = new Promise((resolve) => {
  const unlistenToAuthChanged = firebase.auth().onAuthStateChanged((user) => {
    unlistenToAuthChanged();
    resolve(user);
  });
});

/**
 * Returns the currently set Firebase Token, ensuring readiness.
 * @return {String} Current Firebase Token
 */
function getFirebaseToken() {
  return new Promise(async (resolve, reject) => {
    try {
      await firebaseAuthReadyPromise;
      if (firebase.auth().currentUser != null) {
        resolve(await firebase.auth().currentUser.getIdToken());
      } else {
        reject(new Error('No current user to get token for!'));
      }
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Returns the currently set Firebase Token Claims, ensuring readiness.
 * @return {Object} Current Firebase Token Claims
 */
const getFirebaseClaims = async () => {
  await firebaseAuthReadyPromise;
  return (await firebase.auth().currentUser.getIdTokenResult()).claims;
};

/**
 * Calls a url with firebaseToken, ensuring readiness.
 * @param {string} url The users Firebase UID.
 * @param {Object} postdata Object containing the new customClaims to set.
 * @return {Object} Returned JSON or String depending on responseType.
 */
const firebaseXhr = (url, postdata) => {
  return new Promise(async (resolve, reject) => {
    try {
      await firebaseAuthReadyPromise;
      const req = new XMLHttpRequest();
      req.onload = function() {
        try {
          if (req.status === 200) {
            if (req.getResponseHeader('Content-Type').indexOf('application/json') !== -1) {
              try {
                resolve(JSON.parse(req.response));
              } catch (err) {
                resolve(req.response);
              }
            } else {
              resolve(req.response);
            }
          } else {
            reject(new Error('xhrReq: Bad statusCode ' + req.status));
          }
        } catch (err) {
          reject(err);
        }
      };
      req.onerror = reject;
      req.open(postdata ? 'POST' : 'GET', url, true);
      req.setRequestHeader('Authorization', 'Bearer ' + await getFirebaseToken());
      postdata ? req.send(postdata) : req.send();
    } catch (err) {
      reject(err);
    }
  });
};

// Calls backend to update customClaims in token, gets new token if claims changed.
const updateCustomClaims = async () => {
  const data = await firebaseXhr(functionBaseURL + '/app/updateClaims');
  // console.log(data);
  if (data.updated) {
    console.log('updateCustomClaims - Claims Updated, getting new firebase token...');
    await firebase.auth().currentUser.getIdToken(true);
    console.log('updateCustomClaims - Got new token.');
  }
};

// Helper in case of corrupt values.
const getUpdateClaimsLast = () => {
  try {
    return new Date(parseInt(localStorage.getItem('updateClaimsLast') || '0') || 0);
  } catch (err) {
    return new Date(0);
  }
}

// Call updateClaims if enough time has passed since last time.
const updateClaimsEvery = 60000 * 60;
const updateClaimsIfTimePassed = async () => {
  try {
    const now = Date.now();
    const timeSince = now - getUpdateClaimsLast();
    // console.log('updateClaimsIfTimePassed', timeSince, updateClaimsEvery, timeSince > updateClaimsEvery);
    if (timeSince > updateClaimsEvery) {
      await updateCustomClaims(); // Check for claim update as soon as ready.
      localStorage.setItem('updateClaimsLast', Date.now().toString());
    }
  } catch (err) {
    console.warn('updateClaimsIfTimePassed Error - ', err);
  }
};
updateClaimsIfTimePassed();

// === Firebase Utils End ===

// If not in production, add something visible. Adds [DEV] to top right.
if (!IS_PRODUCTION) {
  try {
    document.addEventListener('DOMContentLoaded', () => { 
      try {
        if (!document.getElementById('firebaseconfig-devNotice')) {
          const devNoticeElem = document.createElement('div');
          devNoticeElem.id = 'firebaseconfig-devNotice';
          devNoticeElem.innerText = '[DEV]';
          devNoticeElem.style.position = 'absolute';
          devNoticeElem.style.top = '1px';
          devNoticeElem.style.right = '3px';
          devNoticeElem.style.color = 'blue';
          devNoticeElem.style['font-size'] = '17px';
          document.documentElement.appendChild(devNoticeElem);
        }

        // const footerLinkElem = document.getElementById('footerLink');
        // footerLinkElem.innerText += ' [DEV]';
      } catch (err) { }
    }, false);
  } catch (err) { }
}

const TOKEN_2FA_MAX_AGE = 60 * 60000;
const update2FAToken = async (code) => {
  if (!code || code.length !== 6) throw new Error('Please enter a valid code');
  const token = await firebase.auth().currentUser.getIdToken();
  const headers = {Authorization: `Bearer ${token}`, 'Content-Type': 'application/json'};
  const body = JSON.stringify({code});
  const resp = await fetch(functionBaseURL + '/app/login2FA', {method: 'POST', headers, body});
  if (!resp.ok) throw new Error(`API call failed with HTTP CODE ${resp.status}`);
  const json = await resp.json();
  if (!json.success) throw new Error(json.error);
  const time = Date.now();
  await firebase.auth().signInWithCustomToken(json.token);
  localStorage.setItem('Token2FAUpdated', time);
  return time;
}