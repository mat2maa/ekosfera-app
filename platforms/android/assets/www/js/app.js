var app = {
  // Application Constructor
  initialize: function () {
    console.log("app/init");
    this.bindEvents();

    window.ua = navigator.userAgent.toLowerCase();
    window.isAndroid = ua.indexOf("android") > -1; //&& ua.indexOf("mobile");
    window.host = '';
    if (window.isAndroid) {
      window.host = 'www.ekosfera.mk';
    } else {
      window.host = 'www.ekosfera.mk';
    }
    console.log(host);
  },
  // Bind Event Listeners
  //
  // Bind any events that are required on startup. Common events are:
  // 'load', 'deviceready', 'offline', and 'online'.
  bindEvents: function () {
    console.log("app/bindEvents");

    document.addEventListener('deviceready', this.onDeviceReady, false);
    $.mobile.allowCrossDomainPages = true;
  },
  // deviceready Event Handler
  //
  // The scope of 'this' is the event. In order to call the 'receivedEvent'
  // function, we must explicity call 'app.receivedEvent(...);'
  onDeviceReady: function () {
    console.log("app/onDeviceReady");

    app.receivedEvent('deviceready');
    navigator.splashscreen.hide();

    checkConnection();
    document.addEventListener("resume", checkConnection, false);
    document.addEventListener("offline", checkConnection, false);
    document.addEventListener("online", checkConnection, false);

    document.addEventListener("backbutton", onBackKeyDown, false);

  },
  // Update DOM on a Received Event
  receivedEvent: function (id) {
    console.log("app/receivedEvent");
  }
};

function exitApp() {
  navigator.app.exitApp();
}

function checkConnection() {
  var networkState = navigator.connection.type;

  var states = {};
  states[Connection.UNKNOWN]  = 'Unknown connection';
  states[Connection.ETHERNET] = 'Ethernet connection';
  states[Connection.WIFI]     = 'WiFi connection';
  states[Connection.CELL_2G]  = 'Cell 2G connection';
  states[Connection.CELL_3G]  = 'Cell 3G connection';
  states[Connection.CELL_4G]  = 'Cell 4G connection';
  states[Connection.CELL]     = 'Cell generic connection';
  states[Connection.NONE]     = 'No network connection';

  if (states[networkState] == 'Unknown connection' || states[networkState] == 'Cell generic connection' || states[networkState] == 'No network connection') {
    $("#checkConnection").popup("open");
  } else {
    $("#checkConnection").popup("close");
  }
}

function openSettings() {
  window.plugins.webintent.startActivity({
      action: "android.settings.SETTINGS"
    },
    function () {
    },
    function () {
      $("#openSettings").popup("open");
    });
}

// Handle the back button
//
function onBackKeyDown(e) {
  try {
    var activePage = $.mobile.activePage.attr('id');

    if ($('#menu').hasClass('ui-panel-open')) {
      $('#menu').panel("close");
    } else if (activePage == 'HomePage' || activePage == 'login-page') {

      e.preventDefault();
      $("#exitApp").popup("open");
    } else if (activePage == 'show-campaign') {
      $("body").pagecontainer("change", "index_campaigns.html", {
        transition: "pop",
        reverse: true
      });
    } else if (activePage == 'show-news-post') {
      $("body").pagecontainer("change", "index_news_posts.html", {
        transition: "pop",
        reverse: true
      });
    } else if (activePage == 'show-petition') {
      $("body").pagecontainer("change", "index_petitions.html", {
        transition: "pop",
        reverse: true
      });
    } else if (activePage == 'show-survey') {
      $("body").pagecontainer("change", "index_surveys.html", {
        transition: "pop",
        reverse: true
      });
    } else {
      navigator.app.backHistory();
    }
  } catch (e) {
    console.log('Exception: ' + e, 3);
  }
}

function testPlugin() {
  var tests = {
    "bool-test": true,
    "false-test": false,
    "float-test": 123.456,
    "int-test": 1,
    "zero-test": 0,
    "string-test": "xxx",
    "empty-string-test": "xxx",
    "obj-test": {a: "b"},
    "arr-test": ["a", "b"],
    "empty-arr-test": []
  };

  var fail = 0;
  var pass = 0;

  var appp = plugins.appPreferences;
  for (var testK in tests) {
    (function (testName, testValue) {
      appp.store(function (ok) {
        pass++;
        appp.fetch(function (ok) {
          if (ok == testValue || (typeof testValue == "object" && JSON.stringify(ok) == JSON.stringify(testValue)))
            pass++;
          else {
            console.error('fetched incorrect value for ' + testName + ': expected ' + JSON.stringify(testValue) + ' got ' + JSON.stringify(ok));
            fail++;
          }
        }, function (err) {
          console.error('fetch value failed for ' + testName + ' and value ' + testValue);
          fail++;
        }, testName);
      }, function (err) {
        console.error('store value failed for ' + testName + ' and value ' + testValue);
        fail++;
      }, testName, testValue);
      appp.store(function (ok) {
        pass++;
        appp.fetch(function (ok) {
          if (ok == testValue || (typeof testValue == "object" && JSON.stringify(ok) == JSON.stringify(testValue)))
            pass++;
          else {
            console.error('fetched incorrect value for x' + testName + ': expected ' + JSON.stringify(testValue) + ' got ' + JSON.stringify(ok));
            fail++;
          }
        }, function (err) {
          console.error('fetch value failed for ' + "x" + testName + ' and value ' + testValue);
          fail++;
        }, "dict", "x" + testName);
      }, function (err) {
        console.error('store value failed for ' + "x" + testName + ' and value ' + testValue);
        fail++;
      }, "dict", "x" + testName, testValue);

    })(testK, tests[testK]);
  }

  setTimeout(function () {
    console.log(pass + ' tests passed');
    if (fail)
      console.error(fail + ' tests failed');
  }, 1000);
}
