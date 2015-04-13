(function() {
    "use strict";
    var oshpark$model_with_attributes$$camelize, oshpark$model_with_attributes$$modelWithAttributes;

    oshpark$model_with_attributes$$camelize = function(str) {
      return str.replace(/_([a-z])/g, function(g) {
        return g[1].toUpperCase();
      });
    };

    oshpark$model_with_attributes$$modelWithAttributes = function(attributes) {
      var Model;
      Model = (function() {
        function Model(json, client) {
          var attribute, camelized, _i, _len;
          if (client == null) {
            client = void 0;
          }
          this.client = client;
          this.__attrs__ = json;
          for (_i = 0, _len = attributes.length; _i < _len; _i++) {
            attribute = attributes[_i];
            camelized = oshpark$model_with_attributes$$camelize(attribute);
            if (this[camelized] == null) {
              this[camelized] = json[attribute];
            }
          }
        }

        return Model;

      })();
      return Model;
    };

    var oshpark$model_with_attributes$$default = oshpark$model_with_attributes$$modelWithAttributes;
    var oshpark$address$$Address,
      oshpark$address$$__hasProp = {}.hasOwnProperty,
      oshpark$address$$__extends = function(child, parent) { for (var key in parent) { if (oshpark$address$$__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

    oshpark$address$$Address = (function(_super) {
      oshpark$address$$__extends(Address, _super);

      function Address() {
        return Address.__super__.constructor.apply(this, arguments);
      }

      return Address;

    })(oshpark$model_with_attributes$$default(['name', 'company_name', 'address_line_1', 'address_line_2', 'city', 'state', 'zip_or_postal_code', 'country', 'phone_number', 'is_business']));

    var oshpark$address$$default = oshpark$address$$Address;
    function rsvp$events$$indexOf(callbacks, callback) {
      for (var i=0, l=callbacks.length; i<l; i++) {
        if (callbacks[i] === callback) { return i; }
      }

      return -1;
    }

    function rsvp$events$$callbacksFor(object) {
      var callbacks = object._promiseCallbacks;

      if (!callbacks) {
        callbacks = object._promiseCallbacks = {};
      }

      return callbacks;
    }

    var rsvp$events$$default = {

      /**
        `RSVP.EventTarget.mixin` extends an object with EventTarget methods. For
        Example:

        ```javascript
        var object = {};

        RSVP.EventTarget.mixin(object);

        object.on('finished', function(event) {
          // handle event
        });

        object.trigger('finished', { detail: value });
        ```

        `EventTarget.mixin` also works with prototypes:

        ```javascript
        var Person = function() {};
        RSVP.EventTarget.mixin(Person.prototype);

        var yehuda = new Person();
        var tom = new Person();

        yehuda.on('poke', function(event) {
          console.log('Yehuda says OW');
        });

        tom.on('poke', function(event) {
          console.log('Tom says OW');
        });

        yehuda.trigger('poke');
        tom.trigger('poke');
        ```

        @method mixin
        @for RSVP.EventTarget
        @private
        @param {Object} object object to extend with EventTarget methods
      */
      'mixin': function(object) {
        object['on']      = this['on'];
        object['off']     = this['off'];
        object['trigger'] = this['trigger'];
        object._promiseCallbacks = undefined;
        return object;
      },

      /**
        Registers a callback to be executed when `eventName` is triggered

        ```javascript
        object.on('event', function(eventInfo){
          // handle the event
        });

        object.trigger('event');
        ```

        @method on
        @for RSVP.EventTarget
        @private
        @param {String} eventName name of the event to listen for
        @param {Function} callback function to be called when the event is triggered.
      */
      'on': function(eventName, callback) {
        var allCallbacks = rsvp$events$$callbacksFor(this), callbacks;

        callbacks = allCallbacks[eventName];

        if (!callbacks) {
          callbacks = allCallbacks[eventName] = [];
        }

        if (rsvp$events$$indexOf(callbacks, callback) === -1) {
          callbacks.push(callback);
        }
      },

      /**
        You can use `off` to stop firing a particular callback for an event:

        ```javascript
        function doStuff() { // do stuff! }
        object.on('stuff', doStuff);

        object.trigger('stuff'); // doStuff will be called

        // Unregister ONLY the doStuff callback
        object.off('stuff', doStuff);
        object.trigger('stuff'); // doStuff will NOT be called
        ```

        If you don't pass a `callback` argument to `off`, ALL callbacks for the
        event will not be executed when the event fires. For example:

        ```javascript
        var callback1 = function(){};
        var callback2 = function(){};

        object.on('stuff', callback1);
        object.on('stuff', callback2);

        object.trigger('stuff'); // callback1 and callback2 will be executed.

        object.off('stuff');
        object.trigger('stuff'); // callback1 and callback2 will not be executed!
        ```

        @method off
        @for RSVP.EventTarget
        @private
        @param {String} eventName event to stop listening to
        @param {Function} callback optional argument. If given, only the function
        given will be removed from the event's callback queue. If no `callback`
        argument is given, all callbacks will be removed from the event's callback
        queue.
      */
      'off': function(eventName, callback) {
        var allCallbacks = rsvp$events$$callbacksFor(this), callbacks, index;

        if (!callback) {
          allCallbacks[eventName] = [];
          return;
        }

        callbacks = allCallbacks[eventName];

        index = rsvp$events$$indexOf(callbacks, callback);

        if (index !== -1) { callbacks.splice(index, 1); }
      },

      /**
        Use `trigger` to fire custom events. For example:

        ```javascript
        object.on('foo', function(){
          console.log('foo event happened!');
        });
        object.trigger('foo');
        // 'foo event happened!' logged to the console
        ```

        You can also pass a value as a second argument to `trigger` that will be
        passed as an argument to all event listeners for the event:

        ```javascript
        object.on('foo', function(value){
          console.log(value.name);
        });

        object.trigger('foo', { name: 'bar' });
        // 'bar' logged to the console
        ```

        @method trigger
        @for RSVP.EventTarget
        @private
        @param {String} eventName name of the event to be triggered
        @param {Any} options optional value to be passed to any event handlers for
        the given `eventName`
      */
      'trigger': function(eventName, options) {
        var allCallbacks = rsvp$events$$callbacksFor(this), callbacks, callback;

        if (callbacks = allCallbacks[eventName]) {
          // Don't cache the callbacks.length since it may grow
          for (var i=0; i<callbacks.length; i++) {
            callback = callbacks[i];

            callback(options);
          }
        }
      }
    };

    var rsvp$config$$config = {
      instrument: false
    };

    rsvp$events$$default['mixin'](rsvp$config$$config);

    function rsvp$config$$configure(name, value) {
      if (name === 'onerror') {
        // handle for legacy users that expect the actual
        // error to be passed to their function added via
        // `RSVP.configure('onerror', someFunctionHere);`
        rsvp$config$$config['on']('error', value);
        return;
      }

      if (arguments.length === 2) {
        rsvp$config$$config[name] = value;
      } else {
        return rsvp$config$$config[name];
      }
    }

    function rsvp$utils$$objectOrFunction(x) {
      return typeof x === 'function' || (typeof x === 'object' && x !== null);
    }

    function rsvp$utils$$isFunction(x) {
      return typeof x === 'function';
    }

    function rsvp$utils$$isMaybeThenable(x) {
      return typeof x === 'object' && x !== null;
    }

    var rsvp$utils$$_isArray;
    if (!Array.isArray) {
      rsvp$utils$$_isArray = function (x) {
        return Object.prototype.toString.call(x) === '[object Array]';
      };
    } else {
      rsvp$utils$$_isArray = Array.isArray;
    }

    var rsvp$utils$$isArray = rsvp$utils$$_isArray;

    var rsvp$utils$$now = Date.now || function() { return new Date().getTime(); };

    function rsvp$utils$$F() { }

    var rsvp$utils$$o_create = (Object.create || function (o) {
      if (arguments.length > 1) {
        throw new Error('Second argument not supported');
      }
      if (typeof o !== 'object') {
        throw new TypeError('Argument must be an object');
      }
      rsvp$utils$$F.prototype = o;
      return new rsvp$utils$$F();
    });

    var rsvp$instrument$$queue = [];

    function rsvp$instrument$$scheduleFlush() {
      setTimeout(function() {
        var entry;
        for (var i = 0; i < rsvp$instrument$$queue.length; i++) {
          entry = rsvp$instrument$$queue[i];

          var payload = entry.payload;

          payload.guid = payload.key + payload.id;
          payload.childGuid = payload.key + payload.childId;
          if (payload.error) {
            payload.stack = payload.error.stack;
          }

          rsvp$config$$config['trigger'](entry.name, entry.payload);
        }
        rsvp$instrument$$queue.length = 0;
      }, 50);
    }

    function rsvp$instrument$$instrument(eventName, promise, child) {
      if (1 === rsvp$instrument$$queue.push({
          name: eventName,
          payload: {
            key: promise._guidKey,
            id:  promise._id,
            eventName: eventName,
            detail: promise._result,
            childId: child && child._id,
            label: promise._label,
            timeStamp: rsvp$utils$$now(),
            error: rsvp$config$$config["instrument-with-stack"] ? new Error(promise._label) : null
          }})) {
            rsvp$instrument$$scheduleFlush();
          }
      }
    var rsvp$instrument$$default = rsvp$instrument$$instrument;

    function  rsvp$$internal$$withOwnPromise() {
      return new TypeError('A promises callback cannot return that same promise.');
    }

    function rsvp$$internal$$noop() {}

    var rsvp$$internal$$PENDING   = void 0;
    var rsvp$$internal$$FULFILLED = 1;
    var rsvp$$internal$$REJECTED  = 2;

    var rsvp$$internal$$GET_THEN_ERROR = new rsvp$$internal$$ErrorObject();

    function rsvp$$internal$$getThen(promise) {
      try {
        return promise.then;
      } catch(error) {
        rsvp$$internal$$GET_THEN_ERROR.error = error;
        return rsvp$$internal$$GET_THEN_ERROR;
      }
    }

    function rsvp$$internal$$tryThen(then, value, fulfillmentHandler, rejectionHandler) {
      try {
        then.call(value, fulfillmentHandler, rejectionHandler);
      } catch(e) {
        return e;
      }
    }

    function rsvp$$internal$$handleForeignThenable(promise, thenable, then) {
      rsvp$config$$config.async(function(promise) {
        var sealed = false;
        var error = rsvp$$internal$$tryThen(then, thenable, function(value) {
          if (sealed) { return; }
          sealed = true;
          if (thenable !== value) {
            rsvp$$internal$$resolve(promise, value);
          } else {
            rsvp$$internal$$fulfill(promise, value);
          }
        }, function(reason) {
          if (sealed) { return; }
          sealed = true;

          rsvp$$internal$$reject(promise, reason);
        }, 'Settle: ' + (promise._label || ' unknown promise'));

        if (!sealed && error) {
          sealed = true;
          rsvp$$internal$$reject(promise, error);
        }
      }, promise);
    }

    function rsvp$$internal$$handleOwnThenable(promise, thenable) {
      if (thenable._state === rsvp$$internal$$FULFILLED) {
        rsvp$$internal$$fulfill(promise, thenable._result);
      } else if (thenable._state === rsvp$$internal$$REJECTED) {
        thenable._onError = null;
        rsvp$$internal$$reject(promise, thenable._result);
      } else {
        rsvp$$internal$$subscribe(thenable, undefined, function(value) {
          if (thenable !== value) {
            rsvp$$internal$$resolve(promise, value);
          } else {
            rsvp$$internal$$fulfill(promise, value);
          }
        }, function(reason) {
          rsvp$$internal$$reject(promise, reason);
        });
      }
    }

    function rsvp$$internal$$handleMaybeThenable(promise, maybeThenable) {
      if (maybeThenable.constructor === promise.constructor) {
        rsvp$$internal$$handleOwnThenable(promise, maybeThenable);
      } else {
        var then = rsvp$$internal$$getThen(maybeThenable);

        if (then === rsvp$$internal$$GET_THEN_ERROR) {
          rsvp$$internal$$reject(promise, rsvp$$internal$$GET_THEN_ERROR.error);
        } else if (then === undefined) {
          rsvp$$internal$$fulfill(promise, maybeThenable);
        } else if (rsvp$utils$$isFunction(then)) {
          rsvp$$internal$$handleForeignThenable(promise, maybeThenable, then);
        } else {
          rsvp$$internal$$fulfill(promise, maybeThenable);
        }
      }
    }

    function rsvp$$internal$$resolve(promise, value) {
      if (promise === value) {
        rsvp$$internal$$fulfill(promise, value);
      } else if (rsvp$utils$$objectOrFunction(value)) {
        rsvp$$internal$$handleMaybeThenable(promise, value);
      } else {
        rsvp$$internal$$fulfill(promise, value);
      }
    }

    function rsvp$$internal$$publishRejection(promise) {
      if (promise._onError) {
        promise._onError(promise._result);
      }

      rsvp$$internal$$publish(promise);
    }

    function rsvp$$internal$$fulfill(promise, value) {
      if (promise._state !== rsvp$$internal$$PENDING) { return; }

      promise._result = value;
      promise._state = rsvp$$internal$$FULFILLED;

      if (promise._subscribers.length === 0) {
        if (rsvp$config$$config.instrument) {
          rsvp$instrument$$default('fulfilled', promise);
        }
      } else {
        rsvp$config$$config.async(rsvp$$internal$$publish, promise);
      }
    }

    function rsvp$$internal$$reject(promise, reason) {
      if (promise._state !== rsvp$$internal$$PENDING) { return; }
      promise._state = rsvp$$internal$$REJECTED;
      promise._result = reason;
      rsvp$config$$config.async(rsvp$$internal$$publishRejection, promise);
    }

    function rsvp$$internal$$subscribe(parent, child, onFulfillment, onRejection) {
      var subscribers = parent._subscribers;
      var length = subscribers.length;

      parent._onError = null;

      subscribers[length] = child;
      subscribers[length + rsvp$$internal$$FULFILLED] = onFulfillment;
      subscribers[length + rsvp$$internal$$REJECTED]  = onRejection;

      if (length === 0 && parent._state) {
        rsvp$config$$config.async(rsvp$$internal$$publish, parent);
      }
    }

    function rsvp$$internal$$publish(promise) {
      var subscribers = promise._subscribers;
      var settled = promise._state;

      if (rsvp$config$$config.instrument) {
        rsvp$instrument$$default(settled === rsvp$$internal$$FULFILLED ? 'fulfilled' : 'rejected', promise);
      }

      if (subscribers.length === 0) { return; }

      var child, callback, detail = promise._result;

      for (var i = 0; i < subscribers.length; i += 3) {
        child = subscribers[i];
        callback = subscribers[i + settled];

        if (child) {
          rsvp$$internal$$invokeCallback(settled, child, callback, detail);
        } else {
          callback(detail);
        }
      }

      promise._subscribers.length = 0;
    }

    function rsvp$$internal$$ErrorObject() {
      this.error = null;
    }

    var rsvp$$internal$$TRY_CATCH_ERROR = new rsvp$$internal$$ErrorObject();

    function rsvp$$internal$$tryCatch(callback, detail) {
      try {
        return callback(detail);
      } catch(e) {
        rsvp$$internal$$TRY_CATCH_ERROR.error = e;
        return rsvp$$internal$$TRY_CATCH_ERROR;
      }
    }

    function rsvp$$internal$$invokeCallback(settled, promise, callback, detail) {
      var hasCallback = rsvp$utils$$isFunction(callback),
          value, error, succeeded, failed;

      if (hasCallback) {
        value = rsvp$$internal$$tryCatch(callback, detail);

        if (value === rsvp$$internal$$TRY_CATCH_ERROR) {
          failed = true;
          error = value.error;
          value = null;
        } else {
          succeeded = true;
        }

        if (promise === value) {
          rsvp$$internal$$reject(promise, rsvp$$internal$$withOwnPromise());
          return;
        }

      } else {
        value = detail;
        succeeded = true;
      }

      if (promise._state !== rsvp$$internal$$PENDING) {
        // noop
      } else if (hasCallback && succeeded) {
        rsvp$$internal$$resolve(promise, value);
      } else if (failed) {
        rsvp$$internal$$reject(promise, error);
      } else if (settled === rsvp$$internal$$FULFILLED) {
        rsvp$$internal$$fulfill(promise, value);
      } else if (settled === rsvp$$internal$$REJECTED) {
        rsvp$$internal$$reject(promise, value);
      }
    }

    function rsvp$$internal$$initializePromise(promise, resolver) {
      var resolved = false;
      try {
        resolver(function resolvePromise(value){
          if (resolved) { return; }
          resolved = true;
          rsvp$$internal$$resolve(promise, value);
        }, function rejectPromise(reason) {
          if (resolved) { return; }
          resolved = true;
          rsvp$$internal$$reject(promise, reason);
        });
      } catch(e) {
        rsvp$$internal$$reject(promise, e);
      }
    }

    function rsvp$enumerator$$makeSettledResult(state, position, value) {
      if (state === rsvp$$internal$$FULFILLED) {
        return {
          state: 'fulfilled',
          value: value
        };
      } else {
        return {
          state: 'rejected',
          reason: value
        };
      }
    }

    function rsvp$enumerator$$Enumerator(Constructor, input, abortOnReject, label) {
      this._instanceConstructor = Constructor;
      this.promise = new Constructor(rsvp$$internal$$noop, label);
      this._abortOnReject = abortOnReject;

      if (this._validateInput(input)) {
        this._input     = input;
        this.length     = input.length;
        this._remaining = input.length;

        this._init();

        if (this.length === 0) {
          rsvp$$internal$$fulfill(this.promise, this._result);
        } else {
          this.length = this.length || 0;
          this._enumerate();
          if (this._remaining === 0) {
            rsvp$$internal$$fulfill(this.promise, this._result);
          }
        }
      } else {
        rsvp$$internal$$reject(this.promise, this._validationError());
      }
    }

    var rsvp$enumerator$$default = rsvp$enumerator$$Enumerator;

    rsvp$enumerator$$Enumerator.prototype._validateInput = function(input) {
      return rsvp$utils$$isArray(input);
    };

    rsvp$enumerator$$Enumerator.prototype._validationError = function() {
      return new Error('Array Methods must be provided an Array');
    };

    rsvp$enumerator$$Enumerator.prototype._init = function() {
      this._result = new Array(this.length);
    };

    rsvp$enumerator$$Enumerator.prototype._enumerate = function() {
      var length  = this.length;
      var promise = this.promise;
      var input   = this._input;

      for (var i = 0; promise._state === rsvp$$internal$$PENDING && i < length; i++) {
        this._eachEntry(input[i], i);
      }
    };

    rsvp$enumerator$$Enumerator.prototype._eachEntry = function(entry, i) {
      var c = this._instanceConstructor;
      if (rsvp$utils$$isMaybeThenable(entry)) {
        if (entry.constructor === c && entry._state !== rsvp$$internal$$PENDING) {
          entry._onError = null;
          this._settledAt(entry._state, i, entry._result);
        } else {
          this._willSettleAt(c.resolve(entry), i);
        }
      } else {
        this._remaining--;
        this._result[i] = this._makeResult(rsvp$$internal$$FULFILLED, i, entry);
      }
    };

    rsvp$enumerator$$Enumerator.prototype._settledAt = function(state, i, value) {
      var promise = this.promise;

      if (promise._state === rsvp$$internal$$PENDING) {
        this._remaining--;

        if (this._abortOnReject && state === rsvp$$internal$$REJECTED) {
          rsvp$$internal$$reject(promise, value);
        } else {
          this._result[i] = this._makeResult(state, i, value);
        }
      }

      if (this._remaining === 0) {
        rsvp$$internal$$fulfill(promise, this._result);
      }
    };

    rsvp$enumerator$$Enumerator.prototype._makeResult = function(state, i, value) {
      return value;
    };

    rsvp$enumerator$$Enumerator.prototype._willSettleAt = function(promise, i) {
      var enumerator = this;

      rsvp$$internal$$subscribe(promise, undefined, function(value) {
        enumerator._settledAt(rsvp$$internal$$FULFILLED, i, value);
      }, function(reason) {
        enumerator._settledAt(rsvp$$internal$$REJECTED, i, reason);
      });
    };
    function rsvp$promise$all$$all(entries, label) {
      return new rsvp$enumerator$$default(this, entries, true /* abort on reject */, label).promise;
    }
    var rsvp$promise$all$$default = rsvp$promise$all$$all;
    function rsvp$promise$race$$race(entries, label) {
      /*jshint validthis:true */
      var Constructor = this;

      var promise = new Constructor(rsvp$$internal$$noop, label);

      if (!rsvp$utils$$isArray(entries)) {
        rsvp$$internal$$reject(promise, new TypeError('You must pass an array to race.'));
        return promise;
      }

      var length = entries.length;

      function onFulfillment(value) {
        rsvp$$internal$$resolve(promise, value);
      }

      function onRejection(reason) {
        rsvp$$internal$$reject(promise, reason);
      }

      for (var i = 0; promise._state === rsvp$$internal$$PENDING && i < length; i++) {
        rsvp$$internal$$subscribe(Constructor.resolve(entries[i]), undefined, onFulfillment, onRejection);
      }

      return promise;
    }
    var rsvp$promise$race$$default = rsvp$promise$race$$race;
    function rsvp$promise$resolve$$resolve(object, label) {
      /*jshint validthis:true */
      var Constructor = this;

      if (object && typeof object === 'object' && object.constructor === Constructor) {
        return object;
      }

      var promise = new Constructor(rsvp$$internal$$noop, label);
      rsvp$$internal$$resolve(promise, object);
      return promise;
    }
    var rsvp$promise$resolve$$default = rsvp$promise$resolve$$resolve;
    function rsvp$promise$reject$$reject(reason, label) {
      /*jshint validthis:true */
      var Constructor = this;
      var promise = new Constructor(rsvp$$internal$$noop, label);
      rsvp$$internal$$reject(promise, reason);
      return promise;
    }
    var rsvp$promise$reject$$default = rsvp$promise$reject$$reject;

    var rsvp$promise$$guidKey = 'rsvp_' + rsvp$utils$$now() + '-';
    var rsvp$promise$$counter = 0;

    function rsvp$promise$$needsResolver() {
      throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
    }

    function rsvp$promise$$needsNew() {
      throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
    }

    /**
      Promise objects represent the eventual result of an asynchronous operation. The
      primary way of interacting with a promise is through its `then` method, which
      registers callbacks to receive either a promise’s eventual value or the reason
      why the promise cannot be fulfilled.

      Terminology
      -----------

      - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
      - `thenable` is an object or function that defines a `then` method.
      - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
      - `exception` is a value that is thrown using the throw statement.
      - `reason` is a value that indicates why a promise was rejected.
      - `settled` the final resting state of a promise, fulfilled or rejected.

      A promise can be in one of three states: pending, fulfilled, or rejected.

      Promises that are fulfilled have a fulfillment value and are in the fulfilled
      state.  Promises that are rejected have a rejection reason and are in the
      rejected state.  A fulfillment value is never a thenable.

      Promises can also be said to *resolve* a value.  If this value is also a
      promise, then the original promise's settled state will match the value's
      settled state.  So a promise that *resolves* a promise that rejects will
      itself reject, and a promise that *resolves* a promise that fulfills will
      itself fulfill.


      Basic Usage:
      ------------

      ```js
      var promise = new Promise(function(resolve, reject) {
        // on success
        resolve(value);

        // on failure
        reject(reason);
      });

      promise.then(function(value) {
        // on fulfillment
      }, function(reason) {
        // on rejection
      });
      ```

      Advanced Usage:
      ---------------

      Promises shine when abstracting away asynchronous interactions such as
      `XMLHttpRequest`s.

      ```js
      function getJSON(url) {
        return new Promise(function(resolve, reject){
          var xhr = new XMLHttpRequest();

          xhr.open('GET', url);
          xhr.onreadystatechange = handler;
          xhr.responseType = 'json';
          xhr.setRequestHeader('Accept', 'application/json');
          xhr.send();

          function handler() {
            if (this.readyState === this.DONE) {
              if (this.status === 200) {
                resolve(this.response);
              } else {
                reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
              }
            }
          };
        });
      }

      getJSON('/posts.json').then(function(json) {
        // on fulfillment
      }, function(reason) {
        // on rejection
      });
      ```

      Unlike callbacks, promises are great composable primitives.

      ```js
      Promise.all([
        getJSON('/posts'),
        getJSON('/comments')
      ]).then(function(values){
        values[0] // => postsJSON
        values[1] // => commentsJSON

        return values;
      });
      ```

      @class RSVP.Promise
      @param {function} resolver
      @param {String} label optional string for labeling the promise.
      Useful for tooling.
      @constructor
    */
    function rsvp$promise$$Promise(resolver, label) {
      this._id = rsvp$promise$$counter++;
      this._label = label;
      this._state = undefined;
      this._result = undefined;
      this._subscribers = [];

      if (rsvp$config$$config.instrument) {
        rsvp$instrument$$default('created', this);
      }

      if (rsvp$$internal$$noop !== resolver) {
        if (!rsvp$utils$$isFunction(resolver)) {
          rsvp$promise$$needsResolver();
        }

        if (!(this instanceof rsvp$promise$$Promise)) {
          rsvp$promise$$needsNew();
        }

        rsvp$$internal$$initializePromise(this, resolver);
      }
    }

    var rsvp$promise$$default = rsvp$promise$$Promise;

    // deprecated
    rsvp$promise$$Promise.cast = rsvp$promise$resolve$$default;
    rsvp$promise$$Promise.all = rsvp$promise$all$$default;
    rsvp$promise$$Promise.race = rsvp$promise$race$$default;
    rsvp$promise$$Promise.resolve = rsvp$promise$resolve$$default;
    rsvp$promise$$Promise.reject = rsvp$promise$reject$$default;

    rsvp$promise$$Promise.prototype = {
      constructor: rsvp$promise$$Promise,

      _guidKey: rsvp$promise$$guidKey,

      _onError: function (reason) {
        rsvp$config$$config.async(function(promise) {
          setTimeout(function() {
            if (promise._onError) {
              rsvp$config$$config['trigger']('error', reason);
            }
          }, 0);
        }, this);
      },

    /**
      The primary way of interacting with a promise is through its `then` method,
      which registers callbacks to receive either a promise's eventual value or the
      reason why the promise cannot be fulfilled.

      ```js
      findUser().then(function(user){
        // user is available
      }, function(reason){
        // user is unavailable, and you are given the reason why
      });
      ```

      Chaining
      --------

      The return value of `then` is itself a promise.  This second, 'downstream'
      promise is resolved with the return value of the first promise's fulfillment
      or rejection handler, or rejected if the handler throws an exception.

      ```js
      findUser().then(function (user) {
        return user.name;
      }, function (reason) {
        return 'default name';
      }).then(function (userName) {
        // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
        // will be `'default name'`
      });

      findUser().then(function (user) {
        throw new Error('Found user, but still unhappy');
      }, function (reason) {
        throw new Error('`findUser` rejected and we're unhappy');
      }).then(function (value) {
        // never reached
      }, function (reason) {
        // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
        // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
      });
      ```
      If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.

      ```js
      findUser().then(function (user) {
        throw new PedagogicalException('Upstream error');
      }).then(function (value) {
        // never reached
      }).then(function (value) {
        // never reached
      }, function (reason) {
        // The `PedgagocialException` is propagated all the way down to here
      });
      ```

      Assimilation
      ------------

      Sometimes the value you want to propagate to a downstream promise can only be
      retrieved asynchronously. This can be achieved by returning a promise in the
      fulfillment or rejection handler. The downstream promise will then be pending
      until the returned promise is settled. This is called *assimilation*.

      ```js
      findUser().then(function (user) {
        return findCommentsByAuthor(user);
      }).then(function (comments) {
        // The user's comments are now available
      });
      ```

      If the assimliated promise rejects, then the downstream promise will also reject.

      ```js
      findUser().then(function (user) {
        return findCommentsByAuthor(user);
      }).then(function (comments) {
        // If `findCommentsByAuthor` fulfills, we'll have the value here
      }, function (reason) {
        // If `findCommentsByAuthor` rejects, we'll have the reason here
      });
      ```

      Simple Example
      --------------

      Synchronous Example

      ```javascript
      var result;

      try {
        result = findResult();
        // success
      } catch(reason) {
        // failure
      }
      ```

      Errback Example

      ```js
      findResult(function(result, err){
        if (err) {
          // failure
        } else {
          // success
        }
      });
      ```

      Promise Example;

      ```javascript
      findResult().then(function(result){
        // success
      }, function(reason){
        // failure
      });
      ```

      Advanced Example
      --------------

      Synchronous Example

      ```javascript
      var author, books;

      try {
        author = findAuthor();
        books  = findBooksByAuthor(author);
        // success
      } catch(reason) {
        // failure
      }
      ```

      Errback Example

      ```js

      function foundBooks(books) {

      }

      function failure(reason) {

      }

      findAuthor(function(author, err){
        if (err) {
          failure(err);
          // failure
        } else {
          try {
            findBoooksByAuthor(author, function(books, err) {
              if (err) {
                failure(err);
              } else {
                try {
                  foundBooks(books);
                } catch(reason) {
                  failure(reason);
                }
              }
            });
          } catch(error) {
            failure(err);
          }
          // success
        }
      });
      ```

      Promise Example;

      ```javascript
      findAuthor().
        then(findBooksByAuthor).
        then(function(books){
          // found books
      }).catch(function(reason){
        // something went wrong
      });
      ```

      @method then
      @param {Function} onFulfilled
      @param {Function} onRejected
      @param {String} label optional string for labeling the promise.
      Useful for tooling.
      @return {Promise}
    */
      then: function(onFulfillment, onRejection, label) {
        var parent = this;
        var state = parent._state;

        if (state === rsvp$$internal$$FULFILLED && !onFulfillment || state === rsvp$$internal$$REJECTED && !onRejection) {
          if (rsvp$config$$config.instrument) {
            rsvp$instrument$$default('chained', this, this);
          }
          return this;
        }

        parent._onError = null;

        var child = new this.constructor(rsvp$$internal$$noop, label);
        var result = parent._result;

        if (rsvp$config$$config.instrument) {
          rsvp$instrument$$default('chained', parent, child);
        }

        if (state) {
          var callback = arguments[state - 1];
          rsvp$config$$config.async(function(){
            rsvp$$internal$$invokeCallback(state, child, callback, result);
          });
        } else {
          rsvp$$internal$$subscribe(parent, child, onFulfillment, onRejection);
        }

        return child;
      },

    /**
      `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
      as the catch block of a try/catch statement.

      ```js
      function findAuthor(){
        throw new Error('couldn't find that author');
      }

      // synchronous
      try {
        findAuthor();
      } catch(reason) {
        // something went wrong
      }

      // async with promises
      findAuthor().catch(function(reason){
        // something went wrong
      });
      ```

      @method catch
      @param {Function} onRejection
      @param {String} label optional string for labeling the promise.
      Useful for tooling.
      @return {Promise}
    */
      'catch': function(onRejection, label) {
        return this.then(null, onRejection, label);
      },

    /**
      `finally` will be invoked regardless of the promise's fate just as native
      try/catch/finally behaves

      Synchronous example:

      ```js
      findAuthor() {
        if (Math.random() > 0.5) {
          throw new Error();
        }
        return new Author();
      }

      try {
        return findAuthor(); // succeed or fail
      } catch(error) {
        return findOtherAuther();
      } finally {
        // always runs
        // doesn't affect the return value
      }
      ```

      Asynchronous example:

      ```js
      findAuthor().catch(function(reason){
        return findOtherAuther();
      }).finally(function(){
        // author was either found, or not
      });
      ```

      @method finally
      @param {Function} callback
      @param {String} label optional string for labeling the promise.
      Useful for tooling.
      @return {Promise}
    */
      'finally': function(callback, label) {
        var constructor = this.constructor;

        return this.then(function(value) {
          return constructor.resolve(callback()).then(function(){
            return value;
          });
        }, function(reason) {
          return constructor.resolve(callback()).then(function(){
            throw reason;
          });
        }, label);
      }
    };
    var oshpark$connection$$Connection;

    oshpark$connection$$Connection = (function() {
      function Connection(endpointUrl) {
        this.endpointUrl = endpointUrl;
      }

      Connection.prototype.request = function(method, endpoint, params, token) {
        if (params == null) {
          params = {};
        }
        return this._subclassesMustImplement('request');
      };

      Connection.prototype.createUpload = function() {
        return this._subclassesMustImplement('createUpload');
      };

      Connection.prototype.defaultHeaders = function(token) {
        var headers;
        if (token == null) {
          token = null;
        }
        headers = {
          'Accept': 'application/json'
        };
        if (token != null) {
          headers['Authorization'] = token.token;
        }
        return headers;
      };

      Connection.prototype._subclassesMustImplement = function(methodName) {
        return new rsvp$promise$$default(function(resolve, reject) {
          return reject(new Error("Connection subclasses must implement the `" + methodName + "` method."));
        });
      };

      return Connection;

    })();

    var oshpark$connection$$default = oshpark$connection$$Connection;
    var oshpark$jquery_connection$$JQueryConnection,
      oshpark$jquery_connection$$__hasProp = {}.hasOwnProperty,
      oshpark$jquery_connection$$__extends = function(child, parent) { for (var key in parent) { if (oshpark$jquery_connection$$__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

    oshpark$jquery_connection$$JQueryConnection = (function(_super) {
      oshpark$jquery_connection$$__extends(JQueryConnection, _super);

      function JQueryConnection() {
        JQueryConnection.__super__.constructor.apply(this, arguments);
        jQuery.ajaxSetup({
          dataFilter: function(data, type) {
            if (type === 'json' && data === '') {
              return null;
            }
            return data;
          }
        });
      }

      JQueryConnection.prototype.request = function(method, endpoint, params, token) {
        var headers, url;
        if (params == null) {
          params = {};
        }
        headers = this.defaultHeaders(token);
        url = "" + this.endpointUrl + "/" + endpoint;
        return new rsvp$promise$$default(function(resolve, reject) {
          return jQuery.ajax({
            dataType: 'json',
            data: params,
            headers: headers,
            url: url,
            type: method,
            success: function(data) {
              return resolve(data);
            },
            error: function(xhr, textStatus, errorThrown) {
              return reject(errorThrown);
            }
          });
        });
      };

      return JQueryConnection;

    })(oshpark$connection$$default);

    var oshpark$jquery_connection$$default = oshpark$jquery_connection$$JQueryConnection;
    var oshpark$user$$User,
      oshpark$user$$__hasProp = {}.hasOwnProperty,
      oshpark$user$$__extends = function(child, parent) { for (var key in parent) { if (oshpark$user$$__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

    oshpark$user$$User = (function(_super) {
      oshpark$user$$__extends(User, _super);

      function User() {
        return User.__super__.constructor.apply(this, arguments);
      }

      return User;

    })(oshpark$model_with_attributes$$default(['id', 'email', 'name', 'username', 'gravatar_url']));

    var oshpark$user$$default = oshpark$user$$User;
    var oshpark$token$$Token,
      oshpark$token$$__hasProp = {}.hasOwnProperty,
      oshpark$token$$__extends = function(child, parent) { for (var key in parent) { if (oshpark$token$$__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

    oshpark$token$$Token = (function(_super) {
      oshpark$token$$__extends(Token, _super);

      function Token(json) {
        Token.__super__.constructor.call(this, json);
        if (this.userId != null) {
          this.user = new oshpark$user$$default({
            id: this.userId
          });
        }
      }

      return Token;

    })(oshpark$model_with_attributes$$default(['token', 'ttl', 'user_id']));

    var oshpark$token$$default = oshpark$token$$Token;
    var oshpark$image$$Image,
      oshpark$image$$__hasProp = {}.hasOwnProperty,
      oshpark$image$$__extends = function(child, parent) { for (var key in parent) { if (oshpark$image$$__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

    oshpark$image$$Image = (function(_super) {
      oshpark$image$$__extends(Image, _super);

      function Image() {
        return Image.__super__.constructor.apply(this, arguments);
      }

      return Image;

    })(oshpark$model_with_attributes$$default(['thumb_url', 'large_url', 'original_url']));

    var oshpark$image$$default = oshpark$image$$Image;
    var oshpark$layer$$Layer,
      oshpark$layer$$__hasProp = {}.hasOwnProperty,
      oshpark$layer$$__extends = function(child, parent) { for (var key in parent) { if (oshpark$layer$$__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

    oshpark$layer$$Layer = (function(_super) {
      oshpark$layer$$__extends(Layer, _super);

      function Layer() {
        return Layer.__super__.constructor.apply(this, arguments);
      }

      return Layer;

    })(oshpark$model_with_attributes$$default(['id', 'name', 'gerber_file_url', 'image', 'imported_from', 'width_in_mils', 'height_in_mils']));

    var oshpark$layer$$default = oshpark$layer$$Layer;
    var oshpark$project$$Project,
      oshpark$project$$__hasProp = {}.hasOwnProperty,
      oshpark$project$$__extends = function(child, parent) { for (var key in parent) { if (oshpark$project$$__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

    oshpark$project$$Project = (function(_super) {
      oshpark$project$$__extends(Project, _super);

      function Project() {
        return Project.__super__.constructor.apply(this, arguments);
      }

      Project.prototype.topImage = function() {
        if (this.__attrs__.top_image != null) {
          return new oshpark$image$$default(this.__attrs__.top_image, this.client);
        }
      };

      Project.prototype.bottomImage = function() {
        if (this.__attrs__.bottom_image != null) {
          return new oshpark$image$$default(this.__attrs__.bottom_image, this.client);
        }
      };

      Project.prototype.layers = function() {
        var layer, layers, _i, _len, _ref;
        layers = [];
        _ref = this.__attrs__.layers;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          layer = _ref[_i];
          layers.push(new oshpark$layer$$default(layer, this.client));
        }
        return layers;
      };

      Project.prototype.isNew = function() {
        return this.state === 'NEW';
      };

      Project.prototype.isApproved = function() {
        return this.state === 'APPROVED';
      };

      Project.prototype.isAwaitingRemoval = function() {
        return this.state === 'AWAITING_REMOVAL';
      };

      return Project;

    })(oshpark$model_with_attributes$$default(['id', 'design_file_url', 'name', 'description', 'top_image', 'bottom_image', 'width_in_mils', 'pcb_layers', 'state', 'layers']));

    var oshpark$project$$default = oshpark$project$$Project;
    var oshpark$shipping_rate$$ShippingRate,
      oshpark$shipping_rate$$__hasProp = {}.hasOwnProperty,
      oshpark$shipping_rate$$__extends = function(child, parent) { for (var key in parent) { if (oshpark$shipping_rate$$__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

    oshpark$shipping_rate$$ShippingRate = (function(_super) {
      oshpark$shipping_rate$$__extends(ShippingRate, _super);

      function ShippingRate() {
        return ShippingRate.__super__.constructor.apply(this, arguments);
      }

      return ShippingRate;

    })(oshpark$model_with_attributes$$default(['carrier_name', 'service_name', 'price']));

    var oshpark$shipping_rate$$default = oshpark$shipping_rate$$ShippingRate;
    var oshpark$order_item$$OrderItem,
      oshpark$order_item$$__hasProp = {}.hasOwnProperty,
      oshpark$order_item$$__extends = function(child, parent) { for (var key in parent) { if (oshpark$order_item$$__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

    oshpark$order_item$$OrderItem = (function(_super) {
      oshpark$order_item$$__extends(OrderItem, _super);

      function OrderItem() {
        return OrderItem.__super__.constructor.apply(this, arguments);
      }

      return OrderItem;

    })(oshpark$model_with_attributes$$default(['name', 'batches', 'batch_cost', 'sub_total', 'price', 'quantity', 'state', 'confirmed_at', 'panelized_at', 'ordered_at', 'fabbed_at', 'shipped_at', 'project_id', 'order_item_option_selections']));

    var oshpark$order_item$$default = oshpark$order_item$$OrderItem;
    var oshpark$order$$Order,
      oshpark$order$$__hasProp = {}.hasOwnProperty,
      oshpark$order$$__extends = function(child, parent) { for (var key in parent) { if (oshpark$order$$__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

    oshpark$order$$Order = (function(_super) {
      oshpark$order$$__extends(Order, _super);

      function Order() {
        return Order.__super__.constructor.apply(this, arguments);
      }

      Order.prototype.address = function() {
        return new oshpark$address$$default(this.__attrs__.address);
      };

      Order.prototype.shippingRate = function() {
        return new oshpark$shipping_rate$$default(this.__attrs__.shipping_rate);
      };

      Order.prototype.orderItems = function() {
        var orderItem, _i, _len, _ref, _results;
        _ref = this.__attrs__.order_items;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          orderItem = _ref[_i];
          _results.push(new oshpark$order_item$$default(orderItem, this));
        }
        return _results;
      };

      Order.prototype.isEmpty = function() {
        return this.state === 'EMPTY';
      };

      Order.prototype.isNew = function() {
        return this.state === 'NEW';
      };

      Order.prototype.isReceived = function() {
        return this.state === 'RECEIVED';
      };

      Order.prototype.isProcessing = function() {
        return this.state === 'PROCESSING';
      };

      Order.prototype.isShipped = function() {
        return this.state === 'SHIPPED';
      };

      Order.prototype.isCancelled = function() {
        return this.state === 'CANCELLED';
      };

      Order.prototype.isCancellable = function() {
        return this.isEmpty() || this.isNew() || this.isReceived();
      };

      return Order;

    })(oshpark$model_with_attributes$$default(['id', 'board_cost', 'cancellation_reason', 'cancelled_at', 'ordered_at', 'payment_provider', 'payment_received_at', 'project_name', 'quantity', 'shipping_address', 'shipping_cost', 'shipping_country', 'shipping_method', 'shipping_name', 'state', 'total_cost', 'project_id', 'panel_id']));

    var oshpark$order$$default = oshpark$order$$Order;
    var oshpark$panel$$Panel,
      oshpark$panel$$__hasProp = {}.hasOwnProperty,
      oshpark$panel$$__extends = function(child, parent) { for (var key in parent) { if (oshpark$panel$$__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

    oshpark$panel$$Panel = (function(_super) {
      oshpark$panel$$__extends(Panel, _super);

      function Panel() {
        return Panel.__super__.constructor.apply(this, arguments);
      }

      return Panel;

    })(oshpark$model_with_attributes$$default(['id', 'pcb_layers', 'scheduled_order_time', 'expected_receive_time', 'ordered_at', 'received_at', 'state', 'service', 'total_orders', 'total_boards', 'board_area_in_square_mils']));

    var oshpark$panel$$default = oshpark$panel$$Panel;
    var oshpark$upload$$Upload,
      oshpark$upload$$__hasProp = {}.hasOwnProperty,
      oshpark$upload$$__extends = function(child, parent) { for (var key in parent) { if (oshpark$upload$$__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

    oshpark$upload$$Upload = (function(_super) {
      oshpark$upload$$__extends(Upload, _super);

      function Upload() {
        return Upload.__super__.constructor.apply(this, arguments);
      }

      Upload.prototype.isWaiting = function() {
        return this.state === 'WAITING';
      };

      Upload.prototype.isRunning = function() {
        return this.state === 'RUNNING';
      };

      Upload.prototype.isSuccessful = function() {
        return this.state === 'SUCCESS';
      };

      Upload.prototype.hasErrored = function() {
        return this.state === 'ERROR';
      };

      Upload.prototype.hasFailed = function() {
        return this.state === 'FAILED';
      };

      Upload.prototype.isProcessing = function() {
        return this.isWaiting() || this.isRunning();
      };

      Upload.prototype.isFinished = function() {
        return this.isSuccessful() || this.hasErrored() || this.hasFailed();
      };

      return Upload;

    })(oshpark$model_with_attributes$$default(['id', 'state', 'original_filename', 'error_message', 'queued_at', 'started_at', 'completed_at', 'errored_at', 'failed_at', 'project_id']));

    var oshpark$upload$$default = oshpark$upload$$Upload;
    var oshpark$import$$Import,
      oshpark$import$$__hasProp = {}.hasOwnProperty,
      oshpark$import$$__extends = function(child, parent) { for (var key in parent) { if (oshpark$import$$__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

    oshpark$import$$Import = (function(_super) {
      oshpark$import$$__extends(Import, _super);

      function Import() {
        return Import.__super__.constructor.apply(this, arguments);
      }

      Import.prototype.isWaiting = function() {
        return this.state === 'WAITING';
      };

      Import.prototype.isRunning = function() {
        return this.state === 'RUNNING';
      };

      Import.prototype.isSuccessful = function() {
        return this.state === 'SUCCESS';
      };

      Import.prototype.hasErrored = function() {
        return this.state === 'ERROR';
      };

      Import.prototype.hasFailed = function() {
        return this.state === 'FAILED';
      };

      Import.prototype.isProcessing = function() {
        return this.isWaiting() || this.isRunning();
      };

      Import.prototype.isFinished = function() {
        return this.isSuccessful() || this.hasErrored() || this.hasFailed();
      };

      return Import;

    })(oshpark$model_with_attributes$$default(['id', 'state', 'original_url', 'original_filename', 'error_message', 'queued_at', 'started_at', 'completed_at', 'errored_at', 'failed_at', 'project_id']));

    var oshpark$import$$default = oshpark$import$$Import;
    var oshpark$client$$Client, oshpark$client$$argumentPromise, oshpark$client$$attributes_of, oshpark$client$$computeApiKey, oshpark$client$$createResource, oshpark$client$$deleteRequest, oshpark$client$$getRequest, oshpark$client$$lastTimeoutId, oshpark$client$$postRequest, oshpark$client$$putRequest, oshpark$client$$reallyRequestToken, oshpark$client$$refreshToken, oshpark$client$$resource, oshpark$client$$resources;

    oshpark$client$$lastTimeoutId = null;

    oshpark$client$$attributes_of = function(object) {
      if (object.__attrs__ != null) {
        return object.__attrs__;
      } else {
        return object;
      }
    };

    oshpark$client$$postRequest = function(endpoint, params) {
      return this.connection.request('POST', endpoint, params, this.token);
    };

    oshpark$client$$putRequest = function(endpoint, params) {
      return this.connection.request('PUT', endpoint, params, this.token);
    };

    oshpark$client$$getRequest = function(endpoint, params) {
      return this.connection.request('GET', endpoint, params, this.token);
    };

    oshpark$client$$deleteRequest = function(endpoint, params) {
      return this.connection.request('DELETE', endpoint, params, this.token);
    };

    oshpark$client$$reallyRequestToken = function(params) {
      return oshpark$client$$postRequest.call(this, 'sessions', params).then((function(_this) {
        return function(json) {
          var ttl;
          _this.token = new oshpark$token$$default(json['api_session_token'], _this);
          ttl = _this.token.ttl - 10;
          if (ttl < 10) {
            ttl = 10;
          }
          if (oshpark$client$$lastTimeoutId != null) {
            clearTimeout(oshpark$client$$lastTimeoutId);
          }
          oshpark$client$$lastTimeoutId = setTimeout((function() {
            return oshpark$client$$refreshToken.call(_this);
          }), ttl * 1000);
          return _this.token;
        };
      })(this));
    };

    oshpark$client$$refreshToken = function(params) {
      if (params == null) {
        params = {};
      }
      if (this.tokenPromise) {
        return this.tokenPromise.then((function(_this) {
          return function() {
            return oshpark$client$$reallyRequestToken.call(_this, params);
          };
        })(this));
      } else {
        return this.tokenPromise = oshpark$client$$reallyRequestToken.call(this, params);
      }
    };

    oshpark$client$$resources = function(resourcesName, klass, jsonRoot) {
      if (jsonRoot == null) {
        jsonRoot = resourcesName;
      }
      return oshpark$client$$getRequest.call(this, resourcesName).then((function(_this) {
        return function(data) {
          var json, _i, _len, _ref, _results;
          _ref = data[jsonRoot];
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            json = _ref[_i];
            _results.push(new klass(json, _this));
          }
          return _results;
        };
      })(this));
    };

    oshpark$client$$createResource = function(resourcesName, klass, params, jsonRoot) {
      if (params == null) {
        params = {};
      }
      if (jsonRoot == null) {
        jsonRoot = resourcesName;
      }
      return oshpark$client$$postRequest.call(this, resourcesName, params).then((function(_this) {
        return function(data) {
          return new klass(data[jsonRoot], _this);
        };
      })(this));
    };

    oshpark$client$$argumentPromise = function(id, resourceName, argName) {
      if (argName == null) {
        argName = 'id';
      }
      return new rsvp$promise$$default(function(resolve, reject) {
        if (id == null) {
          reject(new Error("must provide an " + argName + " for " + resourceName));
        }
        return resolve(id);
      });
    };

    oshpark$client$$resource = function(resourceName, klass, id, jsonRoot) {
      if (jsonRoot == null) {
        jsonRoot = resourceName;
      }
      return oshpark$client$$argumentPromise(id, resourceName).then((function(_this) {
        return function() {
          return oshpark$client$$getRequest.call(_this, "" + resourceName + "s/" + id);
        };
      })(this)).then((function(_this) {
        return function(data) {
          return new klass(data[jsonRoot], _this);
        };
      })(this));
    };

    oshpark$client$$computeApiKey = function(email, secret) {
      var hash, source;
      source = "" + email + ":" + secret + ":" + this.token.token;
      hash = new jsSHA(source, 'TEXT');
      return hash.getHash('SHA-256', 'HEX');
    };

    oshpark$client$$Client = (function() {
      function Client(_arg) {
        var connection, url, _ref;
        _ref = _arg != null ? _arg : {}, url = _ref.url, connection = _ref.connection;
        if (url == null) {
          url = "https://oshpark.com/api/v1";
        }
        if (connection == null) {
          connection = oshpark$jquery_connection$$default;
        }
        this.connection = new connection(url);
        oshpark$client$$refreshToken.call(this);
      }

      Client.prototype.hasToken = function() {
        return !!this.token;
      };

      Client.prototype.isAuthenticated = function() {
        return this.token && (this.token.user != null);
      };

      Client.prototype.authenticate = function(email, opts) {
        if (opts == null) {
          opts = {};
        }
        return this.tokenPromise.then((function(_this) {
          return function() {
            var params;
            params = {
              email: email
            };
            if (opts.withPassword != null) {
              params.password = opts.withPassword;
            } else if (opts.withApiSecret != null) {
              params.api_key = oshpark$client$$computeApiKey.call(_this, email, opts.withApiSecret);
            } else {
              return reject("Must provide a password or api secret");
            }
            return new rsvp$promise$$default(function(resolve, reject) {
              return oshpark$client$$refreshToken.call(_this, params).then(function(token) {
                if (token.userId != null) {
                  return resolve(token.userId);
                } else {
                  return reject("Incorrect email address or password");
                }
              })["catch"](function(error) {
                return reject(error);
              });
            });
          };
        })(this));
      };

      Client.prototype.projects = function() {
        return oshpark$client$$resources.call(this, 'projects', oshpark$project$$default);
      };

      Client.prototype.project = function(id) {
        return oshpark$client$$resource.call(this, 'project', oshpark$project$$default, id);
      };

      Client.prototype.approveProject = function(id) {
        return oshpark$client$$argumentPromise(id, 'approveProject').then((function(_this) {
          return function() {
            return oshpark$client$$getRequest.call(_this, "projects/" + id + "/approve");
          };
        })(this)).then((function(_this) {
          return function(data) {
            return new oshpark$project$$default(data['project'], _this);
          };
        })(this));
      };

      Client.prototype.deleteProject = function(id) {
        return oshpark$client$$argumentPromise(id, 'deleteProject').then((function(_this) {
          return function() {
            return oshpark$client$$deleteRequest.call(_this, "projects/" + id);
          };
        })(this)).then(function() {
          return true;
        });
      };

      Client.prototype.updateProject = function(id, attrs) {
        if (attrs == null) {
          attrs = {};
        }
        return oshpark$client$$argumentPromise(id, 'updateProject').then((function(_this) {
          return function() {
            return oshpark$client$$putRequest.call(_this, "projects/" + id, {
              project: attrs
            });
          };
        })(this)).then((function(_this) {
          return function(data) {
            return new oshpark$project$$default(data['project'], _this);
          };
        })(this));
      };

      Client.prototype.sharedProjects = function() {
        return oshpark$client$$resources.call(this, 'shared_projects', oshpark$project$$default, 'projects');
      };

      Client.prototype.sharedProject = function(id) {
        return oshpark$client$$resource.call(this, 'shared_project', oshpark$project$$default, id, 'project');
      };

      Client.prototype.priceEstimate = function(width, height, layers, quantity) {
        if (layers == null) {
          layers = 2;
        }
        if (quantity == null) {
          quantity = 3;
        }
        return new rsvp$promise$$default((function(_this) {
          return function(resolve, reject) {
            if (height == null) {
              return reject("Must provide a board height");
            }
            if (width == null) {
              return reject("Must provide a board width");
            }
            return oshpark$client$$postRequest.call(_this, 'pricing', {
              width_in_mils: width,
              height_in_mils: height,
              pcb_layers: layers,
              quantity: quantity
            }).then(resolve, reject);
          };
        })(this));
      };

      Client.prototype.createOrder = function() {
        return oshpark$client$$createResource.call(this, 'orders', oshpark$order$$default, {}, 'order');
      };

      Client.prototype.orders = function() {
        return oshpark$client$$resources.call(this, 'orders', oshpark$order$$default);
      };

      Client.prototype.order = function(id) {
        return oshpark$client$$resource.call(this, 'order', oshpark$order$$default, id);
      };

      Client.prototype.cancelOrder = function(id) {
        return oshpark$client$$argumentPromise(id, 'cancelOrder').then((function(_this) {
          return function() {
            return oshpark$client$$deleteRequest.call(_this, "orders/" + id);
          };
        })(this)).then(function() {
          return true;
        });
      };

      Client.prototype.updateOrder = function(id, attrs) {
        if (attrs == null) {
          attrs = {};
        }
        return oshpark$client$$argumentPromise(id, 'updateOrder').then((function(_this) {
          return function() {
            return oshpark$client$$putRequest.call(_this, "orders/" + id, {
              order: attrs
            });
          };
        })(this)).then((function(_this) {
          return function(data) {
            return new oshpark$order$$default(data['order'], _this);
          };
        })(this));
      };

      Client.prototype.addItemToOrder = function(id, projectId, quantity) {
        if (quantity == null) {
          quantity = 3;
        }
        return oshpark$client$$argumentPromise(id, 'addItemToOrder').then((function(_this) {
          return function() {
            return oshpark$client$$argumentPromise(projectId, 'addItemToOrder', 'projectId');
          };
        })(this)).then((function(_this) {
          return function() {
            return oshpark$client$$postRequest.call(_this, "orders/" + id + "/add_item", {
              order: {
                project_id: projectId,
                quantity: quantity
              }
            });
          };
        })(this)).then((function(_this) {
          return function(data) {
            return new oshpark$order$$default(data['order'], _this);
          };
        })(this));
      };

      Client.prototype.setOrderAddress = function(id, address) {
        return oshpark$client$$argumentPromise(id, 'setOrderAddress').then((function(_this) {
          return function() {
            return oshpark$client$$argumentPromise(address, 'setOrderAddress', 'address').then(function() {
              return oshpark$client$$postRequest.call(_this, "orders/" + id + "/set_address", {
                order: {
                  address: oshpark$client$$attributes_of(address)
                }
              }).then(function(data) {
                return new oshpark$order$$default(data['order'], _this);
              });
            });
          };
        })(this));
      };

      Client.prototype.setOrderShippingRate = function(id, rate) {
        return oshpark$client$$argumentPromise(id, 'setOrderShippingRate').then((function(_this) {
          return function() {
            return oshpark$client$$argumentPromise(rate, 'setOrderShippingRate', 'rate').then(function() {
              return oshpark$client$$postRequest.call(_this, "orders/" + id + "/set_shipping_rate", {
                order: {
                  shipping_rate: oshpark$client$$attributes_of(rate)
                }
              }).then(function(data) {
                return new oshpark$order$$default(data['order'], _this);
              });
            });
          };
        })(this));
      };

      Client.prototype.checkoutOrder = function(id) {
        return oshpark$client$$argumentPromise(id, 'checkoutOrder').then((function(_this) {
          return function() {
            return oshpark$client$$postRequest.call(_this, "orders/" + id + "/checkout").then(function(data) {
              return new oshpark$order$$default(data['order'], _this);
            });
          };
        })(this));
      };

      Client.prototype.shippingRates = function(address) {
        return oshpark$client$$argumentPromise(address, 'shippingRates', 'address').then((function(_this) {
          return function() {
            return oshpark$client$$postRequest.call(_this, "shipping_rates", {
              address: oshpark$client$$attributes_of(address)
            }).then(function(data) {
              var json, _i, _len, _ref, _results;
              _ref = data['shipping_rates'];
              _results = [];
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                json = _ref[_i];
                _results.push(new oshpark$shipping_rate$$default(json, _this));
              }
              return _results;
            });
          };
        })(this));
      };

      Client.prototype.panels = function() {
        return oshpark$client$$resources.call(this, 'panels', oshpark$panel$$default);
      };

      Client.prototype.panel = function(id) {
        return oshpark$client$$resource.call(this, 'panel', oshpark$panel$$default, id);
      };

      Client.prototype.upload = function(id) {
        return oshpark$client$$resource.call(this, 'upload', oshpark$upload$$default, id);
      };

      Client.prototype["import"] = function(id) {
        return oshpark$client$$resource.call(this, 'import', oshpark$import$$default, id);
      };

      Client.prototype.createImport = function(url) {
        return oshpark$client$$argumentPromise(url, 'createImport', 'url').then((function(_this) {
          return function() {
            return oshpark$client$$postRequest.call(_this, 'imports', {
              url: url
            });
          };
        })(this)).then((function(_this) {
          return function(data) {
            return new oshpark$import$$default(data['import'], _this);
          };
        })(this));
      };

      Client.prototype.user = function(id) {
        return oshpark$client$$resource.call(this, 'users', User, id);
      };

      Client.prototype.currentUser = function() {
        return oshpark$client$$resource.call(this, 'users', User, this.token.user);
      };

      Client.prototype.projectFromImport = function(id) {
        var checkImport;
        checkImport = (function(_this) {
          return function(id, resolve, reject) {
            return _this["import"](id).then(function(_import) {
              if (_import.isProcessing()) {
                return window.setTimeout((function() {
                  return checkImport(id, resolve, reject);
                }), 2000);
              } else if (_import.isSuccessful()) {
                return resolve(_this.project(_import.projectId));
              } else {
                return reject(_import);
              }
            });
          };
        })(this);
        return new rsvp$promise$$default((function(_this) {
          return function(resolve, reject) {
            return checkImport(id, resolve, reject);
          };
        })(this));
      };

      return Client;

    })();

    var oshpark$client$$default = oshpark$client$$Client;
    var oshpark$$Oshpark;

    oshpark$$Oshpark = {
      Address: oshpark$address$$default,
      Client: oshpark$client$$default,
      Connection: oshpark$connection$$default,
      Image: oshpark$image$$default,
      Import: oshpark$import$$default,
      JQueryConnection: oshpark$jquery_connection$$default,
      Layer: oshpark$layer$$default,
      Order: oshpark$order$$default,
      OrderItem: oshpark$order_item$$default,
      Panel: oshpark$panel$$default,
      Project: oshpark$project$$default,
      ShippingRate: oshpark$shipping_rate$$default,
      Token: oshpark$token$$default,
      Upload: oshpark$upload$$default,
      User: oshpark$user$$default
    };

    window.Oshpark = oshpark$$Oshpark;

    var oshpark$$default = oshpark$$Oshpark;

    function rsvp$all$settled$$AllSettled(Constructor, entries, label) {
      this._superConstructor(Constructor, entries, false /* don't abort on reject */, label);
    }

    rsvp$all$settled$$AllSettled.prototype = rsvp$utils$$o_create(rsvp$enumerator$$default.prototype);
    rsvp$all$settled$$AllSettled.prototype._superConstructor = rsvp$enumerator$$default;
    rsvp$all$settled$$AllSettled.prototype._makeResult = rsvp$enumerator$$makeSettledResult;
    rsvp$all$settled$$AllSettled.prototype._validationError = function() {
      return new Error('allSettled must be called with an array');
    };

    function rsvp$all$settled$$allSettled(entries, label) {
      return new rsvp$all$settled$$AllSettled(rsvp$promise$$default, entries, label).promise;
    }
    var rsvp$all$settled$$default = rsvp$all$settled$$allSettled;
    function rsvp$all$$all(array, label) {
      return rsvp$promise$$default.all(array, label);
    }
    var rsvp$all$$default = rsvp$all$$all;
    var rsvp$asap$$len = 0;

    function rsvp$asap$$asap(callback, arg) {
      rsvp$asap$$queue[rsvp$asap$$len] = callback;
      rsvp$asap$$queue[rsvp$asap$$len + 1] = arg;
      rsvp$asap$$len += 2;
      if (rsvp$asap$$len === 2) {
        // If len is 1, that means that we need to schedule an async flush.
        // If additional callbacks are queued before the queue is flushed, they
        // will be processed by this flush that we are scheduling.
        rsvp$asap$$scheduleFlush();
      }
    }

    var rsvp$asap$$default = rsvp$asap$$asap;

    var rsvp$asap$$browserWindow = (typeof window !== 'undefined') ? window : undefined;
    var rsvp$asap$$browserGlobal = rsvp$asap$$browserWindow || {};
    var rsvp$asap$$BrowserMutationObserver = rsvp$asap$$browserGlobal.MutationObserver || rsvp$asap$$browserGlobal.WebKitMutationObserver;
    var rsvp$asap$$isNode = typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';

    // test for web worker but not in IE10
    var rsvp$asap$$isWorker = typeof Uint8ClampedArray !== 'undefined' &&
      typeof importScripts !== 'undefined' &&
      typeof MessageChannel !== 'undefined';

    // node
    function rsvp$asap$$useNextTick() {
      var nextTick = process.nextTick;
      // node version 0.10.x displays a deprecation warning when nextTick is used recursively
      // setImmediate should be used instead instead
      var version = process.versions.node.match(/^(?:(\d+)\.)?(?:(\d+)\.)?(\*|\d+)$/);
      if (Array.isArray(version) && version[1] === '0' && version[2] === '10') {
        nextTick = setImmediate;
      }
      return function() {
        nextTick(rsvp$asap$$flush);
      };
    }

    // vertx
    function rsvp$asap$$useVertxTimer() {
      return function() {
        vertxNext(rsvp$asap$$flush);
      };
    }

    function rsvp$asap$$useMutationObserver() {
      var iterations = 0;
      var observer = new rsvp$asap$$BrowserMutationObserver(rsvp$asap$$flush);
      var node = document.createTextNode('');
      observer.observe(node, { characterData: true });

      return function() {
        node.data = (iterations = ++iterations % 2);
      };
    }

    // web worker
    function rsvp$asap$$useMessageChannel() {
      var channel = new MessageChannel();
      channel.port1.onmessage = rsvp$asap$$flush;
      return function () {
        channel.port2.postMessage(0);
      };
    }

    function rsvp$asap$$useSetTimeout() {
      return function() {
        setTimeout(rsvp$asap$$flush, 1);
      };
    }

    var rsvp$asap$$queue = new Array(1000);
    function rsvp$asap$$flush() {
      for (var i = 0; i < rsvp$asap$$len; i+=2) {
        var callback = rsvp$asap$$queue[i];
        var arg = rsvp$asap$$queue[i+1];

        callback(arg);

        rsvp$asap$$queue[i] = undefined;
        rsvp$asap$$queue[i+1] = undefined;
      }

      rsvp$asap$$len = 0;
    }

    function rsvp$asap$$attemptVertex() {
      try {
        var vertx = require('vertx');
        var vertxNext = vertx.runOnLoop || vertx.runOnContext;
        return rsvp$asap$$useVertxTimer();
      } catch(e) {
        return rsvp$asap$$useSetTimeout();
      }
    }

    var rsvp$asap$$scheduleFlush;
    // Decide what async method to use to triggering processing of queued callbacks:
    if (rsvp$asap$$isNode) {
      rsvp$asap$$scheduleFlush = rsvp$asap$$useNextTick();
    } else if (rsvp$asap$$BrowserMutationObserver) {
      rsvp$asap$$scheduleFlush = rsvp$asap$$useMutationObserver();
    } else if (rsvp$asap$$isWorker) {
      rsvp$asap$$scheduleFlush = rsvp$asap$$useMessageChannel();
    } else if (rsvp$asap$$browserWindow === undefined && typeof require === 'function') {
      rsvp$asap$$scheduleFlush = rsvp$asap$$attemptVertex();
    } else {
      rsvp$asap$$scheduleFlush = rsvp$asap$$useSetTimeout();
    }
    function rsvp$defer$$defer(label) {
      var deferred = { };

      deferred['promise'] = new rsvp$promise$$default(function(resolve, reject) {
        deferred['resolve'] = resolve;
        deferred['reject'] = reject;
      }, label);

      return deferred;
    }
    var rsvp$defer$$default = rsvp$defer$$defer;
    function rsvp$filter$$filter(promises, filterFn, label) {
      return rsvp$promise$$default.all(promises, label).then(function(values) {
        if (!rsvp$utils$$isFunction(filterFn)) {
          throw new TypeError("You must pass a function as filter's second argument.");
        }

        var length = values.length;
        var filtered = new Array(length);

        for (var i = 0; i < length; i++) {
          filtered[i] = filterFn(values[i]);
        }

        return rsvp$promise$$default.all(filtered, label).then(function(filtered) {
          var results = new Array(length);
          var newLength = 0;

          for (var i = 0; i < length; i++) {
            if (filtered[i]) {
              results[newLength] = values[i];
              newLength++;
            }
          }

          results.length = newLength;

          return results;
        });
      });
    }
    var rsvp$filter$$default = rsvp$filter$$filter;

    function rsvp$promise$hash$$PromiseHash(Constructor, object, label) {
      this._superConstructor(Constructor, object, true, label);
    }

    var rsvp$promise$hash$$default = rsvp$promise$hash$$PromiseHash;

    rsvp$promise$hash$$PromiseHash.prototype = rsvp$utils$$o_create(rsvp$enumerator$$default.prototype);
    rsvp$promise$hash$$PromiseHash.prototype._superConstructor = rsvp$enumerator$$default;
    rsvp$promise$hash$$PromiseHash.prototype._init = function() {
      this._result = {};
    };

    rsvp$promise$hash$$PromiseHash.prototype._validateInput = function(input) {
      return input && typeof input === 'object';
    };

    rsvp$promise$hash$$PromiseHash.prototype._validationError = function() {
      return new Error('Promise.hash must be called with an object');
    };

    rsvp$promise$hash$$PromiseHash.prototype._enumerate = function() {
      var promise = this.promise;
      var input   = this._input;
      var results = [];

      for (var key in input) {
        if (promise._state === rsvp$$internal$$PENDING && input.hasOwnProperty(key)) {
          results.push({
            position: key,
            entry: input[key]
          });
        }
      }

      var length = results.length;
      this._remaining = length;
      var result;

      for (var i = 0; promise._state === rsvp$$internal$$PENDING && i < length; i++) {
        result = results[i];
        this._eachEntry(result.entry, result.position);
      }
    };

    function rsvp$hash$settled$$HashSettled(Constructor, object, label) {
      this._superConstructor(Constructor, object, false, label);
    }

    rsvp$hash$settled$$HashSettled.prototype = rsvp$utils$$o_create(rsvp$promise$hash$$default.prototype);
    rsvp$hash$settled$$HashSettled.prototype._superConstructor = rsvp$enumerator$$default;
    rsvp$hash$settled$$HashSettled.prototype._makeResult = rsvp$enumerator$$makeSettledResult;

    rsvp$hash$settled$$HashSettled.prototype._validationError = function() {
      return new Error('hashSettled must be called with an object');
    };

    function rsvp$hash$settled$$hashSettled(object, label) {
      return new rsvp$hash$settled$$HashSettled(rsvp$promise$$default, object, label).promise;
    }
    var rsvp$hash$settled$$default = rsvp$hash$settled$$hashSettled;
    function rsvp$hash$$hash(object, label) {
      return new rsvp$promise$hash$$default(rsvp$promise$$default, object, label).promise;
    }
    var rsvp$hash$$default = rsvp$hash$$hash;
    function rsvp$map$$map(promises, mapFn, label) {
      return rsvp$promise$$default.all(promises, label).then(function(values) {
        if (!rsvp$utils$$isFunction(mapFn)) {
          throw new TypeError("You must pass a function as map's second argument.");
        }

        var length = values.length;
        var results = new Array(length);

        for (var i = 0; i < length; i++) {
          results[i] = mapFn(values[i]);
        }

        return rsvp$promise$$default.all(results, label);
      });
    }
    var rsvp$map$$default = rsvp$map$$map;

    function rsvp$node$$Result() {
      this.value = undefined;
    }

    var rsvp$node$$ERROR = new rsvp$node$$Result();
    var rsvp$node$$GET_THEN_ERROR = new rsvp$node$$Result();

    function rsvp$node$$getThen(obj) {
      try {
       return obj.then;
      } catch(error) {
        rsvp$node$$ERROR.value= error;
        return rsvp$node$$ERROR;
      }
    }


    function rsvp$node$$tryApply(f, s, a) {
      try {
        f.apply(s, a);
      } catch(error) {
        rsvp$node$$ERROR.value = error;
        return rsvp$node$$ERROR;
      }
    }

    function rsvp$node$$makeObject(_, argumentNames) {
      var obj = {};
      var name;
      var i;
      var length = _.length;
      var args = new Array(length);

      for (var x = 0; x < length; x++) {
        args[x] = _[x];
      }

      for (i = 0; i < argumentNames.length; i++) {
        name = argumentNames[i];
        obj[name] = args[i + 1];
      }

      return obj;
    }

    function rsvp$node$$arrayResult(_) {
      var length = _.length;
      var args = new Array(length - 1);

      for (var i = 1; i < length; i++) {
        args[i - 1] = _[i];
      }

      return args;
    }

    function rsvp$node$$wrapThenable(then, promise) {
      return {
        then: function(onFulFillment, onRejection) {
          return then.call(promise, onFulFillment, onRejection);
        }
      };
    }

    function rsvp$node$$denodeify(nodeFunc, options) {
      var fn = function() {
        var self = this;
        var l = arguments.length;
        var args = new Array(l + 1);
        var arg;
        var promiseInput = false;

        for (var i = 0; i < l; ++i) {
          arg = arguments[i];

          if (!promiseInput) {
            // TODO: clean this up
            promiseInput = rsvp$node$$needsPromiseInput(arg);
            if (promiseInput === rsvp$node$$GET_THEN_ERROR) {
              var p = new rsvp$promise$$default(rsvp$$internal$$noop);
              rsvp$$internal$$reject(p, rsvp$node$$GET_THEN_ERROR.value);
              return p;
            } else if (promiseInput && promiseInput !== true) {
              arg = rsvp$node$$wrapThenable(promiseInput, arg);
            }
          }
          args[i] = arg;
        }

        var promise = new rsvp$promise$$default(rsvp$$internal$$noop);

        args[l] = function(err, val) {
          if (err)
            rsvp$$internal$$reject(promise, err);
          else if (options === undefined)
            rsvp$$internal$$resolve(promise, val);
          else if (options === true)
            rsvp$$internal$$resolve(promise, rsvp$node$$arrayResult(arguments));
          else if (rsvp$utils$$isArray(options))
            rsvp$$internal$$resolve(promise, rsvp$node$$makeObject(arguments, options));
          else
            rsvp$$internal$$resolve(promise, val);
        };

        if (promiseInput) {
          return rsvp$node$$handlePromiseInput(promise, args, nodeFunc, self);
        } else {
          return rsvp$node$$handleValueInput(promise, args, nodeFunc, self);
        }
      };

      fn.__proto__ = nodeFunc;

      return fn;
    }

    var rsvp$node$$default = rsvp$node$$denodeify;

    function rsvp$node$$handleValueInput(promise, args, nodeFunc, self) {
      var result = rsvp$node$$tryApply(nodeFunc, self, args);
      if (result === rsvp$node$$ERROR) {
        rsvp$$internal$$reject(promise, result.value);
      }
      return promise;
    }

    function rsvp$node$$handlePromiseInput(promise, args, nodeFunc, self){
      return rsvp$promise$$default.all(args).then(function(args){
        var result = rsvp$node$$tryApply(nodeFunc, self, args);
        if (result === rsvp$node$$ERROR) {
          rsvp$$internal$$reject(promise, result.value);
        }
        return promise;
      });
    }

    function rsvp$node$$needsPromiseInput(arg) {
      if (arg && typeof arg === 'object') {
        if (arg.constructor === rsvp$promise$$default) {
          return true;
        } else {
          return rsvp$node$$getThen(arg);
        }
      } else {
        return false;
      }
    }
    function rsvp$race$$race(array, label) {
      return rsvp$promise$$default.race(array, label);
    }
    var rsvp$race$$default = rsvp$race$$race;
    function rsvp$reject$$reject(reason, label) {
      return rsvp$promise$$default.reject(reason, label);
    }
    var rsvp$reject$$default = rsvp$reject$$reject;
    function rsvp$resolve$$resolve(value, label) {
      return rsvp$promise$$default.resolve(value, label);
    }
    var rsvp$resolve$$default = rsvp$resolve$$resolve;
    function rsvp$rethrow$$rethrow(reason) {
      setTimeout(function() {
        throw reason;
      });
      throw reason;
    }
    var rsvp$rethrow$$default = rsvp$rethrow$$rethrow;

    // default async is asap;
    rsvp$config$$config.async = rsvp$asap$$default;
    var rsvp$$cast = rsvp$resolve$$default;
    function rsvp$$async(callback, arg) {
      rsvp$config$$config.async(callback, arg);
    }

    function rsvp$$on() {
      rsvp$config$$config['on'].apply(rsvp$config$$config, arguments);
    }

    function rsvp$$off() {
      rsvp$config$$config['off'].apply(rsvp$config$$config, arguments);
    }

    // Set up instrumentation through `window.__PROMISE_INTRUMENTATION__`
    if (typeof window !== 'undefined' && typeof window['__PROMISE_INSTRUMENTATION__'] === 'object') {
      var rsvp$$callbacks = window['__PROMISE_INSTRUMENTATION__'];
      rsvp$config$$configure('instrument', true);
      for (var rsvp$$eventName in rsvp$$callbacks) {
        if (rsvp$$callbacks.hasOwnProperty(rsvp$$eventName)) {
          rsvp$$on(rsvp$$eventName, rsvp$$callbacks[rsvp$$eventName]);
        }
      }
    }

    var rsvp$umd$$RSVP = {
      'race': rsvp$race$$default,
      'Promise': rsvp$promise$$default,
      'allSettled': rsvp$all$settled$$default,
      'hash': rsvp$hash$$default,
      'hashSettled': rsvp$hash$settled$$default,
      'denodeify': rsvp$node$$default,
      'on': rsvp$$on,
      'off': rsvp$$off,
      'map': rsvp$map$$default,
      'filter': rsvp$filter$$default,
      'resolve': rsvp$resolve$$default,
      'reject': rsvp$reject$$default,
      'all': rsvp$all$$default,
      'rethrow': rsvp$rethrow$$default,
      'defer': rsvp$defer$$default,
      'EventTarget': rsvp$events$$default,
      'configure': rsvp$config$$configure,
      'async': rsvp$$async
    };

    /* global define:true module:true window: true */
    if (typeof define === 'function' && define['amd']) {
      define(function() { return rsvp$umd$$RSVP; });
    } else if (typeof module !== 'undefined' && module['exports']) {
      module['exports'] = rsvp$umd$$RSVP;
    } else if (typeof this !== 'undefined') {
      this['RSVP'] = rsvp$umd$$RSVP;
    }
}).call(this);

//# sourceMappingURL=oshpark.js.map