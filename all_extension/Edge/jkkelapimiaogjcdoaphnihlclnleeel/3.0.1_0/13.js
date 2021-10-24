(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[13],{

/***/ 273:
/***/ (function(module) {

module.exports = {"author":"SAASPASS, 44 Tehama Street, San Francisco, CA 94105","contributors":[],"dependencies":{"axios":"^0.18.0","bootstrap":"^3.3.7","lodash":"^4.17.11","qr-image":"^3.2.0","qs":"^6.5.2","react":"^16.6.3","react-dom":"^16.6.3","react-router-dom":"^4.3.1","rxjs":"^6.3.3","stompjs":"^2.3.3","uuid":"^3.3.2","webextension-polyfill":"^0.3.1"},"description":"SAASPASS is a free password manager & authenticator 2FA code generator with autofill & autologin capabilities. It is built with security and usability in mind. With the browser extension SAASPASS can autofill both your passwords and authenticator codes. The browser extension is secured with extremely usable passwordless MFA. There is no need for a desktop application with the SAASPASS add-on.","devDependencies":{"@babel/core":"^7.1.6","@babel/plugin-syntax-dynamic-import":"^7.0.0","@babel/preset-env":"^7.1.6","@babel/preset-react":"^7.0.0","babel-loader":"^8.0.4","babel-plugin-transform-remove-console":"^6.9.4","copy-webpack-plugin":"^4.6.0","css-loader":"^1.0.1","file-loader":"^2.0.0","generate-json-webpack-plugin":"^0.3.1","html-webpack-plugin":"^3.2.0","husky":"^1.1.4","imports-loader":"^0.8.0","lint-staged":"^8.0.4","mini-css-extract-plugin":"^0.4.4","prettier":"^1.15.2","style-loader":"^0.23.1","webpack":"^4.25.1","webpack-cli":"^3.1.2"},"engines":{"node":"10","npm":"6"},"homepage":"https://saaspass.com/","keywords":[],"licenses":[],"name":"app","private":true,"scripts":{"build":"npm run build:pd:public","build:pd:public":"webpack --config=./config/webpack-production.config.js --env.api=pd --env.target=public","build:pd:public:chrome":"webpack --config=./config/webpack-production.config.js --env.api=pd --env.target=public --env.browser=chrome","build:pd:qa":"webpack --config=./config/webpack-production.config.js --env.api=pd --env.target=qa","build:pd:qa:chrome":"webpack --config=./config/webpack-production.config.js --env.api=pd --env.target=qa --env.browser=chrome","build:st:qa":"webpack --config=./config/webpack-production.config.js --env.api=st --env.target=qa","build:st:qa:chrome":"webpack --config=./config/webpack-production.config.js --env.api=st --env.target=qa --env.browser=chrome","start":"npm run start:pd","start:pc":"webpack --config=./config/webpack-development.config.js --env.api=pc","start:pc:chrome":"webpack --config=./config/webpack-development.config.js --env.api=pc --env.browser=chrome","start:pd":"webpack --config=./config/webpack-development.config.js --env.api=pd","start:pd:chrome":"webpack --config=./config/webpack-development.config.js --env.api=pd --env.browser=chrome","start:st":"webpack --config=./config/webpack-development.config.js --env.api=st","start:st:chrome":"webpack --config=./config/webpack-development.config.js --env.api=st --env.browser=chrome","test":"echo \"Error: no test specified\" && exit 1"},"version":"3.0.1"};

/***/ }),

/***/ 283:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "generateTrackerForAppAccount", function() { return generateTrackerForAppAccount; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "generateTrackerForPortal", function() { return generateTrackerForPortal; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "checkTrackerForPublicUserAccount", function() { return checkTrackerForPublicUserAccount; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "checkTrackerForSharedAccount", function() { return checkTrackerForSharedAccount; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getUserExtensionData", function() { return getUserExtensionData; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getSsoInstructions", function() { return getSsoInstructions; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getSsoInstructionsForSharedItem", function() { return getSsoInstructionsForSharedItem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getSsoInstructionsForEpmAccount", function() { return getSsoInstructionsForEpmAccount; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getPublicUserCredentialsForEpmAccount", function() { return getPublicUserCredentialsForEpmAccount; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addLoginItem", function() { return addLoginItem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getPublicUserAccountCredentials", function() { return getPublicUserAccountCredentials; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getCorporateServiceAccountCredentials", function() { return getCorporateServiceAccountCredentials; });
/* harmony import */ var _package_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(273);
var _package_json__WEBPACK_IMPORTED_MODULE_0___namespace = /*#__PURE__*/__webpack_require__.t(273, 1);
/* harmony import */ var _axios_createInstance__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(284);
/* harmony import */ var _axios_refreshTokenMiddleware__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(313);
/* harmony import */ var _cryptography__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(321);
/* harmony import */ var _store__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(3);





const axios = Object(_axios_createInstance__WEBPACK_IMPORTED_MODULE_1__["default"])(_axios_refreshTokenMiddleware__WEBPACK_IMPORTED_MODULE_2__["default"]); // todo: remove .0 after version parsing in backend is fixed

const headerVersion = () => ({
  'extension-version': `${_package_json__WEBPACK_IMPORTED_MODULE_0__["version"]}.0`
});

const headerAuth = () => ({
  Authorization: `Bearer ${_store__WEBPACK_IMPORTED_MODULE_4__["store"].access_token}`
});

const generateTrackerForAppAccount = async (accId, appId) => {
  const url = `app/rest/extension/tracker/${accId}/${appId}`;
  const headers = { ...headerAuth(),
    ...headerVersion()
  };
  const response = await axios.get(url, {
    headers
  });
  return response.data;
};
const generateTrackerForPortal = async () => {
  const url = `app/rest/extension/tracker_web`;
  const headers = { ...headerAuth(),
    ...headerVersion()
  };
  const response = await axios.get(url, {
    headers
  });
  return response.data;
};
const checkTrackerForPublicUserAccount = async tracker => {
  const url = `app/rest/extension/trackercheck`;
  const {
    publicKey,
    privateKey
  } = await Object(_cryptography__WEBPACK_IMPORTED_MODULE_3__["generateKey"])();
  const body = {
    tracker,
    key: publicKey
  };
  const headers = { ...headerVersion()
  };
  const response = await axios.post(url, body, {
    headers
  });
  const {
    data,
    iv,
    key
  } = response.data;
  const serverKey = await Object(_cryptography__WEBPACK_IMPORTED_MODULE_3__["getServerPublicKey"])(key, privateKey);
  return await Object(_cryptography__WEBPACK_IMPORTED_MODULE_3__["decryptMethod"])(data, iv, serverKey);
};
const checkTrackerForSharedAccount = async tracker => {
  const url = `app/rest/extension/trackercheckshared`;
  const {
    publicKey,
    privateKey
  } = await Object(_cryptography__WEBPACK_IMPORTED_MODULE_3__["generateKey"])();
  const body = {
    tracker,
    key: publicKey
  };
  const headers = { ...headerVersion()
  };
  const response = await axios.post(url, body, {
    headers
  });
  const {
    data,
    iv,
    key
  } = response.data;
  const serverKey = await Object(_cryptography__WEBPACK_IMPORTED_MODULE_3__["getServerPublicKey"])(key, privateKey);
  return await Object(_cryptography__WEBPACK_IMPORTED_MODULE_3__["decryptMethod"])(data, iv, serverKey);
};
const getUserExtensionData = async () => {
  const url = `app/rest/extension/useraccounts`;
  const headers = { ...headerAuth(),
    ...headerVersion()
  };
  const response = await axios.get(url, {
    headers
  });
  return response.data;
};
const getSsoInstructions = async id => {
  const url = `app/rest/extension/sso_instructions/${id}`;
  const headers = { ...headerAuth(),
    ...headerVersion()
  };
  const response = await axios.get(url, {
    headers
  });
  const {
    data,
    iv
  } = response.data;
  return await Object(_cryptography__WEBPACK_IMPORTED_MODULE_3__["decrypt"])(data, iv);
};
const getSsoInstructionsForSharedItem = async id => {
  const url = `app/rest/extension/shared_sso_instructions/${id}`;
  const headers = { ...headerAuth(),
    ...headerVersion()
  };
  const response = await axios.get(url, {
    headers
  });
  const {
    data,
    iv
  } = response.data;
  return await Object(_cryptography__WEBPACK_IMPORTED_MODULE_3__["decrypt"])(data, iv);
};
const getSsoInstructionsForEpmAccount = async (appId, accId) => {
  const url = `app/rest/extension/epm_sso_instructions/${appId}/${accId}`;
  const headers = { ...headerAuth(),
    ...headerVersion()
  };
  const response = await axios.get(url, {
    headers
  });
  const {
    data,
    iv
  } = response.data;
  return await Object(_cryptography__WEBPACK_IMPORTED_MODULE_3__["decrypt"])(data, iv);
};
const getPublicUserCredentialsForEpmAccount = async (appId, accId) => {
  const url = `app/rest/extension/epm_credentials/${appId}/${accId}`;
  const headers = { ...headerAuth(),
    ...headerVersion()
  };
  const response = await axios.get(url, {
    headers
  });
  const {
    data,
    iv
  } = response.data;
  return await Object(_cryptography__WEBPACK_IMPORTED_MODULE_3__["decrypt"])(data, iv);
};
const addLoginItem = async (serviceUrl, username, password) => {
  console.debug('addLoginItem', {
    serviceUrl,
    username,
    password
  });
  const url = `app/rest/extension/addloginitem`;
  const loginItemAccountDTO = {
    serviceUrl,
    username,
    password
  };
  const data = await Object(_cryptography__WEBPACK_IMPORTED_MODULE_3__["encrypt"])(JSON.stringify(loginItemAccountDTO));
  const headers = { ...headerAuth(),
    ...headerVersion()
  };
  const response = await axios.post(url, data, {
    headers
  });
  return response.data;
};
const getPublicUserAccountCredentials = async (id, type) => {
  const url = `app/rest/extension/credentials/${id}/${type}`;
  const headers = { ...headerAuth(),
    ...headerVersion()
  };
  const response = await axios.get(url, {
    headers
  });
  const {
    data,
    iv
  } = response.data;
  return await Object(_cryptography__WEBPACK_IMPORTED_MODULE_3__["decrypt"])(data, iv);
};
const getCorporateServiceAccountCredentials = async (id, type) => {
  const url = `app/rest/extension/shared_credentials/${id}/${type}`;
  const headers = { ...headerAuth(),
    ...headerVersion()
  };
  const response = await axios.get(url, {
    headers
  });
  const {
    data,
    iv
  } = response.data;
  return await Object(_cryptography__WEBPACK_IMPORTED_MODULE_3__["decrypt"])(data, iv);
};

/***/ }),

/***/ 284:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(api) {/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(285);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _isLoadingMiddleware__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(312);



const createInstance = (...middlewares) => {
  const instance = axios__WEBPACK_IMPORTED_MODULE_0___default.a.create({
    baseURL: api.baseURL
  });
  Object(_isLoadingMiddleware__WEBPACK_IMPORTED_MODULE_1__["default"])(instance);
  middlewares.forEach(middleware => middleware(instance));
  return instance;
};

/* harmony default export */ __webpack_exports__["default"] = (createInstance);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(105)))

/***/ }),

/***/ 312:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);

let activeRequests = 0;

const notify = type => {
  activeRequests += type === 'request-start' ? 1 : -1;

  if ([0, 1].includes(activeRequests)) {
    Object(_store__WEBPACK_IMPORTED_MODULE_0__["publish"])({
      activeRequests
    });
  }
};

const requestFulfilled = config => {
  notify('request-start', config);
  return config;
};

const requestRejected = error => {
  notify('request-error', error);
  return Promise.reject(error);
};

const responseFulfilled = response => {
  notify('response-success', response);
  return response;
};

const responseRejected = error => {
  notify('response-error', error);
  return Promise.reject(error);
};

const isLoadingMiddleware = instance => {
  instance.interceptors.request.use(requestFulfilled, requestRejected);
  instance.interceptors.response.use(responseFulfilled, responseRejected);
};

/* harmony default export */ __webpack_exports__["default"] = (isLoadingMiddleware);

/***/ }),

