app.define.service ('ajax', ['endpoints'], function(endpoints) {
  var api, _ajax;

  /* private AJAX function  */
  _ajax = function (method, options) {
    var def, ep;

    def = new $.Deferred;

    try {
      ep = endpoints.populate (options.endpoint);
      console.log(ep);
    } catch (e) {
      def.reject (e);
      return def.promise();
    }

    return def.promise();
  }


  /* public API for AJAX module */
  var api = {
    get: function (options) {
      return _ajax ('GET', options);
    },

    put: function (options) {
      return _ajax ('PUT', options);
    },

    post: function (options) {
      return _ajax ('POST', options);
    },

    delete: function (options) {
      return _ajax ('DELETE', options);
    }
  }

  return api;

});