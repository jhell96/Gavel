function cameraRun() {
  navigator.camera.getPicture(onSuccess, onFail, {
    quality: 50,
    destinationType: Camera.DestinationType.DATA_URL
    });
  }

function onFail(msg)
  {
  var errorMsg = JSON.parse(msg.responseText);
  if (errorMsg.Errors) {
    $('#subtext').html("There was an error :(")
    $('#wrapper').html("<p>Looks like " + errorMsg.Errors[0].Message + ".</p><a class='waves-effect waves-light btn' onclick='location.reload()'>Try again?</a>");
    console.log(JSON.stringify(kairosJSON, null, "\t"));
    }
  }

function onSuccess(imageDat) {
  var image_data = imageDat;
  image_data = String(image_data);
  image_data = image_data.replace("data:image/jpeg;base64,", "");
  image_data = image_data.replace("data:image/jpg;base64,", "");
  image_data = image_data.replace("data:image/png;base64,", "");
  image_data = image_data.replace("data:image/gif;base64,", "");
  image_data = image_data.replace("data:image/bmp;base64,", "");
  global_image_data = image_data;
  
  // pass your callback method to the Detect function
  $('#subtext').html("Getting your results!")
  $('#subtext').css("margin-bottom: 10px")
  $('#wrapper').html("<div class='preloader-wrapper big active' style='height: 50px; width: 50px;' id='1'><div class='spinner-layer spinner-blue-only'><div class='circle-clipper left'><div class='circle'></div></div><div class='gap-patch'><div class='circle'></div></div><div class='circle-clipper right'><div class='circle'></div></div></div></div>");
  
  //call todo something with image_data
}
