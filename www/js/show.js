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
      params = JSON.parse('{"' + decodeURI(params).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
      var id = params.id;

      $.ajax({
        type: "GET",
        url: "http://localhost:3000/api/news_posts/" + id,
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
      var html = data.article;
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