/***/ 313:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _auth_extensionLogout__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(314);
/* harmony import */ var _auth_refreshAccessToken__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(316);



const isTokenError = error => ['invalid_grant', 'invalid_token'].includes(error.response.data.error);

const refreshAccessTokenInterceptor = instance => async error => {
  if (!isTokenError(error)) {
    return Promise.reject(error);
  }

  try {
    const access_token = await Object(_auth_refreshAccessToken__WEBPACK_IMPORTED_MODULE_1__["default"])();
    error.config.headers.Authorization = `Bearer ${access_token}`;
    return instance.request(error.config);
  } catch (error) {
    if (isTokenError(error)) {
      Object(_auth_extensionLogout__WEBPACK_IMPORTED_MODULE_0__["default"])();
    }

    throw error;
  }
};

const refreshTokenMiddleware = instance => {
  instance.interceptors.response.use(null, refreshAccessTokenInterceptor(instance));
};

/* harmony default export */ __webpack_exports__["default"] = (refreshTokenMiddleware);

/***/ }),

/***/ 314:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _rest_logout__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(315);
/* harmony import */ var _store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);



const extensionLogout = () => {
  Object(_rest_logout__WEBPACK_IMPORTED_MODULE_0__["logout"])();
  Object(_store__WEBPACK_IMPORTED_MODULE_1__["clear"])();
};

