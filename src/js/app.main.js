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
    },

    speak: function () {
      if (drinks < 2) {
        console.log ('yo yo');
      } else {
        console.log ('YO DUDE');
        boat.dostuff ();
      }
    }
  }

  return pirate;
});


whale.View ('loader', ['pirate'], function (pirate) {

});

var pirate = new (whale.get ('pirate'))('yo');
console.log (pirate);
pirate.speak();
pirate.drink(4);
pirate.speak();
