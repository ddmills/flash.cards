(function(App) {
  App.User = {
    initialize: function() {
      // this.logout();
      // this.login('sw@swag.com', 'swag');
      if (!this.Data) {
        this.Data = {};
      }
    },
    isLoggedIn: function() {

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
        App.User.Data = data;
        if (callback) {
          callback(data);
        }
      });
    },
    login: function(email, pass, callback) {
      $.ajax({
        type: 'POST',
        url: 'api/users/?method=login',
        datatype: 'json',
        data: {
          'email' : email,
          'pass'  : pass
        }
      }).done(function(data) {
        if (callback) {
          callback(data);
        }
      });
    },
    logout: function(callback) {
      var self = this;
      $.ajax({
        type: 'POST',
        url: 'api/users/?method=logout',
        dataType: 'json'
      }).done(function(data) {
        console.log(data);
        App.User.Data = {};
        if (callback) {
          callback(data);
        }
      });
    }
  }
  App.User.initialize();
})(window.App);