/* harmony default export */ __webpack_exports__["default"] = (extensionLogout);

/***/ }),

/***/ 315:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "logout", function() { return logout; });
/* harmony import */ var _axios_createInstance__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(284);
/* harmony import */ var _store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);


const axios = Object(_axios_createInstance__WEBPACK_IMPORTED_MODULE_0__["default"])(); // org.springframework.security.web.authentication.logout.LogoutSuccessHandler#onLogoutSuccess

const logout = async () => {
  const url = `app/logout`;
  const headers = {
    Authorization: `Bearer ${_store__WEBPACK_IMPORTED_MODULE_1__["store"].access_token}`
  };
  const response = await axios.get(url, {
    headers
  });
  return response.data;
};

/***/ }),

/***/ 316:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _rest_TokenEndpoint__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(317);
/* harmony import */ var _store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);


let promise;

const load = async () => {
  const data = await Object(_rest_TokenEndpoint__WEBPACK_IMPORTED_MODULE_0__["refreshAccessToken"])(_store__WEBPACK_IMPORTED_MODULE_1__["store"].refresh_token);
  const {
    access_token,
    refresh_token
  } = data;
  Object(_store__WEBPACK_IMPORTED_MODULE_1__["publish"])({
    access_token,
    refresh_token
  });
  return access_token;
};

