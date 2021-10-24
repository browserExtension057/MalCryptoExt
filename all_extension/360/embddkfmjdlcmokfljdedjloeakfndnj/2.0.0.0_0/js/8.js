// [AIV_SHORT]  Build version: 0.14.0 - Tuesday, June 25th, 2019, 2:12:23 PM  
 webpackJsonp([8],{

/***/ 107:
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(159), __esModule: true };

/***/ }),

/***/ 108:
/***/ (function(module, exports, __webpack_require__) {

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = __webpack_require__(26);
var TAG = __webpack_require__(7)('toStringTag');
// ES3 wrong here
var ARG = cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};


/***/ }),

/***/ 109:
/***/ (function(module, exports, __webpack_require__) {

// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject = __webpack_require__(16);
var aFunction = __webpack_require__(31);
var SPECIES = __webpack_require__(7)('species');
module.exports = function (O, D) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};


/***/ }),

/***/ 110:
/***/ (function(module, exports, __webpack_require__) {

var ctx = __webpack_require__(25);
var invoke = __webpack_require__(164);
var html = __webpack_require__(64);
var cel = __webpack_require__(46);
var global = __webpack_require__(5);
var process = global.process;
var setTask = global.setImmediate;
var clearTask = global.clearImmediate;
var MessageChannel = global.MessageChannel;
var Dispatch = global.Dispatch;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer, channel, port;
var run = function () {
  var id = +this;
  // eslint-disable-next-line no-prototype-builtins
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function (event) {
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!setTask || !clearTask) {
  setTask = function setImmediate(fn) {
    var args = [];
    var i = 1;
    while (arguments.length > i) args.push(arguments[i++]);
    queue[++counter] = function () {
      // eslint-disable-next-line no-new-func
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (__webpack_require__(26)(process) == 'process') {
    defer = function (id) {
      process.nextTick(ctx(run, id, 1));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if (MessageChannel) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (global.addEventListener && typeof postMessage == 'function' && !global.importScripts) {
    defer = function (id) {
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in cel('script')) {
    defer = function (id) {
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set: setTask,
  clear: clearTask
};


/***/ }),

/***/ 111:
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return { e: false, v: exec() };
  } catch (e) {
    return { e: true, v: e };
  }
};


/***/ }),

/***/ 112:
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(16);
var isObject = __webpack_require__(9);
var newPromiseCapability = __webpack_require__(65);

module.exports = function (C, x) {
  anObject(C);
  if (isObject(x) && x.constructor === C) return x;
  var promiseCapability = newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};


/***/ }),

/***/ 113:
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};


/***/ }),

/***/ 157:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(173);


/***/ }),

/***/ 158:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _promise = __webpack_require__(107);

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (fn) {
  return function () {
    var gen = fn.apply(this, arguments);
    return new _promise2.default(function (resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }

        if (info.done) {
          resolve(value);
        } else {
          return _promise2.default.resolve(value).then(function (value) {
            step("next", value);
          }, function (err) {
            step("throw", err);
          });
        }
      }

      return step("next");
    });
  };
};

/***/ }),

/***/ 159:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(80);
__webpack_require__(91);
__webpack_require__(81);
__webpack_require__(160);
__webpack_require__(169);
__webpack_require__(170);
module.exports = __webpack_require__(6).Promise;


/***/ }),

/***/ 160:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__(27);
var global = __webpack_require__(5);
var ctx = __webpack_require__(25);
var classof = __webpack_require__(108);
var $export = __webpack_require__(13);
var isObject = __webpack_require__(9);
var aFunction = __webpack_require__(31);
var anInstance = __webpack_require__(88);
var forOf = __webpack_require__(79);
var speciesConstructor = __webpack_require__(109);
var task = __webpack_require__(110).set;
var microtask = __webpack_require__(165)();
var newPromiseCapabilityModule = __webpack_require__(65);
var perform = __webpack_require__(111);
var userAgent = __webpack_require__(166);
var promiseResolve = __webpack_require__(112);
var PROMISE = 'Promise';
var TypeError = global.TypeError;
var process = global.process;
var versions = process && process.versions;
var v8 = versions && versions.v8 || '';
var $Promise = global[PROMISE];
var isNode = classof(process) == 'process';
var empty = function () { /* empty */ };
var Internal, newGenericPromiseCapability, OwnPromiseCapability, Wrapper;
var newPromiseCapability = newGenericPromiseCapability = newPromiseCapabilityModule.f;

var USE_NATIVE = !!function () {
  try {
    // correct subclassing with @@species support
    var promise = $Promise.resolve(1);
    var FakePromise = (promise.constructor = {})[__webpack_require__(7)('species')] = function (exec) {
      exec(empty, empty);
    };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function')
      && promise.then(empty) instanceof FakePromise
      // v8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
      // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
      // we can't detect it synchronously, so just check versions
      && v8.indexOf('6.6') !== 0
      && userAgent.indexOf('Chrome/66') === -1;
  } catch (e) { /* empty */ }
}();

// helpers
var isThenable = function (it) {
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var notify = function (promise, isReject) {
  if (promise._n) return;
  promise._n = true;
  var chain = promise._c;
  microtask(function () {
    var value = promise._v;
    var ok = promise._s == 1;
    var i = 0;
    var run = function (reaction) {
      var handler = ok ? reaction.ok : reaction.fail;
      var resolve = reaction.resolve;
      var reject = reaction.reject;
      var domain = reaction.domain;
      var result, then, exited;
      try {
        if (handler) {
          if (!ok) {
            if (promise._h == 2) onHandleUnhandled(promise);
            promise._h = 1;
          }
          if (handler === true) result = value;
          else {
            if (domain) domain.enter();
            result = handler(value); // may throw
            if (domain) {
              domain.exit();
              exited = true;
            }
          }
          if (result === reaction.promise) {
            reject(TypeError('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (e) {
        if (domain && !exited) domain.exit();
        reject(e);
      }
    };
    while (chain.length > i) run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if (isReject && !promise._h) onUnhandled(promise);
  });
};
var onUnhandled = function (promise) {
  task.call(global, function () {
    var value = promise._v;
    var unhandled = isUnhandled(promise);
    var result, handler, console;
    if (unhandled) {
      result = perform(function () {
        if (isNode) {
          process.emit('unhandledRejection', value, promise);
        } else if (handler = global.onunhandledrejection) {
          handler({ promise: promise, reason: value });
        } else if ((console = global.console) && console.error) {
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    } promise._a = undefined;
    if (unhandled && result.e) throw result.v;
  });
};
var isUnhandled = function (promise) {
  return promise._h !== 1 && (promise._a || promise._c).length === 0;
};
var onHandleUnhandled = function (promise) {
  task.call(global, function () {
    var handler;
    if (isNode) {
      process.emit('rejectionHandled', promise);
    } else if (handler = global.onrejectionhandled) {
      handler({ promise: promise, reason: promise._v });
    }
  });
};
var $reject = function (value) {
  var promise = this;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if (!promise._a) promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function (value) {
  var promise = this;
  var then;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if (promise === value) throw TypeError("Promise can't be resolved itself");
    if (then = isThenable(value)) {
      microtask(function () {
        var wrapper = { _w: promise, _d: false }; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch (e) {
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch (e) {
    $reject.call({ _w: promise, _d: false }, e); // wrap
  }
};

// constructor polyfill
if (!USE_NATIVE) {
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor) {
    anInstance(this, $Promise, PROMISE, '_h');
    aFunction(executor);
    Internal.call(this);
    try {
      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
    } catch (err) {
      $reject.call(this, err);
    }
  };
  // eslint-disable-next-line no-unused-vars
  Internal = function Promise(executor) {
    this._c = [];             // <- awaiting reactions
    this._a = undefined;      // <- checked in isUnhandled reactions
    this._s = 0;              // <- state
    this._d = false;          // <- done
    this._v = undefined;      // <- value
    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false;          // <- notify
  };
  Internal.prototype = __webpack_require__(89)($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected) {
      var reaction = newPromiseCapability(speciesConstructor(this, $Promise));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process.domain : undefined;
      this._c.push(reaction);
      if (this._a) this._a.push(reaction);
      if (this._s) notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function (onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  OwnPromiseCapability = function () {
    var promise = new Internal();
    this.promise = promise;
    this.resolve = ctx($resolve, promise, 1);
    this.reject = ctx($reject, promise, 1);
  };
  newPromiseCapabilityModule.f = newPromiseCapability = function (C) {
    return C === $Promise || C === Wrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Promise: $Promise });
__webpack_require__(28)($Promise, PROMISE);
__webpack_require__(167)(PROMISE);
Wrapper = __webpack_require__(6)[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r) {
    var capability = newPromiseCapability(this);
    var $$reject = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x) {
    return promiseResolve(LIBRARY && this === Wrapper ? $Promise : this, x);
  }
});
$export($export.S + $export.F * !(USE_NATIVE && __webpack_require__(168)(function (iter) {
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var values = [];
      var index = 0;
      var remaining = 1;
      forOf(iterable, false, function (promise) {
        var $index = index++;
        var alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.e) reject(result.v);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var reject = capability.reject;
    var result = perform(function () {
      forOf(iterable, false, function (promise) {
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if (result.e) reject(result.v);
    return capability.promise;
  }
});


/***/ }),

/***/ 161:
/***/ (function(module, exports, __webpack_require__) {

// call something on iterator step with safe closing on error
var anObject = __webpack_require__(16);
module.exports = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) anObject(ret.call(iterator));
    throw e;
  }
};


/***/ }),

/***/ 162:
/***/ (function(module, exports, __webpack_require__) {

// check on default Array iterator
var Iterators = __webpack_require__(22);
var ITERATOR = __webpack_require__(7)('iterator');
var ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};


/***/ }),

/***/ 163:
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__(108);
var ITERATOR = __webpack_require__(7)('iterator');
var Iterators = __webpack_require__(22);
module.exports = __webpack_require__(6).getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};


/***/ }),

/***/ 164:
/***/ (function(module, exports) {

// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function (fn, args, that) {
  var un = that === undefined;
  switch (args.length) {
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return fn.apply(that, args);
};


/***/ }),

/***/ 165:
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(5);
var macrotask = __webpack_require__(110).set;
var Observer = global.MutationObserver || global.WebKitMutationObserver;
var process = global.process;
var Promise = global.Promise;
var isNode = __webpack_require__(26)(process) == 'process';

module.exports = function () {
  var head, last, notify;

  var flush = function () {
    var parent, fn;
    if (isNode && (parent = process.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (e) {
        if (head) notify();
        else last = undefined;
        throw e;
      }
    } last = undefined;
    if (parent) parent.enter();
  };

  // Node.js
  if (isNode) {
    notify = function () {
      process.nextTick(flush);
    };
  // browsers with MutationObserver, except iOS Safari - https://github.com/zloirock/core-js/issues/339
  } else if (Observer && !(global.navigator && global.navigator.standalone)) {
    var toggle = true;
    var node = document.createTextNode('');
    new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (Promise && Promise.resolve) {
    // Promise.resolve without an argument throws an error in LG WebOS 2
    var promise = Promise.resolve(undefined);
    notify = function () {
      promise.then(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function () {
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global, flush);
    };
  }

  return function (fn) {
    var task = { fn: fn, next: undefined };
    if (last) last.next = task;
    if (!head) {
      head = task;
      notify();
    } last = task;
  };
};


/***/ }),

/***/ 166:
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(5);
var navigator = global.navigator;

module.exports = navigator && navigator.userAgent || '';


/***/ }),

/***/ 167:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(5);
var core = __webpack_require__(6);
var dP = __webpack_require__(14);
var DESCRIPTORS = __webpack_require__(12);
var SPECIES = __webpack_require__(7)('species');

module.exports = function (KEY) {
  var C = typeof core[KEY] == 'function' ? core[KEY] : global[KEY];
  if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
    configurable: true,
    get: function () { return this; }
  });
};


/***/ }),

/***/ 168:
/***/ (function(module, exports, __webpack_require__) {

var ITERATOR = __webpack_require__(7)('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function () { SAFE_CLOSING = true; };
  // eslint-disable-next-line no-throw-literal
  Array.from(riter, function () { throw 2; });
} catch (e) { /* empty */ }

module.exports = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR]();
    iter.next = function () { return { done: safe = true }; };
    arr[ITERATOR] = function () { return iter; };
    exec(arr);
  } catch (e) { /* empty */ }
  return safe;
};


/***/ }),

/***/ 169:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// https://github.com/tc39/proposal-promise-finally

var $export = __webpack_require__(13);
var core = __webpack_require__(6);
var global = __webpack_require__(5);
var speciesConstructor = __webpack_require__(109);
var promiseResolve = __webpack_require__(112);

$export($export.P + $export.R, 'Promise', { 'finally': function (onFinally) {
  var C = speciesConstructor(this, core.Promise || global.Promise);
  var isFunction = typeof onFinally == 'function';
  return this.then(
    isFunction ? function (x) {
      return promiseResolve(C, onFinally()).then(function () { return x; });
    } : onFinally,
    isFunction ? function (e) {
      return promiseResolve(C, onFinally()).then(function () { throw e; });
    } : onFinally
  );
} });


/***/ }),

