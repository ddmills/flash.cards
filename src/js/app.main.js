whale.Service ('boat', [], function () {
  var api, shit = 'stuff';
  api = {
    dostuff: function () {
      console.log (shit);
      return shit;
    }
  }

  return api;
});

whale.Factory ('pirate', ['boat'], function (boat) {
  var pirate, drinks;

  drinks = 0;

  pirate = function(greeting) {
    console.log ('hardy har har ' + greeting);
  }

  pirate.prototype = {
    drink: function (num) {
      drinks += num;
      console.log ('on my ' + drinks + ' drink...');
    },

    speak: function () {
      if (drinks < 3) {
        console.log ('yo yo');
      } else {
        console.log ('YO DUDE');
        boat.dostuff ();
      }
    }
  }

  return pirate;
});

var pirate = whale.make ('pirate', 'swagger');
pirate.drink(1);
pirate.speak();

var abe = new whale.Dispatcher;
var linc = new whale.Listener;

linc.listen(abe, 'drink', 'drink', pirate);
linc.listen(abe, 'speak', 'speak', pirate);