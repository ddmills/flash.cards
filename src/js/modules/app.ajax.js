app.defn ('ajax', ['util'], function(util) {
  var api, _ajax;

  /* private AJAX function  */
  _ajax = function (method, options) {
    var def, ep;

    def = new $.Deferred;

    try {
      ep = u.populate_endpoint (options.endpoint);
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

var opts = {
  endpoint: {
    name: 'card',
    parameters: {
      deck_id: '12',
      card_id: '32'
    },
    query: '?private_key=swag'
  }
}

var ajax = app.dependencies.ajax;
ajax.get(opts);