const messageHandlers = {};

const sendCallback = (data, cbid, dest, origin, isError) => {
  dest.postMessage({ airtimeExtensionRPC: true, cmd: isError ? 'callback-err' : 'callback', data, cbid }, origin);
};

const allowedOrigins = [
  // 'http://localhost:5000', // Local Dev
  'https://bittube.app', // Live
  'https://bittubeapp.com', // Live
  'https://pay.bittube.cash', // Live
  'https://bittube-airtime-extension.firebaseapp.com', // Live
  'https://bittube-airtime-extension-dev.firebaseapp.com' // Staging
];

const postMessageListener = async (event) => {
  // console.log('postMessageListener', event.origin, event.data, allowedOrigins.indexOf(event.origin) === -1);
  // Super Paranoid Checks
  if (!(event instanceof Event)) return;
  if (!event.isTrusted) return;
  if (allowedOrigins.indexOf(event.origin) === -1) return;
  // Check for message validity, to avoid listening to other scripts messages accidentally.
  const data = event.data;
  if (data.airtimeExtensionRPC !== true || !Object.prototype.hasOwnProperty.call(data, 'cmd') || !Object.prototype.hasOwnProperty.call(data, 'data')) return;
  if (data.airtimeExtensionRPC === true && (data.cmd === 'callback' || data.cmd === 'callback-err')) return;
  // console.log('postMessageListener', whoAmI.amClient() ? 'client' : 'module', event.data);

  let handler;
  switch(data.cmd) {
  case 'noAnswer': // Special test case for timeout
    return;
  default:
    handler = messageHandlers[data.cmd];
  }
  // console.log("handler", handler);
  if (handler && typeof handler === 'function') {
    try {
      const response = await handler(data.data);
      if (data.cbid) sendCallback(response, data.cbid, event.source,  event.origin, false);
    } catch (err) {
      if (data.cbid) sendCallback(err.message, data.cbid, event.source,  event.origin, true);
    }
  } else {
    if (data.cbid) sendCallback('Bad Command', data.cbid, event.source, event.origin, true);
  }
};

messageHandlers.test = (data) => {
  return data;
};

messageHandlers.background = (data) => {
  return new Promise((resolve, reject) => {
    try {
      chrome.runtime.sendMessage({cmd: data.cmd, data: data.data}, (reply) => {
        if (reply.error) {
          reject(new Error(reply.error));
        } else {
          resolve(reply.payload);
        }
      });
    } catch (err) {
      reject(err.message);
    }
  });
};

document.documentElement.setAttribute('airtime-extension-clientcomms-installed', true);
window.addEventListener('message', postMessageListener, false);

chrome.runtime.onMessage.addListener((request, sender, response) => {
  // console.log('clientcomms runtime msg', request, sender);
  if (request.type === 'firebaseAuthChanged') {
    window.postMessage({ airtimeExtensionRPC: true, cmd: 'firebaseAuthChanged', data: request.user }, window.location.origin);
  } else if (request.type === 'firebaseTokenChanged') {
    window.postMessage({ airtimeExtensionRPC: true, cmd: 'firebaseTokenChanged', data: request.user }, window.location.origin);
  }
});

// === MESSAGE SYSTEM END ===

// console.log('HI', window);