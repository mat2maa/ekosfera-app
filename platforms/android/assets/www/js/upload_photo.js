(function ($) {

  var Core = window.Core || Core || {};

  Core.upload = {

    init: function () {
      Core.auth.requireSession();
      Core.ui.showView();
      Core.upload.bindEvents();
    },

    bindEvents: function () {
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
            sourceType: source
          }
        );
      },

      getURI: function (source) {
        navigator.camera.getPicture(Core.upload.photo.onURISuccess, Core.upload.photo.onFail, {
            quality: 50,
            destinationType: destinationType.FILE_URI,
            sourceType: source
          }
        );
      },

      capture: function capturePhoto() {
        navigator.camera.getPicture(Core.upload.photo.onDataSuccess, Core.upload.photo.onFail, {
            quality: 50
          }
        );
      },

      onDataSuccess: function (imageData) {

        console.log(imageData);

        var image = $("<img>", {
          'src': "data:image/jpeg;base64," + imageData,
          'style': "width:60px;height:60px;"
        });

        $('#photo_wrap').html(image);
      },

      onURISuccess: function (imageURI) {

        console.log(imageURI);

        var image = $("<img>", {
          'src': imageURI,
          'style': "width:60px;height:60px;"
        });

        $('#photo_wrap').html(image);
      },

      onFail: function (message) {
        alert(message);
      },

      uploadPhoto: function (form, imageURI) {
        var ua = navigator.userAgent.toLowerCase();
        var isAndroid = ua.indexOf("android") > -1; //&& ua.indexOf("mobile");
        var host = '';
        if (isAndroid) {
          host = '10.0.2.2';
        } else {
          host = 'localhost';
        }

        var options = new FileUploadOptions();
        options.fileKey = "file";
        options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1) + '.png';
        options.mimeType = "text/plain";

        var params = new Object();
        params.caption = $('#caption').val();
        params.auth_token = Core.auth.authToken.get();

        options.params = params;

        var ft = new FileTransfer();
        ft.upload(imageURI, encodeURI("http://" + host + ":3000/api/photos"), Core.upload.photo.onUploadPhotoSuccess, Core.upload.photo.onUploadPhotoFail, options);
      },

      onUploadPhotoSuccess: function (data) {
        console.log(data);
      },

      onUploadPhotoFail: function (data) {
        console.log(data);
      }

    }

  };

  $(Core.upload.init);

  window.Core = Core;

})(jQuery);
