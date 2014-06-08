(function ($) {

  var Core = window.Core || Core || {};

  Core.show_news_posts = {

    init: function () {
      $(".selector").loader({
        defaults: true
      });

      Core.auth.requireSession();
      Core.show_news_posts.bindEvents();
      Core.show_news_posts.getNewsPost(
        {
          onSuccess: Core.show_news_posts.onSuccess,
          onError: Core.show_news_posts.onError,
          onDenied: Core.show_news_posts.onDenied,
          onComplete: Core.show_news_posts.onComplete
        }
      );
      Core.ui.showView();
    },

    bindEvents: function () {
      $('.logout').on('click', function () {
        Core.auth.logout();
        return false;
      });
    },

    getNewsPost: function (callback) {
      $.mobile.loading("show");

      var auth_token = Core.auth.authToken.get();

      var params = location.search.substring(1),
        news_post = $("body").data("news_post");
      if (typeof(news_post) == "string") {
        params = JSON.parse('{"id": ' + parseInt(news_post) + '}');
        console.log(params);
      } else if (params != "") {
        params = JSON.parse('{"' + decodeURI(params).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
        console.log(params);
      }

      var id = params.id;

      if (localStorage.getItem("ekosfera_news_post_" + id) === null) {
        $.ajax({
          type: "GET",
          url: "http://" + host + "/api/news_posts/" + id,
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
        Core.show_news_posts.populateFromStorage(id);
      }
    },

    onSuccess: function (data) {
      $.mobile.loading("hide");
      console.log(data);
      localStorage.setItem('ekosfera_news_post_' + data.id, JSON.stringify(data));
      var authorHtml = "";
      var html = "";
      var user = (typeof data.user.parent == "object") ? data.user.parent : data.user;
      var logoURL = (typeof data.user.parent == "object") ? data.user.parent.user_profile.base64uri : data.user.user_profile.base64uri;

      authorHtml += "<div class='user-logo-outer'>";
      authorHtml += "<img src='data:image/png;base64," + logoURL + "' class='user-logo'>";
      authorHtml += "</div>";
      authorHtml += "<div class='news-post-author'>";
      authorHtml += user.user_profile.name;
      authorHtml += "</div>";

      html = "<div class='news-post-title'>";
      html += "<h3>" + data.title + "</h3>";
      html += "</div>";
      html += "<br />";
      html += "<div class='news-post-short-description'>";
      html += data.short_description;
      html += "</div>";
      html += "<div class='news-post-article'>";
      html += data.article;
      html += "</div>";

      $('.author').append(authorHtml);
      $('.news-post').append(html);
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
      var data = JSON.parse(localStorage.getItem("ekosfera_news_post_" + id));
      var authorHtml = "";
      var html = "";
      var user = (typeof data.user.parent == "object") ? data.user.parent : data.user;
      var logoURL = (typeof data.user.parent == "object") ? data.user.parent.user_profile.base64uri : data.user.user_profile.base64uri;

      authorHtml += "<div class='user-logo-outer'>";
      authorHtml += "<img src='data:image/png;base64," + logoURL + "' class='user-logo'>";
      authorHtml += "</div>";
      authorHtml += "<div class='news-post-author'>";
      authorHtml += user.user_profile.name;
      authorHtml += "</div>";

      html = "<div class='news-post-title'>";
      html += "<h3>" + data.title + "</h3>";
      html += "</div>";
      html += "<br />";
      html += "<div class='news-post-short-description'>";
      html += data.short_description;
      html += "</div>";
      html += "<div class='news-post-article'>";
      html += data.article;
      html += "</div>";

      $('.author').append(authorHtml);
      $('.news-post').append(html);
    }

  };

  $(Core.show_news_posts.init);

  window.Core = Core;

})(jQuery);
