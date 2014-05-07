(function ($) {

  var Core = window.Core || Core || {};

  Core.settings = {

    init: function () {
      Core.auth.requireSession();
      Core.settings.bindEvents();
      Core.ui.showView();
    },

    bindEvents: function () {
      $('#logout').on('click', function () {
        Core.auth.logout();
        return false;
      });
      $('#clear-cache-link').on("click", function (e) {
        e.preventDefault();
        var r = confirm("Are you sure you want to clear the cache?");
        if (r == true) {
          Object.keys(localStorage)
            .forEach(function(key){
              if (/^(ekosfera_)/.test(key) && (key != "ekosfera_auth_token" && key != "ekosfera_auth_token_expiration")) {
                localStorage.removeItem(key);
              }
            });
        }
        else {
          return false;
        }
      });
    }

  };

  $(Core.settings.init);

  window.Core = Core;

})(jQuery);
