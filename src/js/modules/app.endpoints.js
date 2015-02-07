module ('endpoints', [], function() {
  var endpoints, api;

  endpoints = {
    'users'  : 'api/users/',
    'user'   : 'api/users/{id}/',
    'decks'  : 'api/decks/',
    'cards'  : 'api/decks/{deck_id}/cards/',
    'card'   : 'api/decks/{deck_id}/cards/{card_id}/',
    'recent' : 'api/decks/recent/'
  };

  api = {
    /* fill in endpoint.name with endpoint.parameters */
    populate: function (endpoint) {
      var reg, ep, replacer;

      /* regex to match curly braces */
      reg = /{([^}]+)}/g;

      if (!endpoint.name) {
        throw 'endpoint variable "name" was not provided';
      }

      /* the endpoint we're converting */
      if (! (ep = endpoints[endpoint.name])) {
        throw 'endpoint "' + endpoint.name + '" doesn\'t exist';
      }

      /* determines how to replace variable */
      replacer = function (part, name) {
        if (!endpoint.parameters) {
          throw 'provided endpoing is missing "parameters" object';
        }

        if (endpoint.parameters[name]) {
          return endpoint.parameters[name];
        } else {
          throw 'endpoint parameters must contain variable "' + name + '"';
        }
      }

      /* run regex with replacer method on endpoint */
      ep = ep.replace (reg, replacer);

      /* attach optional additonal query string */
      endpoint.query && (ep += endpoint.query);

      return ep;
    }
  }

  return api;
});