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
            .forEach(function (key) {
              if (/^(ekosfera_)/.test(key) && (key != "ekosfera_auth_token" && key != "ekosfera_auth_token_expiration")) {
                localStorage.removeItem(key);
                location.reload();
              }
            });
        }
        else {
          return false;
        }
      });

      var settings = JSON.parse(localStorage.getItem("ekosfera_settings")),
        $showTips = $("#show-useful-tips-checkbox"),
        $tipsOptions = $(".useful-tip-option"),
        $sync1 = $('#sync-calendar-1'),
        $sync2 = $('#sync-calendar-2'),
        $sync3 = $('#sync-calendar-3');

      $showTips.on("click", function () {
        if ($(this).prop("checked") == false) {
          $tipsOptions.each(function (index) {
            $(this).checkboxradio("option", "disabled", true).checkboxradio("refresh");
          });

          settings["tipsOn"] = false;
          localStorage.setItem("ekosfera_settings", JSON.stringify(settings));
        } else {
          $tipsOptions.each(function () {
            $(this).checkboxradio("option", "disabled", false).checkboxradio("refresh");
          });

          if ($(".useful-tip-option:checked").length == 0) {
            $tipsOptions.each(function (index) {
              $(this).prop("checked", true).checkboxradio("refresh");
              settings[index] = true;
            });
          }

          settings["tipsOn"] = true;
          localStorage.setItem("ekosfera_settings", JSON.stringify(settings));
        }
        Core.usefulTips.refreshUsefulTip();
      });

      $tipsOptions.each(function (index) {
        $(this).on("click", function() {
          if ($(this).prop("checked") == false) {
            settings[index] = false;
            localStorage.setItem("ekosfera_settings", JSON.stringify(settings));
          } else {
            settings[index] = true;
            localStorage.setItem("ekosfera_settings", JSON.stringify(settings));
          }

          if ($(".useful-tip-option:checked").length == 0) {
            $tipsOptions.each(function (index) {
              $(this).checkboxradio("option", "disabled", true).checkboxradio("refresh");
            });

            $showTips.prop("checked", false).checkboxradio("refresh");
            settings["tipsOn"] = false;
            localStorage.setItem("ekosfera_settings", JSON.stringify(settings));
          }
          Core.usefulTips.refreshUsefulTip();
        });
      });

      $sync1.on("click", function() {
        settings["syncCalendar"] = 1;
        localStorage.setItem("ekosfera_settings", JSON.stringify(settings));
      });

      $sync2.on("click", function() {
        settings["syncCalendar"] = 2;
        localStorage.setItem("ekosfera_settings", JSON.stringify(settings));
      });

      $sync3.on("click", function() {
        settings["syncCalendar"] = 3;
        localStorage.setItem("ekosfera_settings", JSON.stringify(settings));
      });
    }
  };

  $(Core.settings.init);

  window.Core = Core;

})(jQuery);
