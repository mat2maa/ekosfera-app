var app = {
  // Application Constructor
  initialize: function() {
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
  bindEvents: function() {
    console.log("app/bindEvents");
    document.addEventListener('deviceready', this.onDeviceReady, false);
    $.mobile.allowCrossDomainPages = true;
  },
  // deviceready Event Handler
  //
  // The scope of 'this' is the event. In order to call the 'receivedEvent'
  // function, we must explicity call 'app.receivedEvent(...);'
  onDeviceReady: function() {
    console.log("app/onDeviceReady");
    app.receivedEvent('deviceready');
    var properties = 'Device Model: ' + device.model + '<br />' +
      'Device Cordova: ' + device.cordova + '<br />' +
      'Device Platform: ' + device.platform + '<br />' +
      'Device UUID: ' + device.uuid + '<br />' +
      'Device Version: ' + device.version + '<br />';
    console.log(properties);
  },
  // Update DOM on a Received Event
  receivedEvent: function(id) {
    console.log("app/receivedEvent");
  }
};
