(function(App) {
  App.Views.RegisterModal = Backbone.View.extend({
    template: _.template($('#modal-register-template').html()),
    tagName: 'div',
    className: 'modal fade',
    id: 'modal-register',
    attributes: {
      'tabindex'        : '-1',
      'role'            : 'dialog',
      'aria-labelledby' : 'modal-register-label',
      'data-backdrop'   : 'static'
    },
    events: {
      'click #modal-register-confirm-btn': 'register',
    },
    register: function() {
      this.showSpinner();
      var self  = this;
      var email = $('#modal-register-email').val();
      var name  = $('#modal-register-name').val();
      var pass  = $('#modal-register-pass').val();
      var pass2 = $('#modal-register-pass2').val();

      if (pass == pass2) {
        App.User.register(email, pass, name).error(function(jqXHR, status, err) {
          self.hideSpinner();
          try {
            var json = $.parseJSON(jqXHR.responseText);
            self.$('#modal-register-error span').html(json['error']);
          } catch(err) {
            self.$('#modal-register-error span').html(err);
          }
          self.$('#modal-register-error').show();
        }).done(function(data) {
          self.reset();
          self.hide();
        });
      } else {
        this.hideSpinner();
        this.$('#modal-register-error span').html('Passwords do not match');
        this.$('#modal-register-error').show();
      }
    },
    showSpinner: function() {
      this.$('.modal-footer button').disable(true);
      this.$('.modal-header button').disable(true);
      this.$('#modal-register-error').hide();
      this.$('#modal-register-spinner').show();
    },
    hideSpinner: function() {
      this.$('.modal-footer button').disable(false);
      this.$('.modal-header button').disable(false);
      this.$('#modal-register-error').hide();
      this.$('#modal-register-spinner').hide();
    },
    reset: function() {
      this.hideSpinner();
      this.$('#modal-register-email').val('');
      this.$('#modal-register-name').val('');
      this.$('#modal-register-pass').val('');
      this.$('#modal-register-pass2').val('');
    },
    show: function() {
      this.reset();
      this.$el.modal('show');
    },
    hide: function() {
      this.$el.modal('hide');
    },
    render: function() {
      this.$el.html(this.template());
      this.$('#modal-register-spinner').hide();
      $('#main-modals').append(this.el);
      this.$el.modal({ 'show': false });
      this.delegateEvents();
      return this;
    }
  });

  App.Views.LoginModal = Backbone.View.extend({
    template: _.template($('#modal-login-template').html()),
    tagName: 'div',
    className: 'modal fade',
    id: 'modal-login',
    attributes: {
      'tabindex'        : '-1',
      'role'            : 'dialog',
      'aria-labelledby' : 'modal-login-label',
      'data-backdrop'   : 'static'
    },
    events: {
      'click #modal-login-confirm-btn': 'login',
    },
    showSpinner: function() {
      this.$('.modal-footer button').disable(true);
      this.$('.modal-header button').disable(true);
      this.$('#modal-login-error').hide();
      // this.$('#modal-login-form').hide();
      this.$('#modal-login-spinner').show();
    },
    hideSpinner: function() {
      this.$('.modal-footer button').disable(false);
      this.$('.modal-header button').disable(false);
      this.$('#modal-login-form').show();
      this.$('#modal-login-spinner').hide();
    },
    reset: function() {
      this.hideSpinner();
      this.$('#modal-login-error').hide();
      this.$('#modal-login-email').val('');
      this.$('#modal-login-pass').val('');
    },

    login: function() {
      var self  = this;

      this.showSpinner();

      var email = $('#modal-login-email').val();
      var pass  = $('#modal-login-pass').val();

      if (email.length == 0) {
        this.$('#modal-login-error-email').show();
      }

      if (pass.length == 0) {
        this.$('#modal-login-error-pass').show();
      }

      App.User.login(email, pass).error(function(jqXHR, status, err) {
        self.hideSpinner();
        self.$('#modal-login-error').show();
      }).done(function() {
        self.reset();
      });
    },
    show: function() {
      this.reset();
      this.$el.modal('show');
    },
    hide: function() {
      this.$el.modal('hide');
    },
    render: function() {
      this.$el.html(this.template());
      $('#main-modals').append(this.el);
      this.$el.modal({ 'show': false });
      this.delegateEvents();
      return this;
    }
  });

  /*******************************************
   *  NAVBAR VIEW                            *
   *******************************************/
  App.Views.Navbar = new (Backbone.View.extend({
    template: _.template($('#navbar-template').html()),
    tagName: 'nav',
    className: 'navbar navbar-default main-navigation',
    attributes: {
      role: 'navigation'
    },
    events: {
      'click #navbar-register-btn' : 'showRegisterModal',
      'click #navbar-login-btn'    : 'showLoginModal',
      'click #navbar-logout-btn'   : 'showLogoutSpinner',
    },
    initialize: function() {
      this.subViews = {
        registerModal   : new App.Views.RegisterModal,
        loginModal      : new App.Views.LoginModal
      }

      this.listenTo(App.User, 'login', this.onLogin);
      this.listenTo(App.User, 'register', this.onRegister);
      this.listenTo(App.User, 'logout', this.onLogout);

    },
    showRegisterModal: function() {
      this.subViews.registerModal.show();
    },
    onLogout: function() {
      this.$('#navbar-logout-btn').hide();
      this.$('#navbar-login-btn').show();
      this.$('#navbar-register-btn').show();

      this.$('#navbar-logout-btn').disable(true);
      this.$('#navbar-login-btn').disable(false);
      this.$('#navbar-register-btn').disable(false);
    },
    onRegister: function() {
      this.subViews.registerModal.hide();
    },
    showLoginModal: function() {
      this.subViews.loginModal.show();
    },
    onLogin: function() {
      this.subViews.loginModal.hide();

      this.$('#navbar-login-btn').hide();
      this.$('#navbar-register-btn').hide();

      this.$('#navbar-logout-btn').disable(false);
      this.$('#navbar-login-btn').disable(true);
      this.$('#navbar-register-btn').disable(true);

      this.$('#navbar-logout-btn').show();
    },
    showLogoutSpinner: function() {
      App.User.logout();
    },
    render: function() {
      /* populate the el */
      this.$el.html(this.template());
      /* append el to DOM container */
      $('#navbar-container').html(this.el);
      /* call render on submodules */
      _.invoke(this.subViews, 'render');

      if (App.User.isLoggedIn()) {
        this.$('#navbar-login-btn').hide();
        this.$('#navbar-register-btn').hide();
      } else {
        this.$('#navbar-logout-btn').hide();
      }

      return this;
    }
  }));
  App.Views.Navbar.render();
})(window.App);