(function () {
  /* establish root object (typically window) */
  var root = this;

  /* save previous value of root.whale */
  var previousWhale = root.whale;

  /* safe reference to whale */
  var whale = function (obj) {
    if (obj instanceof whale) return whale;
    if (! (this instanceof whale)) return new whale (obj);
    this._Wrapped = obj;
  };

  /* should probably do checking for node and require */
  root.whale = whale;

  /* current version of whale */
  whale.VERSION = '0.0.1';

  /* offer a no conflict option to remove from root */
  whale.noConflict = function () {
    root.whale = previousWhale;
    return this;
  }

  /* list of registered dependencies */
  var dependencies = {};


  var get = whale.get = function (key) {
    return dependencies[key];
  }

  /* register a dependency */
  var register = whale.register = function (key, value) {
    dependencies[key] = value;
    return dependencies[key];
  }

  /* inject dependencies into a function */
  var inject = whale.inject = function (deps, func, ctx) {
    var args = [];
    ctx = ctx || {};

    /* make sure function was provided for second value */
    if (typeof func !== 'function') {
      throw 'whale inject was not provided with a function to inject to... ' +
            'found "' + (typeof func) + '" instead';
    }

    /* loop through all given dependencies */
    _.each (deps, function (d) {
      /* make sure dependency is registered */
      if (!dependencies[d]) {
        throw 'whale inject cannot resolve given dependency "' + d + '"... ' +
              'could not find it in list registered dependencies';
      }

      /* push dependency value to argument list */
      args.push (dependencies[d]);
    }, this);

    /* return a wrapper to the function with dependencies injected */
    return function () {
      return func.apply (ctx, args.concat (Array.prototype.slice.call (arguments, 0)));
    }
  };

  /* register a Service (initialized on creation with "new") */
  var Service = whale.Service = function (name, deps, func, ctx) {
    return this.register (name, (new (this.inject (deps, func, ctx))));
  }

  /* register a Factory (use to create your own instances with new) */
  var Factory = whale.Factory = function (name, deps, func, ctx) {
    return this.register (name, this.inject (deps, func, ctx)());
  }

  /* register a View (a Factory ) */
  var View = whale.View = function (name, deps, func, ctx) {

  }
}.call (this));