/***/ 170:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/tc39/proposal-promise-try
var $export = __webpack_require__(13);
var newPromiseCapability = __webpack_require__(65);
var perform = __webpack_require__(111);

$export($export.S, 'Promise', { 'try': function (callbackfn) {
  var promiseCapability = newPromiseCapability.f(this);
  var result = perform(callbackfn);
  (result.e ? promiseCapability.reject : promiseCapability.resolve)(result.v);
  return promiseCapability.promise;
} });


/***/ }),

/***/ 171:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  for (var i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(
      uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)
    ))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}


/***/ }),

/***/ 172:
/***/ (function(module, exports) {

exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ }),

/***/ 173:
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// This method of obtaining a reference to the global object needs to be
// kept identical to the way it is obtained in runtime.js
var g = (function() { return this })() || Function("return this")();

// Use `getOwnPropertyNames` because not all browsers support calling
// `hasOwnProperty` on the global `self` object in a worker. See #183.
var hadRuntime = g.regeneratorRuntime &&
  Object.getOwnPropertyNames(g).indexOf("regeneratorRuntime") >= 0;

// Save the old regeneratorRuntime in case it needs to be restored later.
var oldRuntime = hadRuntime && g.regeneratorRuntime;

// Force reevalutation of runtime.js.
g.regeneratorRuntime = undefined;

module.exports = __webpack_require__(174);

if (hadRuntime) {
  // Restore the original runtime.
  g.regeneratorRuntime = oldRuntime;
} else {
  // Remove the global property added by runtime.js.
  try {
    delete g.regeneratorRuntime;
  } catch(e) {
    g.regeneratorRuntime = undefined;
  }
}


/***/ }),

/***/ 174:
/***/ (function(module, exports) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

!(function(global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration. If the Promise is rejected, however, the
          // result for this iteration will be rejected with the same
          // reason. Note that rejections of yielded Promises are not
          // thrown back into the generator function, as is the case
          // when an awaited Promise is rejected. This difference in
          // behavior between yield and await is important, because it
          // allows the consumer to decide what to do with the yielded
          // rejection (swallow it and continue, manually .throw it back
          // into the generator, abandon iteration, whatever). With
          // await, by contrast, there is no opportunity to examine the
          // rejection reason outside the generator function, so the
          // only option is to throw it from the await expression, and
          // let the generator function handle the exception.
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
})(
  // In sloppy mode, unbound `this` refers to the global object, fallback to
  // Function constructor if we're in global strict mode. That is sadly a form
  // of indirect eval which violates Content Security Policy.
  (function() { return this })() || Function("return this")()
);


/***/ }),

/***/ 3:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



var base64 = __webpack_require__(171)
var ieee754 = __webpack_require__(172)
var isArray = __webpack_require__(113)

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(11)))

/***/ }),

/***/ 402:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["f"] = resetKeyPassword;
/* harmony export (immutable) */ __webpack_exports__["h"] = signTransaction;
/* harmony export (immutable) */ __webpack_exports__["c"] = createAccountReceiver;
/* harmony export (immutable) */ __webpack_exports__["b"] = createAccount;
/* harmony export (immutable) */ __webpack_exports__["d"] = createKey;
/* harmony export (immutable) */ __webpack_exports__["e"] = createPubkey;
/* harmony export (immutable) */ __webpack_exports__["g"] = signMessage;
/* harmony export (immutable) */ __webpack_exports__["a"] = convertArgument;
/* unused harmony export scMulBase */
/* unused harmony export newWasmResult */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__go__ = __webpack_require__(490);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__index__ = __webpack_require__(472);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__sdk_keys_js__ = __webpack_require__(473);




//wasm load val
window.wasmIsLoad = false;
window.wasmReceived = false;
window.AllFunc = {};

let AllFuncReceivedResolve;
let funcReceived = new Promise(resolve => {
    AllFuncReceivedResolve = resolve;
});

window.setFuncOver = function () {
    AllFuncReceivedResolve();
};
window.resetWasmStatus = function () {
    window.wasmIsLoad = false;
    window.wasmReceived = false;
    funcReceived = new Promise(resolve => {
        AllFuncReceivedResolve = resolve;
    });
};

//wasm call js func getKeyByXPub
window.getKeyByXPub = function (XPub) {
    let keys = new __WEBPACK_IMPORTED_MODULE_2__sdk_keys_js__["a" /* default */]();
    let retPromise = new Promise((resolve, reject) => {
        keys.getKeyByXPub(XPub).then(res => {
            resolve(res);
        }).catch(error => {
            reject(error);
        });
    });
    return retPromise;
};

async function resetKeyPassword(data) {
    await init();
    let res = newWasmResult();
    window.AllFunc.resetKeyPassword(data, res);
    await res.wait;
    if (res.hasOwnProperty('error')) {
        throw new Error(res.error);
    }
    return res;
}

//signTransaction bytom central server standard
//see https://gist.github.com/HAOYUatHZ/0c7446b8f33e7cddd590256b3824b08f#apiv1btmmerchantsubmit-payment
//see https://github.com/Bytom-Community/Bytom-WebAssembly/blob/master/sdk/transaction.go (wasm implement)
async function signTransaction(data) {
    await init();
    let res = newWasmResult();
    window.AllFunc.signTransaction(data, res);
    await res.wait;
    if (res.hasOwnProperty('error')) {
        throw new Error(res.error);
    }
    return res;
}

async function createAccountReceiver(data) {
    await init();
    let res = newWasmResult();
    window.AllFunc.createAccountReceiver(data, res);
    await res.wait;
    if (res.hasOwnProperty('error')) {
        throw new Error(res.error);
    }
    return res;
}

async function createAccount(data) {
    await init();
    let res = newWasmResult();
    window.AllFunc.createAccount(data, res);
    await res.wait;
    if (res.hasOwnProperty('error')) {
        throw new Error(res.error);
    }
    return res;
}

async function createKey(data) {
    await init();
    let res = newWasmResult();
    window.AllFunc.createKey(data, res);
    await res.wait;
    if (res.hasOwnProperty('error')) {
        throw new Error(res.error);
    }
    return res;
}

async function createPubkey(data) {
    await init();
    let res = newWasmResult();
    window.AllFunc.createPubkey(data, res);
    await res.wait;
    if (res.hasOwnProperty('error')) {
        throw new Error(res.error);
    }
    return res;
}

async function signMessage(data) {
    await init();
    let res = newWasmResult();
    window.AllFunc.signMessage(data, res);
    await res.wait;
    if (res.hasOwnProperty('error')) {
        throw new Error(res.error);
    }
    return res;
}

async function convertArgument(data) {
    await init();
    let res = newWasmResult();
    window.AllFunc.convertArgument(data, res);
    await res.wait;
    if (res.hasOwnProperty('error')) {
        throw new Error(res.error);
    }
    return res;
}

async function scMulBase(pri) {
    await init();
    let res = newWasmResult();
    window.AllFunc.scMulBase(pri, res);
    await res.wait;
    if (res.hasOwnProperty('error')) {
        throw new Error(res.error);
    }
    return res;
}

function newWasmResult() {
    let res = {};
    res.wait = new Promise(function (resolve) {
        res.endFunc = resolve;
    });
    return res;
}

async function init() {
    if (!window.wasmReceived) {
        load();
        await funcReceived;
        window.wasmReceived = true;
    }
}

function load() {
    if (!window.wasmIsLoad) {
        Object(__WEBPACK_IMPORTED_MODULE_0__go__["a" /* LoadWasm */])();
        if (!WebAssembly.instantiateStreaming) {
            // polyfill
            WebAssembly.instantiateStreaming = async (resp, importObject) => {
                const source = await (await resp).arrayBuffer();
                return await WebAssembly.instantiate(source, importObject);
            };
        }
        const go = new window.Go();
        let /*mod,*/inst;
        WebAssembly.instantiateStreaming(fetch(__WEBPACK_IMPORTED_MODULE_1__index__["a" /* default */].wasmPath), go.importObject).then(async result => {
            // mod = result.module;
            inst = result.instance;
            /*const run = */go.run(inst);
            window.wasmIsLoad = true;
            // await run;
        });
    }
}

/***/ }),

/***/ 403:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = getDB;
/* harmony export (immutable) */ __webpack_exports__["b"] = initDB;
let db;
let init = false;
//db version
const version = 3;

async function getDB() {
    await initDB();
    return db;
}
/*eslint no-console: 'off'*/
async function initDB() {
    if (!init) {
        let dbpr = new Promise(function (resolve, reject) {
            let request = indexedDB.open('bytom', version);
            request.onerror = function () {
                reject(new Error('Why didn\'t you allow my web app to use IndexedDB?'));
            };
            request.onsuccess = function (event) {
                console.log('open IndexedDB onsuccess');
                db = event.target.result;
                init = true;
                resolve();
            };
            request.onupgradeneeded = function (event) {
                db = event.target.result;
                console.log('onupgradeneeded IndexedDB');
                if (event.oldVersion < 1) {
                    if (!db.objectStoreNames.contains('keys')) {
                        let ObjectStore = db.createObjectStore('keys', { autoIncrement: true });
                        ObjectStore.createIndex('alias', 'alias', { unique: true });
                        ObjectStore.createIndex('xpub', 'xpub', { unique: true });
                    }
                    if (!db.objectStoreNames.contains('accounts')) {
                        let ObjectStore = db.createObjectStore('accounts', { autoIncrement: true });
                        ObjectStore.createIndex('alias', 'alias', { unique: true });
                        ObjectStore.createIndex('id', 'id', { unique: true });
                    }
                    if (!db.objectStoreNames.contains('addresses')) {
                        let ObjectStore = db.createObjectStore('addresses', { autoIncrement: true });
                        ObjectStore.createIndex('AccountID', 'AccountID', { unique: false });
                        ObjectStore.createIndex('Address', 'Address', { unique: true });
                    }
                    if (!db.objectStoreNames.contains('accounts-server')) {
                        let ObjectStore = db.createObjectStore('accounts-server', { autoIncrement: true });
                        ObjectStore.createIndex('guid', 'guid', { unique: true });
                    }
                    if (!db.objectStoreNames.contains('addresses-server')) {
                        let ObjectStore = db.createObjectStore('addresses-server', { autoIncrement: true });
                        ObjectStore.createIndex('guid', 'guid', { unique: false });
                        ObjectStore.createIndex('address', 'address', { unique: true });
                    }
                }
                if (event.oldVersion < 2) {
                    let accountsStore = request.transaction.objectStore('accounts-server');
                    accountsStore.createIndex('alias', 'alias', { unique: true });
                }
                if (event.oldVersion < 3) {
                    let accountsStore = request.transaction.objectStore('accounts-server');
                    accountsStore.createIndex('net', 'net', { unique: false });
                    let addressesStore = request.transaction.objectStore('addresses-server');
                    addressesStore.createIndex('net', 'net', { unique: false });
                }
            };
        });
        await dbpr;
    }
}

/***/ }),

/***/ 407:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = handleAxiosError;
/* harmony export (immutable) */ __webpack_exports__["a"] = handleApiError;
function handleAxiosError(error) {
    if (error.response && error.response.data.hasOwnProperty('msg')) {
        return new Error(error.response.data.msg);
    } else {
        return new Error(error);
    }
}

function handleApiError(response) {
    if (response.data.hasOwnProperty('msg')) {
        return new Error(response.data.msg);
    } else {
        return new Error('Unknow error');
    }
}

/***/ }),

/***/ 408:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

var utils = __webpack_require__(63);
var normalizeHeaderName = __webpack_require__(500);

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__(475);
  } else if (typeof process !== 'undefined') {
    // For node use HTTP adapter
    adapter = __webpack_require__(475);
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(19)))

/***/ }),

/***/ 472:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__api_query_js__ = __webpack_require__(483);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__api_accounts_js__ = __webpack_require__(484);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__api_transactions_js__ = __webpack_require__(485);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__api_keys_js__ = __webpack_require__(489);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__sdk_keys_js__ = __webpack_require__(473);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__sdk_accounts_js__ = __webpack_require__(491);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__sdk_transaction_js__ = __webpack_require__(492);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__sdk_wallet_js__ = __webpack_require__(493);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__sdk_query_js__ = __webpack_require__(494);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__http_js__ = __webpack_require__(495);











