(function ($) {

  var Core = window.Core || Core || {};

  Core.login = {

    init: function () {
      Core.auth.requireNoSession();
      Core.ui.showView();
      Core.login.bindEvents();
    },

    bindEvents: function () {
      $('#login').on('submit', function () {
        Core.login.authenticate.onSubmit($(this));
        return false;
      });

      $('#user_session_submit').on('click', function () {
        var form_obj = $(this).closest('form');
        Core.login.authenticate.onSubmit(form_obj);
        return false;
      });

    },

    authenticate: {
      onSubmit: function (form_obj) {
        var ajax_url = form_obj.attr('action'),
          email = $('#login').serializeObject().user.email,
          password = $('#login').serializeObject().user.password;
        Core.api.submit(ajax_url, email, password,
          {
            onSuccess: Core.login.authenticate.onSuccess,
            onError: Core.login.authenticate.onError,
            onDenied: Core.login.authenticate.onDenied,
            onComplete: Core.login.authenticate.onComplete
          }
        );
      },

      onSuccess: function (data) {
        Core.auth.authToken.set(data.token, 30);
        window.location = 'index.html';
      },

      onError: function (data) {
        var error = JSON.parse(data.responseText, function (key, value) {
          var type;
          if (value && typeof value === 'object') {
            type = value.type;
            if (typeof type === 'string' && typeof window[type] === 'function') {
              return new (window[type])(value);
            }
          }
          return value;
        });
        $('.error-msg').html("<div class='message'>" + error.message + "</div>");
      },

      onDenied: function (data) {
      },

      onComplete: function (data) {
      }
    }

  };

  $(Core.login.init);

  window.Core = Core;

})(jQuery);
