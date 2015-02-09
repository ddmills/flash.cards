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

var cont = new (app.get('create_deck_controller'))('some initial stuff');

cont.initialize('test');
//
//
// var ajax = define.get('ajax');
// ajax.get(opts);