function Bytom(serverHost, wasmPath, baseURL) {
    this.install = function (Vue) {
        Vue.prototype.$Bytom = this;
    };

    if (baseURL) {
        this.http = new __WEBPACK_IMPORTED_MODULE_9__http_js__["a" /* http */](baseURL);
        this.query = new __WEBPACK_IMPORTED_MODULE_0__api_query_js__["a" /* default */](this.http);
        this.accounts = new __WEBPACK_IMPORTED_MODULE_1__api_accounts_js__["a" /* default */](this.http);
        this.keys = new __WEBPACK_IMPORTED_MODULE_3__api_keys_js__["a" /* default */](this.http);
        this.transactions = new __WEBPACK_IMPORTED_MODULE_2__api_transactions_js__["a" /* default */](this.http);
    }

    this.net = 'main';
    Bytom.wasmPath = wasmPath;
    this.serverHttp = new __WEBPACK_IMPORTED_MODULE_9__http_js__["b" /* serverHttp */](serverHost);
    this.sdk = {};
    this.sdk.keys = new __WEBPACK_IMPORTED_MODULE_4__sdk_keys_js__["a" /* default */]();
    this.sdk.accounts = new __WEBPACK_IMPORTED_MODULE_5__sdk_accounts_js__["a" /* default */](this);
    this.sdk.transaction = new __WEBPACK_IMPORTED_MODULE_6__sdk_transaction_js__["a" /* default */](this);
    this.sdk.wallet = new __WEBPACK_IMPORTED_MODULE_7__sdk_wallet_js__["a" /* default */](this);
    this.sdk.query = new __WEBPACK_IMPORTED_MODULE_8__sdk_query_js__["a" /* default */](this);
}

/**
 * Get net type;
 *
 * @returns Network
 */
Bytom.prototype.getNetType = function () {
    return this.net;
};

/**
 * Set net type
 *
 * @param {String} net net type (main test)
 * @returns {Promise}
 */
Bytom.prototype.setNetType = function (net) {
    this.net = net;
};

/* harmony default export */ __webpack_exports__["a"] = (Bytom);

/***/ }),

/***/ 473:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__wasm_func__ = __webpack_require__(402);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__db_db__ = __webpack_require__(403);



function keysSDK() {}

/**
 * reset key password
 * 
 * @param {String}} rootXPub 
 * @param {String} oldPassword 
 * @param {String} newPassword 
 */
keysSDK.prototype.resetKeyPassword = function (rootXPub, oldPassword, newPassword) {
    let retPromise = new Promise((resolve, reject) => {
        let data = { rootXPub: rootXPub, oldPassword: oldPassword, newPassword: newPassword };
        Object(__WEBPACK_IMPORTED_MODULE_0__wasm_func__["f" /* resetKeyPassword */])(data).then(res => {
            Object(__WEBPACK_IMPORTED_MODULE_1__db_db__["a" /* getDB */])().then(db => {
                let objectStore = db.transaction(['keys'], 'readwrite').objectStore('keys');
                let index = objectStore.index('xpub');
                let keyRange = IDBKeyRange.only(rootXPub);
                let getRequest = index.openCursor(keyRange);
                getRequest.onsuccess = function (event) {
                    const cursor = event.target.result;
                    if (cursor && cursor.value.xpub === rootXPub) {
                        const updateData = cursor.value;
                        updateData.key = res.data;
                        const request = cursor.update(updateData);
                        request.onsuccess = function () {
                            resolve(true);
                        };
                        request.onerror = function () {
                            reject(new Error('db update error'));
                        };
                    } else {
                        reject(new Error('db update error: not found by rootXPub'));
                    }
                };
                getRequest.onerror = function () {
                    reject(new Error('db get error'));
                };
            }).catch(error => {
                reject(error);
            });
        }).catch(error => {
            reject(error);
        });
    });
    return retPromise;
};

/**
 * get key by XPub
 * 
 * @param {String} xpub 
 */
keysSDK.prototype.getKeyByXPub = function (xpub) {
    let retPromise = new Promise((resolve, reject) => {
        Object(__WEBPACK_IMPORTED_MODULE_1__db_db__["a" /* getDB */])().then(db => {
            let getRequest = db.transaction(['keys'], 'readonly').objectStore('keys').index('xpub').get(xpub);
            getRequest.onsuccess = function (e) {
                if (e.target.result) {
                    resolve(e.target.result.key);
                } else {
                    reject(new Error('not found by XPub'));
                }
            };
            getRequest.onerror = function () {
                reject(new Error('db get error'));
            };
        }).catch(error => {
            reject(error);
        });
    });
    return retPromise;
};

/**
 * List key
 *
 * @returns {Promise}
 */
keysSDK.prototype.list = function () {
    let retPromise = new Promise((resolve, reject) => {
        Object(__WEBPACK_IMPORTED_MODULE_1__db_db__["a" /* getDB */])().then(db => {
            let transaction = db.transaction(['keys'], 'readonly');
            let objectStore = transaction.objectStore('keys');
            let oc = objectStore.openCursor();
            let ret = [];
            oc.onsuccess = function (event) {
                var cursor = event.target.result;
                if (cursor) {
                    ret.push({ alias: cursor.value.alias, xpub: cursor.value.xpub });
                    cursor.continue();
                } else {
                    resolve(ret);
                }
            };
            oc.onerror = function (e) {
                reject(e);
            };
        }).catch(err => {
            reject(err);
        });
    });
    return retPromise;
};

/**
 * Create a new key.
 * 
 * @param {String} alias - User specified, unique identifier.
 * @param {String} password - User specified, key password.
 */
keysSDK.prototype.create = function (alias, password) {
    var normalizedAlias = alias.toLowerCase().trim();
    let retPromise = new Promise((resolve, reject) => {
        Object(__WEBPACK_IMPORTED_MODULE_1__db_db__["a" /* getDB */])().then(db => {
            let getRequest = db.transaction(['keys'], 'readonly').objectStore('keys').index('alias').get(normalizedAlias);
            getRequest.onsuccess = function (e) {
                if (e.target.result) {
                    reject(new Error('key alias already exists'));
                    return;
                }
                let data = {};
                data.alias = normalizedAlias;
                data.auth = password;
                Object(__WEBPACK_IMPORTED_MODULE_0__wasm_func__["d" /* createKey */])(data).then(res => {
                    let jsonData = JSON.parse(res.data);
                    let dbData = {
                        key: res.data,
                        xpub: jsonData.xpub,
                        alias: alias
                    };
                    let request = db.transaction(['keys'], 'readwrite').objectStore('keys').add(dbData);
                    request.onsuccess = function () {
                        resolve({ xpub: jsonData.xpub, alias: alias });
                    };
                    request.onerror = function () {
                        reject(new Error('db insert error'));
                    };
                }).catch(error => {
                    reject(error);
                });
            };
            getRequest.onerror = function () {
                reject(new Error('db get error'));
            };
        }).catch(error => {
            reject(error);
        });
    });
    return retPromise;
};

/**
 * Create a new key.
 *
 * @param {String} xpub - xpub.
 */
keysSDK.prototype.createPubkey = function (xpub) {
    let retPromise = new Promise((resolve, reject) => {
        let data = {};
        data.xpub = xpub;
        data.seed = 1;
        Object(__WEBPACK_IMPORTED_MODULE_0__wasm_func__["e" /* createPubkey */])(data).then(res => {
            let jsonData = JSON.parse(res.data);
            resolve(jsonData);
        }).catch(error => {
            reject(error);
        });
    });
    return retPromise;
};

/**
 * Sign Message.
 *
 * @param {String} message - message.
 * @param {String} password - password.
 * @param {Object} address - address.
 */
keysSDK.prototype.signMessage = function (message, password, address) {
    let retPromise = new Promise((resolve, reject) => {
        Object(__WEBPACK_IMPORTED_MODULE_1__db_db__["a" /* getDB */])().then(db => {
            let getRequest = db.transaction(['accounts-server'], 'readonly').objectStore('accounts-server').getAll();

            getRequest.onsuccess = function (e) {
                const result = getRequest.result.filter(obj => obj.address === address);
                if (result.length === 0) {
                    reject(new Error('not found address'));
                    return;
                }

                const rootXpub = result[0].rootXPub;
                let keyObject = db.transaction(['keys'], 'readonly').objectStore('keys').index('xpub').get(rootXpub);

                keyObject.onsuccess = function (e) {
                    if (!e.target.result) {
                        reject(new Error('not found xpub'));
                        return;
                    }

                    let data = {};
                    data.message = message;
                    data.password = password;
                    data.key = e.target.result.key;
                    Object(__WEBPACK_IMPORTED_MODULE_0__wasm_func__["g" /* signMessage */])(data).then(res => {
                        let jsonData = JSON.parse(res.data);
                        resolve(jsonData);
                    }).catch(error => {
                        reject(error);
                    });
                };
                keyObject.onerror = function () {
                    reject(getRequest.error);
                };
            };
            getRequest.onerror = function () {
                reject(getRequest.error);
            };
        }).catch(error => {
            reject(error);
        });
    });
    return retPromise;
};

/* harmony default export */ __webpack_exports__["a"] = (keysSDK);

/***/ }),

/***/ 474:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};


/***/ }),

/***/ 475:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(63);
var settle = __webpack_require__(501);
var buildURL = __webpack_require__(503);
var parseHeaders = __webpack_require__(504);
var isURLSameOrigin = __webpack_require__(505);
var createError = __webpack_require__(476);
var btoa = (typeof window !== 'undefined' && window.btoa && window.btoa.bind(window)) || __webpack_require__(506);

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();
    var loadEvent = 'onreadystatechange';
    var xDomain = false;

    // For IE 8/9 CORS support
    // Only supports POST and GET calls and doesn't returns the response headers.
    // DON'T do this for testing b/c XMLHttpRequest is mocked, not XDomainRequest.
    if ("production" !== 'test' &&
        typeof window !== 'undefined' &&
        window.XDomainRequest && !('withCredentials' in request) &&
        !isURLSameOrigin(config.url)) {
      request = new window.XDomainRequest();
      loadEvent = 'onload';
      xDomain = true;
      request.onprogress = function handleProgress() {};
      request.ontimeout = function handleTimeout() {};
    }

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    request.open(config.method.toUpperCase(), buildURL(config.url, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request[loadEvent] = function handleLoad() {
      if (!request || (request.readyState !== 4 && !xDomain)) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        // IE sends 1223 instead of 204 (https://github.com/axios/axios/issues/201)
        status: request.status === 1223 ? 204 : request.status,
        statusText: request.status === 1223 ? 'No Content' : request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      var cookies = __webpack_require__(507);

      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(config.url)) && config.xsrfCookieName ?
          cookies.read(config.xsrfCookieName) :
          undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (config.withCredentials) {
      request.withCredentials = true;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (requestData === undefined) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};


/***/ }),

/***/ 476:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var enhanceError = __webpack_require__(502);

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};


/***/ }),

/***/ 477:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),

/***/ 478:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;


/***/ }),

/***/ 479:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_bytom_js_sdk__ = __webpack_require__(472);


var networks = {
  testnet: 'http://app.bycoin.io:3020/',
  mainnet: 'https://api.bycoin.im:8000/'
};

var bytom = new __WEBPACK_IMPORTED_MODULE_0_bytom_js_sdk__["a" /* default */](networks, chrome.runtime.getURL('wasm/main.wasm'));

bytom.sdk.networks = function () {
  return bytom.getNetType();
};

bytom.sdk.setupNet = function (network) {
  bytom.setNetType(network);
};

/* harmony default export */ __webpack_exports__["a"] = (bytom.sdk);

/***/ }),

/***/ 483:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Represents a balancesApi.
 * @constructor
 */
function queryApi(http) {
  this.http = http;
}

/**
 * List Utxo
 *
 * @param {Object} params - list Utxo condition.
 * @param {Object} params.filter,
 *                  - script
 *                  - asset
 * @param {Object} params.sort,
 *                  - by
 *                  - order
 * @returns {Promise} hash, asset, amount
 */
queryApi.prototype.listUTXO = function (params) {
  return this.http.request('q/list-utxo', params);
};

/**
 * list all asset
 * @returns {Promise} assetID, assetAlias, price
 */
queryApi.prototype.listAsset = function () {
  return this.http.request('q/asset', {}, 'GET');
};

/**
 * get current block status
 * @returns {Promise} block_height, block_hash
 */
queryApi.prototype.getblockstatus = function () {
  return this.http.request('q/chain-status', {}, 'GET');
};

/* harmony default export */ __webpack_exports__["a"] = (queryApi);

/***/ }),

/***/ 484:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Represents a accountsApi.
 * @constructor
 */
