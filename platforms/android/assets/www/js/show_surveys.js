(function ($) {

  var Core = window.Core || Core || {};

  Core.show_surveys = {

    init: function () {
      $(".selector").loader({
        defaults: true
      });

      Core.auth.requireSession();
      Core.show_surveys.bindEvents();
      Core.show_surveys.getSurvey(
        {
          onSuccess: Core.show_surveys.onSuccess,
          onError: Core.show_surveys.onError,
          onDenied: Core.show_surveys.onDenied,
          onComplete: Core.show_surveys.onComplete
        }
      );
      Core.ui.showView();
    },

    bindEvents: function () {

      $(document).on("click", ".external-link", function(e) {
        e.preventDefault();
        $(this).blur();
        var url = $(this).attr("href");
        navigator.app.loadUrl(url, { openExternal:true });
        return false;
      });
    },

    getSurvey: function (callback) {
      $.mobile.loading("show");

      var auth_token = Core.auth.authToken.get();

      var params = location.search.substring(1),
        survey = $("body").data("survey");
      if (typeof(survey) == "string") {
        params = JSON.parse('{"id": ' + parseInt(survey) + '}');
        console.log(params);
      } else if (params != "") {
        params = JSON.parse('{"' + decodeURI(params).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
        console.log(params);
      }

      var id = params.id;

      if (localStorage.getItem("ekosfera_survey_" + id) === null) {
        $.ajax({
          type: "GET",
          url: "http://" + host + "/api/surveys/" + id,
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
      } else {
        $.mobile.loading("hide");
        Core.show_surveys.populateFromStorage(id);
      }
    },

    onSuccess: function (data) {
      $.mobile.loading("hide");
      console.log(data);
      localStorage.setItem('ekosfera_survey_' + data.id, JSON.stringify(data));
      var authorHtml = "";
      var html = "";
      var user = (typeof data.user.parent == "object") ? data.user.parent : data.user;
      var logoURL = (typeof data.user.parent == "object") ? data.user.parent.user_profile.base64uri : data.user.user_profile.base64uri;

      authorHtml += "<div class='user-logo-outer'>";
      authorHtml += "<img src='data:image/png;base64," + logoURL + "' class='user-logo'>";
      authorHtml += "</div>";
      authorHtml += "<div class='survey-author'>";
      authorHtml += user.user_profile.name;
      authorHtml += "</div>";

      html = "<div class='survey-title'>";
      html += "<h3>" + data.title + "</h3>";
      html += "</div>";
      html += "<br />";
      html += "<div class='survey-short-description'>";
      html += data.link;
      html += "</div>";
      html += "<div class='survey-article'>";
      html += data.explanation;
      html += "</div>";

      $('.author').append(authorHtml);
      $('.survey').append(html);
    },

    onError: function (data) {
      console.log(data);
    },

    onDenied: function (data) {
      console.log(data);
    },

    onComplete: function (data) {
      console.log(data);
    },

    populateFromStorage: function (id) {
      $.mobile.loading("hide");
      var data = JSON.parse(localStorage.getItem("ekosfera_survey_" + id));
      var authorHtml = "";
      var html = "";
      var user = (typeof data.user.parent == "object") ? data.user.parent : data.user;
      var logoURL = (typeof data.user.parent == "object") ? data.user.parent.user_profile.base64uri : data.user.user_profile.base64uri;

      authorHtml += "<div class='user-logo-outer'>";
      authorHtml += "<img src='data:image/png;base64," + logoURL + "' class='user-logo'>";
      authorHtml += "</div>";
      authorHtml += "<div class='survey-author'>";
      authorHtml += user.user_profile.name;
      authorHtml += "</div>";

      html = "<div class='survey-title'>";
      html += "<h3>" + data.title + "</h3>";
      html += "</div>";
      html += "<br />";
      html += "<div class='survey-explanation'>";
      html += data.explanation;
      html += "</div>";
      html += "<div class='survey-link'>";
      html += "<a href='http://ekosfera.mk/surveys/" + data.id + ".html' data-rel='external' target='_blank' class='ui-btn ui-icon-action ui-btn-icon-right external-link'>ekosfera.mk/surveys/" + data.id + "</a>";
      html += "</div>";

      $('.author').append(authorHtml);
      $('.survey').append(html);
    }

  };

  $(Core.show_surveys.init);

  window.Core = Core;

})(jQuery);
