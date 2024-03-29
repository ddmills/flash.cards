(function(App) {
  App.User = {
    initialize: function() {
      if (!this.Data) {
        this.Data = {};
      }
      console.log(this.Data);
      // TODO a list of deck IDS should be returned with the user!
    },
    isLoggedIn: function() {
      return this.Data.user_id;
    },
    register: function(email, pass, name) {
      var self = this;
      return $.ajax({
        type: 'POST',
        url: 'api/users/?method=register',
        dataType: 'json',
        data: {
          'email' : email,
          'pass'  : pass,
          'name'  : name
        }
      }).success(function(data) {
        App.User.Data = data;
        self.trigger('register');
        self.trigger('login');
      });
    },
    login: function(email, pass) {
      var self = this;
      return $.ajax({
        type: 'POST',
        url: 'api/users/?method=login',
        datatype: 'json',
        data: {
          'email' : email,
          'pass'  : pass
        }
      }).success(function(data) {
        self.trigger('login')
      });
    },
    logout: function() {
      var self = this;
      return $.ajax({
        type: 'POST',
        url: 'api/users/?method=logout',
        dataType: 'json'
      }).success(function(data) {
        console.log(data);
        App.User.Data = {};
        self.trigger('logout');
      });
    },
  }
  _.extend(App.User, Backbone.Events);
  App.User.initialize();
})(window.App);