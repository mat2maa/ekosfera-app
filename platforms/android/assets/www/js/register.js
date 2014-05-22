(function ($) {

  var Core = window.Core || Core || {};

  Core.register = {

    init: function () {
      Core.auth.requireNoSession();
      Core.ui.showView();
      Core.register.bindEvents();
    },

    bindEvents: function () {
      $('#register').on('submit', function () {
        console.log("form/submit");
        Core.register.onSubmit($(this));
        return false;
      });

      $('#user_registration_submit').on('click', function () {
        var form_obj = $(this).closest('form');
        Core.register.onSubmit(form_obj);
        return false;
      });

      $(document).on("click", ".checkConnection-confirm", function () {
        openSettings();
        $("#checkConnection").popup("close");
      });

      $(document).on("click", ".openSettings-confirm", function () {
        exitApp();
      });

      $(document).on("click", ".exitApp-confirm", function () {
        exitApp();
      });

      $(document).on("click", ".exitApp-cancel", function () {
        $("#exitApp").popup("close");
      });

      $(document).on("click", ".registrationSuccessful-confirm", function() {
        window.location = 'login.html';
      });
    },

    onSubmit: function (form_obj) {
      $.mobile.loading("show");

      console.log("form/onSubmit");
      var ajax_url = form_obj.attr('action'),
        name = $('#register').serializeObject().user.name,
        email = $('#register').serializeObject().user.email,
        password = $('#register').serializeObject().user.password,
        password_confirmation = $('#register').serializeObject().user.password_confirmation;
      console.log("ajax_url: " + ajax_url);
      console.log("name: " + name);
      console.log("email: " + email);
      console.log("password: " + password);
      console.log("password_confirmation: " + password_confirmation);
      Core.api.register(ajax_url, name, email, password, password_confirmation,
        {
          onSuccess: Core.register.onSuccess,
          onError: Core.register.onError,
          onDenied: Core.register.onDenied,
          onComplete: Core.register.onComplete
        }
      );
    },

    onSuccess: function (data) {
      $.mobile.loading("hide");

      console.log("form/onSuccess");
      console.log(data);
      if (data.user != null) {
        $("#registrationSuccessful").popup("open");
      }
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
  };

  $(Core.register.init);

  window.Core = Core;

})(jQuery);
