(function (root) {
  var dependencies = {};
  root.app = {};

  var default_view_options = [
    'model',
    'container',
    'events',
    'initialize',
    'render'
  ];

  var default_controller_options = [
    'initialize',
  ];

  var default_dispatcher_options = [];

  var default_listener_options = [];


  var View = function (options) {
    this.view_id = _.uniqueId ('view_');
    options || (options = {});
    _.extend (this, _.pick (options, default_view_options));
    this.initialize.apply (this, arguments);
  }

  _.extend (View.prototype, {
    initialize: function () {},
    render: function () { return this; },
  });




  var Controller = function (options) {
    this.controller_id = _.uniqueId ('controller_');
    options || (options = {});
    _.extend (this, _.pick (options, default_controller_options));
    this.initialize.apply (this, arguments);
  }

  _.extend (Controller.prototype, {
    initialize: function () {}
  });

  var Dispatcher = function (options) {
    this.dispatcher_id = _.uniqueId ('dispatcher_');
    options || (options = {});
    _.extend (this, _.pick (options, default_dispatcher_options));
    this.initialize.apply (this, arguments);
  }

  _.extend (Dispatcher.prototype, {
    _listeners: {},
    _events: {},

    _dispatch: function (name, args) {
      if (!this._events[name]) return this;
      _.each (this._events[name], function(listener) {
        listener.action.call (listener.context);
      }, this);
      return this;
    },

    trigger: function () {
      _.each (arguments, this._dispatch, this);
      return this;
    },

    when: function (name, action, context) {
      var events = this._events[name] || (this._events[name] = []);
      context = context || this;
      events.push ({ action: action, context: context });
      return this;
    }
  });


  var Listener = function (options) {
    this.listener_id = _.uniqueId ('listener_');
    options || (options = {});
    _.extend (this, _.pick (options, default_listener_options));
    this.initialize.apply (this, arguments);
  }

  _.extend (Listener.prototype, {
    listen: function (dispatcher, subject, action) {
      var id = dispatcher._dispatcher_id || (dispatcher._dispatcher_id = );
    }
  });


  _.extend (View.prototype, Dispatcher.prototype);
  _.extend (Controller.prototype, Listener.prototype);

  root.app.get = function (key) {
    return dependencies[key];
  }

  root.app.define = {

    register: function (key, value) {
      dependencies[key] = value;
      return dependencies[key];
    },

    inject: function (deps, func, scope) {
      var args = [];

      _.each (deps, function(d) {
        if (dependencies[d]) {
          args.push (dependencies[d]);
        } else {
          throw 'inject cannot resolve dependency "' + d + '"';
        }
      }, this);

      return function() {
        return func.apply (
          scope || {},
          args.concat (
            Array.prototype.slice.call (arguments, 0)
          )
        );
      }
    },

    extend: function (parent, proto, static) {
      var child, surrogate;

      if (proto && _.has (proto, 'constructor')) {
        child = proto.constructor;
      } else {
        child = function () { return parent.apply (this, arguments); };
      }

      _.extend (child, parent, static);

      surrogate = function () { parent.constructor = child; };
      surrogate.prototype = parent.prototype;
      child.prototype = new surrogate;

      if (proto) _.extend (child.prototype, proto);

      child.__super__ = parent.prototype;
      return child;
    },

    service: function (name, deps, func, scope) {
      console.log ('creating service: ' + name);
      return this.register (name, (this.inject (deps, func, scope)) ());
    },

    factory: function (name, deps, func, scope) {
      console.log ('creating factory: ' + name);
      return this.register (name, this.inject (deps, func, scope));
    },

    view: function (name, deps, func, scope) {
      console.log ('creating view: ' + name);
      return this.register (name, this.extend (View, this.inject (deps, func, scope) ()));
    },

    controller: function (name, deps, func, scope) {
      console.log ('creating controller: ' + name);
      var inj = this.inject (deps, func, scope);
      if (typeof func === 'function') {
        return this.register (name, this.extend (Controller, inj()));
      } else {
        return this.register (name, this.extend (Controller, inj));
      }
    },

  }
})(window);

_.templateSettings = {
  evaluate    : /\{\{([\s\S]+?)\}\}/g,
  interpolate : /\{\{=([\s\S]+?)\}\}/g,
  escape      : /\{\{-([\s\S]+?)\}\}/g
};

_.mixin({
  getTemplate: function(string) {
    return this.template($(string).html());
  }
});

$.fn.extend({
  $: function(string) { return this.find(string); }
});