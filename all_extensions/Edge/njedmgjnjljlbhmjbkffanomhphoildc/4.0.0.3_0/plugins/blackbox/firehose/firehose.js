"use strict";

// function getFirebaseToken() {
//   return new Promise((resolve, reject) => {
//     try {
//       if (firebase.auth().currentUser != null ) {
//         firebase.auth().currentUser.getIdToken().then(function(token) {
//           resolve(token);
//         }).catch(reject);
//       } else {
//         reject(new Error('No current user to get token for!'));
//       }
//     } catch (err) {
//       reject(err);
//     }
//   });
// }

// function getPhoneNumber() {
//   return new Promise((resolve, reject) => {
//     getFirebaseToken().then(function(token) {
//       var req = new XMLHttpRequest();
//       req.onload = () => {
//         // if (req.responseText != 'userHasNotPhoneNumber'){
//         //   value = req.responseText;
//         // } else {
//         // }
//       };
//       req.onerror = reject;
//       req.open('GET', functionBaseURL + '/app/getUserPhoneNumber', true);
//       req.setRequestHeader('Authorization', 'Bearer ' + token);
//       req.send();
//     }.bind(this));
//   });
// }

async function userIsVerified() {
  const claims = await getFirebaseClaims();
  return claims.verified === 1; // claims.hasPhone === 1;
}

async function getUserUUID() {
  const claims = await getFirebaseClaims();
  return claims.uuid || localStorage.getItem('uuid');
}

// console.log("Has PhoneNumber:", userIsVerified());

