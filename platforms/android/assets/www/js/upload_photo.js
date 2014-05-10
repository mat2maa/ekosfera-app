(function ($) {

  var Core = window.Core || Core || {};

  Core.upload = {

    init: function () {
      Core.auth.requireSession();
      Core.ui.showView();
      Core.upload.bindEvents();
    },

    bindEvents: function () {
      $('#logout').on('click', function () {
        Core.auth.logout();
        return false;
      });

      $('#upload_photo').bind('click', function () {
        Core.upload.photo.getURI(pictureSource.PHOTOLIBRARY);
//        Core.upload.photo.get(pictureSource.SAVEDPHOTOALBUM);
        return false;
      });

      $('#upload_camera').bind('click', function () {
        Core.upload.photo.capture();
        return false;
      });

      $('#photo_uploader').on('submit', function () {
        Core.upload.photo.uploadPhoto($(this), $('#photo_wrap').find('img').attr('src'));
        return false;
      });

      $('#photo_submit').on('click', function () {
        var form_obj = $(this).closest('form');
        Core.upload.photo.uploadPhoto(form_obj, $('#photo_wrap').find('img').attr('src'));
        return false;
      });
    },

    photo: {

      get: function (source) {
        navigator.camera.getPicture(Core.upload.photo.onSuccess, Core.upload.photo.onFail, {
            quality: 50,
            destinationType: destinationType.FILE_URI,
            sourceType: source,
            correctOrientation: true
          }
        );
      },

      getURI: function (source) {
        navigator.camera.getPicture(Core.upload.photo.onURISuccess, Core.upload.photo.onFail, {
            quality: 50,
            destinationType: destinationType.FILE_URI,
            sourceType: source,
            correctOrientation: true
          }
        );
      },

      capture: function capturePhoto() {
        navigator.camera.getPicture(Core.upload.photo.onDataSuccess, Core.upload.photo.onFail, {
            quality: 50,
            correctOrientation: true
          }
        );
      },

      onDataSuccess: function (imageData) {

        console.log(imageData);

        var $img = $('<img/>');
        $img.attr('src', imageData);
        $img.css({position: 'relative', width: '100%', height: 'auto'});
        $('#photo_wrap').html($img);
        $.mobile.silentScroll($("#photo_wrap").offset().top);
      },

      onURISuccess: function (imageURI) {

        console.log(imageURI);

        var $img = $('<img/>');
        $img.attr('src', imageURI);
        $img.css({position: 'relative', width: '100%', height: 'auto'});
        $('#photo_wrap').html($img);
        $.mobile.silentScroll($("#photo_wrap").offset().top);
      },

      onFail: function (message) {
        alert(message);
      },

      uploadPhoto: function (form, imageURI) {
        $.mobile.loading("show");

        var options = new FileUploadOptions();
        options.fileKey = "file";
        options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1) + '.png';
        options.mimeType = "image/png";

        var params = {};
        params.caption = $('#caption').val();
        if (JSON.parse(localStorage.getItem("lon")) != null) {
          params.lon = JSON.parse(localStorage.getItem("lon"));
        }
        if (JSON.parse(localStorage.getItem("lat")) != null) {
          params.lat = JSON.parse(localStorage.getItem("lat"));
        }
        params.auth_token = Core.auth.authToken.get();

        console.log(params);

        options.params = params;

        var ft = new FileTransfer();
        console.log(ft);
        ft.upload(imageURI, encodeURI("http://" + host + "/api/photos"), Core.upload.photo.onUploadPhotoSuccess, Core.upload.photo.onUploadPhotoFail, options);
      },

      onUploadPhotoSuccess: function (data) {
        $.mobile.loading("hide");
        console.log(data);
        window.location = 'index_photos.html';
      },

      onUploadPhotoFail: function (data) {
        $.mobile.loading("hide");
        console.log("upload/onUploadPhotoFail");
        console.log("readyState: " + data.readyState);
        console.log("responseText: " + data.responseText);
        console.log("status: " + data.status);
        console.log("statusText: " + data.statusText);
        var error = JSON.parse(data.responseText);
        console.log(error);
        $('.error-msg').html("<div class='message'>" + error.message + "</div>");
      }
    }

  };

  $(Core.upload.init);

  window.Core = Core;

})(jQuery);
