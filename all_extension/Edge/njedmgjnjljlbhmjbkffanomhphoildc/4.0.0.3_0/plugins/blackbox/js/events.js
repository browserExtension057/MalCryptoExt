// TODO: Track user engagement, dont want idlers.
// TODO: Check that media and the tab it is playing it is not muted in activePage logic<<

(async (globals, wnd, doc) => {
  "use strict";

  const DEBUG = false;

  const log = (...args) => { if (DEBUG) console.log(...args); };
  const warn = (...args) => { if (DEBUG) console.warn(...args); };
  
  if (!globals.BlackBox) throw new Error("No Airtime BlackBox Detected");

  const uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  const page_id = uuidv4();

  const isTopLevel = () => {
    try {
      return window.self === window.top;
    } catch (e) {
      return false;
    }
  };
  const topLevel = isTopLevel();

  if (!topLevel) {
    log("BB Events - Not toplevel, no need to run.");
    return;
  }

  let contentID = await getContentIDAsync() || {};
  const contentIDCallback = (newContentID) => { contentID = newContentID; };
  registerContentIDCallback(contentIDCallback);
  
  const send_event = (type, data) => {
    if (!data) return;
    // const origin = location.href;
    // log('Sending', type, data);
    globals.BlackBox.sendMessage({type: 'bb.event', data: Object.assign({type, page_id, contentID, topLevel}, data)});
  }

  let origin = location.href; // used to monitor location changes on pages with html5 navigation
  let focused = doc.hasFocus(); // used to monitor actual window focus changes, input focus/blur bubbles up to window for some reason
  send_event('wnd.init', {
    origin,
    hidden: doc.hidden,
    focused,
    loaded: doc.readyState === 'complete'
  });
  
  const map_evt_fn = (flds) => (evt, tgt) => {
    const obj = {}; // {timeStamp: evt.timeStamp}; // Event timestamps are relative to some timer on the page/tab, inconsistent between tabs
    return flds.reduce((acc, fld) => {
      if (typeof fld === 'function') {
        Object.assign(acc, fld(evt, tgt));
      } else {
        acc[fld] = evt[fld];
      }
      return acc;
    }, obj);
  }

  const media_evt_fn = (evt, media) => ({
    media_id: media.airtime_media_id,
    duration: media.duration,
    playbackRate: media.playbackRate,
    currentTime: media.currentTime,
  });

  const media_timeUpdate_evt_fn = (evt, media) => {
    const second = Math.floor(media.currentTime);
    if (second % 15 != 0 || media.airtime_lastTimeUpdate === second) { return { doNotSend: true }; }
    media.airtime_lastTimeUpdate = second;
    return {
      media_id: media.airtime_media_id,
      duration: media.duration,
      playbackRate: media.playbackRate,
      currentTime: media.currentTime,
    }
  };

  // const mod_key_fn = (evt) => {
  //   let modKeys = 0;
  //   modKeys |= evt.shiftKey;
  //   modKeys |= evt.ctrlKey << 1;
  //   modKeys |= evt.altKey << 2;
  //   modKeys |= evt.metaKey << 3;
  //   return {modKeys};
  // }

  const lastMouseMove = {time: 0, x: 0, y: 0};
  const mouse_pos_fn = (evt) => {
    let pointerX = evt.clientX, pointerY = evt.clientY;
    const time = Date.now();
    
    const BINS = 50;
    const xBinRatio = wnd.innerWidth / BINS;
    const yBinRatio = wnd.innerHeight / BINS;

    pointerX = Math.floor(pointerX / xBinRatio), pointerY = Math.floor(pointerY / yBinRatio);

    if (!lastMouseMove.time) {
      lastMouseMove.x = pointerX, lastMouseMove.y = pointerY, lastMouseMove.time = time;
    } else {
      const deltaX = pointerX - lastMouseMove.x;
      const deltaY = pointerY - lastMouseMove.y;
      const deltaT = (time - lastMouseMove.time);
      const dist = Math.abs(deltaX) + Math.abs(deltaY);
      if (dist > 1 && deltaT > 25) {
        lastMouseMove.x = pointerX, lastMouseMove.y = pointerY, lastMouseMove.time = time;
      } else {
        // console.log("did not sent mouse");
        return { doNotSend: true };
      }
    }

    // console.log("sent mouse");

    return {
      x: evt.clientX,
      y: evt.clientY,
      maxX: wnd.innerWidth,
      maxY: wnd.innerHeight
    };
  }

  const touch_pos_fn = (evt) => {
    const touches = [];
    for (let i = 0; i < evt.changedTouches.length; i++) {
      const touch = evt.changedTouches[i];
      touches.push({id: touch.identifier, x: touch.clientX, y: touch.clientY});
    }
    // console.log("Touch:", evt.type, evt.changedTouches, touches);
    return {
      eventType: evt.type,
      touches,
      maxX: wnd.innerWidth,
      maxY: wnd.innerHeight
    };
  }

  // const debug_evt = (evt, tgt) => {
  //   console.debug(evt, tgt);
  //   return null;
  // }

  const medias = new Set(); // TODO: media info map?

  // const mouse_evt = map_evt_fn([mouse_pos_fn, mod_key_fn]);
  // const kbd_evt = map_evt_fn(['repeat', mod_key_fn]);
  // const touch_evt = map_evt_fn(['touches', mod_key_fn]);
  // const wnd_evt = debug_evt, doc_evt = debug_evt;

  const nodata_evt = () => ({});

  let lastPressType;
  let lastPressTime = 0;
  let lastKeyPressed;

  const keypress_evt = (evt) => {
    const diff = Date.now() - lastPressTime;
    if (lastPressType == 'keypress' && diff < 50 && lastKeyPressed == evt.keyCode) {
      // console.log("Not sending keypress", diff, evt.keyCode);
      return { doNotSend: true };
    }
    // console.log("Sending keypress", diff, evt.keyCode);
    lastKeyPressed = evt.keyCode;
    lastPressTime = Date.now();
    lastPressType = 'keypress';
    return {type: 'ui.keypress', click: 'keypress'};
  };

  const mousepress_evt = (evt) => {
    const diff = Date.now() - lastPressTime;
    if (lastPressType == evt.type && diff < 50) {
      // console.log("Not sending mousepress", evt.type, diff);
      return { doNotSend: true };
    }
    // console.log("Sending mousepress", evt.type, diff);
    lastPressTime = Date.now();
    lastPressType = evt.type;
    return {type: 'ui.mousepress', click: evt.type};
  };

  const event_handlers = {
    doc: {
      // Mouse events
      'mousemove': map_evt_fn([mouse_pos_fn, evt => ({type: 'ui.mousemove'})]),
      // 'click, auxclick, wheel': map_evt_fn([mouse_pos_fn, mod_key_fn, evt => ({type: 'ui.mousepress', click: evt.type})]), // dblclick
      'click, auxclick, wheel': map_evt_fn([mousepress_evt]), // dblclick
      // 'click, dblclick, auxclick, wheel, mousedown, mouseup': mouse_evt, // TODO: mouse btn handling
      // 'mousemove': mouse_evt,
      // 'select, contextmenu': debug_evt,
      // 'mouseover, mouseout': debug_evt,
      // 'dragstart, drag, dragenter, dragleave, dragover, dragend, drop': debug_evt,

      // Touch events
      // 'touchstart, touchend, touchmove, touchenter, touchleave, touchcancel': touch_evt,
      'touchstart, touchend, touchmove, touchcancel': map_evt_fn([touch_pos_fn, evt => ({type: 'ui.touch'})]),

      // Keyboard events
      // 'keydown, keyup, keypress': kbd_evt,
      // 'keypress': map_evt_fn([mod_key_fn, evt => ({type: 'ui.keypress', click: 'keypress'})]),
      'keypress': map_evt_fn([keypress_evt]),

      // Misc events
      //'DOMContentLoaded': doc_evt,
      'DOMContentLoaded': () => ({type: 'wnd.DOMContentLoaded'}), // Treat as window event instead of document event
    },
    wnd: {
      // Window events
      'focus, blur': (evt) => {
        if (evt.type == 'focus' && focused) return null;
        if (evt.type == 'blur' && doc.hasFocus()) return null;
        focused = doc.hasFocus();
        return {};
      },
      'visibilitychange': () => ({hidden: doc.hidden}),
      'load, unload': nodata_evt,
      /*
      'hashchange': evt => {
        console.log('Hash Change %s', location.href, location.hash);
      },
      'popstate': evt => {
        console.log('Popstate %s', location.href, evt);
      },
      */
      // 'focus, blur, visibilitychange': wnd_evt, // TODO: tab visibility & active
      // 'scroll, resize': wnd_evt, // TODO: update visibility
      // 'hashchange, popstate, load': wnd_evt, // TODO: in page navigation detection
      // 'beforeunload, unload': wnd_evt, // TODO: page unload signaling
      // 'fullscreenchange, fullscreenerror': debug_evt,
      // 'devicemotion': debug_evt, // TODO: motion evt structure
      // 'devicemotion': map_evt_fn(['acceleration', 'accelerationIncludingGravity']),
      // 'deviceorientation': debug_evt, // TODO: normalize orientation
      // 'deviceorientation': map_evt_fn(['absolute', 'alpha', 'beta', 'gamma']),
      // 'deviceproximity, userproximity': debug_evt, // TODO: what are these?
    },
    media: {
      'durationchange': map_evt_fn([media_evt_fn]),
      'play, playing': map_evt_fn([media_evt_fn]),
      'timeupdate': map_evt_fn([media_timeUpdate_evt_fn]),
      'pause, ended': map_evt_fn([media_evt_fn]),
      // 'durationchange': debug_evt,
      // 'timeupdate': debug_evt,
      // 'loadedmetadata, loadeddata': debug_evt,
      // 'canplay, canplaythrough': debug_evt,
      // 'waiting, emptied, stalled, suspend': debug_evt,
      // 'play, ended': debug_evt,
      // 'playing, pause, seeking, seeked': debug_evt,
      // 'ratechange, volumechange': debug_evt,
    }
  };

  const _handlers = {doc: {}, wnd: {}, media: {}};
  Object.keys(_handlers).forEach(group => {
    Object.keys(event_handlers[group]).forEach(events => {
      events.split(',').forEach(evt => {
        evt = evt.trim();
        const handler = data => {
          if (origin !== location.href) { // if location has changed between two events, send a location change
            origin = location.href;
            send_event('wnd.locationchange', {origin});
          }
          const res = event_handlers[group][events](data, data.target);
          // console.log(group, events, res);
          if (!res || !res.doNotSend) { send_event(`${group}.${evt}`, res); }
          // else { console.log("Didnt send!", group, events, res); }
        };
        _handlers[group][evt] = handler;
      });
    });
  });

  const add_handlers = (type, obj) => {
    Object.keys(_handlers[type]).forEach(evt => {
      obj.addEventListener(evt, _handlers[type][evt], {capture: true, passive: true});
    });
  }

  const remove_handlers = (type, obj) => {
    Object.keys(_handlers[type]).forEach(evt => {
      obj.removeEventListener(evt, _handlers[type][evt]);
    });
  }

  Object.entries({doc, wnd}).forEach(([type, obj]) => add_handlers(type, obj));

  const add_media = media => {
    if (medias.has(media)) return;
    medias.add(media);
    media.airtime_media_id = uuidv4();
    send_event('wnd.addmedia', {media_id: media.airtime_media_id}); // TODO: media info?
    add_handlers('media', media);
  }
  
  const remove_media = media => {
    if (!medias.has(media)) return;
    medias.delete(media);
    remove_handlers('media', media);
    send_event('wnd.removemedia', {media_id: media.airtime_media_id});
  }

  const scan_media_elements = () => {
    const videos = document.getElementsByTagName('video');
    const audios = document.getElementsByTagName('audio');
    for (const media of medias) if (!document.documentElement.contains(media)) remove_media(media);
    for (let i = 0; i < videos.length; ++i) add_media(videos[i]);
    for (let i = 0; i < audios.length; ++i) add_media(audios[i]);
  }
  
  let scanTimer = null;
  const observer = new MutationObserver(mutations => {
    clearTimeout(scanTimer);
    scanTimer = setTimeout(scan_media_elements, 50);
  });
  observer.observe(doc, {attributes: false, childList: true, subtree: true});

  scan_media_elements();

  log('Event Handlers Installed', location.href);
})(window, window, document);