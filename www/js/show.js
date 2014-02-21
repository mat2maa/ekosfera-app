(function ($) {

  var Core = window.Core || Core || {};

  Core.show = {

    init: function () {
      Core.auth.requireSession();
      Core.show.bindEvents();
      Core.show.getNewsPost(
        {
          onSuccess: Core.show.onSuccess,
          onError: Core.show.onError,
          onDenied: Core.show.onDenied,
          onComplete: Core.show.onComplete
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

    getNewsPost: function (callback) {
      var auth_token = Core.auth.authToken.get();

      var params = location.search.substring(1);
      params = JSON.parse('{"' + decodeURI(params).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
      var id = params.id;
      var ua = navigator.userAgent.toLowerCase();
      var isAndroid = ua.indexOf("android") > -1; //&& ua.indexOf("mobile");
      var host = '';
      if (isAndroid) {
        host = '10.0.2.2';
      } else {
        host = 'localhost';
      }

      $.ajax({
        type: "GET",
        url: "http://" + host + ":3000/api/news_posts/" + id,
        cache: false,
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
      var authorHtml = "";
      var html = "";
      var user = (typeof data.user.parent == "object") ? data.user.parent : data.user;
      var logoURL = (typeof data.user.parent == "object") ? data.user.parent.user_profile.logo.thumb.url : data.user.user_profile.logo.thumb.url;

      authorHtml += "<div class='user-logo-outer'>";
      authorHtml += "<img src='http://ekosfera.mk" + logoURL + "' class='user-logo'>";
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
    }
  };

  $(Core.show.init);

  window.Core = Core;

})(jQuery);
