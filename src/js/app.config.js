(function (root) {

  var default_view_options = [
    'model',
    'container',
    'events',
    'initialize',
    'render'
  ];

  var default_cont_options = [
    'initialize',
  ];

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

  var Cont = function (options) {
    this.view_id = _.uniqueId ('cont_');
    options || (options = {});
    _.extend (this, _.pick (options, default_cont_options));
    this.initialize.apply (this, arguments);
  }

  _.extend (Cont.prototype, {
    initialize: function () {}
  });

  var dependencies = {};

  root.app = {};

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
        return this.register (name, this.extend (Cont, inj()));
      } else {
        return this.register (name, this.extend (Cont, inj));
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