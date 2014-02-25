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
          url: "http://" + host + "/api/news_posts",
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

      $('#calendar-test').on("click", function (e) {
        e.preventDefault();

        console.log("Trying to sync calendar");

        // prep some variables
        var startDate = new Date(2014,3,3,0,0,0,0,0); // beware: month 0 = january, 11 = december
        var endDate = new Date(2014,3,4,0,0,0,0,0);
        var title = "Elena's Birthday";
        var location = "Home";
        var notes = "Elena's Birthday";
        var success = function(message) { alert("Success: " + JSON.stringify(message)); };
        var error = function(message) { alert("Error: " + message); };

        window.plugins.calendar.createEvent(title,location,notes,startDate,endDate,success,error);
      });
    }

  };

  $(Core.index.init);

  window.Core = Core;

})(jQuery);
