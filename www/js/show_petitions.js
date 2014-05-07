(function ($) {

  var Core = window.Core || Core || {};

  Core.show_petitions = {

    init: function () {
      $(".selector").loader({
        defaults: true
      });

      Core.auth.requireSession();
      Core.show_petitions.bindEvents();
      Core.show_petitions.getPetition(
        {
          onSuccess: Core.show_petitions.onSuccess,
          onError: Core.show_petitions.onError,
          onDenied: Core.show_petitions.onDenied,
          onComplete: Core.show_petitions.onComplete
        }
      );
      Core.ui.showView();
    },

    bindEvents: function () {
      $('#logout').on('click', function () {
        Core.auth.logout();
        return false;
      });

      $(document).on("click", ".external-link", function(e) {
        e.preventDefault();
        $(this).blur();
        var url = $(this).attr("href");
        navigator.app.loadUrl(url, { openExternal:true });
        return false;
      });
    },

    getPetition: function (callback) {
      $.mobile.loading("show");

      var auth_token = Core.auth.authToken.get();

      var params = location.search.substring(1);
      params = JSON.parse('{"' + decodeURI(params).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
      var id = params.id;

      if (localStorage.getItem("ekosfera_petition_" + id) === null) {
        $.ajax({
          type: "GET",
          url: "http://" + host + "/api/petitions/" + id,
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
        Core.show_petitions.populateFromStorage(id);
      }
    },

    onSuccess: function (data) {
      $.mobile.loading("hide");
      console.log(data);
      localStorage.setItem('ekosfera_petition_' + data.id, JSON.stringify(data));
      var authorHtml = "";
      var html = "";
      var user = (typeof data.user.parent == "object") ? data.user.parent : data.user;
      var logoURL = (typeof data.user.parent == "object") ? data.user.parent.user_profile.base64uri : data.user.user_profile.base64uri;
      var date = new Date(data.date);
      var day = date.getDay();
      var month = date.getMonth() + 1;
      var year = date.getFullYear();

      authorHtml += "<div class='user-logo-outer'>";
      authorHtml += "<img src='data:image/png;base64," + logoURL + "' class='user-logo'>";
      authorHtml += "</div>";
      authorHtml += "<div class='petition-author'>";
      authorHtml += user.user_profile.name;
      authorHtml += "</div>";

      html = "<div class='petition-title'>";
      html += "<h3>" + data.title + "</h3>";
      html += "</div>";
      html += "<div class='petition-title'>";
      html += data.title;
      html += "</div>";
      html += "<br />";
      html += "<div class='petition-explanation'>";
      html += data.explanation;
      html += "</div>";
      html += "<div class='petition-date'>";
      html += day + "/" + month + "/" + year;
      html += "</div>";

      $('.author').append(authorHtml);
      $('.petition').append(html);
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
      var data = JSON.parse(localStorage.getItem("ekosfera_petition_" + id));
      var authorHtml = "";
      var html = "";
      var user = (typeof data.user.parent == "object") ? data.user.parent : data.user;
      var logoURL = (typeof data.user.parent == "object") ? data.user.parent.user_profile.base64uri : data.user.user_profile.base64uri;
      var date = new Date(data.date);
      var day = date.getDay();
      var month = date.getMonth() + 1;
      var year = date.getFullYear();

      authorHtml += "<div class='user-logo-outer'>";
      authorHtml += "<img src='data:image/png;base64," + logoURL + "' class='user-logo'>";
      authorHtml += "</div>";
      authorHtml += "<div class='petition-author'>";
      authorHtml += user.user_profile.name;
      authorHtml += "</div>";

      html = "<div class='petition-title'>";
      html += "<h3>" + data.title + "</h3>";
      html += "</div>";
      html += "<div class='petition-date'>";
      html += day + "/" + month + "/" + year;
      html += "</div>";
      html += "<br />";
      html += "<div class='petition-explanation'>";
      html += data.explanation;
      html += "</div>";
      html += "<div class='petition-link'>";
      html += "<a href='http://ekosfera.mk/petitions/" + data.id + ".html' data-rel='external' target='_blank' class='ui-btn ui-icon-action ui-btn-icon-right external-link'>ekosfera.mk/petitions/" + data.id + "</a>";
      html += "</div>";

      $('.author').append(authorHtml);
      $('.petition').append(html);
    }

  };

  $(Core.show_petitions.init);

  window.Core = Core;

})(jQuery);
