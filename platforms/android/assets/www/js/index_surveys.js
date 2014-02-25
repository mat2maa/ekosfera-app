(function ($) {

  var Core = window.Core || Core || {};

  Core.surveys = {

    init: function () {
      Core.auth.requireSession();
      Core.surveys.bindEvents();
      Core.surveys.getNewsPosts(
        {
          onSuccess: Core.surveys.onSuccess,
          onError: Core.surveys.onError,
          onDenied: Core.surveys.onDenied,
          onComplete: Core.surveys.onComplete
        }
      );
      Core.ui.showView();
    },

    bindEvents: function () {
      $('#logout').on('click', function () {
        Core.auth.logout();
        return false;
      });
    },

    getNewsPosts: function (callback) {
      var auth_token = Core.auth.authToken.get();

      $.ajax({
        type: "GET",
        url: "http://" + host + "/api/surveys",
        data: {auth_token: auth_token},
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
      var html = "";
      $.each(data, function (key, value) {
        var logoURL = (typeof value.user.parent == "object") ? value.user.parent.user_profile.logo.thumb.url : value.user.user_profile.logo.thumb.url;

        html = "<li>";
        html += "<a href='show_surveys1.html?id=" + value.id + "' class='ui-btn ui-btn-icon-right ui-icon-carat-r' data-ajax='false' data-transition='none'>";
        html += "<div class='user-logo-outer'>";
        html += "<img src='http://" + host + "" + logoURL + "' class='user-logo'>";
        html += "</div>";
        html += "<div class='news-post-title truncated'>";
        html += value.title;
        html += "</div>";
        html += "<br />";
        html += "<div class='news-post-short-description truncated'>";
        html += value.date;
        html += "</div>";
        html += "</a>";
        html += "</li>";

        $('.surveys > .surveys-list').append(html);
      });
      $('.surveys > .surveys-list > li:first').addClass("ui-first-child");
      $('.surveys > .surveys-list > li:last').addClass("ui-last-child");
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
    }

  };

  $(Core.surveys.init);

  window.Core = Core;

})(jQuery);
