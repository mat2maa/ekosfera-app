(function ($) {

  var Core = window.Core || Core || {};

  Core.index = {

    init: function () {
      Core.auth.requireSession();
      Core.index.bindEvents();
      Core.ui.showView();
    },

    bindEvents: function () {
      $('#logout').on('click', function () {
        Core.auth.logout();
        return false;
      });
      $('#ajax-test').on("click", function (e) {
        e.preventDefault();

        $.ajax({
          type: "GET",
          url: "http://ekosfera.mk/api/news_posts",
          data: {auth_token: "FnRhQqGo3ZVdkgGSLzfF"},
          dataType: "json",
          success: function (data) {
            console.log(data);
            console.log("readyState: " + data.readyState);
            console.log("responseText: " + data.responseText);
            console.log("status: " + data.status);
            console.log("statusText: " + data.statusText);
          },
          error: function (data) {
            console.log(data);
            console.log("readyState: " + data.readyState);
            console.log("responseText: " + data.responseText);
            console.log("status: " + data.status);
            console.log("statusText: " + data.statusText);
          },
          complete: function (data) {
            console.log(data);
            console.log("readyState: " + data.readyState);
            console.log("responseText: " + data.responseText);
            console.log("status: " + data.status);
            console.log("statusText: " + data.statusText);
          },
          denied: function (data) {
            console.log(data);
            console.log("readyState: " + data.readyState);
            console.log("responseText: " + data.responseText);
            console.log("status: " + data.status);
            console.log("statusText: " + data.statusText);
          }
        });
      });
    }

  };

  $(Core.index.init);

  window.Core = Core;

})(jQuery);
