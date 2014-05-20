(function ($) {

  var Core = window.Core || Core || {};

  Core.news_posts = {

    init: function () {
      $(".selector").loader({
        defaults: true
      });

      Core.auth.requireSession();
      Core.news_posts.bindEvents();
      Core.news_posts.getNewsPosts(
        {
          onSuccess: Core.news_posts.onSuccess,
          onError: Core.news_posts.onError,
          onDenied: Core.news_posts.onDenied,
          onComplete: Core.news_posts.onComplete
        }
      );
      Core.ui.showView();
    },

    bindEvents: function () {
      $('#logout').on('click', function () {
        Core.auth.logout();
        return false;
      });

      $(document).on("click", ".link-to-news-post", function () {
        var id = $(this).attr('data-id');
        $("body").data("news_post", id);
      });
    },

    getNewsPosts: function (callback) {
      $.mobile.loading("show");

      var auth_token = Core.auth.authToken.get();

      if (localStorage.getItem("ekosfera_news_posts") === null) {
        $.ajax({
          type: "GET",
          url: "http://" + host + "/api/news_posts",
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
        var id = JSON.parse(localStorage.getItem("ekosfera_news_posts"))[0].id;

        $.ajax({
          type: "GET",
          url: "http://" + host + "/api/get_last_news_post",
          data: {auth_token: auth_token},
          success: function (data) {
            if (parseInt(id) == parseInt(data)) {
              Core.news_posts.populateFromStorage();
            } else {
              $.ajax({
                type: "GET",
                url: "http://" + host + "/api/news_posts",
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
      localStorage.setItem('ekosfera_news_posts', JSON.stringify(data));

      var html = "";

      var by_date = _.groupBy(data, function (news_post) {
        var newsPostDate = news_post["created_at"].split("T")[0],
          yyyy = parseInt(newsPostDate.split("-")[0]),
          mm = parseInt(newsPostDate.split("-")[1]);

        return mm + "/" + yyyy;
      });

      sortDates(Object.keys(by_date), "DESC").forEach(function (v, i) {
        html = "<li data-role='list-divider' role='heading' class='ui-li-divider ui-bar-inherit news-post-list-divider'>";
        html += numToNameDate(v);
        html += "</li>";
        _.each(by_date[v], function (value) {
          var logoURL = (typeof value.user.parent == "object") ? value.user.parent.user_profile.base64uri : value.user.user_profile.base64uri;

          html += "<li>";
          html += "<a href='show_news_posts.html?id=" + value.id + "' class='link-to-news-post ui-btn ui-btn-icon-right ui-icon-carat-r' data-ajax='true' data-transition='pop' data-id='" + value.id + "'>";
          html += "<div class='user-logo-outer'>";
          html += "<img src='data:image/png;base64," + logoURL + "' class='user-logo'>";
          html += "</div>";
          html += "<div class='news-post-title truncated'>";
          html += value.title;
          html += "</div>";
          html += "<br />";
          html += "<div class='news-post-short-description truncated'>";
          html += value.short_description;
          html += "</div>";
          html += "</a>";
          html += "</li>";
        });
        $('.news-posts > .posts-list').append(html);
      });

      $('.news-posts > .posts-list > li:first').addClass("ui-first-child");
      $('.news-posts > .posts-list > li:last').addClass("ui-last-child");
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
      var data = JSON.parse(localStorage.getItem("ekosfera_news_posts"));
      var html = "";

      var by_date = _.groupBy(data, function (news_post) {
        var newsPostDate = news_post["created_at"].split("T")[0],
          yyyy = parseInt(newsPostDate.split("-")[0]),
          mm = parseInt(newsPostDate.split("-")[1]);

        return mm + "/" + yyyy;
      });

      sortDates(Object.keys(by_date), "DESC").forEach(function (v, i) {
        html = "<li data-role='list-divider' role='heading' class='ui-li-divider ui-bar-inherit news-post-list-divider'>";
        html += numToNameDate(v);
        html += "</li>";
        _.each(by_date[v], function (value) {
          var logoURL = (typeof value.user.parent == "object") ? value.user.parent.user_profile.base64uri : value.user.user_profile.base64uri;

          html += "<li>";
          html += "<a href='show_news_posts.html?id=" + value.id + "' class='link-to-news-post ui-btn ui-btn-icon-right ui-icon-carat-r' data-ajax='true' data-transition='pop' data-id='" + value.id + "'>";
          html += "<div class='user-logo-outer'>";
          html += "<img src='data:image/png;base64," + logoURL + "' class='user-logo'>";
          html += "</div>";
          html += "<div class='news-post-title truncated'>";
          html += value.title;
          html += "</div>";
          html += "<br />";
          html += "<div class='news-post-short-description truncated'>";
          html += value.short_description;
          html += "</div>";
          html += "</a>";
          html += "</li>";
        });
        $('.news-posts > .posts-list').append(html);
      });
      $('.news-posts > .posts-list > li:first').addClass("ui-first-child");
      $('.news-posts > .posts-list > li:last').addClass("ui-last-child");
    }

  };

  $(Core.news_posts.init);

  window.Core = Core;

})(jQuery);
