(function ($) {

  var Core = Core || {};

  Core = {


    init: function () {
      console.log("core/init");
    },

    api: {

      submit: function (ajax_url, email, password, callback) {
        console.log("api/submit");
        console.log("ajax_url: " + ajax_url);
        console.log("email: " + email);
        console.log("password: " + password);

        var auth_token = '';
        if (Core.auth.isAuthenticated()) {
          auth_token = Core.auth.authToken.get();
        }
        console.log("ekosfera_auth_token: " + auth_token);

        $.ajax({

          type: "POST",

          url: "http://" + host + "/" + ajax_url,

          //data: ajax_data,
          data: {email: email, password: password, auth_token: auth_token},

          success: function (data) {
            if (typeof callback.onSuccess == 'function') {
              console.log("api/onSuccess");
              callback.onSuccess.call(this, data);
            }
          },

          error: function (data, status) {
            if (typeof callback.onError == 'function') {
              console.log("api/onError");
              if (data.status == '403') {
                return callback.onDenied.call(this, data);
              }
              callback.onError.call(this, data);
            }
          },

          complete: function (data) {
            if (typeof callback.onComplete == 'function') {
              console.log("api/onComplete");
              callback.onComplete.call(this, data);
            }
          },

          denied: function (data) {
            if (typeof callback.onDenied == 'function') {
              console.log("api/onDenied");
              callback.onDenied.call(this, data);
            }
          }

        });

      }

    }

  };

  $(Core.init);

  window.Core = Core;

})(jQuery);

(function ($) {

  var Core = window.Core || Core || {};

  Core.auth = {


    authToken: {

      set: function (token, lifetime) {
        var expires = new Date();
        expires.setDate(expires.getDate() + lifetime);

        localStorage.setItem("ekosfera_auth_token", token);
        localStorage.setItem("ekosfera_auth_token_expiration", expires.toGMTString());
      },

      get: function () {
        return localStorage.getItem("ekosfera_auth_token");
      },

      expiration: function () {
        return localStorage.getItem("ekosfera_auth_token_expiration");
      },

      destroy: function () {
        localStorage.removeItem("ekosfera_auth_token_expiration");
        localStorage.removeItem("ekosfera_auth_token");
      }

    },

    isAuthenticated: function () {
      if (Core.auth.authToken.get() !== null) {
        return true;
      } else {
        return false;
      }
    },

    isNotAuthenticated: function () {
      if (Core.auth.authToken.get() !== null) {
        return false;
      } else {
        return true;
      }
    },

    requireSession: function () {
      if (!Core.auth.isAuthenticated()) {
        window.location = 'login.html';
      }
    },

    requireNoSession: function () {
      if (Core.auth.isAuthenticated()) {
        window.location = 'index.html';
      }
    },

    logout: function () {
      Core.auth.authToken.destroy();
      window.location = 'login.html';
    }

  };

  window.Core = Core;

})(jQuery);

(function ($) {

  var Core = window.Core || Core || {};

  Core.ui = {

    showView: function () {
      $("#content").show();
    },

    hideView: function () {
      $("#content").hide();
    }

  };

  window.Core = Core;

})(jQuery);
