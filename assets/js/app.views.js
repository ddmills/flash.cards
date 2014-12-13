(function(App) {
  App.Views = {
    /*******************************************
     *  LANDING VIEW                           *
     *******************************************/
    Landing: Backbone.View.extend({
      initialize: function() {
        this.template = _.template($('#view-landing-template').html());
      },

      render: function() {
        this.$el.html(this.template());
        return this;
      },
    }),

    /*******************************************
     *  CREATE DECK VIEW                       *
     *******************************************/
    Create: Backbone.View.extend({
      initialize: function() {
        this.model = new App.Models.Deck;
        this.binder = new Backbone.ModelBinder;
        this.template = _.template($('#view-create-template').html());
      },

      events: {
        'click #submit-create-deck': 'submit'
      },

      render: function() {
        this.$el.html(this.template());
        this.binder.bind(this.model, this.el);
        return this;
      },

      submit: function() {
        if (this.model.isValid()) {
          this.model.save(null, { success: function(data) {
            var public_key = data.get('deck_id');
            var private_key = data.get('private_key');
            App.Local.addDeck(public_key, private_key);
            data.unset('private_key');
            App.Router.navigate('edit/' + public_key, { trigger: true });
          }});
        } else {
          $('#help-deck-name').html(this.model.validationError);
        }
      },

      onClose: function() {
        this.binder.unbind();
      }
    }),

    /*******************************************
     *  RESTRICTED DECK EDIT VIEW              *
     *******************************************/
    Restricted: Backbone.View.extend({
      template: _.template($('#view-restricted-template').html()),
      render: function() { this.$el.html(this.template()); }
    }),

    /*******************************************
     *  EDITOR VIEW                            *
     *******************************************/
    Editor: Backbone.View.extend({
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
    }),

    EditorHeader: Backbone.View.extend({
      template: _.template($('#view-editor-header-template').html()),
      initialize: function(model) {
        this.model = model;
      },
      render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        this.delegateEvents();
        return this;
      }
    }),

    EditorNewCard: Backbone.View.extend({
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
    }),

    EditorCards: Backbone.View.extend({
      template: _.template($('#view-editor-cards-template').html()),
      initialize: function(model) {
        this.model = model;
        this.model.get('cards').on('sync', this.render, this);
      },
      render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
      }
    }),

    EditorToolkit: Backbone.View.extend({
      template: _.template($('#view-editor-toolkit-template').html()),
      initialize: function(model) {
        this.model = model;
      },
      render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        this.delegateEvents();
        return this;
      }
    }),
  }
})(window.App);
