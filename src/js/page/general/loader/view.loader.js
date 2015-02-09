app.define.view ('loader_view', [], function (options) {
  var api, default_opts, template, type, size, html;

  default_opts = {
    icon  : 'cog',
    size  : '1x',
    style : 'spin',
    show  : true
  }

  container = $('<span class="_loader">');

  html = '<i class="fa fa-{{- style }} fa-{{- icon }} fa-{{- size }}"></i> loading&hellip;';

  template = _.template (html);

  options || (options = {});

  _.defaults (options, default_opts);

  api = {

    replace: function(cont) {
      this.render ();
      this.show ();
      cont.html (container);
      return this;
    },

    show: function () {
      container.addClass ('_loader-show');
      return this;
    },

    hide: function () {
      container.removeClass ('_loader-show');
      return this;
    },

    render: function () {
      container.html (template (options));
      return this;
    }
  }

  return api;
});