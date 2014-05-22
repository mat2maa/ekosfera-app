(function ($) {

  var Core = window.Core || Core || {};

  Core.videos = {

    init: function () {
      $(".selector").loader({
        defaults: true
      });

      Core.auth.requireSession();
      Core.videos.bindEvents();
      Core.videos.getNewsPosts(
        {
          onSuccess: Core.videos.onSuccess,
          onError: Core.videos.onError,
          onDenied: Core.videos.onDenied,
          onComplete: Core.videos.onComplete
        }
      );
      Core.ui.showView();
    },

    bindEvents: function () {
      $('.logout').on('click', function () {
        Core.auth.logout();
        return false;
      });

      $(document).on('click', '.exit', function (e) {
        e.preventDefault();
        $("#exitApp").popup("open");
      });

      $(document).on("click", ".external-link", function(e) {
        e.preventDefault();
        $(this).blur();
        var url = $(this).attr("href");
        navigator.app.loadUrl(url, { openExternal:true });
        return false;
      });
    },

    getNewsPosts: function (callback) {
      $.mobile.loading("show");

      var auth_token = Core.auth.authToken.get();

      if (localStorage.getItem("ekosfera_videos") === null) {
        $.ajax({
          type: "GET",
          url: "http://" + host + "/api/videos",
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
        var id = JSON.parse(localStorage.getItem("ekosfera_videos"))[0].id;

        $.ajax({
          type: "GET",
          url: "http://" + host + "/api/get_last_video",
          data: {auth_token: auth_token},
          success: function (data) {
            if (parseInt(id) == parseInt(data)) {
              Core.videos.populateFromStorage();
            } else {
              $.ajax({
                type: "GET",
                url: "http://" + host + "/api/videos",
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
      localStorage.setItem('ekosfera_videos', JSON.stringify(data));
      var html = "";
      $.each(data, function (key, value) {
        var logoURL = (typeof value.user.parent == "object") ? value.user.parent.user_profile.base64uri : value.user.user_profile.base64uri;

        html = "<li>";
        html += "<a href='" + value.url + "' class='link-to-video ui-btn ui-btn-icon-right ui-icon-video external-link' data-rel='external' target='_blank' data-ajax='false' data-transition='none' data-id='" + value.id + "'>";
        html += "<div class='user-logo-outer'>";
        html += "<img src='data:image/png;base64," + logoURL + "' class='user-logo'>";
        html += "</div>";
        html += "<div class='video-title truncated'>";
        html += value.title;
        html += "</div>";
        html += "<br />";
        html += "<div class='video-short-description truncated'>";
        html += value.short_description;
        html += "</div>";
        html += "</a>";
        html += "</li>";

        $('.videos > .videos-list').append(html);
//        $.each($('.videos > .videos-list > li'), function(i, el){
//
//          $(el).css({'opacity':0});
//
//          setTimeout(function(){
//            $(el).animate({
//              'opacity':1.0
//            }, 350);
//          }, 25 + ( i * 25 ));
//
//        });

      });
      $('.videos > .videos-list > li:first').addClass("ui-first-child");
      $('.videos > .videos-list > li:last').addClass("ui-last-child");
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
      var videos = JSON.parse(localStorage.getItem("ekosfera_videos"));
      $.each(videos, function (key, value) {
        var logoURL = (typeof value.user.parent == "object") ? value.user.parent.user_profile.base64uri : value.user.user_profile.base64uri;

        html = "<li>";
        html += "<a href='" + value.url + "' class='link-to-video ui-btn ui-btn-icon-right ui-icon-video external-link' data-rel='external' target='_blank' data-ajax='false' data-transition='none' data-id='" + value.id + "'>";
        html += "<div class='user-logo-outer'>";
        html += "<img src='data:image/png;base64," + logoURL + "' class='user-logo'>";
        html += "</div>";
        html += "<div class='video-title truncated'>";
        html += value.title;
        html += "</div>";
        html += "<br />";
        html += "<div class='video-short-description truncated'>";
        html += value.short_description;
        html += "</div>";
        html += "</a>";
        html += "</li>";

        $('.videos > .videos-list').append(html);
//        $.each($('.videos > .videos-list > li'), function(i, el){
//
//          $(el).css({'opacity':0});
//
//          setTimeout(function(){
//            $(el).animate({
//              'opacity':1.0
//            }, 350);
//          }, 25 + ( i * 25 ));
//
//        });
      });
      $('.videos > .videos-list > li:first').addClass("ui-first-child");
      $('.videos > .videos-list > li:last').addClass("ui-last-child");
    }

  };

  $(Core.videos.init);

  window.Core = Core;

})(jQuery);