/* harmony default export */ __webpack_exports__["default"] = (async () => {
  try {
    return await (promise || (promise = load()));
  } finally {
    promise = null;
  }
});

/***/ }),

/***/ 317:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getAccessToken", function() { return getAccessToken; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "refreshAccessToken", function() { return refreshAccessToken; });
/* harmony import */ var qs_lib_stringify__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(318);
/* harmony import */ var qs_lib_stringify__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(qs_lib_stringify__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _axios_createInstance__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(284);


const axios = Object(_axios_createInstance__WEBPACK_IMPORTED_MODULE_1__["default"])(); // org.springframework.security.oauth2.provider.endpoint.TokenEndpoint#postAccessToken

const postAccessToken = async params => {
  const auth = {
    username: 'SaasPassExtension',
    password: 'spExtensionSecSP'
  };
  const response = await axios.post(`oauth/token`, qs_lib_stringify__WEBPACK_IMPORTED_MODULE_0___default()(params), {
    auth
  });
  return response.data;
};

const getAccessToken = (username, password, extension_public_key) => postAccessToken({
  username,
  password,
  extension_public_key,
  user_agent: navigator.userAgent,
  client_id: 'SaasPassExtension',
  client_secret: 'spExtensionSecSP',
  grant_type: 'password',
  scope: 'extension'
});
const refreshAccessToken = refresh_token => postAccessToken({
  refresh_token,
  grant_type: 'refresh_token'
});

/***/ }),

