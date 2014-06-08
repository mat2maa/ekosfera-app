(function ($) {

  var Core = Core || {};

  Core = {

    init: function () {
      console.log("core/init");

      if (Core.auth.isAuthenticated()) {
        Core.usefulTips.updateUsefulTip(
          {
            onSuccess: Core.usefulTips.onSuccess,
            onError: Core.usefulTips.onError,
            onDenied: Core.usefulTips.onDenied,
            onComplete: Core.usefulTips.onComplete
          }
        );

        Core.bindEvents();

        $("#checkConnection").enhanceWithin().popup();
        $("#openSettings").enhanceWithin().popup();
        $("#exitApp").enhanceWithin().popup();
        $("#registrationSuccessful").enhanceWithin().popup();
      }

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

      },

      register: function (ajax_url, name, email, password, password_confirmation, callback) {
        console.log("api/register");
        console.log("ajax_url: " + ajax_url);
        console.log("name: " + name);
        console.log("email: " + email);
        console.log("password: " + password);
        console.log("password_confirmation: " + password_confirmation);

        $.ajax({

          type: "POST",

          url: "http://" + host + "/" + ajax_url,

          //data: ajax_data,
          data: {name: name, email: email, password: password, password_confirmation: password_confirmation},

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
        settingsObject = {},
        $sync1 = $('#sync-calendar-1'),
        $sync2 = $('#sync-calendar-2'),
        $sync3 = $('#sync-calendar-3');

      if (settings == null) {
        $showTips.prop("checked", true).checkboxradio("refresh");
        settingsObject["tipsOn"] = true;
        $tipsOptions.each(function (index) {
          $(this).prop("checked", true).checkboxradio("refresh");
          settingsObject[index] = true;
        });

        $sync1.prop("checked", true).checkboxradio("refresh");
        settingsObject["syncCalendar"] = 1;

        localStorage.setItem("ekosfera_settings", JSON.stringify(settingsObject));
      } else {
        $showTips.prop("checked", settings["tipsOn"]).checkboxradio("refresh");
        $tipsOptions.each(function (index) {
          $(this).prop("checked", settings[index]).checkboxradio("refresh");
        });
        if (settings["syncCalendar"] == 1) {
          $sync1.prop("checked", true).checkboxradio("refresh");
        } else if (settings["syncCalendar"] == 2) {
          $sync2.prop("checked", true).checkboxradio("refresh");
        } else if (settings["syncCalendar"] == 3) {
          $sync3.prop("checked", true).checkboxradio("refresh");
        }
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
        tip = JSON.parse(localStorage.getItem("ekosfera_useful_tip")),
        activePage = $.mobile.activePage.attr('id');

      if (settings != null && settings["tipsOn"] == true && tip != null && activePage != "upload-photo" && activePage != "login-page" && activePage != "register-page") {
        footer += "<div data-role='footer' data-position='fixed' data-tap-toggle='false' data-animate='true' role='contentinfo' data-theme='b' class='ui-footer ui-bar-inherit ui-footer-fixed slideup ui-bar-b'>";
        footer += "<h4 class='useful-tip useful-tip-" + tip.useful_tip_category.id + "' role='heading' aria-level='1'>Еко совети за " + tip.useful_tip_category.name.toLowerCase() + "</h4>";
        footer += "<p class='useful-tip'>" + tip.text + "</p>";
        footer += "<a href='#' class='ui-btn-right ui-btn ui-icon-refresh ui-btn-icon-notext ui-corner-all refresh-useful-tip' data-ajax='false' data-transition='none' data-role='button' role='button'>Refresh Useful Tip</a>";
        footer += "</div>";
        $("body").append(footer);
        var footerHeight = $("[data-role='footer']").height() + 21;
        console.log(footerHeight);
        $("[data-role='page']").css({
          "padding-bottom": footerHeight
        });
        $("[data-position='fixed']").trigger('updatelayout');
      }

    },

    bindEvents: function () {

      $(document).on("click", ".refresh-useful-tip", function (e) {
        e.preventDefault();
        Core.usefulTips.refreshUsefulTip();
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

      $(document).on("click", ".newSettings-confirm", function () {
        $("#newSettings").popup("close");
      });

      $(document).on("click", ".registrationSuccessful-confirm", function () {
        window.location = 'login.html';
      });

      $(document).on('click', '.logout', function (e) {
        Core.auth.logout();
        return false;
      });

      $(document).on('click', '.exit', function (e) {
        $("#exitApp").popup("open");
        return false;
      });

      $(document).on("click", ".calendar-text-toggle", function(e) {
        e.preventDefault();
        var id = $(this).data('id');
        $('.calendar-text-outer').not('.calendar-text-outer[data-id="' + id + '"]').slideUp("fast");
        $('.calendar-text-outer[data-id="' + id + '"]').slideToggle("fast");
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

      var footerHeight = $("[data-role='footer']").height() + 21;
      console.log(footerHeight);
      $("[data-role='page']").css({
        "padding-bottom": footerHeight
      });
      $("[data-position='fixed']").trigger('updatelayout');
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
