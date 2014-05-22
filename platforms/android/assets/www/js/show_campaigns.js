(function ($) {

  var Core = window.Core || Core || {};

  Core.show_campaigns = {

    init: function () {
      $(".selector").loader({
        defaults: true
      });

      Core.auth.requireSession();
      Core.show_campaigns.bindEvents();
      Core.show_campaigns.getCampaign(
        {
          onSuccess: Core.show_campaigns.onSuccess,
          onError: Core.show_campaigns.onError,
          onDenied: Core.show_campaigns.onDenied,
          onComplete: Core.show_campaigns.onComplete
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
    },

    getCampaign: function (callback) {
      $.mobile.loading("show");

      var auth_token = Core.auth.authToken.get();

      var params = location.search.substring(1),
        campaign = $("body").data("campaign");
      if (typeof(campaign) == "string") {
        params = JSON.parse('{"id": ' + parseInt(campaign) + '}');
        console.log(params);
      } else if (params != "") {
        params = JSON.parse('{"' + decodeURI(params).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
        console.log(params);
      }

      var id = params.id;

      if (localStorage.getItem("ekosfera_campaign_" + id) === null) {
        $.ajax({
          type: "GET",
          url: "http://" + host + "/api/campaigns/" + id,
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
        Core.show_campaigns.populateFromStorage(id);
      }
    },

    onSuccess: function (data) {
      $.mobile.loading("hide");
      console.log(data);
      localStorage.setItem('ekosfera_campaign_' + data.id, JSON.stringify(data));
      var locations = [
        'Национален',
        'Вардарски регион',
        'Источен регион',
        'Југозападен регион',
        'Југоисточен регион',
        'Пелагониски регион',
        'Полошки регион',
        'Североисточен регион',
        'Скопски регион'
      ];
      var authorHtml = "";
      var html = "";
      var user = (typeof data.users[0].parent == "object") ? data.users[0].parent : data.user;
      var logoURL = (typeof data.users[0].parent == "object") ? data.users[0].parent.user_profile.base64uri : data.users[0].user_profile.base64uri;
      var date = new Date(data.start_date);
      var day = date.getDay();
      var month = date.getMonth() + 1;
      var year = date.getFullYear();


      html = "<div class='campaign-title'>";
      html += "<h3>" + data.name + "</h3>";
      html += "</div>";
      html += "<div class='campaign-location'>";
      html += locations[data.location - 1] + " (" +   day + "/" + month + "/" + year + ")" ;
      html += "</div>";
      html += "<div class='campaign-description'>";
      html += "<br />";
      html += "<strong>Опис</strong>";
      html += "<hr />";
      html += data.description;
      html += "</div>";
      html += "<div class='campaign-goal'>";
      html += "<strong>Цел</strong>";
      html += "<hr />";
      html += data.goal;
      html += "</div>";
      html += "<div class='activities'>";
      html += "<strong>Активности</strong>";
      html += "<hr />";
      html += data.activities;
      html += "</div>";
      html += "<div class='activities'>";
      html += "Контакт";
      html += "<hr />";
      html += data.contact_phone;
      html += data.contact_mobile;
      html += data.contact_website;
      html += data.contact_email;
      html += "</div>";

      $('.author').append(authorHtml);
      $('.campaign').append(html);
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
      var locations = [
        'Национален',
        'Вардарски регион',
        'Источен регион',
        'Југозападен регион',
        'Југоисточен регион',
        'Пелагониски регион',
        'Полошки регион',
        'Североисточен регион',
        'Скопски регион'
      ];
      var data = JSON.parse(localStorage.getItem("ekosfera_campaign_" + id));
      var authorHtml = "";
      var html = "";
      var date = new Date(data.start_date);
      var day = date.getDay();
      var month = date.getMonth() + 1;
      var year = date.getFullYear();

      html = "<div class='campaign-title'>";
      html += "<h3>" + data.name + "</h3>";
      html += "</div>";
      html += "<div class='campaign-location'>";
      html += locations[data.location - 1] + " (" +   day + "/" + month + "/" + year + ")" ;
      html += "</div>";
      html += "<div class='campaign-description'>";
      html += "<br />";
      html += "<strong>Опис</strong>";
      html += "<hr />";
      html += data.description;
      html += "</div>";
      html += "<div class='campaign-goal'>";
      html += "<strong>Цел</strong>";
      html += "<hr />";
      html += data.goal;
      html += "</div>";
      html += "<div class='activities'>";
      html += "<strong>Активности</strong>";
      html += "<hr />";
      html += data.activities;
      html += "</div>";
      html += "<div class='activities'>";
      html += "Контакт";
      html += "<hr />";
      html += data.contact_phone;
      html += data.contact_mobile;
      html += data.contact_website;
      html += data.contact_email;
      html += "</div>";

      $('.author').append(authorHtml);
      $('.campaign').append(html);
    }

  };

  $(Core.show_campaigns.init);

  window.Core = Core;

})(jQuery);
