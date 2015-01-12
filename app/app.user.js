(function(App) {
  App.User = {
    initialize: function() {

    },
    register: function(email, pass, name, callback) {
      $.ajax({
        type: 'POST',
        url: 'api/users/?method=register',
        dataType: 'json',
        data: {
          'email' : email,
          'pass'  : pass,
          'name'  : name
        }
      }).done(function(data) {
        console.log(data);
        if (callback) {
          callback(data);
        }
      });
    },
    login: function(email, pass, callback) {
      $.ajax({
        url: 'api/users/?method=login'
      }).done(function(data) {
        if (callback) {
          callback(data);
        }
      });
    }
  }
  App.User.initialize();
})(window.App);