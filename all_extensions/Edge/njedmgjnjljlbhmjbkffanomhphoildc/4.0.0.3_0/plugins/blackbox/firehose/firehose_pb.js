(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.EventLogProtos = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.EventLog = (function() {

    /**
     * Properties of an EventLog.
     * @exports IEventLog
     * @interface IEventLog
     * @property {number|Long|null} [startTime] EventLog startTime
     * @property {number|Long|null} [endDeltaTime] EventLog endDeltaTime
     * @property {Uint8Array|null} [pageID] EventLog pageID
     * @property {Array.<IEvent>|null} [events] EventLog events
     */

    /**
     * Constructs a new EventLog.
     * @exports EventLog
     * @classdesc Represents an EventLog.
     * @implements IEventLog
     * @constructor
     * @param {IEventLog=} [properties] Properties to set
     */
    function EventLog(properties) {
        this.events = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * EventLog startTime.
     * @member {number|Long} startTime
     * @memberof EventLog
     * @instance
     */
    EventLog.prototype.startTime = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

    /**
     * EventLog endDeltaTime.
     * @member {number|Long} endDeltaTime
     * @memberof EventLog
     * @instance
     */
    EventLog.prototype.endDeltaTime = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

    /**
     * EventLog pageID.
     * @member {Uint8Array} pageID
     * @memberof EventLog
     * @instance
     */
    EventLog.prototype.pageID = $util.newBuffer([]);

    /**
     * EventLog events.
     * @member {Array.<IEvent>} events
     * @memberof EventLog
     * @instance
     */
    EventLog.prototype.events = $util.emptyArray;

    /**
     * Creates a new EventLog instance using the specified properties.
     * @function create
     * @memberof EventLog
     * @static
     * @param {IEventLog=} [properties] Properties to set
     * @returns {EventLog} EventLog instance
     */
    EventLog.create = function create(properties) {
        return new EventLog(properties);
    };

    /**
     * Encodes the specified EventLog message. Does not implicitly {@link EventLog.verify|verify} messages.
     * @function encode
     * @memberof EventLog
     * @static
     * @param {IEventLog} message EventLog message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    EventLog.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.startTime != null && message.hasOwnProperty("startTime"))
            writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.startTime);
        if (message.endDeltaTime != null && message.hasOwnProperty("endDeltaTime"))
            writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.endDeltaTime);
        if (message.pageID != null && message.hasOwnProperty("pageID"))
            writer.uint32(/* id 6, wireType 2 =*/50).bytes(message.pageID);
        if (message.events != null && message.events.length)
            for (var i = 0; i < message.events.length; ++i)
                $root.Event.encode(message.events[i], writer.uint32(/* id 10, wireType 2 =*/82).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified EventLog message, length delimited. Does not implicitly {@link EventLog.verify|verify} messages.
     * @function encodeDelimited
     * @memberof EventLog
     * @static
     * @param {IEventLog} message EventLog message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    EventLog.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an EventLog message from the specified reader or buffer.
     * @function decode
     * @memberof EventLog
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {EventLog} EventLog
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    EventLog.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.EventLog();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.startTime = reader.uint64();
                break;
            case 2:
                message.endDeltaTime = reader.uint64();
                break;
            case 6:
                message.pageID = reader.bytes();
                break;
            case 10:
                if (!(message.events && message.events.length))
                    message.events = [];
                message.events.push($root.Event.decode(reader, reader.uint32()));
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes an EventLog message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof EventLog
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {EventLog} EventLog
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    EventLog.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an EventLog message.
     * @function verify
     * @memberof EventLog
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    EventLog.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.startTime != null && message.hasOwnProperty("startTime"))
            if (!$util.isInteger(message.startTime) && !(message.startTime && $util.isInteger(message.startTime.low) && $util.isInteger(message.startTime.high)))
                return "startTime: integer|Long expected";
        if (message.endDeltaTime != null && message.hasOwnProperty("endDeltaTime"))
            if (!$util.isInteger(message.endDeltaTime) && !(message.endDeltaTime && $util.isInteger(message.endDeltaTime.low) && $util.isInteger(message.endDeltaTime.high)))
                return "endDeltaTime: integer|Long expected";
        if (message.pageID != null && message.hasOwnProperty("pageID"))
            if (!(message.pageID && typeof message.pageID.length === "number" || $util.isString(message.pageID)))
                return "pageID: buffer expected";
        if (message.events != null && message.hasOwnProperty("events")) {
            if (!Array.isArray(message.events))
                return "events: array expected";
            for (var i = 0; i < message.events.length; ++i) {
                var error = $root.Event.verify(message.events[i]);
                if (error)
                    return "events." + error;
            }
        }
        return null;
    };

    /**
     * Creates an EventLog message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof EventLog
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {EventLog} EventLog
     */
    EventLog.fromObject = function fromObject(object) {
        if (object instanceof $root.EventLog)
            return object;
        var message = new $root.EventLog();
        if (object.startTime != null)
            if ($util.Long)
                (message.startTime = $util.Long.fromValue(object.startTime)).unsigned = true;
            else if (typeof object.startTime === "string")
                message.startTime = parseInt(object.startTime, 10);
            else if (typeof object.startTime === "number")
                message.startTime = object.startTime;
            else if (typeof object.startTime === "object")
                message.startTime = new $util.LongBits(object.startTime.low >>> 0, object.startTime.high >>> 0).toNumber(true);
        if (object.endDeltaTime != null)
            if ($util.Long)
                (message.endDeltaTime = $util.Long.fromValue(object.endDeltaTime)).unsigned = true;
            else if (typeof object.endDeltaTime === "string")
                message.endDeltaTime = parseInt(object.endDeltaTime, 10);
            else if (typeof object.endDeltaTime === "number")
                message.endDeltaTime = object.endDeltaTime;
            else if (typeof object.endDeltaTime === "object")
                message.endDeltaTime = new $util.LongBits(object.endDeltaTime.low >>> 0, object.endDeltaTime.high >>> 0).toNumber(true);
        if (object.pageID != null)
            if (typeof object.pageID === "string")
                $util.base64.decode(object.pageID, message.pageID = $util.newBuffer($util.base64.length(object.pageID)), 0);
            else if (object.pageID.length)
                message.pageID = object.pageID;
        if (object.events) {
            if (!Array.isArray(object.events))
                throw TypeError(".EventLog.events: array expected");
            message.events = [];
            for (var i = 0; i < object.events.length; ++i) {
                if (typeof object.events[i] !== "object")
                    throw TypeError(".EventLog.events: object expected");
                message.events[i] = $root.Event.fromObject(object.events[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from an EventLog message. Also converts values to other types if specified.
     * @function toObject
     * @memberof EventLog
     * @static
     * @param {EventLog} message EventLog
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    EventLog.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.events = [];
        if (options.defaults) {
            if ($util.Long) {
                var long = new $util.Long(0, 0, true);
                object.startTime = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.startTime = options.longs === String ? "0" : 0;
            if ($util.Long) {
                var long = new $util.Long(0, 0, true);
                object.endDeltaTime = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.endDeltaTime = options.longs === String ? "0" : 0;
            if (options.bytes === String)
                object.pageID = "";
            else {
                object.pageID = [];
                if (options.bytes !== Array)
                    object.pageID = $util.newBuffer(object.pageID);
            }
        }
        if (message.startTime != null && message.hasOwnProperty("startTime"))
            if (typeof message.startTime === "number")
                object.startTime = options.longs === String ? String(message.startTime) : message.startTime;
            else
                object.startTime = options.longs === String ? $util.Long.prototype.toString.call(message.startTime) : options.longs === Number ? new $util.LongBits(message.startTime.low >>> 0, message.startTime.high >>> 0).toNumber(true) : message.startTime;
        if (message.endDeltaTime != null && message.hasOwnProperty("endDeltaTime"))
            if (typeof message.endDeltaTime === "number")
                object.endDeltaTime = options.longs === String ? String(message.endDeltaTime) : message.endDeltaTime;
            else
                object.endDeltaTime = options.longs === String ? $util.Long.prototype.toString.call(message.endDeltaTime) : options.longs === Number ? new $util.LongBits(message.endDeltaTime.low >>> 0, message.endDeltaTime.high >>> 0).toNumber(true) : message.endDeltaTime;
        if (message.pageID != null && message.hasOwnProperty("pageID"))
            object.pageID = options.bytes === String ? $util.base64.encode(message.pageID, 0, message.pageID.length) : options.bytes === Array ? Array.prototype.slice.call(message.pageID) : message.pageID;
        if (message.events && message.events.length) {
            object.events = [];
            for (var j = 0; j < message.events.length; ++j)
                object.events[j] = $root.Event.toObject(message.events[j], options);
        }
        return object;
    };

    /**
     * Converts this EventLog to JSON.
     * @function toJSON
     * @memberof EventLog
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    EventLog.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return EventLog;
})();

$root.Event = (function() {

    /**
     * Properties of an Event.
     * @exports IEvent
     * @interface IEvent
     * @property {number|null} [deltaTime] Event deltaTime
     * @property {Event.EventType|null} [eventType] Event eventType
     * @property {IPointerMoveData|null} [pointerMove] Event pointerMove
     * @property {IKeyBufferData|null} [keyBuffer] Event keyBuffer
     * @property {IWindowStateData|null} [windowState] Event windowState
     * @property {IContentIDData|null} [contentID] Event contentID
     * @property {IMediaEventData|null} [mediaEvents] Event mediaEvents
     * @property {ITouchPointData|null} [touchPoint] Event touchPoint
     */

    /**
     * Constructs a new Event.
     * @exports Event
     * @classdesc Represents an Event.
     * @implements IEvent
     * @constructor
     * @param {IEvent=} [properties] Properties to set
     */
    function Event(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Event deltaTime.
     * @member {number} deltaTime
     * @memberof Event
     * @instance
     */
    Event.prototype.deltaTime = 0;

    /**
     * Event eventType.
     * @member {Event.EventType} eventType
     * @memberof Event
     * @instance
     */
    Event.prototype.eventType = 0;

    /**
     * Event pointerMove.
     * @member {IPointerMoveData|null|undefined} pointerMove
     * @memberof Event
     * @instance
     */
    Event.prototype.pointerMove = null;

    /**
     * Event keyBuffer.
     * @member {IKeyBufferData|null|undefined} keyBuffer
     * @memberof Event
     * @instance
     */
    Event.prototype.keyBuffer = null;

    /**
     * Event windowState.
     * @member {IWindowStateData|null|undefined} windowState
     * @memberof Event
     * @instance
     */
    Event.prototype.windowState = null;

    /**
     * Event contentID.
     * @member {IContentIDData|null|undefined} contentID
     * @memberof Event
     * @instance
     */
    Event.prototype.contentID = null;

    /**
     * Event mediaEvents.
     * @member {IMediaEventData|null|undefined} mediaEvents
     * @memberof Event
     * @instance
     */
    Event.prototype.mediaEvents = null;

    /**
     * Event touchPoint.
     * @member {ITouchPointData|null|undefined} touchPoint
     * @memberof Event
     * @instance
     */
    Event.prototype.touchPoint = null;

    // OneOf field names bound to virtual getters and setters
    var $oneOfFields;

    /**
     * Event data.
     * @member {"pointerMove"|"keyBuffer"|"windowState"|"contentID"|"mediaEvents"|"touchPoint"|undefined} data
     * @memberof Event
     * @instance
     */
    Object.defineProperty(Event.prototype, "data", {
        get: $util.oneOfGetter($oneOfFields = ["pointerMove", "keyBuffer", "windowState", "contentID", "mediaEvents", "touchPoint"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    /**
     * Creates a new Event instance using the specified properties.
     * @function create
     * @memberof Event
     * @static
     * @param {IEvent=} [properties] Properties to set
     * @returns {Event} Event instance
     */
    Event.create = function create(properties) {
        return new Event(properties);
    };

    /**
     * Encodes the specified Event message. Does not implicitly {@link Event.verify|verify} messages.
     * @function encode
     * @memberof Event
     * @static
     * @param {IEvent} message Event message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Event.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.deltaTime != null && message.hasOwnProperty("deltaTime"))
            writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.deltaTime);
        if (message.eventType != null && message.hasOwnProperty("eventType"))
            writer.uint32(/* id 2, wireType 0 =*/16).int32(message.eventType);
        if (message.pointerMove != null && message.hasOwnProperty("pointerMove"))
            $root.PointerMoveData.encode(message.pointerMove, writer.uint32(/* id 50, wireType 2 =*/402).fork()).ldelim();
        if (message.keyBuffer != null && message.hasOwnProperty("keyBuffer"))
            $root.KeyBufferData.encode(message.keyBuffer, writer.uint32(/* id 51, wireType 2 =*/410).fork()).ldelim();
        if (message.windowState != null && message.hasOwnProperty("windowState"))
            $root.WindowStateData.encode(message.windowState, writer.uint32(/* id 52, wireType 2 =*/418).fork()).ldelim();
        if (message.contentID != null && message.hasOwnProperty("contentID"))
            $root.ContentIDData.encode(message.contentID, writer.uint32(/* id 53, wireType 2 =*/426).fork()).ldelim();
        if (message.mediaEvents != null && message.hasOwnProperty("mediaEvents"))
            $root.MediaEventData.encode(message.mediaEvents, writer.uint32(/* id 54, wireType 2 =*/434).fork()).ldelim();
        if (message.touchPoint != null && message.hasOwnProperty("touchPoint"))
            $root.TouchPointData.encode(message.touchPoint, writer.uint32(/* id 55, wireType 2 =*/442).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified Event message, length delimited. Does not implicitly {@link Event.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Event
     * @static
     * @param {IEvent} message Event message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Event.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an Event message from the specified reader or buffer.
     * @function decode
     * @memberof Event
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Event} Event
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Event.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Event();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.deltaTime = reader.uint32();
                break;
            case 2:
                message.eventType = reader.int32();
                break;
            case 50:
                message.pointerMove = $root.PointerMoveData.decode(reader, reader.uint32());
                break;
            case 51:
                message.keyBuffer = $root.KeyBufferData.decode(reader, reader.uint32());
                break;
            case 52:
                message.windowState = $root.WindowStateData.decode(reader, reader.uint32());
                break;
            case 53:
                message.contentID = $root.ContentIDData.decode(reader, reader.uint32());
                break;
            case 54:
                message.mediaEvents = $root.MediaEventData.decode(reader, reader.uint32());
                break;
            case 55:
                message.touchPoint = $root.TouchPointData.decode(reader, reader.uint32());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes an Event message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Event
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Event} Event
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Event.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an Event message.
     * @function verify
     * @memberof Event
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Event.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        var properties = {};
        if (message.deltaTime != null && message.hasOwnProperty("deltaTime"))
            if (!$util.isInteger(message.deltaTime))
                return "deltaTime: integer expected";
        if (message.eventType != null && message.hasOwnProperty("eventType"))
            switch (message.eventType) {
            default:
                return "eventType: enum value expected";
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
                break;
            }
        if (message.pointerMove != null && message.hasOwnProperty("pointerMove")) {
            properties.data = 1;
            {
                var error = $root.PointerMoveData.verify(message.pointerMove);
                if (error)
                    return "pointerMove." + error;
            }
        }
        if (message.keyBuffer != null && message.hasOwnProperty("keyBuffer")) {
            if (properties.data === 1)
                return "data: multiple values";
            properties.data = 1;
            {
                var error = $root.KeyBufferData.verify(message.keyBuffer);
                if (error)
                    return "keyBuffer." + error;
            }
        }
        if (message.windowState != null && message.hasOwnProperty("windowState")) {
            if (properties.data === 1)
                return "data: multiple values";
            properties.data = 1;
            {
                var error = $root.WindowStateData.verify(message.windowState);
                if (error)
                    return "windowState." + error;
            }
        }
        if (message.contentID != null && message.hasOwnProperty("contentID")) {
            if (properties.data === 1)
                return "data: multiple values";
            properties.data = 1;
            {
                var error = $root.ContentIDData.verify(message.contentID);
                if (error)
                    return "contentID." + error;
            }
        }
        if (message.mediaEvents != null && message.hasOwnProperty("mediaEvents")) {
            if (properties.data === 1)
                return "data: multiple values";
            properties.data = 1;
            {
                var error = $root.MediaEventData.verify(message.mediaEvents);
                if (error)
                    return "mediaEvents." + error;
            }
        }
        if (message.touchPoint != null && message.hasOwnProperty("touchPoint")) {
            if (properties.data === 1)
                return "data: multiple values";
            properties.data = 1;
            {
                var error = $root.TouchPointData.verify(message.touchPoint);
                if (error)
                    return "touchPoint." + error;
            }
        }
        return null;
    };

    /**
     * Creates an Event message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Event
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Event} Event
     */
    Event.fromObject = function fromObject(object) {
        if (object instanceof $root.Event)
            return object;
        var message = new $root.Event();
        if (object.deltaTime != null)
            message.deltaTime = object.deltaTime >>> 0;
        switch (object.eventType) {
        case "INVALID_TYPE":
        case 0:
            message.eventType = 0;
            break;
        case "POINTER_MOVE":
        case 1:
            message.eventType = 1;
            break;
        case "KEY_BUFFER":
        case 2:
            message.eventType = 2;
            break;
        case "WIN_STATE":
        case 3:
            message.eventType = 3;
            break;
        case "CONTENT_ID":
        case 4:
            message.eventType = 4;
            break;
        case "MEDIA_EVENTS":
        case 5:
            message.eventType = 5;
            break;
        case "TOUCH_POINTS":
        case 6:
            message.eventType = 6;
            break;
        }
        if (object.pointerMove != null) {
            if (typeof object.pointerMove !== "object")
                throw TypeError(".Event.pointerMove: object expected");
            message.pointerMove = $root.PointerMoveData.fromObject(object.pointerMove);
        }
        if (object.keyBuffer != null) {
            if (typeof object.keyBuffer !== "object")
                throw TypeError(".Event.keyBuffer: object expected");
            message.keyBuffer = $root.KeyBufferData.fromObject(object.keyBuffer);
        }
        if (object.windowState != null) {
            if (typeof object.windowState !== "object")
                throw TypeError(".Event.windowState: object expected");
            message.windowState = $root.WindowStateData.fromObject(object.windowState);
        }
        if (object.contentID != null) {
            if (typeof object.contentID !== "object")
                throw TypeError(".Event.contentID: object expected");
            message.contentID = $root.ContentIDData.fromObject(object.contentID);
        }
        if (object.mediaEvents != null) {
            if (typeof object.mediaEvents !== "object")
                throw TypeError(".Event.mediaEvents: object expected");
            message.mediaEvents = $root.MediaEventData.fromObject(object.mediaEvents);
        }
        if (object.touchPoint != null) {
            if (typeof object.touchPoint !== "object")
                throw TypeError(".Event.touchPoint: object expected");
            message.touchPoint = $root.TouchPointData.fromObject(object.touchPoint);
        }
        return message;
    };

    /**
     * Creates a plain object from an Event message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Event
     * @static
     * @param {Event} message Event
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Event.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.deltaTime = 0;
            object.eventType = options.enums === String ? "INVALID_TYPE" : 0;
        }
        if (message.deltaTime != null && message.hasOwnProperty("deltaTime"))
            object.deltaTime = message.deltaTime;
        if (message.eventType != null && message.hasOwnProperty("eventType"))
            object.eventType = options.enums === String ? $root.Event.EventType[message.eventType] : message.eventType;
        if (message.pointerMove != null && message.hasOwnProperty("pointerMove")) {
            object.pointerMove = $root.PointerMoveData.toObject(message.pointerMove, options);
            if (options.oneofs)
                object.data = "pointerMove";
        }
        if (message.keyBuffer != null && message.hasOwnProperty("keyBuffer")) {
            object.keyBuffer = $root.KeyBufferData.toObject(message.keyBuffer, options);
            if (options.oneofs)
                object.data = "keyBuffer";
        }
        if (message.windowState != null && message.hasOwnProperty("windowState")) {
            object.windowState = $root.WindowStateData.toObject(message.windowState, options);
            if (options.oneofs)
                object.data = "windowState";
        }
        if (message.contentID != null && message.hasOwnProperty("contentID")) {
            object.contentID = $root.ContentIDData.toObject(message.contentID, options);
            if (options.oneofs)
                object.data = "contentID";
        }
        if (message.mediaEvents != null && message.hasOwnProperty("mediaEvents")) {
            object.mediaEvents = $root.MediaEventData.toObject(message.mediaEvents, options);
            if (options.oneofs)
                object.data = "mediaEvents";
        }
        if (message.touchPoint != null && message.hasOwnProperty("touchPoint")) {
            object.touchPoint = $root.TouchPointData.toObject(message.touchPoint, options);
            if (options.oneofs)
                object.data = "touchPoint";
        }
        return object;
    };

    /**
     * Converts this Event to JSON.
     * @function toJSON
     * @memberof Event
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Event.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * EventType enum.
     * @name Event.EventType
     * @enum {string}
     * @property {number} INVALID_TYPE=0 INVALID_TYPE value
     * @property {number} POINTER_MOVE=1 POINTER_MOVE value
     * @property {number} KEY_BUFFER=2 KEY_BUFFER value
     * @property {number} WIN_STATE=3 WIN_STATE value
     * @property {number} CONTENT_ID=4 CONTENT_ID value
     * @property {number} MEDIA_EVENTS=5 MEDIA_EVENTS value
     * @property {number} TOUCH_POINTS=6 TOUCH_POINTS value
     */
    Event.EventType = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "INVALID_TYPE"] = 0;
        values[valuesById[1] = "POINTER_MOVE"] = 1;
        values[valuesById[2] = "KEY_BUFFER"] = 2;
        values[valuesById[3] = "WIN_STATE"] = 3;
        values[valuesById[4] = "CONTENT_ID"] = 4;
        values[valuesById[5] = "MEDIA_EVENTS"] = 5;
        values[valuesById[6] = "TOUCH_POINTS"] = 6;
        return values;
    })();

    return Event;
})();

$root.MediaEventData = (function() {

    /**
     * Properties of a MediaEventData.
     * @exports IMediaEventData
     * @interface IMediaEventData
     * @property {string|null} [mediaID] MediaEventData mediaID
     * @property {Array.<IMediaEvent>|null} [events] MediaEventData events
     */

    /**
     * Constructs a new MediaEventData.
     * @exports MediaEventData
     * @classdesc Represents a MediaEventData.
     * @implements IMediaEventData
     * @constructor
     * @param {IMediaEventData=} [properties] Properties to set
     */
    function MediaEventData(properties) {
        this.events = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * MediaEventData mediaID.
     * @member {string} mediaID
     * @memberof MediaEventData
     * @instance
     */
    MediaEventData.prototype.mediaID = "";

    /**
     * MediaEventData events.
     * @member {Array.<IMediaEvent>} events
     * @memberof MediaEventData
     * @instance
     */
    MediaEventData.prototype.events = $util.emptyArray;

    /**
     * Creates a new MediaEventData instance using the specified properties.
     * @function create
     * @memberof MediaEventData
     * @static
     * @param {IMediaEventData=} [properties] Properties to set
     * @returns {MediaEventData} MediaEventData instance
     */
    MediaEventData.create = function create(properties) {
        return new MediaEventData(properties);
    };

    /**
     * Encodes the specified MediaEventData message. Does not implicitly {@link MediaEventData.verify|verify} messages.
     * @function encode
     * @memberof MediaEventData
     * @static
     * @param {IMediaEventData} message MediaEventData message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    MediaEventData.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.mediaID != null && message.hasOwnProperty("mediaID"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.mediaID);
        if (message.events != null && message.events.length)
            for (var i = 0; i < message.events.length; ++i)
                $root.MediaEvent.encode(message.events[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified MediaEventData message, length delimited. Does not implicitly {@link MediaEventData.verify|verify} messages.
     * @function encodeDelimited
     * @memberof MediaEventData
     * @static
     * @param {IMediaEventData} message MediaEventData message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    MediaEventData.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a MediaEventData message from the specified reader or buffer.
     * @function decode
     * @memberof MediaEventData
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {MediaEventData} MediaEventData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    MediaEventData.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.MediaEventData();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.mediaID = reader.string();
                break;
            case 2:
                if (!(message.events && message.events.length))
                    message.events = [];
                message.events.push($root.MediaEvent.decode(reader, reader.uint32()));
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a MediaEventData message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof MediaEventData
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {MediaEventData} MediaEventData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    MediaEventData.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a MediaEventData message.
     * @function verify
     * @memberof MediaEventData
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    MediaEventData.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.mediaID != null && message.hasOwnProperty("mediaID"))
            if (!$util.isString(message.mediaID))
                return "mediaID: string expected";
        if (message.events != null && message.hasOwnProperty("events")) {
            if (!Array.isArray(message.events))
                return "events: array expected";
            for (var i = 0; i < message.events.length; ++i) {
                var error = $root.MediaEvent.verify(message.events[i]);
                if (error)
                    return "events." + error;
            }
        }
        return null;
    };

    /**
     * Creates a MediaEventData message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof MediaEventData
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {MediaEventData} MediaEventData
     */
    MediaEventData.fromObject = function fromObject(object) {
        if (object instanceof $root.MediaEventData)
            return object;
        var message = new $root.MediaEventData();
        if (object.mediaID != null)
            message.mediaID = String(object.mediaID);
        if (object.events) {
            if (!Array.isArray(object.events))
                throw TypeError(".MediaEventData.events: array expected");
            message.events = [];
            for (var i = 0; i < object.events.length; ++i) {
                if (typeof object.events[i] !== "object")
                    throw TypeError(".MediaEventData.events: object expected");
                message.events[i] = $root.MediaEvent.fromObject(object.events[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from a MediaEventData message. Also converts values to other types if specified.
     * @function toObject
     * @memberof MediaEventData
     * @static
     * @param {MediaEventData} message MediaEventData
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    MediaEventData.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.events = [];
        if (options.defaults)
            object.mediaID = "";
        if (message.mediaID != null && message.hasOwnProperty("mediaID"))
            object.mediaID = message.mediaID;
        if (message.events && message.events.length) {
            object.events = [];
            for (var j = 0; j < message.events.length; ++j)
                object.events[j] = $root.MediaEvent.toObject(message.events[j], options);
        }
        return object;
    };

    /**
     * Converts this MediaEventData to JSON.
     * @function toJSON
     * @memberof MediaEventData
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    MediaEventData.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return MediaEventData;
})();

$root.MediaEvent = (function() {

    /**
     * Properties of a MediaEvent.
     * @exports IMediaEvent
     * @interface IMediaEvent
     * @property {MediaEvent.MediaEventType|null} [type] MediaEvent type
     * @property {number|null} [deltaTime] MediaEvent deltaTime
     * @property {number|null} [currentTime] MediaEvent currentTime
     */

    /**
     * Constructs a new MediaEvent.
     * @exports MediaEvent
     * @classdesc Represents a MediaEvent.
     * @implements IMediaEvent
     * @constructor
     * @param {IMediaEvent=} [properties] Properties to set
     */
    function MediaEvent(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * MediaEvent type.
     * @member {MediaEvent.MediaEventType} type
     * @memberof MediaEvent
     * @instance
     */
    MediaEvent.prototype.type = 0;

    /**
     * MediaEvent deltaTime.
     * @member {number} deltaTime
     * @memberof MediaEvent
     * @instance
     */
    MediaEvent.prototype.deltaTime = 0;

    /**
     * MediaEvent currentTime.
     * @member {number} currentTime
     * @memberof MediaEvent
     * @instance
     */
    MediaEvent.prototype.currentTime = 0;

    /**
     * Creates a new MediaEvent instance using the specified properties.
     * @function create
     * @memberof MediaEvent
     * @static
     * @param {IMediaEvent=} [properties] Properties to set
     * @returns {MediaEvent} MediaEvent instance
     */
    MediaEvent.create = function create(properties) {
        return new MediaEvent(properties);
    };

    /**
     * Encodes the specified MediaEvent message. Does not implicitly {@link MediaEvent.verify|verify} messages.
     * @function encode
     * @memberof MediaEvent
     * @static
     * @param {IMediaEvent} message MediaEvent message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    MediaEvent.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.type != null && message.hasOwnProperty("type"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.type);
        if (message.deltaTime != null && message.hasOwnProperty("deltaTime"))
            writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.deltaTime);
        if (message.currentTime != null && message.hasOwnProperty("currentTime"))
            writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.currentTime);
        return writer;
    };

    /**
     * Encodes the specified MediaEvent message, length delimited. Does not implicitly {@link MediaEvent.verify|verify} messages.
     * @function encodeDelimited
     * @memberof MediaEvent
     * @static
     * @param {IMediaEvent} message MediaEvent message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    MediaEvent.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a MediaEvent message from the specified reader or buffer.
     * @function decode
     * @memberof MediaEvent
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {MediaEvent} MediaEvent
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    MediaEvent.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.MediaEvent();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.type = reader.int32();
                break;
            case 2:
                message.deltaTime = reader.uint32();
                break;
            case 3:
                message.currentTime = reader.uint32();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a MediaEvent message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof MediaEvent
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {MediaEvent} MediaEvent
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    MediaEvent.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a MediaEvent message.
     * @function verify
     * @memberof MediaEvent
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    MediaEvent.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.type != null && message.hasOwnProperty("type"))
            switch (message.type) {
            default:
                return "type: enum value expected";
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
                break;
            }
        if (message.deltaTime != null && message.hasOwnProperty("deltaTime"))
            if (!$util.isInteger(message.deltaTime))
                return "deltaTime: integer expected";
        if (message.currentTime != null && message.hasOwnProperty("currentTime"))
            if (!$util.isInteger(message.currentTime))
                return "currentTime: integer expected";
        return null;
    };

    /**
     * Creates a MediaEvent message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof MediaEvent
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {MediaEvent} MediaEvent
     */
    MediaEvent.fromObject = function fromObject(object) {
        if (object instanceof $root.MediaEvent)
            return object;
        var message = new $root.MediaEvent();
        switch (object.type) {
        case "INVALID_TYPE":
        case 0:
            message.type = 0;
            break;
        case "PLAY":
        case 1:
            message.type = 1;
            break;
        case "DURATIONCHANGE":
        case 2:
            message.type = 2;
            break;
        case "TIMEUPDATE":
        case 3:
            message.type = 3;
            break;
        case "PAUSE":
        case 4:
            message.type = 4;
            break;
        case "ENDED":
        case 5:
            message.type = 5;
            break;
        }
        if (object.deltaTime != null)
            message.deltaTime = object.deltaTime >>> 0;
        if (object.currentTime != null)
            message.currentTime = object.currentTime >>> 0;
        return message;
    };

    /**
     * Creates a plain object from a MediaEvent message. Also converts values to other types if specified.
     * @function toObject
     * @memberof MediaEvent
     * @static
     * @param {MediaEvent} message MediaEvent
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    MediaEvent.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.type = options.enums === String ? "INVALID_TYPE" : 0;
            object.deltaTime = 0;
            object.currentTime = 0;
        }
        if (message.type != null && message.hasOwnProperty("type"))
            object.type = options.enums === String ? $root.MediaEvent.MediaEventType[message.type] : message.type;
        if (message.deltaTime != null && message.hasOwnProperty("deltaTime"))
            object.deltaTime = message.deltaTime;
        if (message.currentTime != null && message.hasOwnProperty("currentTime"))
            object.currentTime = message.currentTime;
        return object;
    };

    /**
     * Converts this MediaEvent to JSON.
     * @function toJSON
     * @memberof MediaEvent
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    MediaEvent.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * MediaEventType enum.
     * @name MediaEvent.MediaEventType
     * @enum {string}
     * @property {number} INVALID_TYPE=0 INVALID_TYPE value
     * @property {number} PLAY=1 PLAY value
     * @property {number} DURATIONCHANGE=2 DURATIONCHANGE value
     * @property {number} TIMEUPDATE=3 TIMEUPDATE value
     * @property {number} PAUSE=4 PAUSE value
     * @property {number} ENDED=5 ENDED value
     */
    MediaEvent.MediaEventType = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "INVALID_TYPE"] = 0;
        values[valuesById[1] = "PLAY"] = 1;
        values[valuesById[2] = "DURATIONCHANGE"] = 2;
        values[valuesById[3] = "TIMEUPDATE"] = 3;
        values[valuesById[4] = "PAUSE"] = 4;
        values[valuesById[5] = "ENDED"] = 5;
        return values;
    })();

    return MediaEvent;
})();

$root.WindowStateData = (function() {

    /**
     * Properties of a WindowStateData.
     * @exports IWindowStateData
     * @interface IWindowStateData
     * @property {WindowStateData.WindowStateType|null} [type] WindowStateData type
     */

    /**
     * Constructs a new WindowStateData.
     * @exports WindowStateData
     * @classdesc Represents a WindowStateData.
     * @implements IWindowStateData
     * @constructor
     * @param {IWindowStateData=} [properties] Properties to set
     */
    function WindowStateData(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * WindowStateData type.
     * @member {WindowStateData.WindowStateType} type
     * @memberof WindowStateData
     * @instance
     */
    WindowStateData.prototype.type = 0;

    /**
     * Creates a new WindowStateData instance using the specified properties.
     * @function create
     * @memberof WindowStateData
     * @static
     * @param {IWindowStateData=} [properties] Properties to set
     * @returns {WindowStateData} WindowStateData instance
     */
    WindowStateData.create = function create(properties) {
        return new WindowStateData(properties);
    };

    /**
     * Encodes the specified WindowStateData message. Does not implicitly {@link WindowStateData.verify|verify} messages.
     * @function encode
     * @memberof WindowStateData
     * @static
     * @param {IWindowStateData} message WindowStateData message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    WindowStateData.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.type != null && message.hasOwnProperty("type"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.type);
        return writer;
    };

    /**
     * Encodes the specified WindowStateData message, length delimited. Does not implicitly {@link WindowStateData.verify|verify} messages.
     * @function encodeDelimited
     * @memberof WindowStateData
     * @static
     * @param {IWindowStateData} message WindowStateData message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    WindowStateData.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a WindowStateData message from the specified reader or buffer.
     * @function decode
     * @memberof WindowStateData
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {WindowStateData} WindowStateData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    WindowStateData.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.WindowStateData();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.type = reader.int32();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a WindowStateData message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof WindowStateData
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {WindowStateData} WindowStateData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    WindowStateData.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a WindowStateData message.
     * @function verify
     * @memberof WindowStateData
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    WindowStateData.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.type != null && message.hasOwnProperty("type"))
            switch (message.type) {
            default:
                return "type: enum value expected";
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
            case 10:
                break;
            }
        return null;
    };

    /**
     * Creates a WindowStateData message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof WindowStateData
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {WindowStateData} WindowStateData
     */
    WindowStateData.fromObject = function fromObject(object) {
        if (object instanceof $root.WindowStateData)
            return object;
        var message = new $root.WindowStateData();
        switch (object.type) {
        case "INVALID_TYPE":
        case 0:
            message.type = 0;
            break;
        case "INIT":
        case 1:
            message.type = 1;
            break;
        case "LOAD":
        case 2:
            message.type = 2;
            break;
        case "UNLOAD":
        case 3:
            message.type = 3;
            break;
        case "FOCUS":
        case 4:
            message.type = 4;
            break;
        case "BLUR":
        case 5:
            message.type = 5;
            break;
        case "LOCATIONCHANGE":
        case 6:
            message.type = 6;
            break;
        case "VISIBLE":
        case 7:
            message.type = 7;
            break;
        case "HIDDEN":
        case 8:
            message.type = 8;
            break;
        case "ADDMEDIA":
        case 9:
            message.type = 9;
            break;
        case "REMOVEMEDIA":
        case 10:
            message.type = 10;
            break;
        }
        return message;
    };

    /**
     * Creates a plain object from a WindowStateData message. Also converts values to other types if specified.
     * @function toObject
     * @memberof WindowStateData
     * @static
     * @param {WindowStateData} message WindowStateData
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    WindowStateData.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            object.type = options.enums === String ? "INVALID_TYPE" : 0;
        if (message.type != null && message.hasOwnProperty("type"))
            object.type = options.enums === String ? $root.WindowStateData.WindowStateType[message.type] : message.type;
        return object;
    };

    /**
     * Converts this WindowStateData to JSON.
     * @function toJSON
     * @memberof WindowStateData
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    WindowStateData.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * WindowStateType enum.
     * @name WindowStateData.WindowStateType
     * @enum {string}
     * @property {number} INVALID_TYPE=0 INVALID_TYPE value
     * @property {number} INIT=1 INIT value
     * @property {number} LOAD=2 LOAD value
     * @property {number} UNLOAD=3 UNLOAD value
     * @property {number} FOCUS=4 FOCUS value
     * @property {number} BLUR=5 BLUR value
     * @property {number} LOCATIONCHANGE=6 LOCATIONCHANGE value
     * @property {number} VISIBLE=7 VISIBLE value
     * @property {number} HIDDEN=8 HIDDEN value
     * @property {number} ADDMEDIA=9 ADDMEDIA value
     * @property {number} REMOVEMEDIA=10 REMOVEMEDIA value
     */
    WindowStateData.WindowStateType = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "INVALID_TYPE"] = 0;
        values[valuesById[1] = "INIT"] = 1;
        values[valuesById[2] = "LOAD"] = 2;
        values[valuesById[3] = "UNLOAD"] = 3;
        values[valuesById[4] = "FOCUS"] = 4;
        values[valuesById[5] = "BLUR"] = 5;
        values[valuesById[6] = "LOCATIONCHANGE"] = 6;
        values[valuesById[7] = "VISIBLE"] = 7;
        values[valuesById[8] = "HIDDEN"] = 8;
        values[valuesById[9] = "ADDMEDIA"] = 9;
        values[valuesById[10] = "REMOVEMEDIA"] = 10;
        return values;
    })();

    return WindowStateData;
})();

$root.ContentIDData = (function() {

    /**
     * Properties of a ContentIDData.
     * @exports IContentIDData
     * @interface IContentIDData
     * @property {Uint8Array|null} [domain] ContentIDData domain
     * @property {Uint8Array|null} [user] ContentIDData user
     */

    /**
     * Constructs a new ContentIDData.
     * @exports ContentIDData
     * @classdesc Represents a ContentIDData.
     * @implements IContentIDData
     * @constructor
     * @param {IContentIDData=} [properties] Properties to set
     */
    function ContentIDData(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * ContentIDData domain.
     * @member {Uint8Array} domain
     * @memberof ContentIDData
     * @instance
     */
    ContentIDData.prototype.domain = $util.newBuffer([]);

    /**
     * ContentIDData user.
     * @member {Uint8Array} user
     * @memberof ContentIDData
     * @instance
     */
    ContentIDData.prototype.user = $util.newBuffer([]);

    /**
     * Creates a new ContentIDData instance using the specified properties.
     * @function create
     * @memberof ContentIDData
     * @static
     * @param {IContentIDData=} [properties] Properties to set
     * @returns {ContentIDData} ContentIDData instance
     */
    ContentIDData.create = function create(properties) {
        return new ContentIDData(properties);
    };

    /**
     * Encodes the specified ContentIDData message. Does not implicitly {@link ContentIDData.verify|verify} messages.
     * @function encode
     * @memberof ContentIDData
     * @static
     * @param {IContentIDData} message ContentIDData message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ContentIDData.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.domain != null && message.hasOwnProperty("domain"))
            writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.domain);
        if (message.user != null && message.hasOwnProperty("user"))
            writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.user);
        return writer;
    };

    /**
     * Encodes the specified ContentIDData message, length delimited. Does not implicitly {@link ContentIDData.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ContentIDData
     * @static
     * @param {IContentIDData} message ContentIDData message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ContentIDData.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a ContentIDData message from the specified reader or buffer.
     * @function decode
     * @memberof ContentIDData
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ContentIDData} ContentIDData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ContentIDData.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.ContentIDData();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.domain = reader.bytes();
                break;
            case 2:
                message.user = reader.bytes();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a ContentIDData message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ContentIDData
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ContentIDData} ContentIDData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ContentIDData.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a ContentIDData message.
     * @function verify
     * @memberof ContentIDData
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    ContentIDData.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.domain != null && message.hasOwnProperty("domain"))
            if (!(message.domain && typeof message.domain.length === "number" || $util.isString(message.domain)))
                return "domain: buffer expected";
        if (message.user != null && message.hasOwnProperty("user"))
            if (!(message.user && typeof message.user.length === "number" || $util.isString(message.user)))
                return "user: buffer expected";
        return null;
    };

    /**
     * Creates a ContentIDData message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ContentIDData
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ContentIDData} ContentIDData
     */
    ContentIDData.fromObject = function fromObject(object) {
        if (object instanceof $root.ContentIDData)
            return object;
        var message = new $root.ContentIDData();
        if (object.domain != null)
            if (typeof object.domain === "string")
                $util.base64.decode(object.domain, message.domain = $util.newBuffer($util.base64.length(object.domain)), 0);
            else if (object.domain.length)
                message.domain = object.domain;
        if (object.user != null)
            if (typeof object.user === "string")
                $util.base64.decode(object.user, message.user = $util.newBuffer($util.base64.length(object.user)), 0);
            else if (object.user.length)
                message.user = object.user;
        return message;
    };

    /**
     * Creates a plain object from a ContentIDData message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ContentIDData
     * @static
     * @param {ContentIDData} message ContentIDData
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    ContentIDData.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            if (options.bytes === String)
                object.domain = "";
            else {
                object.domain = [];
                if (options.bytes !== Array)
                    object.domain = $util.newBuffer(object.domain);
            }
            if (options.bytes === String)
                object.user = "";
            else {
                object.user = [];
                if (options.bytes !== Array)
                    object.user = $util.newBuffer(object.user);
            }
        }
        if (message.domain != null && message.hasOwnProperty("domain"))
            object.domain = options.bytes === String ? $util.base64.encode(message.domain, 0, message.domain.length) : options.bytes === Array ? Array.prototype.slice.call(message.domain) : message.domain;
        if (message.user != null && message.hasOwnProperty("user"))
            object.user = options.bytes === String ? $util.base64.encode(message.user, 0, message.user.length) : options.bytes === Array ? Array.prototype.slice.call(message.user) : message.user;
        return object;
    };

    /**
     * Converts this ContentIDData to JSON.
     * @function toJSON
     * @memberof ContentIDData
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    ContentIDData.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return ContentIDData;
})();

$root.PointerMoveData = (function() {

    /**
     * Properties of a PointerMoveData.
     * @exports IPointerMoveData
     * @interface IPointerMoveData
     * @property {Array.<IPathPoint>|null} [points] PointerMoveData points
     */

    /**
     * Constructs a new PointerMoveData.
     * @exports PointerMoveData
     * @classdesc Represents a PointerMoveData.
     * @implements IPointerMoveData
     * @constructor
     * @param {IPointerMoveData=} [properties] Properties to set
     */
    function PointerMoveData(properties) {
        this.points = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * PointerMoveData points.
     * @member {Array.<IPathPoint>} points
     * @memberof PointerMoveData
     * @instance
     */
    PointerMoveData.prototype.points = $util.emptyArray;

    /**
     * Creates a new PointerMoveData instance using the specified properties.
     * @function create
     * @memberof PointerMoveData
     * @static
     * @param {IPointerMoveData=} [properties] Properties to set
     * @returns {PointerMoveData} PointerMoveData instance
     */
    PointerMoveData.create = function create(properties) {
        return new PointerMoveData(properties);
    };

    /**
     * Encodes the specified PointerMoveData message. Does not implicitly {@link PointerMoveData.verify|verify} messages.
     * @function encode
     * @memberof PointerMoveData
     * @static
     * @param {IPointerMoveData} message PointerMoveData message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    PointerMoveData.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.points != null && message.points.length)
            for (var i = 0; i < message.points.length; ++i)
                $root.PathPoint.encode(message.points[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified PointerMoveData message, length delimited. Does not implicitly {@link PointerMoveData.verify|verify} messages.
     * @function encodeDelimited
     * @memberof PointerMoveData
     * @static
     * @param {IPointerMoveData} message PointerMoveData message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    PointerMoveData.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a PointerMoveData message from the specified reader or buffer.
     * @function decode
     * @memberof PointerMoveData
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {PointerMoveData} PointerMoveData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    PointerMoveData.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.PointerMoveData();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                if (!(message.points && message.points.length))
                    message.points = [];
                message.points.push($root.PathPoint.decode(reader, reader.uint32()));
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a PointerMoveData message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof PointerMoveData
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {PointerMoveData} PointerMoveData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    PointerMoveData.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a PointerMoveData message.
     * @function verify
     * @memberof PointerMoveData
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    PointerMoveData.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.points != null && message.hasOwnProperty("points")) {
            if (!Array.isArray(message.points))
                return "points: array expected";
            for (var i = 0; i < message.points.length; ++i) {
                var error = $root.PathPoint.verify(message.points[i]);
                if (error)
                    return "points." + error;
            }
        }
        return null;
    };

    /**
     * Creates a PointerMoveData message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof PointerMoveData
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {PointerMoveData} PointerMoveData
     */
    PointerMoveData.fromObject = function fromObject(object) {
        if (object instanceof $root.PointerMoveData)
            return object;
        var message = new $root.PointerMoveData();
        if (object.points) {
            if (!Array.isArray(object.points))
                throw TypeError(".PointerMoveData.points: array expected");
            message.points = [];
            for (var i = 0; i < object.points.length; ++i) {
                if (typeof object.points[i] !== "object")
                    throw TypeError(".PointerMoveData.points: object expected");
                message.points[i] = $root.PathPoint.fromObject(object.points[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from a PointerMoveData message. Also converts values to other types if specified.
     * @function toObject
     * @memberof PointerMoveData
     * @static
     * @param {PointerMoveData} message PointerMoveData
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    PointerMoveData.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.points = [];
        if (message.points && message.points.length) {
            object.points = [];
            for (var j = 0; j < message.points.length; ++j)
                object.points[j] = $root.PathPoint.toObject(message.points[j], options);
        }
        return object;
    };

    /**
     * Converts this PointerMoveData to JSON.
     * @function toJSON
     * @memberof PointerMoveData
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    PointerMoveData.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return PointerMoveData;
})();

$root.TouchPointData = (function() {

    /**
     * Properties of a TouchPointData.
     * @exports ITouchPointData
     * @interface ITouchPointData
     * @property {Array.<ITouchPoint>|null} [points] TouchPointData points
     */

    /**
     * Constructs a new TouchPointData.
     * @exports TouchPointData
     * @classdesc Represents a TouchPointData.
     * @implements ITouchPointData
     * @constructor
     * @param {ITouchPointData=} [properties] Properties to set
     */
    function TouchPointData(properties) {
        this.points = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * TouchPointData points.
     * @member {Array.<ITouchPoint>} points
     * @memberof TouchPointData
     * @instance
     */
    TouchPointData.prototype.points = $util.emptyArray;

    /**
     * Creates a new TouchPointData instance using the specified properties.
     * @function create
     * @memberof TouchPointData
     * @static
     * @param {ITouchPointData=} [properties] Properties to set
     * @returns {TouchPointData} TouchPointData instance
     */
    TouchPointData.create = function create(properties) {
        return new TouchPointData(properties);
    };

    /**
     * Encodes the specified TouchPointData message. Does not implicitly {@link TouchPointData.verify|verify} messages.
     * @function encode
     * @memberof TouchPointData
     * @static
     * @param {ITouchPointData} message TouchPointData message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    TouchPointData.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.points != null && message.points.length)
            for (var i = 0; i < message.points.length; ++i)
                $root.TouchPoint.encode(message.points[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified TouchPointData message, length delimited. Does not implicitly {@link TouchPointData.verify|verify} messages.
     * @function encodeDelimited
     * @memberof TouchPointData
     * @static
     * @param {ITouchPointData} message TouchPointData message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    TouchPointData.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a TouchPointData message from the specified reader or buffer.
     * @function decode
     * @memberof TouchPointData
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {TouchPointData} TouchPointData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    TouchPointData.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.TouchPointData();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                if (!(message.points && message.points.length))
                    message.points = [];
                message.points.push($root.TouchPoint.decode(reader, reader.uint32()));
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a TouchPointData message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof TouchPointData
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {TouchPointData} TouchPointData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    TouchPointData.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a TouchPointData message.
     * @function verify
     * @memberof TouchPointData
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    TouchPointData.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.points != null && message.hasOwnProperty("points")) {
            if (!Array.isArray(message.points))
                return "points: array expected";
            for (var i = 0; i < message.points.length; ++i) {
                var error = $root.TouchPoint.verify(message.points[i]);
                if (error)
                    return "points." + error;
            }
        }
        return null;
    };

    /**
     * Creates a TouchPointData message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof TouchPointData
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {TouchPointData} TouchPointData
     */
    TouchPointData.fromObject = function fromObject(object) {
        if (object instanceof $root.TouchPointData)
            return object;
        var message = new $root.TouchPointData();
        if (object.points) {
            if (!Array.isArray(object.points))
                throw TypeError(".TouchPointData.points: array expected");
            message.points = [];
            for (var i = 0; i < object.points.length; ++i) {
                if (typeof object.points[i] !== "object")
                    throw TypeError(".TouchPointData.points: object expected");
                message.points[i] = $root.TouchPoint.fromObject(object.points[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from a TouchPointData message. Also converts values to other types if specified.
     * @function toObject
     * @memberof TouchPointData
     * @static
     * @param {TouchPointData} message TouchPointData
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    TouchPointData.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.points = [];
        if (message.points && message.points.length) {
            object.points = [];
            for (var j = 0; j < message.points.length; ++j)
                object.points[j] = $root.TouchPoint.toObject(message.points[j], options);
        }
        return object;
    };

    /**
     * Converts this TouchPointData to JSON.
     * @function toJSON
     * @memberof TouchPointData
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    TouchPointData.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return TouchPointData;
})();

$root.KeyBufferData = (function() {

    /**
     * Properties of a KeyBufferData.
     * @exports IKeyBufferData
     * @interface IKeyBufferData
     * @property {Array.<IKeyPress>|null} [presses] KeyBufferData presses
     */

    /**
     * Constructs a new KeyBufferData.
     * @exports KeyBufferData
     * @classdesc Represents a KeyBufferData.
     * @implements IKeyBufferData
     * @constructor
     * @param {IKeyBufferData=} [properties] Properties to set
     */
    function KeyBufferData(properties) {
        this.presses = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * KeyBufferData presses.
     * @member {Array.<IKeyPress>} presses
     * @memberof KeyBufferData
     * @instance
     */
    KeyBufferData.prototype.presses = $util.emptyArray;

    /**
     * Creates a new KeyBufferData instance using the specified properties.
     * @function create
     * @memberof KeyBufferData
     * @static
     * @param {IKeyBufferData=} [properties] Properties to set
     * @returns {KeyBufferData} KeyBufferData instance
     */
    KeyBufferData.create = function create(properties) {
        return new KeyBufferData(properties);
    };

    /**
     * Encodes the specified KeyBufferData message. Does not implicitly {@link KeyBufferData.verify|verify} messages.
     * @function encode
     * @memberof KeyBufferData
     * @static
     * @param {IKeyBufferData} message KeyBufferData message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    KeyBufferData.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.presses != null && message.presses.length)
            for (var i = 0; i < message.presses.length; ++i)
                $root.KeyPress.encode(message.presses[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified KeyBufferData message, length delimited. Does not implicitly {@link KeyBufferData.verify|verify} messages.
     * @function encodeDelimited
     * @memberof KeyBufferData
     * @static
     * @param {IKeyBufferData} message KeyBufferData message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    KeyBufferData.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a KeyBufferData message from the specified reader or buffer.
     * @function decode
     * @memberof KeyBufferData
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {KeyBufferData} KeyBufferData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    KeyBufferData.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.KeyBufferData();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                if (!(message.presses && message.presses.length))
                    message.presses = [];
                message.presses.push($root.KeyPress.decode(reader, reader.uint32()));
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a KeyBufferData message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof KeyBufferData
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {KeyBufferData} KeyBufferData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    KeyBufferData.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a KeyBufferData message.
     * @function verify
     * @memberof KeyBufferData
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    KeyBufferData.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.presses != null && message.hasOwnProperty("presses")) {
            if (!Array.isArray(message.presses))
                return "presses: array expected";
            for (var i = 0; i < message.presses.length; ++i) {
                var error = $root.KeyPress.verify(message.presses[i]);
                if (error)
                    return "presses." + error;
            }
        }
        return null;
    };

    /**
     * Creates a KeyBufferData message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof KeyBufferData
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {KeyBufferData} KeyBufferData
     */
    KeyBufferData.fromObject = function fromObject(object) {
        if (object instanceof $root.KeyBufferData)
            return object;
        var message = new $root.KeyBufferData();
        if (object.presses) {
            if (!Array.isArray(object.presses))
                throw TypeError(".KeyBufferData.presses: array expected");
            message.presses = [];
            for (var i = 0; i < object.presses.length; ++i) {
                if (typeof object.presses[i] !== "object")
                    throw TypeError(".KeyBufferData.presses: object expected");
                message.presses[i] = $root.KeyPress.fromObject(object.presses[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from a KeyBufferData message. Also converts values to other types if specified.
     * @function toObject
     * @memberof KeyBufferData
     * @static
     * @param {KeyBufferData} message KeyBufferData
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    KeyBufferData.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.presses = [];
        if (message.presses && message.presses.length) {
            object.presses = [];
            for (var j = 0; j < message.presses.length; ++j)
                object.presses[j] = $root.KeyPress.toObject(message.presses[j], options);
        }
        return object;
    };

    /**
     * Converts this KeyBufferData to JSON.
     * @function toJSON
     * @memberof KeyBufferData
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    KeyBufferData.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return KeyBufferData;
})();

$root.TouchPoint = (function() {

    /**
     * Properties of a TouchPoint.
     * @exports ITouchPoint
     * @interface ITouchPoint
     * @property {number|null} [deltaTime] TouchPoint deltaTime
     * @property {number|null} [x] TouchPoint x
     * @property {number|null} [y] TouchPoint y
     * @property {TouchPoint.Type|null} [type] TouchPoint type
     * @property {number|null} [id] TouchPoint id
     */

    /**
     * Constructs a new TouchPoint.
     * @exports TouchPoint
     * @classdesc Represents a TouchPoint.
     * @implements ITouchPoint
     * @constructor
     * @param {ITouchPoint=} [properties] Properties to set
     */
    function TouchPoint(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * TouchPoint deltaTime.
     * @member {number} deltaTime
     * @memberof TouchPoint
     * @instance
     */
    TouchPoint.prototype.deltaTime = 0;

    /**
     * TouchPoint x.
     * @member {number} x
     * @memberof TouchPoint
     * @instance
     */
    TouchPoint.prototype.x = 0;

    /**
     * TouchPoint y.
     * @member {number} y
     * @memberof TouchPoint
     * @instance
     */
    TouchPoint.prototype.y = 0;

    /**
     * TouchPoint type.
     * @member {TouchPoint.Type} type
     * @memberof TouchPoint
     * @instance
     */
    TouchPoint.prototype.type = 0;

    /**
     * TouchPoint id.
     * @member {number} id
     * @memberof TouchPoint
     * @instance
     */
    TouchPoint.prototype.id = 0;

    /**
     * Creates a new TouchPoint instance using the specified properties.
     * @function create
     * @memberof TouchPoint
     * @static
     * @param {ITouchPoint=} [properties] Properties to set
     * @returns {TouchPoint} TouchPoint instance
     */
    TouchPoint.create = function create(properties) {
        return new TouchPoint(properties);
    };

    /**
     * Encodes the specified TouchPoint message. Does not implicitly {@link TouchPoint.verify|verify} messages.
     * @function encode
     * @memberof TouchPoint
     * @static
     * @param {ITouchPoint} message TouchPoint message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    TouchPoint.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.deltaTime != null && message.hasOwnProperty("deltaTime"))
            writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.deltaTime);
        if (message.x != null && message.hasOwnProperty("x"))
            writer.uint32(/* id 2, wireType 0 =*/16).sint32(message.x);
        if (message.y != null && message.hasOwnProperty("y"))
            writer.uint32(/* id 3, wireType 0 =*/24).sint32(message.y);
        if (message.id != null && message.hasOwnProperty("id"))
            writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.id);
        if (message.type != null && message.hasOwnProperty("type"))
            writer.uint32(/* id 5, wireType 0 =*/40).int32(message.type);
        return writer;
    };

    /**
     * Encodes the specified TouchPoint message, length delimited. Does not implicitly {@link TouchPoint.verify|verify} messages.
     * @function encodeDelimited
     * @memberof TouchPoint
     * @static
     * @param {ITouchPoint} message TouchPoint message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    TouchPoint.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a TouchPoint message from the specified reader or buffer.
     * @function decode
     * @memberof TouchPoint
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {TouchPoint} TouchPoint
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    TouchPoint.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.TouchPoint();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.deltaTime = reader.uint32();
                break;
            case 2:
                message.x = reader.sint32();
                break;
            case 3:
                message.y = reader.sint32();
                break;
            case 5:
                message.type = reader.int32();
                break;
            case 4:
                message.id = reader.uint32();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a TouchPoint message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof TouchPoint
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {TouchPoint} TouchPoint
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    TouchPoint.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a TouchPoint message.
     * @function verify
     * @memberof TouchPoint
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    TouchPoint.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.deltaTime != null && message.hasOwnProperty("deltaTime"))
            if (!$util.isInteger(message.deltaTime))
                return "deltaTime: integer expected";
        if (message.x != null && message.hasOwnProperty("x"))
            if (!$util.isInteger(message.x))
                return "x: integer expected";
        if (message.y != null && message.hasOwnProperty("y"))
            if (!$util.isInteger(message.y))
                return "y: integer expected";
        if (message.type != null && message.hasOwnProperty("type"))
            switch (message.type) {
            default:
                return "type: enum value expected";
            case 0:
            case 1:
            case 2:
            case 3:
                break;
            }
        if (message.id != null && message.hasOwnProperty("id"))
            if (!$util.isInteger(message.id))
                return "id: integer expected";
        return null;
    };

    /**
     * Creates a TouchPoint message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof TouchPoint
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {TouchPoint} TouchPoint
     */
    TouchPoint.fromObject = function fromObject(object) {
        if (object instanceof $root.TouchPoint)
            return object;
        var message = new $root.TouchPoint();
        if (object.deltaTime != null)
            message.deltaTime = object.deltaTime >>> 0;
        if (object.x != null)
            message.x = object.x | 0;
        if (object.y != null)
            message.y = object.y | 0;
        switch (object.type) {
        case "MOVE":
        case 0:
            message.type = 0;
            break;
        case "START":
        case 1:
            message.type = 1;
            break;
        case "END":
        case 2:
            message.type = 2;
            break;
        case "CANCEL":
        case 3:
            message.type = 3;
            break;
        }
        if (object.id != null)
            message.id = object.id >>> 0;
        return message;
    };

    /**
     * Creates a plain object from a TouchPoint message. Also converts values to other types if specified.
     * @function toObject
     * @memberof TouchPoint
     * @static
     * @param {TouchPoint} message TouchPoint
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    TouchPoint.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.deltaTime = 0;
            object.x = 0;
            object.y = 0;
            object.id = 0;
            object.type = options.enums === String ? "MOVE" : 0;
        }
        if (message.deltaTime != null && message.hasOwnProperty("deltaTime"))
            object.deltaTime = message.deltaTime;
        if (message.x != null && message.hasOwnProperty("x"))
            object.x = message.x;
        if (message.y != null && message.hasOwnProperty("y"))
            object.y = message.y;
        if (message.id != null && message.hasOwnProperty("id"))
            object.id = message.id;
        if (message.type != null && message.hasOwnProperty("type"))
            object.type = options.enums === String ? $root.TouchPoint.Type[message.type] : message.type;
        return object;
    };

    /**
     * Converts this TouchPoint to JSON.
     * @function toJSON
     * @memberof TouchPoint
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    TouchPoint.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Type enum.
     * @name TouchPoint.Type
     * @enum {string}
     * @property {number} MOVE=0 MOVE value
     * @property {number} START=1 START value
     * @property {number} END=2 END value
     * @property {number} CANCEL=3 CANCEL value
     */
    TouchPoint.Type = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "MOVE"] = 0;
        values[valuesById[1] = "START"] = 1;
        values[valuesById[2] = "END"] = 2;
        values[valuesById[3] = "CANCEL"] = 3;
        return values;
    })();

    return TouchPoint;
})();

$root.PathPoint = (function() {

    /**
     * Properties of a PathPoint.
     * @exports IPathPoint
     * @interface IPathPoint
     * @property {number|null} [deltaTime] PathPoint deltaTime
     * @property {number|null} [x] PathPoint x
     * @property {number|null} [y] PathPoint y
     */

    /**
     * Constructs a new PathPoint.
     * @exports PathPoint
     * @classdesc Represents a PathPoint.
     * @implements IPathPoint
     * @constructor
     * @param {IPathPoint=} [properties] Properties to set
     */
    function PathPoint(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * PathPoint deltaTime.
     * @member {number} deltaTime
     * @memberof PathPoint
     * @instance
     */
    PathPoint.prototype.deltaTime = 0;

    /**
     * PathPoint x.
     * @member {number} x
     * @memberof PathPoint
     * @instance
     */
    PathPoint.prototype.x = 0;

    /**
     * PathPoint y.
     * @member {number} y
     * @memberof PathPoint
     * @instance
     */
    PathPoint.prototype.y = 0;

    /**
     * Creates a new PathPoint instance using the specified properties.
     * @function create
     * @memberof PathPoint
     * @static
     * @param {IPathPoint=} [properties] Properties to set
     * @returns {PathPoint} PathPoint instance
     */
    PathPoint.create = function create(properties) {
        return new PathPoint(properties);
    };

    /**
     * Encodes the specified PathPoint message. Does not implicitly {@link PathPoint.verify|verify} messages.
     * @function encode
     * @memberof PathPoint
     * @static
     * @param {IPathPoint} message PathPoint message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    PathPoint.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.deltaTime != null && message.hasOwnProperty("deltaTime"))
            writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.deltaTime);
        if (message.x != null && message.hasOwnProperty("x"))
            writer.uint32(/* id 2, wireType 0 =*/16).sint32(message.x);
        if (message.y != null && message.hasOwnProperty("y"))
            writer.uint32(/* id 3, wireType 0 =*/24).sint32(message.y);
        return writer;
    };

    /**
     * Encodes the specified PathPoint message, length delimited. Does not implicitly {@link PathPoint.verify|verify} messages.
     * @function encodeDelimited
     * @memberof PathPoint
     * @static
     * @param {IPathPoint} message PathPoint message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    PathPoint.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a PathPoint message from the specified reader or buffer.
     * @function decode
     * @memberof PathPoint
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {PathPoint} PathPoint
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    PathPoint.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.PathPoint();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.deltaTime = reader.uint32();
                break;
            case 2:
                message.x = reader.sint32();
                break;
            case 3:
                message.y = reader.sint32();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a PathPoint message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof PathPoint
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {PathPoint} PathPoint
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    PathPoint.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a PathPoint message.
     * @function verify
     * @memberof PathPoint
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    PathPoint.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.deltaTime != null && message.hasOwnProperty("deltaTime"))
            if (!$util.isInteger(message.deltaTime))
                return "deltaTime: integer expected";
        if (message.x != null && message.hasOwnProperty("x"))
            if (!$util.isInteger(message.x))
                return "x: integer expected";
        if (message.y != null && message.hasOwnProperty("y"))
            if (!$util.isInteger(message.y))
                return "y: integer expected";
        return null;
    };

    /**
     * Creates a PathPoint message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof PathPoint
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {PathPoint} PathPoint
     */
    PathPoint.fromObject = function fromObject(object) {
        if (object instanceof $root.PathPoint)
            return object;
        var message = new $root.PathPoint();
        if (object.deltaTime != null)
            message.deltaTime = object.deltaTime >>> 0;
        if (object.x != null)
            message.x = object.x | 0;
        if (object.y != null)
            message.y = object.y | 0;
        return message;
    };

    /**
     * Creates a plain object from a PathPoint message. Also converts values to other types if specified.
     * @function toObject
     * @memberof PathPoint
     * @static
     * @param {PathPoint} message PathPoint
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    PathPoint.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.deltaTime = 0;
            object.x = 0;
            object.y = 0;
        }
        if (message.deltaTime != null && message.hasOwnProperty("deltaTime"))
            object.deltaTime = message.deltaTime;
        if (message.x != null && message.hasOwnProperty("x"))
            object.x = message.x;
        if (message.y != null && message.hasOwnProperty("y"))
            object.y = message.y;
        return object;
    };

    /**
     * Converts this PathPoint to JSON.
     * @function toJSON
     * @memberof PathPoint
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    PathPoint.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return PathPoint;
})();

$root.KeyPress = (function() {

    /**
     * Properties of a KeyPress.
     * @exports IKeyPress
     * @interface IKeyPress
     * @property {number|null} [deltaTime] KeyPress deltaTime
     * @property {KeyPress.KeyType|null} [keyType] KeyPress keyType
     */

    /**
     * Constructs a new KeyPress.
     * @exports KeyPress
     * @classdesc Represents a KeyPress.
     * @implements IKeyPress
     * @constructor
     * @param {IKeyPress=} [properties] Properties to set
     */
    function KeyPress(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * KeyPress deltaTime.
     * @member {number} deltaTime
     * @memberof KeyPress
     * @instance
     */
    KeyPress.prototype.deltaTime = 0;

    /**
     * KeyPress keyType.
     * @member {KeyPress.KeyType} keyType
     * @memberof KeyPress
     * @instance
     */
    KeyPress.prototype.keyType = 0;

    /**
     * Creates a new KeyPress instance using the specified properties.
     * @function create
     * @memberof KeyPress
     * @static
     * @param {IKeyPress=} [properties] Properties to set
     * @returns {KeyPress} KeyPress instance
     */
    KeyPress.create = function create(properties) {
        return new KeyPress(properties);
    };

    /**
     * Encodes the specified KeyPress message. Does not implicitly {@link KeyPress.verify|verify} messages.
     * @function encode
     * @memberof KeyPress
     * @static
     * @param {IKeyPress} message KeyPress message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    KeyPress.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.deltaTime != null && message.hasOwnProperty("deltaTime"))
            writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.deltaTime);
        if (message.keyType != null && message.hasOwnProperty("keyType"))
            writer.uint32(/* id 2, wireType 0 =*/16).int32(message.keyType);
        return writer;
    };

    /**
     * Encodes the specified KeyPress message, length delimited. Does not implicitly {@link KeyPress.verify|verify} messages.
     * @function encodeDelimited
     * @memberof KeyPress
     * @static
     * @param {IKeyPress} message KeyPress message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    KeyPress.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a KeyPress message from the specified reader or buffer.
     * @function decode
     * @memberof KeyPress
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {KeyPress} KeyPress
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    KeyPress.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.KeyPress();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.deltaTime = reader.uint32();
                break;
            case 2:
                message.keyType = reader.int32();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a KeyPress message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof KeyPress
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {KeyPress} KeyPress
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    KeyPress.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a KeyPress message.
     * @function verify
     * @memberof KeyPress
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    KeyPress.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.deltaTime != null && message.hasOwnProperty("deltaTime"))
            if (!$util.isInteger(message.deltaTime))
                return "deltaTime: integer expected";
        if (message.keyType != null && message.hasOwnProperty("keyType"))
            switch (message.keyType) {
            default:
                return "keyType: enum value expected";
            case 0:
            case 1:
            case 2:
            case 3:
                break;
            }
        return null;
    };

    /**
     * Creates a KeyPress message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof KeyPress
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {KeyPress} KeyPress
     */
    KeyPress.fromObject = function fromObject(object) {
        if (object instanceof $root.KeyPress)
            return object;
        var message = new $root.KeyPress();
        if (object.deltaTime != null)
            message.deltaTime = object.deltaTime >>> 0;
        switch (object.keyType) {
        case "INVALID":
        case 0:
            message.keyType = 0;
            break;
        case "MOUSE":
        case 1:
            message.keyType = 1;
            break;
        case "KEYBOARD":
        case 2:
            message.keyType = 2;
            break;
        case "SCROLL":
        case 3:
            message.keyType = 3;
            break;
        }
        return message;
    };

    /**
     * Creates a plain object from a KeyPress message. Also converts values to other types if specified.
     * @function toObject
     * @memberof KeyPress
     * @static
     * @param {KeyPress} message KeyPress
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    KeyPress.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.deltaTime = 0;
            object.keyType = options.enums === String ? "INVALID" : 0;
        }
        if (message.deltaTime != null && message.hasOwnProperty("deltaTime"))
            object.deltaTime = message.deltaTime;
        if (message.keyType != null && message.hasOwnProperty("keyType"))
            object.keyType = options.enums === String ? $root.KeyPress.KeyType[message.keyType] : message.keyType;
        return object;
    };

    /**
     * Converts this KeyPress to JSON.
     * @function toJSON
     * @memberof KeyPress
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    KeyPress.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * KeyType enum.
     * @name KeyPress.KeyType
     * @enum {string}
     * @property {number} INVALID=0 INVALID value
     * @property {number} MOUSE=1 MOUSE value
     * @property {number} KEYBOARD=2 KEYBOARD value
     * @property {number} SCROLL=3 SCROLL value
     */
    KeyPress.KeyType = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "INVALID"] = 0;
        values[valuesById[1] = "MOUSE"] = 1;
        values[valuesById[2] = "KEYBOARD"] = 2;
        values[valuesById[3] = "SCROLL"] = 3;
        return values;
    })();

    return KeyPress;
})();

module.exports = $root;

},{"protobufjs/minimal":9}],2:[function(require,module,exports){
"use strict";
module.exports = asPromise;

/**
 * Callback as used by {@link util.asPromise}.
 * @typedef asPromiseCallback
 * @type {function}
 * @param {Error|null} error Error, if any
 * @param {...*} params Additional arguments
 * @returns {undefined}
 */

/**
 * Returns a promise from a node-style callback function.
 * @memberof util
 * @param {asPromiseCallback} fn Function to call
 * @param {*} ctx Function context
 * @param {...*} params Function arguments
 * @returns {Promise<*>} Promisified function
 */
function asPromise(fn, ctx/*, varargs */) {
    var params  = new Array(arguments.length - 1),
        offset  = 0,
        index   = 2,
        pending = true;
    while (index < arguments.length)
        params[offset++] = arguments[index++];
    return new Promise(function executor(resolve, reject) {
        params[offset] = function callback(err/*, varargs */) {
            if (pending) {
                pending = false;
                if (err)
                    reject(err);
                else {
                    var params = new Array(arguments.length - 1),
                        offset = 0;
                    while (offset < params.length)
                        params[offset++] = arguments[offset];
                    resolve.apply(null, params);
                }
            }
        };
        try {
            fn.apply(ctx || null, params);
        } catch (err) {
            if (pending) {
                pending = false;
                reject(err);
            }
        }
    });
}

},{}],3:[function(require,module,exports){
"use strict";

/**
 * A minimal base64 implementation for number arrays.
 * @memberof util
 * @namespace
 */
var base64 = exports;

/**
 * Calculates the byte length of a base64 encoded string.
 * @param {string} string Base64 encoded string
 * @returns {number} Byte length
 */
base64.length = function length(string) {
    var p = string.length;
    if (!p)
        return 0;
    var n = 0;
    while (--p % 4 > 1 && string.charAt(p) === "=")
        ++n;
    return Math.ceil(string.length * 3) / 4 - n;
};

// Base64 encoding table
var b64 = new Array(64);

// Base64 decoding table
var s64 = new Array(123);

// 65..90, 97..122, 48..57, 43, 47
for (var i = 0; i < 64;)
    s64[b64[i] = i < 26 ? i + 65 : i < 52 ? i + 71 : i < 62 ? i - 4 : i - 59 | 43] = i++;

/**
 * Encodes a buffer to a base64 encoded string.
 * @param {Uint8Array} buffer Source buffer
 * @param {number} start Source start
 * @param {number} end Source end
 * @returns {string} Base64 encoded string
 */
base64.encode = function encode(buffer, start, end) {
    var parts = null,
        chunk = [];
    var i = 0, // output index
        j = 0, // goto index
        t;     // temporary
    while (start < end) {
        var b = buffer[start++];
        switch (j) {
            case 0:
                chunk[i++] = b64[b >> 2];
                t = (b & 3) << 4;
                j = 1;
                break;
            case 1:
                chunk[i++] = b64[t | b >> 4];
                t = (b & 15) << 2;
                j = 2;
                break;
            case 2:
                chunk[i++] = b64[t | b >> 6];
                chunk[i++] = b64[b & 63];
                j = 0;
                break;
        }
        if (i > 8191) {
            (parts || (parts = [])).push(String.fromCharCode.apply(String, chunk));
            i = 0;
        }
    }
    if (j) {
        chunk[i++] = b64[t];
        chunk[i++] = 61;
        if (j === 1)
            chunk[i++] = 61;
    }
    if (parts) {
        if (i)
            parts.push(String.fromCharCode.apply(String, chunk.slice(0, i)));
        return parts.join("");
    }
    return String.fromCharCode.apply(String, chunk.slice(0, i));
};

var invalidEncoding = "invalid encoding";

/**
 * Decodes a base64 encoded string to a buffer.
 * @param {string} string Source string
 * @param {Uint8Array} buffer Destination buffer
 * @param {number} offset Destination offset
 * @returns {number} Number of bytes written
 * @throws {Error} If encoding is invalid
 */
base64.decode = function decode(string, buffer, offset) {
    var start = offset;
    var j = 0, // goto index
        t;     // temporary
    for (var i = 0; i < string.length;) {
        var c = string.charCodeAt(i++);
        if (c === 61 && j > 1)
            break;
        if ((c = s64[c]) === undefined)
            throw Error(invalidEncoding);
        switch (j) {
            case 0:
                t = c;
                j = 1;
                break;
            case 1:
                buffer[offset++] = t << 2 | (c & 48) >> 4;
                t = c;
                j = 2;
                break;
            case 2:
                buffer[offset++] = (t & 15) << 4 | (c & 60) >> 2;
                t = c;
                j = 3;
                break;
            case 3:
                buffer[offset++] = (t & 3) << 6 | c;
                j = 0;
                break;
        }
    }
    if (j === 1)
        throw Error(invalidEncoding);
    return offset - start;
};

/**
 * Tests if the specified string appears to be base64 encoded.
 * @param {string} string String to test
 * @returns {boolean} `true` if probably base64 encoded, otherwise false
 */
base64.test = function test(string) {
    return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(string);
};

},{}],4:[function(require,module,exports){
"use strict";
module.exports = EventEmitter;

/**
 * Constructs a new event emitter instance.
 * @classdesc A minimal event emitter.
 * @memberof util
 * @constructor
 */
function EventEmitter() {

    /**
     * Registered listeners.
     * @type {Object.<string,*>}
     * @private
     */
    this._listeners = {};
}

/**
 * Registers an event listener.
 * @param {string} evt Event name
 * @param {function} fn Listener
 * @param {*} [ctx] Listener context
 * @returns {util.EventEmitter} `this`
 */
EventEmitter.prototype.on = function on(evt, fn, ctx) {
    (this._listeners[evt] || (this._listeners[evt] = [])).push({
        fn  : fn,
        ctx : ctx || this
    });
    return this;
};

/**
 * Removes an event listener or any matching listeners if arguments are omitted.
 * @param {string} [evt] Event name. Removes all listeners if omitted.
 * @param {function} [fn] Listener to remove. Removes all listeners of `evt` if omitted.
 * @returns {util.EventEmitter} `this`
 */
EventEmitter.prototype.off = function off(evt, fn) {
    if (evt === undefined)
        this._listeners = {};
    else {
        if (fn === undefined)
            this._listeners[evt] = [];
        else {
            var listeners = this._listeners[evt];
            for (var i = 0; i < listeners.length;)
                if (listeners[i].fn === fn)
                    listeners.splice(i, 1);
                else
                    ++i;
        }
    }
    return this;
};

/**
 * Emits an event by calling its listeners with the specified arguments.
 * @param {string} evt Event name
 * @param {...*} args Arguments
 * @returns {util.EventEmitter} `this`
 */
EventEmitter.prototype.emit = function emit(evt) {
    var listeners = this._listeners[evt];
    if (listeners) {
        var args = [],
            i = 1;
        for (; i < arguments.length;)
            args.push(arguments[i++]);
        for (i = 0; i < listeners.length;)
            listeners[i].fn.apply(listeners[i++].ctx, args);
    }
    return this;
};

},{}],5:[function(require,module,exports){
"use strict";

module.exports = factory(factory);

/**
 * Reads / writes floats / doubles from / to buffers.
 * @name util.float
 * @namespace
 */

/**
 * Writes a 32 bit float to a buffer using little endian byte order.
 * @name util.float.writeFloatLE
 * @function
 * @param {number} val Value to write
 * @param {Uint8Array} buf Target buffer
 * @param {number} pos Target buffer offset
 * @returns {undefined}
 */

/**
 * Writes a 32 bit float to a buffer using big endian byte order.
 * @name util.float.writeFloatBE
 * @function
 * @param {number} val Value to write
 * @param {Uint8Array} buf Target buffer
 * @param {number} pos Target buffer offset
 * @returns {undefined}
 */

/**
 * Reads a 32 bit float from a buffer using little endian byte order.
 * @name util.float.readFloatLE
 * @function
 * @param {Uint8Array} buf Source buffer
 * @param {number} pos Source buffer offset
 * @returns {number} Value read
 */

/**
 * Reads a 32 bit float from a buffer using big endian byte order.
 * @name util.float.readFloatBE
 * @function
 * @param {Uint8Array} buf Source buffer
 * @param {number} pos Source buffer offset
 * @returns {number} Value read
 */

/**
 * Writes a 64 bit double to a buffer using little endian byte order.
 * @name util.float.writeDoubleLE
 * @function
 * @param {number} val Value to write
 * @param {Uint8Array} buf Target buffer
 * @param {number} pos Target buffer offset
 * @returns {undefined}
 */

/**
 * Writes a 64 bit double to a buffer using big endian byte order.
 * @name util.float.writeDoubleBE
 * @function
 * @param {number} val Value to write
 * @param {Uint8Array} buf Target buffer
 * @param {number} pos Target buffer offset
 * @returns {undefined}
 */

/**
 * Reads a 64 bit double from a buffer using little endian byte order.
 * @name util.float.readDoubleLE
 * @function
 * @param {Uint8Array} buf Source buffer
 * @param {number} pos Source buffer offset
 * @returns {number} Value read
 */

/**
 * Reads a 64 bit double from a buffer using big endian byte order.
 * @name util.float.readDoubleBE
 * @function
 * @param {Uint8Array} buf Source buffer
 * @param {number} pos Source buffer offset
 * @returns {number} Value read
 */

// Factory function for the purpose of node-based testing in modified global environments
function factory(exports) {

    // float: typed array
    if (typeof Float32Array !== "undefined") (function() {

        var f32 = new Float32Array([ -0 ]),
            f8b = new Uint8Array(f32.buffer),
            le  = f8b[3] === 128;

        function writeFloat_f32_cpy(val, buf, pos) {
            f32[0] = val;
            buf[pos    ] = f8b[0];
            buf[pos + 1] = f8b[1];
            buf[pos + 2] = f8b[2];
            buf[pos + 3] = f8b[3];
        }

        function writeFloat_f32_rev(val, buf, pos) {
            f32[0] = val;
            buf[pos    ] = f8b[3];
            buf[pos + 1] = f8b[2];
            buf[pos + 2] = f8b[1];
            buf[pos + 3] = f8b[0];
        }

        /* istanbul ignore next */
        exports.writeFloatLE = le ? writeFloat_f32_cpy : writeFloat_f32_rev;
        /* istanbul ignore next */
        exports.writeFloatBE = le ? writeFloat_f32_rev : writeFloat_f32_cpy;

        function readFloat_f32_cpy(buf, pos) {
            f8b[0] = buf[pos    ];
            f8b[1] = buf[pos + 1];
            f8b[2] = buf[pos + 2];
            f8b[3] = buf[pos + 3];
            return f32[0];
        }

        function readFloat_f32_rev(buf, pos) {
            f8b[3] = buf[pos    ];
            f8b[2] = buf[pos + 1];
            f8b[1] = buf[pos + 2];
            f8b[0] = buf[pos + 3];
            return f32[0];
        }

        /* istanbul ignore next */
        exports.readFloatLE = le ? readFloat_f32_cpy : readFloat_f32_rev;
        /* istanbul ignore next */
        exports.readFloatBE = le ? readFloat_f32_rev : readFloat_f32_cpy;

    // float: ieee754
    })(); else (function() {

        function writeFloat_ieee754(writeUint, val, buf, pos) {
            var sign = val < 0 ? 1 : 0;
            if (sign)
                val = -val;
            if (val === 0)
                writeUint(1 / val > 0 ? /* positive */ 0 : /* negative 0 */ 2147483648, buf, pos);
            else if (isNaN(val))
                writeUint(2143289344, buf, pos);
            else if (val > 3.4028234663852886e+38) // +-Infinity
                writeUint((sign << 31 | 2139095040) >>> 0, buf, pos);
            else if (val < 1.1754943508222875e-38) // denormal
                writeUint((sign << 31 | Math.round(val / 1.401298464324817e-45)) >>> 0, buf, pos);
            else {
                var exponent = Math.floor(Math.log(val) / Math.LN2),
                    mantissa = Math.round(val * Math.pow(2, -exponent) * 8388608) & 8388607;
                writeUint((sign << 31 | exponent + 127 << 23 | mantissa) >>> 0, buf, pos);
            }
        }

        exports.writeFloatLE = writeFloat_ieee754.bind(null, writeUintLE);
        exports.writeFloatBE = writeFloat_ieee754.bind(null, writeUintBE);

        function readFloat_ieee754(readUint, buf, pos) {
            var uint = readUint(buf, pos),
                sign = (uint >> 31) * 2 + 1,
                exponent = uint >>> 23 & 255,
                mantissa = uint & 8388607;
            return exponent === 255
                ? mantissa
                ? NaN
                : sign * Infinity
                : exponent === 0 // denormal
                ? sign * 1.401298464324817e-45 * mantissa
                : sign * Math.pow(2, exponent - 150) * (mantissa + 8388608);
        }

        exports.readFloatLE = readFloat_ieee754.bind(null, readUintLE);
        exports.readFloatBE = readFloat_ieee754.bind(null, readUintBE);

    })();

    // double: typed array
    if (typeof Float64Array !== "undefined") (function() {

        var f64 = new Float64Array([-0]),
            f8b = new Uint8Array(f64.buffer),
            le  = f8b[7] === 128;

        function writeDouble_f64_cpy(val, buf, pos) {
            f64[0] = val;
            buf[pos    ] = f8b[0];
            buf[pos + 1] = f8b[1];
            buf[pos + 2] = f8b[2];
            buf[pos + 3] = f8b[3];
            buf[pos + 4] = f8b[4];
            buf[pos + 5] = f8b[5];
            buf[pos + 6] = f8b[6];
            buf[pos + 7] = f8b[7];
        }

        function writeDouble_f64_rev(val, buf, pos) {
            f64[0] = val;
            buf[pos    ] = f8b[7];
            buf[pos + 1] = f8b[6];
            buf[pos + 2] = f8b[5];
            buf[pos + 3] = f8b[4];
            buf[pos + 4] = f8b[3];
            buf[pos + 5] = f8b[2];
            buf[pos + 6] = f8b[1];
            buf[pos + 7] = f8b[0];
        }

        /* istanbul ignore next */
        exports.writeDoubleLE = le ? writeDouble_f64_cpy : writeDouble_f64_rev;
        /* istanbul ignore next */
        exports.writeDoubleBE = le ? writeDouble_f64_rev : writeDouble_f64_cpy;

        function readDouble_f64_cpy(buf, pos) {
            f8b[0] = buf[pos    ];
            f8b[1] = buf[pos + 1];
            f8b[2] = buf[pos + 2];
            f8b[3] = buf[pos + 3];
            f8b[4] = buf[pos + 4];
            f8b[5] = buf[pos + 5];
            f8b[6] = buf[pos + 6];
            f8b[7] = buf[pos + 7];
            return f64[0];
        }

        function readDouble_f64_rev(buf, pos) {
            f8b[7] = buf[pos    ];
            f8b[6] = buf[pos + 1];
            f8b[5] = buf[pos + 2];
            f8b[4] = buf[pos + 3];
            f8b[3] = buf[pos + 4];
            f8b[2] = buf[pos + 5];
            f8b[1] = buf[pos + 6];
            f8b[0] = buf[pos + 7];
            return f64[0];
        }

        /* istanbul ignore next */
        exports.readDoubleLE = le ? readDouble_f64_cpy : readDouble_f64_rev;
        /* istanbul ignore next */
        exports.readDoubleBE = le ? readDouble_f64_rev : readDouble_f64_cpy;

    // double: ieee754
    })(); else (function() {

        function writeDouble_ieee754(writeUint, off0, off1, val, buf, pos) {
            var sign = val < 0 ? 1 : 0;
            if (sign)
                val = -val;
            if (val === 0) {
                writeUint(0, buf, pos + off0);
                writeUint(1 / val > 0 ? /* positive */ 0 : /* negative 0 */ 2147483648, buf, pos + off1);
            } else if (isNaN(val)) {
                writeUint(0, buf, pos + off0);
                writeUint(2146959360, buf, pos + off1);
            } else if (val > 1.7976931348623157e+308) { // +-Infinity
                writeUint(0, buf, pos + off0);
                writeUint((sign << 31 | 2146435072) >>> 0, buf, pos + off1);
            } else {
                var mantissa;
                if (val < 2.2250738585072014e-308) { // denormal
                    mantissa = val / 5e-324;
                    writeUint(mantissa >>> 0, buf, pos + off0);
                    writeUint((sign << 31 | mantissa / 4294967296) >>> 0, buf, pos + off1);
                } else {
                    var exponent = Math.floor(Math.log(val) / Math.LN2);
                    if (exponent === 1024)
                        exponent = 1023;
                    mantissa = val * Math.pow(2, -exponent);
                    writeUint(mantissa * 4503599627370496 >>> 0, buf, pos + off0);
                    writeUint((sign << 31 | exponent + 1023 << 20 | mantissa * 1048576 & 1048575) >>> 0, buf, pos + off1);
                }
            }
        }

        exports.writeDoubleLE = writeDouble_ieee754.bind(null, writeUintLE, 0, 4);
        exports.writeDoubleBE = writeDouble_ieee754.bind(null, writeUintBE, 4, 0);

        function readDouble_ieee754(readUint, off0, off1, buf, pos) {
            var lo = readUint(buf, pos + off0),
                hi = readUint(buf, pos + off1);
            var sign = (hi >> 31) * 2 + 1,
                exponent = hi >>> 20 & 2047,
                mantissa = 4294967296 * (hi & 1048575) + lo;
            return exponent === 2047
                ? mantissa
                ? NaN
                : sign * Infinity
                : exponent === 0 // denormal
                ? sign * 5e-324 * mantissa
                : sign * Math.pow(2, exponent - 1075) * (mantissa + 4503599627370496);
        }

        exports.readDoubleLE = readDouble_ieee754.bind(null, readUintLE, 0, 4);
        exports.readDoubleBE = readDouble_ieee754.bind(null, readUintBE, 4, 0);

    })();

    return exports;
}

// uint helpers

function writeUintLE(val, buf, pos) {
    buf[pos    ] =  val        & 255;
    buf[pos + 1] =  val >>> 8  & 255;
    buf[pos + 2] =  val >>> 16 & 255;
    buf[pos + 3] =  val >>> 24;
}

function writeUintBE(val, buf, pos) {
    buf[pos    ] =  val >>> 24;
    buf[pos + 1] =  val >>> 16 & 255;
    buf[pos + 2] =  val >>> 8  & 255;
    buf[pos + 3] =  val        & 255;
}

function readUintLE(buf, pos) {
    return (buf[pos    ]
          | buf[pos + 1] << 8
          | buf[pos + 2] << 16
          | buf[pos + 3] << 24) >>> 0;
}

function readUintBE(buf, pos) {
    return (buf[pos    ] << 24
          | buf[pos + 1] << 16
          | buf[pos + 2] << 8
          | buf[pos + 3]) >>> 0;
}

},{}],6:[function(require,module,exports){
"use strict";
module.exports = inquire;

/**
 * Requires a module only if available.
 * @memberof util
 * @param {string} moduleName Module to require
 * @returns {?Object} Required module if available and not empty, otherwise `null`
 */
function inquire(moduleName) {
    try {
        var mod = eval("quire".replace(/^/,"re"))(moduleName); // eslint-disable-line no-eval
        if (mod && (mod.length || Object.keys(mod).length))
            return mod;
    } catch (e) {} // eslint-disable-line no-empty
    return null;
}

},{}],7:[function(require,module,exports){
"use strict";
module.exports = pool;

/**
 * An allocator as used by {@link util.pool}.
 * @typedef PoolAllocator
 * @type {function}
 * @param {number} size Buffer size
 * @returns {Uint8Array} Buffer
 */

/**
 * A slicer as used by {@link util.pool}.
 * @typedef PoolSlicer
 * @type {function}
 * @param {number} start Start offset
 * @param {number} end End offset
 * @returns {Uint8Array} Buffer slice
 * @this {Uint8Array}
 */

/**
 * A general purpose buffer pool.
 * @memberof util
 * @function
 * @param {PoolAllocator} alloc Allocator
 * @param {PoolSlicer} slice Slicer
 * @param {number} [size=8192] Slab size
 * @returns {PoolAllocator} Pooled allocator
 */
function pool(alloc, slice, size) {
    var SIZE   = size || 8192;
    var MAX    = SIZE >>> 1;
    var slab   = null;
    var offset = SIZE;
    return function pool_alloc(size) {
        if (size < 1 || size > MAX)
            return alloc(size);
        if (offset + size > SIZE) {
            slab = alloc(SIZE);
            offset = 0;
        }
        var buf = slice.call(slab, offset, offset += size);
        if (offset & 7) // align to 32 bit
            offset = (offset | 7) + 1;
        return buf;
    };
}

},{}],8:[function(require,module,exports){
"use strict";

/**
 * A minimal UTF8 implementation for number arrays.
 * @memberof util
 * @namespace
 */
var utf8 = exports;

/**
 * Calculates the UTF8 byte length of a string.
 * @param {string} string String
 * @returns {number} Byte length
 */
utf8.length = function utf8_length(string) {
    var len = 0,
        c = 0;
    for (var i = 0; i < string.length; ++i) {
        c = string.charCodeAt(i);
        if (c < 128)
            len += 1;
        else if (c < 2048)
            len += 2;
        else if ((c & 0xFC00) === 0xD800 && (string.charCodeAt(i + 1) & 0xFC00) === 0xDC00) {
            ++i;
            len += 4;
        } else
            len += 3;
    }
    return len;
};

/**
 * Reads UTF8 bytes as a string.
 * @param {Uint8Array} buffer Source buffer
 * @param {number} start Source start
 * @param {number} end Source end
 * @returns {string} String read
 */
utf8.read = function utf8_read(buffer, start, end) {
    var len = end - start;
    if (len < 1)
        return "";
    var parts = null,
        chunk = [],
        i = 0, // char offset
        t;     // temporary
    while (start < end) {
        t = buffer[start++];
        if (t < 128)
            chunk[i++] = t;
        else if (t > 191 && t < 224)
            chunk[i++] = (t & 31) << 6 | buffer[start++] & 63;
        else if (t > 239 && t < 365) {
            t = ((t & 7) << 18 | (buffer[start++] & 63) << 12 | (buffer[start++] & 63) << 6 | buffer[start++] & 63) - 0x10000;
            chunk[i++] = 0xD800 + (t >> 10);
            chunk[i++] = 0xDC00 + (t & 1023);
        } else
            chunk[i++] = (t & 15) << 12 | (buffer[start++] & 63) << 6 | buffer[start++] & 63;
        if (i > 8191) {
            (parts || (parts = [])).push(String.fromCharCode.apply(String, chunk));
            i = 0;
        }
    }
    if (parts) {
        if (i)
            parts.push(String.fromCharCode.apply(String, chunk.slice(0, i)));
        return parts.join("");
    }
    return String.fromCharCode.apply(String, chunk.slice(0, i));
};

/**
 * Writes a string as UTF8 bytes.
 * @param {string} string Source string
 * @param {Uint8Array} buffer Destination buffer
 * @param {number} offset Destination offset
 * @returns {number} Bytes written
 */
utf8.write = function utf8_write(string, buffer, offset) {
    var start = offset,
        c1, // character 1
        c2; // character 2
    for (var i = 0; i < string.length; ++i) {
        c1 = string.charCodeAt(i);
        if (c1 < 128) {
            buffer[offset++] = c1;
        } else if (c1 < 2048) {
            buffer[offset++] = c1 >> 6       | 192;
            buffer[offset++] = c1       & 63 | 128;
        } else if ((c1 & 0xFC00) === 0xD800 && ((c2 = string.charCodeAt(i + 1)) & 0xFC00) === 0xDC00) {
            c1 = 0x10000 + ((c1 & 0x03FF) << 10) + (c2 & 0x03FF);
            ++i;
            buffer[offset++] = c1 >> 18      | 240;
            buffer[offset++] = c1 >> 12 & 63 | 128;
            buffer[offset++] = c1 >> 6  & 63 | 128;
            buffer[offset++] = c1       & 63 | 128;
        } else {
            buffer[offset++] = c1 >> 12      | 224;
            buffer[offset++] = c1 >> 6  & 63 | 128;
            buffer[offset++] = c1       & 63 | 128;
        }
    }
    return offset - start;
};

},{}],9:[function(require,module,exports){
// minimal library entry point.

"use strict";
module.exports = require("./src/index-minimal");

},{"./src/index-minimal":10}],10:[function(require,module,exports){
"use strict";
var protobuf = exports;

/**
 * Build type, one of `"full"`, `"light"` or `"minimal"`.
 * @name build
 * @type {string}
 * @const
 */
protobuf.build = "minimal";

// Serialization
protobuf.Writer       = require("./writer");
protobuf.BufferWriter = require("./writer_buffer");
protobuf.Reader       = require("./reader");
protobuf.BufferReader = require("./reader_buffer");

// Utility
protobuf.util         = require("./util/minimal");
protobuf.rpc          = require("./rpc");
protobuf.roots        = require("./roots");
protobuf.configure    = configure;

/* istanbul ignore next */
/**
 * Reconfigures the library according to the environment.
 * @returns {undefined}
 */
function configure() {
    protobuf.Reader._configure(protobuf.BufferReader);
    protobuf.util._configure();
}

// Set up buffer utility according to the environment
protobuf.Writer._configure(protobuf.BufferWriter);
configure();

},{"./reader":11,"./reader_buffer":12,"./roots":13,"./rpc":14,"./util/minimal":17,"./writer":18,"./writer_buffer":19}],11:[function(require,module,exports){
"use strict";
module.exports = Reader;

var util      = require("./util/minimal");

var BufferReader; // cyclic

var LongBits  = util.LongBits,
    utf8      = util.utf8;

/* istanbul ignore next */
function indexOutOfRange(reader, writeLength) {
    return RangeError("index out of range: " + reader.pos + " + " + (writeLength || 1) + " > " + reader.len);
}

/**
 * Constructs a new reader instance using the specified buffer.
 * @classdesc Wire format reader using `Uint8Array` if available, otherwise `Array`.
 * @constructor
 * @param {Uint8Array} buffer Buffer to read from
 */
function Reader(buffer) {

    /**
     * Read buffer.
     * @type {Uint8Array}
     */
    this.buf = buffer;

    /**
     * Read buffer position.
     * @type {number}
     */
    this.pos = 0;

    /**
     * Read buffer length.
     * @type {number}
     */
    this.len = buffer.length;
}

var create_array = typeof Uint8Array !== "undefined"
    ? function create_typed_array(buffer) {
        if (buffer instanceof Uint8Array || Array.isArray(buffer))
            return new Reader(buffer);
        throw Error("illegal buffer");
    }
    /* istanbul ignore next */
    : function create_array(buffer) {
        if (Array.isArray(buffer))
            return new Reader(buffer);
        throw Error("illegal buffer");
    };

/**
 * Creates a new reader using the specified buffer.
 * @function
 * @param {Uint8Array|Buffer} buffer Buffer to read from
 * @returns {Reader|BufferReader} A {@link BufferReader} if `buffer` is a Buffer, otherwise a {@link Reader}
 * @throws {Error} If `buffer` is not a valid buffer
 */
Reader.create = util.Buffer
    ? function create_buffer_setup(buffer) {
        return (Reader.create = function create_buffer(buffer) {
            return util.Buffer.isBuffer(buffer)
                ? new BufferReader(buffer)
                /* istanbul ignore next */
                : create_array(buffer);
        })(buffer);
    }
    /* istanbul ignore next */
    : create_array;

Reader.prototype._slice = util.Array.prototype.subarray || /* istanbul ignore next */ util.Array.prototype.slice;

/**
 * Reads a varint as an unsigned 32 bit value.
 * @function
 * @returns {number} Value read
 */
Reader.prototype.uint32 = (function read_uint32_setup() {
    var value = 4294967295; // optimizer type-hint, tends to deopt otherwise (?!)
    return function read_uint32() {
        value = (         this.buf[this.pos] & 127       ) >>> 0; if (this.buf[this.pos++] < 128) return value;
        value = (value | (this.buf[this.pos] & 127) <<  7) >>> 0; if (this.buf[this.pos++] < 128) return value;
        value = (value | (this.buf[this.pos] & 127) << 14) >>> 0; if (this.buf[this.pos++] < 128) return value;
        value = (value | (this.buf[this.pos] & 127) << 21) >>> 0; if (this.buf[this.pos++] < 128) return value;
        value = (value | (this.buf[this.pos] &  15) << 28) >>> 0; if (this.buf[this.pos++] < 128) return value;

        /* istanbul ignore if */
        if ((this.pos += 5) > this.len) {
            this.pos = this.len;
            throw indexOutOfRange(this, 10);
        }
        return value;
    };
})();

/**
 * Reads a varint as a signed 32 bit value.
 * @returns {number} Value read
 */
Reader.prototype.int32 = function read_int32() {
    return this.uint32() | 0;
};

/**
 * Reads a zig-zag encoded varint as a signed 32 bit value.
 * @returns {number} Value read
 */
Reader.prototype.sint32 = function read_sint32() {
    var value = this.uint32();
    return value >>> 1 ^ -(value & 1) | 0;
};

/* eslint-disable no-invalid-this */

function readLongVarint() {
    // tends to deopt with local vars for octet etc.
    var bits = new LongBits(0, 0);
    var i = 0;
    if (this.len - this.pos > 4) { // fast route (lo)
        for (; i < 4; ++i) {
            // 1st..4th
            bits.lo = (bits.lo | (this.buf[this.pos] & 127) << i * 7) >>> 0;
            if (this.buf[this.pos++] < 128)
                return bits;
        }
        // 5th
        bits.lo = (bits.lo | (this.buf[this.pos] & 127) << 28) >>> 0;
        bits.hi = (bits.hi | (this.buf[this.pos] & 127) >>  4) >>> 0;
        if (this.buf[this.pos++] < 128)
            return bits;
        i = 0;
    } else {
        for (; i < 3; ++i) {
            /* istanbul ignore if */
            if (this.pos >= this.len)
                throw indexOutOfRange(this);
            // 1st..3th
            bits.lo = (bits.lo | (this.buf[this.pos] & 127) << i * 7) >>> 0;
            if (this.buf[this.pos++] < 128)
                return bits;
        }
        // 4th
        bits.lo = (bits.lo | (this.buf[this.pos++] & 127) << i * 7) >>> 0;
        return bits;
    }
    if (this.len - this.pos > 4) { // fast route (hi)
        for (; i < 5; ++i) {
            // 6th..10th
            bits.hi = (bits.hi | (this.buf[this.pos] & 127) << i * 7 + 3) >>> 0;
            if (this.buf[this.pos++] < 128)
                return bits;
        }
    } else {
        for (; i < 5; ++i) {
            /* istanbul ignore if */
            if (this.pos >= this.len)
                throw indexOutOfRange(this);
            // 6th..10th
            bits.hi = (bits.hi | (this.buf[this.pos] & 127) << i * 7 + 3) >>> 0;
            if (this.buf[this.pos++] < 128)
                return bits;
        }
    }
    /* istanbul ignore next */
    throw Error("invalid varint encoding");
}

/* eslint-enable no-invalid-this */

/**
 * Reads a varint as a signed 64 bit value.
 * @name Reader#int64
 * @function
 * @returns {Long} Value read
 */

/**
 * Reads a varint as an unsigned 64 bit value.
 * @name Reader#uint64
 * @function
 * @returns {Long} Value read
 */

/**
 * Reads a zig-zag encoded varint as a signed 64 bit value.
 * @name Reader#sint64
 * @function
 * @returns {Long} Value read
 */

/**
 * Reads a varint as a boolean.
 * @returns {boolean} Value read
 */
Reader.prototype.bool = function read_bool() {
    return this.uint32() !== 0;
};

function readFixed32_end(buf, end) { // note that this uses `end`, not `pos`
    return (buf[end - 4]
          | buf[end - 3] << 8
          | buf[end - 2] << 16
          | buf[end - 1] << 24) >>> 0;
}

/**
 * Reads fixed 32 bits as an unsigned 32 bit integer.
 * @returns {number} Value read
 */
Reader.prototype.fixed32 = function read_fixed32() {

    /* istanbul ignore if */
    if (this.pos + 4 > this.len)
        throw indexOutOfRange(this, 4);

    return readFixed32_end(this.buf, this.pos += 4);
};

/**
 * Reads fixed 32 bits as a signed 32 bit integer.
 * @returns {number} Value read
 */
Reader.prototype.sfixed32 = function read_sfixed32() {

    /* istanbul ignore if */
    if (this.pos + 4 > this.len)
        throw indexOutOfRange(this, 4);

    return readFixed32_end(this.buf, this.pos += 4) | 0;
};

/* eslint-disable no-invalid-this */

function readFixed64(/* this: Reader */) {

    /* istanbul ignore if */
    if (this.pos + 8 > this.len)
        throw indexOutOfRange(this, 8);

    return new LongBits(readFixed32_end(this.buf, this.pos += 4), readFixed32_end(this.buf, this.pos += 4));
}

/* eslint-enable no-invalid-this */

/**
 * Reads fixed 64 bits.
 * @name Reader#fixed64
 * @function
 * @returns {Long} Value read
 */

/**
 * Reads zig-zag encoded fixed 64 bits.
 * @name Reader#sfixed64
 * @function
 * @returns {Long} Value read
 */

/**
 * Reads a float (32 bit) as a number.
 * @function
 * @returns {number} Value read
 */
Reader.prototype.float = function read_float() {

    /* istanbul ignore if */
    if (this.pos + 4 > this.len)
        throw indexOutOfRange(this, 4);

    var value = util.float.readFloatLE(this.buf, this.pos);
    this.pos += 4;
    return value;
};

/**
 * Reads a double (64 bit float) as a number.
 * @function
 * @returns {number} Value read
 */
Reader.prototype.double = function read_double() {

    /* istanbul ignore if */
    if (this.pos + 8 > this.len)
        throw indexOutOfRange(this, 4);

    var value = util.float.readDoubleLE(this.buf, this.pos);
    this.pos += 8;
    return value;
};

/**
 * Reads a sequence of bytes preceeded by its length as a varint.
 * @returns {Uint8Array} Value read
 */
Reader.prototype.bytes = function read_bytes() {
    var length = this.uint32(),
        start  = this.pos,
        end    = this.pos + length;

    /* istanbul ignore if */
    if (end > this.len)
        throw indexOutOfRange(this, length);

    this.pos += length;
    if (Array.isArray(this.buf)) // plain array
        return this.buf.slice(start, end);
    return start === end // fix for IE 10/Win8 and others' subarray returning array of size 1
        ? new this.buf.constructor(0)
        : this._slice.call(this.buf, start, end);
};

/**
 * Reads a string preceeded by its byte length as a varint.
 * @returns {string} Value read
 */
Reader.prototype.string = function read_string() {
    var bytes = this.bytes();
    return utf8.read(bytes, 0, bytes.length);
};

/**
 * Skips the specified number of bytes if specified, otherwise skips a varint.
 * @param {number} [length] Length if known, otherwise a varint is assumed
 * @returns {Reader} `this`
 */
Reader.prototype.skip = function skip(length) {
    if (typeof length === "number") {
        /* istanbul ignore if */
        if (this.pos + length > this.len)
            throw indexOutOfRange(this, length);
        this.pos += length;
    } else {
        do {
            /* istanbul ignore if */
            if (this.pos >= this.len)
                throw indexOutOfRange(this);
        } while (this.buf[this.pos++] & 128);
    }
    return this;
};

/**
 * Skips the next element of the specified wire type.
 * @param {number} wireType Wire type received
 * @returns {Reader} `this`
 */
Reader.prototype.skipType = function(wireType) {
    switch (wireType) {
        case 0:
            this.skip();
            break;
        case 1:
            this.skip(8);
            break;
        case 2:
            this.skip(this.uint32());
            break;
        case 3:
            while ((wireType = this.uint32() & 7) !== 4) {
                this.skipType(wireType);
            }
            break;
        case 5:
            this.skip(4);
            break;

        /* istanbul ignore next */
        default:
            throw Error("invalid wire type " + wireType + " at offset " + this.pos);
    }
    return this;
};

Reader._configure = function(BufferReader_) {
    BufferReader = BufferReader_;

    var fn = util.Long ? "toLong" : /* istanbul ignore next */ "toNumber";
    util.merge(Reader.prototype, {

        int64: function read_int64() {
            return readLongVarint.call(this)[fn](false);
        },

        uint64: function read_uint64() {
            return readLongVarint.call(this)[fn](true);
        },

        sint64: function read_sint64() {
            return readLongVarint.call(this).zzDecode()[fn](false);
        },

        fixed64: function read_fixed64() {
            return readFixed64.call(this)[fn](true);
        },

        sfixed64: function read_sfixed64() {
            return readFixed64.call(this)[fn](false);
        }

    });
};

},{"./util/minimal":17}],12:[function(require,module,exports){
"use strict";
module.exports = BufferReader;

// extends Reader
var Reader = require("./reader");
(BufferReader.prototype = Object.create(Reader.prototype)).constructor = BufferReader;

var util = require("./util/minimal");

/**
 * Constructs a new buffer reader instance.
 * @classdesc Wire format reader using node buffers.
 * @extends Reader
 * @constructor
 * @param {Buffer} buffer Buffer to read from
 */
function BufferReader(buffer) {
    Reader.call(this, buffer);

    /**
     * Read buffer.
     * @name BufferReader#buf
     * @type {Buffer}
     */
}

/* istanbul ignore else */
if (util.Buffer)
    BufferReader.prototype._slice = util.Buffer.prototype.slice;

/**
 * @override
 */
BufferReader.prototype.string = function read_string_buffer() {
    var len = this.uint32(); // modifies pos
    return this.buf.utf8Slice(this.pos, this.pos = Math.min(this.pos + len, this.len));
};

/**
 * Reads a sequence of bytes preceeded by its length as a varint.
 * @name BufferReader#bytes
 * @function
 * @returns {Buffer} Value read
 */

},{"./reader":11,"./util/minimal":17}],13:[function(require,module,exports){
"use strict";
module.exports = {};

/**
 * Named roots.
 * This is where pbjs stores generated structures (the option `-r, --root` specifies a name).
 * Can also be used manually to make roots available accross modules.
 * @name roots
 * @type {Object.<string,Root>}
 * @example
 * // pbjs -r myroot -o compiled.js ...
 *
 * // in another module:
 * require("./compiled.js");
 *
 * // in any subsequent module:
 * var root = protobuf.roots["myroot"];
 */

},{}],14:[function(require,module,exports){
"use strict";

/**
 * Streaming RPC helpers.
 * @namespace
 */
var rpc = exports;

/**
 * RPC implementation passed to {@link Service#create} performing a service request on network level, i.e. by utilizing http requests or websockets.
 * @typedef RPCImpl
 * @type {function}
 * @param {Method|rpc.ServiceMethod<Message<{}>,Message<{}>>} method Reflected or static method being called
 * @param {Uint8Array} requestData Request data
 * @param {RPCImplCallback} callback Callback function
 * @returns {undefined}
 * @example
 * function rpcImpl(method, requestData, callback) {
 *     if (protobuf.util.lcFirst(method.name) !== "myMethod") // compatible with static code
 *         throw Error("no such method");
 *     asynchronouslyObtainAResponse(requestData, function(err, responseData) {
 *         callback(err, responseData);
 *     });
 * }
 */

/**
 * Node-style callback as used by {@link RPCImpl}.
 * @typedef RPCImplCallback
 * @type {function}
 * @param {Error|null} error Error, if any, otherwise `null`
 * @param {Uint8Array|null} [response] Response data or `null` to signal end of stream, if there hasn't been an error
 * @returns {undefined}
 */

rpc.Service = require("./rpc/service");

},{"./rpc/service":15}],15:[function(require,module,exports){
"use strict";
module.exports = Service;

var util = require("../util/minimal");

// Extends EventEmitter
(Service.prototype = Object.create(util.EventEmitter.prototype)).constructor = Service;

/**
 * A service method callback as used by {@link rpc.ServiceMethod|ServiceMethod}.
 *
 * Differs from {@link RPCImplCallback} in that it is an actual callback of a service method which may not return `response = null`.
 * @typedef rpc.ServiceMethodCallback
 * @template TRes extends Message<TRes>
 * @type {function}
 * @param {Error|null} error Error, if any
 * @param {TRes} [response] Response message
 * @returns {undefined}
 */

/**
 * A service method part of a {@link rpc.Service} as created by {@link Service.create}.
 * @typedef rpc.ServiceMethod
 * @template TReq extends Message<TReq>
 * @template TRes extends Message<TRes>
 * @type {function}
 * @param {TReq|Properties<TReq>} request Request message or plain object
 * @param {rpc.ServiceMethodCallback<TRes>} [callback] Node-style callback called with the error, if any, and the response message
 * @returns {Promise<Message<TRes>>} Promise if `callback` has been omitted, otherwise `undefined`
 */

/**
 * Constructs a new RPC service instance.
 * @classdesc An RPC service as returned by {@link Service#create}.
 * @exports rpc.Service
 * @extends util.EventEmitter
 * @constructor
 * @param {RPCImpl} rpcImpl RPC implementation
 * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
 * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
 */
function Service(rpcImpl, requestDelimited, responseDelimited) {

    if (typeof rpcImpl !== "function")
        throw TypeError("rpcImpl must be a function");

    util.EventEmitter.call(this);

    /**
     * RPC implementation. Becomes `null` once the service is ended.
     * @type {RPCImpl|null}
     */
    this.rpcImpl = rpcImpl;

    /**
     * Whether requests are length-delimited.
     * @type {boolean}
     */
    this.requestDelimited = Boolean(requestDelimited);

    /**
     * Whether responses are length-delimited.
     * @type {boolean}
     */
    this.responseDelimited = Boolean(responseDelimited);
}

/**
 * Calls a service method through {@link rpc.Service#rpcImpl|rpcImpl}.
 * @param {Method|rpc.ServiceMethod<TReq,TRes>} method Reflected or static method
 * @param {Constructor<TReq>} requestCtor Request constructor
 * @param {Constructor<TRes>} responseCtor Response constructor
 * @param {TReq|Properties<TReq>} request Request message or plain object
 * @param {rpc.ServiceMethodCallback<TRes>} callback Service callback
 * @returns {undefined}
 * @template TReq extends Message<TReq>
 * @template TRes extends Message<TRes>
 */
Service.prototype.rpcCall = function rpcCall(method, requestCtor, responseCtor, request, callback) {

    if (!request)
        throw TypeError("request must be specified");

    var self = this;
    if (!callback)
        return util.asPromise(rpcCall, self, method, requestCtor, responseCtor, request);

    if (!self.rpcImpl) {
        setTimeout(function() { callback(Error("already ended")); }, 0);
        return undefined;
    }

    try {
        return self.rpcImpl(
            method,
            requestCtor[self.requestDelimited ? "encodeDelimited" : "encode"](request).finish(),
            function rpcCallback(err, response) {

                if (err) {
                    self.emit("error", err, method);
                    return callback(err);
                }

                if (response === null) {
                    self.end(/* endedByRPC */ true);
                    return undefined;
                }

                if (!(response instanceof responseCtor)) {
                    try {
                        response = responseCtor[self.responseDelimited ? "decodeDelimited" : "decode"](response);
                    } catch (err) {
                        self.emit("error", err, method);
                        return callback(err);
                    }
                }

                self.emit("data", response, method);
                return callback(null, response);
            }
        );
    } catch (err) {
        self.emit("error", err, method);
        setTimeout(function() { callback(err); }, 0);
        return undefined;
    }
};

/**
 * Ends this service and emits the `end` event.
 * @param {boolean} [endedByRPC=false] Whether the service has been ended by the RPC implementation.
 * @returns {rpc.Service} `this`
 */
Service.prototype.end = function end(endedByRPC) {
    if (this.rpcImpl) {
        if (!endedByRPC) // signal end to rpcImpl
            this.rpcImpl(null, null, null);
        this.rpcImpl = null;
        this.emit("end").off();
    }
    return this;
};

},{"../util/minimal":17}],16:[function(require,module,exports){
"use strict";
module.exports = LongBits;

var util = require("../util/minimal");

/**
 * Constructs new long bits.
 * @classdesc Helper class for working with the low and high bits of a 64 bit value.
 * @memberof util
 * @constructor
 * @param {number} lo Low 32 bits, unsigned
 * @param {number} hi High 32 bits, unsigned
 */
function LongBits(lo, hi) {

    // note that the casts below are theoretically unnecessary as of today, but older statically
    // generated converter code might still call the ctor with signed 32bits. kept for compat.

    /**
     * Low bits.
     * @type {number}
     */
    this.lo = lo >>> 0;

    /**
     * High bits.
     * @type {number}
     */
    this.hi = hi >>> 0;
}

/**
 * Zero bits.
 * @memberof util.LongBits
 * @type {util.LongBits}
 */
var zero = LongBits.zero = new LongBits(0, 0);

zero.toNumber = function() { return 0; };
zero.zzEncode = zero.zzDecode = function() { return this; };
zero.length = function() { return 1; };

/**
 * Zero hash.
 * @memberof util.LongBits
 * @type {string}
 */
var zeroHash = LongBits.zeroHash = "\0\0\0\0\0\0\0\0";

/**
 * Constructs new long bits from the specified number.
 * @param {number} value Value
 * @returns {util.LongBits} Instance
 */
LongBits.fromNumber = function fromNumber(value) {
    if (value === 0)
        return zero;
    var sign = value < 0;
    if (sign)
        value = -value;
    var lo = value >>> 0,
        hi = (value - lo) / 4294967296 >>> 0;
    if (sign) {
        hi = ~hi >>> 0;
        lo = ~lo >>> 0;
        if (++lo > 4294967295) {
            lo = 0;
            if (++hi > 4294967295)
                hi = 0;
        }
    }
    return new LongBits(lo, hi);
};

/**
 * Constructs new long bits from a number, long or string.
 * @param {Long|number|string} value Value
 * @returns {util.LongBits} Instance
 */
LongBits.from = function from(value) {
    if (typeof value === "number")
        return LongBits.fromNumber(value);
    if (util.isString(value)) {
        /* istanbul ignore else */
        if (util.Long)
            value = util.Long.fromString(value);
        else
            return LongBits.fromNumber(parseInt(value, 10));
    }
    return value.low || value.high ? new LongBits(value.low >>> 0, value.high >>> 0) : zero;
};

/**
 * Converts this long bits to a possibly unsafe JavaScript number.
 * @param {boolean} [unsigned=false] Whether unsigned or not
 * @returns {number} Possibly unsafe number
 */
LongBits.prototype.toNumber = function toNumber(unsigned) {
    if (!unsigned && this.hi >>> 31) {
        var lo = ~this.lo + 1 >>> 0,
            hi = ~this.hi     >>> 0;
        if (!lo)
            hi = hi + 1 >>> 0;
        return -(lo + hi * 4294967296);
    }
    return this.lo + this.hi * 4294967296;
};

/**
 * Converts this long bits to a long.
 * @param {boolean} [unsigned=false] Whether unsigned or not
 * @returns {Long} Long
 */
LongBits.prototype.toLong = function toLong(unsigned) {
    return util.Long
        ? new util.Long(this.lo | 0, this.hi | 0, Boolean(unsigned))
        /* istanbul ignore next */
        : { low: this.lo | 0, high: this.hi | 0, unsigned: Boolean(unsigned) };
};

var charCodeAt = String.prototype.charCodeAt;

/**
 * Constructs new long bits from the specified 8 characters long hash.
 * @param {string} hash Hash
 * @returns {util.LongBits} Bits
 */
LongBits.fromHash = function fromHash(hash) {
    if (hash === zeroHash)
        return zero;
    return new LongBits(
        ( charCodeAt.call(hash, 0)
        | charCodeAt.call(hash, 1) << 8
        | charCodeAt.call(hash, 2) << 16
        | charCodeAt.call(hash, 3) << 24) >>> 0
    ,
        ( charCodeAt.call(hash, 4)
        | charCodeAt.call(hash, 5) << 8
        | charCodeAt.call(hash, 6) << 16
        | charCodeAt.call(hash, 7) << 24) >>> 0
    );
};

/**
 * Converts this long bits to a 8 characters long hash.
 * @returns {string} Hash
 */
LongBits.prototype.toHash = function toHash() {
    return String.fromCharCode(
        this.lo        & 255,
        this.lo >>> 8  & 255,
        this.lo >>> 16 & 255,
        this.lo >>> 24      ,
        this.hi        & 255,
        this.hi >>> 8  & 255,
        this.hi >>> 16 & 255,
        this.hi >>> 24
    );
};

/**
 * Zig-zag encodes this long bits.
 * @returns {util.LongBits} `this`
 */
LongBits.prototype.zzEncode = function zzEncode() {
    var mask =   this.hi >> 31;
    this.hi  = ((this.hi << 1 | this.lo >>> 31) ^ mask) >>> 0;
    this.lo  = ( this.lo << 1                   ^ mask) >>> 0;
    return this;
};

/**
 * Zig-zag decodes this long bits.
 * @returns {util.LongBits} `this`
 */
LongBits.prototype.zzDecode = function zzDecode() {
    var mask = -(this.lo & 1);
    this.lo  = ((this.lo >>> 1 | this.hi << 31) ^ mask) >>> 0;
    this.hi  = ( this.hi >>> 1                  ^ mask) >>> 0;
    return this;
};

/**
 * Calculates the length of this longbits when encoded as a varint.
 * @returns {number} Length
 */
LongBits.prototype.length = function length() {
    var part0 =  this.lo,
        part1 = (this.lo >>> 28 | this.hi << 4) >>> 0,
        part2 =  this.hi >>> 24;
    return part2 === 0
         ? part1 === 0
           ? part0 < 16384
             ? part0 < 128 ? 1 : 2
             : part0 < 2097152 ? 3 : 4
           : part1 < 16384
             ? part1 < 128 ? 5 : 6
             : part1 < 2097152 ? 7 : 8
         : part2 < 128 ? 9 : 10;
};

},{"../util/minimal":17}],17:[function(require,module,exports){
(function (global){
"use strict";
var util = exports;

// used to return a Promise where callback is omitted
util.asPromise = require("@protobufjs/aspromise");

// converts to / from base64 encoded strings
util.base64 = require("@protobufjs/base64");

// base class of rpc.Service
util.EventEmitter = require("@protobufjs/eventemitter");

// float handling accross browsers
util.float = require("@protobufjs/float");

// requires modules optionally and hides the call from bundlers
util.inquire = require("@protobufjs/inquire");

// converts to / from utf8 encoded strings
util.utf8 = require("@protobufjs/utf8");

// provides a node-like buffer pool in the browser
util.pool = require("@protobufjs/pool");

// utility to work with the low and high bits of a 64 bit value
util.LongBits = require("./longbits");

// global object reference
util.global = typeof window !== "undefined" && window
           || typeof global !== "undefined" && global
           || typeof self   !== "undefined" && self
           || this; // eslint-disable-line no-invalid-this

/**
 * An immuable empty array.
 * @memberof util
 * @type {Array.<*>}
 * @const
 */
util.emptyArray = Object.freeze ? Object.freeze([]) : /* istanbul ignore next */ []; // used on prototypes

/**
 * An immutable empty object.
 * @type {Object}
 * @const
 */
util.emptyObject = Object.freeze ? Object.freeze({}) : /* istanbul ignore next */ {}; // used on prototypes

/**
 * Whether running within node or not.
 * @memberof util
 * @type {boolean}
 * @const
 */
util.isNode = Boolean(util.global.process && util.global.process.versions && util.global.process.versions.node);

/**
 * Tests if the specified value is an integer.
 * @function
 * @param {*} value Value to test
 * @returns {boolean} `true` if the value is an integer
 */
util.isInteger = Number.isInteger || /* istanbul ignore next */ function isInteger(value) {
    return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
};

/**
 * Tests if the specified value is a string.
 * @param {*} value Value to test
 * @returns {boolean} `true` if the value is a string
 */
util.isString = function isString(value) {
    return typeof value === "string" || value instanceof String;
};

/**
 * Tests if the specified value is a non-null object.
 * @param {*} value Value to test
 * @returns {boolean} `true` if the value is a non-null object
 */
util.isObject = function isObject(value) {
    return value && typeof value === "object";
};

/**
 * Checks if a property on a message is considered to be present.
 * This is an alias of {@link util.isSet}.
 * @function
 * @param {Object} obj Plain object or message instance
 * @param {string} prop Property name
 * @returns {boolean} `true` if considered to be present, otherwise `false`
 */
util.isset =

/**
 * Checks if a property on a message is considered to be present.
 * @param {Object} obj Plain object or message instance
 * @param {string} prop Property name
 * @returns {boolean} `true` if considered to be present, otherwise `false`
 */
util.isSet = function isSet(obj, prop) {
    var value = obj[prop];
    if (value != null && obj.hasOwnProperty(prop)) // eslint-disable-line eqeqeq, no-prototype-builtins
        return typeof value !== "object" || (Array.isArray(value) ? value.length : Object.keys(value).length) > 0;
    return false;
};

/**
 * Any compatible Buffer instance.
 * This is a minimal stand-alone definition of a Buffer instance. The actual type is that exported by node's typings.
 * @interface Buffer
 * @extends Uint8Array
 */

/**
 * Node's Buffer class if available.
 * @type {Constructor<Buffer>}
 */
util.Buffer = (function() {
    try {
        var Buffer = util.inquire("buffer").Buffer;
        // refuse to use non-node buffers if not explicitly assigned (perf reasons):
        return Buffer.prototype.utf8Write ? Buffer : /* istanbul ignore next */ null;
    } catch (e) {
        /* istanbul ignore next */
        return null;
    }
})();

// Internal alias of or polyfull for Buffer.from.
util._Buffer_from = null;

// Internal alias of or polyfill for Buffer.allocUnsafe.
util._Buffer_allocUnsafe = null;

/**
 * Creates a new buffer of whatever type supported by the environment.
 * @param {number|number[]} [sizeOrArray=0] Buffer size or number array
 * @returns {Uint8Array|Buffer} Buffer
 */
util.newBuffer = function newBuffer(sizeOrArray) {
    /* istanbul ignore next */
    return typeof sizeOrArray === "number"
        ? util.Buffer
            ? util._Buffer_allocUnsafe(sizeOrArray)
            : new util.Array(sizeOrArray)
        : util.Buffer
            ? util._Buffer_from(sizeOrArray)
            : typeof Uint8Array === "undefined"
                ? sizeOrArray
                : new Uint8Array(sizeOrArray);
};

/**
 * Array implementation used in the browser. `Uint8Array` if supported, otherwise `Array`.
 * @type {Constructor<Uint8Array>}
 */
util.Array = typeof Uint8Array !== "undefined" ? Uint8Array /* istanbul ignore next */ : Array;

/**
 * Any compatible Long instance.
 * This is a minimal stand-alone definition of a Long instance. The actual type is that exported by long.js.
 * @interface Long
 * @property {number} low Low bits
 * @property {number} high High bits
 * @property {boolean} unsigned Whether unsigned or not
 */

/**
 * Long.js's Long class if available.
 * @type {Constructor<Long>}
 */
util.Long = /* istanbul ignore next */ util.global.dcodeIO && /* istanbul ignore next */ util.global.dcodeIO.Long
         || /* istanbul ignore next */ util.global.Long
         || util.inquire("long");

/**
 * Regular expression used to verify 2 bit (`bool`) map keys.
 * @type {RegExp}
 * @const
 */
util.key2Re = /^true|false|0|1$/;

/**
 * Regular expression used to verify 32 bit (`int32` etc.) map keys.
 * @type {RegExp}
 * @const
 */
util.key32Re = /^-?(?:0|[1-9][0-9]*)$/;

/**
 * Regular expression used to verify 64 bit (`int64` etc.) map keys.
 * @type {RegExp}
 * @const
 */
util.key64Re = /^(?:[\\x00-\\xff]{8}|-?(?:0|[1-9][0-9]*))$/;

/**
 * Converts a number or long to an 8 characters long hash string.
 * @param {Long|number} value Value to convert
 * @returns {string} Hash
 */
util.longToHash = function longToHash(value) {
    return value
        ? util.LongBits.from(value).toHash()
        : util.LongBits.zeroHash;
};

/**
 * Converts an 8 characters long hash string to a long or number.
 * @param {string} hash Hash
 * @param {boolean} [unsigned=false] Whether unsigned or not
 * @returns {Long|number} Original value
 */
util.longFromHash = function longFromHash(hash, unsigned) {
    var bits = util.LongBits.fromHash(hash);
    if (util.Long)
        return util.Long.fromBits(bits.lo, bits.hi, unsigned);
    return bits.toNumber(Boolean(unsigned));
};

/**
 * Merges the properties of the source object into the destination object.
 * @memberof util
 * @param {Object.<string,*>} dst Destination object
 * @param {Object.<string,*>} src Source object
 * @param {boolean} [ifNotSet=false] Merges only if the key is not already set
 * @returns {Object.<string,*>} Destination object
 */
function merge(dst, src, ifNotSet) { // used by converters
    for (var keys = Object.keys(src), i = 0; i < keys.length; ++i)
        if (dst[keys[i]] === undefined || !ifNotSet)
            dst[keys[i]] = src[keys[i]];
    return dst;
}

util.merge = merge;

/**
 * Converts the first character of a string to lower case.
 * @param {string} str String to convert
 * @returns {string} Converted string
 */
util.lcFirst = function lcFirst(str) {
    return str.charAt(0).toLowerCase() + str.substring(1);
};

/**
 * Creates a custom error constructor.
 * @memberof util
 * @param {string} name Error name
 * @returns {Constructor<Error>} Custom error constructor
 */
function newError(name) {

    function CustomError(message, properties) {

        if (!(this instanceof CustomError))
            return new CustomError(message, properties);

        // Error.call(this, message);
        // ^ just returns a new error instance because the ctor can be called as a function

        Object.defineProperty(this, "message", { get: function() { return message; } });

        /* istanbul ignore next */
        if (Error.captureStackTrace) // node
            Error.captureStackTrace(this, CustomError);
        else
            Object.defineProperty(this, "stack", { value: (new Error()).stack || "" });

        if (properties)
            merge(this, properties);
    }

    (CustomError.prototype = Object.create(Error.prototype)).constructor = CustomError;

    Object.defineProperty(CustomError.prototype, "name", { get: function() { return name; } });

    CustomError.prototype.toString = function toString() {
        return this.name + ": " + this.message;
    };

    return CustomError;
}

util.newError = newError;

/**
 * Constructs a new protocol error.
 * @classdesc Error subclass indicating a protocol specifc error.
 * @memberof util
 * @extends Error
 * @template T extends Message<T>
 * @constructor
 * @param {string} message Error message
 * @param {Object.<string,*>} [properties] Additional properties
 * @example
 * try {
 *     MyMessage.decode(someBuffer); // throws if required fields are missing
 * } catch (e) {
 *     if (e instanceof ProtocolError && e.instance)
 *         console.log("decoded so far: " + JSON.stringify(e.instance));
 * }
 */
util.ProtocolError = newError("ProtocolError");

/**
 * So far decoded message instance.
 * @name util.ProtocolError#instance
 * @type {Message<T>}
 */

/**
 * A OneOf getter as returned by {@link util.oneOfGetter}.
 * @typedef OneOfGetter
 * @type {function}
 * @returns {string|undefined} Set field name, if any
 */

/**
 * Builds a getter for a oneof's present field name.
 * @param {string[]} fieldNames Field names
 * @returns {OneOfGetter} Unbound getter
 */
util.oneOfGetter = function getOneOf(fieldNames) {
    var fieldMap = {};
    for (var i = 0; i < fieldNames.length; ++i)
        fieldMap[fieldNames[i]] = 1;

    /**
     * @returns {string|undefined} Set field name, if any
     * @this Object
     * @ignore
     */
    return function() { // eslint-disable-line consistent-return
        for (var keys = Object.keys(this), i = keys.length - 1; i > -1; --i)
            if (fieldMap[keys[i]] === 1 && this[keys[i]] !== undefined && this[keys[i]] !== null)
                return keys[i];
    };
};

/**
 * A OneOf setter as returned by {@link util.oneOfSetter}.
 * @typedef OneOfSetter
 * @type {function}
 * @param {string|undefined} value Field name
 * @returns {undefined}
 */

/**
 * Builds a setter for a oneof's present field name.
 * @param {string[]} fieldNames Field names
 * @returns {OneOfSetter} Unbound setter
 */
util.oneOfSetter = function setOneOf(fieldNames) {

    /**
     * @param {string} name Field name
     * @returns {undefined}
     * @this Object
     * @ignore
     */
    return function(name) {
        for (var i = 0; i < fieldNames.length; ++i)
            if (fieldNames[i] !== name)
                delete this[fieldNames[i]];
    };
};

/**
 * Default conversion options used for {@link Message#toJSON} implementations.
 *
 * These options are close to proto3's JSON mapping with the exception that internal types like Any are handled just like messages. More precisely:
 *
 * - Longs become strings
 * - Enums become string keys
 * - Bytes become base64 encoded strings
 * - (Sub-)Messages become plain objects
 * - Maps become plain objects with all string keys
 * - Repeated fields become arrays
 * - NaN and Infinity for float and double fields become strings
 *
 * @type {IConversionOptions}
 * @see https://developers.google.com/protocol-buffers/docs/proto3?hl=en#json
 */
util.toJSONOptions = {
    longs: String,
    enums: String,
    bytes: String,
    json: true
};

// Sets up buffer utility according to the environment (called in index-minimal)
util._configure = function() {
    var Buffer = util.Buffer;
    /* istanbul ignore if */
    if (!Buffer) {
        util._Buffer_from = util._Buffer_allocUnsafe = null;
        return;
    }
    // because node 4.x buffers are incompatible & immutable
    // see: https://github.com/dcodeIO/protobuf.js/pull/665
    util._Buffer_from = Buffer.from !== Uint8Array.from && Buffer.from ||
        /* istanbul ignore next */
        function Buffer_from(value, encoding) {
            return new Buffer(value, encoding);
        };
    util._Buffer_allocUnsafe = Buffer.allocUnsafe ||
        /* istanbul ignore next */
        function Buffer_allocUnsafe(size) {
            return new Buffer(size);
        };
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./longbits":16,"@protobufjs/aspromise":2,"@protobufjs/base64":3,"@protobufjs/eventemitter":4,"@protobufjs/float":5,"@protobufjs/inquire":6,"@protobufjs/pool":7,"@protobufjs/utf8":8}],18:[function(require,module,exports){
"use strict";
module.exports = Writer;

var util      = require("./util/minimal");

var BufferWriter; // cyclic

var LongBits  = util.LongBits,
    base64    = util.base64,
    utf8      = util.utf8;

/**
 * Constructs a new writer operation instance.
 * @classdesc Scheduled writer operation.
 * @constructor
 * @param {function(*, Uint8Array, number)} fn Function to call
 * @param {number} len Value byte length
 * @param {*} val Value to write
 * @ignore
 */
function Op(fn, len, val) {

    /**
     * Function to call.
     * @type {function(Uint8Array, number, *)}
     */
    this.fn = fn;

    /**
     * Value byte length.
     * @type {number}
     */
    this.len = len;

    /**
     * Next operation.
     * @type {Writer.Op|undefined}
     */
    this.next = undefined;

    /**
     * Value to write.
     * @type {*}
     */
    this.val = val; // type varies
}

/* istanbul ignore next */
function noop() {} // eslint-disable-line no-empty-function

/**
 * Constructs a new writer state instance.
 * @classdesc Copied writer state.
 * @memberof Writer
 * @constructor
 * @param {Writer} writer Writer to copy state from
 * @ignore
 */
function State(writer) {

    /**
     * Current head.
     * @type {Writer.Op}
     */
    this.head = writer.head;

    /**
     * Current tail.
     * @type {Writer.Op}
     */
    this.tail = writer.tail;

    /**
     * Current buffer length.
     * @type {number}
     */
    this.len = writer.len;

    /**
     * Next state.
     * @type {State|null}
     */
    this.next = writer.states;
}

/**
 * Constructs a new writer instance.
 * @classdesc Wire format writer using `Uint8Array` if available, otherwise `Array`.
 * @constructor
 */
function Writer() {

    /**
     * Current length.
     * @type {number}
     */
    this.len = 0;

    /**
     * Operations head.
     * @type {Object}
     */
    this.head = new Op(noop, 0, 0);

    /**
     * Operations tail
     * @type {Object}
     */
    this.tail = this.head;

    /**
     * Linked forked states.
     * @type {Object|null}
     */
    this.states = null;

    // When a value is written, the writer calculates its byte length and puts it into a linked
    // list of operations to perform when finish() is called. This both allows us to allocate
    // buffers of the exact required size and reduces the amount of work we have to do compared
    // to first calculating over objects and then encoding over objects. In our case, the encoding
    // part is just a linked list walk calling operations with already prepared values.
}

/**
 * Creates a new writer.
 * @function
 * @returns {BufferWriter|Writer} A {@link BufferWriter} when Buffers are supported, otherwise a {@link Writer}
 */
Writer.create = util.Buffer
    ? function create_buffer_setup() {
        return (Writer.create = function create_buffer() {
            return new BufferWriter();
        })();
    }
    /* istanbul ignore next */
    : function create_array() {
        return new Writer();
    };

/**
 * Allocates a buffer of the specified size.
 * @param {number} size Buffer size
 * @returns {Uint8Array} Buffer
 */
Writer.alloc = function alloc(size) {
    return new util.Array(size);
};

// Use Uint8Array buffer pool in the browser, just like node does with buffers
/* istanbul ignore else */
if (util.Array !== Array)
    Writer.alloc = util.pool(Writer.alloc, util.Array.prototype.subarray);

/**
 * Pushes a new operation to the queue.
 * @param {function(Uint8Array, number, *)} fn Function to call
 * @param {number} len Value byte length
 * @param {number} val Value to write
 * @returns {Writer} `this`
 * @private
 */
Writer.prototype._push = function push(fn, len, val) {
    this.tail = this.tail.next = new Op(fn, len, val);
    this.len += len;
    return this;
};

function writeByte(val, buf, pos) {
    buf[pos] = val & 255;
}

function writeVarint32(val, buf, pos) {
    while (val > 127) {
        buf[pos++] = val & 127 | 128;
        val >>>= 7;
    }
    buf[pos] = val;
}

/**
 * Constructs a new varint writer operation instance.
 * @classdesc Scheduled varint writer operation.
 * @extends Op
 * @constructor
 * @param {number} len Value byte length
 * @param {number} val Value to write
 * @ignore
 */
function VarintOp(len, val) {
    this.len = len;
    this.next = undefined;
    this.val = val;
}

VarintOp.prototype = Object.create(Op.prototype);
VarintOp.prototype.fn = writeVarint32;

/**
 * Writes an unsigned 32 bit value as a varint.
 * @param {number} value Value to write
 * @returns {Writer} `this`
 */
Writer.prototype.uint32 = function write_uint32(value) {
    // here, the call to this.push has been inlined and a varint specific Op subclass is used.
    // uint32 is by far the most frequently used operation and benefits significantly from this.
    this.len += (this.tail = this.tail.next = new VarintOp(
        (value = value >>> 0)
                < 128       ? 1
        : value < 16384     ? 2
        : value < 2097152   ? 3
        : value < 268435456 ? 4
        :                     5,
    value)).len;
    return this;
};

/**
 * Writes a signed 32 bit value as a varint.
 * @function
 * @param {number} value Value to write
 * @returns {Writer} `this`
 */
Writer.prototype.int32 = function write_int32(value) {
    return value < 0
        ? this._push(writeVarint64, 10, LongBits.fromNumber(value)) // 10 bytes per spec
        : this.uint32(value);
};

/**
 * Writes a 32 bit value as a varint, zig-zag encoded.
 * @param {number} value Value to write
 * @returns {Writer} `this`
 */
Writer.prototype.sint32 = function write_sint32(value) {
    return this.uint32((value << 1 ^ value >> 31) >>> 0);
};

function writeVarint64(val, buf, pos) {
    while (val.hi) {
        buf[pos++] = val.lo & 127 | 128;
        val.lo = (val.lo >>> 7 | val.hi << 25) >>> 0;
        val.hi >>>= 7;
    }
    while (val.lo > 127) {
        buf[pos++] = val.lo & 127 | 128;
        val.lo = val.lo >>> 7;
    }
    buf[pos++] = val.lo;
}

/**
 * Writes an unsigned 64 bit value as a varint.
 * @param {Long|number|string} value Value to write
 * @returns {Writer} `this`
 * @throws {TypeError} If `value` is a string and no long library is present.
 */
Writer.prototype.uint64 = function write_uint64(value) {
    var bits = LongBits.from(value);
    return this._push(writeVarint64, bits.length(), bits);
};

/**
 * Writes a signed 64 bit value as a varint.
 * @function
 * @param {Long|number|string} value Value to write
 * @returns {Writer} `this`
 * @throws {TypeError} If `value` is a string and no long library is present.
 */
Writer.prototype.int64 = Writer.prototype.uint64;

/**
 * Writes a signed 64 bit value as a varint, zig-zag encoded.
 * @param {Long|number|string} value Value to write
 * @returns {Writer} `this`
 * @throws {TypeError} If `value` is a string and no long library is present.
 */
Writer.prototype.sint64 = function write_sint64(value) {
    var bits = LongBits.from(value).zzEncode();
    return this._push(writeVarint64, bits.length(), bits);
};

/**
 * Writes a boolish value as a varint.
 * @param {boolean} value Value to write
 * @returns {Writer} `this`
 */
Writer.prototype.bool = function write_bool(value) {
    return this._push(writeByte, 1, value ? 1 : 0);
};

function writeFixed32(val, buf, pos) {
    buf[pos    ] =  val         & 255;
    buf[pos + 1] =  val >>> 8   & 255;
    buf[pos + 2] =  val >>> 16  & 255;
    buf[pos + 3] =  val >>> 24;
}

/**
 * Writes an unsigned 32 bit value as fixed 32 bits.
 * @param {number} value Value to write
 * @returns {Writer} `this`
 */
Writer.prototype.fixed32 = function write_fixed32(value) {
    return this._push(writeFixed32, 4, value >>> 0);
};

/**
 * Writes a signed 32 bit value as fixed 32 bits.
 * @function
 * @param {number} value Value to write
 * @returns {Writer} `this`
 */
Writer.prototype.sfixed32 = Writer.prototype.fixed32;

/**
 * Writes an unsigned 64 bit value as fixed 64 bits.
 * @param {Long|number|string} value Value to write
 * @returns {Writer} `this`
 * @throws {TypeError} If `value` is a string and no long library is present.
 */
Writer.prototype.fixed64 = function write_fixed64(value) {
    var bits = LongBits.from(value);
    return this._push(writeFixed32, 4, bits.lo)._push(writeFixed32, 4, bits.hi);
};

/**
 * Writes a signed 64 bit value as fixed 64 bits.
 * @function
 * @param {Long|number|string} value Value to write
 * @returns {Writer} `this`
 * @throws {TypeError} If `value` is a string and no long library is present.
 */
Writer.prototype.sfixed64 = Writer.prototype.fixed64;

/**
 * Writes a float (32 bit).
 * @function
 * @param {number} value Value to write
 * @returns {Writer} `this`
 */
Writer.prototype.float = function write_float(value) {
    return this._push(util.float.writeFloatLE, 4, value);
};

/**
 * Writes a double (64 bit float).
 * @function
 * @param {number} value Value to write
 * @returns {Writer} `this`
 */
Writer.prototype.double = function write_double(value) {
    return this._push(util.float.writeDoubleLE, 8, value);
};

var writeBytes = util.Array.prototype.set
    ? function writeBytes_set(val, buf, pos) {
        buf.set(val, pos); // also works for plain array values
    }
    /* istanbul ignore next */
    : function writeBytes_for(val, buf, pos) {
        for (var i = 0; i < val.length; ++i)
            buf[pos + i] = val[i];
    };

/**
 * Writes a sequence of bytes.
 * @param {Uint8Array|string} value Buffer or base64 encoded string to write
 * @returns {Writer} `this`
 */
Writer.prototype.bytes = function write_bytes(value) {
    var len = value.length >>> 0;
    if (!len)
        return this._push(writeByte, 1, 0);
    if (util.isString(value)) {
        var buf = Writer.alloc(len = base64.length(value));
        base64.decode(value, buf, 0);
        value = buf;
    }
    return this.uint32(len)._push(writeBytes, len, value);
};

/**
 * Writes a string.
 * @param {string} value Value to write
 * @returns {Writer} `this`
 */
Writer.prototype.string = function write_string(value) {
    var len = utf8.length(value);
    return len
        ? this.uint32(len)._push(utf8.write, len, value)
        : this._push(writeByte, 1, 0);
};

/**
 * Forks this writer's state by pushing it to a stack.
 * Calling {@link Writer#reset|reset} or {@link Writer#ldelim|ldelim} resets the writer to the previous state.
 * @returns {Writer} `this`
 */
Writer.prototype.fork = function fork() {
    this.states = new State(this);
    this.head = this.tail = new Op(noop, 0, 0);
    this.len = 0;
    return this;
};

/**
 * Resets this instance to the last state.
 * @returns {Writer} `this`
 */
Writer.prototype.reset = function reset() {
    if (this.states) {
        this.head   = this.states.head;
        this.tail   = this.states.tail;
        this.len    = this.states.len;
        this.states = this.states.next;
    } else {
        this.head = this.tail = new Op(noop, 0, 0);
        this.len  = 0;
    }
    return this;
};

/**
 * Resets to the last state and appends the fork state's current write length as a varint followed by its operations.
 * @returns {Writer} `this`
 */
Writer.prototype.ldelim = function ldelim() {
    var head = this.head,
        tail = this.tail,
        len  = this.len;
    this.reset().uint32(len);
    if (len) {
        this.tail.next = head.next; // skip noop
        this.tail = tail;
        this.len += len;
    }
    return this;
};

/**
 * Finishes the write operation.
 * @returns {Uint8Array} Finished buffer
 */
Writer.prototype.finish = function finish() {
    var head = this.head.next, // skip noop
        buf  = this.constructor.alloc(this.len),
        pos  = 0;
    while (head) {
        head.fn(head.val, buf, pos);
        pos += head.len;
        head = head.next;
    }
    // this.head = this.tail = null;
    return buf;
};

Writer._configure = function(BufferWriter_) {
    BufferWriter = BufferWriter_;
};

},{"./util/minimal":17}],19:[function(require,module,exports){
"use strict";
module.exports = BufferWriter;

// extends Writer
var Writer = require("./writer");
(BufferWriter.prototype = Object.create(Writer.prototype)).constructor = BufferWriter;

var util = require("./util/minimal");

var Buffer = util.Buffer;

/**
 * Constructs a new buffer writer instance.
 * @classdesc Wire format writer using node buffers.
 * @extends Writer
 * @constructor
 */
function BufferWriter() {
    Writer.call(this);
}

/**
 * Allocates a buffer of the specified size.
 * @param {number} size Buffer size
 * @returns {Buffer} Buffer
 */
BufferWriter.alloc = function alloc_buffer(size) {
    return (BufferWriter.alloc = util._Buffer_allocUnsafe)(size);
};

var writeBytesBuffer = Buffer && Buffer.prototype instanceof Uint8Array && Buffer.prototype.set.name === "set"
    ? function writeBytesBuffer_set(val, buf, pos) {
        buf.set(val, pos); // faster than copy (requires node >= 4 where Buffers extend Uint8Array and set is properly inherited)
                           // also works for plain array values
    }
    /* istanbul ignore next */
    : function writeBytesBuffer_copy(val, buf, pos) {
        if (val.copy) // Buffer values
            val.copy(buf, pos, 0, val.length);
        else for (var i = 0; i < val.length;) // plain array values
            buf[pos++] = val[i++];
    };

/**
 * @override
 */
BufferWriter.prototype.bytes = function write_bytes_buffer(value) {
    if (util.isString(value))
        value = util._Buffer_from(value, "base64");
    var len = value.length >>> 0;
    this.uint32(len);
    if (len)
        this._push(writeBytesBuffer, len, value);
    return this;
};

function writeStringBuffer(val, buf, pos) {
    if (val.length < 40) // plain js is faster for short strings (probably due to redundant assertions)
        util.utf8.write(val, buf, pos);
    else
        buf.utf8Write(val, pos);
}

/**
 * @override
 */
BufferWriter.prototype.string = function write_string_buffer(value) {
    var len = Buffer.byteLength(value);
    this.uint32(len);
    if (len)
        this._push(writeStringBuffer, len, value);
    return this;
};


/**
 * Finishes the write operation.
 * @name BufferWriter#finish
 * @function
 * @returns {Buffer} Finished buffer
 */

},{"./util/minimal":17,"./writer":18}]},{},[1])(1)
});