function accountsApi(http) {
  this.http = http;
}

/**
 * Create a new account.
 *
 * @param {Object} params - Parameters for accounts create.
 * @param {String} params.pubkey - key pubkey,
 * @param {String} params.label  - Optional. Account alias.
 * @param {String} params.email - Optional. The account email
 * @returns {Promise} Guid, address, label
 */
accountsApi.prototype.create = function (params) {
  return this.http.request('account/create-account', params);
};

/**
 * Create a new address.
 *
 * @param {Object} params - Parameters for address create.
 * @param {String} params.guid - AccountID,
 * @param {String} params.label  - Optional. Account alias.
 * @returns {Promise} Guid, address, label
 */
accountsApi.prototype.createAddress = function (params) {
  return this.http.request('account/create-address', params);
};

/**
 * List all addresses for one account.
 * 
 * @param {String} Guid - id of account.
 * @returns {Promise} Array of Object, with Guid, Address, label, Balance.
 */
accountsApi.prototype.listAddresses = function (Guid) {
  return this.http.request('account/list-addresses', { Guid });
};

/* harmony default export */ __webpack_exports__["a"] = (accountsApi);

/***/ }),

/***/ 485:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_convertArguement__ = __webpack_require__(486);


/**
 * Represents a transactionsApi.
 * @constructor
 */
function transactionsApi(http) {
  this.http = http;
}

/**
 * List local transactions by id.
 *
 * @param {Object} params - list transactions with account information.
 * @param {String} params.Guid - Transaction related account id.
 * @param {Object} params.filter - Optional, filter condition amount or time.
 * @param {String} params.sort - Optional, sort condition.
 */
transactionsApi.prototype.list = function (params) {
  return this.http.request('account/list-transactions', params);
};

/**
 * Build Payment.
 *
 * @param {Object} params - Parameters for build payment.
 * @param {String} params.guid - Account Guid.
 * @param {String} params.asset - Asset ID.
 * @param {Number} params.amount - Amount in neu.
 * @param {String} params.to - send to address
 * @param {Number} params.fee - Gas fee.
 * @param {Number} params.confirmations - Confirmations.
 *
 * @return {promise} Object with raw_transaction, signing_instructions, fee
 */
transactionsApi.prototype.buildPayment = function (params) {
  return this.http.request('/merchant/build-payment', params);
};

/**
 * Build transaction.
 *
 * @param {Object} params - Parameters for build transaction.
 * @param {String} params.guid - Account Guid.
 * @param {String} params.asset - Asset ID.
 * @param {Object[]} params.inputs - Amount in neu.
 * @param {Object[]} params.outputs - send to address
 * @param {Number} params.fee - Gas fee.
 * @param {Number} params.confirmations - Confirmations.
 *
 * @return {promise} Object with raw_transaction, signing_instructions, fee
 */
transactionsApi.prototype.buildTransaction = function (params) {
  return this.http.request('/merchant/build-transaction', params);
};

/**
 * convert contract argument.
 *
 * @param {Object} obj - Argument Object
 * @param {String} obj.type - Argument Type, included data, address, string, integer, boolean.
 * @param {Object} obj.raw_data - Object Raw Data
 * @param {String|Number|Boolean} obj.raw_data.value - data value
 */
transactionsApi.prototype.convertArguement = function (obj) {
  return Object(__WEBPACK_IMPORTED_MODULE_0__utils_convertArguement__["a" /* convertArguements */])(obj);
};

/**
 * Submit a signed transaction to the blockchain.
 * 
 * @see https://github.com/Bytom/bytom/wiki/API-Reference#submit-transaction·
 *
 * @param {Object} params - Parameters for build payment.
 * @param {String} params.guid - Account Id.
 * @param {String} params.raw_transaction - raw_transaction of signed transaction.
 * @param {String[]} params.signatures - transaction signature
 * @param {String} params.memo - custom memo that only saved in the server.
 *
 * @return {promise} transaction_hash
 */
transactionsApi.prototype.submit = function (params) {
  return this.http.request('/account/submit-payment', params);
};

/* harmony default export */ __webpack_exports__["a"] = (transactionsApi);

/***/ }),

/***/ 486:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Buffer) {/* harmony export (immutable) */ __webpack_exports__["a"] = convertArguements;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__hex_js__ = __webpack_require__(487);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_bech32__ = __webpack_require__(488);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_bech32___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_bech32__);



function convertArguements(obj) {
    const type = obj.type;
    const value = obj.raw_data.value;
    let convertValue;
    switch (type) {
        case 'data':
            convertValue = convertData(value);
            break;
        case 'integer':
            convertValue = convertInteger(value);
            break;
        case 'string':
            convertValue = Object(__WEBPACK_IMPORTED_MODULE_0__hex_js__["a" /* hexEncode */])(value);
            break;
        case 'boolean':
            convertValue = convertBoolean(value);
            break;
        case 'address':
            convertValue = convertAddress(value);
            break;
        default:
            throw 'Invalid data type.';
    }
    return { data: convertValue };
}

function convertBoolean(bool) {
    if (bool === true) {
        return '01';
    } else if (bool === false) {
        return '';
    } else {
        throw 'Invalid Boolean argument';
    }
}

function convertInteger(int) {
    const hexInt = Number(int).toString(16);
    if (hexInt.length % 2) {
        return convertToLittleEnd('0' + hexInt);
    } else {
        return convertToLittleEnd(hexInt);
    }
}

function convertToLittleEnd(hex) {
    return hex.match(/../g).reverse().join('');
}

function convertData(data) {
    if (/^[-+]?[0-9A-Fa-f]+\.?[0-9A-Fa-f]*?$/i.test(data)) {
        return data;
    } else {
        throw 'Invalid hex data';
    }
}

function convertAddress(address) {
    const addressPrefix = address.substring(0, 2);
    const validAddressArray = ['tm', 'bm', 'sm'];
    if (!validAddressArray.includes(addressPrefix)) {
        throw 'bad address format';
    }

    const decodedWord = __WEBPACK_IMPORTED_MODULE_1_bech32___default.a.decode(address);
    let array = decodedWord.words;
    array.shift();

    const words = __WEBPACK_IMPORTED_MODULE_1_bech32___default.a.fromWords(array);

    if (words.length !== 20 && words.length !== 32) {
        throw `invalid data length for witness , ${words.length}`;
    }

    const hex = '00' + Number(words.length).toString(16) + Buffer.from(words).toString('hex');

    return hex;
}
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(3).Buffer))

/***/ }),

/***/ 487:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export byteToHexString */
/* unused harmony export hexStringToByte */
/* harmony export (immutable) */ __webpack_exports__["a"] = hexEncode;
function byteToHexString(uint8arr) {
    if (!uint8arr) {
        return '';
    }

    var hexStr = '';
    for (var i = 0; i < uint8arr.length; i++) {
        var hex = (uint8arr[i] & 0xff).toString(16);
        hex = hex.length === 1 ? '0' + hex : hex;
        hexStr += hex;
    }

    return hexStr.toUpperCase();
}

function hexStringToByte(str) {
    if (!str) {
        return new Uint8Array();
    }

    var a = [];
    for (var i = 0, len = str.length; i < len; i += 2) {
        a.push(parseInt(str.substr(i, 2), 16));
    }

    return new Uint8Array(a);
}

function hexEncode(string) {
    var hex, i;

    var result = '';
    for (i = 0; i < string.length; i++) {
        hex = string.charCodeAt(i).toString(16);
        result += hex.slice(-4);
    }

    return result;
}

/***/ }),

/***/ 488:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ALPHABET = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l'

// pre-compute lookup table
var ALPHABET_MAP = {}
for (var z = 0; z < ALPHABET.length; z++) {
  var x = ALPHABET.charAt(z)

  if (ALPHABET_MAP[x] !== undefined) throw new TypeError(x + ' is ambiguous')
  ALPHABET_MAP[x] = z
}

function polymodStep (pre) {
  var b = pre >> 25
  return ((pre & 0x1FFFFFF) << 5) ^
    (-((b >> 0) & 1) & 0x3b6a57b2) ^
    (-((b >> 1) & 1) & 0x26508e6d) ^
    (-((b >> 2) & 1) & 0x1ea119fa) ^
    (-((b >> 3) & 1) & 0x3d4233dd) ^
    (-((b >> 4) & 1) & 0x2a1462b3)
}

function prefixChk (prefix) {
  var chk = 1
  for (var i = 0; i < prefix.length; ++i) {
    var c = prefix.charCodeAt(i)
    if (c < 33 || c > 126) throw new Error('Invalid prefix (' + prefix + ')')

    chk = polymodStep(chk) ^ (c >> 5)
  }
  chk = polymodStep(chk)

  for (i = 0; i < prefix.length; ++i) {
    var v = prefix.charCodeAt(i)
    chk = polymodStep(chk) ^ (v & 0x1f)
  }
  return chk
}

function encode (prefix, words, LIMIT) {
  LIMIT = LIMIT || 90
  if ((prefix.length + 7 + words.length) > LIMIT) throw new TypeError('Exceeds length limit')

  prefix = prefix.toLowerCase()

  // determine chk mod
  var chk = prefixChk(prefix)
  var result = prefix + '1'
  for (var i = 0; i < words.length; ++i) {
    var x = words[i]
    if ((x >> 5) !== 0) throw new Error('Non 5-bit word')

    chk = polymodStep(chk) ^ x
    result += ALPHABET.charAt(x)
  }

  for (i = 0; i < 6; ++i) {
    chk = polymodStep(chk)
  }
  chk ^= 1

  for (i = 0; i < 6; ++i) {
    var v = (chk >> ((5 - i) * 5)) & 0x1f
    result += ALPHABET.charAt(v)
  }

  return result
}

function decode (str, LIMIT) {
  LIMIT = LIMIT || 90
  if (str.length < 8) throw new TypeError(str + ' too short')
  if (str.length > LIMIT) throw new TypeError('Exceeds length limit')

  // don't allow mixed case
  var lowered = str.toLowerCase()
  var uppered = str.toUpperCase()
  if (str !== lowered && str !== uppered) throw new Error('Mixed-case string ' + str)
  str = lowered

  var split = str.lastIndexOf('1')
  if (split === -1) throw new Error('No separator character for ' + str)
  if (split === 0) throw new Error('Missing prefix for ' + str)

  var prefix = str.slice(0, split)
  var wordChars = str.slice(split + 1)
  if (wordChars.length < 6) throw new Error('Data too short')

  var chk = prefixChk(prefix)
  var words = []
  for (var i = 0; i < wordChars.length; ++i) {
    var c = wordChars.charAt(i)
    var v = ALPHABET_MAP[c]
    if (v === undefined) throw new Error('Unknown character ' + c)
    chk = polymodStep(chk) ^ v

    // not in the checksum?
    if (i + 6 >= wordChars.length) continue
    words.push(v)
  }

  if (chk !== 1) throw new Error('Invalid checksum for ' + str)
  return { prefix: prefix, words: words }
}

function convert (data, inBits, outBits, pad) {
  var value = 0
  var bits = 0
  var maxV = (1 << outBits) - 1

  var result = []
  for (var i = 0; i < data.length; ++i) {
    value = (value << inBits) | data[i]
    bits += inBits

    while (bits >= outBits) {
      bits -= outBits
      result.push((value >> bits) & maxV)
    }
  }

  if (pad) {
    if (bits > 0) {
      result.push((value << (outBits - bits)) & maxV)
    }
  } else {
    if (bits >= inBits) throw new Error('Excess padding')
    if ((value << (outBits - bits)) & maxV) throw new Error('Non-zero padding')
  }

  return result
}

function toWords (bytes) {
  return convert(bytes, 8, 5, true)
}

function fromWords (words) {
  return convert(words, 5, 8, false)
}

module.exports = {
  decode: decode,
  encode: encode,
  toWords: toWords,
  fromWords: fromWords
}


/***/ }),

/***/ 489:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__wasm_func__ = __webpack_require__(402);


/**
 * Represents a keysApi.
 * @constructor
 */
function keysApi(http) {
    this.http = http;
}

/**
 * Create a new key, will generate the xpub.
 *
 * @param {Object} params - Parameters for accounts create.
 * @param {String} params.alias - key alias,
 * @param {String} params.password  - key Password.
 * @returns {Promise} key alias, key xpub
 */
keysApi.prototype.create = function (params) {
    let inputParams = params;
    inputParams.auth = params.password;
    delete inputParams['password'];
    let promise = new Promise((resolve, reject) => {
        Object(__WEBPACK_IMPORTED_MODULE_0__wasm_func__["d" /* createKey */])(inputParams).then(resp => {
            let jsonData = JSON.parse(resp.data);
            const result = {
                alias: jsonData.alias,
                xpub: jsonData.xpub,
                crypto: jsonData.crypto
            };
            resolve(result);
        }).catch(error => {
            reject(error);
        });
    });

    return promise;
};

