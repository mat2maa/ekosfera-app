(function ($) {

  var Core = window.Core || Core || {};

  Core.photos = {

    init: function () {
      Core.auth.requireSession();
      Core.photos.bindEvents();
      Core.photos.getPhotos(
        {
          onSuccess: Core.photos.onSuccess,
          onError: Core.photos.onError,
          onDenied: Core.photos.onDenied,
          onComplete: Core.photos.onComplete
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

    getPhotos: function (callback) {
      var auth_token = Core.auth.authToken.get();

      $.ajax({
        type: "GET",
        url: "http://" + host + "/api/photos",
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
        html = "<li>";
        html += "<a href='http://" + host + "" + value.image.url + "' title='" + value.caption + "' rel='" + value.caption + "' class='photo-link'>";
        html += "<img src='http://" + host + "" + value.image.url + "' title='" + value.caption + "' alt='" + value.caption + "' class='photo'>";
        html += "</a>";
        html += "</li>";

        $('.photos > .photos-list').append(html);
      });

      (function (window, $, PhotoSwipe) {
        var options = {
          jQueryMobile: true,
          captionAndToolbarAutoHideDelay: 0,
          captionAndToolbarHide: false,
          captionAndToolbarOpacity: 0.8,
          captionAndToolbarShowEmptyCaptions: true
        };
        $(".photos-list a").photoSwipe(options);
      }(window, window.jQuery, window.Code.PhotoSwipe));
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

  $(Core.photos.init);

  window.Core = Core;

})(jQuery);
