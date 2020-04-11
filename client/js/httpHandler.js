(function () {
  const serverUrl = 'http://127.0.0.1:3000';

  //
  // TODO: build the swim command fetcher here
  //

  /////////////////////////////////////////////////////////////////////
  // The ajax file uplaoder is provided for your convenience!
  // Note: remember to fix the URL below.
  /////////////////////////////////////////////////////////////////////

  var reqInterval = () => {
    $.get(serverUrl)
      .done((data) => console.log('data: ', data))
      .fail(console.log('test failed'));
  };

  let myInterval = setInterval(() => {
    var response = $.get(serverUrl);
    response.done((data) => SwimTeam.move(data));
    response.fail(() => {
      console.log('test failed');
    });
  }, 1000);

  const ajaxFileUplaod = (file) => {
    var formData = new FormData();
    formData.append('file', file);
    $.ajax({
      type: 'POST',
      data: formData,
      url: serverUrl,
      cache: false,
      contentType: false,
      processData: false,
      success: () => {
        $('.pool').removeClass('background');
        $('.pool').addClass('background');
        window.location = window.location.href;
      },
    });
  };

  $('form').on('submit', function (e) {
    e.preventDefault();

    var form = $('form .file')[0];
    if (form.files.length === 0) {
      console.log('No file selected!');
      return;
    }

    var file = form.files[0];
    if (
      file.type !== 'image/jpeg' &&
      file.type !== 'image/png' &&
      file.type !== 'image/gif'
    ) {
      console.log('Not a jpg, gif, or png file!');
      return;
    }

    ajaxFileUplaod(file);
  });
})();
