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

      $(document).on("click", ".checkConnection-confirm", function() {
        openSettings();
        $("#checkConnection").popup("close");
      });

      $(document).on("click", ".openSettings-confirm", function() {
        exitApp();
      });

      $(document).on("click", ".exitApp-confirm", function() {
        exitApp();
      });

      $(document).on("click", ".exitApp-cancel", function() {
        $("#exitApp").popup("close");
      });
    },

    authenticate: {
      onSubmit: function (form_obj) {
        $.mobile.loading("show");

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
        $.mobile.loading("hide");

        console.log("form/onSuccess");
        console.log(data);
        console.log(data.token);
        Core.auth.authToken.set(data.token, 30);
        window.location = 'index.html';
      },

      onError: function (data) {
        $.mobile.loading("hide");

        console.log("form/onError");
        console.log("readyState: " + data.readyState);
        console.log("responseText: " + data.responseText);
        console.log("status: " + data.status);
        console.log("statusText: " + data.statusText);
        var error = JSON.parse(data.responseText);
        console.log(error);
        $('.error-msg').html("<div class='message'>" + error.message + "</div>");
      },

      onDenied: function (data) {
        $.mobile.loading("hide");

        console.log("form/onDenied");
        console.log(data);
      },

      onComplete: function (data) {
        $.mobile.loading("hide");

        console.log("form/onComplete");
        console.log(data);
      }
    }

  };

  $(Core.login.init);

  window.Core = Core;

})(jQuery);