/***/ 321:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "generateKey", function() { return generateKey; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getServerPublicKey", function() { return getServerPublicKey; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "decrypt", function() { return decrypt; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "encrypt", function() { return encrypt; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "decryptMethod", function() { return decryptMethod; });
/* harmony import */ var _store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);

function generateKey() {
  return new Promise(resolve => {
    // https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/generateKey
    window.crypto.subtle.generateKey({
      name: 'ECDH',
      namedCurve: 'P-256' // can be 'P-256', 'P-384', or 'P-521'

    }, true, // whether the key is extractable (i.e. can be used in exportKey)
    ['deriveKey', 'deriveBits'] // can be any combination of 'deriveKey' and 'deriveBits'
    ).then(cryptoKey => {
      // result is a Promise that returns the generated key as a CryptoKey or a CryptoKeyPair.
      exportKey(cryptoKey.privateKey).then(privkey => {
        exportKey(cryptoKey.publicKey).then(pubkey => {
          resolve({
            privateKey: privkey,
            publicKey: pubkey
          });
        });
      });
    });
  });
}
function getServerPublicKey(serverPublickey, clientPrivatekey) {
  return new Promise(resolve => {
    let key = JSON.parse(serverPublickey);
    window.crypto.subtle.importKey('jwk', // can be 'jwk' (public or private), 'raw' (public only), 'spki' (public only), or 'pkcs8' (private only)
    key, {
      // these are the algorithm options
      name: 'ECDH',
      namedCurve: 'P-256' // can be 'P-256', 'P-384', or 'P-521'

    }, true, // whether the key is extractable (i.e. can be used in exportKey)
    [] // 'deriveKey' and/or 'deriveBits' for private keys only (just put an empty list if importing a public key)
    ).then(pubkey => {
      // returns a privateKey (or publicKey if you are importing a public key)
      importEcdhKey(clientPrivatekey).then(privkey => {
        deriveKey(pubkey, privkey).then(derivekey => {
          exportKey(derivekey).then(result => {
            resolve(result);
          });
        });
      });
    });
  });
}
function decrypt(data, iv) {
  return decryptMethod(data, iv, atob(_store__WEBPACK_IMPORTED_MODULE_0__["store"].privateKey));
}
function encrypt(data) {
  return encryptMethod(data, atob(_store__WEBPACK_IMPORTED_MODULE_0__["store"].privateKey));
}

function encryptMethod(data, key) {
  return new Promise(resolve => {
    let str = 'SP',
        charList = str.split(''),
        uintArray = [];

    for (var i = 0; i < charList.length; i++) {
      uintArray.push(charList[i].charCodeAt(0));
    }

    let additionalData = new Uint8Array(uintArray);
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const _data = new TextEncoder().encode(data);

    importAesKey(key).then(result => {
      window.crypto.subtle.encrypt({
        name: 'AES-GCM',
        iv: iv,
        // The initialization vector you used to encrypt
        additionalData: additionalData,
        // The addtionalData you used to encrypt (if any)
        tagLength: 128 // The tagLength you used to encrypt (if any)

      }, result, // from generateKey or importKey above
      _data // ArrayBuffer of the data
      ).then(encrypted => {
        let str = uintToString(new Uint8Array(encrypted));

        let _iv = uintToString(iv);

        resolve({
          data: btoa(str),
          iv: btoa(_iv)
        });
      });
    });
  });
}

function decryptMethod(data, iv, key) {
  return new Promise(resolve => {
    let str = 'SP',
        charList = str.split(''),
        uintArray = [];

    for (var i = 0; i < charList.length; i++) {
      uintArray.push(charList[i].charCodeAt(0));
    }

    let additionalData = new Uint8Array(uintArray);

    let _iv = stringToUint(iv);

    let _data = stringToUint(data);

    importAesKey(key).then(result => {
      window.crypto.subtle.decrypt({
        name: 'AES-GCM',
        iv: _iv,
        // The initialization vector you used to encrypt
        additionalData: additionalData,
        // The addtionalData you used to encrypt (if any)
        tagLength: 128 // The tagLength you used to encrypt (if any)

      }, result, // from generateKey or importKey above
      _data // ArrayBuffer of the data
      ).then(decrypted => {
        // returns an ArrayBuffer containing the decrypted data
        let str = uintToString(new Uint8Array(decrypted));
        let decryptedObject = JSON.parse(str);
        resolve(decryptedObject);
      });
    });
  });
}

