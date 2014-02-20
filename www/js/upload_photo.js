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
    },

    photo: {

      get: function (source) {
        navigator.camera.getPicture(Core.upload.photo.onSuccess, Core.upload.photo.onFail,
          {
            quality: 50,
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

        image.appendTo('#photo_wrap');
      },

      onURISuccess: function (imageURI) {

        console.log(imageURI);

        var image = $("<img>", {
          'src': imageURI,
          'style': "width:60px;height:60px;"
        });

        image.appendTo('#photo_wrap');
      },

      onFail: function (message) {
        alert(message);
      }
    }

  };

  $(Core.upload.init);

  window.Core = Core;

})(jQuery);
