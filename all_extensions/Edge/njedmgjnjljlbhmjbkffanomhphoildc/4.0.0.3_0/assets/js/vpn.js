'use strict';
document.addEventListener('DOMContentLoaded', function () {


  // === API CALLS START ===


  // const API_NODES = API_ENDPOINT_GATEWAY + '/proxy/v1/server';
  // const API_RELEASE_IP = API_ENDPOINT_GATEWAY + '/proxy/v1/releaseIp';

  const xhrCall = (uri, isGet, doNotUseToken) => {
    return new Promise(async (resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(isGet ? 'GET' : 'POST', uri, true);
      if (!doNotUseToken) xhr.setRequestHeader('X-AccessToken', await getAccessToken());
      xhr.addEventListener('readystatechange', function () {
        try {
          if (xhr.readyState === XMLHttpRequest.DONE) {
            resolve(JSON.parse(xhr.response));
          }
        } catch (err) { reject(err); }
      });
      xhr.onerror = reject;
      xhr.send(null);
    });
  };


  // === API CALLS END ===

  // === UTILITY START ===



});