(function ($) {

  var Core = window.Core || Core || {};

  Core.index = {

    init: function () {
      Core.auth.requireSession();
      Core.index.bindEvents();
      Core.ui.showView();
    },

    bindEvents: function () {
    }
  };

  $(Core.index.init);

  window.Core = Core;

})(jQuery);
