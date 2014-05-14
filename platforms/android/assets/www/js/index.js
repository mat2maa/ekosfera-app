(function ($) {

  var Core = window.Core || Core || {};

  Core.index = {

    init: function () {
      Core.auth.requireSession();
      Core.index.bindEvents();
      Core.ui.showView();
    },

    bindEvents: function () {
      $('#logout').on('click', function () {
        Core.auth.logout();
        return false;
      });
    }
  };

  $(Core.index.init);

  window.Core = Core;

})(jQuery);
