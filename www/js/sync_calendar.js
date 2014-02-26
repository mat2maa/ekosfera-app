(function ($) {

  var Core = window.Core || Core || {};

  Core.sync_calendar = {

    init: function () {
      Core.auth.requireSession();
      Core.sync_calendar.bindEvents();
      Core.sync_calendar.getCalendarEvents(
        {
          onSuccess: Core.sync_calendar.onSuccess,
          onError: Core.sync_calendar.onError,
          onDenied: Core.sync_calendar.onDenied,
          onComplete: Core.sync_calendar.onComplete
        }
      );
      Core.ui.showView();
    },

    bindEvents: function () {
      $('#logout').on('click', function () {
        Core.auth.logout();
        return false;
      });

      $(document).on('click', '.sync-btn', function () {

        console.log('Sharing:AddEvent(Android)');

        var startDate = new Date($(this).attr('data-year'), $(this).attr('data-month'), $(this).attr('data-day'), 0, 0, 0, 0, 0); // beware: month 0 = january, 11 = december
        var endDate = new Date($(this).attr('data-year'), $(this).attr('data-month'), parseInt($(this).attr('data-day')) + 1, 0, 0, 0, 0, 0);
        var success = function (message) {
          alert("Success: " + JSON.stringify(message));
        };
        var error = function (message) {
          alert("Error: " + message);
        };
        cordova.exec(Core.sync_calendar.onSyncSuccess, Core.sync_calendar.onSyncError, "Calendar", "createEvent", [
          {
            "title": $(this).attr('data-title'),
            "location": $(this).attr('data-location'),
            "notes": $(this).attr('data-notes'),
            "startTime": startDate instanceof Date ? startDate.getTime() : null,
            "endTime": endDate instanceof Date ? endDate.getTime() : null
          }
        ]);
        window.plugins.calendar.createEvent($(this).attr('data-title'), $(this).attr('data-location'), $(this).attr('data-notes'), startDate, endDate, success, error);
      });

      $(document).on('click', '.sync-all', function () {
        $('.sync-btn').each(function () {
          var startDate = new Date($(this).attr('data-year'), $(this).attr('data-month'), $(this).attr('data-day'), 0, 0, 0, 0, 0); // beware: month 0 = january, 11 = december
          var endDate = new Date($(this).attr('data-year'), $(this).attr('data-month'), parseInt($(this).attr('data-day')) + 1, 0, 0, 0, 0, 0);
          cordova.exec(Core.sync_calendar.onSyncSuccess, Core.sync_calendar.onSyncError, "Calendar", "createEvent", [
            {
              "title": $(this).attr('data-title'),
              "location": $(this).attr('data-location'),
              "notes": $(this).attr('data-notes'),
              "startTime": startDate instanceof Date ? startDate.getTime() : null,
              "endTime": endDate instanceof Date ? endDate.getTime() : null
            }
          ]);
          window.plugins.calendar.createEvent($(this).attr('data-title'), $(this).attr('data-location'), $(this).attr('data-notes'), startDate, endDate, Core.sync_calendar.onSyncSuccess, Core.sync_calendar.onSyncError);
        });
      });

    },

    getCalendarEvents: function (callback) {
      var auth_token = Core.auth.authToken.get();

      $.ajax({
        type: "GET",
        url: "http://" + host + "/api/get_calendar_events",
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

        var year = value.year;
        var month = value.month;
        var day = value.day;
        var title = value.title;
        var location = "Ekosfera";
        var notes = value.short_description;

        html = "<li>";
        html += "<div class='calendar-event'>";
        html += "<div class='calendar-event-title truncated'>";
        html += value.title;
        html += "</div>";
        html += "<br />";
        html += "<div class='calendar-event-short-description truncated'>";
        html += value.short_description;
        html += "</div>";
        html += "</div>";
        html += "<div class='ui-btn ui-input-btn ui-shadow ui-btn-right'>";
        html += "<input type='button' class='sync-btn' data-corners='true' data-enhanced='true' value='Sync' data-year='" + year + "' data-month='" + month + "' data-day='" + day + "' data-title='" + title + "' data-location='" + location + "' data-notes='" + notes + "'>Sync</input>";
        html += "</div>";
        html += "</li>";

        $('.calendar-events > .events-list').append(html);
      });
      html = "<div class='ui-btn ui-input-btn ui-shadow'>";
      html += "<input type='button' class='sync-all' data-corners='true' data-enhanced='true' value='Sync All'>Sync All</input>";
      html += "</div>";
      $('.calendar-events > .events-list').prepend(html);
      $('.calendar-events > .events-list > li:first').addClass("ui-first-child");
      $('.calendar-events > .events-list > li:last').addClass("ui-last-child");
    },

    onError: function (data) {
      console.log(data);
      console.log("readyState: " + data.readyState);
      console.log("responseText: " + data.responseText);
      console.log("status: " + data.status);
      console.log("statusText: " + data.statusText);
    },

    onDenied: function (data) {
      console.log(data);
    },

    onComplete: function (data) {
      console.log(data);
    },

    onSyncSuccess: function (message) {
      console.log("Success: " + JSON.stringify(message));
    },

    onSyncError: function (message) {
      console.log("Error: " + message);
    }

  };

  $(Core.sync_calendar.init);

  window.Core = Core;

})(jQuery);