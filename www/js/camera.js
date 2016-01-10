function cameraRun() {
    console.log("camera launched");
    navigator.camera.getPicture(onSuccess, onFail, {
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL
    });
}

function onFail(message) {
        alert('Failed because: ' + message);
        console.log('failed '+ message);
    }

function onSuccess(imageDat) {
    console.log("called");
    var b64 = "data:image/jpeg;base64," + imageDat;
    $.post('https://api.cloudinary.com/v1_1/mole/image/upload', {
        file: b64,
        api_key: '838912264992939',
        timestamp: (Date.now() / 1000 | 0) + '',
        upload_preset: 'atdlnige'
    }, function (data) {
        if (data.hasOwnProperty('error')) {
            alert('Upload failed.');
            console.log("failure");
        } else {
            var urlOne = encodeURIComponent(data['url']);
            var url = encodeURIComponent(urlOne);
            alert("got URL "+ 'http://seblopezcot.pythonanywhere.com/?url='+data['url']);
           $.get('http://seblopezcot.pythonanywhere.com/?url='+data['url'], function(data){
                json = JSON.parse(data);
                localStorage.setItem('isbn', json.isbn + "");
                localStorage.setItem('title', json.title + "");
                localStorage.setItem('author', json.contributors[0] + "");
                localStorage.setItem('rating', json.rating + "");
                localStorage.setItem('imgurl', json.image_url + "");
                //window.location = 'results.html';
                alert("here");
           });

        }
    });
}