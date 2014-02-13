(function ($) {

  var Core = Core || {};

  Core = {


    init: function () {

    },

    api: {

      submit: function (ajax_url, email, password, callback) {

        var auth_token = '';
        if (Core.auth.isAuthenticated()) {
          auth_token = Core.auth.authToken.get();
        }

        $.ajax({

          type: "POST",

          url: "http://localhost:3000/" + ajax_url,

          cache: false,

          //data: ajax_data,
          data: {email: email, password: password, auth_token: auth_token},

          success: function (data) {
            if (typeof callback.onSuccess == 'function') {
              callback.onSuccess.call(this, data);
            }
          },

          error: function (data, status) {
            if (typeof callback.onError == 'function') {
              if (data.status == '403') {
                return callback.onDenied.call(this, data);
              }
              callback.onError.call(this, data);
            }
          },

          complete: function (data) {
            if (typeof callback.onComplete == 'function') {
              callback.onComplete.call(this, data);
            }
          },

          denied: function (data) {
            if (typeof callback.onDenied == 'function') {
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

(function( $ ) {

  var Core = window.Core || Core || {};

  Core.auth = {


    authToken: {

      set: function( token, lifetime ) {
        var expires = new Date();
        expires.setDate(expires.getDate() + lifetime);

        localStorage.setItem("auth_token", token);
        localStorage.setItem("auth_token_expiration", expires.toGMTString());
      },

      get: function() {
        return localStorage.getItem("auth_token");
      },

      expiration: function() {
        return localStorage.getItem("auth_token_expiration");
      },

      destroy: function() {
        localStorage.removeItem("auth_token_expiration");
        localStorage.removeItem("auth_token");
      }

    },

    isAuthenticated: function() {
      if( Core.auth.authToken.get() !== null ){
        return true;
      } else {
        return false;
      }
    },

    isNotAuthenticated: function() {
      if( Core.auth.authToken.get() !== null ){
        return false;
      } else {
        return true;
      }
    },

    requireSession: function() {
      if( !Core.auth.isAuthenticated() ) {
        window.location = 'login.html';
      }
    },

    requireNoSession: function() {
      if( Core.auth.isAuthenticated() ) {
        window.location = 'index.html';
      }
    },

    logout: function() {
      Core.auth.authToken.destroy();
      window.location = 'login.html';
    }

  };

  window.Core = Core;

})(jQuery);

(function( $ ) {

  var Core = window.Core || Core || {};

  Core.ui = {

    showView: function (){
      $("#content").show();
    },

    hideView: function (){
      $("#content").hide();
    }

  };

  window.Core = Core;

})(jQuery);