/**
 * Reset key password, will generate the new xpub.
 *
 * @param {Object} params - Parameters for accounts create.
 * @param {String} params.xpub - key alias,
 * @param {String} params.oldPassword  - key oldPassword.
 * @param {String} params.newPassword  - key newPassword.
 * @param {Object} params.crypto - key crypto
 * @returns {Promise} key alias, key xpub
 */
keysApi.prototype.resetKeyPassword = function (params) {
    let inputParams = params;
    inputParams.rootXPub = params.xpub;
    delete inputParams['xpub'];
    let promise = new Promise((resolve, reject) => {
        Object(__WEBPACK_IMPORTED_MODULE_0__wasm_func__["f" /* resetKeyPassword */])(inputParams).then(resp => {
            let jsonData = JSON.parse(resp.data);
            const result = {
                alias: jsonData.alias,
                xpub: jsonData.xpub,
                crypto: jsonData.crypto
            };
            resolve(result);
        }).catch(error => {
            reject(error);
        });
    });

    return promise;
};

/**
 * Create a new key.
 *
 * @param {String} xpub - xpub.
 * @returns {Promise} xpub, pubkey, derived_path
 *
 */
keysApi.prototype.createPubkey = function (xpub) {
    let retPromise = new Promise((resolve, reject) => {
        let data = {};
        data.xpub = xpub;
        data.seed = 1;
        Object(__WEBPACK_IMPORTED_MODULE_0__wasm_func__["e" /* createPubkey */])(data).then(resp => {
            let jsonData = JSON.parse(resp.data);
            resolve(jsonData);
        }).catch(error => {
            reject(error);
        });
    });
    return retPromise;
};

/* harmony default export */ __webpack_exports__["a"] = (keysApi);

/***/ }),

/***/ 490:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/* harmony export (immutable) */ __webpack_exports__["a"] = LoadWasm;
// Copyright 2018 The Go Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

function LoadWasm() {
    if (typeof global !== 'undefined') {
        // global already exists
    } else if (typeof window !== 'undefined') {
        window.global = window;
    } else if (typeof self !== 'undefined') {
        self.global = self;
    } else {
        throw new Error('cannot export Go (neither global, window nor self is defined)');
    }

    // Map web browser API and Node.js API to a single common API (preferring web standards over Node.js API).
    let outputBuf = '';
    global.fs = {
        constants: { O_WRONLY: -1, O_RDWR: -1, O_CREAT: -1, O_TRUNC: -1, O_APPEND: -1, O_EXCL: -1 }, // unused
        writeSync(fd, buf) {
            outputBuf += decoder.decode(buf);
            const nl = outputBuf.lastIndexOf('\n');
            if (nl != -1) {
                console.log(outputBuf.substr(0, nl));
                outputBuf = outputBuf.substr(nl + 1);
            }
            return buf.length;
        },
        write(fd, buf, offset, length, position, callback) {
            if (offset !== 0 || length !== buf.length || position !== null) {
                throw new Error('not implemented');
            }
            const n = this.writeSync(fd, buf);
            callback(null, n);
        },
        open(path, flags, mode, callback) {
            const err = new Error('not implemented');
            err.code = 'ENOSYS';
            callback(err);
        },
        read(fd, buffer, offset, length, position, callback) {
            const err = new Error('not implemented');
            err.code = 'ENOSYS';
            callback(err);
        },
        fsync(fd, callback) {
            callback(null);
        }
    };

    const encoder = new TextEncoder('utf-8');
    const decoder = new TextDecoder('utf-8');

    global.Go = class {
        constructor() {
            this.argv = ['js'];
            this.env = {};
            this.exit = code => {
                if (code !== 0) {
                    console.warn('exit code:', code);
                }
            };
            this._exitPromise = new Promise(resolve => {
                this._resolveExitPromise = resolve;
            });
            this._pendingEvent = null;
            this._scheduledTimeouts = new Map();
            this._nextCallbackTimeoutID = 1;

            const mem = () => {
                // The buffer may change when requesting more memory.
                return new DataView(this._inst.exports.mem.buffer);
            };

            const setInt64 = (addr, v) => {
                mem().setUint32(addr + 0, v, true);
                mem().setUint32(addr + 4, Math.floor(v / 4294967296), true);
            };

            const getInt64 = addr => {
                const low = mem().getUint32(addr + 0, true);
                const high = mem().getInt32(addr + 4, true);
                return low + high * 4294967296;
            };

            const loadValue = addr => {
                const f = mem().getFloat64(addr, true);
                if (f === 0) {
                    return undefined;
                }
                if (!isNaN(f)) {
                    return f;
                }

                const id = mem().getUint32(addr, true);
                return this._values[id];
            };

            const storeValue = (addr, v) => {
                const nanHead = 0x7FF80000;

                if (typeof v === 'number') {
                    if (isNaN(v)) {
                        mem().setUint32(addr + 4, nanHead, true);
                        mem().setUint32(addr, 0, true);
                        return;
                    }
                    if (v === 0) {
                        mem().setUint32(addr + 4, nanHead, true);
                        mem().setUint32(addr, 1, true);
                        return;
                    }
                    mem().setFloat64(addr, v, true);
                    return;
                }

                switch (v) {
                    case undefined:
                        mem().setFloat64(addr, 0, true);
                        return;
                    case null:
                        mem().setUint32(addr + 4, nanHead, true);
                        mem().setUint32(addr, 2, true);
                        return;
                    case true:
                        mem().setUint32(addr + 4, nanHead, true);
                        mem().setUint32(addr, 3, true);
                        return;
                    case false:
                        mem().setUint32(addr + 4, nanHead, true);
                        mem().setUint32(addr, 4, true);
                        return;
                }

                let ref = this._refs.get(v);
                if (ref === undefined) {
                    ref = this._values.length;
                    this._values.push(v);
                    this._refs.set(v, ref);
                }
                let typeFlag = 0;
                switch (typeof v) {
                    case 'string':
                        typeFlag = 1;
                        break;
                    case 'symbol':
                        typeFlag = 2;
                        break;
                    case 'function':
                        typeFlag = 3;
                        break;
                }
                mem().setUint32(addr + 4, nanHead | typeFlag, true);
                mem().setUint32(addr, ref, true);
            };

            const loadSlice = addr => {
                const array = getInt64(addr + 0);
                const len = getInt64(addr + 8);
                return new Uint8Array(this._inst.exports.mem.buffer, array, len);
            };

            const loadSliceOfValues = addr => {
                const array = getInt64(addr + 0);
                const len = getInt64(addr + 8);
                const a = new Array(len);
                for (let i = 0; i < len; i++) {
                    a[i] = loadValue(array + i * 8);
                }
                return a;
            };

            const loadString = addr => {
                const saddr = getInt64(addr + 0);
                const len = getInt64(addr + 8);
                return decoder.decode(new DataView(this._inst.exports.mem.buffer, saddr, len));
            };

            const timeOrigin = Date.now() - performance.now();
            this.importObject = {
                go: {
                    // Go's SP does not change as long as no Go code is running. Some operations (e.g. calls, getters and setters)
                    // may synchronously trigger a Go event handler. This makes Go code get executed in the middle of the imported
                    // function. A goroutine can switch to a new stack if the current stack is too small (see morestack function).
                    // This changes the SP, thus we have to update the SP used by the imported function.

                    // func wasmExit(code int32)
                    'runtime.wasmExit': sp => {
                        const code = mem().getInt32(sp + 8, true);
                        this.exited = true;
                        delete this._inst;
                        delete this._values;
                        delete this._refs;
                        this.exit(code);
                    },

                    // func wasmWrite(fd uintptr, p unsafe.Pointer, n int32)
                    'runtime.wasmWrite': sp => {
                        const fd = getInt64(sp + 8);
                        const p = getInt64(sp + 16);
                        const n = mem().getInt32(sp + 24, true);
                        fs.writeSync(fd, new Uint8Array(this._inst.exports.mem.buffer, p, n));
                    },

                    // func nanotime() int64
                    'runtime.nanotime': sp => {
                        setInt64(sp + 8, (timeOrigin + performance.now()) * 1000000);
                    },

                    // func walltime() (sec int64, nsec int32)
                    'runtime.walltime': sp => {
                        const msec = new Date().getTime();
                        setInt64(sp + 8, msec / 1000);
                        mem().setInt32(sp + 16, msec % 1000 * 1000000, true);
                    },

                    // func scheduleTimeoutEvent(delay int64) int32
                    'runtime.scheduleTimeoutEvent': sp => {
                        const id = this._nextCallbackTimeoutID;
                        this._nextCallbackTimeoutID++;
                        this._scheduledTimeouts.set(id, setTimeout(() => {
                            this._resume();
                        }, getInt64(sp + 8) + 1 // setTimeout has been seen to fire up to 1 millisecond early
                        ));
                        mem().setInt32(sp + 16, id, true);
                    },

                    // func clearTimeoutEvent(id int32)
                    'runtime.clearTimeoutEvent': sp => {
                        const id = mem().getInt32(sp + 8, true);
                        clearTimeout(this._scheduledTimeouts.get(id));
                        this._scheduledTimeouts.delete(id);
                    },

                    // func getRandomData(r []byte)
                    'runtime.getRandomData': sp => {
                        crypto.getRandomValues(loadSlice(sp + 8));
                    },

                    // func stringVal(value string) ref
                    'syscall/js.stringVal': sp => {
                        storeValue(sp + 24, loadString(sp + 8));
                    },

                    // func valueGet(v ref, p string) ref
                    'syscall/js.valueGet': sp => {
                        const result = Reflect.get(loadValue(sp + 8), loadString(sp + 16));
                        sp = this._inst.exports.getsp(); // see comment above
                        storeValue(sp + 32, result);
                    },

                    // func valueSet(v ref, p string, x ref)
                    'syscall/js.valueSet': sp => {
                        Reflect.set(loadValue(sp + 8), loadString(sp + 16), loadValue(sp + 32));
                    },

                    // func valueIndex(v ref, i int) ref
                    'syscall/js.valueIndex': sp => {
                        storeValue(sp + 24, Reflect.get(loadValue(sp + 8), getInt64(sp + 16)));
                    },

                    // valueSetIndex(v ref, i int, x ref)
                    'syscall/js.valueSetIndex': sp => {
                        Reflect.set(loadValue(sp + 8), getInt64(sp + 16), loadValue(sp + 24));
                    },

                    // func valueCall(v ref, m string, args []ref) (ref, bool)
                    'syscall/js.valueCall': sp => {
                        try {
                            const v = loadValue(sp + 8);
                            const m = Reflect.get(v, loadString(sp + 16));
                            const args = loadSliceOfValues(sp + 32);
                            const result = Reflect.apply(m, v, args);
                            sp = this._inst.exports.getsp(); // see comment above
                            storeValue(sp + 56, result);
                            mem().setUint8(sp + 64, 1);
                        } catch (err) {
                            storeValue(sp + 56, err);
                            mem().setUint8(sp + 64, 0);
                        }
                    },

                    // func valueInvoke(v ref, args []ref) (ref, bool)
                    'syscall/js.valueInvoke': sp => {
                        try {
                            const v = loadValue(sp + 8);
                            const args = loadSliceOfValues(sp + 16);
                            const result = Reflect.apply(v, undefined, args);
                            sp = this._inst.exports.getsp(); // see comment above
                            storeValue(sp + 40, result);
                            mem().setUint8(sp + 48, 1);
                        } catch (err) {
                            storeValue(sp + 40, err);
                            mem().setUint8(sp + 48, 0);
                        }
                    },

                    // func valueNew(v ref, args []ref) (ref, bool)
                    'syscall/js.valueNew': sp => {
                        try {
                            const v = loadValue(sp + 8);
                            const args = loadSliceOfValues(sp + 16);
                            const result = Reflect.construct(v, args);
                            sp = this._inst.exports.getsp(); // see comment above
                            storeValue(sp + 40, result);
                            mem().setUint8(sp + 48, 1);
                        } catch (err) {
                            storeValue(sp + 40, err);
                            mem().setUint8(sp + 48, 0);
                        }
                    },

                    // func valueLength(v ref) int
                    'syscall/js.valueLength': sp => {
                        setInt64(sp + 16, parseInt(loadValue(sp + 8).length));
                    },

                    // valuePrepareString(v ref) (ref, int)
                    'syscall/js.valuePrepareString': sp => {
                        const str = encoder.encode(String(loadValue(sp + 8)));
                        storeValue(sp + 16, str);
                        setInt64(sp + 24, str.length);
                    },

                    // valueLoadString(v ref, b []byte)
                    'syscall/js.valueLoadString': sp => {
                        const str = loadValue(sp + 8);
                        loadSlice(sp + 16).set(str);
                    },

                    // func valueInstanceOf(v ref, t ref) bool
                    'syscall/js.valueInstanceOf': sp => {
                        mem().setUint8(sp + 24, loadValue(sp + 8) instanceof loadValue(sp + 16));
                    },

                    'debug': value => {
                        console.log(value);
                    }
                }
            };
        }

        async run(instance) {
            this._inst = instance;
            this._values = [// TODO: garbage collection
            NaN, 0, null, true, false, global, this._inst.exports.mem, this];
            this._refs = new Map();
            this.exited = false;

            const mem = new DataView(this._inst.exports.mem.buffer);

            // Pass command line arguments and environment variables to WebAssembly by writing them to the linear memory.
            let offset = 4096;

            const strPtr = str => {
                let ptr = offset;
                new Uint8Array(mem.buffer, offset, str.length + 1).set(encoder.encode(str + '\0'));
                offset += str.length + (8 - str.length % 8);
                return ptr;
            };

            const argc = this.argv.length;

            const argvPtrs = [];
            this.argv.forEach(arg => {
                argvPtrs.push(strPtr(arg));
            });

            const keys = Object.keys(this.env).sort();
            argvPtrs.push(keys.length);
            keys.forEach(key => {
                argvPtrs.push(strPtr(`${key}=${this.env[key]}`));
            });

            const argv = offset;
            argvPtrs.forEach(ptr => {
                mem.setUint32(offset, ptr, true);
                mem.setUint32(offset + 4, 0, true);
                offset += 8;
            });

            this._inst.exports.run(argc, argv);
            if (this.exited) {
                this._resolveExitPromise();
            }
            await this._exitPromise;
        }

        _resume() {
            if (this.exited) {
                throw new Error('Go program has already exited');
            }
            this._inst.exports.resume();
            if (this.exited) {
                this._resolveExitPromise();
            }
        }

        _makeFuncWrapper(id) {
            const go = this;
            return function () {
                const event = { id: id, this: this, args: arguments };
                go._pendingEvent = event;
                go._resume();
                return event.result;
            };
        }
    };
}
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(11)))

