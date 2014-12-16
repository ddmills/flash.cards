(function(App) {
  /*******************************************
   *  EDITOR VIEW                            *
   *******************************************/
  App.Views.Editor = Backbone.View.extend({
    template: _.template($('#view-editor-template').html()),
    initialize: function(id) {
      this.model = new App.Models.Deck({ deck_id: id });
      this.model.set('loaded', false);
      // this.listenToOnce(this.model, 'sync', this.loaded);

      this.subViews = {
        'header'  : new App.Views.EditorHeader({ model: this.model }),
        'newCard' : new App.Views.EditorNewCard({ model: this.model }),
        'cards'   : new App.Views.EditorCards({ collection: this.model.get('cards') }),
        'toolkit' : new App.Views.EditorToolkit({ model: this.model })
      };

      this.model.fetch({ reset: true });
      this.model.get('cards').fetch({ reset: true });
    },

    // loading: function() {
    //   this.model.set('loaded', false);
    // },
    // loaded: function() {
    //   this.model.set('loaded', true);
    //   this.render();
    //
    // },

    render: function() {
      console.log('RENDERING OVERALL VIEW');
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
    initialize: function() {
      this.listenToOnce(this.model, 'sync', this.render);
    },
    render: function() {
      console.log('RENDER HEADER');
      this.$el.html(this.template(this.model.toJSON()));
      this.delegateEvents();
      return this;
    }
  });

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
            this.$('.card-editor-curtain').removeClass('faded');
            this.$('.card-editor-curtain').html('');
            this.$('#view-editor-newCard-front').focus();
          }
        });
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

  /* Single card edit */
  App.Views.EditorCard = Backbone.View.extend({
    template: _.template($('#view-editor-card-template').html()),
    initialize: function() {
      this.listenTo(this.model, 'sync', this.render);
    },
    events: {
      'click .view-editor-card-delete-btn': 'deleteCard'
    },
    deleteCard: function() {
      var self = this;
      this.$el.slideUp(400, function() {
        self.model.destroy({ wait: true });
        self.remove();
      });
    },
    render: function() {
      console.log('RENDERING CARD');
      this.$el.html(this.template(this.model.toJSON()));
      this.delegateEvents();
      return this;
    }
  });

  /* collection of single-card edit views */
  App.Views.EditorCards = Backbone.View.extend({
    template: _.template($('#view-editor-cards-template').html()),
    initialize: function() {
      // this.listenToOnce(this.collection, 'sync', this.render);
      this.listenTo(this.collection, 'add', this.cardAdded);
      this.listenTo(this.collection, 'reset', this.render);
      this.subViews = {};
    },
    cardRemoved: function(card) {
      console.log('delete: ' + card.id);
    },
    cardAdded: function(card) {
      var cardView = new App.Views.EditorCard({
        parentView: this,
        model: card,
        el: $('<div class="card-editor-bank"></div>')
      });
      this.subViews[card.id] = cardView;
      var el = cardView.$el;
      el.hide();
      this.$('.view-editor-cards-container').prepend(el);
      el.slideDown(400);
    },
    render: function() {
      console.log('RENDERING CARDS');
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
          parentView: self,
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

  App.Views.EditorToolkit = Backbone.View.extend({
    template: _.template($('#view-editor-toolkit-template').html()),
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.delegateEvents();
      return this;
    }
  });
})(window.App);