function stringToUint(str) {
  let decoded = atob(str);
  let charList = decoded.split(''),
      uintArray = [];

  for (var i = 0; i < charList.length; i++) {
    uintArray.push(charList[i].charCodeAt(0));
  }

  return new Uint8Array(uintArray);
}

function uintToString(uintArray) {
  return String.fromCharCode.apply(null, uintArray);
}

function deriveKey(serverkey, clientkey) {
  let algo = {
    name: 'ECDH',
    namedCurve: 'P-256',
    // can be 'P-256', 'P-384', or 'P-521'
    public: serverkey // an ECDH public key from generateKey or importKey

  };
  return new Promise(resolve => {
    window.crypto.subtle.deriveKey(algo, clientkey, // your ECDH private key from generateKey or importKey
    {
      // the key type you want to create based on the derived bits
      name: 'AES-GCM',
      //can be any AES algorithm ('AES-CTR', 'AES-CBC', 'AES-CMAC', 'AES-GCM', 'AES-CFB', 'AES-KW', 'ECDH', 'DH', or 'HMAC')
      // the generateKey parameters for that type of algorithm
      length: 256 //can be  128, 192, or 256

    }, true, // whether the derived key is extractable (i.e. can be used in exportKey)
    ['encrypt', 'decrypt'] //limited to the options in that algorithm's importKey
    ).then(keydata => {
      // result is a Promise that returns the derivated key as a CryptoKey or a CryptoKeyPair.
      resolve(keydata);
    });
  });
}

function importEcdhKey(mykey) {
  let key = JSON.parse(mykey);
  return new Promise(resolve => {
    window.crypto.subtle.importKey('jwk', // can be 'jwk' (public or private), 'raw' (public only), 'spki' (public only), or 'pkcs8' (private only)
    key, {
      // these are the algorithm options
      name: 'ECDH',
      namedCurve: 'P-256' // can be 'P-256', 'P-384', or 'P-521'

    }, true, // whether the key is extractable (i.e. can be used in exportKey)
    ['deriveKey', 'deriveBits'] // 'deriveKey' and/or 'deriveBits' for private keys only (just put an empty list if importing a public key)
    ).then(clientkey => {
      // returns a privateKey (or publicKey if you are importing a public key
      resolve(clientkey);
    });
  });
}

function importAesKey(mykey) {
  let key = JSON.parse(mykey);
  return new Promise(resolve => {
    window.crypto.subtle.importKey('jwk', // can be 'jwk' (public or private), 'raw' (public only), 'spki' (public only), or 'pkcs8' (private only)
    key, {
      // these are the algorithm options
      name: 'AES-GCM',
      // can be any AES algorithm ('AES-CTR', 'AES-CBC', 'AES-CMAC', 'AES-GCM', 'AES-CFB', 'AES-KW', 'ECDH', 'DH', or 'HMAC'
      length: 256 // can be  128, 192, or 256

    }, true, // whether the key is extractable (i.e. can be used in exportKey)
    ['encrypt', 'decrypt'] // 'deriveKey' and/or 'deriveBits' for private keys only (just put an empty list if importing a public key)
    ).then(clientkey => {
      resolve(clientkey);
    });
  });
}

function exportKey(key) {
  return new Promise(resolve => {
    // https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/exportKey
    window.crypto.subtle.exportKey('jwk', // can be 'jwk' (public or private), 'raw' (public only), 'spki' (public only), or 'pkcs8' (private only)
    key // can be a publicKey or privateKey, as long as extractable was true
    ).then(keydata => {
      // result is a Promise that returns the key in the requested format.
      // returns the exported key data
      let result = JSON.stringify(keydata);
      resolve(result);
    });
  });
}

/***/ })

}]);
//# sourceMappingURL=13.js.map