(function ($) {

  var Core = window.Core || Core || {};

  Core.surveys = {

    init: function () {
      $(".selector").loader({
        defaults: true
      });

      Core.auth.requireSession();
      Core.surveys.bindEvents();
      Core.surveys.getSurveys(
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

      $(document).on("click", ".link-to-survey", function () {
        var id = $(this).attr('data-id');
        $("body").data("survey", id);
      });
    },

    getSurveys: function (callback) {
      $.mobile.loading("show");

      var auth_token = Core.auth.authToken.get();

      if (localStorage.getItem("ekosfera_surveys") === null) {
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
      } else {
        var id = JSON.parse(localStorage.getItem("ekosfera_surveys"))[0].id;

        $.ajax({
          type: "GET",
          url: "http://" + host + "/api/get_last_survey",
          data: {auth_token: auth_token},
          success: function (data) {
            if (parseInt(id) == parseInt(data)) {
              Core.surveys.populateFromStorage();
            } else {
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
            }
          }
        });

      }

    },

    onSuccess: function (data) {
      $.mobile.loading("hide");
      console.log(data);
      localStorage.setItem('ekosfera_surveys', JSON.stringify(data));

      var html = "";

      var by_date = _.groupBy(data, function (survey) {
        var surveyDate = survey["created_at"].split("T")[0],
          yyyy = parseInt(surveyDate.split("-")[0]),
          mm = parseInt(surveyDate.split("-")[1]);

        return mm + "/" + yyyy;
      });

      sortDates(Object.keys(by_date), "DESC").forEach(function (v, i) {
        html = "<li data-role='list-divider' role='heading' class='ui-li-divider ui-bar-inherit survey-list-divider'>";
        html += numToNameDate(v);
        html += "</li>";
        _.each(by_date[v], function (value) {
          var logoURL = (typeof value.user.parent == "object") ? value.user.parent.user_profile.base64uri : value.user.user_profile.base64uri;
          var date = new Date(value.date);
          var day = date.getDay();
          var month = date.getMonth() + 1;
          var year = date.getFullYear();

          html += "<li>";
          html += "<a href='show_surveys.html?id=" + value.id + "' class='link-to-survey ui-btn ui-btn-icon-right ui-icon-carat-r' data-ajax='true' data-transition='fade' data-id='" + value.id + "'>";
          html += "<div class='user-logo-outer'>";
          html += "<img src='data:image/png;base64," + logoURL + "' class='user-logo'>";
          html += "</div>";
          html += "<div class='survey-title truncated'>";
          html += value.title;
          html += "</div>";
          html += "<br />";
          html += "<div class='survey-date truncated'>";
          html += day + "/" + month + "/" + year;
          html += "</div>";
          html += "</a>";
          html += "</li>";

        });
        $('.surveys > .surveys-list').append(html);
      });
      $('.surveys > .surveys-list > li:first').addClass("ui-first-child");
      $('.surveys > .surveys-list > li:last').addClass("ui-last-child");
    },

    onError: function (data) {
      $.mobile.loading("hide");
      console.log(data);
      console.log("readyState: " + data.readyState);
      console.log("responseText: " + data.responseText);
      console.log("status: " + data.status);
      console.log("statusText: " + data.statusText);
    },

    onDenied: function (data) {
      $.mobile.loading("hide");
      console.log(data);
    },

    onComplete: function (data) {
      $.mobile.loading("hide");
      console.log(data);
    },

    populateFromStorage: function () {
      $.mobile.loading("hide");
      var data = JSON.parse(localStorage.getItem("ekosfera_surveys"));

      var html = "";

      var by_date = _.groupBy(data, function (survey) {
        var surveyDate = survey["created_at"].split("T")[0],
          yyyy = parseInt(surveyDate.split("-")[0]),
          mm = parseInt(surveyDate.split("-")[1]);

        return mm + "/" + yyyy;
      });

      sortDates(Object.keys(by_date), "DESC").forEach(function (v, i) {
        html = "<li data-role='list-divider' role='heading' class='ui-li-divider ui-bar-inherit survey-list-divider'>";
        html += numToNameDate(v);
        html += "</li>";
        _.each(by_date[v], function (value) {
          var logoURL = (typeof value.user.parent == "object") ? value.user.parent.user_profile.base64uri : value.user.user_profile.base64uri;
          var date = new Date(value.date);
          var day = date.getDay();
          var month = date.getMonth() + 1;
          var year = date.getFullYear();

          html += "<li>";
          html += "<a href='show_surveys.html?id=" + value.id + "' class='link-to-survey ui-btn ui-btn-icon-right ui-icon-carat-r' data-ajax='true' data-transition='fade' data-id='" + value.id + "'>";
          html += "<div class='user-logo-outer'>";
          html += "<img src='data:image/png;base64," + logoURL + "' class='user-logo'>";
          html += "</div>";
          html += "<div class='survey-title truncated'>";
          html += value.title;
          html += "</div>";
          html += "<br />";
          html += "<div class='survey-date truncated'>";
          html += day + "/" + month + "/" + year;
          html += "</div>";
          html += "</a>";
          html += "</li>";

        });
        $('.surveys > .surveys-list').append(html);
      });
      $('.surveys > .surveys-list > li:first').addClass("ui-first-child");
      $('.surveys > .surveys-list > li:last').addClass("ui-last-child");
    }

  };

  $(Core.surveys.init);

  window.Core = Core;

})(jQuery);