const main = () => {
  // const DEBUG = false;
  const DEBUG = !IS_PRODUCTION;

  let sendAfter = 1000 * 60 * 10;
  // if (DEBUG) sendAfter = 1000 * 60 * 5;
  // if (DEBUG) sendAfter = 1000 * 60 * 1;

  const debug = (...args) => {
    if (!DEBUG) return;
    console.log(...args);
  }

  const warn = (...args) => {
    if (!DEBUG) return;
    console.warn(...args);
  }

  function groupCollapsed(...args) {
    if (!DEBUG) return;
    if (console.groupCollapsed) console.groupCollapsed(...args);
  }

  function groupEnd() {
    if (!DEBUG) return;
    if (console.groupEnd) console.groupEnd();
  }

  // TODO: user login/information
  // const uuidv4 = () => {
  //   return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
  //     var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
  //     return v.toString(16);
  //   });
  // }

  function uuidToBytes(str) {
    const hexString = (str.replace(/-/g, ""));
    return new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
  }

  const EventLog = EventLogProtos.EventLog;
  const Event = EventLogProtos.Event;
  const PathPoint = EventLogProtos.PathPoint;
  const KeyPress = EventLogProtos.KeyPress;
  const PointerMoveData = EventLogProtos.PointerMoveData;
  const KeyBufferData = EventLogProtos.KeyBufferData;
  const WindowStateData = EventLogProtos.WindowStateData;
  const ContentIDData = EventLogProtos.ContentIDData;
  const MediaEventData = EventLogProtos.MediaEventData;
  const MediaEvent = EventLogProtos.MediaEvent;
  const TouchPointData = EventLogProtos.TouchPointData;
  const TouchPoint = EventLogProtos.TouchPoint;

  let pages = {};

  // TODO: Load state from local storage if exists, save to local storage on unload if Master, needed for NPM
  let log = null;
  const create_event_log = () => { return { startTime: Date.now(), pages: [] }; };

  const add_to_pointer_path = (data, page) => {
    // console.log("got mouse");
    if (!page.lastMouseMove) page.lastMouseMove = {time: 0, x: 0, y: 0};
    const BINS = 50;
    const xBinRatio = data.maxX / BINS;
    const yBinRatio = data.maxY / BINS;

    data.x = Math.floor(data.x / xBinRatio), data.y = Math.floor(data.y / yBinRatio);

    const deltaX = data.x - page.lastMouseMove.x;
    const deltaY = data.y - page.lastMouseMove.y;

    // console.log("Mouse", deltaX, deltaY);
    
    if (!page.current_pointer_path) {
      page.current_pointer_path = {startTime: data.deltaTime, prev: data, points: [PathPoint.create({deltaTime: 0, x: deltaX, y: deltaY})]};
      page.lastMouseMove.x = data.x, page.lastMouseMove.y = data.y, page.lastMouseMove.time = data.deltaTime;
    } else {
      const deltaT = (data.deltaTime - page.lastMouseMove.time);
      const dist = Math.abs(deltaX) + Math.abs(deltaY);
      if (dist > 1 && deltaT > 25) {
        page.current_pointer_path.points.push(PathPoint.create({deltaTime: data.deltaTime - page.lastMouseMove.time, x: deltaX, y: deltaY}));
        page.lastMouseMove.x = data.x, page.lastMouseMove.y = data.y, page.lastMouseMove.time = data.deltaTime;
      }
    }
  }

  const end_current_pointer_path = (page) => {
    const msg = Event.create({deltaTime: page.current_pointer_path.startTime, eventType: Event.EventType.POINTER_MOVE, pointerMove: PointerMoveData.create({points: page.current_pointer_path.points})});
    page.events.push(msg);
    page.current_pointer_path = null;  
    page.lastMouseMove = {time: 0, x: 0, y: 0};
  }

  const add_to_touch_buffer = (data, page) => {
    if (!page.lastTouches) page.lastTouches = {};
    const BINS = 50;
    const xBinRatio = data.maxX / BINS;
    const yBinRatio = data.maxY / BINS;

    if (!page.current_touch_buffer) {
      page.current_touch_buffer = {startTime: data.deltaTime, lastDeltaTime: data.deltaTime, points: []};
    }

    const deltaT = data.deltaTime - page.current_touch_buffer.lastDeltaTime;
    page.current_touch_buffer.lastDeltaTime = data.deltaTime;
    // debug("DeltaT:", deltaT);

    for (let i = 0; i < data.touches.length; i++) {
      const touch = data.touches[i];
      touch.x = Math.floor(touch.x / xBinRatio), touch.y = Math.floor(touch.y / yBinRatio);
      if (!page.lastTouches[touch.id]) page.lastTouches[touch.id] = {x: 0, y: 0};
      const deltaX = touch.x - page.lastTouches[touch.id].x;
      const deltaY = touch.y - page.lastTouches[touch.id].y;

      if (data.eventType === 'touchstart') {
        // page.current_touch_buffer.points.push(TouchPoint.create({deltaTime: deltaT, x: touch.x, y: touch.y, id: touch.id, type: TouchPoint.Type.START}));
        page.current_touch_buffer.points.push(TouchPoint.create({deltaTime: deltaT, x: deltaX, y: deltaY, id: touch.id, type: TouchPoint.Type.START}));
        page.lastTouches[touch.id] = {x: touch.x, y: touch.y};
      } else if (data.eventType === 'touchend') {
        // page.current_touch_buffer.points.push(TouchPoint.create({deltaTime: deltaT, x: touch.x, y: touch.y, id: touch.id, type: TouchPoint.Type.END}));
        page.current_touch_buffer.points.push(TouchPoint.create({deltaTime: deltaT, x: deltaX, y: deltaY, id: touch.id, type: TouchPoint.Type.END}));
        page.lastTouches[touch.id] = undefined;
      } else if (data.eventType === 'touchcancel') {
        // page.current_touch_buffer.points.push(TouchPoint.create({deltaTime: deltaT, x: touch.x, y: touch.y, id: touch.id, type: TouchPoint.Type.CANCEL}));
        page.current_touch_buffer.points.push(TouchPoint.create({deltaTime: deltaT, x: deltaX, y: deltaY, id: touch.id, type: TouchPoint.Type.CANCEL}));
        page.lastTouches[touch.id] = undefined;
      } else if (data.eventType === 'touchmove') {
        const dist = Math.abs(deltaX) + Math.abs(deltaY);
        // debug("MOVE DeltaX:", Math.abs(deltaX), "DeltaY:", Math.abs(deltaY), "Dist:", dist, "X:", touch.x, "Y:", touch.y, "DeltaT:", deltaT);
        if (dist > 1 && deltaT > 25) {
          // debug("ADDED");
          // page.current_touch_buffer.points.push(TouchPoint.create({deltaTime: deltaT, x: touch.x, y: touch.y, id: touch.id, type: TouchPoint.Type.MOVE}));
          page.current_touch_buffer.points.push(TouchPoint.create({deltaTime: deltaT, x: deltaX, y: deltaY, id: touch.id, type: TouchPoint.Type.MOVE}));
          page.lastTouches[touch.id] = {x: touch.x, y: touch.y};
        }
      }
    }

    // debug("TouchBuffer:", page.current_touch_buffer);
  }

  const end_current_touch_buffer = (page) => {
    const msg = Event.create({deltaTime: page.current_touch_buffer.startTime, eventType: Event.EventType.TOUCH_POINTS, touchPoint: TouchPointData.create({points: page.current_touch_buffer.points})});
    page.events.push(msg);
    page.current_touch_buffer = null;  
    page.lastTouches = undefined;
  }

  const add_to_key_buffer = (data, page) => {
    if (!page.lastKeyPress) page.lastKeyPress = {time: 0};
    // log.flags.has_key_presses = true;
    let keyType;
    switch(data.click) {
      case 'keypress': 
        keyType = KeyPress.KeyType.KEYBOARD;
        break;
      case 'wheel':
        keyType = KeyPress.KeyType.SCROLL;
        break;
      case 'click':
      case 'auxclick': 
        keyType = KeyPress.KeyType.MOUSE;
        break;
      default: 
        keyType = KeyPress.KeyType.INVALID;
        break;
    }
    if (!page.current_key_buffer) {
      page.current_key_buffer = {startTime: data.deltaTime, presses: [KeyPress.create({deltaTime: 0, keyType: keyType /*, modKeys: data.modKeys */})]};
      page.lastKeyPress.time = data.deltaTime;
    } else {
      page.current_key_buffer.presses.push(KeyPress.create({deltaTime: data.deltaTime - page.lastKeyPress.time, keyType: keyType}));
      page.lastKeyPress.time = data.deltaTime;
    }  
  }
  const end_current_key_buffer = (page) => {
    const msg = Event.create({deltaTime: page.current_key_buffer.startTime, eventType: Event.EventType.KEY_BUFFER, keyBuffer: KeyBufferData.create({presses: page.current_key_buffer.presses})});
    page.events.push(msg);
    page.current_key_buffer = null;
    page.lastKeyPress = {time: 0};
  }

  const adjustTimeStamp = (ts) => {
    let adjustBy = 0;
    try {
      adjustBy = parseInt(localStorage.getItem('FirehoseTSAdjust') || '0') || 0; // Just to make extra sure.
    } catch (e) { debug("Ignored adjustTimeStamp Err:", e); }
    return ts + adjustBy;
  }

  const finish_event_log = () => {
    const pageKeys = Object.keys(pages);
    groupCollapsed('=== Finishing current event log', new Date(), 'NumPages:', pageKeys.length);

    for (let i = 0; i < pageKeys.length; i++) {
      const seenContentIDS = [];
      const key = pageKeys[i];
      const page = pages[key];

      for (let j = 0; j < page.events.length; j++) {
        const event = page.events[j];
        if (event.eventType == Event.EventType.CONTENT_ID) {
          const id = { domain: event.contentID.domain, user: event.contentID.user };
          let doAdd = true;
          for (let k = 0; k < seenContentIDS.length; k++) if (JSON.stringify(id) === JSON.stringify(seenContentIDS[k])) doAdd = false;
          if (doAdd) seenContentIDS.push(id);
        }
      }

      // Make sure to include current contentID, in case no event was present
      if (seenContentIDS.length === 0 && page.contentID.domain) { seenContentIDS.push({domain: uuidToBytes(page.contentID.domain), user: page.contentID.userID ? uuidToBytes(page.contentID.userID) : undefined}); }
      
      if (seenContentIDS.length === 0) {
        debug("Page has no contentID!", JSON.stringify(page));
      } else {
        if (page.current_pointer_path) end_current_pointer_path(page);
        if (page.current_key_buffer) end_current_key_buffer(page);
        if (page.current_touch_buffer) end_current_touch_buffer(page);
        
        const mediaKeys = Object.keys(page.media);
        for (let j = 0; j < mediaKeys.length; j++) {
          const mediaKey = mediaKeys[j];
          const mediaEvents = page.media[mediaKey].events;
          if (mediaEvents.length) {
            page.events.push(Event.create({deltaTime: page.media[mediaKey].startDelta, eventType: Event.EventType.MEDIA_EVENTS, mediaEvents: MediaEventData.create({ mediaID: mediaKey, events: mediaEvents }) }));
          }
        }
        
        if (page.events.length) {
          // const adjustedStartTime = SyncedTimeSource.fixDate(page.startTime).getTime();
          const adjustedStartTime = adjustTimeStamp(page.startTime);
          debug("AdjustedTime", page.startTime, adjustedStartTime);
          let shouldSendLog = false;
          const worthyEvents = [ Event.EventType.KEY_BUFFER, Event.EventType.TOUCH_POINTS, Event.EventType.POINTER_MOVE, Event.EventType.MEDIA_EVENTS ];
          for (let j = 0; j < page.events.length; j++) {
            const event = page.events[j];
            if (worthyEvents.indexOf(event.eventType) > -1) {
              shouldSendLog = true;
              break;
            }
          }

          if (shouldSendLog) {
            log.pages.push({ log: EventLog.create({
              startTime: adjustedStartTime,
              endDeltaTime: page.lastEventTime - page.startTime,
              events: page.events,
              pageID: uuidToBytes(key),
            }), seenContentIDS, startTime: adjustedStartTime});
          } else {
            debug("Should not send:", JSON.stringify(page));
          }
        }
      }
      
      page.events = [];
      page.media = {};
      page.startTime = undefined;
      page.lastEventTime = undefined;
    }

    // let sentSize = 0;
    if (log.pages.length) {
      const toSend = [];
      for (let x = 0; x < log.pages.length; x++) {
        // debug("SendingLog:", JSON.stringify(log.pages[x]));
        toSend.push({log: log.pages[x].log, seenContentIDS: log.pages[x].seenContentIDS, startTime: log.pages[x].startTime});
        // send_event_log(log.pages[x].log, log.pages[x].seenContentIDS, log.pages[x].startTime);
      }
      send_event_logs(toSend);
    }

    debug('=== Finished current event log');
    groupEnd();

    log.pages = null;
    log = null;

    // pages = {};
  };

  // let lastEventTime = Date.now();
  const check_if_should_send_long = () => {
    // if (log && (Date.now() - (+lastEventTime) >= sendAfter / 2)) { // && log.pages.length 
    //   debug("Inactivity for %d / %d MS, sending log.", (Date.now() - (+lastEventTime)), sendAfter / 2);
    //   finish_event_log();
    // }
    if (log && (Date.now() - (+log.startTime) >= sendAfter)) { // && log.pages.length 
      debug("Log is old (%d / %d MS), sending log.", (Date.now() - (+log.startTime)), sendAfter);
      finish_event_log();
    }
  };
  setInterval(check_if_should_send_long, 20000);

  function concatTypedArrays(a, b) { // a, b TypedArray of same type
    var c = new (a.constructor)(a.length + b.length);
    c.set(a, 0);
    c.set(b, a.length);
    return c;
  }

  function valueToByteArray(value, bytes_length) {
    var bytes_array = [];
    while (bytes_length > 0){
      var byte = value & 0xFF;
      value >>= 8;
      bytes_length--;
      bytes_array.push(byte);
    }
    return bytes_array.reverse();
  }

  const send_event_logs = async (toSend) => {
    debug("send_event_logs - toSend:", toSend); // , "fireUserID:", fireUserID

    try {
      // if (seenContentIDS.length > 255) { console.warn("send_event_logs - SANITY FAIL, more than 255 seenContentIDS!"); return; }
      if (toSend.length > 255) { console.warn("send_event_logs - SANITY FAIL, more than 255 logs toSend!"); return; }

      if (localStorage.getItem('switch_state') !== 'on') {
        debug("Switch_State is not on. Not sending log.");
        return;
      }

      const userID = await getUserUUID();
      if (!userID) { warn("send_event_logs - NO USER ID, aborting."); return; }
      debug("UserID:", userID);

      if (!(await userIsVerified())) {
        debug("FirebaseToken says user has no phone number. Not sending log.");
        return;
      }

      const payLoads = [];

      for (let x = 0; x < toSend.length; x++) {
        const msg = toSend[x].log;
        const seenContentIDS = toSend[x].seenContentIDS;
        const startTimeStamp = toSend[x].startTime;

        debug("send_event_logs - Log:", msg, "seenContentIDS:", seenContentIDS); // , "fireUserID:", fireUserID

        var errMsg = EventLog.verify(msg);
        if (errMsg) throw Error(errMsg);

        const buf = EventLog.encode(msg).finish();
        const body = pako.deflateRaw(buf);

        debug('send_event_logs - Finishing log, %d bytes, compressed %d bytes (%s)', buf.byteLength, body.byteLength, (body.byteLength / buf.byteLength).toFixed(3));

        let header = new Uint8Array();
        header = concatTypedArrays(header, new Uint8Array(valueToByteArray(Math.round(startTimeStamp / 1000), 4))); // Unix Timestamp uin32
        header = concatTypedArrays(header, uuidToBytes(userID));  // user UUID
        header = concatTypedArrays(header, seenContentIDS[0].domain); // Domain UUID

        // TODO: UGLY HACK FIXME IM TIRED
        let counter = 0;
        for (let i = 0; i < seenContentIDS.length; i++) { if (seenContentIDS[i].user && seenContentIDS[i].user.length == 16) counter++; }
        header = concatTypedArrays(header, new Uint8Array([counter])); // Num contentIDs UUIDs
        for (let i = 0; i < seenContentIDS.length; i++) {
          if (seenContentIDS[i].user && seenContentIDS[i].user.length == 16) header = concatTypedArrays(header, seenContentIDS[i].user); // contentID UUID
        }

        const payload = concatTypedArrays(header, body);
        
        debug("send_event_logs - HeaderSize:", header.byteLength, "BodySize:", body.byteLength, "PayloadSize:", payload.byteLength, "ContentIDs:", counter);
        // if (DEBUG && test_parse_event_log) test_parse_event_log(buf);

        payLoads.push(payload);
      }

      let finalHeader = new Uint8Array();
      let finalPayloads = new Uint8Array();
      finalHeader = concatTypedArrays(finalHeader, new Uint8Array([1])); // Version byte
      // finalHeader = concatTypedArrays(finalHeader, uuidToBytes(userID));  // user UUID
      finalHeader = concatTypedArrays(finalHeader, new Uint8Array([payLoads.length])); // Num Payloads byte
      for (let x = 0; x < payLoads.length; x++) {
        finalHeader = concatTypedArrays(finalHeader, new Uint8Array(valueToByteArray(payLoads[x].byteLength, 4))); // Payload Length 32
        finalPayloads = concatTypedArrays(finalPayloads, payLoads[x]); // Payload
      }

      let final = new Uint8Array();
      final = concatTypedArrays(final, finalHeader);
      final = concatTypedArrays(final, finalPayloads);

      debug("Final Header Size:", finalHeader.byteLength, "Final Payloads Size:", finalPayloads.byteLength, "Final Total Size:", final.byteLength);

      const token = await getFirebaseToken();
      const xhr = new XMLHttpRequest();
      xhr.open('POST', airtimeBaseURL + '/airtime-ingress');
      // xhr.open('POST', 'https://europe-west1-bittube-airtime.cloudfunctions.net/airtime-batched-ingress');
      // xhr.open('POST', 'http://localhost:8010/bittube-airtime/us-central1/batched_handler');
      xhr.setRequestHeader('Content-Type', 'application/octet-stream');
      xhr.setRequestHeader('Authorization', 'Bearer ' + token);

      const localTimestamp = Date.now();
      xhr.onload = function(err, res){
        debug("Send-Onload", xhr.status, xhr.responseText);
        try {
          const remoteTimestamp = parseInt(xhr.getResponseHeader('X-Timestamp'));
          if (remoteTimestamp) {
            const diff = remoteTimestamp - localTimestamp;
            localStorage.setItem("FirehoseTSAdjust", diff);
            debug("TimeAdjust", remoteTimestamp, localTimestamp, diff);
          }
        } catch (ex) {
          warn(ex);
        }
      }
      xhr.send(final);
    } catch (err) {
      debug("send_event_logs Err:", err);
    }
  }

  const handle_page_event = data => {
    if (!data.topLevel) return;
    if (!log) log = create_event_log();

    // lastEventTime = Date.now();

    if (!pages[data.page_id]) pages[data.page_id] = { events: [], media: {}, contentID: { domain: undefined, userID: undefined } };
    const page = pages[data.page_id];
    if (!page.startTime) page.startTime = Date.now();
    page.lastEventTime = Date.now();

    data.deltaTime = Date.now() - page.startTime; // Do timestamping here for a) delta b) consistency
    const [group, type] = data.type.split('.');

    if (group == 'wnd') {
      let winStateMsg;
      if (type == 'init') {
        winStateMsg = WindowStateData.create({ type: WindowStateData.WindowStateType.INIT });
      } else if (type == 'unload') {
        winStateMsg = WindowStateData.create({ type: WindowStateData.WindowStateType.UNLOAD });
      } if (type == 'load' || type == 'DOMContentLoaded') {
        winStateMsg = WindowStateData.create({ type: WindowStateData.WindowStateType.LOAD });
      } else if (type == 'locationchange') {
        winStateMsg = WindowStateData.create({ type: WindowStateData.WindowStateType.LOCATIONCHANGE });
      } else if (type == 'focus') {
        winStateMsg = WindowStateData.create({ type: WindowStateData.WindowStateType.FOCUS });
      } else if (type == 'blur') {
        winStateMsg = WindowStateData.create({ type: WindowStateData.WindowStateType.BLUR });
      } else if (type == 'visibilitychange') {
        if (data.hidden) {
          winStateMsg = WindowStateData.create({ type: WindowStateData.WindowStateType.HIDDEN });
        } else {
          winStateMsg = WindowStateData.create({ type: WindowStateData.WindowStateType.VISIBLE });
        }
      } if (type == 'addmedia') {
        winStateMsg = WindowStateData.create({ type: WindowStateData.WindowStateType.ADDMEDIA });
      } else if (type == 'removemedia') {
        winStateMsg = WindowStateData.create({ type: WindowStateData.WindowStateType.REMOVEMEDIA });
      }
      if (winStateMsg) page.events.push(Event.create({deltaTime: data.deltaTime, eventType: Event.EventType.WIN_STATE, windowState: winStateMsg}));
    }

    // console.log("Ev", page.contentID, data.contentID, page.contentID.domain !== data.contentID.domain);
    if (page.contentID.domain !== data.contentID.domain || page.contentID.userID !== data.contentID.userID) {
      if (data.contentID.domain) {
        page.events.push(Event.create({ deltaTime: data.deltaTime, eventType: Event.EventType.CONTENT_ID, contentID: ContentIDData.create({domain: uuidToBytes(data.contentID.domain), user: data.contentID.userID ? uuidToBytes(data.contentID.userID) : undefined}) }));
      }
      page.contentID = data.contentID;
      // debug('Firehose ContentID Changed -- PageID:', data.page_id, 'Domain:', page.contentID.domain, 'userID:', page.contentID.userID);
    }

    if (group == 'media') {
      if (!page.media[data.media_id]) page.media[data.media_id] = { startDelta: data.deltaTime, events: [] };
      const mediaEvents = page.media[data.media_id].events;
      const delta = data.deltaTime - page.media[data.media_id].startDelta;
      let newEvent;
      if (type == 'play' || type == 'playing') {
        newEvent = MediaEvent.create({ type: MediaEvent.MediaEventType.PLAY, currentTime: Math.floor(data.currentTime), deltaTime: delta });
      } else if (type == 'durationchange') {
        newEvent = MediaEvent.create({ type: MediaEvent.MediaEventType.DURATIONCHANGE, deltaTime: delta });
      } else if (type == 'timeupdate') {
        const curr = Math.floor(data.currentTime);
        if (curr % 15 == 0) {
          let makeNewTimeUpdate = true;
          for (let k = Math.max(mediaEvents.length-5, 0); k < mediaEvents.length; k++) {
            if (mediaEvents[k].currentTime == curr) makeNewTimeUpdate = false;
          }
          if (makeNewTimeUpdate) newEvent = MediaEvent.create({ type: MediaEvent.MediaEventType.TIMEUPDATE, currentTime: curr, deltaTime: delta });
        }
      } else if (type == 'pause') {
        newEvent = MediaEvent.create({ type: MediaEvent.MediaEventType.PAUSE, currentTime: Math.floor(data.currentTime), deltaTime: delta });
      } else if (type == 'ended') {
        newEvent = MediaEvent.create({ type: MediaEvent.MediaEventType.ENDED, currentTime: Math.floor(data.currentTime), deltaTime: delta });
      }
      if (newEvent) mediaEvents.push(newEvent);
    }

    if (group == 'ui') { // user interaction event
      if (type == 'mousemove') add_to_pointer_path(data, page);
      else if (type == 'keypress' || type == 'mousepress') add_to_key_buffer(data, page);
      else if (type == 'touch') add_to_touch_buffer(data, page);
    }

    // if (data.deltaTime >= 60000) { // && log.pages.length // TODO: for testing send ~10min chunks, for production want to check event count etc
    if ((Date.now() - log.startTime) >= sendAfter) {
      finish_event_log();
    }
  }

  // const timeDilationInterval = 5000;
  // let timeDilationLastVal = Date.now();
  // const timeDilationLoop = () => {
  //   const newTime = Date.now();
  //   const diff = newTime - timeDilationLastVal;
  //   if (diff > (timeDilationInterval + 100)) {
  //     debug("timeTestingLoop --", timeDilationLastVal, newTime, diff);
  //   }
  //   timeDilationLastVal = newTime;
  // };
  // setInterval(timeDilationLoop, timeDilationInterval);

  // chrome.runtime.onSuspend.addListener(function() {
  //   debug("Unloading.");
  //   // chrome.browserAction.setBadgeText({text: ""});
  // });

  /*
  window.addEventListener('message', msg => {
    const data = msg.data;
    if (data.reqType === 'blackbox') {
      if (data.request.type === 'bb.event') {
        // console.log("bb.event", data.request.data);
        // if (data.request.data.type == "media.timeupdate") { console.log("timeUpdate", data.request.data); }
        handle_page_event(data.request.data);
      }
      else debug("? Weird Blackbox Message", data);
    } 
    else { debug("? Weird Message", data); }
  });
  */

  window.sendToBlackbox = data => {
    if (data.reqType === 'blackbox') {
      if (data.request.type === 'bb.event') {
        // console.log("bb.event", data.request.data);
        // if (data.request.data.type == "media.timeupdate") { console.log("timeUpdate", data.request.data); }
        handle_page_event(data.request.data);
      }
      else debug("? Weird Blackbox Message", data);
    }
    else { debug("? Weird Message", data); }
  }
};
main();