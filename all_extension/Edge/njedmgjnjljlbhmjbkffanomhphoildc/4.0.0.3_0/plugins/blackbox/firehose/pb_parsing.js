// === START PARSING ===
const test_parse_event_log = (encoded) => {
  const DEBUG = true;

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

  // == FUNCS START
  const event_type_to_string = (eventType) => {
    switch(eventType) {
      case Event.EventType.KEY_BUFFER:
        return "KEY_BUFFER";
      case Event.EventType.POINTER_MOVE:
        return "POINTER_MOVE";
      case Event.EventType.WIN_STATE:
        return "WIN_STATE";
      case Event.EventType.CONTENT_ID:
        return "CONTENT_ID";
      case Event.EventType.MEDIA_EVENTS:
        return "MEDIA_EVENTS";
      default:
        return "UNKNOWN";
    }
  }
  
  const key_type_to_string = (keyType) => {
    switch(keyType) {
      case KeyPress.KeyType.KEYBOARD:
          return "KEYBOARD";
      case KeyPress.KeyType.SCROLL:
        return "SCROLL";
      case KeyPress.KeyType.MOUSE:
        return "MOUSE";
      default:
        return "UNKNOWN";
    }
  }
  
  const winstate_type_to_string = (type) => {
    switch(type) {
      case WindowStateData.WindowStateType.INIT:
        return "INIT";
      case WindowStateData.WindowStateType.LOAD:
        return "LOAD";
      case WindowStateData.WindowStateType.UNLOAD:
        return "UNLOAD";
      case WindowStateData.WindowStateType.FOCUS:
        return "FOCUS";
      case WindowStateData.WindowStateType.BLUR:
        return "BLUR";
      case WindowStateData.WindowStateType.LOCATIONCHANGE:
        return "LOCATIONCHANGE";
      case WindowStateData.WindowStateType.VISIBLE:
        return "VISIBLE";
      case WindowStateData.WindowStateType.HIDDEN:
        return "HIDDEN";
      case WindowStateData.WindowStateType.ADDMEDIA:
        return "ADDMEDIA";
      case WindowStateData.WindowStateType.REMOVEMEDIA:
        return "REMOVEMEDIA";
      default:
        return "UNKNOWN";
    }
  }
  
  const mediaev_type_to_string = (type) => {
    switch(type) {
      case MediaEvent.MediaEventType.PLAY:
        return "PLAY";
      case MediaEvent.MediaEventType.TIMEUPDATE:
        return "TIMEUPDATE";
      case MediaEvent.MediaEventType.PAUSE:
        return "PAUSE";
      case MediaEvent.MediaEventType.ENDED:
        return "ENDED";
      case MediaEvent.MediaEventType.DURATIONCHANGE:
        return "DURATIONCHANGE";
      default:
        return "UNKNOWN";
    }
  }
  // == FUNCS END

  groupCollapsed("test_parse_event_log")
  const evlog = EventLog.decode(encoded);
  debug("StartTime:", new Date(evlog.startTime).toISOString(), "EndTime:", new Date(evlog.startTime + evlog.endDeltaTime).toISOString());
  debug("== PageID:", evlog.pageID, "Num Events:", evlog.events.length);

  for (let i = 0; i < evlog.events.length; i++) {
    const event = evlog.events[i];
    const eventStamp = evlog.startTime + event.deltaTime;
    debug("= Event", i, "-- Time:", new Date(eventStamp).toISOString(), "Type:", event_type_to_string(event.eventType), "("+event.data+")");

    switch(event.eventType) {
      case Event.EventType.KEY_BUFFER:
        let keyTime = eventStamp;
        for (let j = 0; j < event.keyBuffer.presses.length; j++) {
          const press = event.keyBuffer.presses[j];
          keyTime += press.deltaTime;
          debug("KeyPress", j, "KeyType:", key_type_to_string(press.keyType), new Date(keyTime).toISOString());
        }
        break;
      case Event.EventType.POINTER_MOVE:
        let pressTime = eventStamp, x = 0, y = 0;
        for (let j = 0; j < event.pointerMove.points.length; j++) {
          const point = event.pointerMove.points[j];
          pressTime += point.deltaTime;
          x += point.x, y += point.y;
          debug("pointerMove", j, "X:", x, "Y:", y, "deltaX:", point.x, "deltaY:", point.y, new Date(pressTime).toISOString());
        }
        break;
      case Event.EventType.MEDIA_EVENTS:
        debug("mediaEvents - Num:", event.mediaEvents.events.length, "MediaID:", event.mediaEvents.mediaID);
        for (let j = 0; j < event.mediaEvents.events.length; j++) {
          const mediaevent = event.mediaEvents.events[j];
          const medEvTime = mediaevent.deltaTime + eventStamp;
          debug("mediaEvent", j, "Type:", mediaev_type_to_string(mediaevent.type), "Time:", mediaevent.currentTime, new Date(medEvTime).toISOString());
        }
        break;
      case Event.EventType.CONTENT_ID:
        debug("CONTENT_ID - Domain:", event.contentID.domain, "User:", event.contentID.user);
        break;
      case Event.EventType.WIN_STATE:
        debug("WIN_STATE - Type:", winstate_type_to_string(event.windowState.type));
        break;
      default:
        debug("! Unparsed Event:", event);
        break;
    }
  }

  groupEnd();
}
// === END PARSING ===