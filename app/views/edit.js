(function(App) {
  /*******************************************
   *  EDITOR VIEW                            *
   *******************************************/
  App.Views.Editor = Backbone.View.extend({
    template: _.template($('#view-editor-template').html()),
    initialize: function(id) {
      this.model = new App.Models.Deck({ deck_id: id });
      this.model.set('loaded', false);
      this.subViews = {
        'header'  : new App.Views.EditorHeader({ model: this.model }),
        'newCard' : new App.Views.EditorNewCard({ model: this.model }),
        'cards'   : new App.Views.EditorCards({ collection: this.model.get('cards') }),
        'toolkit' : new App.Views.EditorToolkit({ model: this.model })
      };
      this.model.fetch({ reset: true });
      this.model.get('cards').fetch({ reset: true });
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

  /* EDITOR HEADER VIEW */
  App.Views.EditorHeader = Backbone.View.extend({
    template: _.template($('#view-editor-header-template').html()),
    initialize: function() {
      this.listenToOnce(this.model, 'sync', this.render);
    },
    events: {
      'click .rename-deck-btn'             : 'renameDeck',
      'click .delete-deck-btn'             : 'deleteDeck',
      'click .edit-deck-description-btn'   : 'editDescription',
      'click .save-deck-description-btn'   : 'saveDescription',
      'click .cancel-deck-description-btn' : 'cancelDescription',
    },
    renameDeck: function(e) {

    },
    deleteDeck: function(e) {
      var c = confirm('Are you really sure you want to delete this deck? It cannot be undone.');
      if (c) {
        this.model.destroy();
        App.Router.navigate('deleted', { trigger: true });
      }
    },
    editDescription: function(e) {
      this.$('.meta-deck-description').addClass('open');
      this.$('.edit-deck-description').focus();
    },
    saveDescription: function(e) {
      var self = this;
      this.model.set('description', this.$('.edit-deck-description').val());
      this.$('.edit-deck-description').disable(true);
      this.$('.save-deck-description-btn').disable(true);
      this.$('.cancel-deck-description-btn').disable(true);
      this.$('.save-deck-description-btn').html('Saving <i class="fa fa-cog fa-fw fa-spin"></i>');
      this.model.save([], { success: function() {
        self.render();
      }});
    },
    'cancelDescription': function(e) {
      this.$('.meta-deck-description').removeClass('open');
      this.$('.edit-deck-description').val(this.model.get('description'));
    },
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.delegateEvents();
      return this;
    }
  });

  /* EDITOR NEW-CARD VIEW */
  App.Views.EditorNewCard = Backbone.View.extend({
    template: _.template($('#view-editor-newCard-template').html()),
    events: {
      'click #view-editor-newCard-btn' : 'addCard'
    },
    addCard: function(e) {
      var card = new App.Models.Card({
        front: $('#view-editor-newCard-front').val(),
        back: $('#view-editor-newCard-back').val(),
        deck_id: this.model.get('deck_id')
      });

      if (card.isValid()) {
        card.private_key = this.model.private_key;
        /* add saving curtains */
        this.$('.card-editor-curtain').html('<span class="curtain-success">Saving <i class="fa fa-fw fa-cog fa-spin"></i></span>');
        /* disable the inputs */
        this.$('.card-editor').disable(true);
        this.$('#view-editor-newCard-btn').disable(true);

        /* add card to collection and save to database */
        this.model.get('cards').create(card, {
          wait: true,
          success: function() {
            this.$('.card-editor').disable(false);
            this.$('#view-editor-newCard-btn').disable(false);
            this.$('#view-editor-newCard-front').val(''),
            this.$('#view-editor-newCard-back').val(''),
            this.$('.card-editor-curtain').html('');
            this.$('#view-editor-newCard-front').focus();
          }
        });
      } else {
        var self = this;
        _.each(card.validationError, function(error) {
          self.$('.card-' + error.name + '-container .card-editor-curtain').html('<span class="curtain-error"> <i class="fa fa-fw fa-warning"></i> ' + error.message + '</span>');
        });
      }
    },
    render: function() {
      this.$el.html(this.template());
      this.delegateEvents();
      return this;
    }
  });

  /* EDITOR ALL-CARDS VIEW */
  App.Views.EditorCards = Backbone.View.extend({
    template: _.template($('#view-editor-cards-template').html()),
    initialize: function() {
      this.listenTo(this.collection, 'add', this.cardAdded);
      this.listenTo(this.collection, 'reset', this.render);
      this.subViews = {};
    },
    cardAdded: function(card) {
      var cardView = new App.Views.EditorCard({
        model: card,
        el: $('<div class="card-editor-bank"></div>')
      });
      this.subViews[card.id] = cardView;
      var el = cardView.render().$el;
      el.hide();
      this.$('.view-editor-cards-container').prepend(el);
      el.slideDown(400);
    },
    render: function() {
      this.$el.html(this.template({ cards: this.collection.toJSON() }));
      var self = this;
      this.subViews = {};

      /* Create a single fragment instead of immediately appending to the DOM,
       * If we were to append each model in the collection to the DOM, it would
       * cause a reflow each time. Instead, render all models in a fragment
       * first, and then render the fragment once. */
      var fragment = document.createDocumentFragment();

      _.each(this.collection.toArray().reverse(), function(card) {
        card.private_key = self.collection.deck.private_key;
        var cardView = new App.Views.EditorCard({
          model: card,
          el: $('<div class="card-editor-bank"></div>')
        });
        self.subViews[card.get('card_id')] = cardView;
        fragment.appendChild(cardView.render().el);
      });

      /* append entire fragment */
      this.$('.view-editor-cards-container').html(fragment);
      this.delegateEvents();
      return this;
    }
  });

  /* EDITOR SINGLE-CARD VIEW */
  App.Views.EditorCard = Backbone.View.extend({
    template: _.template($('#view-editor-card-template').html()),
    initialize: function() {
      this.listenTo(this.model, 'error', this.serverError);
      this.templates = {
        saved    : '<span class="curtain-success curtain-saved">Saved <i class="fa fa-fw fa-check"></i></span>',
        saving   : '<span class="curtain-success">Saving <i class="fa fa-fw fa-cog fa-spin"></i></span>',
        deleting : '<span class="curtain-error">deleting <i class="fa fa-fw fa-cog fa-spin"></i></span>',
        server   : '<span class="curtain-error"> <i class="fa fa-fw fa-warning"></i> The server encountered an error. Please Try again later. </span>',
        invalid  : _.template('<span class="curtain-error"> <i class="fa fa-fw fa-warning"></i> <%= message %></span>')
      }
    },
    events: {
      'click .view-editor-card-delete-btn': 'deleteCard',
      'change .card-front-container .card-editor': 'updateCardFront',
      'change .card-back-container .card-editor': 'updateCardBack',
    },
    invalidated: function(e) {
      console.log(this.model.validationError);
      var self = this;
      _.each (this.model.validationError, function(error) {
        self.$('.card-' + error.name + '-container .card-editor-curtain').html('<span class="curtain-error"> <i class="fa fa-fw fa-warning"></i> ' + error.message + '</span>');
      });
    },
    serverError: function(e) {
      this.$('.card-' + error.name + '-container .card-editor-curtain').html(this.templates.server);
    },
    updateCardFront: function(e) {
      var editor = this.$('.card-front-container .card-editor');
      var curtain = this.$('.card-front-container .card-editor-curtain');
      var front = editor.val();
      var self = this;
      this.model.set('front', front);
      if (this.model.isValid()) {
        curtain.html(self.templates.saving);
        editor.disable(true);
        this.model.save([], {
          success: function() {
            editor.disable(false);
            curtain.html(self.templates.saved);
            setTimeout(function() {
              self.$('.card-front-container .curtain-saved').fadeOut(1000);
            }, 1500);
          }, error: function(e) {
            this.$('.card-front-container .card-editor-curtain').html(this.templates.server);
          }});
      } else {
        _.each (this.model.validationError, function(error) {
          if (error.name == 'front') {
            self.$('.card-front-container .card-editor-curtain').html(self.templates.invalid(error));
          }
        });
      }
    },
    updateCardBack: function(e) {
      var editor = this.$('.card-back-container .card-editor');
      var curtain = this.$('.card-back-container .card-editor-curtain');
      var back = editor.val();
      var self = this;
      this.model.set('back', back);
      if (this.model.isValid()) {
        curtain.html(self.templates.saving);
        editor.disable(true);
        this.model.save([], {
          success: function() {
            editor.disable(false);
            curtain.html(self.templates.saved);
            setTimeout(function() {
              self.$('.card-back-container .curtain-saved').fadeOut(1000);
            }, 1500);
          }, error: function(e) {
            this.$('.card-back-container .card-editor-curtain').html(this.templates.server);
          }});
        } else {
          _.each (this.model.validationError, function(error) {
            if (error.name == 'back') {
              self.$('.card-back-container .card-editor-curtain').html(self.templates.invalid(error));
            }
          });
        }
    },
    deleteCard: function() {
      var self = this;
      self.$('.card-editor').disable(true);
      self.$('.card-editor-curtain').html(this.templates.deleting);
      self.model.destroy({ wait: true, success: function() {
        self.$el.slideUp(400, function() {
          self.remove();
        });
      }});
    },
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.delegateEvents();
      return this;
    }
  });

  /* EDITOR TOOLKIT VIEW */
  App.Views.EditorToolkit = Backbone.View.extend({
    template: _.template($('#view-editor-toolkit-template').html()),
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.delegateEvents();
      return this;
    }
  });
})(window.App);