/***/ }),

/***/ 491:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__db_db__ = __webpack_require__(403);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__wasm_func__ = __webpack_require__(402);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utils_http__ = __webpack_require__(407);




function accountsSDK(bytom) {
    this.http = bytom.serverHttp;
    this.bytom = bytom;
}

/**
 * List of the account.
 *
 * @returns {Promise} List of Accounts
 */
accountsSDK.prototype.listAccountUseServer = function () {
    let net = this.bytom.net;
    let retPromise = new Promise((resolve, reject) => {
        Object(__WEBPACK_IMPORTED_MODULE_0__db_db__["a" /* getDB */])().then(db => {
            let transaction = db.transaction(['accounts-server'], 'readonly');
            let objectStore = transaction.objectStore('accounts-server').index('net');
            let keyRange = IDBKeyRange.only(net);
            let oc = objectStore.openCursor(keyRange);
            let ret = [];
            oc.onsuccess = function (event) {
                var cursor = event.target.result;
                if (cursor) {
                    ret.push(cursor.value);
                    cursor.continue();
                } else {
                    resolve(ret);
                }
            };
            oc.onerror = function (e) {
                reject(e);
            };
        }).catch(error => {
            reject(error);
        });
    });
    return retPromise;
};

/**
 * List all addresses and the corresponding balances of a wallet.
 *
 * @see https://gist.github.com/HAOYUatHZ/0c7446b8f33e7cddd590256b3824b08f#apiv1btmaccountlist-addresses
 * @param {String} guid
 * @returns {Promise} list of all addresses
 */
accountsSDK.prototype.listAddressUseServer = function (guid) {
    let net = this.bytom.net;
    return this.http.request('account/list-addresses', { guid: guid }, net);
};
/**
 * Create a new address for a wallet.
 *
 * @see https://gist.github.com/HAOYUatHZ/0c7446b8f33e7cddd590256b3824b08f#apiv1btmaccountnew-address
 * @param {String} guid unique id for each wallet
 * @param {String} label alias for the address to be created
 * @returns {Promise}
 */
accountsSDK.prototype.createAccountReceiverUseServer = function (guid, label) {
    let net = this.bytom.net;
    let retPromise = new Promise((resolve, reject) => {
        let pm = { guid: guid };
        if (label) {
            pm.label = label;
        }
        this.http.request('account/new-address', pm, net).then(resp => {
            let dbData = resp;
            dbData.guid = guid;
            dbData.net = net;
            Object(__WEBPACK_IMPORTED_MODULE_0__db_db__["a" /* getDB */])().then(db => {
                let transaction = db.transaction(['addresses-server'], 'readwrite');
                let objectStore = transaction.objectStore('addresses-server');
                delete dbData.rootXPub;
                let request = objectStore.add(dbData);
                request.onsuccess = function () {
                    resolve(dbData);
                };
                request.onerror = function () {
                    reject(request.error);
                };
            });
        }).catch(error => {
            reject(Object(__WEBPACK_IMPORTED_MODULE_2__utils_http__["b" /* handleAxiosError */])(error));
        });
    });
    return retPromise;
};

/**
 * Create a wallet using a public key. Each wallet is identified by a guid. (by server)
 * 
 * @see https://gist.github.com/HAOYUatHZ/0c7446b8f33e7cddd590256b3824b08f#endpoints
 * @param {String} rootXPub
 * @param {String} alias alias for the account
 * @param {String} label alias for the first address
 * @returns {Promise}
 */
accountsSDK.prototype.createAccountUseServer = function (rootXPub, alias, label) {
    let net = this.bytom.net;
    let that = this;
    let retPromise = new Promise((resolve, reject) => {
        Object(__WEBPACK_IMPORTED_MODULE_0__db_db__["a" /* getDB */])().then(db => {
            let getRequest = db.transaction(['accounts-server'], 'readonly').objectStore('accounts-server').index('alias').get(alias);
            getRequest.onsuccess = function (e) {
                if (e.target.result) {
                    reject(new Error('duplicate account alias'));
                    return;
                }
                let pm = { pubkey: rootXPub };
                if (label) {
                    pm.label = label;
                }
                that.http.request('account/create', pm, net).then(resp => {
                    let dbData = resp;
                    dbData.rootXPub = rootXPub;
                    dbData.alias = alias;
                    dbData.net = net;
                    Object(__WEBPACK_IMPORTED_MODULE_0__db_db__["a" /* getDB */])().then(db => {
                        let transaction = db.transaction(['accounts-server'], 'readwrite');
                        let objectStore = transaction.objectStore('accounts-server');
                        let request = objectStore.add(dbData);
                        request.onsuccess = function () {
                            let transaction = db.transaction(['addresses-server'], 'readwrite');
                            let objectStore = transaction.objectStore('addresses-server');
                            delete dbData.rootXPub;
                            let request = objectStore.add(dbData);
                            request.onsuccess = function () {
                                resolve(dbData);
                            };
                            request.onerror = function () {
                                reject(request.error);
                            };
                        };
                        request.onerror = function () {
                            reject(request.error);
                        };
                    });
                }).catch(error => {
                    reject(Object(__WEBPACK_IMPORTED_MODULE_2__utils_http__["b" /* handleAxiosError */])(error));
                });
            };
            getRequest.onerror = function () {
                reject(getRequest.error);
            };
        }).catch(err => {
            reject(err);
        });
    });
    return retPromise;
};

/**
 * create account
 * 
 * @param {String} alias 
 * @param {Int} quorum 
 * @param {String} rootXPub
 * @returns {Promise}
 */
accountsSDK.prototype.createAccount = function (alias, quorum, rootXPub) {
    let retPromise = new Promise((resolve, reject) => {
        Object(__WEBPACK_IMPORTED_MODULE_0__db_db__["a" /* getDB */])().then(db => {
            let transaction = db.transaction(['accounts'], 'readwrite');
            let objectStore = transaction.objectStore('accounts');
            let request = objectStore.add({
                alias: alias
            });
            request.onsuccess = function () {
                let data = { alias: alias, quorum: quorum, rootXPub: rootXPub, nextIndex: request.result };
                Object(__WEBPACK_IMPORTED_MODULE_1__wasm_func__["b" /* createAccount */])(data).then(res => {
                    let jsonData = JSON.parse(res.data);
                    let putTransaction = db.transaction(['accounts'], 'readwrite');
                    let putObjectStore = putTransaction.objectStore('accounts');
                    let putRequest = putObjectStore.put(jsonData, request.result);
                    putRequest.onsuccess = function () {
                        resolve(jsonData);
                    };
                    putRequest.onerror = function () {
                        reject(putRequest.error);
                    };
                }).catch(error => {
                    reject(error);
                });
            };
            request.onerror = function () {
                reject(request.error);
            };
        }).catch(error => {
            reject(error);
        });
    });
    return retPromise;
};

/**
 * create account address
 * 
 * @param {Object} account createAccount return account Object val
 * @param {Int} nextIndex
 * @returns {Promise}
 */
accountsSDK.prototype.createAccountReceiver = function (account) {
    let retPromise = new Promise((resolve, reject) => {
        Object(__WEBPACK_IMPORTED_MODULE_0__db_db__["a" /* getDB */])().then(db => {
            let transaction = db.transaction(['addresses'], 'readwrite');
            let objectStore = transaction.objectStore('addresses');
            let request = objectStore.add({
                account_id: account.id,
                account_alias: account.alias
            });
            request.onsuccess = function () {
                let data = { account: JSON.stringify(account), nextIndex: request.result };
                Object(__WEBPACK_IMPORTED_MODULE_1__wasm_func__["c" /* createAccountReceiver */])(data).then(res => {
                    let jsonData = JSON.parse(res.data);
                    let jsonDB = JSON.parse(res.db);
                    let putTransaction = db.transaction(['addresses'], 'readwrite');
                    let putObjectStore = putTransaction.objectStore('addresses');
                    let putRequest = null;
                    for (let key in jsonDB) {
                        if (!jsonDB.hasOwnProperty(key)) continue;
                        let putData = JSON.parse(jsonDB[key]);
                        putRequest = putObjectStore.put(putData, request.result);
                    }
                    putRequest.onsuccess = function () {
                        resolve(jsonData);
                    };
                    putRequest.onerror = function () {
                        reject(putRequest.error);
                    };
                }).catch(error => {
                    reject(error);
                });
            };
            request.onerror = function () {
                reject(request.error);
            };
        }).catch(error => {
            reject(error);
        });
    });
    return retPromise;
};

/* harmony default export */ __webpack_exports__["a"] = (accountsSDK);

/***/ }),

/***/ 492:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__wasm_func__ = __webpack_require__(402);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_http__ = __webpack_require__(407);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__db_db__ = __webpack_require__(403);




function transactionSDK(bytom) {
    this.http = bytom.serverHttp;
    this.bytom = bytom;
}

/**
 * List all the transactions related to a wallet or an address.
 *
 * @see https://gist.github.com/HAOYUatHZ/0c7446b8f33e7cddd590256b3824b08f#apiv1btmmerchantlist-transactions
 * @param {String} guid unique id for each wallet
 * @param {String} address (optional) if provided, will only return transactions the address is related to
 * @param {Number} start page start
 * @param {Number} limit page limit
 * @returns {Promise}
 */
transactionSDK.prototype.list = function (guid, address, start, limit) {
    let net = this.bytom.net;
    let pm = { guid: guid };
    if (address) {
        pm.address = address;
    }
    let url = 'merchant/list-transactions';
    let args = new URLSearchParams();
    if (typeof start !== 'undefined') {
        args.append('start', start);
    }
    if (limit) {
        args.append('limit', limit);
    }
    url = url + '?' + args.toString();
    return this.http.request(url, pm, net);
};

/**
 * Submit a signed transaction to the chain.
 *
 * @see https://gist.github.com/HAOYUatHZ/0c7446b8f33e7cddd590256b3824b08f#apiv1btmmerchantsubmit-payment
 * @param {String} guid unique id for each wallet
 * @param {String} raw_transaction raw transaction bytes encoded to string
 * @param {Array} signatures signed data of each signing instruction
 */
transactionSDK.prototype.submitPayment = function (guid, raw_transaction, signatures) {
    let net = this.bytom.net;
    let pm = { guid: guid, raw_transaction: raw_transaction, signatures: signatures };
    return this.http.request('merchant/submit-payment', pm, net);
};

