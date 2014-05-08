(function ($) {

  var Core = window.Core || Core || {};

  Core.petitions = {

    init: function () {
      $(".selector").loader({
        defaults: true
      });

      Core.auth.requireSession();
      Core.petitions.bindEvents();
      Core.petitions.getPetitions(
        {
          onSuccess: Core.petitions.onSuccess,
          onError: Core.petitions.onError,
          onDenied: Core.petitions.onDenied,
          onComplete: Core.petitions.onComplete
        }
      );
      Core.ui.showView();
    },

    bindEvents: function () {
      $('#logout').on('click', function () {
        Core.auth.logout();
        return false;
      });

      $(document).on("click", ".link-to-petition", function() {
        var id = $(this).attr('data-id');
        $("body").data("petition", id);
      });
    },

    getPetitions: function (callback) {
      $.mobile.loading("show");

      var auth_token = Core.auth.authToken.get();

      if (localStorage.getItem("ekosfera_petitions") === null) {
        $.ajax({
          type: "GET",
          url: "http://" + host + "/api/petitions",
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
        var id = JSON.parse(localStorage.getItem("ekosfera_petitions"))[0].id;

        $.ajax({
          type: "GET",
          url: "http://" + host + "/api/get_last_petition",
          data: {auth_token: auth_token},
          success: function (data) {
            if (parseInt(id) == parseInt(data)) {
              Core.petitions.populateFromStorage();
            } else {
              $.ajax({
                type: "GET",
                url: "http://" + host + "/api/petitions",
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
      localStorage.setItem('ekosfera_petitions', JSON.stringify(data));
      var html = "";
      $.each(data, function (key, value) {
        var logoURL = (typeof value.user.parent == "object") ? value.user.parent.user_profile.base64uri : value.user.user_profile.base64uri;
        var date = new Date(value.date);
        var day = date.getDay();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();

        html = "<li>";
        html += "<a href='show_petitions.html?id=" + value.id + "' class='link-to-petition ui-btn ui-btn-icon-right ui-icon-carat-r' data-ajax='true' data-transition='pop' data-id='" + value.id + "'>";
        html += "<div class='user-logo-outer'>";
        html += "<img src='data:image/png;base64," + logoURL + "' class='user-logo'>";
        html += "</div>";
        html += "<div class='petition-title truncated'>";
        html += value.title;
        html += "</div>";
        html += "<br />";
        html += "<div class='petition-date truncated'>";
        html += day + "/" + month + "/" + year;
        html += "</div>";
        html += "</a>";
        html += "</li>";

        $('.petitions > .petitions-list').append(html);
//        $.each($('.petitions > .petitions-list > li'), function(i, el){
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
      $('.petitions > .petitions-list > li:first').addClass("ui-first-child");
      $('.petitions > .petitions-list > li:last').addClass("ui-last-child");
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
      var petitions = JSON.parse(localStorage.getItem("ekosfera_petitions"));
      $.each(petitions, function (key, value) {
        var logoURL = (typeof value.user.parent == "object") ? value.user.parent.user_profile.base64uri : value.user.user_profile.base64uri;
        var date = new Date(value.date);
        var day = date.getDay();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();

        html = "<li>";
        html += "<a href='show_petitions.html?id=" + value.id + "' class='link-to-petition ui-btn ui-btn-icon-right ui-icon-carat-r' data-ajax='true' data-transition='pop' data-id='" + value.id + "'>";
        html += "<div class='user-logo-outer'>";
        html += "<img src='data:image/png;base64," + logoURL + "' class='user-logo'>";
        html += "</div>";
        html += "<div class='petition-title truncated'>";
        html += value.title;
        html += "</div>";
        html += "<br />";
        html += "<div class='petition-date truncated'>";
        html += day + "/" + month + "/" + year;
        html += "</div>";
        html += "</a>";
        html += "</li>";

        $('.petitions > .petitions-list').append(html);
//        $.each($('.petitions > .petitions-list > li'), function(i, el){
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
      $('.petitions > .petitions-list > li:first').addClass("ui-first-child");
      $('.petitions > .petitions-list > li:last').addClass("ui-last-child");
    }

  };

  $(Core.petitions.init);

  window.Core = Core;

})(jQuery);
