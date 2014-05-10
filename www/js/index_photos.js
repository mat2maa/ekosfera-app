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

      $(document).on("click", ".vote-for-photo", function (e) {
        e.preventDefault();
        var id = parseInt($(this).attr("data-id"));
        Core.photos.vote.voteForPhoto(id);
        return false;
      });
    },

    getPhotos: function (callback) {
      $.mobile.loading("show");

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
      $.mobile.loading("hide");
      console.log(data);
      var html = "";
      if (data.length == 1) {
        html = "<li>";
        html += "<table class='image-table'>";
        html += "<tbody>";
        html += "<tr>";
        html += "<td>";
        html += "No photos. Please be the first to <a href='upload_photo.html' data-ajax='true' data-transition='pop' class='upload-photo-link'>upload one</a>!";
        html += "</td>";
        html += "</tr>";
        html += "</tbody>";
        html += "</table>";
        html += "</li>";

        $('.photos > .photos-list').append(html);

      } else {
        $.each(data, function (key, value) {
          if (typeof value.id == "number") {
            var username = (typeof value.user.parent == "object") ? value.user.parent.user_profile.name : value.user.user_profile.name;
            var votes = value.votes == null ? 0 : value.votes;

            html = "<li>";
            html += "<table class='image-table'>";
            html += "<tbody>";
            html += "<tr>";
            html += "<td>";
            html += "<a href='http://" + host + "" + value.image.mobile.url + "' title='" + value.caption + "' rel='" + value.caption + "' class='photo-container'>";
            html += "<img src='http://" + host + "" + value.image.thumb.url + "' title='" + value.caption + "' alt='" + value.caption + "' data-id='" + value.id + "' class='photo'>";
            html += "</td>";
            html += "<td>";
            html += "<a href='#' class='vote-for-photo ui-btn ui-btn-icon-right ui-icon-star' data-id='" + value.id + "'>Vote</a>";
            html += "<p>";
            html += "Posted by: " + username + "<br/>";
            html += "Caption: " + value.caption + "<br/>";
            html += "Votes: <span class='number-of-votes-" + value.id + "'>" + votes + "</span>";
            html += "</p>";
            html += "</td>";
            html += "</tr>";
            html += "</tbody>";
            html += "</table>";
            html += "</a>";
            html += "</li>";
          }
          $('.photos > .photos-list').append(html);
        });

        $.each(data[0].votes, function (index, value) {
          $('.vote-for-photo[data-id = ' + value + ']').addClass('disabled');
        });
      }
    },

    onError: function (data) {
      $.mobile.loading("hide");
      console.log(data);
    },

    onDenied: function (data) {
      $.mobile.loading("hide");
      console.log(data);
    },

    onComplete: function (data) {
      $.mobile.loading("hide");
      console.log(data);
      (function (window, $, PhotoSwipe) {
        var options = {
          jQueryMobile: true,
          captionAndToolbarAutoHideDelay: 0,
          captionAndToolbarHide: false,
          captionAndToolbarOpacity: 0.8,
          captionAndToolbarShowEmptyCaptions: true
        };
        $(".photos-list a.photo-container").photoSwipe(options);
      }(window, window.jQuery, window.Code.PhotoSwipe));
    },

    vote: {
      voteForPhoto: function (id) {
        $.mobile.loading("show");

        var auth_token = Core.auth.authToken.get();

        $.ajax({
          type: "POST",
          url: "http://" + host + "/api/vote_for_photo/" + id,
          data: {
            auth_token: auth_token,
            id: id
          },
          success: function (data) {
            Core.photos.vote.onVoteSuccess(data);
          },
          error: function (data, status) {
            Core.photos.vote.onVoteError(data);
          },
          complete: function (data) {
            Core.photos.vote.onVoteComplete(data);
          },
          denied: function (data) {
            Core.photos.vote.onVoteDenied(data);
          }
        });
      },

      onVoteSuccess: function (data) {
        $.mobile.loading("hide");

        console.log(data);
        $('.vote-for-photo[data-id = ' + data.id + ']').addClass('disabled');
        var numberOfVotes = parseInt($('.number-of-votes-' + data.id).html()) + 1;
        $('.number-of-votes-' + data.id).html(numberOfVotes);
      },

      onVoteError: function (data) {
        $.mobile.loading("hide");

        console.log(data);
        alert("There was a problem, please try again.");
      },

      onVoteDenied: function (data) {
        $.mobile.loading("hide");

        console.log(data);
        alert("There was a problem, please try again.");
      },

      onVoteComplete: function (data) {
        $.mobile.loading("hide");

        console.log(data);
      }
    }

  };

  $(Core.photos.init);

  window.Core = Core;

})(jQuery);