/**
 * Build a raw transaction transfered from the wallet. 
 * May use all available addresses (under the wallet) as source addresses if not specified.
 * 
 * @see https://gist.github.com/HAOYUatHZ/0c7446b8f33e7cddd590256b3824b08f#apiv1btmmerchantbuild-payment
 * @param {String} guid unique id for each wallet
 * @param {String} to destination address
 * @param {String} asset hexdecimal asset id
 * @param {Number} amount transfer amount
 * @param {Number} fee transaction fee amount
 * @param {Number} confirmations - transaction confirmations
 * @returns {Promise}
 */
transactionSDK.prototype.buildPayment = function (guid, to, asset, amount, fee, confirmations) {
    let net = this.bytom.net;
    let pm = { guid: guid, to: to, asset: asset, amount: amount };
    if (fee) {
        pm.fee = fee;
    }
    if (confirmations) {
        pm.confirmations = confirmations;
    }
    return this.http.request('merchant/build-payment', pm, net);
};

/**
 * Advanced Build a raw transaction transfered from the wallet.
 * May use all available addresses (under the wallet) as source addresses if not specified.
 *
 * @param {String} guid unique id for each wallet
 * @param {Number} fee transaction fee amount
 * @returns {Promise}
 */
transactionSDK.prototype.buildTransaction = function (guid, inputs, outputs, fee, confirmations) {
    let net = this.bytom.net;
    let pm = {
        guid,
        inputs,
        outputs
    };
    if (fee) {
        pm.fee = fee;
    }
    if (confirmations) {
        pm.confirmations = confirmations;
    }
    return this.http.request('merchant/build-transaction', pm, net);
};

/**
 * sign transaction
 * @param {String} guid
 * @param {String} transaction
 * @param {String} password
 * @returns {Object} signed data
 */
transactionSDK.prototype.signTransaction = function (guid, transaction, password) {
    let bytom = this.bytom;
    let retPromise = new Promise((resolve, reject) => {
        Object(__WEBPACK_IMPORTED_MODULE_2__db_db__["a" /* getDB */])().then(db => {
            let getRequest = db.transaction(['accounts-server'], 'readonly').objectStore('accounts-server').index('guid').get(guid);
            getRequest.onsuccess = function (e) {
                if (!e.target.result) {
                    reject(new Error('not found guid'));
                    return;
                }
                bytom.sdk.keys.getKeyByXPub(e.target.result.rootXPub).then(res => {
                    let pm = { transaction: transaction, password: password, key: res };
                    Object(__WEBPACK_IMPORTED_MODULE_0__wasm_func__["h" /* signTransaction */])(pm).then(res => {
                        resolve(JSON.parse(res.data));
                    }).catch(err => {
                        reject(err);
                    });
                }).catch(err => {
                    reject(err);
                });
            };
            getRequest.onerror = function () {
                reject(getRequest.error);
            };
        }).catch(error => {
            reject(error);
        });
    });
    return retPromise;
};

/**
 * Convert arguement.
 *
 * @param {String} type - type.
 * @param {String} value - value.
 */
transactionSDK.prototype.convertArgument = function (type, value) {
    let retPromise = new Promise((resolve, reject) => {
        let data = {};
        data.type = type;
        data.raw_data = JSON.stringify({ value });
        Object(__WEBPACK_IMPORTED_MODULE_0__wasm_func__["a" /* convertArgument */])(data).then(res => {
            let jsonData = JSON.parse(res.data);
            resolve(jsonData);
        }).catch(error => {
            reject(error);
        });
    });
    return retPromise;
};

/* harmony default export */ __webpack_exports__["a"] = (transactionSDK);

/***/ }),

/***/ 493:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__db_db__ = __webpack_require__(403);


function walletSDK(bytom) {
    this.bytom = bytom;
}

let backupDBList = ['keys', 'addresses', 'accounts', 'accounts-server', 'addresses-server'];

/**
 * backup wallet.
 */
walletSDK.prototype.backup = function () {
    let retPromise = new Promise((resolve, reject) => {
        Object(__WEBPACK_IMPORTED_MODULE_0__db_db__["b" /* initDB */])().then(() => {
            let walletImage = {};
            let promiseList = [];
            for (let index = 0; index < backupDBList.length; ++index) {
                promiseList.push(backupDB(backupDBList[index]));
            }
            Promise.all(promiseList).then(res => {
                for (let index = 0; index < res.length; ++index) {
                    let data = res[index];
                    if (data.length > 0) {
                        walletImage[backupDBList[index]] = data;
                    }
                }
                resolve(JSON.stringify(walletImage));
            }).catch(error => {
                reject(error);
            });
        });
    });
    return retPromise;
};

/**
 * Restore wallet.
 *
 * @param {String} walletImage
 */
walletSDK.prototype.restore = function (walletImage) {
    let retPromise = new Promise((resolve, reject) => {
        this.bytom.sdk.keys.list().then(keys => {
            if (keys.length <= 0) {
                let data = JSON.parse(walletImage);
                let promiseList = [];
                for (let key in data) {
                    if (!data.hasOwnProperty(key) || backupDBList.indexOf(key) === -1) {
                        continue;
                    }
                    promiseList.push(restoreDB(key, data[key]));
                }
                let retData = {};

                Promise.all(promiseList).then(res => {
                    for (let index = 0; index < res.length; ++index) {
                        let data = res[index];
                        retData[data.name] = data.err;
                    }
                    resolve(retData);
                }).catch(err => {
                    reject(err);
                });
            } else {
                reject(new Error('The wallet already has account data. Can\'t restore.'));
            }
        }).catch(error => {
            reject(error);
        });
    });
    return retPromise;
};

function backupDB(dbname) {
    let ret = new Promise((resolve, reject) => {
        Object(__WEBPACK_IMPORTED_MODULE_0__db_db__["a" /* getDB */])().then(db => {
            let transaction = db.transaction([dbname], 'readonly');
            let objectStore = transaction.objectStore(dbname);
            let oc = objectStore.openCursor();
            let data = [];
            oc.onsuccess = function (event) {
                var cursor = event.target.result;
                if (cursor) {
                    data.push(cursor.value);
                    cursor.continue();
                } else {
                    resolve(data);
                }
            };
            oc.onerror = function (e) {
                reject(e);
            };
        }).catch(err => {
            reject(err);
        });
    });
    return ret;
}

function restoreDB(dbname, data) {
    let ret = new Promise((resolve, reject) => {
        Object(__WEBPACK_IMPORTED_MODULE_0__db_db__["a" /* getDB */])().then(db => {
            let index = 0;
            let errList = [];
            batchAdd();

            function batchAdd() {
                if (index >= data.length) {
                    let r = { name: dbname, err: errList };
                    resolve(r);
                    return;
                }
                let transaction = db.transaction([dbname], 'readwrite');
                let objectStore = transaction.objectStore(dbname);
                let req = objectStore.add(data[index]);
                req.onsuccess = batchAdd;
                req.onerror = function () {
                    // if error continue add
                    errList.push(req.error);
                    batchAdd();
                };
                index++;
            }
        }).catch(err => {
            reject(err);
        });
    });
    return ret;
}

/* harmony default export */ __webpack_exports__["a"] = (walletSDK);

/***/ }),

/***/ 494:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
function querySDK(bytom) {
    this.bytom = bytom;
    this.http = bytom.serverHttp;
}
/**
 * Query the price of an asset on a given blockchain. asset_id is a hexdecimal string.
 *
 * @param {String} asset_id
 */
querySDK.prototype.asset = function (asset_id) {
    let net = this.bytom.net;
    return this.http.request('q/asset?id=' + asset_id, null, net, 'GET');
};

/**
 * Query the current height of a blockchain.
 */
querySDK.prototype.getblockcount = function () {
    let net = this.bytom.net;
    return this.http.request('q/chain-status', null, net, 'GET');
};

/**
 * Query the current utxo.
 */
querySDK.prototype.listUtxo = function (object) {
    let net = this.bytom.net;
    return this.http.request('q/list-utxos', object, net, 'POST');
};

/* harmony default export */ __webpack_exports__["a"] = (querySDK);

/***/ }),

/***/ 495:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = serverHttp;
/* harmony export (immutable) */ __webpack_exports__["a"] = http;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_axios__ = __webpack_require__(496);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_axios___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_axios__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_http__ = __webpack_require__(407);



const basePath = 'api/v1/btm/';

function serverHttp(host) {
    this.host = host;
    this.request = function (path, body, net, method) {
        var config = {
            url: this.host[net] ? `${this.host[net]}${basePath}${path}` : `${this.host}${basePath}${path}`,
            method: method ? method : 'POST',
            headers: {
                Accept: 'application/json'
            },
            data: body,
            timeout: 25000
        };

        //return Promise
        return __WEBPACK_IMPORTED_MODULE_0_axios___default.a.request(config).then(function (resp) {
            if (resp.status !== 200 || resp.data.code !== 200) {
                throw Object(__WEBPACK_IMPORTED_MODULE_1__utils_http__["a" /* handleApiError */])(resp);
            } else if (resp.data.code === 200) {
                return resp.data.result.data;
            }
            return resp.data;
        }).catch(error => {
            throw Object(__WEBPACK_IMPORTED_MODULE_1__utils_http__["b" /* handleAxiosError */])(error);
        });
    };
}

function http(baseUrl) {
    this.baseUrl = baseUrl;
    this.request = function (path, body, method) {
        var config = {
            url: `${this.baseUrl}${basePath}${path}`,
            method: method ? method : 'POST',
            headers: {
                Accept: 'application/json'
            },
            data: body,
            timeout: 25000
        };

        //return Promise
        return __WEBPACK_IMPORTED_MODULE_0_axios___default.a.request(config).then(function (resp) {
            if (resp.status !== 200 || resp.data.code !== 200) {
                throw Object(__WEBPACK_IMPORTED_MODULE_1__utils_http__["a" /* handleApiError */])(resp);
            } else if (resp.data.code === 200) {
                return resp.data.result.data;
            }
            return resp.data;
        }).catch(error => {
            throw error;
        });
    };
}

/***/ }),

/***/ 496:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(497);

/***/ }),

/***/ 497:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(63);
var bind = __webpack_require__(474);
var Axios = __webpack_require__(499);
var defaults = __webpack_require__(408);

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(utils.merge(defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = __webpack_require__(478);
axios.CancelToken = __webpack_require__(513);
axios.isCancel = __webpack_require__(477);

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__(514);

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;


/***/ }),

/***/ 498:
/***/ (function(module, exports) {

/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}


/***/ }),

/***/ 499:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var defaults = __webpack_require__(408);
var utils = __webpack_require__(63);
var InterceptorManager = __webpack_require__(508);
var dispatchRequest = __webpack_require__(509);

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = utils.merge({
      url: arguments[0]
    }, arguments[1]);
  }

  config = utils.merge(defaults, {method: 'get'}, this.defaults, config);
  config.method = config.method.toLowerCase();

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;


/***/ }),

/***/ 500:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(63);

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};


/***/ }),

/***/ 501:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var createError = __webpack_require__(476);

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  // Note: status is not exposed by XDomainRequest
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};


/***/ }),

/***/ 502:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }
  error.request = request;
  error.response = response;
  return error;
};


/***/ }),

/***/ 503:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(63);

function encode(val) {
  return encodeURIComponent(val).
    replace(/%40/gi, '@').
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};


/***/ }),

/***/ 504:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(63);

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};


/***/ }),

/***/ 505:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(63);

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
  (function standardBrowserEnv() {
    var msie = /(msie|trident)/i.test(navigator.userAgent);
    var urlParsingNode = document.createElement('a');
    var originURL;

    /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
    function resolveURL(url) {
      var href = url;

      if (msie) {
        // IE needs attribute set twice to normalize properties
        urlParsingNode.setAttribute('href', href);
        href = urlParsingNode.href;
      }

      urlParsingNode.setAttribute('href', href);

      // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
      return {
        href: urlParsingNode.href,
        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
        host: urlParsingNode.host,
        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
        hostname: urlParsingNode.hostname,
        port: urlParsingNode.port,
        pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
                  urlParsingNode.pathname :
                  '/' + urlParsingNode.pathname
      };
    }

    originURL = resolveURL(window.location.href);

    /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
    return function isURLSameOrigin(requestURL) {
      var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
      return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
    };
  })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return function isURLSameOrigin() {
      return true;
    };
  })()
);


/***/ }),

/***/ 506:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// btoa polyfill for IE<10 courtesy https://github.com/davidchambers/Base64.js

var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

function E() {
  this.message = 'String contains an invalid character';
}
E.prototype = new Error;
E.prototype.code = 5;
E.prototype.name = 'InvalidCharacterError';

