(function ($) {

  var Core = window.Core || Core || {};

  Core.campaigns = {

    init: function () {
      $(".selector").loader({
        defaults: true
      });

      Core.auth.requireSession();
      Core.campaigns.bindEvents();
      Core.campaigns.getCampaigns(
        {
          onSuccess: Core.campaigns.onSuccess,
          onError: Core.campaigns.onError,
          onDenied: Core.campaigns.onDenied,
          onComplete: Core.campaigns.onComplete
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

    getCampaigns: function (callback) {
      $.mobile.loading("show");

      var auth_token = Core.auth.authToken.get();

      if (localStorage.getItem("ekosfera_campaigns") === null) {
        $.ajax({
          type: "GET",
          url: "http://" + host + "/api/campaigns",
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
        var id = JSON.parse(localStorage.getItem("ekosfera_campaigns"))[0].id;

        $.ajax({
          type: "GET",
          url: "http://" + host + "/api/get_last_campaign",
          data: {auth_token: auth_token},
          success: function (data) {
            if (parseInt(id) == parseInt(data)) {
              Core.campaigns.populateFromStorage();
            } else {
              $.ajax({
                type: "GET",
                url: "http://" + host + "/api/campaigns",
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
      localStorage.setItem('ekosfera_campaigns', JSON.stringify(data));
      var html = "";
      $.each(data, function (key, value) {
        var logoURL = (typeof value.users[0].parent == "object") ? value.users[0].parent.user_profile.base64uri : value.users[0].user_profile.base64uri;
        var date = new Date(value.start_date);
        var day = date.getDay();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();

        html = "<li>";
        html += "<a href='show_campaigns.html?id=" + value.id + "' class='ui-btn ui-btn-icon-right ui-icon-carat-r' data-ajax='false' data-transition='none'>";
        html += "<div class='user-logo-outer'>";
        html += "<img src='data:image/png;base64," + logoURL + "' class='user-logo'>";
        html += "</div>";
        html += "<div class='campaign-title truncated'>";
        html += value.title;
        html += "</div>";
        html += "<br />";
        html += "<div class='campaign-date truncated'>";
        html += day + "/" + month + "/" + year;
        html += "</div>";
        html += "</a>";
        html += "</li>";

        $('.campaigns > .campaigns-list').append(html);
//        $.each($('.campaigns > .campaigns-list > li'), function(i, el){
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
      $('.campaigns > .campaigns-list > li:first').addClass("ui-first-child");
      $('.campaigns > .campaigns-list > li:last').addClass("ui-last-child");
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
      var campaigns = JSON.parse(localStorage.getItem("ekosfera_campaigns"));
      $.each(campaigns, function (key, value) {
        var logoURL = (typeof value.users[0].parent == "object") ? value.users[0].parent.user_profile.base64uri : value.users[0].user_profile.base64uri;
        var date = new Date(value.start_date);
        var day = date.getDay();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();

        html = "<li>";
        html += "<a href='show_campaigns.html?id=" + value.id + "' class='ui-btn ui-btn-icon-right ui-icon-carat-r' data-ajax='false' data-transition='none'>";
        html += "<div class='user-logo-outer'>";
        html += "<img src='data:image/png;base64," + logoURL + "' class='user-logo'>";
        html += "</div>";
        html += "<div class='campaign-title truncated'>";
        html += value.name;
        html += "</div>";
        html += "<br />";
        html += "<div class='campaign-date truncated'>";
        html += day + "/" + month + "/" + year;
        html += "</div>";
        html += "</a>";
        html += "</li>";

        $('.campaigns > .campaigns-list').append(html);
//        $.each($('.campaigns > .campaigns-list > li'), function(i, el){
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
      $('.campaigns > .campaigns-list > li:first').addClass("ui-first-child");
      $('.campaigns > .campaigns-list > li:last').addClass("ui-last-child");
    }

  };

  $(Core.campaigns.init);

  window.Core = Core;

})(jQuery);
