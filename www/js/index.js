(function( $ ) {

  var Core = window.Core || Core || {};

  Core.dashboard = {

    init: function (){
      Core.auth.requireSession();
      Core.dashboard.bindEvents();
      Core.dashboard.getNewsPosts(
        {
          onSuccess: Core.dashboard.onSuccess,
          onError: Core.dashboard.onError,
          onDenied: Core.dashboard.onDenied,
          onComplete: Core.dashboard.onComplete
        }
      );
      Core.ui.showView();
    },

    bindEvents: function() {
      $('#logout').on('click',function(){
        Core.auth.logout();
        return false;
      });
    },

    getNewsPosts: function(callback) {
      var auth_token = Core.auth.authToken.get();

      $.ajax({
        type: "GET",
        url: "http://localhost:3000/api/news_posts",
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
      $.each( data, function( key, value ) {
        var html = "<li><a href='show.html?id=" + value.id + "' class='ui-btn ui-btn-icon-right ui-icon-carat-r'>" + value.title + "</a></li>";
        $('.news-posts > .posts-list').append(html);
      });
      $('.news-posts > .posts-list > li:first').addClass("ui-first-child");
      $('.news-posts > .posts-list > li:last').addClass("ui-last-child");
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

  $( Core.dashboard.init );

  window.Core = Core;

})(jQuery);