function btoa(input) {
  var str = String(input);
  var output = '';
  for (
    // initialize result and counter
    var block, charCode, idx = 0, map = chars;
    // if the next str index does not exist:
    //   change the mapping table to "="
    //   check if d has no fractional digits
    str.charAt(idx | 0) || (map = '=', idx % 1);
    // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
    output += map.charAt(63 & block >> 8 - idx % 1 * 8)
  ) {
    charCode = str.charCodeAt(idx += 3 / 4);
    if (charCode > 0xFF) {
      throw new E();
    }
    block = block << 8 | charCode;
  }
  return output;
}

module.exports = btoa;


/***/ }),

/***/ 507:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(63);

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
  (function standardBrowserEnv() {
    return {
      write: function write(name, value, expires, path, domain, secure) {
        var cookie = [];
        cookie.push(name + '=' + encodeURIComponent(value));

        if (utils.isNumber(expires)) {
          cookie.push('expires=' + new Date(expires).toGMTString());
        }

        if (utils.isString(path)) {
          cookie.push('path=' + path);
        }

        if (utils.isString(domain)) {
          cookie.push('domain=' + domain);
        }

        if (secure === true) {
          cookie.push('secure');
        }

        document.cookie = cookie.join('; ');
      },

      read: function read(name) {
        var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
        return (match ? decodeURIComponent(match[3]) : null);
      },

      remove: function remove(name) {
        this.write(name, '', Date.now() - 86400000);
      }
    };
  })() :

  // Non standard browser env (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return {
      write: function write() {},
      read: function read() { return null; },
      remove: function remove() {}
    };
  })()
);


/***/ }),

/***/ 508:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(63);

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;


/***/ }),

/***/ 509:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(63);
var transformData = __webpack_require__(510);
var isCancel = __webpack_require__(477);
var defaults = __webpack_require__(408);
var isAbsoluteURL = __webpack_require__(511);
var combineURLs = __webpack_require__(512);

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Support baseURL config
  if (config.baseURL && !isAbsoluteURL(config.url)) {
    config.url = combineURLs(config.baseURL, config.url);
  }

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers || {}
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};


/***/ }),

/***/ 510:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(63);

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};


/***/ }),

/***/ 511:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};


/***/ }),

/***/ 512:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};


/***/ }),

/***/ 513:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Cancel = __webpack_require__(478);

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


/***/ }),

/***/ 514:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};


/***/ }),

/***/ 515:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator__ = __webpack_require__(157);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_asyncToGenerator__ = __webpack_require__(158);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_asyncToGenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_asyncToGenerator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_promise__ = __webpack_require__(107);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_promise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_promise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__bytom__ = __webpack_require__(479);





var account = {
  setupNet: __WEBPACK_IMPORTED_MODULE_3__bytom__["a" /* default */].setupNet
};

account.create = function (accountAlias, keyAlias, passwd, success, error) {
  var retPromise = new __WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_promise___default.a(function (resolve, reject) {
    __WEBPACK_IMPORTED_MODULE_3__bytom__["a" /* default */].keys.create(keyAlias, passwd).then(function (res) {
      __WEBPACK_IMPORTED_MODULE_3__bytom__["a" /* default */].accounts.createAccountUseServer(res.xpub, accountAlias).then(function (ret) {
        resolve(ret);
      }).catch(function (error) {
        reject(error);
      });
    }).catch(function (error) {
      reject(error);
    });
  });
  return retPromise;
};

account.balance = function (guid) {
  var retPromise = new __WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_promise___default.a(function (resolve, reject) {
    __WEBPACK_IMPORTED_MODULE_3__bytom__["a" /* default */].accounts.listAddressUseServer(guid).then(function (addresses) {
      var balances = [];
      addresses.forEach(function (address) {
        if (address.balances != null) {
          balances = balances.concat(address.balances);
        }
      });
      var obj = {};

      balances.forEach(function (balance) {
        if (obj.hasOwnProperty(balance.asset)) {
          obj[balance.asset].balance = Number(obj[balance.asset].balance) + Number(balance.balance);
        } else {
          balance.balance = Number(balance.balance);
          obj[balance.asset] = balance;
          delete obj[balance.asset]['total_received'];
          delete obj[balance.asset]['total_sent'];
          delete obj[balance.asset]['in_btc'];
          delete obj[balance.asset]['in_cny'];
          delete obj[balance.asset]['in_usd'];
        }
      });

      var res = [];

      for (var prop in obj) {
        res.push(obj[prop]);
      }

      resolve(res);
    }).catch(function (error) {
      reject(error);
    });
  });
  return retPromise;
};

account.list = function () {
  var _this = this;

  var retPromise = new __WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_promise___default.a(function (resolve, reject) {
    __WEBPACK_IMPORTED_MODULE_3__bytom__["a" /* default */].accounts.listAccountUseServer().then(function (accounts) {
      __WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_promise___default.a.all(accounts.map(function () {
        var _ref = __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_asyncToGenerator___default()( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.mark(function _callee(account) {
          var balances;
          return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return _this.balance(account.guid);

                case 2:
                  balances = _context.sent;

                  account.balances = balances;

                case 4:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, _this);
        }));

        return function (_x) {
          return _ref.apply(this, arguments);
        };
      }())).then(function () {
        resolve(accounts);
      });
    }).catch(function (error) {
      reject(error);
    });
  });

  return retPromise;
};

account.backup = function () {
  return __WEBPACK_IMPORTED_MODULE_3__bytom__["a" /* default */].wallet.backup();
};

account.restore = function (walletImage) {
  return __WEBPACK_IMPORTED_MODULE_3__bytom__["a" /* default */].wallet.restore(walletImage);
};

/* harmony default export */ __webpack_exports__["a"] = (account);

/***/ }),

/***/ 527:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_menuCreation_vue__ = __webpack_require__(572);
/* empty harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_1f8114d7_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_menuCreation_vue__ = __webpack_require__(610);
function injectStyle (ssrContext) {
  __webpack_require__(608)
}
var normalizeComponent = __webpack_require__(114)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-1f8114d7"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_menuCreation_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_1f8114d7_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_menuCreation_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),

/***/ 572:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__models_account__ = __webpack_require__(515);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ __webpack_exports__["a"] = ({
    name: "",
    components: {},
    data: function data() {
        return {
            formItem: {
                accAlias: "",
                keyAlias: "",
                passwd1: "",
                passwd2: ""
            },
            tips: ""
        };
    },

    methods: {
        create: function create() {
            var _this = this;

            if (this.formItem.accAlias == "") {
                this.$dialog.show({
                    body: this.$t("createAccount.inputAlias")
                });
                return;
            }
            if (this.formItem.keyAlias == "") {
                this.$dialog.show({
                    body: this.$t("createAccount.inputKey")
                });
                return;
            }
            if (this.formItem.passwd1 == "") {
                this.$dialog.show({
                    body: this.$t("createAccount.inputPass")
                });
                return;
            }
            if (this.formItem.passwd1 != this.formItem.passwd2) {
                this.$dialog.show({
                    body: this.$t('createAccount.passwordAgain')
                });
                return;
            }

            var loader = this.$loading.show({
                container: this.fullPage ? null : this.$refs.formContainer,
                canCancel: true,
                onCancel: this.onCancel
            });

            __WEBPACK_IMPORTED_MODULE_0__models_account__["a" /* default */].create(this.formItem.accAlias, this.formItem.keyAlias, this.formItem.passwd1).then(function (res) {
                loader.hide();
                console.log("bytom.Account.create", res);
                _this.$router.push({ name: "home", params: { selectedAccount: res } });
            }).catch(function (err) {
                console.log(err);
                loader.hide();
                _this.$dialog.show({
                    body: err.message
                });
            });
        }
    },
    mounted: function mounted() {}
});

/***/ }),

/***/ 608:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(609);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(56)("0fc25ebf", content, true, {});

/***/ }),

/***/ 609:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(55)(false);
// imports


// module
exports.push([module.i, ".form-item[data-v-1f8114d7]{background:transparent;margin:0;padding:0}.form-item .form-item-label[data-v-1f8114d7]{float:none;width:200px;margin:0;padding:0}.submit[data-v-1f8114d7]{margin-top:15px;height:48px;padding:15px}.form[data-v-1f8114d7]{border-radius:4px;background:#fff;padding:20px 20px 28px}", ""]);

// exports


/***/ }),

/***/ 610:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('MenuPage',{attrs:{"title":_vm.$t('createAccount.title')}},[_c('div',{staticClass:"form"},[_c('div',{staticClass:"form-item"},[_c('label',{staticClass:"form-item-label"},[_vm._v(_vm._s(_vm.$t('createAccount.accountAlias')))]),_vm._v(" "),_c('div',{staticClass:"form-item-content"},[_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.formItem.accAlias),expression:"formItem.accAlias"}],attrs:{"type":"text"},domProps:{"value":(_vm.formItem.accAlias)},on:{"input":function($event){if($event.target.composing){ return; }_vm.$set(_vm.formItem, "accAlias", $event.target.value)}}})])]),_vm._v(" "),_c('div',{staticClass:"form-item"},[_c('label',{staticClass:"form-item-label"},[_vm._v(_vm._s(_vm.$t('createAccount.keyAlias')))]),_vm._v(" "),_c('div',{staticClass:"form-item-content"},[_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.formItem.keyAlias),expression:"formItem.keyAlias"}],attrs:{"type":"text"},domProps:{"value":(_vm.formItem.keyAlias)},on:{"input":function($event){if($event.target.composing){ return; }_vm.$set(_vm.formItem, "keyAlias", $event.target.value)}}})])]),_vm._v(" "),_c('div',{staticClass:"form-item"},[_c('label',{staticClass:"form-item-label"},[_vm._v(_vm._s(_vm.$t('createAccount.keyPassword')))]),_vm._v(" "),_c('div',{staticClass:"form-item-content"},[_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.formItem.passwd1),expression:"formItem.passwd1"}],attrs:{"type":"password"},domProps:{"value":(_vm.formItem.passwd1)},on:{"input":function($event){if($event.target.composing){ return; }_vm.$set(_vm.formItem, "passwd1", $event.target.value)}}})])]),_vm._v(" "),_c('div',{staticClass:"form-item"},[_c('label',{staticClass:"form-item-label"},[_vm._v(_vm._s(_vm.$t('createAccount.confirmPassword')))]),_vm._v(" "),_c('div',{staticClass:"form-item-content"},[_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.formItem.passwd2),expression:"formItem.passwd2"}],attrs:{"type":"password"},domProps:{"value":(_vm.formItem.passwd2)},on:{"input":function($event){if($event.target.composing){ return; }_vm.$set(_vm.formItem, "passwd2", $event.target.value)}}})])]),_vm._v(" "),_c('div',{staticClass:"tips"},[_vm._v(_vm._s(_vm.tips))])]),_vm._v(" "),_c('a',{staticClass:"btn btn-primary submit",on:{"click":_vm.create}},[_vm._v(_vm._s(_vm.$t('createAccount.create')))])])}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),

/***/ 63:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bind = __webpack_require__(474);
var isBuffer = __webpack_require__(498);

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = merge(result[key], val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim
};


/***/ }),

/***/ 65:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 25.4.1.5 NewPromiseCapability(C)
var aFunction = __webpack_require__(31);

function PromiseCapability(C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject = aFunction(reject);
}

module.exports.f = function (C) {
  return new PromiseCapability(C);
};


/***/ }),

/***/ 79:
/***/ (function(module, exports, __webpack_require__) {

var ctx = __webpack_require__(25);
var call = __webpack_require__(161);
var isArrayIter = __webpack_require__(162);
var anObject = __webpack_require__(16);
var toLength = __webpack_require__(57);
var getIterFn = __webpack_require__(163);
var BREAK = {};
var RETURN = {};
var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
  var iterFn = ITERATOR ? function () { return iterable; } : getIterFn(iterable);
  var f = ctx(fn, that, entries ? 2 : 1);
  var index = 0;
  var length, step, iterator, result;
  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if (isArrayIter(iterFn)) for (length = toLength(iterable.length); length > index; index++) {
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if (result === BREAK || result === RETURN) return result;
  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
    result = call(iterator, f, step.value, entries);
    if (result === BREAK || result === RETURN) return result;
  }
};
exports.BREAK = BREAK;
exports.RETURN = RETURN;


/***/ }),

/***/ 88:
/***/ (function(module, exports) {

module.exports = function (it, Constructor, name, forbiddenField) {
  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};


/***/ }),

/***/ 89:
/***/ (function(module, exports, __webpack_require__) {

var hide = __webpack_require__(15);
module.exports = function (target, src, safe) {
  for (var key in src) {
    if (safe && target[key]) target[key] = src[key];
    else hide(target, key, src[key]);
  } return target;
};


/***/ })

});
//# sourceMappingURL=8.js.map 