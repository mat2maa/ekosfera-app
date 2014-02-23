var app = {
  // Application Constructor
  initialize: function() {
    console.log("app/init");
    this.bindEvents();
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
  },
  // Update DOM on a Received Event
  receivedEvent: function(id) {
    console.log("app/receivedEvent");
  }
};
