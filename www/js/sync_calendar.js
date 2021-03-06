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

      $(document).on('click', '.sync-btn', function (e) {
        $.mobile.loading("show");

        e.preventDefault();

        console.log('Sharing:AddEvent(Android)');

        var startDate = new Date($(this).attr('data-year'), parseInt($(this).attr('data-month')) - 1, $(this).attr('data-day'), 0, 0, 0, 0, 0); // beware: month 0 = january, 11 = december
        var endDate = new Date($(this).attr('data-year'), parseInt($(this).attr('data-month')) - 1, parseInt($(this).attr('data-day')) + 1, 0, 0, 0, 0, 0);
        var success = function (message) {
          $.mobile.loading("hide");
          alert("Success: " + JSON.stringify(message));
        };
        var error = function (message) {
          $.mobile.loading("hide");
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

      $(document).on('click', '.sync-all', function (e) {
        $.mobile.loading("show");

        e.preventDefault();

        $('.sync-btn').each(function () {
          var startDate = new Date($(this).attr('data-year'), parseInt($(this).attr('data-month')) - 1, $(this).attr('data-day'), 0, 0, 0, 0, 0); // beware: month 0 = january, 11 = december
          var endDate = new Date($(this).attr('data-year'), parseInt($(this).attr('data-month')) - 1, parseInt($(this).attr('data-day')) + 1, 0, 0, 0, 0, 0);

          if (settings["syncCalendar"] == 1) {
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
          } else if (settings["syncCalendar"] == 2) {
            return false;
          } else if (settings["syncCalendar"] == 3) {
            var today = new Date();

            if (startDate >= today) {
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
            }
          }
        });
      });
    },

    getCalendarEvents: function (callback) {
      $.mobile.loading("show");
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
      $.mobile.loading("hide");
      console.log(data);

      var html = "";
      var settings = JSON.parse(localStorage.getItem("ekosfera_settings"));

      var by_date = _.groupBy(data, function (event) {
        var yyyy = parseInt(event["year"]), mm = parseInt(event["month"]);

        return mm + "/" + yyyy;
      });

      sortDates(Object.keys(by_date), "ASC").forEach(function (v, i) {
        html = "<li data-role='list-divider' role='heading' class='ui-li-divider ui-bar-inherit calendar-list-divider'>";
        html += numToNameDate(v);
        html += "</li>";
        _.each(by_date[v], function (value) {
          var year = value.year;
          var month = value.month;
          var day = value.day;
          var title = value.title;
          var location = "Ekosfera";
          var notes = value.short_description;
          var text = strip_tags(value.article, '<i><b><br><p>');
          var startDate = new Date(year, month - 1, day, 0, 0, 0, 0, 0); // beware: month 0 = january, 11 = december
          var today = new Date();

          if (settings["syncCalendar"] == 3 && startDate < today) {
            $(".calendar-list-divider").hide();
          }

          var arrowClass = '';
          if (text != '') {
            arrowClass = 'ui-icon-arrow-d ui-btn-icon-right';
          }

          if (settings["syncCalendar"] == 1) {
            html += "<li class='ui-li-has-alt ui-first-child'>";
            html += "<a href='#' class='ui-btn calendar-text-toggle " + arrowClass + "' data-id='" + value.id + "'>";
            html += "<div class='calendar-event truncated'>";
            html += "<h4>" + title + "</h4>";
            html += "<p>" + notes + "</p>";
            html += "</div>";
            html += "</a>";
            html += "<a href='#' class='ui-btn ui-btn-icon-right ui-icon-recycle sync-btn' data-corners='true' data-enhanced='true' value='Sync' data-year='" + year + "' data-month='" + month + "' data-day='" + day + "' data-title='" + title + "' data-location='" + location + "' data-notes='" + notes + "'>";
            html += "</a>";
            html += "</li>";
            if (text != '') {
              html += "<div class='calendar-text-outer' data-id='" + value.id + "'>";
              html += "<p class='calendar-text'>" + text + "</p>";
              html += "</div>";
            }
          } else if (settings["syncCalendar"] == 2) {
            html += "<li>";
            html += "<a href='#' class='ui-btn calendar-text-toggle " + arrowClass + "' data-id='" + value.id + "'>";
            html += "<p>" + day + "/" + month + "/" + year + "</p>";
            html += "<h4>" + title + "</h4>";
            html += "<p>" + notes + "</p>";
            html += "</div>";
            html += "</a>";
            html += "</li>";
            if (text != '') {
              html += "<div class='calendar-text-outer' data-id='" + value.id + "'>";
              html += "<p class='calendar-text'>" + text + "</p>";
              html += "</div>";
            }
          } else if (settings["syncCalendar"] == 3) {

            if (startDate >= today) {
              html += "<li class='ui-li-has-alt ui-first-child'>";
              html += "<a href='#' class='ui-btn calendar-text-toggle " + arrowClass + "' data-id='" + value.id + "'>";
              html += "<div class='calendar-event truncated'>";
              html += "<h4>" + title + "</h4>";
              html += "<p>" + notes + "</p>";
              html += "</div>";
              html += "</a>";
              html += "<a href='#' class='ui-btn ui-btn-icon-right ui-icon-recycle sync-btn' data-corners='true' data-enhanced='true' value='Sync' data-year='" + year + "' data-month='" + month + "' data-day='" + day + "' data-title='" + title + "' data-location='" + location + "' data-notes='" + notes + "'>";
              html += "</a>";
              html += "</li>";
              if (text != '') {
                html += "<div class='calendar-text-outer' data-id='" + value.id + "'>";
                html += "<p class='calendar-text'>" + text + "</p>";
                html += "</div>";
              }
            }
          }
        });
        $('.calendar-events > .events-list').append(html);
      });


      if (settings["syncCalendar"] == 1 || settings["syncCalendar"] == 3) {
        html = "<a href='#" + data.id + ".html' class='sync-all ui-btn ui-icon-recycle ui-btn-icon-right'>Усогласи ги сите</a>";
        $('.calendar-events > .events-list').prepend(html);
      }

      $('.calendar-events > .events-list > li:first').addClass("ui-first-child");
      $('.calendar-events > .events-list > li:last').addClass("ui-last-child");
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

    onSyncSuccess: function (message) {
      $.mobile.loading("hide");
      console.log("Success: " + JSON.stringify(message));
    },

    onSyncError: function (message) {
      $.mobile.loading("hide");
      console.log("Error: " + message);
    }

  };

  $(Core.sync_calendar.init);

  window.Core = Core;

})(jQuery);
