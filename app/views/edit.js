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
        'cards'   : new App.Views.EditorCards(this.model.get('cards')),
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

      if (card.isValid()) {
        /* add saving curtains */
        this.$('.card-editor-curtain').html('<span class="curtain-success">Saving <i class="fa fa-fw fa-cog fa-spin"></i></span>');
        /* disable the inputs */
        this.$('.card-editor').disable(true);
        this.$('#view-editor-newCard-btn').disable(true);
        console.log(this.$('.card-editor'));
        /* add card to collection and save to database */
        this.model.get('cards').create(card, { success: function() {
          this.$('.card-editor').disable(false);
          this.$('#view-editor-newCard-btn').disable(false);
          this.$('.card-editor').val(''),
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
      // this.model = model;
      this.listenTo(this.model, 'all', this.render);
    },
    events: {

    },
    render: function() {
      console.log('rendering card');
      this.$el.html(this.template(this.model.toJSON()));
      this.$('.card-front-container .card-editor').val(this.model.get('front'));
      this.delegateEvents();
      return this;
    }
  });

  /* collection of single-card edit views */
  App.Views.EditorCards = Backbone.View.extend({
    template: _.template($('#view-editor-cards-template').html()),
    initialize: function(model) {
      this.model = model;
      this.listenToOnce(this.model, 'sync', this.render);
    },
    render: function() {
      console.log('renderin');
      this.$el.html(this.template({ cards: this.model.toJSON() }));

      /* Create a single fragment instead of immediately appending to the DOM,
       * If we were to append each model in the collection to the DOM, it would
       * cause a reflow each time. Instead, render all models in a fragment
       * first, and then render the fragment once. */
      var fragment = document.createDocumentFragment();
      _.each(this.model.toArray().reverse(), function(card) {
        var cardView = new App.Views.EditorCard({
          model: card,
          el: $('<div class="card-editor-bank"></div>')
        });
        fragment.appendChild(cardView.render().el);
      });

      /* append entire fragment */
      this.$('.view-editor-cards-container').html(fragment);
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
