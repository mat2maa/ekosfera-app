(function ($) {

  var Core = Core || {};

  Core = {

    init: function () {
      console.log("core/init");

      Core.usefulTips.updateUsefulTip(
        {
          onSuccess: Core.usefulTips.onSuccess,
          onError: Core.usefulTips.onError,
          onDenied: Core.usefulTips.onDenied,
          onComplete: Core.usefulTips.onComplete
        }
      );

      Core.populateSettingsMenu();
      Core.footerInit();
      Core.bindEvents();

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

    },

    usefulTips: {

      updateUsefulTip: function (callback) {
        var auth_token = Core.auth.authToken.get(),
          settings = JSON.parse(localStorage.getItem("ekosfera_settings"));

        $.ajax({
          type: "GET",
          url: "http://" + host + "/api/update_current_useful_tip",
          data: {
            auth_token: auth_token,
            settings: settings
          },
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
      },

      onSuccess: function (data) {
        console.log(data);
        localStorage.setItem('ekosfera_useful_tip', JSON.stringify(data));
      },

      onError: function (data) {
        console.log(data);
        console.log("readyState: " + data.readyState);
        console.log("responseText: " + data.responseText);
        console.log("status: " + data.status);
        console.log("statusText: " + data.statusText);
      },

      onDenied: function (data) {
        console.log(data);
      },

      onComplete: function (data) {
        console.log(data);
      },

      refreshUsefulTip: function (callback) {
        var auth_token = Core.auth.authToken.get(),
          settings = JSON.parse(localStorage.getItem("ekosfera_settings"));

        $.ajax({
          type: "GET",
          url: "http://" + host + "/api/refresh_current_useful_tip",
          data: {
            auth_token: auth_token,
            settings: settings
          },
          success: function (data) {
            console.log(data);
            localStorage.setItem('ekosfera_useful_tip', JSON.stringify(data));
            Core.footerInit();
          },
          error: function (data, status) {
            console.log(data);
            console.log("readyState: " + data.readyState);
            console.log("responseText: " + data.responseText);
            console.log("status: " + data.status);
            console.log("statusText: " + data.statusText);
          },
          complete: function (data) {
            console.log(data);
          },
          denied: function (data) {
            console.log(data);
          }
        });
      }

    },

    populateSettingsMenu: function () {

      var settings = JSON.parse(localStorage.getItem("ekosfera_settings")),
        $showTips = $("#show-useful-tips-checkbox"),
        $tipsOptions = $(".useful-tip-option"),
        settingsObject = {};

      if (settings == null) {
        $showTips.prop("checked", true).checkboxradio("refresh");
        settingsObject["tipsOn"] = true;
        $tipsOptions.each(function (index) {
          $(this).prop("checked", true).checkboxradio("refresh");
          settingsObject[index] = true;
        });

        localStorage.setItem("ekosfera_settings", JSON.stringify(settingsObject));
      } else {
        $showTips.prop("checked", settings["tipsOn"]).checkboxradio("refresh");
        $tipsOptions.each(function (index) {
          $(this).prop("checked", settings[index]).checkboxradio("refresh");
        });
      }

      if ($showTips.prop("checked") == false) {
        $tipsOptions.each(function () {
          $(this).checkboxradio("option", "disabled", true).checkboxradio("refresh");
        });
      }

    },

    footerInit: function () {

      $('.ui-footer').remove();

      var footer = "",
        settings = JSON.parse(localStorage.getItem("ekosfera_settings")),
        tip = JSON.parse(localStorage.getItem("ekosfera_useful_tip"));

      if (settings["tipsOn"] == true && tip != null) {
        footer += "<div data-role='footer' data-position='fixed' data-tap-toggle='false' data-animate='true' role='contentinfo' data-theme='a' class='ui-footer ui-bar-inherit ui-footer-fixed slideup ui-bar-a'>";
        footer += "<h4 class='useful-tip' role='heading' aria-level='1'>" + tip.useful_tip_category.name + "</h4>";
        footer += "<hr/>";
        footer += "<p class='useful-tip'>" + tip.text + "</p>";
        footer += "<a href='#' class='ui-btn-right ui-btn ui-icon-refresh ui-btn-icon-notext ui-corner-all refresh-useful-tip' data-ajax='false' data-transition='none' data-role='button' role='button'>Refresh Useful Tip</a>";
        footer += "</div>";
        $("body").append(footer);
      }

    },

    bindEvents: function () {

      $(document).on("click", ".refresh-useful-tip", function(e) {
        e.preventDefault();
        Core.usefulTips.refreshUsefulTip();
      });

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


(function ($) {

  var Core = window.Core || Core || {};

  Core.tips = {

    getUsefulTip: function () {
      var tip = JSON.parse(localStorage.getItem("ekosfera_useful_tip")).text;
      $(".useful-tip").html(tip);
    }

  };

  window.Core = Core;

})(jQuery);
