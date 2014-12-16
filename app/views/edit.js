(function(App) {
  /*******************************************
   *  EDITOR VIEW                            *
   *******************************************/
  App.Views.Editor = Backbone.View.extend({
    template: _.template($('#view-editor-template').html()),
    initialize: function(id) {
      this.model = new App.Models.Deck({ deck_id: id });
      this.model.set('loaded', false);
      this.listenToOnce(this.model, 'sync', this.loaded);
      this.subViews = {
        'header'  : new App.Views.EditorHeader(this.model),
        'newCard' : new App.Views.EditorNewCard(this.model),
        'cards'   : new App.Views.EditorCards({ collection: this.model.get('cards') }),
        'toolkit' : new App.Views.EditorToolkit(this.model)
      };
      // this.model.fetch();
    },

    loading: function() {
      this.model.set('loaded', false);
    },
    loaded: function() {
      this.model.set('loaded', true);
      this.model.get('cards').fetch();
    },

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

      if (card.isValid()) {
        /* add saving curtains */
        this.$('.card-editor-curtain').html('<span class="curtain-success">Saving <i class="fa fa-fw fa-cog fa-spin"></i></span>');
        /* disable the inputs */
        this.$('.card-editor').disable(true);
        this.$('#view-editor-newCard-btn').disable(true);

        /* add card to collection and save to database */
        this.model.get('cards').create(card, { success: function() {
          this.$('.card-editor').disable(false);
          this.$('#view-editor-newCard-btn').disable(false);
          this.$('#view-editor-newCard-front').val(''),
          this.$('#view-editor-newCard-back').val(''),
          this.$('.card-editor-curtain').removeClass('faded');
          this.$('.card-editor-curtain').html('');
          this.$('#view-editor-newCard-front').focus();
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

  /* Single card edit */
  App.Views.EditorCard = Backbone.View.extend({
    template: _.template($('#view-editor-card-template').html()),
    initialize: function() {
      this.listenTo(this.model, 'sync', this.render);
      this.listenTo(this.model, 'destroy', this.remove);
      // console.log('cardd');
      // console.log(this.model);
    },
    remove: function() {
      console.log('im being removed');
      this.disable();
    },
    disable: function() {
      console.log('disable this element ' + this.model.get('card_id'));
    },
    render: function() {
      console.log('RENDERING CARD');
      // console.log(this.model);
      this.$el.html(this.template(this.model.toJSON()));
      // this.delegateEvents();
      return this;
    }
  });

  /* collection of single-card edit views */
  App.Views.EditorCards = Backbone.View.extend({
    template: _.template($('#view-editor-cards-template').html()),
    initialize: function() {
      this.listenToOnce(this.collection, 'sync', this.render);
      this.subViews = {};
    },
    events: {
      'click .view-editor-card-delete-btn': 'remove'
    },
    remove: function(e) {
      // console.log(this.model);
      var card = this.model.get($(e.target).data('cardid'));
      // this.subViews[card_id].disable();
      // console.log(card);
      this.model.remove(card);
      // this.model.sync();
    },
    render: function() {
      console.log('RENDERING CARDS');
      console.log(this);
      console.log(this.collection.models);
      // console.log(this.collection.toJSON());
      // this.collection.each(function(f) { console.log(f.toJSON()); });

      this.$el.html(this.template({ cards: this.collection.toJSON() }));

      /* Create a single fragment instead of immediately appending to the DOM,
       * If we were to append each model in the collection to the DOM, it would
       * cause a reflow each time. Instead, render all models in a fragment
       * first, and then render the fragment once. */
      var fragment = document.createDocumentFragment();
      // this.collection.each(function(c) {
      //   console.log('card: ');
      //   console.log(c.get('front'));
        // var cardView = new App.Views.EditorCard({
        //   parentView: this,
        //   model: c,
        //   el: $('<div class="card-editor-bank"></div>')
        // });
        // this.subViews[card.get('card_id')] = card;
        // fragment.appendChild(cardView.render().el);
      // });

      /* append entire fragment */
      this.$('.view-editor-cards-container').html(fragment);
      this.delegateEvents();
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
