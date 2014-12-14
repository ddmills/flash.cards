(function(App) {
  /*******************************************
   *  EDITOR VIEW                            *
   *******************************************/
  App.Views.Editor = Backbone.View.extend({
    template: _.template($('#view-editor-template').html()),
    initialize: function(id) {
      this.model = new App.Models.Deck({ id: id });
      this.model.set('loaded', false);
      this.model.on('sync', this.loaded, this);
      this.subViews = {
        'header'  : new App.Views.EditorHeader(this.model),
        'newCard' : new App.Views.EditorNewCard(this.model),
        'cards'   : new App.Views.EditorCards(this.model),
        'toolkit' : new App.Views.EditorToolkit(this.model)
      };

      this.model.fetch();
    },

    loading: function() {
      this.model.set('loaded', false);
      this.render();
    },

    loaded: function() {
      this.model.set('loaded', true);
      this.model.get('cards').fetch();
      this.render();
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.subViews.header.$el  = this.$('#view-editor-header');
      this.subViews.newCard.$el = this.$('#view-editor-newCard');
      this.subViews.cards.$el   = this.$('#view-editor-cards');
      this.subViews.toolkit.$el = this.$('#view-editor-toolkit');
      _.each(this.subViews, function(v) { v.render(); });
      return this;
    }
  });

  App.Views.EditorHeader = Backbone.View.extend({
    template: _.template($('#view-editor-header-template').html()),
    initialize: function(model) {
      this.model = model;
    },
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.delegateEvents();
      return this;
    }
  });

  App.Views.EditorNewCard = Backbone.View.extend({
    template: _.template($('#view-editor-newCard-template').html()),
    initialize: function(model) {
      this.model = model;
    },
    events: {
      'click #view-editor-newCard-btn' : 'addCard'
    },
    addCard: function(e) {
      var card = new App.Models.Card({
        front: $('#view-editor-newCard-front').val(),
        back: $('#view-editor-newCard-back').val()
      });

      $('#view-editor-newCard-front-error').html('');
      $('#view-editor-newCard-back-error').html('');




      if (card.isValid()) {
        this.$('.card-editor-curtain').html('<span class="curtain-success">Saving <i class="fa fa-fw fa-cog fa-spin"></i></span>');
        this.$('.card-editor-curtain').addClass('faded');
        this.model.get('cards').create(card, { success: function() {
          $('#view-editor-newCard-front').val(''),
          $('#view-editor-newCard-back').val(''),
          this.$('.card-editor-curtain').removeClass('faded');
          this.$('.card-editor-curtain').html('');

        }});
      } else {
        _.each(card.validationError, function(error) {
          this.$('.card-' + error.name + '-container .card-editor-curtain').html('<span class="curtain-error">' + error.message + '</span>');
        });
      }
    },
    render: function() {
      this.$el.html(this.template());
      this.delegateEvents();
      return this;
    }
  });

  App.Views.EditorCards = Backbone.View.extend({
    template: _.template($('#view-editor-cards-template').html()),
    initialize: function(model) {
      this.model = model;
      this.model.get('cards').on('sync', this.render, this);
    },
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    }
  });

  App.Views.EditorToolkit = Backbone.View.extend({
    template: _.template($('#view-editor-toolkit-template').html()),
    initialize: function(model) {
      this.model = model;
    },
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.delegateEvents();
      return this;
    }
  });
})(window.App);
