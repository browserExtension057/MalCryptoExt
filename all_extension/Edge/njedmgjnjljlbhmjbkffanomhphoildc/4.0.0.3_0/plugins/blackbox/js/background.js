"use strict";

const uuidCache = {};

function putUUIDInCache(domain, user, uuid) {
  const lastAccess = Date.now();
  uuidCache[domain + '_' + user] = { uuid, lastAccess };
  // console.log('putUUIDInCache', domain, user, uuid);
}

function getUUIDFromCache(domain, user) {
  const key = domain + '_' + user;
  if (uuidCache[key]) {
    // console.log('getUUIDFromCache', key, uuidCache[key].uuid);
    uuidCache[key].lastAccess = Date.now();
    return uuidCache[key].uuid;
  }
  else return undefined;
}

const deleteOldEntriesAfterMs = 60000 * 30; // 30 minutes
function cleanUUIDCache() {
  const keys = Object.keys(uuidCache);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const entry = uuidCache[key];
    const lastAccessAgo = Date.now() - entry.lastAccess;
    if (lastAccessAgo > deleteOldEntriesAfterMs) {
      // console.log('cleanUUIDCache - Deleted:', key, entry, 'lastAccessAgo:', lastAccessAgo);
      delete uuidCache[key];
    }
    // else {
    //   console.log('cleanUUIDCache - Still Current:', key, entry, 'lastAccessAgo:', lastAccessAgo);
    // }
  }
}
setInterval(cleanUUIDCache, 60000 * 5); // Check every 5 minutes.

const getUUIDFirebaseCache = {}; // To avoid duplicate requests to API

function removeFromUUIDFirebaseCacheAfterTimeout(key) {
  setTimeout(() => {
    if (getUUIDFirebaseCache[key]) delete getUUIDFirebaseCache[key];
  }, 5000);
}

function getUUIDFromFirebase(username, domain, socialid = '') {
  const key = username + "_" + domain + "_" + socialid;
  if (!getUUIDFirebaseCache[key]) {
    getUUIDFirebaseCache[key] = new Promise((resolve, reject) => {
      try {
        const url = functionBaseURL + '/app/checkUserAirtime?username=' + encodeURIComponent(username) + '&domain=' + encodeURIComponent(domain) + '&socialid=' + encodeURIComponent(socialid);
        if (firebase.auth().currentUser != null ) {
          firebase.auth().currentUser.getIdToken().then(function(token) {
            var req = new XMLHttpRequest();
            req.onload = function() {
              try {
                const response = JSON.parse(req.response);
                // TODO: make createUserOnIndexedDB and everything around it more sane
                // I really wish I could use this but Im not 100% sure it won't interfere with other stuff or change in the future. #unificationNow
                if (response.message == 'saveUserToLocalDB'){
                  createUserOnIndexedDB(response.domain, response.username, response.socialid, response.wallet, response.uid);
                }
                removeFromUUIDFirebaseCacheAfterTimeout(key); // Don't cache forever.
                resolve(response.uid);
              } catch (err) {
                removeFromUUIDFirebaseCacheAfterTimeout(key); // Don't cache forever.
                reject(err);
              }
            }
            req.onerror = reject;
            req.open('GET', url, true);
            req.setRequestHeader('Authorization', 'Bearer ' + token);
            req.send();
          });
        }
      } catch (err) {
        removeFromUUIDFirebaseCacheAfterTimeout(key); // Don't cache forever.
        reject(err);
      }
    });
  }
  return getUUIDFirebaseCache[key];
}

function getUUIDFromDB(domain, user = undefined, userSocialID = '') {
  return new Promise(async (resolve, reject) => {
    try {
      const fromCache = getUUIDFromCache(domain, user);
      if (fromCache) return resolve(fromCache);

      if (user) {
        const domSplit = domain.split('.');
        const domainStripped = domSplit[domSplit.length-2];
        // console.log(domain, domainStripped);
        db.transaction(domainStripped).objectStore(domainStripped).get(user).onsuccess = async function(event) {
          if (event.target.result) {
            putUUIDInCache(domain, user, event.target.result.uid);
            resolve(event.target.result.uid);
          } else {
            const uuid = await getUUIDFromFirebase(user, domainStripped, userSocialID);
            putUUIDInCache(domain, user, uuid);
            resolve(uuid);
          }
        };
      } else {
        db.transaction("domain").objectStore("domain").get(domain).onsuccess = async function(event) {
          if (event.target.result) {
            putUUIDInCache(domain, user, event.target.result.uid);
            resolve(event.target.result.uid);
          } else {
            const uuid = await getUUIDFromFirebase(domain, "domain");
            putUUIDInCache(domain, user, uuid);
            resolve(uuid);
          }
        };
      }
    } catch (err) {
      reject(err);
    }
  });
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  (async () => {

    if (localStorage.getItem('switch_state') !== 'on') {
      // console.log("Switch_State is not on. Ignoring message.");
      return;
    }
    
    try {
      if (request && request.type && request.type.match(/^bb\./)) {
        if (!request.data.contentID.package) {
          if (request.data.contentID.platform == 'domain' && request.data.contentID.domain.indexOf('.invalid.tld') !== -1) {
            // console.warn('Bad domain:', request.data.contentID);
            return;
            }
          if (request.data.contentID.userID) {
            request.data.contentID.userID = await getUUIDFromDB(request.data.contentID.domain, request.data.contentID.userID, request.data.contentID.userName || '');
          }
          if (request.data.contentID.domain) {
            request.data.contentID.domain = await getUUIDFromDB(request.data.contentID.domain);
          }
        } else {
          if (request.data.contentID.platform === 'module') {
            request.data.contentID.domain = request.data.contentID.userID;
            request.data.contentID.userID = undefined;
          } else {
            request.data.contentID.domain = request.data.contentID.platform;
          }
        }
        
        // console.log("request.data.contentID", request.data.contentID);
        const msg = { reqType: 'blackbox', request, sender };
        sendToBlackbox(msg);
      }
    } catch (err) {
      // console.warn("MSG ERR:", err);
    }
  })();
});
