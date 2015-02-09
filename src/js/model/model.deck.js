app.define.factory ('deck_model', [], function (data) {
  var api;

  api = {
    get: function(prop) {
      return data[prop];
    }
  }

  return api;
});