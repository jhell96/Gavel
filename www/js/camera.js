function cameraRun() {
    navigator.camera.getPicture(onSuccess, onFail, {
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL
    });
}

function onFail(msg) {
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
    image_data = image_data.replace("data:image/jpg;base64,", "");
    image_data = image_data.replace("data:image/png;base64,", "");
    image_data = image_data.replace("data:image/gif;base64,", "");
    image_data = image_data.replace("data:image/bmp;base64,", "");
    var b64 = "data:image/jpeg;base64," + image_data;
    console.log('start');
    $.post('https://api.cloudinary.com/v1_1/mole/image/upload', {
        file: b64,
        api_key: '838912264992939',
        timestamp: (Date.now() / 1000 | 0) + '',
        upload_preset: 'atdlnige'
    }, function (data) {
        if (data.hasOwnProperty('error')) {
            alert('Upload failed.');
        } else {
            var urlOne = encodeURIComponent(data['url']);
            var url = encodeURIComponent(urlOne);
            console.log(url);
           //get or post to server, on response, go to results
           //window.location = 'results.html';
           //localStorage.setItem('isbn', data['isbn'] + "");
           //localStorage.setItem('title', data['title'] + "");
           //localStorage.setItem('author', data['author'] + "");
           //localStorage.setItem('rating', data['rating'] + "");
           //localStorage.setItem('imgurl', data['image_url'] + "");
        }
    });
    //call todo something with image_data
}