(function(App) {
  App.Views.RegisterModal = Backbone.View.extend({
    template: _.template($('#modal-register-template').html()),
    tagName: 'div',
    className: 'modal fade',
    id: 'modal-register',
    attributes: {
      'tabindex'        : '-1',
      'role'            : 'dialog',
      'aria-labelledby' : 'modal-register-label'
    },
    events: {
      'click #modal-register-confirm-btn': 'register',
    },
    register: function() {
      console.log('confirm registration');
    },
    show: function() {
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
      'click #navbar-register-btn': 'showRegisterModal',
      'click #navbar-login-btn': 'showLoginModal',
    },
    initialize: function() {
      this.subViews = {
        registerModal: new App.Views.RegisterModal
      }
    },
    showRegisterModal: function() {
      this.subViews.registerModal.show();
    },
    showLoginModal: function() {

    },
    render: function() {
      /* populate the el */
      this.$el.html(this.template());
      /* append el to DOM container */
      $('#navbar-container').html(this.el);
      this.subViews.registerModal.render();
      return this;
    }
  }));

  App.Views.Navbar.render();
})(window.App);