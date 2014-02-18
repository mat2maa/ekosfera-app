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
        console.log("form/submit");
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
        console.log("form/onSubmit");
        var ajax_url = form_obj.attr('action'),
          email = $('#login').serializeObject().user.email,
          password = $('#login').serializeObject().user.password;
        console.log("ajax_url: " + ajax_url);
        console.log("email: " + email);
        console.log("password: " + password);
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
        console.log("form/onSuccess");
        console.log(data);
        console.log(data.token);
        Core.auth.authToken.set(data.token, 30);
//        window.location = 'index.html';
      },

      onError: function (data) {
        console.log("form/onError");
        console.log(data.responseText);
        var error = data.responseText;
        console.log(error);
        $('.error-msg').html("<div class='message'>" + error.message + "</div>");
      },

      onDenied: function (data) {
        console.log("form/onDenied");
        console.log(data);
      },

      onComplete: function (data) {
        console.log("form/onComplete");
        console.log(data);
      }
    }

  };

  $(Core.login.init);

  window.Core = Core;

})(jQuery);
