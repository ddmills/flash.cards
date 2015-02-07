var app = {

  dependencies: {},

  register: function (key, value) {
    this.dependencies[key] = value;
    return this.dependencies[key];
  },

  inject: function (deps, func, scope) {
    var args, self;
    self = this;
    args = [];

    _.each (deps, function(d) {
      if (self.dependencies[d]) {
        args.push (self.dependencies[d]);
      } else {
        throw 'inject cannot resolve dependency "' + d + '"';
      }
    });

    return func.apply (scope || {}, args.concat (Array.prototype.slice.call (arguments, 0)));
  },

  defn: function (name, deps, func, scope) {
    return this.register (name, this.inject (deps, func, scope));
  }

}